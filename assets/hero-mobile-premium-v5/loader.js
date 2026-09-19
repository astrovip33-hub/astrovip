(()=> {
  if (!window.matchMedia || !window.matchMedia("(max-width:820px)").matches) return;
  const img = document.getElementById("astrovipHeroImage");
  if (!img) return;
  const parts = [
    "/assets/hero-mobile-premium-v5/part-00.b64",
    "/assets/hero-mobile-premium-v5/part-01.b64",
    "/assets/hero-mobile-premium-v5/part-02.b64",
    "/assets/hero-mobile-premium-v5/part-03.b64",
    "/assets/hero-mobile-premium-v5/part-04.b64",
    "/assets/hero-mobile-premium-v5/part-05.b64",
    "/assets/hero-mobile-premium-v5/part-06.b64",
    "/assets/hero-mobile-premium-v5/part-07.b64",
    "/assets/hero-mobile-premium-v5/part-08.b64"
  ];
  Promise.all(parts.map(u => fetch(u,{cache:"force-cache"}).then(r => {
    if (!r.ok) throw new Error("Hero part failed: " + u);
    return r.text();
  }))).then(chunks => {
    img.src = "data:image/webp;base64," + chunks.join("").replace(/\s+/g,"");
    img.removeAttribute("srcset");
    img.dataset.premiumMobileHero = "loaded";
  }).catch(()=>{});
})();