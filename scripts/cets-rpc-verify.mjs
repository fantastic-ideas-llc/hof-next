import fs from 'node:fs/promises';

const CETS = '0xb0c2ab5af4028461ace3f6e1c33a4ee1404e7777';
const XAUT = '0x21caef8a43163eea865baee23b9c2e327696a3bf';
const CANDIDATE = '0x93ef3f8d2c950ac30b9e018b52414dcf7d077e32';
const REFERENCE = '0x04b14ddf5d7fb69542c04b7f57f5179ffd9d57bd';
const DISTRIBUTOR = '0x25765fac1b94173bd60f0874a072dc4fa78fb3cf';
const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
const START_BLOCK = 114000000;
const END_BLOCK = 117700000;

const rpcUrls = [
  'https://bsc-rpc.publicnode.com',
  'https://bsc-dataseed.bnbchain.org',
  'https://bsc-dataseed.binance.org',
  'https://binance.llamarpc.com',
  'https://1rpc.io/bnb'
];

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
let rpcCursor = 0;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function rpc(method, params, attempts = 12) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const url = rpcUrls[(rpcCursor + attempt) % rpcUrls.length];
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(url, {
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
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${text.slice(0, 300)}`);
      const payload = JSON.parse(text);
      if (payload.error) throw new Error(JSON.stringify(payload.error));
      rpcCursor = (rpcCursor + attempt) % rpcUrls.length;
      clearTimeout(timer);
      return payload.result;
    } catch (error) {
      clearTimeout(timer);
      lastError = error;
      await sleep(Math.min(5000, 300 * 2 ** Math.min(attempt, 4)));
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
  let span = 100000;
  let successes = 0;

  while (cursor <= END_BLOCK) {
    const end = Math.min(END_BLOCK, cursor + span - 1);
    try {
      const page = await rpc('eth_getLogs', [{
        address,
        fromBlock: `0x${cursor.toString(16)}`,
        toBlock: `0x${end.toString(16)}`,
        topics
      }]);
      output.push(...page);
      console.log(`${label}: ${cursor}-${end}, ${page.length} logs, total ${output.length}`);
      cursor = end + 1;
      successes += 1;
      if (successes >= 3 && span < 200000) {
        span = Math.min(200000, Math.floor(span * 1.5));
        successes = 0;
      }
    } catch (error) {
      if (span <= 2500) throw error;
      span = Math.max(2500, Math.floor(span / 2));
      successes = 0;
      console.warn(`${label}: shrinking block span to ${span}`);
    }
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
  return Number(BigInt(value.timestamp));
}

async function attachTimestamps(events) {
  const blocks = [...new Set(events.map((event) => event.block))];
  const timestamps = new Map();
  for (let index = 0; index < blocks.length; index += 12) {
    const batch = blocks.slice(index, index + 12);
    const values = await Promise.all(batch.map(async (block) => [block, await blockTimestamp(block)]));
    for (const [block, timestamp] of values) timestamps.set(block, timestamp);
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
    if (event.from === wallet) balance -= event.value;
    if (event.to === wallet) balance += event.value;
    changes.push({ block: event.block, value: balance });
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

function rounded(value, places) {
  const factor = 10 ** places;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

await fs.mkdir('research-output', { recursive: true });

const walletTopics = [addressTopic(CANDIDATE), addressTopic(REFERENCE)];
const [cetsIn, cetsOut, xautIn, xautOut] = await Promise.all([
  logsFor(CETS, [TRANSFER_TOPIC, null, walletTopics], 'CETS incoming'),
  logsFor(CETS, [TRANSFER_TOPIC, walletTopics], 'CETS outgoing'),
  logsFor(XAUT, [TRANSFER_TOPIC, null, walletTopics], 'XAUT incoming'),
  logsFor(XAUT, [TRANSFER_TOPIC, walletTopics], 'XAUT outgoing')
]);

let cetsEvents = dedupe([...cetsIn, ...cetsOut]).map((log) => parseLog(log, CETS));
let xautEvents = dedupe([...xautIn, ...xautOut]).map((log) => parseLog(log, XAUT));
[cetsEvents, xautEvents] = await Promise.all([attachTimestamps(cetsEvents), attachTimestamps(xautEvents)]);

const referenceBalanceIntervals = intervalsForBalance(cetsEvents, REFERENCE)
  .filter((interval) => rounded(units(interval.value, 18), 3) === clearCard.balance);
const referencePayoutIntervals = intervalsForPayout(xautEvents, REFERENCE)
  .filter((interval) => rounded(units(interval.value, 6), 4) === clearCard.xaut);

const overlaps = [];
for (const balanceInterval of referenceBalanceIntervals) {
  for (const payoutInterval of referencePayoutIntervals) {
    const hit = overlap(balanceInterval, payoutInterval);
    if (hit) overlaps.push({ ...hit, balanceInterval, payoutInterval });
  }
}

let snapshot;
if (overlaps.length) {
  const scored = [];
  for (const hit of overlaps) {
    const block = Math.floor((hit.start + hit.end) / 2);
    const timestamp = await blockTimestamp(block);
    const distance = Math.abs(timestamp - Date.parse('2026-08-21T12:00:00Z') / 1000);
    scored.push({ ...hit, block, timestamp, distance });
  }
  scored.sort((a, b) => a.distance - b.distance);
  snapshot = scored[0];
} else {
  const block = 117250000;
  snapshot = { start: block, end: block, block, timestamp: await blockTimestamp(block), distance: null };
}

const candidateCetsRaw = apply(cetsEvents, CANDIDATE, snapshot.block);
const referenceCetsRaw = apply(cetsEvents, REFERENCE, snapshot.block);
const candidateXautRaw = xautEvents
  .filter((event) => event.block <= snapshot.block && event.from === DISTRIBUTOR && event.to === CANDIDATE)
  .reduce((sum, event) => sum + event.value, 0n);
const referenceXautRaw = xautEvents
  .filter((event) => event.block <= snapshot.block && event.from === DISTRIBUTOR && event.to === REFERENCE)
  .reduce((sum, event) => sum + event.value, 0n);

const candidateCets = units(candidateCetsRaw, 18);
const referenceCets = units(referenceCetsRaw, 18);
const candidateXaut = units(candidateXautRaw, 6);
const referenceXaut = units(referenceXautRaw, 6);
const expectedBalance = clearCard.balance * targetCard.weeklyUsd / clearCard.weeklyUsd;
const expectedXaut = targetCard.payoutUsd * clearCard.xaut / clearCard.payoutUsd;
const predictedWeekly = candidateCets * clearCard.weeklyUsd / clearCard.balance;
const predictedPayoutUsd = candidateXaut * clearCard.payoutUsd / clearCard.xaut;

const firstCandidate = firstPositive(cetsEvents, CANDIDATE);
const firstReference = firstPositive(cetsEvents, REFERENCE);
const candidateCode = await rpc('eth_getCode', [CANDIDATE, 'latest']);

const report = {
  generatedAt: new Date().toISOString(),
  range: { startBlock: START_BLOCK, endBlock: END_BLOCK },
  eventCounts: { cets: cetsEvents.length, xaut: xautEvents.length },
  calibration: {
    matchingBalanceIntervals: referenceBalanceIntervals.map((item) => ({ ...item, value: item.value.toString() })),
    matchingPayoutIntervals: referencePayoutIntervals.map((item) => ({ ...item, value: item.value.toString() })),
    overlapCount: overlaps.length,
    selectedSnapshot: {
      startBlock: snapshot.start,
      endBlock: snapshot.end,
      block: snapshot.block,
      timestamp: new Date(snapshot.timestamp * 1000).toISOString()
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
    cetsPercentError: Math.abs(candidateCets - expectedBalance) / expectedBalance * 100,
    predictedWeeklyUsd: predictedWeekly,
    cardWeeklyUsd: targetCard.weeklyUsd,
    xautFromDistributor: candidateXaut,
    expectedXaut,
    xautDifference: candidateXaut - expectedXaut,
    xautPercentError: Math.abs(candidateXaut - expectedXaut) / expectedXaut * 100,
    predictedPayoutUsd,
    cardPayoutUsd: targetCard.payoutUsd
  },
  reference: {
    address: REFERENCE,
    firstPositive: firstReference ? {
      block: firstReference.block,
      timestamp: new Date(firstReference.timestamp * 1000).toISOString(),
      txHash: firstReference.txHash
    } : null
  },
  rawEvents: {
    candidateCets: cetsEvents.filter((event) => event.from === CANDIDATE || event.to === CANDIDATE).map((event) => ({ ...event, value: event.value.toString(), timestamp: new Date(event.timestamp * 1000).toISOString() })),
    referenceCets: cetsEvents.filter((event) => event.from === REFERENCE || event.to === REFERENCE).map((event) => ({ ...event, value: event.value.toString(), timestamp: new Date(event.timestamp * 1000).toISOString() })),
    candidateXaut: xautEvents.filter((event) => event.from === CANDIDATE || event.to === CANDIDATE).map((event) => ({ ...event, value: event.value.toString(), timestamp: new Date(event.timestamp * 1000).toISOString() })),
    referenceXaut: xautEvents.filter((event) => event.from === REFERENCE || event.to === REFERENCE).map((event) => ({ ...event, value: event.value.toString(), timestamp: new Date(event.timestamp * 1000).toISOString() }))
  }
};

await fs.writeFile('research-output/cets-rpc-verification.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify({ calibration: report.calibration, candidate: report.candidate, reference: report.reference }, null, 2));
