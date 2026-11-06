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
