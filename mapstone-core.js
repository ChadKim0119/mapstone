/* Mapstone data contract. No DOM, network, or executable imports. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MapstoneCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const clone = x => JSON.parse(JSON.stringify(x));
  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const keys = ['title', 'cfg', 'rows', 'items', 'notes', 'now', 'versions'];
  const rowColors = [['none', 'none'], ['파랑', '#eaf2fb'], ['보라', '#f0ebfb'], ['민트', '#e7f4f1'], ['노랑', '#fdf6e3'], ['살구', '#fdeee6'], ['분홍', '#fdeef4'], ['회색', '#f3f5f6']];
  function rowColor(value) {
    if (!/^#[0-9a-f]{6}$/i.test(value || '')) return undefined;
    const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
    const source = rgb(value), distance = hex => rgb(hex).reduce((sum, n, i) => sum + (n - source[i]) ** 2, 0);
    return rowColors.slice(1).reduce((best, c) => distance(c[1]) < distance(best) ? c[1] : best, rowColors[1][1]);
  }
  const uid = () => 'i' + (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
  function syncLinks(items) {
    for (const flag of items.filter(i => i.kind === 'flag' && i.targetId)) {
      const target = items.find(i => i.id === flag.targetId && ['chev','plain'].includes(i.kind));
      if (!target) { flag.targetId = ''; delete flag.linkOffset; delete flag.linkY; continue; }
      flag.row = target.row; flag.lane = target.lane;
      flag.s = flag.e = target.s + (target.e - target.s) * (flag.linkOffset ?? 1);
    }
  }
  const fail = message => { throw new Error(message); };
  const finite = (v, name, lo, hi) => typeof v === 'number' && Number.isFinite(v) && v >= lo && v <= hi ? v : fail(name + ' 값이 올바르지 않습니다.');
  function validate(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) fail('일정 객체가 필요합니다.');
    if (JSON.stringify(data).length > 8 * 1024 * 1024) fail('일정은 8MB 이하여야 합니다.');
    if (!Array.isArray(data.rows) || !data.rows.length || data.rows.length > 200) fail('구분 행은 1~200개가 필요합니다.');
    if (!Array.isArray(data.items) || data.items.length > 5000) fail('블록은 최대 5,000개입니다.');
    const cfg = Object.assign({ startY: 2026, startM: 1, months: 12, weekPx: 19, weekMode: 'uniform', laneH: 44, magnet: true, overlap: 'shrink' }, data.cfg || {});
    for (const [k, lo, hi] of [['startY',1900,2200],['startM',1,12],['months',1,48],['weekPx',4,640],['laneH',28,72]]) finite(cfg[k], k, lo, hi);
    for (const k of ['startY','startM','months']) if (!Number.isInteger(cfg[k])) fail(k + '는 정수여야 합니다.');
    if (!['uniform','actual'].includes(cfg.weekMode) || !['shrink','moveOther','moveSelf'].includes(cfg.overlap)) fail('타임라인 설정이 올바르지 않습니다.');
    const text = (v, name, max = 20000) => typeof v === 'string' && v.length <= max ? v : fail(name + ' 텍스트가 올바르지 않습니다.');
    const ids = new Set();
    const checkId = (v) => { text(v,'id',128); if (!v || ids.has(v) || ['__proto__','prototype','constructor'].includes(v)) fail('id는 고유해야 합니다.'); ids.add(v); return v; };
    const rows = data.rows.map(r => { if (!r || typeof r !== 'object') fail('행 형식 오류'); return {...r,id:checkId(r.id), name:text(r.name,'행 이름',500)}; });
    const rowIds = new Set(rows.map(r => r.id));
    for (const r of rows) { if (r.h !== undefined) finite(r.h,'행 높이',0,10000); if (r.lanes !== undefined) finite(r.lanes,'레인 수',1,100); }
    const items = data.items.map(i => {
      if (!i || typeof i !== 'object') fail('블록 형식 오류');
      const it = {...i, id:checkId(i.id || uid()), label:text(i.label || '', '라벨'), memo:text(i.memo || '', '메모'), color:i.color || '#66707a', lane:i.lane ?? 0, span:i.span ?? 1, variant:i.variant || 'solid', row:i.row || ''};
      if (!['chev','plain','band','marker','flag','sticky','image'].includes(it.kind)) fail('지원하지 않는 블록 종류: ' + it.kind);
      if (!/^#[0-9a-f]{6}$/i.test(it.color)) fail('색상은 #RRGGBB 형식이어야 합니다.');
      finite(it.s,'시작',-1200,1200); finite(it.e,'종료',-1200,1200);
      finite(it.lane,'레인',0,100); finite(it.span,'높이',1,100);
      if (!Number.isInteger(it.lane) || !Number.isInteger(it.span)) fail('레인과 높이는 정수여야 합니다.');
      if (['chev','plain','band'].includes(it.kind) && it.e <= it.s) fail('종료는 시작보다 뒤여야 합니다.');
      if (['chev','plain','flag'].includes(it.kind) && !rowIds.has(it.row)) fail('블록의 구분 행을 찾을 수 없습니다: '+it.row);
      if (it.kind === 'band' && (!rowIds.has(it.rowFrom) || !rowIds.has(it.rowTo))) fail('밴드의 시작·끝 행을 찾을 수 없습니다.');
      for (const k of ['y','w','h']) if (it[k] !== undefined) finite(it[k],k,0,20000);
      if (it.kind === 'image' && (typeof it.src !== 'string' || !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(it.src) || it.src.length > 2800000)) fail('이미지는 2MB 이하 PNG/JPEG/WebP 데이터여야 합니다.');
      if (it.hideDuration !== undefined && typeof it.hideDuration !== 'boolean') fail('hideDuration은 true/false입니다.');
      if (it.targetId !== undefined) { text(it.targetId,'연결 대상',128); if (it.kind !== 'flag') fail('알림만 요소에 연결할 수 있습니다.'); }
      if (it.linkOffset !== undefined) finite(it.linkOffset,'연결 위치',0,1);
      if (it.linkY !== undefined) finite(it.linkY,'연결 높이',0,1);
      for (const k of ['labelDx','labelDy']) if (it[k] !== undefined) finite(it[k],k,-20000,20000);
      return it;
    });
    syncLinks(items);
    const notes = data.notes || [];
    if (!Array.isArray(notes) || notes.length > 500) fail('메모 형식 오류');
    notes.forEach(n => { if (!n || typeof n.id !== 'string') fail('메모 id가 필요합니다.'); text(n.text, '메모'); });
    const versions = data.versions || [];
    if (!Array.isArray(versions) || versions.length > 30) fail('버전은 최대 30개입니다. 오래된 버전을 백업 후 정리해 주세요.');
    versions.forEach(v => { if (!v || typeof v.id !== 'string' || typeof v.snap !== 'string' || v.snap.length > 8*1024*1024) fail('버전 형식 오류'); });
    return {schemaVersion:1, title:text(data.title || '새 일정','제목',500), cfg, rows, items, notes:clone(notes), now:finite(data.now ?? 0,'NOW',-1200,1200), versions:clone(versions)};
  }
  // AI analysis output (ISO dates, free-form ids) → validated document. Repairs instead of rejecting:
  // unknown rows fall back to the first row, bad colors to a palette, reversed ranges get a minimum length.
  function fromAnalysis(p, today) {
    p = p && typeof p === 'object' ? p : {};
    const day = v => { const m = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?/.exec(String(v || '')); if (!m) return null; const y = +m[1], mo = +m[2]; if (mo < 1 || mo > 12) return null; const dim = new Date(Date.UTC(y, mo, 0)).getUTCDate(); return {i: y * 12 + mo - 1, d: Math.min(Math.max(+(m[3] || 1), 1), dim), dim}; };
    const src = Array.isArray(p.items) ? p.items : [];
    const dates = [p.rangeStart, p.rangeEnd, ...src.flatMap(i => [i && i.start, i && i.end])].map(day).filter(Boolean);
    if (!dates.length) fail('일정 날짜를 찾지 못했습니다. 날짜나 기간이 보이는 자료를 사용하세요.');
    const first = Math.min(...dates.map(d => d.i));
    const off = v => { const d = day(v); return d ? d.i - first + (d.d - 1) / d.dim : null; };
    const hex = v => /^#[0-9a-f]{6}$/i.test(v || '') ? v : null;
    const str = (v, max) => String(v ?? '').slice(0, max);
    const rows = [], rowOf = new Map();
    (Array.isArray(p.rows) ? p.rows : []).slice(0, 200).forEach(r => { if (!r) return; const id = 'r' + (rows.length + 1), row = {id, name: str(r.name || r.id || id, 500)}; const color = rowColor(r.color); if (color) row.color = color; rows.push(row); for (const k of [r.id, r.name]) if (k && !rowOf.has(String(k))) rowOf.set(String(k), id); });
    if (!rows.length) rows.push({id: 'r1', name: str(p.title || '일정', 500)});
    const rowId = v => rowOf.get(String(v ?? '')) || rows[0].id;
    const palette = ['#5b3fd1', '#0078d4', '#17a2a2', '#f86800', '#1e3a8a', '#66707a'];
    const fallback = {marker: '#66707a', flag: '#e22a21', band: '#1e3a8a', sticky: '#fdf3d0'};
    const kinds = ['chev', 'plain', 'band', 'marker', 'flag', 'sticky'];
    const items = []; let stickies = 0, end = 0;
    src.slice(0, 5000).forEach((i, n) => {
      if (!i) return;
      const kind = kinds.includes(i.type) ? i.type : 'chev';
      const s = off(i.start) ?? off(i.end); if (s === null) return;
      let e = ['marker', 'flag', 'sticky'].includes(kind) ? s : (off(i.end) ?? s);
      if (['chev', 'plain', 'band'].includes(kind) && e <= s) e = s + 0.125;
      const it = {id: 'a' + (n + 1), kind, row: '', lane: Math.min(20, Math.max(0, Math.round(+i.lane || 0))), span: 1, s, e, label: str(i.label, 2000), memo: str(i.memo, 20000), color: hex(i.color) || fallback[kind] || palette[n % palette.length], variant: i.variant === 'tint' || (kind === 'plain' && i.variant !== 'solid') ? 'tint' : 'solid'};
      if (['chev', 'plain', 'flag'].includes(kind)) it.row = rowId(i.row);
      if (kind === 'band') { const a = rows.findIndex(r => r.id === rowId(i.row)), b = rows.findIndex(r => r.id === rowId(i.rowTo || i.row)); it.rowFrom = rows[Math.min(a, b)].id; it.rowTo = rows[Math.max(a, b)].id; it.row = it.rowFrom; it.lane = 0; }
      if (kind === 'sticky') { Object.assign(it, {y: 40 + stickies * 96, w: 240, h: 88}); stickies++; }
      if (i.hideDuration === true) it.hideDuration = true;
      end = Math.max(end, e); items.push(it);
    });
    const last = Math.max(first, ...dates.map(d => d.i));
    const months = Math.min(48, Math.max(1, last - first + 1, Math.ceil(end - 1e-9)));
    const now = off(p.now) ?? off(today);
    return validate({title: str(p.title || '가져온 일정', 500), cfg: {startY: Math.floor(first / 12), startM: first % 12 + 1, months, weekPx: 100, weekMode: 'actual', laneH: 44, magnet: true, overlap: 'moveOther'}, rows, items, notes: [], now: now !== null && now >= 0 && now <= months ? now : 0, versions: []});
  }
  function documentOf(s) { const d={schemaVersion:1}; for (const k of keys) d[k]=clone(s[k] ?? (['rows','items','notes','versions'].includes(k)?[]:null)); return d; }
  // Parses only data literals, never evaluates JavaScript (no functions, calls, getters, imports).
  function serializeFile(data) { return JSON.stringify({format:'mapstone',formatVersion:1,document:validate(data)}); }
  function parseFile(input) {
    if (typeof input !== 'string' || input.length > 8*1024*1024+100) fail('맵스톤 파일은 8MB 이하여야 합니다.');
    const file=JSON.parse(input);
    if (file.format === 'mapstone') { if (file.formatVersion !== 1) fail('지원하지 않는 맵스톤 파일 버전입니다.');return validate(file.document); }
    return validate(file);
  }
  function parseImport(input) {
    let s=String(input).trim().replace(/^```(?:javascript|js|json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
    s=s.replace(/^\s*(?:export\s+default\s+|(?:export\s+)?(?:const|let|var)\s+schedule\s*=\s*)/, '');
    let p=0, depth=0;
    const ws=()=> { while(p<s.length) { if (/\s/.test(s[p])) {p++;continue;} if(s.slice(p,p+2)==='//'){p=s.indexOf('\n',p);if(p<0)p=s.length;continue;} if(s.slice(p,p+2)==='/*'){let end=s.indexOf('*/',p+2);if(end<0)fail('주석이 닫히지 않았습니다.');p=end+2;continue;}break;} };
    function str(){ const q=s[p++]; let out=''; while(p<s.length){let c=s[p++];if(c===q)return out;if(c==='\\'){c=s[p++];const m={n:'\n',r:'\r',t:'\t',b:'\b',f:'\f',v:'\v','0':'\0'};if(c==='u'){const h=s.slice(p,p+4);if(!/^[0-9a-f]{4}$/i.test(h))fail('문자열 escape 오류');out+=String.fromCharCode(parseInt(h,16));p+=4;}else out+=m[c]??c;}else {if(c==='\n'||c==='\r')fail('문자열 줄바꿈은 \\n을 사용하세요.');out+=c;}}fail('문자열이 닫히지 않았습니다.'); }
    function value(){ws();if(++depth>40)fail('데이터 중첩이 너무 깊습니다.');let v;const c=s[p];
      if(c==='"'||c==="'")v=str();
      else if(c==='{'||c==='['){const obj=c==='{';v=obj?{}:[];p++;ws();while(s[p]!== (obj?'}':']')){if(p>=s.length)fail('데이터가 닫히지 않았습니다.');if(obj){ws();let k;if(s[p]==='"'||s[p]==="'")k=str();else{let m=/^[A-Za-z_$][\w$]*/.exec(s.slice(p));if(!m)fail('객체 키가 필요합니다.');k=m[0];p+=k.length;}if(['__proto__','constructor','prototype'].includes(k)||Object.hasOwn(v,k))fail('허용되지 않거나 중복된 키: '+k);ws();if(s[p++]!==':')fail('키 다음에 : 가 필요합니다.');v[k]=value();}else v.push(value());ws();if(s[p]===','){p++;ws();}else if(s[p]!== (obj?'}':']'))fail('데이터만 가져올 수 있습니다. 함수나 실행문은 지원하지 않습니다.');}p++;}
      else {const m=/^(?:true\b|false\b|null\b|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(s.slice(p));if(!m)fail('데이터 리터럴만 허용됩니다. 함수·계산식·외부 호출을 제거해 주세요.');v=JSON.parse(m[0]);p+=m[0].length;}depth--;return v;}
    if(s.length>8*1024*1024)fail('가져오기 파일은 8MB 이하여야 합니다.');
    const result=value();ws();if(s[p]===';'){p++;ws();}if(p!==s.length)fail('일정 객체 뒤에 실행문을 넣을 수 없습니다.');return validate(result);
  }
  // Three-way merge by entity ID and field. Conflicts never silently overwrite.
  function merge(base, local, remote) {
    const conflicts=[];
    function walk(b,l,r,path){
      if(equal(l,r))return cloneOr(l);if(equal(b,l))return cloneOr(r);if(equal(b,r))return cloneOr(l);
      if(l && r && b && !Array.isArray(l) && typeof l==='object' && typeof r==='object' && typeof b==='object'){
        const out={};for(const k of new Set([...Object.keys(b),...Object.keys(l),...Object.keys(r)])){const v=walk(b[k],l[k],r[k],path+'.'+k);if(v!==undefined)out[k]=v;}return out;
      }
      if(['rows','items','notes','versions'].includes(path) && [b,l,r].every(Array.isArray)){
        const bm=new Map(b.map(x=>[x.id,x])),lm=new Map(l.map(x=>[x.id,x])),rm=new Map(r.map(x=>[x.id,x]));
        const bo=b.map(x=>x.id),lo=l.map(x=>x.id),ro=r.map(x=>x.id);
        const existing=bo.filter(id=>lm.has(id)&&rm.has(id));
        const orderOf=a=>a.filter(id=>existing.includes(id));
        const reorderedL=!equal(orderOf(bo),orderOf(lo)),reorderedR=!equal(orderOf(bo),orderOf(ro));
        if(reorderedL&&reorderedR&&!equal(orderOf(lo),orderOf(ro)))conflicts.push(path+'.order');
        const order=[...new Set([...(reorderedL?lo:ro),...lo,...ro,...bo])];
        return order.map(id=>walk(bm.get(id),lm.get(id),rm.get(id),path+'['+id+']')).filter(x=>x!==undefined);
      }
      conflicts.push(path);return cloneOr(l);
    }
    const cloneOr=x=>x===undefined?undefined:clone(x);
    const document={schemaVersion:1};for(const k of keys)document[k]=walk(base[k],local[k],remote[k],k);
    if(!conflicts.length){try{return {document:validate(document),conflicts};}catch(e){conflicts.push('구조: '+e.message);}}
    return {document,conflicts};
  }
  return {validate,parseImport,parseFile,serializeFile,fromAnalysis,documentOf,merge,clone,equal,uid,rowColors,syncLinks};
});
