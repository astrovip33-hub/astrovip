(()=>{
  'use strict';

  const BOOKING_ID='programari';
  const bookingWords=/program|consulta|book|appointment|reserv|cita|prenot|запис|консульта|احجز|استشارة|预约|咨询/i;

  const isProgramariHref=(href='')=>{
    const value=String(href).trim();
    return value==='#programari'||value==='/#programari'||/\/#programari$/.test(value);
  };

  const isBookingLink=(anchor)=>{
    if(!anchor)return false;
    const href=anchor.getAttribute('href')||'';
    const label=((anchor.textContent||'')+' '+(anchor.getAttribute('aria-label')||'')).trim();
    return isProgramariHref(href)||(/wa\.me\/40722128220/.test(href)&&bookingWords.test(label));
  };

  const revealBooking=()=>{
    const section=document.getElementById(BOOKING_ID);
    if(!section)return null;
    section.style.setProperty('display','block','important');
    section.style.setProperty('visibility','visible','important');
    section.style.setProperty('content-visibility','visible','important');
    section.style.setProperty('height','auto','important');
    section.style.setProperty('max-height','none','important');
    section.style.setProperty('scroll-margin-top','96px');
    return section;
  };

  const normalizeLinks=()=>{
    document.querySelectorAll('a[href]').forEach((anchor)=>{
      if(!isBookingLink(anchor))return;
      anchor.setAttribute('href','#programari');
      anchor.setAttribute('target','_self');
      anchor.style.setProperty('pointer-events','auto','important');
    });
  };

  const openBooking=()=>{
    const section=revealBooking();
    if(!section){
      if(location.pathname!=='/')location.assign('/#programari');
      return false;
    }
    if(location.hash!=='#programari')history.pushState(null,'','#programari');
    requestAnimationFrame(()=>section.scrollIntoView({behavior:'smooth',block:'start'}));
    return true;
  };

  const init=()=>{
    normalizeLinks();
    if(location.hash==='#programari')setTimeout(openBooking,0);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();

  window.addEventListener('pageshow',init);
  document.addEventListener('click',(event)=>{
    const anchor=event.target.closest&&event.target.closest('a[href]');
    if(!isBookingLink(anchor))return;
    event.preventDefault();
    event.stopPropagation();
    openBooking();
  },true);
})();
