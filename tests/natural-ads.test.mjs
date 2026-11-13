import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import '../style-atlas/dist/workflow.js';
import {validateCatalog} from '../scripts/validate.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const c=read('style-atlas/dist/catalog.json'),W=globalThis.AtlasWorkflow;
test('60 narrated concepts append to the unchanged 720 IDs in ten balanced segments',()=>{
 assert.equal(c.styles.length,1160);assert.equal(c.families.length,29);
 assert.deepEqual(c.styles.slice(0,720).map(s=>s.id),read('style-atlas/records/natural-ads-60/previous-ids.json'));
 assert.equal(new Set(c.styles.map(s=>s.name.toLocaleLowerCase('pt-BR'))).size,1160);
 const newStyles=c.styles.slice(720,780);assert.equal(newStyles.length,60);
 for(const id of new Set(newStyles.map(s=>s.legacyFamily||s.family))){const a=newStyles.filter(s=>(s.legacyFamily||s.family)===id);assert.equal(a.length,6);assert.deepEqual(new Set(a.map(s=>s.advertising.framework)),new Set(['DBO','AIDA']));}
 validateCatalog(c);
});
test('every new prompt preserves narration, editable captions, structure, real evidence and closing CTA',()=>{
 for(const s of c.styles.slice(720)){
  const a=s.advertising;assert.deepEqual(a.targetDurationRange,[30,45]);assert.equal(a.narrationRequired,true);assert.equal(a.captionsRequired,true);
  assert.equal(a.captions.editable,true);assert.equal(a.captions.synchronized,true);assert.equal(s.audio.narrationRequired,true);assert.equal(s.audio.captionsRequired,true);
  assert.equal(s.preset.avatar,false);assert.equal(s.sequence.motionValidated,false);assert.equal(s.readiness.status,'visual_reference');assert.ok(!s.preview);
  const p=W.buildPrompt({selectedStyles:[{...s,visualSequence:s.sequence,referenceFrame:W.referenceFrame(s)}],targetDurationSeconds:45,scenePlan:W.estimateScenePlan(45),format:'9:16',topic:'Produto demonstrativo',fidelityContract:W.fidelityContract});
  for(const value of [a.cta,a.hook,a.frameworkMeaning,s.image.atlas,s.proof,'captionsRequired','narrationRequired'])assert.ok(p.includes(value),s.id+': '+value);
  assert.doesNotMatch(p,/\bGDA\b|wa\.me|WHATSAPP|Seu WhatsApp/);
  assert.equal(W.normalizeDuration(45),45);
 }
 const bad=structuredClone(c);delete bad.styles.at(-1).advertising.cta;assert.throws(()=>validateCatalog(bad),/narrated ad contract/);
});


test('presenter preference is explicit in prompts for avatar and non-avatar styles',()=>{
 for(const s of [c.styles.find(s=>s.family==='avatares'),c.styles.at(-1)]){
  const p=W.buildPrompt({selectedStyles:[{...s,referenceFrame:W.referenceFrame(s)}],targetDurationSeconds:30,format:'9:16',topic:'Exemplo',fidelityContract:W.fidelityContract});
  assert.ok(p.includes('"avatar":'+String(s.preset.avatar===true)));
 }
});


test('all 1160 style prompts retain proof, materials and explicit presenter settings',()=>{
 for(const s of c.styles){const p=W.buildPrompt({selectedStyles:[{...s,referenceFrame:W.referenceFrame(s),visualSequence:s.sequence}],topic:'Demonstração',format:'9:16',targetDurationSeconds:30,typography:'auto',scenePlan:W.estimateScenePlan(30),qualityPolicy:c.qualityPolicy,identityPolicy:c.identityPolicy,fidelityContract:W.fidelityContract,intake:{items:[]}});assert.doesNotMatch(p,/\bGDA\b|\[object Object\]|undefined/);assert.ok(p.includes(s.proof));assert.ok(p.includes(s.requirements));assert.ok(p.includes('"avatar":'+String(s.preset.avatar===true)));}
});
