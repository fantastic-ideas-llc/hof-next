import fs from 'node:fs/promises';

const endpoint = 'https://bnbscan.com/api/v1/query';
const CETS = '0xb0c2ab5af4028461acE3f6e1c33a4ee1404e7777';
const XAUT = '0x21caef8a43163eea865baee23b9c2e327696a3bf';
const candidate = '0x93ef3f8d2c950ac30b9e018b52414dcf7d077e32';
const reference = '0x04b14ddf5d7fb69542c04b7f57f5179ffd9d57bd';

const queries = {
  candidateCets: {
    entity: 'token_transfers',
    filter: { address: candidate, tokenAddress: CETS },
    orderBy: 'asc',
    limit: 100,
    offset: 0
  },
  candidateXaut: {
    entity: 'token_transfers',
    filter: { address: candidate, tokenAddress: XAUT },
    orderBy: 'asc',
    limit: 100,
    offset: 0
  },
  referenceCets: {
    entity: 'token_transfers',
    filter: { address: reference, tokenAddress: CETS },
    orderBy: 'asc',
    limit: 100,
    offset: 0
  },
  referenceXaut: {
    entity: 'token_transfers',
    filter: { address: reference, tokenAddress: XAUT },
    orderBy: 'asc',
    limit: 100,
    offset: 0
  }
};

await fs.mkdir('research-output', { recursive: true });
const output = { generatedAt: new Date().toISOString(), endpoint, results: {} };

for (const [name, body] of Object.entries(queries)) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'user-agent': 'cets-public-chain-research/1.0'
      },
      body: JSON.stringify(body)
    });
    const text = await response.text();
    let parsed = text;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Keep plain text for diagnostics.
    }
    output.results[name] = { ok: response.ok, status: response.status, body: parsed };
    console.log(`${name}: HTTP ${response.status}, ${text.length} bytes`);
  } catch (error) {
    output.results[name] = {
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    };
    console.error(`${name}: ${output.results[name].error}`);
  }
}

await fs.writeFile('research-output/cets-bnbscan-probe.json', JSON.stringify(output, null, 2));
