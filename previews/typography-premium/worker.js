import typography from './typography.css';

const controls = `<style>
#av-type-preview-ui{position:fixed;z-index:2147483646;bottom:max(10px,env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:5px;width:max-content;max-width:calc(100vw - 16px);padding:5px 7px;border:1px solid #b8954d;border-radius:16px;background:#0c100ef7;box-shadow:0 12px 40px #0008;color:#fff6dd;font:600 13px/1.2 Arial,sans-serif;box-sizing:border-box}
#av-type-preview-ui *{box-sizing:border-box;font-style:normal}#av-type-preview-ui>span{padding:0 6px;font-size:10px;letter-spacing:.1em;color:#d5b96e}#av-type-preview-ui button,#av-type-preview-ui summary{display:flex;align-items:center;justify-content:center;min-height:44px;padding:9px 12px;margin:0;border:1px solid transparent;border-radius:11px;background:transparent;color:#e2dbc9;font:700 13px/1 Arial,sans-serif;cursor:pointer;white-space:nowrap;list-style:none}
#av-type-preview-ui summary::-webkit-details-marker{display:none}#av-type-preview-ui button[aria-pressed="true"]{background:#e9ce86;color:#171207;border-color:#f7e9bf}#av-type-preview-ui details{position:relative}#av-type-preview-ui nav{position:absolute;bottom:calc(100% + 12px);right:-5px;display:grid;width:220px;padding:7px;border:1px solid #ad8b47;border-radius:14px;background:#0c100e;box-shadow:0 12px 40px #0008}#av-type-preview-ui a{padding:13px 12px;min-height:44px;color:#fff4d2;font:600 14px/1.3 Arial,sans-serif;text-decoration:none;border-radius:8px}#av-type-preview-ui a:hover{background:#24271d}#av-type-preview-ui button:focus-visible,#av-type-preview-ui summary:focus-visible,#av-type-preview-ui a:focus-visible{outline:2px solid #e9ce86;outline-offset:2px}
</style><aside id="av-type-preview-ui" aria-label="Preview tipografie AstroVip"><span>PREVIEW</span><button type="button" data-mode="current" aria-pressed="false">Actual</button><button type="button" data-mode="premium" aria-pressed="true">Premium</button><details><summary>Pagini ▴</summary><nav aria-label="Pagini de verificare"><a href="/">Acasă</a><a href="/consultatie-astrologica/">Consultație · H1, H2, H3</a><a href="/harta-natala/">Hartă natală · ghid</a><a href="/studii-de-caz/">Studii de caz</a></nav></details></aside><script>(()=>{const ui=document.getElementById('av-type-preview-ui');ui.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{document.documentElement.dataset.avTypePreview=b.dataset.mode;ui.querySelectorAll('[data-mode]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))}));})();</script>`;

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (!['GET','HEAD'].includes(request.method)) return new Response('Preview: read only.', {status:405});
    if (url.pathname === '/robots.txt') return new Response('User-agent: *\nDisallow: /\n', {headers:{'content-type':'text/plain'}});
    if (/^\/(?:api|command-center|chat-admin|client|report)(?:\/|$)/.test(url.pathname)) return new Response('Preview only.', {status:404});
    const upstream = new URL(url.pathname + url.search, 'https://astrovip.ro');
    const response = await fetch(upstream, {method:request.method, redirect:'manual', headers:{accept:request.headers.get('accept') || '*/*'}});
    const headers = new Headers(response.headers);
    headers.delete('set-cookie');
    headers.set('x-robots-tag','noindex, nofollow, noarchive');
    const location = headers.get('location');
    if (location?.startsWith('https://astrovip.ro')) headers.set('location',location.replace('https://astrovip.ro',url.origin));
    const type = headers.get('content-type') || '';
    if (!response.ok || !type.includes('text/html') || request.method === 'HEAD') return new Response(response.body,{status:response.status,headers});
    headers.set('cache-control','no-store');
    headers.set('x-astrovip-preview','typography-premium-20261018-v1');
    headers.set('content-security-policy',"script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; connect-src 'self'; frame-src 'none'; form-action 'none'");
    const html = new Response(response.body,{status:response.status,headers});
    return new HTMLRewriter()
      .on('html',{element(el){el.setAttribute('data-av-type-preview','premium')}})
      .on('meta[name="robots"]',{element(el){el.setAttribute('content','noindex,nofollow,noarchive')}})
      .on('#av-consent, #av-consent-manage',{element(el){el.remove()}})
      .on('head',{element(el){el.append('<style id="av-type-preview-styles">'+typography+'</style>',{html:true})}})
      .on('script[src]',{element(el){const src=el.getAttribute('src')||'';if(/^https?:/.test(src)&&!src.startsWith('https://astrovip.ro/'))el.remove()}})
      .on('a[href]',{element(el){const href=el.getAttribute('href')||'';if(href.startsWith('https://astrovip.ro/'))el.setAttribute('href',href.replace('https://astrovip.ro',''));}})
      .on('body',{element(el){el.append(controls,{html:true})}})
      .transform(html);
  }
};
