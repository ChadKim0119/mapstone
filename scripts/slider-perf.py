#!/usr/bin/env python3
"""Create an isolated browser probe; never adds instrumentation to the shipped app.
Usage: python3 scripts/slider-perf.py /tmp/mapstone-slider-perf [index.html]
Serve that directory locally and drag main zoom, overlap and wipe at least 3 times each.
Read #ms-slider-perf JSON after each gesture. rAF intervals measure delivered browser
frames, not GPU presentation; inspect the interaction visually too.
"""
import base64, gzip, json, re, sys
from pathlib import Path
PROBE = r'''
;(() => {
 const reports=[];let active=null,sequence=0;
 const output=document.createElement('details');output.id='ms-slider-perf';output.style='position:fixed;top:4px;right:4px;z-index:2147483647;background:#fff;color:#111;max-width:460px;max-height:160px;overflow:auto;font:11px monospace;border:1px solid #888;padding:3px';
 output.innerHTML='<summary>슬라이더 성능 측정</summary><pre></pre>';
 const percentile=(xs,p)=>xs.length?[...xs].sort((a,b)=>a-b)[Math.ceil(xs.length*p)-1]:null;
 const show=()=>{if(!output.isConnected)(document.querySelector('dialog[open]')||document.body).append(output);output.querySelector('pre').textContent=JSON.stringify({version:document.querySelector('[data-app]')?.textContent.match(/v0\.9\.\d+/)?.[0],gestures:reports},null,2);};
 const signature=g=>g.kind==='배율'?document.querySelector('[data-track]')?.style.width:g.kind.includes('불투명도')?document.querySelector('.ms-image-over')?.style.opacity:document.querySelector('.ms-image-divider')?.style.left;
 document.addEventListener('pointerdown',e=>{
  const node=e.target.closest('input[type="range"],[role="slider"]');if(!node)return;
  const g=active={id:++sequence,kind:node.getAttribute('aria-label'),start:performance.now(),inputs:[],frames:[],latencies:[],values:[],node};
  function tick(t){if(active!==g)return;if(g.last!==undefined)g.frames.push(t-g.last);g.last=t;requestAnimationFrame(tick);}requestAnimationFrame(tick);
 },true);
 window.addEventListener('input',e=>{const g=active;if(!g||e.target!==g.node)return;g.inputs.push(performance.now());g.values.push(e.target.value);const t=performance.now();requestAnimationFrame(()=>{g.latencies.push({ms:performance.now()-t,held:active===g,visual:signature(g)});});});
 window.addEventListener('pointermove',e=>{const g=active;if(!g||g.node.tagName==='INPUT')return;g.inputs.push(performance.now());g.values.push(g.node.getAttribute('aria-valuenow'));const t=performance.now();requestAnimationFrame(()=>g.latencies.push({ms:performance.now()-t,held:active===g,visual:signature(g)}));});
 const end=()=>{const g=active;if(!g)return;active=null;setTimeout(()=>{reports.push({id:g.id,kind:g.kind,inputs:g.inputs.length,frames:g.frames.length,frameP95:percentile(g.frames,.95),frameMax:Math.max(0,...g.frames),longFrames:g.frames.filter(t=>t>50).length,inputP95:percentile(g.latencies.filter(x=>x.held).map(x=>x.ms),.95),values:g.values,visuals:g.latencies.map(x=>x.visual),final:signature(g)});show();},300);};
 window.addEventListener('pointerup',end);window.addEventListener('pointercancel',end);
 setTimeout(show,1000);
})();
'''
out=Path(sys.argv[1]);out.mkdir(parents=True,exist_ok=True)
source=Path(sys.argv[2] if len(sys.argv)>2 else 'index.html').read_text()
m=re.search(r'(<script type="__bundler/manifest">)(.*?)(</script>)',source,re.S)
if not m: raise SystemExit('No bundle manifest')
manifest=json.loads(m[2]);patched=False
# Manifest resource values are gzip/base64 strings, nested under the bundler's resource map.
def visit(obj):
 global patched
 if isinstance(obj,dict):
  for key,value in obj.items():
   if isinstance(value,str):
    try: raw=gzip.decompress(base64.b64decode(value)).decode()
    except Exception: continue
    if raw.startswith('/* Browser adapter:'):
     obj[key]=base64.b64encode(gzip.compress((raw+PROBE).encode(),mtime=0)).decode();patched=True
   else: visit(value)
 elif isinstance(obj,list):
  for value in obj: visit(value)
visit(manifest)
if not patched: raise SystemExit('Browser adapter bundle not found')
(out/'index.html').write_text(source[:m.start(2)]+json.dumps(manifest,separators=(',',':'))+source[m.end(2):])
print(out/'index.html')
