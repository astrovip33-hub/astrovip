import { readFile, writeFile } from 'node:fs/promises';

const profilePath = 'despre-astrovip/index.html';
const html = await readFile(profilePath, 'utf8');

const replacements = [
  ['"dateCreated":"2026-09-23"', '"dateCreated":"2026-09-23T20:16:23+03:00"'],
  ['"dateModified":"2026-09-30"', '"dateModified":"2026-09-30T08:11:46+03:00"']
];

let updated = html;
for (const [from, to] of replacements) {
  if (!updated.includes(from) && !updated.includes(to)) {
    throw new Error(`Expected ProfilePage value not found: ${from}`);
  }
  updated = updated.replace(from, to);
}

if (updated !== html) {
  await writeFile(profilePath, updated, 'utf8');
  console.log('ProfilePage dateCreated/dateModified normalized to ISO 8601 DateTime.');
} else {
  console.log('ProfilePage DateTime values already valid.');
}
