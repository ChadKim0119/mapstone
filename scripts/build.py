"""Generate all entry points from one editable HTML source. No network/build deps."""
from pathlib import Path
import re,json,gzip,base64,uuid,mimetypes,shutil,unicodedata
ROOT=Path(__file__).resolve().parent.parent
source=(ROOT/'src/timeline.dc.html').read_text()
for name in ['share-timeline.dc.html','개발 일정 및 진행 현황.dc.html']:
    target=next((p for p in ROOT.glob('*.dc.html') if unicodedata.normalize('NFC',p.name)==name), ROOT/name)
    target.write_text(source)
(ROOT/'share/schedule-maker.html').write_text(source)
for name in ['support.js','mapstone-core.js','mapstone-ui.js','mapstone-help.js']:
    shutil.copyfile(ROOT/name,ROOT/'share'/name)
shutil.copytree(ROOT/'vendor',ROOT/'share/vendor',dirs_exist_ok=True)
shutil.copyfile(ROOT/'mapstone-core.js',ROOT/'supabase/functions/mapstone-api/mapstone-core.js')
manifest={}
def resource(path):
    path=path.resolve();data=path.read_bytes();key=str(uuid.uuid5(uuid.NAMESPACE_URL,str(path.relative_to(ROOT))))
    mime=mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    manifest[key]={'mime':mime,'compressed':True,'data':base64.b64encode(gzip.compress(data,mtime=0)).decode()}
    return key
def csslink(match):
    path=ROOT/match.group(1)
    css=path.read_text()
    def font(m):
        ref=m.group(1).strip('\"\'')
        if ref.startswith(('data:','http:','https:','#')):return m.group(0)
        return 'url("'+resource((path.parent/ref).resolve())+'")'
    css=re.sub(r'url\(([^)]+)\)',font,css)
    return '<style>'+css+'</style>'
template=re.sub(r'<link\s+rel="stylesheet"\s+href="([^"]+)"\s*>',csslink,source)
template=re.sub(r'(<script src=")([^"]+)(")',lambda m:m.group(1)+resource(ROOT/m.group(2))+m.group(3),template)
shell=(ROOT/'scripts/bundle-base.html').read_text()
for kind,data in [('manifest',manifest),('template',template),('ext_resources',[]),('page_order',[])]:
    body=json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
    shell=re.sub(r'(<script type="__bundler/'+kind+r'">).*?(</script>)',lambda m:m.group(1)+'\n'+body+'\n'+m.group(2),shell,flags=re.S)
shell=shell.replace('<title>Bundled Page</title>','<title>MapStone · 일정 Maker</title>')
(ROOT/'index.html').write_text(shell)
print('Built index.html and 3 entry points from src/timeline.dc.html')

# 이슈관리 모드: issue-mode/ 원본 → issues.html (단일 파일, 폰트·아이콘은 assets 공유)
IM=ROOT/'issue-mode'
ver=re.search(r"APP_VER = '([^']+)'",source).group(1)
im_css=(IM/'style.css').read_text()
im_js='\n'.join((IM/n).read_text() for n in ['model.js','data.js','app.js'])
im_sample=(IM/'sample.txt').read_text()
assert '</script' not in im_js and '</script' not in im_sample
issues=f'''<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>MapStone · 이슈관리 모드</title>
<link rel="icon" type="image/svg+xml" href="assets/design-system/mapstone-icon-flat.svg">
<style>
{im_css}
</style>
</head>
<body>
<div id="app"></div>
<div id="modal-root"></div>
<div id="toast-root"></div>
<script id="sample-text" type="text/plain">{im_sample}</script>
<script>
'use strict';
const APP_VER = {json.dumps(ver)};
{im_js}
</script>
</body>
</html>
'''
(ROOT/'issues.html').write_text(issues)
print('Built issues.html (이슈관리 모드)')
