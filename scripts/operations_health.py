"""Read-only production guard checks used by the Operations Auto-Pilot."""
import json
import subprocess
import time
import urllib.error
import urllib.request
from html.parser import HTMLParser
from pathlib import Path


class CanonicalParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'link' and 'canonical' in (attrs.get('rel') or '').lower().split():
            self.urls.append(attrs.get('href'))


def canonical_check(html):
    parser = CanonicalParser()
    parser.feed(html)
    return len(parser.urls) == 1 and parser.urls[0] in ('https://astrovip.ro', 'https://astrovip.ro/')


def main():
    targets = {
        'homepage': 'https://astrovip.ro/',
        'robots': 'https://astrovip.ro/robots.txt',
        'sitemap': 'https://astrovip.ro/sitemap.xml',
        'command_center': 'https://astrovip.ro/command-center/',
    }
    results, bodies = [], {}
    for key, url in targets.items():
        started = time.monotonic()
        result = {'key': key, 'url': url, 'ok': False, 'status': 0}
        for attempt in range(2):
            try:
                request = urllib.request.Request(url + '?autopilot=' + str(time.time_ns()),
                                                 headers={'User-Agent': 'AstroVip-AutoPilot/2.0'})
                with urllib.request.urlopen(request, timeout=15) as response:
                    bodies[key] = response.read().decode('utf-8', 'replace')
                    result.update(ok=response.status == 200, status=response.status)
                break
            except Exception as exc:
                result.update(ok=False, status=getattr(exc, 'code', 0), error=str(exc)[:220])
                if attempt == 0:
                    time.sleep(1)
        result['ms'] = round((time.monotonic() - started) * 1000)
        if result['ok']:
            result.pop('error', None)
        results.append(result)

    home = bodies.get('homepage', '')
    results.extend([
        {'key': 'canonical', 'ok': canonical_check(home)},
        {'key': 'structured_data', 'ok': 'application/ld+json' in home.lower()},
        {'key': 'robots_sitemap', 'ok': 'sitemap' in bodies.get('robots', '').lower()
         and 'astrovip.ro' in bodies.get('robots', '').lower()},
        {'key': 'sitemap_home', 'ok': 'https://astrovip.ro/' in bodies.get('sitemap', '')},
    ])
    for key, url in [('http_to_https', 'http://astrovip.ro/'), ('www_to_apex', 'https://www.astrovip.ro/')]:
        try:
            process = subprocess.run(['curl', '-sS', '-o', '/dev/null', '-w', '%{url_effective}|%{http_code}',
                                      '-L', '--max-redirs', '5', '--max-time', '20', url],
                                     capture_output=True, text=True, timeout=25)
            effective, code = process.stdout.strip().split('|', 1)
            results.append({'key': key, 'ok': process.returncode == 0 and effective == 'https://astrovip.ro/'
                            and code == '200', 'effective': effective, 'status': code})
        except Exception as exc:
            results.append({'key': key, 'ok': False, 'error': str(exc)[:220]})
    report = {
        'ok': all(item['ok'] for item in results),
        'checkedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        'commit': subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip(),
        'checks': results,
    }
    Path('autopilot-report.json').write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(json.dumps(report, indent=2, ensure_ascii=False))
    if not report['ok']:
        raise SystemExit('AstroVip Auto-Pilot detected failed production checks.')


if __name__ == '__main__':
    main()
