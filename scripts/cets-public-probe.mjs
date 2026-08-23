import fs from 'node:fs/promises';

const endpoints = {
  routescanHolders: 'https://api.routescan.io/v2/network/mainnet/evm/56/erc20/0xB0c2aB5af4028461acE3f6e1C33a4eE1404E7777/holders?limit=100',
  honeypotHolders: 'https://api.honeypot.is/v1/TopHolders?address=0xB0c2aB5af4028461acE3f6e1C33a4eE1404E7777&chainID=56',
  candidateTransfers: 'https://api.routescan.io/v2/network/mainnet/evm/56/address/0x93EF3f8D2C950Ac30B9e018B52414DCf7D077E32/erc20-transfers?sort=asc&limit=100',
  referenceTransfers: 'https://api.routescan.io/v2/network/mainnet/evm/56/address/0x04b14ddf5d7fb69542c04b7f57f5179ffd9d57bd/erc20-transfers?sort=asc&limit=100'
};

await fs.mkdir('research-output', { recursive: true });
const output = { generatedAt: new Date().toISOString(), results: {} };

for (const [name, url] of Object.entries(endpoints)) {
  try {
    const response = await fetch(url, {
      headers: {
        accept: 'application/json',
        'user-agent': 'cets-public-chain-research/1.0'
      }
    });
    const text = await response.text();
    let body = text;
    try {
      body = JSON.parse(text);
    } catch {
      // Keep the returned text for diagnostics.
    }
    output.results[name] = {
      ok: response.ok,
      status: response.status,
      finalUrl: response.url,
      body
    };
    console.log(`${name}: HTTP ${response.status}, ${text.length} bytes`);
  } catch (error) {
    output.results[name] = {
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    };
    console.error(`${name}: ${output.results[name].error}`);
  }
}

await fs.writeFile('research-output/cets-public-probe.json', JSON.stringify(output, null, 2));
