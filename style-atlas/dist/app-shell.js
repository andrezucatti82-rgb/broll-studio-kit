/* App-like navigation over the static, account-independent atlas. */
(()=>{
 const $=id=>document.getElementById(id);let selected=[],stage='briefing',ready=false,viewerStyle=null,viewerIndex=0,returnFocus=null;
 const base=()=>window.ATLAS_ASSET_BASE||'';
 function view(name){
  document.body.dataset.view=name;if(name==='library')document.querySelector('.library-actions').prepend($('startGuided'));else if(name==='project')document.querySelector('.project-heading').append($('startGuided'));
  document.querySelectorAll('[data-app-view]').forEach(b=>{const active=b.dataset.appView===name;b.setAttribute('aria-current',active?'page':'false')});
  if(name!=='brief'&&$('briefDialog').open)$('briefDialog').close();
  if(name==='project'){$('myProject').hidden=false;$('projectTitle').focus({preventScroll:true})}
  window.scrollTo({top:0,behavior:'auto'});
 }
 function setStage(value){
  stage=value;const review=stage==='review';$('briefDialog').dataset.stage=stage;
  $('briefForm').hidden=review;$('handoff').hidden=!review;
  document.querySelectorAll('[data-brief-stage]').forEach(b=>b.setAttribute('aria-current',b.dataset.briefStage===stage?'step':'false'));
  if(review)renderSummary();
 }
 function openBrief(){
  if(!selected.length){view('library');$('libraryTitle').focus({preventScroll:true});return}
  document.body.dataset.view='brief';document.querySelector('.brief-heading').append($('startGuided'));
  if(!$('briefDialog').open)$('briefDialog').show();
  const prepared=window.AtlasCurrentChoice?.().requestPrepared;
  setStage(prepared?'review':'briefing');
  if(prepared){$('promptOutput').value=window.AtlasApp.prompt();$('handoffMessage').textContent='Confira o resumo, copie o pedido e envie na conversa de produção.'}
  $('briefTitle').focus({preventScroll:true});window.scrollTo({top:0,behavior:'auto'});
 }
 function selectionChanged(styles){
  selected=styles;$('selectionTray').hidden=!styles.length;
  $('trayCount').textContent=styles.length+' '+(styles.length===1?'estilo escolhido':'estilos escolhidos');
  $('selectionSummary').textContent=`Estilos escolhidos · ${styles.length}/10`;
  document.querySelectorAll('[data-selection-count]').forEach(x=>x.textContent=styles.length);
  const esc=AtlasViews.esc;
  $('trayImages').innerHTML=styles.slice(0,3).map(s=>s.sequence?AtlasViews.picture(s,s.sequence?.heroIndex??1,base()):'').join('');
  const s=styles[0];$('briefVisual').innerHTML=s?`<p class="eyebrow">Estilo principal</p><h3>${esc(s.name)}</h3><button type="button" class="frame-expand" data-detail="${esc(s.id)}" aria-label="Examinar ${esc(s.name)}">${s.sequence?AtlasViews.picture(s,s.sequence?.heroIndex??1,base()):`<img src="${esc(base()+s.image.atlas)}" alt="${esc(s.name)}">`}</button>${AtlasViews.strip(s,base())}${s.sequence?`<button type="button" class="text-button" data-board="${esc(s.id)}">↓ Baixar sequência dos 4 quadros</button>`:''}<p class="concept-note">Quadros conceituais · a execução será validada na amostra.</p>`:'<p>Escolha um estilo na biblioteca.</p>';
  if(ready)renderSummary();
 }
 function renderSummary(){
  if(!window.AtlasCurrentChoice)return;
  const c=window.AtlasCurrentChoice(),esc=AtlasViews.esc;
  $('requestSummary').innerHTML=[['Tema',c.topic||'Definir no briefing'],['Marca ou site',c.brand||'Identidade a definir'],['Formato e duração',`${c.format} · ${c.targetDurationSeconds} segundos`],['Tipografia',c.typography==='auto'?'Seguir o estilo e a marca':c.typography]].map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd><button type="button" data-edit-brief aria-label="Editar ${esc(k)}">✎</button></div>`).join('');
  const ids=new Set(['product','property','ui','data','clinical','course','coverage','presenter','legal','food','pets','automotive','travel','beauty','homeService','childcare','identity','voice','brand','facts']);
  const materials=c.intake.items.filter(x=>ids.has(x.id)).sort((a,b)=>Number(['brand','facts','identity','voice'].includes(a.id))-Number(['brand','facts','identity','voice'].includes(b.id)));
  const plan=c.productionContract.materials;
  $('summaryMaterials').replaceChildren(...plan.now.map(text=>{const row=document.createElement('li');const title=document.createElement('strong');title.textContent=text;row.append(title);const need=plan.dependencies.find(x=>x.label===text);if(need&&need.action==='verify_access'){const note=document.createElement('span');note.textContent='Já registrado'+(need.file?' · '+need.file:'')+'; conferir acesso na conversa';row.append(note)}else if(need&&need.action==='request_replacement'){const note=document.createElement('span');note.textContent='Original registrado como inadequado; '+need.alternative;row.append(note)}return row}));
  $('handoffMaterialNotes').replaceChildren();for(const [label,items] of [['Opcional',plan.optional],['Somente se o roteiro precisar',plan.later]]){const p=document.createElement('p');p.textContent=label+': '+items.join(' ');$('handoffMaterialNotes').append(p)}
  $('referenceFiles').innerHTML='<h3>Referências para anexar</h3>'+c.selectedStyles.map(s=>`<div class="reference-file"><strong>${esc(s.name)}</strong><div><button type="button" class="text-button" data-frame="${esc(s.id)}">Baixar quadro · PNG</button><button type="button" class="text-button" data-board="${esc(s.id)}">Baixar sequência · PNG</button></div></div>`).join('')+'<p class="small">Arquivos identificados pelo ID do estilo. Eles mostram a direção; os originais do seu assunto continuam sendo a referência principal.</p>';
  updatePlatform();
 }

 function updatePlatform(){
  const platform=$('handoffPlatform').value==='claude'?'claude':'chatgpt',name=platform==='claude'?'Claude':'ChatGPT';
  $('chatLink').href=platform==='claude'?'https://claude.ai/new':'https://chatgpt.com/';$('chatLink').textContent='Abrir '+name+' ↗';$('chatLink').hidden=!!window.ATLAS_PAGE_MODE&&platform==='chatgpt';
  $('handoffHelp').textContent=window.ATLAS_PAGE_MODE&&platform==='chatgpt'?'Se disponível, use a ação nativa de conversa da Page; você também pode copiar o pedido. Estado salvo não equivale a arquivos anexados.':'Cole o pedido no '+name+' e anexe os arquivos. Abrir não envia mensagens, transfere arquivos, instala ferramentas ou autoriza cobranças.';
 }

 function showFrame(id,index,trigger){
  const s=window.AtlasApp?.getStyle(id);if(!s?.sequence)return;
  viewerStyle=s;viewerIndex=Number.isInteger(index)&&index>=0&&index<4?index:0;returnFocus=trigger;updateFrame();$('sequenceDialog').showModal();
 }
 function updateFrame(){
  const f=viewerStyle.sequence.frames[viewerIndex];$('sequenceImage').src=base()+f.src;$('sequenceImage').alt=f.alt||f.caption||viewerStyle.name;
  $('sequenceTitle').textContent=viewerStyle.name;$('sequenceCaption').textContent=f.label+' · '+(f.caption||f.action||'');$('sequencePosition').textContent=`${viewerIndex+1} / 4`;
  $('sequencePrev').disabled=viewerIndex===0;$('sequenceNext').disabled=viewerIndex===3;
  $('sequenceDownload').dataset.sequenceDownload=viewerStyle.id;$('sequenceDownload').dataset.frameIndex=viewerIndex;
 }
 document.addEventListener('change',e=>{if(e.target.id==='handoffPlatform'){updatePlatform();if(window.AtlasCurrentChoice?.().requestPrepared)$('promptOutput').value=window.AtlasApp.prompt();window.AtlasApp?.save()}});
 document.addEventListener('click',e=>{
  const file=e.target.closest('[data-starter-file]');if(file){const item=AtlasWorkflow.starterFiles(AtlasCurrentChoice()).find(f=>f.name===file.dataset.starterFile);if(item){const url=URL.createObjectURL(new Blob([item.text],{type:item.type+';charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=item.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}}
  const nav=e.target.closest('[data-app-view]');if(nav){nav.dataset.appView==='brief'?openBrief():view(nav.dataset.appView)}
  if(e.target.closest('[data-edit-brief]'))setStage('briefing');
  const step=e.target.closest('[data-brief-stage]');if(step){if(step.dataset.briefStage==='styles')view('library');else if(step.dataset.briefStage==='review')$('briefForm').requestSubmit();else setStage('briefing')}
  const frame=e.target.closest('[data-sequence]');if(frame)showFrame(frame.dataset.sequence,Number(frame.dataset.frameIndex),frame);
 });
 $('briefDialog').addEventListener('close',()=>{if(document.body.dataset.view==='brief')view('library')});
 $('sequencePrev').onclick=()=>{if(viewerIndex>0){viewerIndex--;updateFrame()}};$('sequenceNext').onclick=()=>{if(viewerIndex<3){viewerIndex++;updateFrame()}};
 $('sequenceDialog').addEventListener('keydown',e=>{if(e.key==='ArrowLeft')$('sequencePrev').click();if(e.key==='ArrowRight')$('sequenceNext').click()});
 $('sequenceDialog').addEventListener('close',()=>returnFocus?.focus());
 window.AtlasShell={openBrief,selectionChanged,prepared(){setStage('review');$('handoffTitle').focus({preventScroll:true})},edit(){setStage('briefing')},view,afterRender(){window.AtlasNavigation?.sync();document.querySelectorAll('#grid [data-style-id]').forEach(card=>card.classList.toggle('is-selected',selected.some(s=>s.id===card.dataset.styleId)))}};
 window.addEventListener('atlas:ready',()=>{ready=true;renderSummary();if(document.body.dataset.view!=='brief')view('library');});
})();

/* Hybrid category navigation. It filters the existing catalogue; it never changes a brief. */
(()=>{
 const $=id=>document.getElementById(id),groups=[
  {id:'commercial',name:'Publicidade e vendas',icon:'commercial',families:['anuncios','campanhas','ecommerce']},
  {id:'natural-ads',name:'Anúncios por segmento',icon:'ecommerce',families:['ads-moda','ads-alimentacao','ads-casa','ads-joias','ads-juridico','ads-pets','ads-automotivo','ads-turismo','ads-beleza','ads-servicos','ads-infantil']},
  {id:'business',name:'Serviços e educação',icon:'infoprodutores',families:['imoveis','saude','infoprodutores']},
  {id:'technology',name:'Tecnologia e sistemas',icon:'technology',families:['software','tecnologia']},
  {id:'movement',name:'Motion e apresentações',icon:'motion',families:['motion-campanha','motion','apresentacoes','avatares']},
  {id:'visual',name:'Estéticas e narrativas',icon:'materiais',families:['cinema','grafico','ilustracao','materiais','volume','hibridos']}
 ];
 const labels={cinema:'Cinema',grafico:'Editorial',ilustracao:'Ilustração',materiais:'Papel e materiais',volume:'Volume e 3D',hibridos:'Narrativas',motion:'Movimento', 'motion-campanha':'Motion de campanha',apresentacoes:'Apresentações',avatares:'Avatares',tecnologia:'Interfaces e dados',anuncios:'Produtos',campanhas:'Campanhas',imoveis:'Imóveis',software:'Softwares',saude:'Saúde e estética',ecommerce:'E-commerce',infoprodutores:'Educação','ads-joias':'Joias e acessórios','ads-moda':'Moda e vestuário','ads-alimentacao':'Alimentação e bebidas','ads-casa':'Casa e decoração','ads-juridico':'Serviços jurídicos','ads-pets':'Pets','ads-automotivo':'Automotivo','ads-turismo':'Turismo e hospedagem','ads-beleza':'Beleza','ads-servicos':'Serviços residenciais','ads-infantil':'Infantil e maternidade'};
 const paths={commercial:'m3 10 14-6v16L3 14z M6 15l2 6h3l-2-5 M20 8l2-2 M20 16l2 2',technology:'M3 4h18v14H3z M8 22h8 M12 18v4 M7 8h4 M7 12h10',cinema:'M3 6h12v12H3z m12 4 6-3v10l-6-3',grafico:'M3 4h7l2 2 2-2h7v15h-7l-2 2-2-2H3z M12 6v15',ilustracao:'m4 16 12-12 4 4L8 20H4z M13 7l4 4',materiais:'m12 3 10 5-10 5L2 8z M2 12l10 5 10-5 M2 16l10 5 10-5',volume:'m12 2 9 5v10l-9 5-9-5V7z M3 7l9 5 9-5 M12 12v10',hibridos:'M3 3h18v18H3z M7 3v18 M17 3v18 M3 8h4 M3 16h4 M17 8h4 M17 16h4',motion:'M9 5l10 7-10 7z M3 8h3 M2 12h4 M3 16h3',avatares:'M8 8a4 4 0 1 0 8 0 4 4 0 1 0-8 0 M4 22v-3a8 8 0 0 1 16 0v3',imoveis:'m2 11 10-9 10 9 M5 9v12h14V9 M10 21v-7h4v7',saude:'M9 3h6v6h6v6h-6v6H9v-6H3V9h6z',ecommerce:'M2 3h3l3 13h11l3-9H6 M9 20h1 M18 20h1',infoprodutores:'m2 9 10-6 10 6-10 6z M6 12v6l6 3 6-3v-6',business:'M3 7h18v14H3z M8 7V3h8v4 M3 12h18',default:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z'};
 Object.assign(paths,{'ads-moda':'m8 3 4 2 4-2 6 5-4 4-2-2v11H8V10l-2 2-4-4z','ads-alimentacao':'M4 3v6a3 3 0 0 0 6 0V3 M7 3v19 M20 3c-5 2-5 8 0 9V3v19','ads-casa':'m2 11 10-9 10 9 M5 9v12h14V9 M10 21v-7h4v7','ads-joias':'m3 8 4-5h10l4 5-9 13z M3 8h18 M7 3l5 18 5-18','ads-juridico':'M12 3v18 M6 21h12 M4 7h16 M6 7l-4 8h8z M18 7l-4 8h8z','ads-pets':'M8 13c-2 2-3 4-1 6 2 2 3-1 5-1s3 3 5 1c2-2 1-4-1-6-2-3-6-3-8 0 M4 7a2 3 0 1 0 0 6 2 3 0 1 0 0-6 M9 2a2 3 0 1 0 0 6 2 3 0 1 0 0-6 M15 2a2 3 0 1 0 0 6 2 3 0 1 0 0-6 M20 7a2 3 0 1 0 0 6 2 3 0 1 0 0-6','ads-automotivo':'m3 10 3-6h12l3 6v8H3z M3 10h18 M6 14h2 M16 14h2 M6 18v3 M18 18v3','ads-turismo':'M4 6h16v15H4z M9 6V2h6v4 M8 6v15 M16 6v15','ads-beleza':'M8 8h8v13H8z M10 8V4h4v4 M10 4V2h7 M8 13h8','ads-servicos':'m14 3 2 5 5 2c-1 5-5 6-8 4l-8 8-3-3 8-8c-2-4 0-7 4-8z','ads-infantil':'M3 13h8v8H3z M14 13h7v8h-7z M8 2h8v8H8z M11 2v3h2V2 M6 13v3h2v-3 M16 13v3h2v-3'});
 const icon=id=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[id]||paths.default}"/></svg>`;
 let catalog,byFamily,activeGroup='commercial',expanded='',lastFamily=null,query='',mobile,previousOverflow='';
 const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const family=()=>$('familySelect').value;
 const parent=()=>window.AtlasApp?.categorySelection?.().group||'';
 const groupCount=g=>g.families.reduce((n,id)=>n+byFamily.get(id).count,0);
 const thumb=s=>{const f=s.sequence.frames[s.sequence.heroIndex??1];return (window.ATLAS_ASSET_BASE||'')+(f.thumbnail||f.src)};
 const esc=s=>AtlasViews.esc(s);
 function sidebar(){
  const current=family(),q=norm(query.trim());let count=0;
  $('categoryGroups').innerHTML=groups.map(g=>{
   const families=g.families.map(id=>byFamily.get(id)).filter(f=>!q||norm(f.name+' '+(labels[f.id]||'')+' '+g.name).includes(q));count+=families.length;
   if(!families.length)return '';
   const open=!!q||expanded===g.id;
   return `<section class="category-group"><button type="button" class="category-group-toggle" data-nav-group="${g.id}" aria-current="${parent()===g.id?'true':'false'}" aria-label="${esc(g.name)} · ${groupCount(g)} estilos · ${g.families.length} subcategorias" aria-expanded="${open}" aria-controls="category-group-${g.id}">${icon(g.icon)}<strong>${esc(g.name)}</strong><small title="Estilos neste grupo">${groupCount(g)}</small><span class="category-chevron" aria-hidden="true">⌄</span></button><div id="category-group-${g.id}" ${open?'':'hidden'}>${families.map(f=>{
    const active=current===f.id;
    return `<button type="button" class="category-link" data-nav-family="${f.id}" aria-current="${active?'true':'false'}" title="${esc(f.name)}">${icon(f.id)}<span>${esc(f.name)}</span><small>${f.count}</small></button>`;
   }).join('')}</div></section>`;
  }).join('');
  $('categoryNoResults').hidden=count!==0;$('categoryNavigation').querySelector('.category-all').setAttribute('aria-current',current||parent()?'false':'true');
 }
 function visual(){
  const g=groups.find(g=>g.id===activeGroup),current=family();
  $('categoryExplorerTitle').textContent='Explore '+g.name;$('categoryTiles').style.setProperty('--category-columns',g.families.length>8?5:g.families.length);
  $('categoryTiles').innerHTML=g.families.map(id=>{
   const f=byFamily.get(id),s=catalog.styles.find(s=>s.family===id);
   return `<button type="button" class="category-tile" data-visual-family="${id}" aria-pressed="${id===current}" aria-label="${esc(f.name)} · ${f.count} estilos"><span class="category-tile-image"><img src="${esc(thumb(s))}" alt="" width="140" height="100" loading="lazy"><span class="category-tile-check" aria-hidden="true">✓</span></span><strong>${esc(labels[id])}</strong><small>${f.count} estilos</small></button>`;
  }).join('');
 }
 function sync(){
  if(!catalog)return;const f=family(),parentId=parent(),key=f+'|'+parentId;if(key===lastFamily)return;lastFamily=key;
  const g=groups.find(g=>g.families.includes(f)||g.id===parentId);if(g){activeGroup=g.id;expanded=g.id}else expanded='';
  sidebar();visual();const name=byFamily.get(f)?.name||g?.name,count=f?byFamily.get(f).count:g?groupCount(g):catalog.styles.length;
  $('categoryResultsTitle').textContent=name?`${name} · ${count} estilos`:'Todos os estilos';
  $('exploreCategory').textContent=name?`Explorar ${count} estilos`:'Explorar todos os estilos';
 }
 function choose(id,{close=false}={}){
  if(id&&!byFamily.has(id))return;
  window.AtlasShell.view('library');$('familySelect').value=id;$('familySelect').dispatchEvent(new Event('change',{bubbles:true}));
  if(close){closeDrawer();$('categoryResultsTitle').focus({preventScroll:true});$('categoryResultsTitle').scrollIntoView({block:'start',behavior:'auto'})}
 }
 function openDrawer(){
  const d=$('categoryDrawer');if(d.open)return;
  if(!mobile.matches){$('categorySearch').focus();return}
  d.append($('categorySidebar'));previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
  d.showModal();$('openCategories').setAttribute('aria-expanded','true');$('closeCategories').focus();
 }
 function closeDrawer(){if($('categoryDrawer').open)$('categoryDrawer').close()}
 window.addEventListener('atlas:ready',()=>{
  catalog=window.AtlasApp.getCatalog();byFamily=new Map(catalog.families.map(f=>[f.id,f]));mobile=matchMedia('(max-width:700px)');
  document.body.dataset.categoryNavigation='hybrid';if(mobile.matches)$('categoryExplorer').removeAttribute('open');for(const id of ['categoryNavigation','categoryExplorer','categoryResultsTitle','openCategories'])$(id).hidden=false;
  $('categoryResultsTitle').tabIndex=-1;$('categoryNavigation').querySelector('.category-all small').textContent=catalog.styles.length;
  $('openCategories').onclick=openDrawer;$('closeCategories').onclick=closeDrawer;
  $('categoryDrawer').addEventListener('close',()=>{$('sidebarHome').append($('categorySidebar'));document.body.style.overflow=previousOverflow;$('openCategories').setAttribute('aria-expanded','false');if(mobile.matches)$('openCategories').focus()});
  $('categoryDrawer').addEventListener('click',e=>{if(e.target===$('categoryDrawer'))closeDrawer()});
  $('categoryDrawer').addEventListener('keydown',e=>{
   if(e.key!=='Tab')return;
   const items=[...$('categoryDrawer').querySelectorAll('a[href],button,input,select,textarea,[tabindex]')].filter(el=>!el.disabled&&el.tabIndex>=0&&el.getClientRects().length);
   const first=items[0],last=items.at(-1);if(!first)return;
   if(e.shiftKey&&(document.activeElement===first||!$('categoryDrawer').contains(document.activeElement))){e.preventDefault();last.focus()}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  });
  mobile.addEventListener('change',()=>{if(!mobile.matches)closeDrawer()});
  $('exploreCategory').onclick=()=>{if(parent()){closeDrawer();$('categoryResultsTitle').focus({preventScroll:true});$('categoryResultsTitle').scrollIntoView({block:'start',behavior:'auto'})}else choose(family(),{close:true})};
  $('categorySearch').addEventListener('input',()=>{query=$('categorySearch').value;sidebar()});
  document.addEventListener('click',e=>{
   const group=e.target.closest('[data-nav-group]');if(group){const id=group.dataset.navGroup;const collapse=expanded===id;activeGroup=id;window.AtlasApp.setCategoryGroup(id);expanded=collapse?'':id;sidebar();visual();$('categoryGroups').querySelector(`[data-nav-group="${id}"]`)?.focus();}
   const item=e.target.closest('[data-nav-family]');if(item){const id=item.dataset.navFamily;choose(id);$('categoryNavigation').querySelector(`[data-nav-family="${id}"]`)?.focus();}
   const tile=e.target.closest('[data-visual-family]');if(tile){const id=tile.dataset.visualFamily;choose(id);$('categoryTiles').querySelector(`[data-visual-family="${id}"]`)?.focus();}
   if(e.target.closest('#categorySidebar [data-app-view]'))closeDrawer();
  });
  window.AtlasNavigation={sync,groups};sync();
 });
})();
