import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';

await mkdir('assets/premium-v9/chunks', { recursive: true });

await build({
  entryPoints: {
    main: 'src/premium-v9/main.ts',
    client: 'src/premium-v9/client.ts',
    report: 'src/premium-v9/report.ts'
  },
  outdir: 'assets/premium-v9',
  entryNames: '[name]',
  chunkNames: 'chunks/[name]-[hash]',
  bundle: true,
  splitting: true,
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

console.log('Premium V9 main/client/report bundles built.');
