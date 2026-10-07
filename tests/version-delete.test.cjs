const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),C=require('../mapstone-core.js');
const crypto=require('node:crypto').webcrypto;
test('Version deletion checks owner and ID before hiding the exact version and excludes it from reads',async()=>{
 let handler,allow=true,deleted=false;const writes=[];
 const source=require('node:module').stripTypeScriptTypes(fs.readFileSync('supabase/functions/mapstone-api/index.ts','utf8').replace("import './mapstone-core.js';",''));
 vm.runInNewContext(source,{MapstoneCore:C,crypto,TextEncoder,URL,Response,Date,Error,Deno:{env:{get:()=> 'mock'},serve:fn=>handler=fn},fetch:async(url,options)=>{
   if(url.includes('mapstone_version_projects?'))return Response.json(allow?[{id:'project'}]:[]);
   if(options.method==='PATCH'){writes.push({url,body:JSON.parse(options.body)});deleted=true;return Response.json([{id:'one'}]);}
   return Response.json(deleted&&url.includes('deleted_at=is.null')?[]:[{id:'one'}]);
 }});
 const base='http://local/mapstone-api/version-projects/11111111-1111-4111-8111-111111111111/versions',headers={'X-Mapstone-Code':'a'.repeat(48)};
 assert.equal((await handler(new Request(base+'/one',{method:'DELETE'}))).status,401);
 allow=false;assert.equal((await handler(new Request(base+'/one',{method:'DELETE',headers}))).status,404);assert.equal(writes.length,0);
 allow=true;assert.equal((await handler(new Request(base+'/bad%20id',{method:'DELETE',headers}))).status,400);assert.equal(writes.length,0);
 const res=await handler(new Request(base+'/one',{method:'DELETE',headers}));assert.equal(res.status,200);assert.deepEqual(await res.json(),{id:'one',deleted:true});assert.equal(writes.length,1);assert.ok(writes[0].body.deleted_at);assert.match(writes[0].url,/project_id=eq\..*&id=eq\.one&deleted_at=is.null/);
 assert.deepEqual(await (await handler(new Request(base,{headers}))).json(),[]);assert.equal((await handler(new Request(base+'/one',{headers}))).status,404);
 assert.match((await handler(new Request(base,{method:'OPTIONS'}))).headers.get('Access-Control-Allow-Methods'),/DELETE/);
});
