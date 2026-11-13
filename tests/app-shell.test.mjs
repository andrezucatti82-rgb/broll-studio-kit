import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {parseHTML} from 'linkedom';

const root=new URL('../style-atlas/dist/',import.meta.url);
const read=name=>readFile(new URL(name,root),'utf8');
// DOM integration tests: no layout engine, playback, canvas export or browser QA implied.
async function boot({page=false,saved=null,hash=""}={}){
 const {document,window:dom}=parseHTML(await read('index.html'));
 const errors=[],store=new Map(saved?[['video-multimarcas-atlas-v1',JSON.stringify(saved)]]:[]);
 let state=saved,storageReads=0;
 function patchSelect(el){
  Object.defineProperty(el,'value',{configurable:true,get(){return this._value??this.querySelector('option')?.value??''},set(v){this._value=String(v)}});
  Object.defineProperty(el,'options',{get(){return [...this.querySelectorAll('option')]}});
 }
 for(const el of document.querySelectorAll('select'))patchSelect(el);
 const create=document.createElement.bind(document);document.createElement=(tag,...args)=>{const el=create(tag,...args);if(tag==='select')patchSelect(el);if(tag==='dialog'){el.showModal=function(){this.open=true};el.close=function(){this.open=false}}el.focus=()=>{};return el};
 for(const el of document.querySelectorAll('dialog')){el.show=function(){this.open=true};el.showModal=el.show;el.close=function(){const was=this.open;this.open=false;if(was)this.dispatchEvent(new dom.Event('close'))};}
 for(const el of document.querySelectorAll('*')){el.focus=()=>{};el.scrollIntoView=()=>{};el.reportValidity=()=>true;}
 document.getElementById('briefForm').requestSubmit=function(){this.dispatchEvent(new dom.Event('submit',{bubbles:true,cancelable:true}))};
 const events=new dom.EventTarget();
 const ctx={document,Event:dom.Event,URL,URLSearchParams,Blob,console:{error:e=>errors.push(e)},setTimeout,clearTimeout,
  location:{search:'',hash,href:'https://example.org/release/index.html'},matchMedia:()=>({matches:true,addEventListener(){}}),requestAnimationFrame:()=>0,cancelAnimationFrame(){},
  scrollTo(){},confirm:()=>true,FontFace:class{load(){return Promise.resolve(this)}},
  fetch:async name=>({ok:true,json:async()=>JSON.parse(await read(String(name)))}),
  navigator:{clipboard:{writeText:async text=>{ctx.copied=text}}},
  localStorage:{getItem(k){storageReads++;return store.get(k)||null},setItem(k,v){store.set(k,v)},removeItem(k){store.delete(k)}},
  addEventListener:(...a)=>events.addEventListener(...a),dispatchEvent:(...a)=>events.dispatchEvent(...a),
  ATLAS_PAGE_MODE:page,openai:{widgetState:saved,setWidgetState:async x=>{state=x}}
 };
 document.fonts={add(){}};ctx.window=ctx;ctx.globalThis=ctx;
 vm.createContext(ctx);
 for(const name of ['guided.js','workflow.js','gallery-views.js','app-shell.js','app.js','guided-ui.js','style-picker.js'])vm.runInContext(await read(name),ctx,{filename:name});
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
 assert.throws(()=>ctx.AtlasApp.prompt(),/Escolha/);
 for(const style of ctx.AtlasCurrentChoice().selectedStyles.slice(1))ctx.AtlasApp.setStyleContributions(style.id,[{aspect:'lighting',scope:'propose'}]);
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

test('narrated ads: eleven segments, 45 second handoff and local restore retain the ad contract',async()=>{
 const app=await boot();const {document:d,ctx,click,change}=app;
 click('[data-nav-group="natural-ads"]');assert.equal(d.querySelectorAll('#categoryTiles [data-visual-family]').length,11);
 click('[data-nav-family="ads-joias"]');assert.equal(d.querySelectorAll('#grid .card').length,40);
 click('#grid [data-choose]');change('duration','45');change('topic','Uma coleção demonstrativa');
 d.getElementById('briefForm').dispatchEvent(new ctx.Event('submit',{bubbles:true,cancelable:true}));
 await new Promise(r=>setTimeout(r,20));
 const c=ctx.AtlasCurrentChoice();assert.equal(c.targetDurationSeconds,45);assert.equal(c.firstDeliverySeconds,10);
 assert.equal(c.selectedStyles[0].advertising.narrationRequired,true);assert.equal(c.selectedStyles[0].advertising.captionsRequired,true);
 assert.match(d.getElementById('promptOutput').value,/Duração alvo: 45 segundos/);
 assert.ok(d.getElementById('promptOutput').value.includes(c.selectedStyles[0].advertising.cta));
 const resumed=await boot({saved:JSON.parse(app.store.get('video-multimarcas-atlas-v1'))});
 assert.equal(resumed.ctx.AtlasCurrentChoice().targetDurationSeconds,45);
 assert.equal(resumed.ctx.AtlasCurrentChoice().selectedStyles[0].advertising.framework,c.selectedStyles[0].advertising.framework);
});

test('Page 4.2 favourites migrate by append-only positions without localStorage',async()=>{
 const app=await boot({page:true,saved:{modelContent:{targetDurationSeconds:45},privateContent:{catalogVersion:'4.2',favoriteBits:'1'+'0'.repeat(718)+'1'}}});
 app.click('#favoriteFilter');assert.equal(app.document.querySelectorAll('#grid .card').length,2);
 assert.equal(app.ctx.AtlasCurrentChoice().targetDurationSeconds,45);assert.equal(app.getStorageReads(),0);
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

test('two-level categories partition all 1160 styles and never render example-style shortcuts',async()=>{
 const {document:d,ctx,click}=await boot();const catalog=ctx.AtlasApp.getCatalog(),groups=ctx.AtlasNavigation.groups;
 assert.equal(groups.length,6);
 const families=groups.flatMap(g=>g.families);
 assert.equal(families.length,29);assert.equal(new Set(families).size,29);
 assert.deepEqual(new Set(families),new Set(catalog.families.map(f=>f.id)));
 assert.equal(catalog.styles.filter(s=>families.includes(s.family)).length,1160);
 assert.equal(d.querySelectorAll('#categoryGroups [data-nav-family]').length,29);
 assert.equal(d.querySelectorAll('#categoryTiles [data-visual-family]').length,3);
 for(const [id,total] of [['commercial',120],['natural-ads',440],['business',120],['technology',80],['movement',160],['visual',240]]){
  click('[data-nav-group="'+id+'"]');
  assert.match(d.getElementById('resultCount').textContent,new RegExp('^'+total+' estilos'));
  assert.equal(ctx.AtlasApp.categorySelection().group,id);
  assert.equal(d.querySelectorAll('#grid .card').length,40);
  assert.equal(d.querySelectorAll('[data-nav-style],.category-shortcuts,[data-explore-family]').length,0);
  assert.equal(d.querySelector('[data-nav-group="'+id+'"]').getAttribute('aria-current'),'true');
 }
 click('[data-nav-family="cinema"]');
 assert.equal(d.querySelectorAll('#grid .card').length,40);
 assert.equal(ctx.AtlasApp.categorySelection().group,'');
 assert.match(d.getElementById('categoryResultsTitle').textContent,/Cinema e fotografia/);
 click('#grid [data-detail="publicidade-cinematografica"]');
 assert.equal(d.getElementById('detailDialog').open,true);
 assert.match(d.getElementById('detailContent').textContent,/Publicidade cinematográfica/);
 d.getElementById('detailDialog').close();
 click('[data-nav-group="technology"]');
 assert.equal(d.querySelectorAll('#categoryTiles [data-visual-family]').length,2);
 click('[data-visual-family="software"]');
 assert.equal(d.getElementById('familySelect').value,'software');
 assert.equal(d.querySelectorAll('#grid .card').length,40);
 assert.equal(d.querySelector('[data-nav-family="software"]').getAttribute('aria-current'),'true');
 assert.equal(ctx.AtlasCurrentChoice().selectedStyles.length,0,'navigation does not change the brief');
 click('.category-all');assert.equal(d.getElementById('familySelect').value,'');
 assert.equal(ctx.AtlasApp.categorySelection().group,'');
 assert.match(d.getElementById('resultCount').textContent,/^1160 estilos/);
 assert.equal(d.querySelectorAll('#grid .card').length,24);
});
test('browsing parents and subcategories preserves selected styles, contributions and approvals',async()=>{
 const {document:d,ctx,click}=await boot();
 click('#grid [data-choose="publicidade-cinematografica"]');
 ctx.AtlasApp.setStyleContributions('publicidade-cinematografica',[{aspect:'lighting',scope:'film'}]);
 const before=JSON.stringify(ctx.AtlasApp.exportBundle());
 for(const group of ctx.AtlasNavigation.groups){click('[data-nav-group="'+group.id+'"]');for(const id of group.families)click('[data-nav-family="'+id+'"]');}
 click('.category-all');
 assert.equal(JSON.stringify(ctx.AtlasApp.exportBundle()),before);
 assert.equal(d.querySelectorAll('[data-nav-style],.category-shortcuts').length,0);
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
test('mobile category drawer wraps keyboard focus at both ends',async()=>{
 const {document:d,ctx,click}=await boot();click('#openCategories');
 const drawer=d.getElementById('categoryDrawer');let active=d.getElementById('closeCategories');
 Object.defineProperty(d,'activeElement',{configurable:true,get:()=>active});
 for(const el of drawer.querySelectorAll('a[href],button,input')){el.getClientRects=()=>[{}];el.focus=()=>{active=el};Object.defineProperty(el,'tabIndex',{configurable:true,value:0});}
 function tab(back){const e=new ctx.Event('keydown',{bubbles:true,cancelable:true});Object.defineProperties(e,{key:{value:'Tab'},shiftKey:{value:back}});active.dispatchEvent(e);assert.equal(e.defaultPrevented,true);}
 tab(true);assert.equal(active.id,'exploreCategory');tab(false);assert.equal(active.id,'closeCategories');
});


test('all catalog kinds are filterable and new segments collect their specific originals',async()=>{
 const app=await boot(),c=JSON.parse(await read('catalog.json'));const {document:d,ctx,click,change}=app;
 assert.deepEqual(new Set([...d.querySelectorAll('#kind option')].map(o=>o.value).filter(Boolean)),new Set(c.styles.map(s=>s.kind)));
 change('kind','Anúncio narrado');assert.equal(d.querySelectorAll('#grid .card').length,24);assert.match(d.getElementById('resultCount').textContent,/440 estilos/);change('kind','');
 click('[data-nav-group="natural-ads"]');
 for(const f of c.families.slice(18)){
  click('[data-nav-family="'+f.id+'"]');click('#grid [data-detail]');click('#detailDialog [data-choose]');
  const ids=ctx.AtlasCurrentChoice().intake.items.map(x=>x.id);
  if(f.id==='ads-juridico'){assert.ok(ids.includes('legal'));assert.ok(!ids.includes('product'));}
  else if(['ads-turismo','ads-servicos'].includes(f.id)){assert.ok(!ids.includes('product'));assert.ok(ids.includes(f.id==='ads-turismo'?'travel':'homeService'));}
  else if(ctx.AtlasCurrentChoice().selectedStyles[0].advertising.offerType==='service')assert.ok(!ids.includes('product'),f.id);
  else assert.ok(ids.includes('product'),f.id);
  if(['ads-alimentacao'].includes(f.id))assert.ok(ids.includes('food'),f.id);
  change('topic','Produto demonstrativo');d.getElementById('briefForm').dispatchEvent(new ctx.Event('submit',{bubbles:true,cancelable:true}));
  assert.ok(d.getElementById('summaryMaterials').textContent.trim());
  click('#briefDialog [data-close]');
 }
});
test('malformed Page selection and malformed URL fragment do not prevent startup',async()=>{
 for(const selectedStyles of [{bad:true},[null,{id:'missing'},42]]){
  const app=await boot({page:true,saved:{modelContent:{selectedStyles}},hash:'#estilo=%E0%A4%A'});
  assert.equal(app.ctx.AtlasCurrentChoice().selectedStyles.length,0);assert.equal(app.getStorageReads(),0);
 }
});
test('sequence numbering matches frame indices including the principal frame',async()=>{
 const app=await boot(),c=JSON.parse(await read('catalog.json'));
 for(const s of [c.styles[0],c.styles.find(s=>s.sequence.heroIndex===3),c.styles.at(-1)]){
  const markup=app.ctx.AtlasViews.sequence(s);const {document:d}=parseHTML(markup);
  assert.match(d.querySelector('.film-hero figcaption').textContent,new RegExp(String(s.sequence.heroIndex+1).padStart(2,'0')));
  const steps=[...d.querySelectorAll('.film-steps figcaption strong')].map(e=>Number(e.textContent.slice(0,2)));
  assert.deepEqual(steps,[1,2,3,4].filter(n=>n!==s.sequence.heroIndex+1));
 }
});

test('prepared request carries absolute catalog and individual frame URLs',async()=>{const a=await boot();a.click('#grid [data-choose]');a.change('topic','Teste');const c=a.ctx.AtlasCurrentChoice();assert.equal(c.catalogUrl,'https://example.org/release/catalog.json');const p=a.ctx.AtlasWorkflow.buildPrompt(c);assert.match(p,/https:\/\/example.org\/release\/assets\//);assert.match(p,/Agora \/ Entrega \/ Preciso de você \/ Próximo passo/);});


test('guided wizard preserves neutral recipe and materials through handoff and reload',async()=>{
 const a=await boot();a.click('#startGuided');a.change('guidedObjective','product');a.change('guidedSubject','Joias artesanais');a.click('#guidedNext');assert.equal(a.document.querySelectorAll('[data-guided-pick]').length,3);a.click('[data-guided-pick]');a.click('#guidedNext');a.document.querySelector('#guidedMaterials input[value="one_photo"]').setAttribute('checked','');a.click('#guidedNext');a.click('#guidedNext');await new Promise(r=>setTimeout(r,30));const c=a.ctx.AtlasCurrentChoice();assert.equal(c.guidedBrief.objective,'product');assert.equal(c.recipe.status,'planned');assert.equal(c.guidedBrief.materials[0],'one_photo');assert.match(a.document.getElementById('promptOutput').value,/protected_photo_composite/);const saved=JSON.parse(a.store.get('video-multimarcas-atlas-v1'));const b=await boot({saved});assert.equal(b.ctx.AtlasCurrentChoice().guidedBrief.materials[0],'one_photo');const bundle=b.ctx.AtlasApp.exportBundle();assert.equal(bundle.packageVersion,1);assert.ok(bundle.request.includes('Joias artesanais'));assert.equal(bundle.project.guidedBrief.objective,'product');
});
test('requesting adjustment retains history but invalidates affected approvals',async()=>{const a=await boot();a.click('#grid [data-choose]');const c=a.ctx.AtlasCurrentChoice();c.projectState.history.push({etapa:'sample',estado:'concluido',versao:1,custoInformadoUSD:0,resumo:'reported sample',pendencias:[]});c.projectState.preProductionApprovals.moodboard.status='approved';c.projectState.preProductionApprovals.visual_storyboard.status='approved';a.ctx.AtlasApp.requestAdjustment('voice');assert.equal(c.projectState.history.length,1);assert.equal(c.projectState.preProductionApprovals.moodboard.status,'approved');assert.equal(c.projectState.preProductionApprovals.visual_storyboard.status,'pending');assert.equal(a.ctx.AtlasWorkflow.activeProjectState(c.projectState).history.length,0);assert.match(a.ctx.AtlasApp.prompt(),/ritmo da locução/);});


test('portable bundle round-trips through import and rejects invalid sheet without losing choices',async()=>{const a=await boot();a.click('#grid [data-choose]');a.change('topic','Projeto mantido');const bundle=a.ctx.AtlasApp.exportBundle(),input=a.document.getElementById('importProject');Object.defineProperty(input,'files',{configurable:true,value:[{size:1000,text:async()=>JSON.stringify(bundle)}]});await input.onchange({target:input});assert.equal(a.ctx.AtlasCurrentChoice().topic,'Projeto mantido');bundle.project.styles=['unknown'];Object.defineProperty(input,'files',{configurable:true,value:[{size:1000,text:async()=>JSON.stringify(bundle)}]});await input.onchange({target:input});assert.equal(a.ctx.AtlasCurrentChoice().topic,'Projeto mantido');assert.equal(a.ctx.AtlasCurrentChoice().selectedStyles.length,1);assert.match(a.document.getElementById('projectMessage').textContent,/recusada/);});
test('revising storyboard preserves moodboard and history; project next action remains usable',async()=>{const a=await boot();a.click('#grid [data-choose]');const c=a.ctx.AtlasCurrentChoice();c.projectState.preProductionApprovals.moodboard.status='approved';c.projectState.preProductionApprovals.visual_storyboard.status='approved';a.ctx.AtlasApp.requestRevision('visual_storyboard');assert.equal(c.projectState.preProductionApprovals.moodboard.status,'approved');assert.equal(c.projectState.preProductionApprovals.visual_storyboard.status,'pending');a.click('#projectNext');assert.equal(a.document.body.dataset.view,'brief');});

test('granular choices reach prompt and Page state; changes invalidate approvals without deleting history',async()=>{
 const a=await boot({page:true});a.click('#grid [data-choose]');const id=a.ctx.AtlasCurrentChoice().selectedStyles[0].id;a.ctx.AtlasApp.setStyleContributions(id,[{aspect:'typographic_language',scope:'film'}]);
 const c=a.ctx.AtlasCurrentChoice();c.projectState.history.push({etapa:'visual_storyboard',estado:'concluido',versao:1,custoInformadoUSD:0,resumo:'Fixture only',pendencias:[]});c.projectState.preProductionApprovals.moodboard.status='approved';c.projectState.preProductionApprovals.visual_storyboard.status='approved';
 a.ctx.AtlasApp.setStyleContributions(id,[{aspect:'lighting',scope:'opening'}]);assert.equal(c.projectState.history.length,1);assert.equal(c.projectState.preProductionApprovals.moodboard.status,'pending');assert.equal(c.projectState.preProductionApprovals.visual_storyboard.status,'pending');assert.equal(a.ctx.AtlasCurrentChoice().requestPrepared,false);
 assert.equal(a.getStorageReads(),0);assert.equal(a.getState().modelContent.styleContributions[id][0].aspect,'lighting');assert.equal(a.getState().modelContent.styleContributions[id][0].scope,'opening');assert.match(a.ctx.AtlasApp.prompt(),/"aspect":"lighting","scope":"opening"/);
 const resumed=await boot({page:true,saved:a.getState()});assert.equal(resumed.ctx.AtlasCurrentChoice().styleContributions[id][0].scope,'opening');
});
test('popup cancellation retains original selection and conflicting scope blocks a prepared request',async()=>{
 const a=await boot();a.click('#grid [data-choose]');const first=a.ctx.AtlasCurrentChoice().selectedStyles[0].id;a.ctx.AtlasContributions.open(first);a.click('#pickerClear');a.click('#pickerClose');assert.equal(a.ctx.AtlasApp.getStyleContributions(first)[0].aspect,'style_direction');
 const button=[...a.document.querySelectorAll('#grid [data-choose]')].find(b=>b.dataset.choose!==first);a.click('#grid [data-choose="'+button.dataset.choose+'"]');assert.throws(()=>a.ctx.AtlasApp.prompt(),/Escolha/);a.ctx.AtlasApp.setStyleContributions(first,[{aspect:'palette',scope:'film'}]);a.ctx.AtlasApp.setStyleContributions(button.dataset.choose,[{aspect:'palette',scope:'film'}]);assert.throws(()=>a.ctx.AtlasApp.prompt(),/concorrentes/);assert.ok(a.document.querySelector('.combination-conflicts'));a.ctx.AtlasApp.setStyleContributions(button.dataset.choose,[{aspect:'palette',scope:'opening'}]);assert.doesNotThrow(()=>a.ctx.AtlasApp.prompt());
});
test('invalid contribution sheet is refused before replacing the current project',async()=>{
 const a=await boot();a.click('#grid [data-choose]');const id=a.ctx.AtlasCurrentChoice().selectedStyles[0].id;a.ctx.AtlasApp.setStyleContributions(id,[{aspect:'texture',scope:'details'}]);const bundle=a.ctx.AtlasApp.exportBundle(),input=a.document.getElementById('importProject');bundle.project.styleContributions[id][0].scope='unknown';Object.defineProperty(input,'files',{configurable:true,value:[{size:1000,text:async()=>JSON.stringify(bundle)}]});await input.onchange({target:input});assert.equal(a.ctx.AtlasCurrentChoice().styleContributions[id][0].scope,'details');assert.match(a.document.getElementById('projectMessage').textContent,/recusada/);
});

test('choosing a characteristic replaces whole-style selection without requiring Clear',async()=>{
 const a=await boot();a.click('#grid [data-choose]');const id=a.ctx.AtlasCurrentChoice().selectedStyles[0].id;a.ctx.AtlasContributions.open(id);
 const lighting=a.document.querySelector('[data-picker-aspect="lighting"]');lighting.checked=true;lighting.dispatchEvent(new a.ctx.Event('change',{bubbles:true}));assert.equal(a.document.querySelector('[data-picker-aspect="style_direction"]').checked,false);a.click('#pickerApply');assert.equal(a.ctx.AtlasApp.getStyleContributions(id).length,1);assert.equal(a.ctx.AtlasApp.getStyleContributions(id)[0].aspect,'lighting');
 a.ctx.AtlasContributions.open(id);const whole=a.document.querySelector('[data-picker-aspect="style_direction"]');whole.checked=true;whole.dispatchEvent(new a.ctx.Event('change',{bubbles:true}));assert.equal(a.document.querySelector('[data-picker-aspect="lighting"]').checked,false);a.click('#pickerApply');assert.equal(a.ctx.AtlasApp.getStyleContributions(id).length,1);assert.equal(a.ctx.AtlasApp.getStyleContributions(id)[0].aspect,'style_direction');
});

test('wizard keeps a gallery principal outside recommendations and preserves contributions at handoff',async()=>{
 const a=await boot(),{ctx,document:d,click,change}=a;
 const main='natural-barras-a-pausa-cabe-na-bolsa';assert.ok(ctx.AtlasApp.getStyle(main));ctx.AtlasApp.chooseStyle(main);
 click('#grid [data-choose="publicidade-cinematografica"]');
 ctx.AtlasApp.setStyleContributions(main,[{aspect:'palette',scope:'film'}]);
 ctx.AtlasApp.setStyleContributions('publicidade-cinematografica',[{aspect:'lighting',scope:'closing'}]);
 change('topic','Um anúncio com sugestão de uso do produto, estilo UGC');const before=JSON.stringify(ctx.AtlasCurrentChoice().styleContributions);
 click('#startGuided');click('#guidedNext');
 assert.ok(d.querySelector('#guidedCurrentStyle [data-detail="'+main+'"]'),'current principal stays visible');
 assert.equal(d.getElementById('guidedAlternatives').open,false);
 click('#guidedNext');click('#guidedNext');click('#guidedRefresh');
 assert.ok(d.querySelector('#guidedCurrentStyle [data-detail="'+main+'"]'));
 click('#guidedNext');click('#guidedNext');click('#guidedNext');await new Promise(r=>setTimeout(r,20));
 assert.equal(ctx.AtlasCurrentChoice().selectedStyles[0].id,main);
 assert.equal(ctx.AtlasCurrentChoice().selectedStyles.length,2);
 assert.equal(JSON.stringify(ctx.AtlasCurrentChoice().styleContributions),before);
 assert.match(d.getElementById('promptOutput').value,/A pausa cabe na bolsa/);
});
test('explicit wizard replacement immediately updates briefing, storage and keeps complementary choices',async()=>{
 const a=await boot(),{ctx,document:d,click,change}=a;
 ctx.AtlasApp.chooseStyle('natural-barras-a-pausa-cabe-na-bolsa');click('#grid [data-choose="publicidade-cinematografica"]');
 ctx.AtlasApp.setStyleContributions('publicidade-cinematografica',[{aspect:'lighting',scope:'closing'}]);change('topic','Anúncio de barras proteicas');
 click('#startGuided');click('#guidedNext');const target=[...d.querySelectorAll('[data-guided-pick]')].find(b=>!['natural-barras-a-pausa-cabe-na-bolsa','publicidade-cinematografica'].includes(b.dataset.guidedPick)).dataset.guidedPick;
 click('[data-guided-pick="'+target+'"]');
 assert.equal(ctx.AtlasCurrentChoice().selectedStyles[0].id,target);
 assert.equal(ctx.AtlasCurrentChoice().selectedStyles.length,2);
 assert.equal(ctx.AtlasCurrentChoice().selectedStyles[1].id,'publicidade-cinematografica');
 assert.equal(ctx.AtlasApp.getStyleContributions('publicidade-cinematografica')[0].scope,'closing');
 assert.ok(d.getElementById('briefVisual').textContent.includes(ctx.AtlasApp.getStyle(target).name));
 assert.equal(JSON.parse(a.store.get('video-multimarcas-atlas-v1')).modelContent.selectedStyles[0].id,target);
 d.getElementById('guidedDialog').close();const resumed=await boot({saved:JSON.parse(a.store.get('video-multimarcas-atlas-v1'))});
 assert.equal(resumed.ctx.AtlasCurrentChoice().selectedStyles[0].id,target);
});
test('reopening a dirty wizard adopts newer briefing fields and the actual gallery principal',async()=>{
 const a=await boot(),{ctx,document:d,click,change}=a;
 click('#startGuided');change('guidedSubject','Rascunho antigo');click('#guidedNext');d.getElementById('guidedDialog').close();
 ctx.AtlasApp.chooseStyle('natural-barras-a-pausa-cabe-na-bolsa');change('topic','Tema atualizado no briefing');change('brand','Marca atual');
 click('#startGuided');assert.equal(d.getElementById('guidedSubject').value,'Tema atualizado no briefing');assert.equal(d.getElementById('guidedBrand').value,'Marca atual');
 click('#guidedNext');assert.ok(d.querySelector('#guidedCurrentStyle [data-detail="natural-barras-a-pausa-cabe-na-bolsa"]'));
});
test('Page wizard saves an explicit principal swap without localStorage',async()=>{
 const a=await boot({page:true}),{ctx,document:d,click,change}=a;ctx.AtlasApp.chooseStyle('natural-barras-a-pausa-cabe-na-bolsa');change('topic','Anúncio de barras proteicas');
 click('#startGuided');click('#guidedNext');const target=[...d.querySelectorAll('[data-guided-pick]')].find(b=>!['natural-barras-a-pausa-cabe-na-bolsa','publicidade-cinematografica'].includes(b.dataset.guidedPick)).dataset.guidedPick;click('[data-guided-pick="'+target+'"]');await new Promise(r=>setTimeout(r,10));
 assert.equal(ctx.AtlasCurrentChoice().selectedStyles[0].id,target);
 assert.equal(a.getState().modelContent.selectedStyles[0].id,target);assert.equal(a.getStorageReads(),0);
});

test('Page incoming choices refresh the principal displayed in an open wizard',async()=>{
 const a=await boot({page:true}),{ctx,document:d,click,change}=a;ctx.AtlasApp.chooseStyle('natural-barras-a-pausa-cabe-na-bolsa');change('topic','Tema demonstrativo');click('#startGuided');click('#guidedNext');
 const incoming=JSON.parse(JSON.stringify(a.getState()));incoming.modelContent.selectedStyles=[{id:'publicidade-cinematografica'}];incoming.modelContent.styleContributions={'publicidade-cinematografica':[{aspect:'style_direction',scope:'film'}]};
 const event=new ctx.Event('openai:set_globals');event.detail={globals:{widgetState:incoming}};ctx.dispatchEvent(event);
 assert.ok(d.querySelector('#guidedCurrentStyle [data-detail="publicidade-cinematografica"]'));assert.equal(a.getStorageReads(),0);
});
test('principal replacement respects the ten-style limit and unchanged or invalid choices preserve the project',async()=>{
 const {ctx,document:d,click}=await boot();for(const b of [...d.querySelectorAll('#grid [data-choose]')].slice(0,10))click('#grid [data-choose="'+b.dataset.choose+'"]');
 const before=JSON.stringify(ctx.AtlasCurrentChoice());assert.throws(()=>ctx.AtlasApp.setPrincipalStyle('missing'));assert.equal(JSON.stringify(ctx.AtlasCurrentChoice()),before);
 ctx.AtlasApp.setPrincipalStyle('publicidade-cinematografica');assert.equal(JSON.stringify(ctx.AtlasCurrentChoice()),before);
 ctx.AtlasApp.setPrincipalStyle('natural-barras-a-pausa-cabe-na-bolsa');assert.equal(ctx.AtlasCurrentChoice().selectedStyles.length,10);
 assert.equal(ctx.AtlasCurrentChoice().selectedStyles[0].id,'natural-barras-a-pausa-cabe-na-bolsa');assert.equal(new Set(ctx.AtlasCurrentChoice().selectedStyles.map(s=>s.id)).size,10);
});

test('Page 4.3 favorites retain append-only positions after segment regrouping',async()=>{
 const app=await boot({page:true,saved:{modelContent:{targetDurationSeconds:45},privateContent:{catalogVersion:'4.3',favoriteBits:'1'+'0'.repeat(778)+'1'}}});app.click('#favoriteFilter');assert.equal(app.document.querySelectorAll('#grid .card').length,2);assert.equal(app.getStorageReads(),0);
});
