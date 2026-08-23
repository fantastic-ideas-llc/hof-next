import fs from 'node:fs/promises';

const CETS = '0xb0c2ab5af4028461ace3f6e1c33a4ee1404e7777';
const XAUT = '0x21caef8a43163eea865baee23b9c2e327696a3bf';
const CANDIDATE = '0x93ef3f8d2c950ac30b9e018b52414dcf7d077e32';
const REFERENCE = '0x04b14ddf5d7fb69542c04b7f57f5179ffd9d57bd';
const DISTRIBUTOR = '0x25765fac1b94173bd60f0874a072dc4fa78fb3cf';
const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
const START_BLOCK = 114061828;
const END_BLOCK = 117316304;
const BLOCK_SPAN = 10000;
const PAGE_DELAY_MS = 1750;
const RPC_URL = 'https://rpc-bsc.blockmachine.io';

const clearCard = {
  balance: 1428968.605,
  weeklyUsd: 283.76,
  xaut: 0.0755,
  payoutUsd: 346.47
};
const targetCard = {
  weeklyUsd: 3087.37,
  payoutUsd: 5979.25,
  xautDisplay: 1.3,
  holdingDate: '2026-08-07'
};

let requestId = 0;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function rpc(method, params, attempts = 20) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    try {
      const response = await fetch(RPC_URL, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'user-agent': 'cets-public-chain-research/1.0'
        },
        body: JSON.stringify({ jsonrpc: '2.0', id: ++requestId, method, params }),
        signal: controller.signal
      });
      const text = await response.text();
      let payload;
      try {
        payload = JSON.parse(text);
      } catch {
        payload = null;
      }

      const rateLimited = response.status === 429 || payload?.error?.code === -32029;
      if (rateLimited) {
        const retryMs = Number(payload?.error?.data?.retry_after_ms ?? 5000);
        console.warn(`${method}: rate limited; sleeping ${retryMs + 1000}ms`);
        await sleep(retryMs + 1000);
        continue;
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${text.slice(0, 300)}`);
      if (!payload) throw new Error(`Invalid JSON: ${text.slice(0, 300)}`);
      if (payload.error) throw new Error(JSON.stringify(payload.error));
      return payload.result;
    } catch (error) {
      lastError = error;
      const waitMs = Math.min(10000, 500 + attempt * 750);
      console.warn(`${method}: ${error instanceof Error ? error.message : String(error)}; retrying in ${waitMs}ms`);
      await sleep(waitMs);
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error(`${method} failed: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}

function addressTopic(address) {
  return `0x${address.toLowerCase().replace(/^0x/, '').padStart(64, '0')}`;
}

function fromTopic(topic) {
  return `0x${topic.slice(-40).toLowerCase()}`;
}

function sortLogs(logs) {
  return logs.sort((a, b) =>
    Number(BigInt(a.blockNumber) - BigInt(b.blockNumber)) ||
    Number(BigInt(a.logIndex) - BigInt(b.logIndex))
  );
}

function dedupe(logs) {
  const map = new Map();
  for (const log of logs) map.set(`${log.transactionHash}:${log.logIndex}`, log);
  return sortLogs([...map.values()]);
}

async function logsFor(address, topics, label) {
  const output = [];
  let cursor = START_BLOCK;
  let pages = 0;

  while (cursor <= END_BLOCK) {
    const end = Math.min(END_BLOCK, cursor + BLOCK_SPAN - 1);
    const page = await rpc('eth_getLogs', [{
      address,
      fromBlock: `0x${cursor.toString(16)}`,
      toBlock: `0x${end.toString(16)}`,
      topics
    }]);
    output.push(...page);
    pages += 1;
    if (pages % 25 === 0 || page.length) {
      console.log(`${label}: page ${pages}, blocks ${cursor}-${end}, ${page.length} logs, total ${output.length}`);
    }
    cursor = end + 1;
    await sleep(PAGE_DELAY_MS);
  }
  return output;
}

function parseLog(log, token) {
  return {
    token,
    block: Number(BigInt(log.blockNumber)),
    logIndex: Number(BigInt(log.logIndex)),
    txHash: log.transactionHash,
    from: fromTopic(log.topics[1]),
    to: fromTopic(log.topics[2]),
    value: BigInt(log.data)
  };
}

async function blockTimestamp(block) {
  const value = await rpc('eth_getBlockByNumber', [`0x${block.toString(16)}`, false]);
  await sleep(750);
  return Number(BigInt(value.timestamp));
}

async function attachTimestamps(events) {
  const blocks = [...new Set(events.map((event) => event.block))];
  const timestamps = new Map();
  for (const block of blocks) {
    timestamps.set(block, await blockTimestamp(block));
  }
  return events.map((event) => ({ ...event, timestamp: timestamps.get(event.block) }));
}

function apply(events, wallet, endBlock) {
  let balance = 0n;
  for (const event of events) {
    if (event.block > endBlock) break;
    if (event.from === wallet) balance -= event.value;
    if (event.to === wallet) balance += event.value;
  }
  return balance;
}

function firstPositive(events, wallet) {
  let balance = 0n;
  for (const event of events) {
    const before = balance;
    if (event.from === wallet) balance -= event.value;
    if (event.to === wallet) balance += event.value;
    if (before <= 0n && balance > 0n) return event;
  }
  return null;
}

function intervalsForBalance(events, wallet) {
  let balance = 0n;
  const changes = [];
  for (const event of events) {
    let changed = false;
    if (event.from === wallet) {
      balance -= event.value;
      changed = true;
    }
    if (event.to === wallet) {
      balance += event.value;
      changed = true;
    }
    if (changed) changes.push({ block: event.block, value: balance });
  }
  return changes.map((change, index) => ({
    start: change.block,
    end: index + 1 < changes.length ? changes[index + 1].block - 1 : END_BLOCK,
    value: change.value
  }));
}

function intervalsForPayout(events, wallet) {
  let payout = 0n;
  const changes = [];
  for (const event of events) {
    if (event.from === DISTRIBUTOR && event.to === wallet) {
      payout += event.value;
      changes.push({ block: event.block, value: payout });
    }
  }
  return changes.map((change, index) => ({
    start: change.block,
    end: index + 1 < changes.length ? changes[index + 1].block - 1 : END_BLOCK,
    value: change.value
  }));
}

function overlap(a, b) {
  const start = Math.max(a.start, b.start);
  const end = Math.min(a.end, b.end);
  return start <= end ? { start, end } : null;
}

function units(raw, decimals) {
  const base = 10n ** BigInt(decimals);
  return Number(raw / base) + Number(raw % base) / Number(base);
}

function closeTo(value, expected, tolerance) {
  return Math.abs(value - expected) <= tolerance;
}

function serializeIntervals(items, decimals) {
  return items.map((item) => ({
    start: item.start,
    end: item.end,
    raw: item.value.toString(),
    value: units(item.value, decimals)
  }));
}

await fs.mkdir('research-output', { recursive: true });

const walletTopics = [addressTopic(CANDIDATE), addressTopic(REFERENCE)];
console.log('Scanning CETS incoming transfers...');
const cetsIn = await logsFor(CETS, [TRANSFER_TOPIC, null, walletTopics], 'CETS incoming');
console.log('Scanning CETS outgoing transfers...');
const cetsOut = await logsFor(CETS, [TRANSFER_TOPIC, walletTopics], 'CETS outgoing');
console.log('Scanning XAUT dividend transfers...');
const xautPayouts = await logsFor(
  XAUT,
  [TRANSFER_TOPIC, addressTopic(DISTRIBUTOR), walletTopics],
  'XAUT payouts'
);

let cetsEvents = dedupe([...cetsIn, ...cetsOut]).map((log) => parseLog(log, CETS));
let xautEvents = dedupe(xautPayouts).map((log) => parseLog(log, XAUT));
[cetsEvents, xautEvents] = await Promise.all([
  attachTimestamps(cetsEvents),
  attachTimestamps(xautEvents)
]);

const referenceBalanceIntervals = intervalsForBalance(cetsEvents, REFERENCE)
  .filter((interval) => closeTo(units(interval.value, 18), clearCard.balance, 0.0005));
const referencePayoutIntervals = intervalsForPayout(xautEvents, REFERENCE)
  .filter((interval) => closeTo(units(interval.value, 6), clearCard.xaut, 0.00005));

const calibrationOverlaps = [];
for (const balanceInterval of referenceBalanceIntervals) {
  for (const payoutInterval of referencePayoutIntervals) {
    const hit = overlap(balanceInterval, payoutInterval);
    if (hit) calibrationOverlaps.push({ ...hit, balanceInterval, payoutInterval });
  }
}

const expectedBalance = clearCard.balance * targetCard.weeklyUsd / clearCard.weeklyUsd;
const expectedXaut = targetCard.payoutUsd * clearCard.xaut / clearCard.payoutUsd;
const candidateBalanceIntervals = intervalsForBalance(cetsEvents, CANDIDATE);
const candidatePayoutIntervals = intervalsForPayout(xautEvents, CANDIDATE);
const candidateSegments = [];

for (const calibration of calibrationOverlaps) {
  for (const balanceInterval of candidateBalanceIntervals) {
    const balanceHit = overlap(calibration, balanceInterval);
    if (!balanceHit) continue;
    for (const payoutInterval of candidatePayoutIntervals) {
      const finalHit = overlap(balanceHit, payoutInterval);
      if (!finalHit) continue;
      const cets = units(balanceInterval.value, 18);
      const xaut = units(payoutInterval.value, 6);
      const cetsError = Math.abs(cets - expectedBalance) / expectedBalance;
      const xautError = Math.abs(xaut - expectedXaut) / expectedXaut;
      const midpoint = Math.floor((finalHit.start + finalHit.end) / 2);
      const blockTieBreaker = Math.abs(midpoint - 117250000) / 1e12;
      candidateSegments.push({
        ...finalHit,
        midpoint,
        cetsRaw: balanceInterval.value,
        xautRaw: payoutInterval.value,
        cets,
        xaut,
        cetsError,
        xautError,
        score: cetsError + xautError + blockTieBreaker
      });
    }
  }
}

candidateSegments.sort((a, b) => a.score - b.score);
let selectedSegment = candidateSegments[0];
if (!selectedSegment) {
  const fallbackBlock = 117250000;
  selectedSegment = {
    start: fallbackBlock,
    end: fallbackBlock,
    midpoint: fallbackBlock,
    cetsRaw: apply(cetsEvents, CANDIDATE, fallbackBlock),
    xautRaw: xautEvents
      .filter((event) => event.block <= fallbackBlock && event.to === CANDIDATE)
      .reduce((sum, event) => sum + event.value, 0n),
    score: null
  };
  selectedSegment.cets = units(selectedSegment.cetsRaw, 18);
  selectedSegment.xaut = units(selectedSegment.xautRaw, 6);
  selectedSegment.cetsError = Math.abs(selectedSegment.cets - expectedBalance) / expectedBalance;
  selectedSegment.xautError = Math.abs(selectedSegment.xaut - expectedXaut) / expectedXaut;
}

const snapshotBlock = selectedSegment.midpoint;
const snapshotTimestamp = await blockTimestamp(snapshotBlock);
const candidateCets = selectedSegment.cets;
const candidateXaut = selectedSegment.xaut;
const referenceCets = units(apply(cetsEvents, REFERENCE, snapshotBlock), 18);
const referenceXaut = units(
  xautEvents
    .filter((event) => event.block <= snapshotBlock && event.to === REFERENCE)
    .reduce((sum, event) => sum + event.value, 0n),
  6
);
const predictedWeekly = candidateCets * clearCard.weeklyUsd / clearCard.balance;
const predictedPayoutUsd = candidateXaut * clearCard.payoutUsd / clearCard.xaut;
const firstCandidate = firstPositive(cetsEvents, CANDIDATE);
const firstReference = firstPositive(cetsEvents, REFERENCE);
const candidateCode = await rpc('eth_getCode', [CANDIDATE, 'latest']);

const report = {
  generatedAt: new Date().toISOString(),
  provider: RPC_URL,
  range: {
    startBlock: START_BLOCK,
    endBlock: END_BLOCK,
    blockSpan: BLOCK_SPAN,
    pageDelayMs: PAGE_DELAY_MS
  },
  eventCounts: {
    cets: cetsEvents.length,
    xautPayouts: xautEvents.length
  },
  calibration: {
    matchingBalanceIntervals: serializeIntervals(referenceBalanceIntervals, 18),
    matchingPayoutIntervals: serializeIntervals(referencePayoutIntervals, 6),
    overlapCount: calibrationOverlaps.length,
    selectedSnapshot: {
      startBlock: selectedSegment.start,
      endBlock: selectedSegment.end,
      block: snapshotBlock,
      timestamp: new Date(snapshotTimestamp * 1000).toISOString(),
      segmentScore: selectedSegment.score
    },
    referenceCets,
    referenceXaut
  },
  candidate: {
    address: CANDIDATE,
    accountType: candidateCode === '0x' ? 'EOA' : 'contract',
    addressEndsIn2: CANDIDATE.endsWith('2'),
    firstPositive: firstCandidate ? {
      block: firstCandidate.block,
      timestamp: new Date(firstCandidate.timestamp * 1000).toISOString(),
      txHash: firstCandidate.txHash
    } : null,
    cets: candidateCets,
    expectedCets: expectedBalance,
    cetsDifference: candidateCets - expectedBalance,
    cetsPercentError: selectedSegment.cetsError * 100,
    predictedWeeklyUsd: predictedWeekly,
    cardWeeklyUsd: targetCard.weeklyUsd,
    weeklyUsdDifference: predictedWeekly - targetCard.weeklyUsd,
    xautFromDistributor: candidateXaut,
    expectedXaut,
    xautDifference: candidateXaut - expectedXaut,
    xautPercentError: selectedSegment.xautError * 100,
    predictedPayoutUsd,
    cardPayoutUsd: targetCard.payoutUsd,
    payoutUsdDifference: predictedPayoutUsd - targetCard.payoutUsd
  },
  reference: {
    address: REFERENCE,
    firstPositive: firstReference ? {
      block: firstReference.block,
      timestamp: new Date(firstReference.timestamp * 1000).toISOString(),
      txHash: firstReference.txHash
    } : null
  },
  topCandidateSegments: candidateSegments.slice(0, 20).map((segment) => ({
    startBlock: segment.start,
    endBlock: segment.end,
    midpoint: segment.midpoint,
    cets: segment.cets,
    xaut: segment.xaut,
    cetsPercentError: segment.cetsError * 100,
    xautPercentError: segment.xautError * 100,
    score: segment.score
  })),
  rawEvents: {
    candidateCets: cetsEvents
      .filter((event) => event.from === CANDIDATE || event.to === CANDIDATE)
      .map((event) => ({ ...event, value: event.value.toString(), timestamp: new Date(event.timestamp * 1000).toISOString() })),
    referenceCets: cetsEvents
      .filter((event) => event.from === REFERENCE || event.to === REFERENCE)
      .map((event) => ({ ...event, value: event.value.toString(), timestamp: new Date(event.timestamp * 1000).toISOString() })),
    candidateXaut: xautEvents
      .filter((event) => event.to === CANDIDATE)
      .map((event) => ({ ...event, value: event.value.toString(), timestamp: new Date(event.timestamp * 1000).toISOString() })),
    referenceXaut: xautEvents
      .filter((event) => event.to === REFERENCE)
      .map((event) => ({ ...event, value: event.value.toString(), timestamp: new Date(event.timestamp * 1000).toISOString() }))
  }
};

await fs.writeFile('research-output/cets-rpc-verification.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  calibration: report.calibration,
  candidate: report.candidate,
  reference: report.reference,
  topCandidateSegments: report.topCandidateSegments.slice(0, 5)
}, null, 2));
