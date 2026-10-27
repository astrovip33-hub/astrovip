(()=>{
  'use strict';
  const ASSET='/assets/case-invatator-img-20261027.txt?v=20261027-teacher-preview4';
  let objectUrl='';
  const apply=()=>{
    if(!objectUrl)return;
    document.querySelectorAll('#studii-de-caz-home .av-case-teacher img').forEach(img=>{
      if(img.src!==objectUrl){
        img.src=objectUrl;
        img.removeAttribute('srcset');
        img.decoding='async';
      }
    });
  };
  const watch=()=>{
    const root=document.getElementById('studii-de-caz-home')||document.documentElement;
    const obs=new MutationObserver(apply);
    obs.observe(root,{childList:true,subtree:true});
    document.addEventListener('astrovip:cases-expanded',apply);
    apply();
  };
  fetch(ASSET,{cache:'no-store'})
    .then(r=>{if(!r.ok)throw new Error('teacher image '+r.status);return r.text()})
    .then(b64=>{
      const bin=atob(b64.trim());
      const bytes=new Uint8Array(bin.length);
      for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
      objectUrl=URL.createObjectURL(new Blob([bytes],{type:'image/webp'}));
      let style=document.getElementById('av-teacher-image-fix-style');
      if(!style){style=document.createElement('style');style.id='av-teacher-image-fix-style';document.head.appendChild(style)}
      style.textContent=`
        #studii-de-caz-home .av-case-teacher .av-case-showcase-visual,
        #studii-de-caz-home .av-case-teacher .av-case-local-space-visual{
          position:relative!important;
          overflow:hidden!important;
          background:#f5e7a8!important;
          isolation:isolate!important;
        }
        #studii-de-caz-home .av-case-teacher .av-case-showcase-visual::before,
        #studii-de-caz-home .av-case-teacher .av-case-showcase-visual::after,
        #studii-de-caz-home .av-case-teacher .av-case-local-space-visual::before,
        #studii-de-caz-home .av-case-teacher .av-case-local-space-visual::after{
          content:none!important;
          display:none!important;
          opacity:0!important;
          background:none!important;
          filter:none!important;
        }
        #studii-de-caz-home .av-case-teacher .av-case-showcase-visual img,
        #studii-de-caz-home .av-case-teacher .av-case-local-space-visual img,
        #studii-de-caz-home .av-case-mobile-ticker .av-case-teacher img,
        #studii-de-caz-home .av-case-desktop-marquee-v9 .av-case-teacher img{
          position:relative!important;
          z-index:2!important;
          display:block!important;
          width:100%!important;
          height:100%!important;
          max-width:none!important;
          object-fit:cover!important;
          object-position:center 18%!important;
          opacity:1!important;
          visibility:visible!important;
          filter:none!important;
          mix-blend-mode:normal!important;
          transform:none!important;
          background:transparent!important;
        }
        #studii-de-caz-home .av-case-teacher .av-case-local-space-symbol,
        #studii-de-caz-home .av-case-teacher .av-case-local-space-index{
          z-index:6!important;
        }
      `;
      watch();
    })
    .catch(err=>console.error('[AstroVip teacher image]',err));
})();