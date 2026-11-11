import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {prepareProduction} from '../scripts/production-plan.mjs';
test('resuming a production preserves evidence and never approves a sample',()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'production-plan-'));
 try{const preset=path.join(tmp,'brief.json'),out=path.join(tmp,'production');fs.writeFileSync(preset,JSON.stringify({topic:'Fictional product',format:'9:16',selectedStyles:[{id:'hero-premium-sensorial'}]}));prepareProduction(preset,out);const r=JSON.parse(fs.readFileSync(path.join(out,'production.json')));assert.equal(r.stages.user_approval.status,'pending');assert.equal(r.targetDurationSeconds,30);assert.equal(r.firstDeliverySeconds,10);assert.equal(r.stages.final_video.status,'pending');assert.equal(r.fullVideoBlockedUntilUserApproval,true);fs.writeFileSync(path.join(out,'notes.txt'),'preserve');assert.equal(prepareProduction(preset,out).status,'resumed_without_overwrite');assert.equal(fs.readFileSync(path.join(out,'notes.txt'),'utf8'),'preserve');fs.writeFileSync(preset,JSON.stringify({topic:'Changed',format:'9:16',selectedStyles:['hero-premium-sensorial']}));assert.throws(()=>prepareProduction(preset,out),/preserving/);}finally{fs.rmSync(tmp,{recursive:true,force:true});}
});

test('production keeps ten selected styles and rejects eleven',()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'production-ten-'));
 try{const catalog=JSON.parse(fs.readFileSync(new URL('../style-atlas/dist/catalog.json',import.meta.url))),styles=catalog.styles.slice(0,11).map(s=>({id:s.id})),preset=path.join(tmp,'brief.json'),out=path.join(tmp,'production');
 fs.writeFileSync(preset,JSON.stringify({topic:'Combination',format:'9:16',selectedStyles:styles.slice(0,10)}));prepareProduction(preset,out);const plan=JSON.parse(fs.readFileSync(path.join(out,'production.json')));assert.deepEqual(plan.styles.map(s=>s.id),styles.slice(0,10).map(s=>s.id));assert.equal(plan.referenceFrames.length,10);
 fs.writeFileSync(preset,JSON.stringify({topic:'Combination',format:'9:16',selectedStyles:styles}));assert.throws(()=>prepareProduction(preset,path.join(tmp,'eleven')),/ten styles/);
 }finally{fs.rmSync(tmp,{recursive:true,force:true});}
});

test('resuming a legacy production adds visual stages without approving or losing evidence',()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'production-visual-'));
 try{const preset=path.join(tmp,'brief.json'),out=path.join(tmp,'production');fs.writeFileSync(preset,JSON.stringify({topic:'Test',format:'9:16',selectedStyles:['hero-premium-sensorial']}));prepareProduction(preset,out);const file=path.join(out,'production.json'),legacy=JSON.parse(fs.readFileSync(file));delete legacy.stages.moodboard;delete legacy.preProduction;delete legacy.preProductionApprovals;legacy.stages.sample={status:'concluido',evidence:['preserved-sample.mp4']};fs.writeFileSync(file,JSON.stringify(legacy));prepareProduction(preset,out);const resumed=JSON.parse(fs.readFileSync(file));assert.deepEqual(resumed.stages.sample,legacy.stages.sample);assert.equal(resumed.stages.moodboard.status,'pending');assert.equal(resumed.preProductionApprovals.moodboard.status,'pending');assert.equal(resumed.sampleBlockedUntilPreProductionApproval,true);assert.ok(fs.existsSync(path.join(out,'preproduction-plan.json')));
 }finally{fs.rmSync(tmp,{recursive:true,force:true});}
});

test('production retains complete old and new style directions and preserves edited evidence on resume',()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'production-directions-'));
 try{
  const catalog=JSON.parse(fs.readFileSync(new URL('../style-atlas/dist/catalog.json',import.meta.url))),selected=[catalog.styles[0],catalog.styles.at(-1)],preset=path.join(tmp,'brief.json'),out=path.join(tmp,'production');
  fs.writeFileSync(preset,JSON.stringify({topic:'Style execution',format:'9:16',targetDurationSeconds:90,selectedStyles:selected.map(s=>({id:s.id}))}));prepareProduction(preset,out);
  const file=path.join(out,'style-execution-plan.json'),plan=JSON.parse(fs.readFileSync(file));
  assert.equal(plan.catalogSnapshot.version,catalog.version);assert.equal(plan.targetDurationSeconds,90);assert.equal(plan.sample.targetSeconds,10);assert.equal(plan.sample.userApproval.status,'pending');
  for(const [i,s] of selected.entries())for(const key of ['id','signature','motion','resources','audio','requirements','proof','readiness'])assert.deepEqual(plan.selectedStyles[i][key],s[key]);
  assert.equal(plan.selectedStyles[1].referenceFrame.styleId,selected[1].id);
  plan.deviations.push({reason:'User note retained'});fs.writeFileSync(file,JSON.stringify(plan));prepareProduction(preset,out);assert.deepEqual(JSON.parse(fs.readFileSync(file)),plan);
  fs.unlinkSync(file);prepareProduction(preset,out);assert.equal(JSON.parse(fs.readFileSync(file)).sample.userApproval.status,'pending');
 }finally{fs.rmSync(tmp,{recursive:true,force:true});}
});
