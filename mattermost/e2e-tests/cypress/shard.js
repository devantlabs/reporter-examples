#!/usr/bin/env node
// Splits all @prod Cypress spec files into N chunks for parallel GHA workers.
// Usage: node shard.js <workers>
// Output: GitHub Actions output format — `matrix=<JSON>`
//
// Each chunk: { index: N, specs: "path/a.ts,path/b.ts,..." }

const { execSync } = require('child_process');
const workers = parseInt(process.argv[2] || '20', 10);

const files = execSync(
  'grep -rlE "Stage:.*@prod|@prod" tests/integration 2>/dev/null | sort',
  { encoding: 'utf8' }
).trim().split('\n').filter(Boolean);

console.error(`Sharding ${files.length} @prod specs across ${workers} workers`);

const chunks = [];
const size = Math.ceil(files.length / workers);
for (let i = 0; i < workers; i++) {
  const chunk = files.slice(i * size, (i + 1) * size);
  if (chunk.length > 0) {
    chunks.push({ index: i + 1, specs: chunk.join(',') });
  }
}

// Write GitHub Actions output
process.stdout.write(`matrix=${JSON.stringify(chunks)}\n`);
