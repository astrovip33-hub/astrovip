import { readFile, writeFile } from 'node:fs/promises';

const profilePath = 'despre-astrovip/index.html';
const html = await readFile(profilePath, 'utf8');

const replacements = [
  ['"dateCreated":"2026-09-23"', '"dateCreated":"2026-09-23T20:16:23+03:00"'],
  ['"dateModified":"2026-09-30"', '"dateModified":"2026-09-30T08:11:46+03:00"']
];

let updated = html;
for (const [from, to] of replacements) {
  if (updated.includes(from)) {
    updated = updated.replace(from, to);
    continue;
  }
  // A later content edit may already supply a valid DateTime. Preserve it
  // instead of requiring the historical timestamp from September.
  const property = from.match(/^"([^"]+)"/)[1];
  const value = updated.match(new RegExp('"' + property + '"\\s*:\\s*"([^"]+)"'))?.[1];
  if (!value || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) || !Number.isFinite(Date.parse(value))) {
    throw new Error('Invalid or missing ProfilePage DateTime: ' + property);
  }
}

if (updated !== html) {
  await writeFile(profilePath, updated, 'utf8');
  console.log('ProfilePage dateCreated/dateModified normalized to ISO 8601 DateTime.');
} else {
  console.log('ProfilePage DateTime values already valid.');
}
