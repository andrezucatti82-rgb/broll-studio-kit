/* App-like navigation over the static, account-independent atlas. */
(()=>{
 const $=id=>document.getElementById(id);let selected=[],stage='briefing',ready=false,viewerStyle=null,viewerIndex=0,returnFocus=null;
 const base=()=>window.ATLAS_ASSET_BASE||'';
 function view(name){
  document.body.dataset.view=name;
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
  document.body.dataset.view='brief';
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
  const ids=new Set(['product','property','ui','data','clinical','course','coverage','presenter','brand','facts']);
  const materials=c.intake.items.filter(x=>ids.has(x.id));
  $('summaryMaterials').replaceChildren(...materials.slice(0,4).map(x=>{const row=document.createElement('li');const title=document.createElement('strong');title.textContent=x.title;const hint=document.createElement('span');hint.textContent=x.id==='brand'?'Opcional':'Conforme o conteúdo';row.append(title,hint);return row}));
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
 document.addEventListener('click',e=>{
  const nav=e.target.closest('[data-app-view]');if(nav){nav.dataset.appView==='brief'?openBrief():view(nav.dataset.appView)}
  if(e.target.closest('[data-edit-brief]'))setStage('briefing');
  const step=e.target.closest('[data-brief-stage]');if(step){if(step.dataset.briefStage==='styles')view('library');else if(step.dataset.briefStage==='review')$('briefForm').requestSubmit();else setStage('briefing')}
  const frame=e.target.closest('[data-sequence]');if(frame)showFrame(frame.dataset.sequence,Number(frame.dataset.frameIndex),frame);
 });
 $('briefDialog').addEventListener('close',()=>{if(document.body.dataset.view==='brief')view('library')});
 $('sequencePrev').onclick=()=>{if(viewerIndex>0){viewerIndex--;updateFrame()}};$('sequenceNext').onclick=()=>{if(viewerIndex<3){viewerIndex++;updateFrame()}};
 $('sequenceDialog').addEventListener('keydown',e=>{if(e.key==='ArrowLeft')$('sequencePrev').click();if(e.key==='ArrowRight')$('sequenceNext').click()});
 $('sequenceDialog').addEventListener('close',()=>returnFocus?.focus());
 window.AtlasShell={openBrief,selectionChanged,prepared(){setStage('review');$('handoffTitle').focus({preventScroll:true})},edit(){setStage('briefing')},view,afterRender(){document.querySelectorAll('#grid [data-style-id]').forEach(card=>card.classList.toggle('is-selected',selected.some(s=>s.id===card.dataset.styleId)))}};
 window.addEventListener('atlas:ready',()=>{ready=true;renderSummary();if(document.body.dataset.view!=='brief')view('library');});
})();
