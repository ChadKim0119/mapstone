"""Generate all entry points from one editable HTML source. No network/build deps."""
from pathlib import Path
import re,json,gzip,base64,uuid,mimetypes,shutil,unicodedata
ROOT=Path(__file__).resolve().parent.parent
source=(ROOT/'src/timeline.dc.html').read_text()
for name in ['share-timeline.dc.html','개발 일정 및 진행 현황.dc.html']:
    target=next((p for p in ROOT.glob('*.dc.html') if unicodedata.normalize('NFC',p.name)==name), ROOT/name)
    target.write_text(source)
(ROOT/'share/schedule-maker.html').write_text(source)
for name in ['support.js','mapstone-core.js','mapstone-ui.js']:
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
shell=shell.replace('<title>Bundled Page</title>','<title>Mapstone · 일정 Maker</title>')
(ROOT/'index.html').write_text(shell)
print('Built index.html and 3 entry points from src/timeline.dc.html')
