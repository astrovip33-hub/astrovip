# AstroVip Command Center V6

## Entry points

- `/command-center/`: publicare, editor, GSC, GA4, SE Ranking, backup, sănătatea site-ului.
- `/command-center/connections/`: cele 13 integrări, conectare OAuth, configurare și teste de acces.
- `/command-center/google/`: accesul existent pentru GSC și GA4; include link către toate conexiunile.
- `/command-center/editor/`: editorul vizual existent.

Se păstrează tokenul administrativ existent. Login-ul folosește `COMMAND_CENTER_TOKEN`, iar sesiunea browserului este comună pentru panou, editor și conexiuni.

## Starea unei conexiuni

- **De conectat**: lipsesc date de acces sau autorizarea.
- **Configurat**: există câmpurile necesare; acest lucru nu confirmă permisiunile sau validitatea lor.
- **Autorizat**: Composio raportează un cont OAuth activ pentru utilizatorul AstroVip.
- **Verificat**: o cerere API de citire a reușit în sesiunea curentă.

„Verifică tot” testează serviciile configurate sau autorizate. Un eșec nu blochează celelalte servicii. Verificarea nu trimite conversii, nu publică postări și nu modifică reclame. Testul Drive verifică folderul și dreptul de a adăuga fișiere, fără a crea un backup.

## Configurare server-side

Valorile sensibile se introduc exclusiv în Cloudflare Worker Settings / Variables and Secrets. Nu se salvează în repository, URL-uri sau în interfața AstroVip.

| Serviciu | Configurare |
| --- | --- |
| Acces panou | `COMMAND_CENTER_TOKEN` |
| GitHub Deploy / editor | `GITHUB_ADMIN_TOKEN`, limitat la repository cu Actions și Contents read/write |
| Composio | `COMPOSIO_API_KEY`; opțional `COMPOSIO_USER_ID`, implicit `astrovip-admin` |
| GSC | Service account `GOOGLE_SERVICE_ACCOUNT_JSON`, Google OAuth direct sau OAuth Composio |
| GA4 | `GA4_PROPERTY_ID` și autentificare Google; Composio poate detecta proprietatea |
| Drive Backup | `DRIVE_BACKUP_FOLDER_ID` și autentificare Google directă sau Composio `googledrive` |
| SE Ranking | `SERANKING_API_KEY`; OAuth-ul MCP de pe PC este o conexiune separată |
| Google Ads | Composio `googleads`, sau Google OAuth/service account + `GOOGLE_ADS_DEVELOPER_TOKEN` + `GOOGLE_ADS_CUSTOMER_ID`; opțional `GOOGLE_ADS_LOGIN_CUSTOMER_ID` |
| Google Business | Google OAuth/service account cu `business.manage` + `GOOGLE_BUSINESS_LOCATION_ID` |
| Metricool | `METRICOOL_API_TOKEN`, `METRICOOL_USER_ID`, `METRICOOL_BLOG_ID`; plan compatibil cu API-ul |
| Stripe API | `STRIPE_SECRET_KEY`; webhook-ul folosește separat `STRIPE_WEBHOOK_SECRET` |
| GA4 Purchase | `GA4_API_SECRET`; se validează separat cu un eveniment de test în Analytics |
| Meta CAPI | `META_CAPI_ACCESS_TOKEN`; se validează separat în Events Manager |

Google OAuth direct folosește `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN`. Contul trebuie să aibă permisiunile providerului pentru resursa AstroVip.

Când există mai multe conturi Composio active pentru același toolkit, aplicația cere selecția explicită prin `COMPOSIO_<TOOLKIT_SLUG_UPPERCASE>_ACCOUNT_ID`. Nu alege automat un cont arbitrar. De exemplu: `COMPOSIO_GOOGLE_SEARCH_CONSOLE_ACCOUNT_ID`.

Autorizarea unui cont în pluginul ChatGPT/Windsor sau în MCP-ul de pe PC nu acordă automat acces Worker-ului AstroVip. Conexiunile de mai sus aparțin site-ului și se verifică separat.

## Endpoints

Toate cer `Authorization: Bearer <COMMAND_CENTER_TOKEN>` și răspund cu `Cache-Control: no-store`.

- `GET /api/command/connections`: starea configurației și a conturilor OAuth, fără tokenurile providerilor.
- `POST /api/command/connect` cu `{ "key": "gsc" }`: link temporar de autorizare pentru serviciile acceptate. Callback-ul este fix către hub-ul AstroVip. Pentru servicii cu configurare manuală, returnează pagina Worker Settings.
- `POST /api/command/connection-test` cu `{ "key": "gsc" }`: verificare API de citire pentru serviciul selectat.
- Endpoint-urile existente de publicare, editor, GSC, GA4 și backup sunt păstrate.

## Validare

```sh
node --check command-center-api.js
node --test scripts/test-command-center.mjs
```

Testele acoperă autentificarea, conturile multiple/expirate, redacția secretelor, dependențele Ads/Metricool, OAuth, verificarea Stripe/Drive, OAuth Google direct și validitatea scripturilor HTML. Datele providerilor sunt simulate în testele locale; verificarea conturilor reale se face autentificat în hub.
