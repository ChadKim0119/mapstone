const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),C=require('../mapstone-core.js'),crypto=require('node:crypto').webcrypto;
// Minimal DOM for async UI state checks; layout is verified in the browser.
function fixture(fetch){
  const nodes=[];
  class Element{
    constructor(tag){this.tagName=tag;this.children=[];this.attrs={};this.style={};this.dataset={};this.textContent='';this.value='';this.events={};nodes.push(this);this.classList={remove:(c)=>this.classList.toggle(c,false),add:(...c)=>{this.className=[this.className||'',...c].join(' ');},toggle:(c,on)=>{const s=new Set((this.className||'').split(' '));on?s.add(c):s.delete(c);this.className=[...s].join(' ');}};}
    append(...ns){for(const n of ns){n.parentElement=this;this.children.push(n);}}
    replaceChildren(...ns){this.children=[];this.append(...ns);if(this.tagName==='select')this.value=ns[0]?.value||'';}
    set value(v){this._value=this.tagName==='select'&&!this.children.some(n=>n.value===v)?'':v;}
    get value(){return this._value;}
    getAttribute(k){return this.attrs[k]??null;}
    setAttribute(k,v){this.attrs[k]=v;}
    removeAttribute(k){delete this.attrs[k];}
    addEventListener(k,f){this.events[k]=f;}
    closest(tag){return this.tagName===tag?this:this.parentElement?.closest(tag);}
    before(n){this.parentElement.append(n);}
    showModal(){this.open=true;this.initialClass=this.className;}
    close(){this.open=false;}
    remove(){this.removed=true;}
    querySelectorAll(selector){return this.children.flatMap(n=>[...(selector==='button'&&n.tagName==='button'?[n]:[]),...n.querySelectorAll(selector)]);}
    cloneNode(){const c=new Element(this.tagName);c.textContent=this.textContent;c.append(...this.children.map(n=>n.cloneNode(true)));return c;}
    getBoundingClientRect(){return {left:0,top:0};}
    removeEventListener(k,f){if(this.events[k]===f)delete this.events[k];}
    getContext(){return {drawImage(){}};}
    toDataURL(){return 'data:image/png;base64,YQ==';}
    scrollIntoView(){}
    focus(){this.focused=true;}
    click(){return this.events.click?.({target:this});}
  }
  const document={createElement:t=>new Element(t),body:new Element('body'),addEventListener(){},removeEventListener(){}},store=new Map(),ctx={MapstoneCore:C,window:{innerWidth:1000,innerHeight:800,addEventListener(){},removeEventListener(){}},requestAnimationFrame:f=>{f();return 0;},cancelAnimationFrame(){},document,Image:class{constructor(){this.width=1200;this.height=400;}async decode(){}},crypto,AbortSignal,AbortController,setInterval:()=>0,clearInterval(){},clearTimeout,setTimeout:()=>0,navigator:{clipboard:{writeText:async text=>{document._copied=text;}}},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},fetch};
  vm.runInNewContext(fs.readFileSync('mapstone-ui.js','utf8').replace('window.MapstoneUI={','window.MapstoneUI={renderVersionReport,imageComparison,changeDetails,versionImage,'),ctx);
  const app={state:{title:'QA'},sync:{endpoint:'https://example.test'}};
  return {ui:ctx.window.MapstoneUI,app,document,nodes,find:text=>nodes.find(n=>n.textContent===text),byClass:c=>nodes.find(n=>(n.className||'').split(' ').includes(c))};
}
test('Version shell is sized before opening and loading state clears on success and failure',async()=>{
  for(const fail of [false,true]){
    let release;const gate=new Promise(r=>release=r),f=fixture(async()=>{await gate;if(fail)throw Error('offline');return {ok:true,json:async()=>[]};});
    const pending=f.ui.versionLibrary(f.app),dialog=f.nodes.find(n=>n.tagName==='dialog'),select=f.nodes.find(n=>n.tagName==='select'),status=f.byClass('ms-version-status');
    assert.match(dialog.initialClass,/ms-versions ms-version-library/);assert.equal(select.disabled,true);assert.equal(status.attrs['aria-busy'],'true');assert.match(status.className,/ms-loading/);
    release();await pending;assert.equal(select.disabled,false);assert.equal(status.attrs['aria-busy'],'false');assert.doesNotMatch(status.className,/ms-loading/);assert.match(status.textContent,fail?/offline/:/보관된 작업물이 없습니다/);
  }
  const html=fs.readFileSync('src/timeline.dc.html','utf8');assert.match(html,/\.ms-dialog\.ms-versions\[open\][^\n]*height:min\(760px,90dvh\);overflow:hidden/);assert.match(html,/prefers-reduced-motion:reduce[^\n]*ms-loading/);
});
test('File loading imports without downloading an unsolicited backup',()=>{
  const f=fixture(()=>{throw Error('unexpected request');});let loaded;
  f.app.importDocument=d=>loaded=d;f.ui.open(f.app,'file');const input=f.nodes.find(n=>n.tagName==='textarea'),doc=C.fromAnalysis({title:'불러오기 QA',rangeStart:'2026-10-01',rows:[{id:'r',name:'QA'}],items:[]});
  input.value=C.serializeFile(doc);input.events.input();f.find('이 일정 불러오기').click();assert.equal(loaded.title,doc.title);
});
test('App deletion confirmation works without browser confirm and cancellation preserves data',async()=>{
  let requests=0;const f=fixture(async()=>{requests++;return {ok:true,json:async()=>({deleted:true})};});const v={id:'a',projectId:'project',sequence:1};f.app.state.versions=[v];f.app.setState=p=>Object.assign(f.app.state,typeof p==='function'?p(f.app.state):p);
  let pending=f.ui.deleteSavedVersion(f.app,v);assert.equal(requests,0);f.find('취소').click();assert.equal(await pending,false);assert.equal(f.app.state.versions.length,1);
  pending=f.ui.deleteSavedVersion(f.app,v);f.nodes.filter(n=>n.tagName==='button'&&n.textContent==='삭제').at(-1).click();assert.equal(await pending,true);assert.equal(requests,1);assert.equal(f.app.state.versions.length,0);assert.equal(f.app.state.versionBusy,false);
});
test('Text AI feedback prevents duplicate analysis and restores controls on success and error',async()=>{
  for(const fail of [false,true]){
    let release,calls=0;const gate=new Promise(r=>release=r),f=fixture(async()=>{calls++;await gate;if(fail)throw Error('offline');return {ok:true,json:async()=>({document:C.fromAnalysis({title:'QA',rangeStart:'2026-10-01',rows:[{id:'r',name:'QA'}],items:[]})})};});
    f.ui.open(f.app,'import');const input=f.byClass('ms-text-editor'),text=f.find('텍스트 분석'),image=f.find('이미지 분석'),status=f.nodes.filter(n=>n.className==='ms-message')[1];input.textContent='10월 1일 킥오프';
    const pending=text.click();assert.equal(f.byClass('ms-ai-analysis').hidden,false);assert.doesNotMatch(text.className,/ms-loading/);assert.equal(text.textContent,'분석 중…');assert.equal(text.attrs['aria-busy'],'true');assert.equal(image.disabled,true);assert.equal(input.disabled,true);await text.click();assert.equal(calls,1);
    release();await pending;assert.equal(f.byClass('ms-ai-analysis').hidden,true);assert.equal(text.textContent,'텍스트 분석');assert.equal(text.attrs['aria-busy'],'false');assert.equal(status.attrs['aria-busy'],'false');assert.equal(image.disabled,false);assert.equal(input.disabled,false);assert.match(status.textContent,fail?/offline/:/완료되었습니다/);
  }
});
test('Version comparison disables changes while AI runs and clears feedback after success or error',async()=>{
  for(const fail of [false,true]){
    let release;const gate=new Promise(r=>release=r),f=fixture(async url=>{
      if(url.endsWith('/compare')){await gate;if(fail)throw Error('offline');return {ok:true,json:async()=>({from:1,to:2,report:'검수 완료'})};}
      return {ok:true,json:async()=>url.endsWith('/versions')?[{id:'a',sequence:1,created_at:'2026-10-01'},{id:'b',sequence:2,created_at:'2026-10-02'}]:[{id:'project',title:'QA'}]};
    });
    f.app.state.versions=[{id:'a',projectId:'project'},{id:'b',projectId:'project'}];f.app.state.versionProjectId='project';    await f.ui.versionLibrary(f.app,true);const boxes=f.nodes.filter(n=>n.type==='checkbox'),select=f.nodes.find(n=>n.tagName==='select'),generate=f.find('선택한 버전 비교하기'),report=f.byClass('ms-version-report');
    for(const b of boxes){b.checked=true;b.events.change();}assert.equal(generate.disabled,false);
    const pending=generate.click();assert.equal(select.disabled,true);assert.equal(generate.attrs['aria-busy'],'true');assert.equal(f.byClass('ms-ai-analysis').hidden,false);assert.doesNotMatch(generate.className,/ms-loading/);assert.ok(boxes.every(b=>b.disabled));
    release();await pending;assert.equal(select.disabled,false);assert.equal(generate.disabled,false);assert.equal(generate.attrs['aria-busy'],'false');assert.equal(report.attrs['aria-busy'],'false');assert.equal(f.byClass('ms-ai-analysis').hidden,true);assert.match(fail?report.textContent:report._copyText,fail?/offline/:/검수 완료/);
  }
});
test('Executive summary stays brief while detailed report and copy retain every change safely',()=>{
  const f=fixture(()=>{}),node=f.nodes[0],changes=Array.from({length:5},(_,i)=>'일정 변경 '+i),report='1. 변경 개요\n전체 변경 개요\n2. 핵심 변화\n'+changes.join('\n')+'\n3. 일정 영향\n검수 일정이 밀립니다.\n4. 확인 필요 사항\n<img src=x onerror=alert(1)> 담당자 확인';
  f.ui.renderVersionReport(node,{from:1,to:2,report});assert.ok(f.find('Executive Summary'));assert.ok(f.find('핵심 변화 · 영향 · 확인'));assert.ok(f.find('일정 영향'));assert.ok(f.find('상세 보고서 펼치기'));
  const cards=f.nodes.filter(n=>n.className==='ms-report-card');assert.equal(cards[0].children[1].children.length,3);assert.equal(cards[1].children[1].children.length,1);
  for(const t of changes)assert.ok(node._copyText.includes(t));assert.ok(f.find('<img src=x onerror=alert(1)> 담당자 확인'));assert.equal(f.nodes.filter(n=>n.tagName==='img').length,0);
});

test('Pasted text gets analysis overlay on its content while file analysis keeps the card',async()=>{
 for(const pasted of [true,false]){let release;const gate=new Promise(r=>release=r),f=fixture(async()=>{await gate;return {ok:true,json:async()=>({document:C.fromAnalysis({rangeStart:'2026-10-01',rows:[{id:'r',name:'QA'}],items:[]})})};});f.ui.open(f.app,'import');const input=f.byClass('ms-text-editor');input.textContent='10월 1일 킥오프';if(pasted)input.events.input();const pending=f.find('텍스트 분석').click(),motion=f.byClass('ms-ai-analysis');assert.equal((motion.className||'').includes('ms-ai-overlay'),pasted);if(pasted)assert.equal(motion.parentElement,input.parentElement);release();await pending;assert.equal(motion.hidden,true);}
});

test('Presentation lenses preserve data, pin the last pointer position, and dispose on exit',()=>{
 const f=fixture(()=>{}),board=new f.nodes[0].constructor('div');Object.assign(board,{scrollWidth:1200,scrollHeight:900,scrollLeft:40,scrollTop:20});f.app._board=board;f.app.state.focusMode=true;const before=JSON.stringify(f.app.state);
 f.ui.refreshPresentation(f.app);f.find('◯').click();board.events.pointermove({clientX:200,clientY:150});const lens=f.byClass('ms-present-lens'),content=f.byClass('ms-lens-content');assert.equal(lens.hidden,false);assert.match(content.style.transform,/translate\(-360px,-220px\) scale\(2\)/);
 board.events.pointerleave();assert.equal(lens.hidden,false);f.find('고정').click();assert.equal(lens.hidden,false);assert.equal(lens.style.left,'200px');board.events.pointermove({clientX:600,clientY:400});assert.equal(lens.style.left,'200px');
 f.find('3×').click();board.events.pointermove({clientX:200,clientY:150});assert.match(content.style.transform,/scale\(3\)/);assert.equal(JSON.stringify(f.app.state),before);
 f.app.state.focusMode=false;f.ui.refreshPresentation(f.app);assert.equal(f.app._presentation,null);assert.equal(f.byClass('ms-presentation').removed,true);assert.equal(board.events.pointermove,undefined);
});

test('Leaving full view restores the previous zoom and scroll position',()=>{
 const f=fixture(()=>{}),board=new f.nodes[0].constructor('div');Object.assign(board,{clientWidth:800,scrollWidth:1200,scrollHeight:900,scrollLeft:120,scrollTop:70});f.app._board=board;f.app.state.cfg={months:12,weekPx:19,showMM:true,showElementDates:true,showTooltip:true,showWeek:true,magnet:true,showNow:false};const before={...f.app.state.cfg};f.app.weeksIn=()=>4;f.app.setState=p=>Object.assign(f.app.state,p);f.app.viewCfg=fn=>fn(f.app.state);
 f.ui.toggleFocus(f.app);assert.equal(f.app.state.focusMode,true);assert.notEqual(f.app.state.cfg.weekPx,19);assert.equal(board.scrollLeft,0);for(const k of ['showMM','showElementDates','showTooltip','showWeek','magnet'])assert.equal(f.app.state.cfg[k],false);assert.equal(f.app.state.cfg.showNow,true);
 f.ui.toggleFocus(f.app);assert.equal(f.app.state.focusMode,false);assert.deepEqual(f.app.state.cfg,before);assert.equal(board.scrollLeft,120);assert.equal(board.scrollTop,70);assert.equal(f.app._presentation,null);
});

test('Lens size choices change the viewport and laser trails only appear while held',()=>{const f=fixture(()=>{}),board=new f.nodes[0].constructor('div');Object.assign(board,{scrollWidth:1200,scrollHeight:900,scrollLeft:0,scrollTop:0});f.app._board=board;f.app.state.focusMode=true;f.ui.refreshPresentation(f.app);f.find('◯').click();board.events.pointermove({clientX:300,clientY:300});const select=f.byClass('ms-lens-size'),lens=f.byClass('ms-present-lens');select.value='large';select.events.change();assert.equal(lens.style.width,'320px');select.value='small';select.events.change();assert.equal(lens.style.width,'160px');const red=f.nodes.find(n=>n.attrs['aria-label']==='빨간색 레이저 포인터 · P');red.click();board.events.pointermove({clientX:300,clientY:300});assert.equal(f.nodes.filter(n=>n.className==='ms-laser-trail').length,0);board.events.pointerdown({button:0,clientX:300,clientY:300,preventDefault(){},stopPropagation(){}});board.events.pointermove({clientX:350,clientY:310});const dots=f.nodes.filter(n=>n.className==='ms-laser-trail');assert.equal(dots.length,2);dots[0].events.animationend();assert.equal(dots[0].removed,true);board.events.pointerleave();board.events.pointermove({clientX:400,clientY:320});assert.equal(f.nodes.filter(n=>n.className==='ms-laser-trail').length,2);});

test('Image comparison swaps the baseline, wipes fully, and only fades the comparison layer',()=>{const f=fixture(()=>{}),a=C.fromAnalysis({title:'V1',rangeStart:'2026-10-01',rows:[{id:'r',name:'QA'}],items:[]}),b=C.clone(a);a.items=[{id:'old',kind:'marker',row:'r',lane:0,s:0,e:0,label:'삭제 항목',color:'#66707a'}];b.items=[{id:'new',kind:'marker',row:'r',lane:0,s:1,e:1,label:'추가 항목',color:'#66707a'}];const cmp=C.compareDocuments(a,b),box=f.ui.imageComparison({name:'V1',doc:a},{name:'V2',doc:b},cmp),base=f.byClass('ms-image-base'),over=f.byClass('ms-image-over'),range=f.nodes.find(n=>n.type==='range'),select=f.nodes.find(n=>n.attrs['aria-label']==='분석 기준 버전');assert.equal(box.dataset.mode,'wipe');const mark=f.nodes.find(n=>n.type==='checkbox'&&n.attrs['aria-label']==='변경 표시');mark.checked=true;mark.events.change();assert.match(decodeURIComponent(over.src),/삭제 항목/);assert.match(decodeURIComponent(over.src),/#c83543/);f.find('슬라이드 비교').click();range.value='0';range.events.input();assert.equal(over.style.clipPath,'inset(0 100% 0 0)');range.value='100';range.events.input();assert.equal(over.style.clipPath,'inset(0 0% 0 0)');f.find('오버랩 비교').click();range.value='25';range.events.input();assert.equal(base.style.opacity,'1');assert.equal(over.style.opacity,'0.25');select.value='b';select.events.change();assert.match(decodeURIComponent(base.src),/추가 항목/);assert.match(decodeURIComponent(over.src),/삭제 항목/);const detail=f.ui.changeDetails(cmp);assert.match(detail._copyText,/추가된 내용 · 1건/);assert.match(detail._copyText,/삭제된 내용 · 1건/);});

test('Version workspace loads visual and rule reports before any AI request',async()=>{
 const a=C.fromAnalysis({title:'QA',rangeStart:'2026-10-01',rows:[{id:'r',name:'QA'}],items:[]}),b=C.clone(a);b.title='변경 QA';let calls=0;const f=fixture(async url=>{calls++;assert.ok(!url.endsWith('/compare'));return {ok:true,json:async()=>url.endsWith('/versions/a')?{sequence:1,document:a}:{sequence:2,document:b}};});f.app.state.versions=[{id:'a',projectId:'p'},{id:'b',projectId:'p'}];await f.ui.versionComparePage(f.app,['a','b']);assert.equal(calls,2);assert.ok(f.byClass('ms-image-comparison'));assert.match(f.byClass('ms-exact-changes')._copyText,/제목 변경/);assert.ok(f.find('AI 분석'));assert.equal(f.find('이미지로 비교'),undefined);
});
test('A replaced board retains lens mode and pointer while reconnecting events',()=>{const f=fixture(()=>{}),makeBoard=()=>{const b=new f.nodes[0].constructor('div');Object.assign(b,{scrollWidth:1200,scrollHeight:900,scrollLeft:0,scrollTop:0});return b;},first=makeBoard();f.app._board=first;f.app.state.focusMode=true;f.ui.refreshPresentation(f.app);f.find('◯').click();first.events.pointermove({clientX:300,clientY:200});f.app._board=makeBoard();f.ui.refreshPresentation(f.app);assert.equal(first.events.pointermove,undefined);const host=f.nodes.filter(n=>n.className==='ms-presentation').at(-1),lens=f.nodes.filter(n=>n.className==='ms-present-lens').at(-1);assert.equal(host.dataset.mode,'lens');assert.equal(lens.hidden,false);assert.equal(lens.style.left,'300px');assert.equal(typeof f.app._board.events.pointermove,'function');});
test('Wipe labels follow both directions and its divider supports keyboard positioning',()=>{const f=fixture(()=>{}),a=C.fromAnalysis({title:'A',rangeStart:'2026-10-01',rows:[{id:'r',name:'QA'}],items:[]}),b=C.clone(a);f.ui.imageComparison({name:'V1.mapstone',doc:a},{name:'V2.mapstone',doc:b},C.compareDocuments(a,b));f.find('슬라이드 비교').click();const range=f.nodes.find(n=>n.type==='range'),line=f.byClass('ms-image-divider'),select=f.nodes.find(n=>n.attrs['aria-label']==='분석 기준 버전');assert.equal(line.hidden,false);assert.equal(f.byClass('ms-image-left-name').textContent,'왼쪽 · 비교 버전 V2.mapstone');assert.equal(f.byClass('ms-image-right-name').textContent,'오른쪽 · 기준 버전 V1.mapstone');line.events.keydown({key:'ArrowRight',preventDefault(){}});assert.equal(range.value,'51');assert.equal(line.style.left,'51%');select.value='b';select.events.change();assert.equal(f.byClass('ms-image-left-name').textContent,'왼쪽 · 비교 버전 V1.mapstone');f.find('오버랩 비교').click();range.value='0';range.events.input();assert.match(f.byClass('ms-image-opacity-info').textContent,/V2.mapstone만 표시/);range.value='100';range.events.input();assert.match(f.byClass('ms-image-opacity-info').textContent,/V1.mapstone만 표시/);assert.equal(line.hidden,true);});
test('Wipe uses only the image divider, coaching dismisses on keyboard input, opacity has a compact slider',()=>{const f=fixture(()=>{}),a=C.fromAnalysis({title:'A',rangeStart:'2026-10-01',rows:[{id:'r',name:'QA'}],items:[]});f.ui.imageComparison({name:'A',doc:a},{name:'B',doc:a},C.compareDocuments(a,a));const range=f.nodes.find(n=>n.type==='range'),coach=f.byClass('ms-wipe-coach');assert.equal(range.hidden,true);assert.equal(coach.hidden,false);assert.equal(f.find('전체창 보기'),undefined);f.byClass('ms-image-divider').events.keydown({key:'ArrowRight',preventDefault(){}});assert.equal(coach.hidden,true);f.find('오버랩 비교').click();assert.equal(range.hidden,false);const overlapCoach=f.byClass('ms-overlap-coach'),dock=f.byClass('ms-overlap-dock');assert.equal(dock.hidden,false);assert.equal(overlapCoach.hidden,false);assert.ok(dock.children.includes(range));range.value='70';range.events.input();assert.equal(overlapCoach.hidden,true);assert.equal(f.byClass('ms-image-over').style.opacity,'0.7');f.find('슬라이드 비교').click();assert.equal(dock.hidden,true);f.find('오버랩 비교').click();assert.equal(overlapCoach.hidden,true);});
test('Stopping analysis aborts its request and ignores a late successful result',async()=>{
 let release,signal;const gate=new Promise(r=>release=r),f=fixture(async(_,o)=>{signal=o.signal;await gate;return {ok:true,json:async()=>({document:C.fromAnalysis({title:'Late result',rangeStart:'2026-10-01',rows:[{id:'r',name:'QA'}],items:[]})})};});
 f.ui.open(f.app,'import');f.byClass('ms-text-editor').textContent='10월 1일 킥오프';const button=f.find('텍스트 분석'),pending=button.click();assert.match(f.byClass('ms-analysis-progress').textContent,/00%/);assert.equal(f.byClass('ms-analysis-progress').parentElement,f.byClass('ms-ai-copy'));f.find('분석 멈춤').click();await pending;assert.equal(signal.aborted,true);assert.equal(button.disabled,false);assert.equal(f.byClass('ms-review').hidden,true);release();await new Promise(r=>setImmediate(r));assert.equal(f.byClass('ms-review').hidden,true);
});
test('Dropped schedule files retain their filename and success or failure identity',async()=>{
 const f=fixture(()=>{throw Error('unexpected request');});f.ui.open(f.app,'file');const zone=f.byClass('ms-drop'),attached=f.byClass('ms-attached-file');const doc=C.fromAnalysis({title:'QA',rangeStart:'2026-10-01',rows:[{id:'r',name:'QA'}],items:[]});
 zone.events.drop({preventDefault(){},dataTransfer:{files:[{name:'QA.mapstone',size:100,text:async()=>C.serializeFile(doc)}]}});await new Promise(r=>setImmediate(r));assert.match(attached.textContent,/QA.mapstone · 첨부 완료/);assert.equal(f.find('이 일정 불러오기').disabled,false);
 zone.events.drop({preventDefault(){},dataTransfer:{files:[{name:'broken.json',size:10,text:async()=>'{bad'}]}});await new Promise(r=>setImmediate(r));assert.match(attached.textContent,/broken.json · 읽기 실패/);assert.equal(f.find('이 일정 불러오기').disabled,true);
});
test('Edited comparison prompt and selected baseline reach AI, copy appears only after a report',async()=>{
 const a=C.fromAnalysis({title:'QA',rangeStart:'2026-10-01',rows:[{id:'r',name:'QA'}],items:[]});let sent;const f=fixture(async(url,o)=>{if(url.endsWith('/compare')){sent=JSON.parse(o.body);return {ok:true,json:async()=>({from:2,to:1,imageCompared:true,report:'Executive Summary\n변경 없음\n상세 변경 내용\n변경 없음'})};}return {ok:true,json:async()=>url.endsWith('/versions/a')?{id:'a',sequence:1,document:a}:{id:'b',sequence:2,document:a}};});f.app.state.versions=[{id:'a',projectId:'p'},{id:'b',projectId:'p'}];await f.ui.versionComparePage(f.app,['a','b']);const prompt=f.nodes.find(n=>n.attrs['aria-label']==='분석 프롬프트'),copy=f.byClass('ms-report-copy');assert.equal(copy.hidden,true);prompt.value='담당자 확인 사항을 우선 분석하세요.';const baseline=f.nodes.find(n=>n.attrs['aria-label']==='분석 기준 버전');baseline.value='b';baseline.events.change();assert.equal(prompt.value,'담당자 확인 사항을 우선 분석하세요.');await f.find('AI 분석').click();assert.equal(sent.prompt,prompt.value);assert.equal(sent.baselineId,'b');assert.equal(sent.images.length,2);assert.equal(copy.hidden,false);assert.match(f.byClass('ms-version-report')._copyText,/v2 → v1/);
});
test('Comparison keeps first selected version as baseline even when it is newer',async()=>{const doc=C.fromAnalysis({title:'QA',rangeStart:'2026-10-01',rows:[{id:'r',name:'QA'}],items:[]});const f=fixture(async url=>({ok:true,json:async()=>({id:url.endsWith('/b')?'b':'a',sequence:url.endsWith('/b')?2:1,document:doc})}));f.app.state.versions=[{id:'a',projectId:'p'},{id:'b',projectId:'p'}];await f.ui.versionComparePage(f.app,['b','a']);const select=f.nodes.find(n=>n.attrs['aria-label']==='분석 기준 버전');assert.equal(select.children[0].textContent,'v2 · 첫 번째 선택');f.find('오버랩 비교').click();const range=f.nodes.find(n=>n.type==='range');assert.equal(range.attrs['aria-label'],'비교 버전 [V1] 불투명도');range.value='30';range.events.input();assert.equal(f.byClass('ms-image-base').style.opacity,'1');assert.equal(f.byClass('ms-image-over').style.opacity,'0.3');assert.match(f.byClass('ms-image-opacity-info').textContent,/기준 70% · 비교 30%/);});
