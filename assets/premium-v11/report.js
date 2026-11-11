import{d as i}from"./chunks/chunk-5PWPCO7K.js";var d=["Berbec","Taur","Gemeni","Rac","Leu","Fecioar\u0103","Balan\u021B\u0103","Scorpion","S\u0103get\u0103tor","Capricorn","V\u0103rs\u0103tor","Pe\u0219ti"];function r(n){return String(n??"").replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]||t)}function s(n){let t=(Number(n)%360+360)%360,e=Math.floor(t/30),a=Math.floor(t%30),o=Math.floor((t%30-a)*60);return`${a}\xB0${String(o).padStart(2,"0")}\u2032 ${d[e]}`}function p(){try{return JSON.parse(sessionStorage.getItem("av_report_payload")||"null")}catch{return null}}function u(n){let t=n.chart,e=n.input||{},a=document.querySelector("#report-content");!a||!t||(a.innerHTML=`
    <section class="r-head">
      <div><div class="r-kicker">ASTROVIP \xB7 RAPORT PERSONAL</div><h1>Hart\u0103 natal\u0103 \xB7 Swiss Ephemeris</h1><p>Document generat din motorul interactiv AstroVip. Zodiac tropical \xB7 case Koch.</p></div>
      <div class="r-mark">AV</div>
    </section>
    <section class="r-meta">
      <div><span>Data</span><strong>${r(e.date)}</strong></div>
      <div><span>Ora local\u0103</span><strong>${r(e.time)} ${r(e.utcOffset)}</strong></div>
      <div><span>Loc</span><strong>${r(e.place||"\u2014")}</strong></div>
      <div><span>Coordonate</span><strong>${r(e.lat)}, ${r(e.lon)}</strong></div>
    </section>
    <section class="r-grid">
      <article><h2>Pozi\u021Bii planetare</h2>${(t.planets||[]).map(o=>`<div class="r-row"><b>${r(o.glyph||"")} ${r(o.label)}</b><span>${r(s(o.longitude))}${o.retrograde?" \u211E":""}</span></div>`).join("")}</article>
      <article><h2>Cuspide Koch</h2>${(t.cusps||[]).map((o,l)=>`<div class="r-row"><b>Casa ${l+1}</b><span>${r(s(o))}</span></div>`).join("")}</article>
    </section>
    <section class="r-note"><strong>Not\u0103 metodologic\u0103</strong><p>Acest document con\u021Bine rezultate de calcul astrologic. Interpretarea profesional\u0103 presupune corelarea pozi\u021Biilor, caselor, axelor \u0219i aspectelor \xEEntr-o analiz\u0103 coerent\u0103.</p></section>
    <footer>AstroVip \xB7 astrovip.ro \xB7 Premium Astrology Platform V9</footer>`)}function c(){let n=p(),t=document.querySelector("#report-empty"),e=document.querySelector("#report-actions");if(!n?.chart){t?.removeAttribute("hidden"),e?.setAttribute("hidden","");return}u(n),t?.setAttribute("hidden",""),e?.removeAttribute("hidden"),document.querySelector("#print-report")?.addEventListener("click",()=>{i("report_print_pdf"),window.print()}),i("report_view")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",c,{once:!0}):c();
