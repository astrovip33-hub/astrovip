(() => {
  'use strict';
  const production = location.hostname === 'astrovip.ro' || location.hostname === 'www.astrovip.ro';
  if (!production) document.querySelectorAll('[data-legal-preview]').forEach(el => el.classList.add('is-preview'));
  document.querySelectorAll('[data-legal-print]').forEach(button => button.addEventListener('click', () => window.print()));
  const form = document.getElementById('av-withdrawal-form');
  if (!form) return;
  const review = document.getElementById('av-withdrawal-review');
  const status = document.getElementById('av-withdrawal-status');
  const confirm = document.getElementById('av-withdrawal-confirm');
  const edit = document.getElementById('av-withdrawal-edit');
  const receiptLink = document.getElementById('av-withdrawal-receipt');
  function newReference() {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
  }
  let submission;
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    submission = {name: data.get('name').trim(), email: data.get('email').trim(), contract: data.get('contract').trim(), website: data.get('website'), requestId: newReference()};
    document.getElementById('av-withdrawal-summary').textContent = `Nume: ${submission.name}\nEmail: ${submission.email}\nContract: ${submission.contract}\n\nVă informez prin prezenta că mă retrag din contractul de servicii identificat mai sus.`;
    form.hidden = true;
    review.hidden = false;
    status.textContent = '';
    document.getElementById('av-withdrawal-review-title').focus();
  });
  edit.addEventListener('click', () => {
    review.hidden = true;
    form.hidden = false;
    status.textContent = '';
    form.querySelector('input').focus();
  });
  confirm.addEventListener('click', async () => {
    if (!submission || confirm.disabled) return;
    if (!production) {
      status.textContent = 'Previzualizare verificată. Nu s-a transmis nicio declarație și nu s-a trimis niciun email. Fluxul real va fi activat după configurarea și testarea confirmărilor.';
      status.focus();
      return;
    }
    confirm.disabled = true;
    edit.disabled = true;
    status.removeAttribute('data-error');
    status.textContent = 'Se transmite declarația…';
    try {
      const response = await fetch('/api/retragere-din-contract', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(submission), signal: AbortSignal.timeout(25000)});
      const data = await response.json();
      if (!response.ok || !data.ok || !data.receipt) throw new Error('submission_failed');
      const blobUrl = URL.createObjectURL(new Blob([data.receipt], {type: 'text/plain;charset=utf-8'}));
      receiptLink.href = blobUrl;
      receiptLink.download = `astrovip-retragere-${submission.requestId}.txt`;
      receiptLink.hidden = false;
      review.hidden = true;
      status.textContent = `Declarația a fost primită pentru procesare. Referință: ${submission.requestId}.\nConfirmarea a fost transmisă pentru expediere la ${submission.email}. Păstrează și dovada de mai jos. Dacă emailul nu ajunge, contactează contact@astrovip.ro.`;
      status.focus();
    } catch {
      status.setAttribute('data-error', 'true');
      status.textContent = 'Nu am putut confirma primirea declarației. Poți reîncerca sau trimite acum declarația la contact@astrovip.ro. Nu afișăm această încercare ca retragere confirmată; păstrează dovada comunicării. Dacă ai primit deja o confirmare prin email, aceasta rămâne valabilă.';
      confirm.disabled = false;
      edit.disabled = false;
      status.focus();
    }
  });
})();
