from pathlib import Path

path = Path('.github/workflows/deploy-cloudflare-worker.yml')
text = path.read_text(encoding='utf-8')
original = text

text = text.replace(
    '- name: Build Swiss Ephemeris Koch browser bundle',
    '- name: Build Swiss Ephemeris and Premium V9 bundles',
    1,
)
text = text.replace('          npm run build:swiss\n', '          npm run build\n', 1)
needle = '          test -s assets/vendor/swisseph.wasm\n'
addition = needle + '          test -s assets/premium-v9/main.js\n          test -s assets/premium-v9/client.js\n'
if 'test -s assets/premium-v9/main.js' not in text:
    if needle not in text:
        raise SystemExit('Could not find Swiss bundle validation anchor.')
    text = text.replace(needle, addition, 1)

inject_step = '''      - name: Inject Premium V9 runtime\n        shell: bash\n        run: |\n          set -euo pipefail\n          python3 scripts/inject-premium-v9.py\n          grep -Fq "ASTROVIP_PREMIUM_V9" index.html\n          grep -Fq "/assets/premium-v9/main.js" index.html\n\n'''
anchor = '      - name: Validate release header sync\n'
if '- name: Inject Premium V9 runtime' not in text:
    if anchor not in text:
        raise SystemExit('Could not find release header step anchor.')
    text = text.replace(anchor, inject_step + anchor, 1)

verify_step = '''      - name: Verify Premium V9 runtime in production\n        shell: bash\n        run: |\n          set -euo pipefail\n          BASE="https://astrovip.ro"\n          HOME_HTML=$(mktemp)\n          CALC_HTML=$(mktemp)\n          CLIENT_HTML=$(mktemp)\n          MAIN_JS=$(mktemp)\n          MANIFEST=$(mktemp)\n          for ATTEMPT in $(seq 1 12); do\n            STATUS=$(curl -sS -o "$HOME_HTML" -w '%{http_code}' --retry 2 --retry-delay 2 "$BASE/?v9=${GITHUB_SHA}&attempt=$ATTEMPT" || true)\n            if [ "$STATUS" = "200" ] && grep -Fq "/assets/premium-v9/main.js" "$HOME_HTML"; then\n              break\n            fi\n            sleep 5\n          done\n          grep -Fq "/assets/premium-v9/main.js" "$HOME_HTML"\n          test "$(curl -sS -o "$MAIN_JS" -w '%{http_code}' --retry 6 --retry-delay 3 "$BASE/assets/premium-v9/main.js?v=${GITHUB_SHA}")" = "200"\n          test "$(curl -sS -o "$MANIFEST" -w '%{http_code}' --retry 6 --retry-delay 3 "$BASE/manifest.webmanifest?v=${GITHUB_SHA}")" = "200"\n          test "$(curl -sS -o "$CALC_HTML" -w '%{http_code}' --retry 6 --retry-delay 3 "$BASE/calculator/?v=${GITHUB_SHA}")" = "200"\n          test "$(curl -sS -o "$CLIENT_HTML" -w '%{http_code}' --retry 6 --retry-delay 3 "$BASE/client/?v=${GITHUB_SHA}")" = "200"\n          grep -Fq "Hartă natală interactivă" "$CALC_HTML"\n          grep -Fq "Contul meu AstroVip" "$CLIENT_HTML"\n          grep -Fq '"name": "AstroVip Premium"' "$MANIFEST"\n          echo "Premium V9 runtime, PWA, calculator and client portal verified live."\n\n'''
anchor2 = '      - name: Verify live AstroVip\n'
if '- name: Verify Premium V9 runtime in production' not in text:
    if anchor2 not in text:
        raise SystemExit('Could not find live verification anchor.')
    text = text.replace(anchor2, verify_step + anchor2, 1)

if text == original:
    print('Production workflow already V9-ready.')
else:
    path.write_text(text, encoding='utf-8')
    print('Production workflow patched for Premium V9.')
