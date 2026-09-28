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
const scheduleSchema={type:'object',additionalProperties:false,required:['title','startYear','startMonth','months','rows','items'],properties:{
  title:{type:'string'},startYear:{type:'integer',minimum:1900,maximum:2200},startMonth:{type:'integer',minimum:1,maximum:12},months:{type:'integer',minimum:1,maximum:48},
  rows:{type:'array',minItems:1,maxItems:80,items:{type:'object',additionalProperties:false,required:['id','name'],properties:{id:{type:'string'},name:{type:'string'}}}},
  items:{type:'array',maxItems:1000,items:{type:'object',additionalProperties:false,required:['id','row','start','end','label','type','memo','hideDuration'],properties:{id:{type:'string'},row:{type:'string'},start:{type:'number'},end:{type:'number'},label:{type:'string'},type:{type:'string',enum:['chev','plain','flag']},memo:{type:'string'},hideDuration:{type:'boolean'}}}}
}};
function outputText(response:any){for(const item of response.output||[])for(const content of item.content||[])if(content.type==='output_text'&&typeof content.text==='string')return content.text;throw new Error('ai_output_missing');}
async function analyzeImage(image:string){
  const key=Deno.env.get('OPENAI_API_KEY');if(!key)throw new Error('ai_not_configured');
  if(typeof image!=='string'||image.length>2800000||!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(image))throw new Error('invalid_image');
  const prompt='이미지의 프로젝트 일정표를 Mapstone 데이터로 변환하세요. 표의 행 이름과 작업명을 원문 언어로 보존하세요. start/end는 전체 시작 월을 0으로 한 개월 단위 숫자이며 5개월 미만 일정은 0.125 단위로 맞추세요. 종료는 시작보다 커야 합니다. 날짜를 읽을 수 없으면 시각적 위치로 합리적으로 추정하고 memo에 추정이라고 기록하세요. id는 영문 소문자, 숫자, 하이픈만 사용하고 모두 고유하게 만드세요. 일반 작업은 chev, 설명성 작업은 plain, 단일 이슈는 flag를 사용하세요.';
  const ai=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({model:Deno.env.get('OPENAI_VISION_MODEL')||'gpt-4.1-mini',store:false,input:[{role:'user',content:[{type:'input_text',text:prompt},{type:'input_image',image_url:image,detail:'high'}]}],text:{format:{type:'json_schema',name:'mapstone_schedule',strict:true,schema:scheduleSchema}}})});
  const raw=await ai.json();if(!ai.ok)throw new Error('ai_request_failed:'+String(raw?.error?.message||ai.status));
  const parsed=JSON.parse(outputText(raw));const colors=['#5b3fd1','#0078d4','#17a2a2','#f86800','#e22a21','#66707a'];
  const document={schemaVersion:1,title:parsed.title,cfg:{startY:parsed.startYear,startM:parsed.startMonth,months:parsed.months,weekPx:100,weekMode:'actual',laneH:44,magnet:true,overlap:'moveOther'},rows:parsed.rows,items:parsed.items.map((it:any,n:number)=>({id:it.id,kind:it.type,row:it.row,lane:0,span:1,s:it.start,e:it.type==='flag'?it.start:it.end,label:it.label,color:colors[n%colors.length],variant:'solid',memo:it.memo,hideDuration:it.hideDuration})),notes:[],now:0,versions:[]};
  return Core.validate(document);
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
    if(path.length===1&&path[0]==='analyze-image'&&req.method==='POST'){const body=await readBody(req);return json({document:await analyzeImage(body.image)});}
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
  }catch(e){const message=e instanceof Error?e.message:'unknown';if(message==='database_error')return json({error:'DB 요청에 실패했습니다. 잠시 후 다시 시도하세요.'},503);if(message==='body_too_large')return json({error:'요청은 9MB 이하여야 합니다.'},413);if(message==='ai_not_configured')return json({error:'이미지 분석 API가 아직 설정되지 않았습니다. 관리자에게 문의하세요.'},503);if(message==='invalid_image')return json({error:'2MB 이하 PNG/JPEG/WebP 이미지를 사용하세요.'},400);if(message.startsWith('ai_request_failed:'))return json({error:'이미지 분석에 실패했습니다. 잠시 후 다시 시도하세요.'},502);return json({error:message==='invalid_json'?'JSON 형식을 확인하세요.':message},400);}
});
