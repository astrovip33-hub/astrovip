import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';

await mkdir('assets/premium-v11/chunks', { recursive: true });

await build({
  entryPoints: {
    main: 'src/premium-v11/main.ts',
    client: 'src/premium-v11/client.ts',
    report: 'src/premium-v11/report.ts',
    booking: 'src/premium-v11/booking.ts'
  },
  outdir: 'assets/premium-v11',
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

console.log('Premium V11 main/client/report/booking bundles built.');

