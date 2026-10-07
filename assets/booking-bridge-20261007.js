(() => {
  'use strict';
  const BOOKING_ID='programari';
  const bookingWords=/program|consulta|book|appointment|reserv|cita|prenot|запис|консульта|احجز|استشارة|预约|咨询/i;
  const isProgramariHref=(href='') => {
    try {
      const url=new URL(href,location.href);
      return (url.origin===location.origin || url.hostname==='astrovip.ro' || url.hostname==='www.astrovip.ro') && url.hash==='#programari';
    } catch {return false;}
  };
  const isBookingLink=anchor => {
    if (!anchor) return false;
    const href=anchor.getAttribute('href') || '';
    const label=(anchor.textContent || '')+' '+(anchor.getAttribute('aria-label') || '');
    return isProgramariHref(href) || (/wa\.me\/40722128220/.test(href) && bookingWords.test(label));
  };
  const revealBooking=() => {
    const section=document.getElementById(BOOKING_ID);
    if (!section) return null;
    for (const [property,value] of Object.entries({display:'block',visibility:'visible','content-visibility':'visible',height:'auto','max-height':'none'})) section.style.setProperty(property,value,'important');
    section.style.setProperty('scroll-margin-top','140px');
    return section;
  };
  const normalizeLinks=() => {
    const destination=document.getElementById(BOOKING_ID) ? '#programari' : '/#programari';
    document.querySelectorAll('a[href]').forEach(anchor => {
      if (!isBookingLink(anchor)) return;
      if (anchor.getAttribute('href')!==destination) anchor.setAttribute('href',destination);
      anchor.setAttribute('target','_self');
    });
  };
  const openBooking=() => {
    const section=revealBooking();
    if (!section) return false;
    if (location.hash!=='#programari') history.pushState(null,'','#programari');
    requestAnimationFrame(() => {
      section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});
      const title=section.querySelector('h2');
      if (title) {title.tabIndex=-1;title.focus({preventScroll:true});}
    });
    return true;
  };
  const init=() => {
    normalizeLinks();
    if (location.hash==='#programari') openBooking();
    const heroButton=document.querySelector('.av-hero-v2-secondary');
    if (heroButton) new MutationObserver(normalizeLinks).observe(heroButton,{attributes:true,attributeFilter:['href']});
  };
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
  window.addEventListener('pageshow',() => {normalizeLinks();if(location.hash==='#programari')openBooking();});
  window.addEventListener('hashchange',() => {if(location.hash==='#programari')openBooking();});
  document.addEventListener('astrovip:editor-config',normalizeLinks);
  document.addEventListener('click',event => {
    if (event.defaultPrevented || event.button>0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor=event.target.closest?.('a[href]');
    if (!isBookingLink(anchor)) return;
    normalizeLinks();
    if (openBooking()) event.preventDefault();
    // Continue propagation so navigation can close its menu and release scroll lock.
  },true);
})();
