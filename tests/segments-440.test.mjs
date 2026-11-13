import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import '../style-atlas/dist/workflow.js';
import '../style-atlas/dist/guided.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const c=read('style-atlas/dist/catalog.json'),W=globalThis.AtlasWorkflow;
test('eleven grouped ad segments contain forty styles each without removing the previous 780 IDs',()=>{
 assert.equal(c.styles.length,1160);assert.equal(c.families.length,29);
 assert.equal(new Set(c.styles.map(s=>s.id)).size,1160);assert.equal(new Set(c.styles.map(s=>s.name.toLocaleLowerCase('pt-BR'))).size,1160);
 const old=read('style-atlas/records/segments-440/previous-ids.json');assert.equal(old.length,780);assert.deepEqual(c.styles.slice(0,780).map(s=>s.id),old);
 const groups=['ads-moda','ads-alimentacao','ads-casa','ads-joias','ads-juridico','ads-pets','ads-automotivo','ads-turismo','ads-beleza','ads-servicos','ads-infantil'];
 assert.deepEqual(new Set(c.families.slice(18).map(f=>f.id)),new Set(groups));
 for(const id of groups){const rows=c.styles.filter(s=>s.family===id);assert.equal(rows.length,40,id);assert.equal(c.families.find(f=>f.id===id).count,40);assert.equal(rows.filter(s=>s.advertising.framework==='DBO').length,20);assert.equal(rows.filter(s=>s.advertising.framework==='AIDA').length,20);}
 assert.equal(c.styles.slice(780).length,380);assert.equal(c.styles.filter(s=>s.preview).length,6);
});
test('existing reference frames and hero images are preserved during regrouping',()=>{
 const previous=read('style-atlas/records/segments-440/previous-references.json');assert.equal(previous.length,780);
 for(const before of previous){const s=c.styles.find(s=>s.id===before.id);assert.deepEqual(s.image,before.image);assert.deepEqual(s.sequence,before.sequence);}
 assert.equal(c.styles.find(s=>s.id==='natural-barras-a-pausa-cabe-na-bolsa').family,'ads-alimentacao');
 assert.equal(c.styles.find(s=>s.id==='natural-biquinis-amarracao-vista-de-verdade').family,'ads-moda');
});
test('new ad boards are original files with provenance and remain visual concepts pending user review',()=>{
 const assets=read('style-atlas/records/segments-440/assets.json');assert.equal(assets.length,380);const hashes=new Set(),frames=new Set();
 for(const a of assets){const s=c.styles.find(s=>s.id===a.id);assert.ok(s);assert.equal(a.generator,'OpenAI image_gen');assert.ok(a.prompt||a.promptRecord);assert.equal(a.crops.length,4);hashes.add(a.sourceSHA256);
  assert.equal(s.sequence.motionValidated,false);assert.equal(s.sequence.conceptOnly,true);assert.equal(s.sequence.conceptApproval,'pending_user_review');assert.equal(s.readiness.status,'visual_reference');assert.ok(!s.preview);
  for(const f of s.sequence.frames){assert.ok(f.width>=500&&f.height>=700);assert.ok(Math.abs(f.width/f.height-2/3)<.02);assert.ok(fs.existsSync(new URL('../style-atlas/dist/'+f.src,import.meta.url)));frames.add(f.src);}
 }
 assert.equal(hashes.size,380);assert.equal(frames.size,1520);
});
test('advertising plans and neutral generated prompts carry distinct actions, source links, sound and editable text',()=>{
 for(const s of c.styles.slice(780)){
  assert.ok(s.advertising.hook&&s.advertising.cta&&s.advertising.researchBasis.sources.length>=2);assert.equal(s.advertising.researchBasis.salesPerformanceVerified,false);
  assert.equal(s.audio.narrationRequired,true);assert.equal(s.audio.captionsRequired,true);assert.equal(s.advertising.captions.editable,true);assert.equal(s.advertising.captions.synchronized,true);
  assert.equal(s.preset.avatar,false);assert.ok(s.executionPlan.visualLayout);assert.equal(s.executionPlan.referenceStates.length,4);assert.equal(new Set(s.executionPlan.referenceStates.map(r=>r.state)).size,4);assert.ok(s.proof&&s.requirements&&s.preset.productFidelity);
  const p=W.buildPrompt({selectedStyles:[{...s,visualSequence:s.sequence,referenceFrame:W.referenceFrame(s)}],targetDurationSeconds:45,scenePlan:W.estimateScenePlan(45),format:'9:16',topic:'Marca fictícia para verificação',fidelityContract:W.fidelityContract});
  for(const v of [s.advertising.hook,s.advertising.cta,s.proof,s.image.atlas,s.advertising.researchBasis.sources[0].url,s.executionPlan.visualLayout])assert.ok(p.includes(v),s.id);
  assert.doesNotMatch(p,/\bGDA\b|wa\.me|SEU_WHATSAPP/);
  if(s.family==='ads-juridico')assert.equal(s.advertising.professionalConstraints.informativeOnly,true);
  if(s.family==='ads-infantil')assert.equal(s.advertising.professionalConstraints.adultAudience,true);
 }
});

test('display interleaves all eleven niches and visual modes without changing persistent catalogue positions',()=>{
 const rows=c.styles.filter(s=>s.advertising),before=rows.map(s=>s.id),ordered=AtlasGuided.advertisingOrder(rows,c.families.map(f=>f.id));
 assert.deepEqual(rows.map(s=>s.id),before);assert.equal(ordered.length,440);assert.deepEqual(new Set(ordered.map(s=>s.id)),new Set(before));assert.equal(new Set(ordered.slice(0,11).map(s=>s.family)).size,11);
 for(const f of c.families.slice(18)){const group=AtlasGuided.advertisingOrder(rows.filter(s=>s.family===f.id));assert.equal(group.length,40);assert.equal(group[0].creativeMode,'campaign_composite');assert.equal(group[1].creativeMode,'natural_ugc');}
});
