import fs from 'node:fs/promises';

const endpoints = [
  'https://bnb.api.onfinality.io/public',
  'https://bsc-rpc.blockreq.com/v1/rpc/public',
  'https://rpc.nodeflare.app/bnb/public',
  'https://rpc-bsc.blockmachine.io',
  'https://rpc.ankr.com/bsc',
  'https://bsc.drpc.org',
  'https://bsc.blockpi.network/v1/rpc/public'
];
const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
const candidateTopic = '0x00000000000000000000000093ef3f8d2c950ac30b9e018b52414dcf7d077e32';
const token = '0xb0c2ab5af4028461ace3f6e1c33a4ee1404e7777';

async function test(url, fromBlock, toBlock, label) {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: label,
        method: 'eth_getLogs',
        params: [{
          address: token,
          fromBlock: `0x${fromBlock.toString(16)}`,
          toBlock: `0x${toBlock.toString(16)}`,
          topics: [transferTopic, null, candidateTopic]
        }]
      }),
      signal: controller.signal
    });
    const text = await response.text();
    let body = text;
    try { body = JSON.parse(text); } catch {}
    return { url, label, fromBlock, toBlock, elapsedMs: Date.now() - started, status: response.status, body };
  } catch (error) {
    return { url, label, fromBlock, toBlock, elapsedMs: Date.now() - started, error: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timer);
  }
}

const output = { generatedAt: new Date().toISOString(), tests: [] };
for (const url of endpoints) {
  output.tests.push(await test(url, 117200000, 117299999, '100k'));
  output.tests.push(await test(url, 114061828, 117316304, 'full'));
}
await fs.mkdir('research-output', { recursive: true });
await fs.writeFile('research-output/cets-rpc-capability.json', JSON.stringify(output, null, 2));
for (const result of output.tests) {
  const summary = typeof result.body === 'object' && result.body !== null
    ? (Array.isArray(result.body.result) ? `logs=${result.body.result.length}` : `error=${JSON.stringify(result.body.error ?? result.body).slice(0, 180)}`)
    : `body=${String(result.body ?? result.error).slice(0, 180)}`;
  console.log(`${result.url} ${result.label}: ${summary}, ${result.elapsedMs}ms`);
}
