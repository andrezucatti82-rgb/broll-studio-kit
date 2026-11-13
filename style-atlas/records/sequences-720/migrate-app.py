"""Wire the approved static app shell without replacing persistence or approvals."""
from pathlib import Path
p=Path(__file__).resolve().parents[2]/'dist/app.js'
s=p.read_text()
assert 'function openBriefing()' not in s
s=s.replace('onlyFav=false,onlyNew=false,compared=', 'onlyFav=false,onlyNew=false,onlyVideo=false,compared=')
a=s.index(' function render(){');b=s.index(' function updateCompare()',a)
s=s[:a]+''' function render(){
 const q=normalize($('search').value.trim()),kind=$('kind').value;
 const items=catalog.styles.filter(s=>(!family||s.family===family)&&(!kind||s.kind===kind)&&(!onlyFav||favorites.has(s.id))&&(!onlyNew||s.edition==='4.1')&&(!onlyVideo||s.preview)&&(!q||normalize([s.name,s.signature,s.exampleTopic,s.uses,...s.resources].join(' ')).includes(q)));
 $('resultCount').textContent=`${items.length} ${items.length===1?'estilo':'estilos'} · ${family?catalog.families.find(f=>f.id===family).name:catalog.families.length+' categorias'}`;
 $('empty').hidden=items.length>0;$('loadMore').hidden=items.length<=visibleCount;
 $('grid').innerHTML=items.slice(0,visibleCount).map(s=>AtlasViews.card(s,{base,selected:selected.includes(s.id),favorite:favorites.has(s.id),compared:compared.has(s.id),icon,imageStyle,previewMedia})).join('');
 $('familySelect').value=family;$('moreFiltersLabel').textContent=kind?'Filtros · 1':'Filtros';$('favoriteFilter').setAttribute('aria-pressed',String(onlyFav));$('newFilter').setAttribute('aria-pressed',String(onlyNew));$('allFilter').setAttribute('aria-pressed',String(!onlyVideo&&!onlyFav));$('videoFilter').setAttribute('aria-pressed',String(onlyVideo));
 updateCompare();animateCards();window.AtlasShell?.afterRender();
 }
 function openBriefing(){if(!selected.length){toast('Escolha um estilo para preparar seu vídeo.');return}window.AtlasShell.openBrief()}
''' +s[b:]
s=s.replace("}).join('');$('handoff').hidden=true}\n function choose", "}).join('');if(!requestPrepared)$('handoff').hidden=true;window.AtlasShell?.selectionChanged(selected.map(id=>byId.get(id)))}\n function choose")
s=s.replace("resetApproval();renderSelection();save();$('detailDialog').close()", "resetApproval();renderSelection();save();render();$('detailDialog').close()")
s=s.replace("$('briefDialog').showModal();$('topic').focus()", 'openBriefing()')
s=s.replace("function detail(id){const s=byId.get(id);if(!s)return;", "function detail(id){const s=byId.get(id);if(!s)return;if(s.sequence){$('detailContent').innerHTML=AtlasViews.detail(s,{base,requirementsHtml,readinessHtml});$('detailDialog').showModal();return}")
s=s.replace('async function downloadFrame(id){try{const s=byId.get(id),ref=AtlasWorkflow.referenceFrame(s),img=new Image();', "async function downloadFrame(id,index){try{const s=byId.get(id),frame=Number.isInteger(index)?s.sequence?.frames[index]:null,ref=frame?{path:frame.src,crop:null,fileName:id+'-'+String(index+1).padStart(2,'0')+'.png'}:AtlasWorkflow.referenceFrame(s),img=new Image();")
s=s.replace("$('handoff').scrollIntoView({behavior:'smooth',block:'nearest'})", 'window.AtlasShell.prepared()')
s=s.replace("if(b.hasAttribute('data-frame'))downloadFrame(b.dataset.frame);", "if(b.hasAttribute('data-frame'))downloadFrame(b.dataset.frame);if(b.hasAttribute('data-sequence-download'))downloadFrame(b.dataset.sequenceDownload,Number(b.dataset.frameIndex));")
s=s.replace("if(b.hasAttribute('data-choose'))choose(b.dataset.choose);", "if(b.hasAttribute('data-choose')){const id=b.dataset.choose;if(b.closest('#grid')){if(selected.includes(id)){selected=selected.filter(x=>x!==id);resetApproval();renderSelection();save();render()}else choose(id,true,false)}else choose(id);}")
s=s.replace("resetApproval();renderSelection();save()}if(b.hasAttribute('data-close'))", "resetApproval();renderSelection();save();render()}if(b.hasAttribute('data-close'))")
s=s.replace("$('newFilter').addEventListener('click'", "$('videoFilter').onclick=()=>{onlyVideo=!onlyVideo;render()};$('allFilter').onclick=()=>{onlyVideo=false;onlyFav=false;onlyNew=false;render()};$('newFilter').addEventListener('click'",1)
s=s.replace("family='';onlyFav=false;onlyNew=false;render()", "family='';onlyFav=false;onlyNew=false;onlyVideo=false;render()")
s=s.replace("toast('Abra outro estilo e use “Combinar com minha escolha”.')", "toast('Use “+ Escolher” para adicionar até dez estilos.')")
s=s.replace("catch{$('promptOutput').focus();", "catch{$('promptDetails').open=true;$('promptOutput').focus();")
s=s.replace("preProductionApprovals=AtlasWorkflow.emptyPreProductionApprovals();renderProject()}", "preProductionApprovals=AtlasWorkflow.emptyPreProductionApprovals();renderProject();window.AtlasShell?.edit()}")
s=s.replace("referenceFrame:AtlasWorkflow.referenceFrame(s),id:s.id", "referenceFrame:AtlasWorkflow.referenceFrame(s),visualSequence:s.sequence,executionPlan:s.executionPlan,id:s.id")
s=s.replace("['3.2','4.0','4.1'].includes(catalog.version)&&['3.1','3.2','4.0'].includes", "['3.2','4.0','4.1','4.2'].includes(catalog.version)&&['3.1','3.2','4.0','4.1'].includes")
s=s.replace("window.AtlasCurrentChoice=choice;window.ATLAS_READY=true", "window.AtlasCurrentChoice=choice;window.AtlasApp={getStyle:id=>byId.get(id),prompt};window.ATLAS_READY=true")
s=s.replace('ROTEIRO → STORYBOARD VISUAL → AMOSTRA','ROTEIRO → MOODBOARD APROVADO → STORYBOARD APROVADO → AMOSTRA')
s=s.replace('Depois da coleta, entregar roteiro, storyboard visual e prévia de 10 segundos para aprovação.', 'Depois da coleta, entregar roteiro, moodboard e storyboard para aceites separados; só então amostra de 10 segundos para aprovação.')
p.write_text(s)
q=p.parent/'app-shell.js';s=q.read_text().replace("behavior:'instant'", "behavior:'auto'");q.write_text(s)
print('Navigation, selection, sequence viewer and collapsed prompt wired')
