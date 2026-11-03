export default { async fetch(request, env) {
 const path=new URL(request.url).pathname;
 if(!path.startsWith("/preview-essential-2100/") && path!=="/robots.txt")
   return new Response("AstroVip Essential 2100 — preview only",{status:404,headers:{"content-type":"text/plain; charset=utf-8","x-robots-tag":"noindex, nofollow, noarchive"}});
 if(path==="/robots.txt")return new Response("User-agent: *\nDisallow: /\n",{headers:{"content-type":"text/plain; charset=utf-8","x-robots-tag":"noindex"}});
 const response=await env.ASSETS.fetch(request);
 const headers=new Headers(response.headers);
 headers.set("x-robots-tag","noindex, nofollow, noarchive");
 headers.set("cache-control","public,max-age=60");
 return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}}