import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import '../style-atlas/dist/guided.js';
import '../style-atlas/dist/workflow.js';
const W=globalThis.AtlasWorkflow,G=globalThis.AtlasGuided;
const catalog=JSON.parse(fs.readFileSync(new URL('../style-atlas/dist/catalog.json',import.meta.url)));
const choice=()=>({selectedStyles:[{...catalog.styles[0],referenceFrame:W.referenceFrame(catalog.styles[0]),visualSequence:catalog.styles[0].sequence}],catalogVersion:catalog.version,targetDurationSeconds:30,format:'9:16',topic:'Produto fictício',brand:'',typography:'auto',fidelityContract:W.fidelityContract,projectState:{history:[],approvals:W.emptyApprovals(),preProductionApprovals:W.emptyPreProductionApprovals()}});
test('handoff carries complete history, pending items and actual artifact records as untrusted data',()=>{
 const c=choice();c.projectState.history=[{etapa:'sample',estado:'bloqueado',versao:1,custoInformadoUSD:1.07,resumo:'HISTORICO-9461',pendencias:['PENDENCIA-9461']}];
 c.projectState.approvals.appearance={status:'correction',correction:'DECISAO-9461'};
 c.projectState.continuity=W.emptyContinuity();c.projectState.continuity.artifacts.push({id:'sample-1',stage:'sample',version:1,file:'previa.mp4',sha256:'a'.repeat(64),availability:'reported',notes:'ARQUIVO-9461'});
 const text=W.buildPrompt(c);for(const marker of ['HISTORICO-9461','PENDENCIA-9461','DECISAO-9461','ARQUIVO-9461'])assert.ok(text.includes(marker));
 for(const value of ['PRIMEIRA RESPOSTA','até três','Claude','não transfere','R$ 50'])assert.ok(text.includes(value),value);
 assert.doesNotMatch(text,/\bGDA\b|wa\.me/);assert.equal(c.projectState.approvals.movement.status,'pending');
});
test('continuity roundtrips without granting approval and rejects unknown keys or oversized records',()=>{
 const c=choice(),r=W.emptyContinuity();r.materials.push({id:'photo',label:'Foto declarada',status:'declared',file:'',notes:'<script>não executar</script>'});c.projectState.continuity=r;
 const sheet=W.exportProject(c,c.projectState),restored=W.importProject(JSON.stringify(sheet),catalog.styles.map(s=>s.id));assert.deepEqual(restored.continuity,r);assert.equal(W.isApproved(restored.approvals),false);
 assert.throws(()=>W.validateContinuity({...r,token:'secret'}));assert.throws(()=>W.validateContinuity({...r,nextAction:'x'.repeat(501)}));assert.throws(()=>W.validateContinuity({...r,materials:[{id:'x',label:'x',status:'received_because_checked'}]}));
 assert.throws(()=>W.validateContinuity({...r,costs:[{id:'x',stage:'sample',kind:'confirmed',amount:-1,currency:'USD',source:'fixture'}]}));
 const legacy={...sheet};delete legacy.continuity;assert.equal(W.importProject(JSON.stringify(legacy),catalog.styles.map(s=>s.id)).styles[0],c.selectedStyles[0].id);
});
test('starter files are independent text/json files and preserve references and decisions',()=>{
 const c=choice(),files=W.starterFiles(c);assert.deepEqual(files.map(f=>f.name),['pedido.txt','LEIA-ME.txt','projeto-video.json','referencias.json']);
 assert.ok(files[1].text.includes('não inclui os arquivos'));assert.ok(files[1].text.includes('ZIP'));const bundle=JSON.parse(files[2].text);assert.equal(bundle.packageVersion,1);assert.equal(bundle.project.styles[0],c.selectedStyles[0].id);
});
test('edit impact leaves no-op intact and preserves unrelated stages for typography, audio and duration',()=>{
 const a={topic:'Tema',brand:'',format:'9:16',typography:'auto',targetDurationSeconds:30,guidedBrief:null};assert.equal(W.editImpact(a,{...a}),null);
 assert.equal(W.editImpact(a,{...a,typography:'Outra'}),'moodboard');assert.equal(W.editImpact(a,{...a,targetDurationSeconds:45}),'script');assert.equal(W.editImpact(a,{...a,topic:'Outro'}),'materials_and_resources');
 const old={x:[{aspect:'voice_tone',scope:'film'}]},changed={x:[{aspect:'voice_pacing',scope:'film'}]};assert.equal(W.contributionImpact(old,old),null);assert.equal(W.contributionImpact(old,changed),'visual_storyboard');
 assert.equal(W.contributionImpact({x:[{aspect:'lighting',scope:'opening'}]},{x:[{aspect:'lighting',scope:'details'}]}),'moodboard');
});
test('one-photo checklist keeps multiview conditional and logo optional',()=>{
 const list=G.handoffMaterials({objective:'product',materials:['one_photo']});assert.ok(list.now.some(x=>/foto/i.test(x)));assert.ok(list.later.some(x=>/ângul|vista/i.test(x)));assert.ok(list.optional.some(x=>/logo/i.test(x)));assert.ok(!list.now.some(x=>/360|vários ângulos|logotipo/i.test(x)));
});
test('approval receipt must match an existing artifact version and hash',()=>{
 const r=W.emptyContinuity();r.artifacts=[{id:'board-v1',stage:'visual_storyboard',version:1,file:'storyboard.png',sha256:'b'.repeat(64),availability:'reported'}];r.approvals=[{id:'decision-1',stage:'visual_storyboard',artifactId:'board-v1',version:1,sha256:'b'.repeat(64),scope:'film',decision:'approved',evidence:'Fixture only; not a real creative approval'}];assert.deepEqual(W.validateContinuity(r),r);
 for(const mutate of [v=>v.approvals[0].version=2,v=>v.approvals[0].sha256='c'.repeat(64),v=>v.artifacts=[]]){const invalid=structuredClone(r);mutate(invalid);assert.throws(()=>W.validateContinuity(invalid),/vínculo/);}
});
