import { build } from 'esbuild';
import { copyFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'assets', 'vendor');
const bundle = path.join(outDir, 'astrovip-swiss-koch.js');
const wasmSource = path.join(
  root,
  'node_modules',
  '@kuntay',
  'swisseph',
  'wasm',
  'swisseph.wasm',
);
const wasmTarget = path.join(outDir, 'swisseph.wasm');

await mkdir(outDir, { recursive: true });

await build({
  entryPoints: [path.join(root, 'assets', 'astro', 'swiss-browser-entry.js')],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  external: ['node:fs/promises', 'node:path', 'node:module'],
  outfile: bundle,
});

await copyFile(wasmSource, wasmTarget);

const [{ size: bundleSize }, { size: wasmSize }] = await Promise.all([
  stat(bundle),
  stat(wasmTarget),
]);

if (bundleSize < 1000) {
  throw new Error('Swiss Koch browser bundle was not generated correctly.');
}
if (wasmSize < 100000) {
  throw new Error('Swiss Ephemeris WASM asset is missing or unexpectedly small.');
}

console.log(`Swiss Koch bundle: ${bundleSize} bytes`);
console.log(`Swiss WASM asset: ${wasmSize} bytes -> assets/vendor/swisseph.wasm`);
