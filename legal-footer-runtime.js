export const LEGAL_LINKS = '<a href="/termeni-si-conditii/">Termeni</a><a href="/politica-confidentialitate/">Confidențialitate</a><a href="/politica-cookie/">Cookies</a><a href="https://anpc.ro/" target="_blank" rel="noopener noreferrer">ANPC</a><a href="https://reclamatiisal.anpc.ro/" target="_blank" rel="noopener noreferrer">SAL</a><a href="/retragere-din-contract/">Retragere din contract</a>';
export const OPERATOR_DETAILS = '<p><strong>Operator AstroVip: SMARANDA CRISTIAN-CĂTĂLIN PFA</strong> · CUI 50191527 · RC F40/4169/06.06.2024</p><p>Sediu profesional: Str. Sold. Zambilă Ioniță nr. 1, bl. 33A, sc. D, et. 3, ap. 183, sector 2, București, România · <a href="mailto:contact@astrovip.ro">contact@astrovip.ro</a> · <a href="tel:+40722128220">0722 128 220</a></p>';

export function addLegalFooter(rewriter, pathname) {
  if (/^\/(?:command-center|chat-admin|api|widget-planete|preview)(?:\/|\.|$)/.test(pathname)) return rewriter;
  // These pages own an accessible, static legal footer and need no extra wrapper.
  if (/^\/(?:termeni-si-conditii|retragere-din-contract)\//.test(pathname)) return rewriter;
  let appended = false;
  return rewriter
    .on('head', {element(el) {el.append('<link rel="stylesheet" href="/assets/legal-premium-20261028.css">', {html: true});}})
    .on('.avf-legal nav', {element(el) {el.setInnerContent(LEGAL_LINKS + '<button type="button" class="av-consent__manage" id="av-consent-manage" hidden>Setări cookie</button>', {html: true});}})
    .on('footer', {element(el) {
      if (appended || el.getAttribute('data-legal-footer') !== null) return;
      appended = true;
      const orbit = (el.getAttribute('class') || '').split(/\s+/).includes('avf-footer');
      const nav = orbit ? '' : `<nav aria-label="Informații legale AstroVip">${LEGAL_LINKS}</nav>`;
      el.append(`<div class="av-legal-sitebar" lang="ro" data-legal-operator>${OPERATOR_DETAILS}${nav}</div>`, {html: true});
    }});
}
