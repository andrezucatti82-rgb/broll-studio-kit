import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {parseHTML} from 'linkedom';

const root=new URL('../style-atlas/dist/',import.meta.url);
const read=name=>readFile(new URL(name,root),'utf8');
// DOM integration tests: no layout engine, playback, canvas export or browser QA implied.
async function boot({page=false,saved=null}={}){
 const {document,window:dom}=parseHTML(await read('index.html'));
 const errors=[],store=new Map(saved?[['video-multimarcas-atlas-v1',JSON.stringify(saved)]]:[]);
 let state=saved,storageReads=0;
 function patchSelect(el){
  Object.defineProperty(el,'value',{configurable:true,get(){return this._value??this.querySelector('option')?.value??''},set(v){this._value=String(v)}});
  Object.defineProperty(el,'options',{get(){return [...this.querySelectorAll('option')]}});
 }
 for(const el of document.querySelectorAll('select'))patchSelect(el);
 const create=document.createElement.bind(document);document.createElement=(tag,...args)=>{const el=create(tag,...args);if(tag==='select')patchSelect(el);el.focus=()=>{};return el};
 for(const el of document.querySelectorAll('dialog')){el.show=function(){this.open=true};el.showModal=el.show;el.close=function(){const was=this.open;this.open=false;if(was)this.dispatchEvent(new dom.Event('close'))};}
 for(const el of document.querySelectorAll('*')){el.focus=()=>{};el.scrollIntoView=()=>{};el.reportValidity=()=>true;}
 const events=new dom.EventTarget();
 const ctx={document,Event:dom.Event,URL,URLSearchParams,Blob,console:{error:e=>errors.push(e)},setTimeout,clearTimeout,
  location:{search:'',hash:''},matchMedia:()=>({matches:true,addEventListener(){}}),requestAnimationFrame:()=>0,cancelAnimationFrame(){},
  scrollTo(){},confirm:()=>true,FontFace:class{load(){return Promise.resolve(this)}},
  fetch:async name=>({ok:true,json:async()=>JSON.parse(await read(String(name)))}),
  navigator:{clipboard:{writeText:async text=>{ctx.copied=text}}},
  localStorage:{getItem(k){storageReads++;return store.get(k)||null},setItem(k,v){store.set(k,v)},removeItem(k){store.delete(k)}},
  addEventListener:(...a)=>events.addEventListener(...a),dispatchEvent:(...a)=>events.dispatchEvent(...a),
  ATLAS_PAGE_MODE:page,openai:{widgetState:saved,setWidgetState:async x=>{state=x}}
 };
 document.fonts={add(){}};ctx.window=ctx;ctx.globalThis=ctx;
 vm.createContext(ctx);
 for(const name of ['workflow.js','gallery-views.js','app-shell.js','app.js'])vm.runInContext(await read(name),ctx,{filename:name});
 for(let i=0;i<150&&!ctx.ATLAS_READY&&!errors.length;i++)await new Promise(r=>setTimeout(r,10));
 assert.equal(errors.map(e=>e.stack).join('\n'),'');assert.equal(ctx.ATLAS_READY,true,'app initialized');
 const click=selector=>{const el=document.querySelector(selector);assert.ok(el,selector);el.dispatchEvent(new dom.Event('click',{bubbles:true}));};
 const change=(id,value)=>{const el=document.getElementById(id);el.value=value;el.dispatchEvent(new dom.Event('change',{bubbles:true}));};
 return {ctx,document,click,change,store,getState:()=>state,getStorageReads:()=>storageReads,errors};
}

test('app: choose ten, prepare 90 seconds, keep technical prompt collapsed, persist and resume',async()=>{
 const app=await boot();const {document:d,ctx,click,change}=app;
 const ids=[...d.querySelectorAll('#grid [data-choose]')].slice(0,11).map(x=>x.dataset.choose);
 for(const id of ids)click(`#grid [data-choose="${id}"]`);
 assert.equal(ctx.AtlasCurrentChoice().selectedStyles.length,10);
 click('#openBrief');assert.equal(d.body.dataset.view,'brief');
 change('topic','<script>alert(1)</script> Um agente de IA');change('duration','custom');change('customDuration','90');
 d.getElementById('briefForm').dispatchEvent(new ctx.Event('submit',{bubbles:true,cancelable:true}));
 await new Promise(r=>setTimeout(r,20));
 assert.equal(d.getElementById('briefDialog').dataset.stage,'review');
 assert.equal(d.getElementById('promptDetails').hasAttribute('open'),false);
 assert.equal(d.querySelectorAll('#requestSummary script').length,0);
 assert.match(d.getElementById('promptOutput').value,/Duração alvo: 90 segundos/);
 click('#copyPrompt');await new Promise(r=>setTimeout(r,10));assert.match(ctx.copied,/SEQUÊNCIA VISUAL/);
 const saved=JSON.parse(app.store.get('video-multimarcas-atlas-v1'));
 const resumed=await boot({saved});assert.equal(resumed.ctx.AtlasCurrentChoice().targetDurationSeconds,90);
 assert.equal(resumed.ctx.AtlasCurrentChoice().selectedStyles.length,10);
 resumed.click('#openBrief');assert.equal(resumed.document.getElementById('briefDialog').dataset.stage,'review');
 assert.deepEqual(app.errors,[]);
});
test('Page mode never reads localStorage; 30 second choice saved using widget state',async()=>{
 const app=await boot({page:true});app.click('#grid [data-choose]');app.change('topic','Tema demonstrativo');app.change('duration','30');
 app.document.getElementById('briefForm').dispatchEvent(new app.ctx.Event('submit',{bubbles:true,cancelable:true}));
 await new Promise(r=>setTimeout(r,20));assert.equal(app.getStorageReads(),0);assert.equal(app.getState().modelContent.targetDurationSeconds,30);
 assert.equal(app.getState().modelContent.selectedStyles.length,1);
 app.click('#videoFilter');assert.equal(app.document.querySelectorAll('#grid .card').length,6);
});

test('Page migration retains 4.1 favourites and resets approvals when reference images change',async()=>{
 const original=await boot({page:true});original.click('#grid [data-choose]');
 const c=JSON.parse(JSON.stringify(original.ctx.AtlasCurrentChoice()));
 c.topic='Projeto salvo';c.requestPrepared=true;c.catalogVersion='4.1';
 c.selectedStyles[0].referenceFrame.path='assets/old-style-atlas.webp';
 for(const v of Object.values(c.projectState.approvals))v.status='approved';
 for(const v of Object.values(c.projectState.preProductionApprovals))v.status='approved';
 c.projectState.history=[{etapa:'sample',estado:'aguardando_aprovacao',versao:1,custoInformadoUSD:0.4,resumo:'Amostra antiga',pendencias:[]}];
 const resumed=await boot({page:true,saved:{modelContent:c,privateContent:{catalogVersion:'4.1',favoriteBits:'100'}}});
 const after=resumed.ctx.AtlasCurrentChoice();
 assert.equal(after.requestPrepared,false);
 assert.equal(after.projectState.history[0].resumo,'Amostra antiga');
 assert.ok(Object.values(after.projectState.approvals).every(v=>v.status==='pending'));
 assert.ok(Object.values(after.projectState.preProductionApprovals).every(v=>v.status==='pending'));
 resumed.click('#favoriteFilter');assert.equal(resumed.document.querySelectorAll('#grid .card').length,1);
 assert.equal(resumed.getStorageReads(),0);
});

test('hybrid categories: all 18 remain reachable, group visuals and style shortcuts share catalogue state',async()=>{
 const {document:d,ctx,click}=await boot();
 assert.equal(ctx.AtlasNavigation.groups.flatMap(g=>g.families).length,18);
 assert.equal(new Set(ctx.AtlasNavigation.groups.flatMap(g=>g.families)).size,18);
 assert.equal(d.querySelectorAll('#categoryGroups [data-nav-family]').length,18);
 assert.equal(d.querySelectorAll('#categoryTiles [data-visual-family]').length,6);
 click('[data-nav-family="cinema"]');
 assert.equal(d.querySelectorAll('#grid .card').length,40);
 assert.equal(d.querySelectorAll('.category-shortcuts [data-nav-style]').length,3);
 assert.match(d.getElementById('categoryResultsTitle').textContent,/Cinema e fotografia/);
 click('[data-nav-style="publicidade-cinematografica"]');
 assert.equal(d.getElementById('detailDialog').open,true);
 assert.match(d.getElementById('detailContent').textContent,/Publicidade cinematográfica/);
 d.getElementById('detailDialog').close();
 click('[data-nav-group="business"]');
 assert.equal(d.querySelectorAll('#categoryTiles [data-visual-family]').length,8);
 click('[data-visual-family="software"]');
 assert.equal(d.getElementById('familySelect').value,'software');
 assert.equal(d.querySelectorAll('#grid .card').length,40);
 assert.equal(d.querySelector('[data-nav-family="software"]').getAttribute('aria-current'),'true');
 assert.equal(ctx.AtlasCurrentChoice().selectedStyles.length,0,'navigation does not change the brief');
 click('.category-all');assert.equal(d.getElementById('familySelect').value,'');
 assert.equal(d.querySelectorAll('#grid .card').length,24);
});
test('hybrid category search, mobile drawer, focus target and Page mode without localStorage',async()=>{
 const app=await boot({page:true});const {document:d,ctx,click}=app;
 const input=d.getElementById('categorySearch');input.value='saude';input.dispatchEvent(new ctx.Event('input'));
 assert.equal(d.querySelectorAll('#categoryGroups [data-nav-family]').length,1);
 assert.equal(d.querySelector('#categoryGroups [data-nav-family]').dataset.navFamily,'saude');
 input.value='<script>invalid</script>';input.dispatchEvent(new ctx.Event('input'));
 assert.equal(d.getElementById('categoryNoResults').hidden,false);
 assert.equal(d.querySelectorAll('#categoryGroups script').length,0);
 input.value='';input.dispatchEvent(new ctx.Event('input'));
 click('#openCategories');assert.equal(d.getElementById('categoryDrawer').open,true);
 assert.equal(d.getElementById('categorySidebar').parentNode.id,'categoryDrawer');
 click('[data-nav-family="avatares"]');click('#exploreCategory');
 assert.equal(d.getElementById('categoryDrawer').open,false);
 assert.equal(d.getElementById('categorySidebar').parentNode.id,'sidebarHome');
 assert.equal(d.getElementById('openCategories').getAttribute('aria-expanded'),'false');
 assert.equal(d.getElementById('familySelect').value,'avatares');
 assert.equal(app.getStorageReads(),0);
});
