"""이슈관리 모드 프로토타입 빌드: src/*.css,js + 폰트 서브셋 + 예제 원문 → ../index.html (단독 실행)"""
import pathlib, base64
d = pathlib.Path(__file__).parent
font = base64.b64encode((d / 'pret-sub.woff2').read_bytes()).decode()
sample = (d / 'sample.txt').read_text()
css = (d / 'style.css').read_text().replace('__FONT__', font)
js = '\n'.join((d / f).read_text() for f in ['model.js', 'data.js', 'app.js'])
assert '</script' not in js and '</script' not in sample
icon = "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27%3E%3Crect width=%2732%27 height=%2732%27 rx=%278%27 fill=%27%2316365D%27/%3E%3Cpath d=%27M16 7 7 11.5 16 16l9-4.5L16 7Zm-9 9 9 4.5 9-4.5M7 20.5l9 4.5 9-4.5%27 fill=%27none%27 stroke=%27white%27 stroke-width=%272%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E"
page = f'''<title>MapStone 이슈관리 모드</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
{css}
</style>
<div id="app"></div>
<div id="modal-root"></div>
<div id="toast-root"></div>
<script id="sample-text" type="text/plain">{sample}</script>
<script>
'use strict';
{js}
</script>
'''
full = f'<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><link rel="icon" href="{icon}"></head><body>{page}</body></html>'
(d.parent / 'index.html').write_text(full)
print('built', d.parent / 'index.html', len(full))
