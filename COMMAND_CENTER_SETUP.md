# AstroVip Command Center V11

Un singur punct de acces: `/command-center/`. Adresele V3, V9, V10 și V11 redirecționează aici. Codul aplicației curente este în `command-center/v11/`; V10 nu mai este publicat ca panou separat.

## Module

- Cockpit, Intelligence, SEO, concurență, AI/GEO, Local, conținut și autoritate.
- Site Studio: editorul existent, draft, undo/redo, preflight și publicare cu rezultat verificabil.
- Money: evenimente, canale și venituri GA4 cu definițiile și limitele sursei.
- Operations: publicare main, backup Drive/ZIP, recovery, Auto-Pilot și Clarity manual.
- Conexiuni și acces Google: autorizare și teste API în același panou.
- AI Operator ghidat și QA: priorități și verificări bazate pe date disponibile.

## Sesiune și navigare

Tokenul existent `COMMAND_CENTER_TOKEN` și cheia de sesiune comună sunt păstrate. Tokenul nu este transmis în URL. Instrumentele integrate se încarcă numai după autentificare și rămân montate la schimbarea modulului pentru a păstra editările nesalvate. Ieșirea sau expirarea sesiunii anulează cererile și descarcă instrumentele.

Editorul, conexiunile și operațiunile sunt module interne `?embedded=1`. Deschise direct, adresele lor trimit la modulul din V11. Autorizarea OAuth se deschide în pagina principală și revine în V11.

## Date și configurare

Endpoint-urile `/api/command/*` și configurația Cloudflare existentă sunt păstrate. Cheile providerilor rămân în secretele Worker-ului. Conectarea în ChatGPT nu configurează automat accesul Worker-ului. O conexiune configurată, autorizată și un test API reușit sunt stări distincte.

Rapoartele se încarcă la cerere, cu cache în memorie de 5 minute și fără polling al providerilor. Raportul SE Ranking poate fi importat în memoria sesiunii. Mangools afișează snapshotul MCP cu data sincronizării; recitirea fișierului nu confirmă soldul live și nu consumă căutări. Lipsa datelor sau a autorizării este afișată explicit.

## Verificare

`node --test scripts/test-command-center.mjs scripts/test-command-center-ui.mjs scripts/test-editor-publishing.mjs scripts/test-marketing-os.mjs scripts/test-marketing-workflows.mjs`

`python3 -m unittest discover -s scripts -p 'test_operations_health.py'`

Sunt verificate autentificarea, izolarea surselor, păstrarea drafturilor, publicarea cu rezultat, redirecționările fără bucle, navigarea unică și închiderea sesiunii în instrumentele integrate. Testele providerilor folosesc răspunsuri simulate; accesul real se verifică autentificat în Conexiuni.
