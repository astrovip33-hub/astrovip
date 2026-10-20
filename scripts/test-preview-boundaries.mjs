import test from 'node:test';
import assert from 'node:assert/strict';
import previewWorker from '../worker-preview-repair.js';

test('homepage repair never injects payment markup into the Marketing OS preview',async()=>{
  const html='<!doctype html><html><head><title>AstroVip Command Center V11</title></head><body><section>Private workspace</section></body></html>';
  const response=await previewWorker.fetch(new Request('https://astrovip-preview-ux-compact.astrovip33.workers.dev/command-center/?preview=1'),{ASSETS:{fetch:async()=>new Response(html,{headers:{'content-type':'text/html; charset=utf-8'}})}});
  assert.equal(response.status,200);
  assert.equal(await response.text(),html);
});
