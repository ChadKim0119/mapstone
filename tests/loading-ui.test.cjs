const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),C=require('../mapstone-core.js'),crypto=require('node:crypto').webcrypto;
// Minimal DOM for async UI state checks; layout is verified in the browser.
function fixture(fetch){
  const nodes=[];
  class Element{
    constructor(tag){this.tagName=tag;this.children=[];this.attrs={};this.style={};this.textContent='';this.value='';this.events={};nodes.push(this);this.classList={add:(...c)=>{this.className=[this.className||'',...c].join(' ');},toggle:(c,on)=>{const s=new Set((this.className||'').split(' '));on?s.add(c):s.delete(c);this.className=[...s].join(' ');}};}
    append(...ns){for(const n of ns){n.parentElement=this;this.children.push(n);}}
    replaceChildren(...ns){this.children=[];this.append(...ns);if(this.tagName==='select')this.value=ns[0]?.value||'';}
    set value(v){this._value=this.tagName==='select'&&!this.children.some(n=>n.value===v)?'':v;}
    get value(){return this._value;}
    setAttribute(k,v){this.attrs[k]=v;}
    removeAttribute(k){delete this.attrs[k];}
    addEventListener(k,f){this.events[k]=f;}
    closest(tag){return this.tagName===tag?this:this.parentElement?.closest(tag);}
    before(n){this.parentElement.append(n);}
    showModal(){this.open=true;this.initialClass=this.className;}
    close(){this.open=false;}
    remove(){}
    scrollIntoView(){}
    focus(){this.focused=true;}
    click(){return this.events.click?.({target:this});}
  }
  const document={createElement:t=>new Element(t),body:new Element('body')},store=new Map(),ctx={MapstoneCore:C,window:{},document,crypto,AbortSignal,clearTimeout,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},fetch};
  vm.runInNewContext(fs.readFileSync('mapstone-ui.js','utf8').replace('window.MapstoneUI={','window.MapstoneUI={renderVersionReport,'),ctx);
  const app={state:{title:'QA'},sync:{endpoint:'https://example.test'}};
  return {ui:ctx.window.MapstoneUI,app,nodes,find:text=>nodes.find(n=>n.textContent===text),byClass:c=>nodes.find(n=>(n.className||'').split(' ').includes(c))};
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
    f.ui.open(f.app,'import');const input=f.nodes.find(n=>n.tagName==='textarea'),text=f.find('텍스트 분석'),image=f.find('이미지 분석'),status=f.byClass('ms-message');input.value='10월 1일 킥오프';
    const pending=text.click();assert.equal(text.textContent,'분석 중…');assert.equal(text.attrs['aria-busy'],'true');assert.equal(image.disabled,true);assert.equal(input.disabled,true);await text.click();assert.equal(calls,1);
    release();await pending;assert.equal(text.textContent,'텍스트 분석');assert.equal(text.attrs['aria-busy'],'false');assert.equal(status.attrs['aria-busy'],'false');assert.equal(image.disabled,false);assert.equal(input.disabled,false);assert.match(status.textContent,fail?/offline/:/완료되었습니다/);
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
    const pending=generate.click();assert.equal(select.disabled,true);assert.equal(generate.attrs['aria-busy'],'true');assert.ok(boxes.every(b=>b.disabled));
    release();await pending;assert.equal(select.disabled,false);assert.equal(generate.disabled,false);assert.equal(generate.attrs['aria-busy'],'false');assert.equal(report.attrs['aria-busy'],'false');assert.match(fail?report.textContent:report._copyText,fail?/offline/:/검수 완료/);
  }
});
test('Executive summary stays brief while detailed report and copy retain every change safely',()=>{
  const f=fixture(()=>{}),node=f.nodes[0],changes=Array.from({length:5},(_,i)=>'일정 변경 '+i),report='1. 변경 개요\n전체 변경 개요\n2. 핵심 변화\n'+changes.join('\n')+'\n3. 일정 영향\n검수 일정이 밀립니다.\n4. 확인 필요 사항\n<img src=x onerror=alert(1)> 담당자 확인';
  f.ui.renderVersionReport(node,{from:1,to:2,report});assert.ok(f.find('Executive Summary'));assert.ok(f.find('주요 변경점'));assert.ok(f.find('주요 인사이트'));
  const cards=f.nodes.filter(n=>n.className==='ms-report-card');assert.equal(cards[0].children[1].children.length,3);assert.equal(cards[1].children[1].children.length,1);
  for(const t of changes)assert.ok(node._copyText.includes(t));assert.ok(f.find('<img src=x onerror=alert(1)> 담당자 확인'));assert.equal(f.nodes.filter(n=>n.tagName==='img').length,0);
});
