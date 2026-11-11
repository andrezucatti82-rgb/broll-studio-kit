import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import '../style-atlas/dist/workflow.js';
const root=new URL('../',import.meta.url),read=p=>JSON.parse(fs.readFileSync(new URL(p,root)));
const catalog=read('style-atlas/dist/catalog.json');
test('720 distinct directions, ten new in each of 18 categories and original IDs in original order',()=>{
 const original=read('tests/style-ids.json');assert.equal(original.length,540);
 assert.deepEqual(catalog.styles.slice(0,540).map(s=>s.id),original);
 assert.equal(catalog.styles.length,720);assert.equal(new Set(catalog.styles.map(s=>s.id)).size,720);
 assert.equal(new Set(catalog.styles.map(s=>s.name.toLocaleLowerCase('pt-BR'))).size,720);
 assert.equal(catalog.families.length,18);
 for(const f of catalog.families){assert.equal(f.count,40);const rows=catalog.styles.filter(s=>s.family===f.id);assert.equal(rows.length,40);assert.equal(rows.filter(s=>s.edition==='4.1').length,10);}
 assert.equal(catalog.styles.filter(s=>s.preview).length,6);
});
test('every new visual is its own file with provenance and complete, non-approved production contract',()=>{
 const manifest=read('style-atlas/records/expansion-720/assets.json'),ids=new Set(catalog.styles.map(s=>s.id));assert.equal(manifest.assets.length,180);
 const paths=new Set(),hashes=new Set();
 for(const s of catalog.styles.slice(540)){
  assert.equal(s.readiness.status,'visual_reference');assert.ok(!s.preview);assert.ok(s.proof&&s.requirements&&s.novelty.difference);assert.ok(ids.has(s.novelty.nearestId));
  assert.ok(s.resources.length>=4);for(const k of ['voice','music','sfx','mix'])assert.ok(s.audio[k]);
  assert.equal(s.preset.avatar,s.family==='avatares');assert.ok(s.preset.approvalGate.includes('moodboard'));assert.ok(s.preset.approvalGate.includes('storyboard'));
  const historical=s.legacyImage||s.image;const a=manifest.assets.find(x=>x.path===historical.atlas);assert.ok(a);assert.ok(a.width>=500&&a.height>=440);assert.ok(Math.abs(a.width/a.height-1.125)<.04);assert.match(historical.atlas,/assets\/(expansion-720-r2|editorial-r3)\//);
  const hash=crypto.createHash('sha256').update(fs.readFileSync(new URL('style-atlas/dist/'+a.path,root))).digest('hex');assert.equal(hash,a.sha256);paths.add(a.path);hashes.add(hash);
  const prompt=globalThis.AtlasWorkflow.buildPrompt({selectedStyles:[{...s,referenceFrame:globalThis.AtlasWorkflow.referenceFrame(s)}],targetDurationSeconds:30,format:'9:16',topic:'Exemplo',fidelityContract:globalThis.AtlasWorkflow.fidelityContract});assert.ok(prompt.includes(s.image.atlas));assert.ok(prompt.includes(s.proof));assert.doesNotMatch(prompt,/\bGDA\b|wa\.me|WHATSAPP/);
 }
 assert.equal(paths.size,180);assert.equal(hashes.size,180);
});
