import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';

await mkdir('assets/premium-v9', { recursive: true });

await build({
  entryPoints: ['src/premium-v9/main.ts'],
  outfile: 'assets/premium-v9/main.js',
  bundle: true,
  minify: true,
  format: 'esm',
  target: ['es2022'],
  legalComments: 'none',
  treeShaking: true,
  sourcemap: false,
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});

console.log('Premium V9 bundle built.');
