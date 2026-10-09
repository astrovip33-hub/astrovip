import { currentUser, loadBirthProfiles, saveBirthProfile, sendMagicLink, signOut, track } from './data';

const $ = <T extends Element>(selector: string) => document.querySelector<T>(selector);

function status(message: string, tone: 'ok'|'warn'|'error' = 'ok') {
  const node = $('#av-client-status');
  if (node) { node.textContent = message; node.setAttribute('data-tone', tone); }
}

async function renderSession() {
  const user = await currentUser();
  const login = $('#av-login');
  const account = $('#av-account');
  if (!user) {
    login?.removeAttribute('hidden');
    account?.setAttribute('hidden','');
    return;
  }
  login?.setAttribute('hidden','');
  account?.removeAttribute('hidden');
  const email = $('#av-user-email'); if (email) email.textContent = user.email || 'Cont AstroVip';
  await renderProfiles();
}

async function renderProfiles() {
  const target = $('#av-profile-list');
  if (!target) return;
  target.innerHTML = '<p>Încarc hărțile salvate…</p>';
  try {
    const rows = await loadBirthProfiles();
    if (!rows.length) { target.innerHTML = '<p>Nu ai încă hărți salvate. Adaugă prima hartă mai jos.</p>'; return; }
    target.innerHTML = rows.map((row: any) => `<article class="av-profile-item"><strong>${escapeHtml(row.label || 'Harta mea')}</strong><span>${escapeHtml(row.birth_date || '')} ${escapeHtml(row.birth_time || '')}</span><small>${escapeHtml(row.location_label || '')} · ${escapeHtml(row.house_system || 'Koch')}</small></article>`).join('');
  } catch { target.innerHTML = '<p>Nu am putut încărca hărțile.</p>'; }
}

function escapeHtml(value: string) {
  return String(value).replace(/[&<>'"]/g, ch => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[ch] || ch));
}

async function boot() {
  const loginForm = $('#av-login-form') as HTMLFormElement | null;
  loginForm?.addEventListener('submit', async event => {
    event.preventDefault();
    const email = String(new FormData(loginForm).get('email') || '').trim();
    if (!email) return;
    status('Trimit linkul securizat…');
    const { error } = await sendMagicLink(email);
    if (error) status('Nu am putut trimite linkul. Verifică adresa și încearcă din nou.', 'error');
    else { status('Link trimis. Verifică emailul și revino în AstroVip.'); track('client_magic_link_sent'); }
  });

  $('#av-signout')?.addEventListener('click', async () => { await signOut(); location.reload(); });

  const profileForm = $('#av-profile-form') as HTMLFormElement | null;
  profileForm?.addEventListener('submit', async event => {
    event.preventDefault();
    const form = new FormData(profileForm);
    status('Salvez harta…');
    try {
      await saveBirthProfile({
        label: String(form.get('label') || 'Harta mea'),
        birth_date: String(form.get('birth_date') || ''),
        birth_time: String(form.get('birth_time') || '') || null,
        timezone: String(form.get('timezone') || '') || null,
        location_label: String(form.get('location_label') || '') || null,
        latitude: form.get('latitude') ? Number(form.get('latitude')) : null,
        longitude: form.get('longitude') ? Number(form.get('longitude')) : null,
        house_system: 'Koch',
        zodiac: 'tropical'
      });
      profileForm.reset();
      status('Harta a fost salvată.');
      track('birth_profile_saved');
      await renderProfiles();
    } catch { status('Nu am putut salva harta.', 'error'); }
  });

  await renderSession();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true }); else boot();
