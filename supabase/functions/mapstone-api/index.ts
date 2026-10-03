// The gateway JWT check is disabled because every route below verifies a random
// editor capability or administrator token. Neither secret is put in a URL/log.
import './mapstone-core.js';
const Core = (globalThis as any).MapstoneCore;
const url = Deno.env.get('SUPABASE_URL')!;
const secret = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'content-type,x-mapstone-code,x-mapstone-admin,x-mapstone-password', 'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS', 'Cache-Control': 'no-store', 'Vary':'Origin' };
const hash = async (s: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))).map(v=>v.toString(16).padStart(2,'0')).join('');
const newCode = () => Array.from(crypto.getRandomValues(new Uint8Array(24))).map(v=>v.toString(16).padStart(2,'0')).join('');
const json = (body: unknown, status=200) => new Response(JSON.stringify(body), {status,headers:{...cors,'Content-Type':'application/json'}});
async function db(path:string,method='GET',body?:unknown) {
  const res=await fetch(url+'/rest/v1/'+path,{method,headers:{apikey:secret,Authorization:'Bearer '+secret,'Content-Type':'application/json',Prefer:'return=representation'},body:body===undefined?undefined:JSON.stringify(body)});
  if(!res.ok)throw new Error('database_error');
  return res.status===204?null:await res.json();
}
async function readBody(req:Request) {
  const reader=req.body?.getReader();if(!reader)return {};
  const parts:Uint8Array[]=[];let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>9*1024*1024){await reader.cancel();throw new Error('body_too_large');}parts.push(value);}
  const bytes=new Uint8Array(size);let off=0;for(const p of parts){bytes.set(p,off);off+=p.length;}
  try{return JSON.parse(new TextDecoder().decode(bytes));}catch{throw new Error('invalid_json');}
}
const publicRoom=(r:any)=>({id:r.id,title:r.title,document:r.document,revision:r.revision,updated_at:r.updated_at,archived:r.archived});
const validId=(s:string)=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
async function getRoom(id:string){const rs=await db('mapstone_rooms?id=eq.'+id);return rs[0];}
async function saveRoom(room:any,document:any,expected:number) {
  const normalized=Core.validate(document);
  const updated=await db('mapstone_rooms?id=eq.'+room.id+'&revision=eq.'+expected+'&archived=eq.false','PATCH',{document:normalized,title:normalized.title});
  if(!updated?.length){const current=await getRoom(room.id);return json({error:'다른 사용자의 수정이 먼저 저장되었습니다.',room:current?publicRoom(current):null},409);}
  return json(publicRoom(updated[0]));
}
const str={type:'string'},nstr={type:['string','null']};
const scheduleSchema={type:'object',additionalProperties:false,required:['title','rangeStart','rangeEnd','now','rows','items'],properties:{
  title:str,rangeStart:nstr,rangeEnd:nstr,now:nstr,
  rows:{type:'array',items:{type:'object',additionalProperties:false,required:['id','name','color'],properties:{id:str,name:str,color:str}}},
  items:{type:'array',items:{type:'object',additionalProperties:false,required:['type','row','rowTo','lane','start','end','label','memo','color','variant','hideDuration'],properties:{
    type:{type:'string',enum:['chev','plain','band','marker','flag','sticky']},row:str,rowTo:str,lane:{type:'integer'},start:str,end:str,label:str,memo:str,color:str,variant:{type:'string',enum:['solid','tint']},hideDuration:{type:'boolean'}}}}
}};
const analysisPrompt=`첨부한 자료(이미지 또는 텍스트)에 담긴 프로젝트 일정·마일스톤·로드맵을 Mapstone 일정 데이터로 변환하세요. 간트 차트, 로드맵, 표, 슬라이드, 손그림, 회의록, 메일, PRD, 엑셀 복사본 등 형식은 무엇이든 될 수 있습니다.
읽을 수 있는 정보는 빠짐없이 옮기세요. 요약하거나 생략하지 말고, 원문 언어와 표기를 그대로 보존하세요.
- rows: 구분 행(팀, 트랙, 시스템, 단계 그룹 등). 행 이름은 원문 그대로. 행 배경색이 있으면 #RRGGBB, 없으면 "".
- chev: 기간이 있는 일반 작업·단계·스프린트.
- plain: 설명성·참고성 기간(예: 협의 기간, 준비 기간, 옅게 표시된 구간).
- band: 여러 행에 걸친 공통 구간(프리즈, 안정화, 휴가, 감사 기간 등). row는 시작 행, rowTo는 끝 행.
- marker: 전체 공통 마일스톤(세로선, 상단 ◆·▼·★, 오픈·릴리스·킥오프·게이트 등 특정 날짜). row와 rowTo는 "".
- flag: 특정 행에만 속한 마일스톤·이슈·체크포인트(행 안의 ◆, ●, ! 등). end는 start와 같게.
- sticky: 범례, 주석, 비고, 전제, 리스크, 담당자 메모 등 일정에 묶이지 않는 텍스트. row는 "", start는 관련 시점 또는 전체 시작일.
- 날짜는 모두 YYYY-MM-DD. 연도가 없으면 자료의 맥락으로 추정하고, 일(day)을 모르면 월 초 01(종료는 말일)을 사용하세요. 날짜가 전혀 없으면 축·눈금·위치로 합리적으로 추정하고 memo에 "날짜 추정"을 남기세요.
- end는 작업이 끝나는 날짜이며 start보다 늦어야 합니다.
- 같은 행에서 기간이 겹치는 항목은 lane을 0, 1, 2…로 나누고, 겹치지 않으면 0을 사용하세요. 자료에서 위아래로 쌓여 있으면 그 순서를 lane으로 보존하세요.
- label에는 표시된 작업명, memo에는 담당자·상태·진척률·산출물·비고·세부 설명 등 그 항목에 대한 나머지 정보를 모두 담으세요.
- color: 자료에 보이는 색과 가장 가까운 #RRGGBB, 알 수 없으면 "". variant는 진한 채움이면 solid, 옅거나 테두리만 있으면 tint.
- hideDuration은 기본 false.
- rangeStart/rangeEnd: 자료에 보이는 전체 시간축의 처음과 끝(없으면 null 또는 ""). now: 오늘·NOW·현재 표시선이 있으면 그 날짜(없으면 null 또는 "").
- title: 자료의 제목, 없으면 내용을 대표하는 짧은 제목.`;
function outputText(response:any){for(const item of response.output||[])for(const content of item.content||[])if(content.type==='output_text'&&typeof content.text==='string')return content.text;throw new Error('ai_output_missing');}
// Gemini's JSON schema subset: no nullable unions or additionalProperties, so empty strings stand in for null.
const geminiSchema=JSON.parse(JSON.stringify(scheduleSchema,(k,v)=>k==='additionalProperties'?undefined:k==='type'&&Array.isArray(v)?v[0]:v));
async function askOpenAI(key:string,content:any[]){
  const ai=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({model:Deno.env.get('OPENAI_VISION_MODEL')||'gpt-4.1-mini',store:false,input:[{role:'user',content}],text:{format:{type:'json_schema',name:'mapstone_schedule',strict:true,schema:scheduleSchema}}})});
  const raw=await ai.json();if(!ai.ok)throw new Error('ai_request_failed:'+String(raw?.error?.message||ai.status));return outputText(raw);
}
async function askGemini(key:string,content:any[]){
  const parts=content.map(c=>c.type==='input_image'?(([,mime,data])=>({inline_data:{mime_type:mime,data}}))(/^data:([^;]+);base64,(.*)$/.exec(c.image_url)!):{text:c.text});
  const model=Deno.env.get('GEMINI_MODEL')||'gemini-2.5-flash';
  const ai=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(model)+':generateContent',{method:'POST',headers:{'x-goog-api-key':key,'Content-Type':'application/json'},body:JSON.stringify({contents:[{role:'user',parts}],generationConfig:{responseMimeType:'application/json',responseJsonSchema:geminiSchema}})});
  const raw=await ai.json();if(!ai.ok)throw new Error('ai_request_failed:'+String(raw?.error?.message||ai.status));
  const text=(raw.candidates?.[0]?.content?.parts||[]).map((p:any)=>p.text||'').join('');if(!text)throw new Error('ai_output_missing');return text;
}
async function analyze(body:any){
  const gemini=Deno.env.get('GEMINI_API_KEY'),openai=Deno.env.get('OPENAI_API_KEY');if(!gemini&&!openai)throw new Error('ai_not_configured');
  const image=body.image,text=body.text,content:any[]=[{type:'input_text',text:analysisPrompt}];
  if(image!==undefined){if(typeof image!=='string'||image.length>2800000||!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(image))throw new Error('invalid_image');content.push({type:'input_image',image_url:image,detail:'high'});}
  if(text!==undefined){if(typeof text!=='string'||!text.trim()||text.length>200000)throw new Error('invalid_text');content.push({type:'input_text',text:'--- 자료 시작 ---\n'+text+'\n--- 자료 끝 ---'});}
  if(content.length<2)throw new Error('invalid_text');
  const out=gemini?await askGemini(gemini,content):await askOpenAI(openai!,content);
  let parsed;try{parsed=JSON.parse(out);}catch{throw new Error('ai_output_missing');}
  return Core.fromAnalysis(parsed,new Date().toISOString().slice(0,10));
}
Deno.serve(async (req:Request)=>{
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
  try{
    const u=new URL(req.url),parts=u.pathname.split('/').filter(Boolean);const start=parts.indexOf('mapstone-api');const path=parts.slice(start+1);
    if(path[0]==='share'&&path.length===1&&req.method==='POST'){
      const body=await readBody(req),password=String(body.password||'');
      if(password.length<6||password.length>128)return json({error:'접속 암호는 6~128자로 설정하세요.'},400);
      if(!['view','edit'].includes(body.permission))return json({error:'공유 권한은 보기 또는 편집이어야 합니다.'},400);
      const document=Core.validate(body.document),code=newCode();
      const rows=await db('mapstone_rooms','POST',{code_hash:await hash(code),guest_password_hash:await hash(password),guest_permission:body.permission,title:document.title,document});
      return json({id:rows[0].id,code,permission:body.permission},201);
    }
    if(path[0]==='share'&&validId(path[1]||'')){
      if(path[2]==='settings'&&req.method==='PATCH'){
        const code=req.headers.get('X-Mapstone-Code')||'',body=await readBody(req),password=String(body.password||'');
        if(!/^[A-Za-z0-9_-]{24,128}$/.test(code))return json({error:'공유 관리자 코드가 필요합니다.'},401);
        const owners=await db('mapstone_rooms?id=eq.'+path[1]+'&code_hash=eq.'+await hash(code)+'&archived=eq.false');if(!owners.length)return json({error:'공유 관리자 코드가 올바르지 않습니다.'},401);
        if(password.length<6||password.length>128||!['view','edit'].includes(body.permission))return json({error:'암호와 공유 권한을 확인하세요.'},400);
        await db('mapstone_rooms?id=eq.'+path[1],'PATCH',{guest_password_hash:await hash(password),guest_permission:body.permission});return json({id:path[1],permission:body.permission});
      }
      const password=req.headers.get('X-Mapstone-Password')||'';
      const guests=await db('mapstone_rooms?id=eq.'+path[1]+'&guest_password_hash=eq.'+await hash(password)+'&archived=eq.false');
      const guest=guests[0];if(!guest)return json({error:'접속 암호가 올바르지 않습니다.'},401);
      if(req.method==='GET'){if(u.searchParams.get('after')===String(guest.revision))return new Response(null,{status:304,headers:cors});return json({...publicRoom(guest),permission:guest.guest_permission});}
      if(req.method==='PUT'){if(guest.guest_permission!=='edit')return json({error:'보기 전용 공유입니다.'},403);const body=await readBody(req);return await saveRoom(guest,body.document,body.revision);}
      return json({error:'지원하지 않는 공유 요청입니다.'},405);
    }
    const adminToken=req.headers.get('X-Mapstone-Admin')||'';
    if(path[0]==='rooms'){
      if(!/^[a-f0-9]{64}$/.test(adminToken))return json({error:'관리자 키가 필요합니다.'},401);
      const admins=await db('mapstone_admin?id=eq.true&key_hash=eq.'+await hash(adminToken)+'&select=id');
      if(!admins.length)return json({error:'관리자 키가 올바르지 않습니다.'},401);
      if(path.length===1&&req.method==='GET')return json(await db('mapstone_rooms?select=id,title,revision,archived,created_at,updated_at&order=updated_at.desc&limit=500'));
      if(path.length===1&&req.method==='POST'){
        const body=await readBody(req),document=Core.validate(body.document),code=newCode();const rows=await db('mapstone_rooms','POST',{code_hash:await hash(code),title:document.title,document});return json({...publicRoom(rows[0]),code},201);
      }
      if(!validId(path[1]||''))return json({error:'올바른 일정 ID가 필요합니다.'},400);
      const room=await getRoom(path[1]);if(!room)return json({error:'일정을 찾을 수 없습니다.'},404);
      if(path.length===2&&req.method==='GET')return json(publicRoom(room));
      if(path.length===2&&req.method==='PATCH'){
        const body=await readBody(req);if(typeof body.archived!=='boolean')return json({error:'archived 값이 필요합니다.'},400);
        const rows=await db('mapstone_rooms?id=eq.'+room.id,'PATCH',{archived:body.archived});return json(publicRoom(rows[0]));
      }
      if(path[2]==='rotate'&&req.method==='POST'){
        const code=newCode();await db('mapstone_rooms?id=eq.'+room.id,'PATCH',{code_hash:await hash(code)});return json({id:room.id,code});
      }
      if(path[2]==='history'&&req.method==='GET')return json(await db('mapstone_history?room_id=eq.'+room.id+'&select=revision,created_at&order=revision.desc&limit=100'));
      if(path[2]==='restore'&&req.method==='POST'){
        const body=await readBody(req);if(!Number.isSafeInteger(body.revision)||!Number.isSafeInteger(body.expectedRevision))return json({error:'revision과 expectedRevision이 필요합니다.'},400);
        const history=await db('mapstone_history?room_id=eq.'+room.id+'&revision=eq.'+body.revision);if(!history.length)return json({error:'해당 이력이 없습니다.'},404);
        return await saveRoom(room,history[0].document,body.expectedRevision);
      }
      return json({error:'지원하지 않는 관리자 요청입니다.'},405);
    }
    const code=req.headers.get('X-Mapstone-Code')||'';
    if(!/^[A-Za-z0-9_-]{24,128}$/.test(code))return json({error:'접속 코드가 필요합니다.'},401);
    const rooms=await db('mapstone_rooms?code_hash=eq.'+await hash(code)+'&archived=eq.false');
    const room=rooms[0];if(!room)return json({error:'접속 코드가 올바르지 않거나 보관된 일정입니다.'},401);
    if(path.length===1&&['analyze','analyze-image'].includes(path[0])&&req.method==='POST'){const body=await readBody(req);return json({document:await analyze(body)});}
    if(path.length!==1||path[0]!=='room')return json({error:'존재하지 않는 경로입니다.'},404);
    if(req.method==='GET'){
      if(u.searchParams.get('after')===String(room.revision))return new Response(null,{status:304,headers:cors});
      return json(publicRoom(room));
    }
    if(req.method==='PUT'){
      const body=await readBody(req);if(!Number.isSafeInteger(body.revision)||body.revision<1)return json({error:'현재 revision이 필요합니다.'},400);
      return await saveRoom(room,body.document,body.revision);
    }
    return json({error:'지원하지 않는 요청입니다.'},405);
  }catch(e){const message=e instanceof Error?e.message:'unknown';if(message==='database_error')return json({error:'DB 요청에 실패했습니다. 잠시 후 다시 시도하세요.'},503);if(message==='body_too_large')return json({error:'요청은 9MB 이하여야 합니다.'},413);if(message==='ai_not_configured')return json({error:'AI 분석 API가 아직 설정되지 않았습니다. 관리자에게 문의하세요.'},503);if(message==='invalid_image')return json({error:'2MB 이하 PNG/JPEG/WebP 이미지를 사용하세요.'},400);if(message==='invalid_text')return json({error:'분석할 내용은 1~200,000자여야 합니다.'},400);if(message.startsWith('ai_request_failed:')){console.error(message);return json({error:'AI 분석에 실패했습니다: '+message.slice(18,300)},502);}if(message==='ai_output_missing')return json({error:'AI가 일정 데이터를 돌려주지 않았습니다. 다시 시도하거나 더 선명한 자료를 사용하세요.'},502);return json({error:message==='invalid_json'?'JSON 형식을 확인하세요.':message},400);}
});
