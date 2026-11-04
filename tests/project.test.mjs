import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createProject} from '../scripts/new-project.mjs';
import {validate} from '../scripts/validate.mjs';
import {buildTimeline,reviewFrames} from '../src/timeline.mjs';
import {checkReview,creativeChecks} from '../scripts/review.mjs';
const template=()=>JSON.parse(fs.readFileSync('templates/project.json'));
test('assets cannot escape public/, including foreground layers',()=>{
 validate(template());const x=template();x.scenes[0].media.src='../secret';assert.throws(()=>validate(x),/safe relative/);
 const y=template();y.scenes[0].layers=[{media:{type:'image',src:'../secret'},left:0,top:0,width:10,height:10,from:{x:0,y:0,scale:1},to:{x:10,y:0,scale:1}}];assert.throws(()=>validate(y),/safe relative/);
});
test('three unequal shots retain exact start times and explicit overlaps',()=>{
 const x=template();x.scenes=x.scenes.slice(0,3);[31,67,52].forEach((n,i)=>x.scenes[i].durationFrames=n);x.scenes[1].transition={type:'dissolve',durationFrames:12};validate(x);
 const t=buildTimeline(x.scenes);assert.deepEqual(t.clips.map(c=>c.from),[0,31,98]);assert.deepEqual(t.clips.map(c=>c.overlapAfter),[12,0,0]);assert.equal(t.durationInFrames,150);
 const frames=reviewFrames(x.scenes);for(const f of [0,30,31,43,97,98,149])assert(frames.includes(f));assert(frames.every(f=>f>=0&&f<150));
});
test('invalid dissolves, duplicate IDs and noninteger timing fail',()=>{
 for(const mutate of [x=>x.scenes[0].durationFrames=10.5,x=>x.scenes[1].id=x.scenes[0].id,x=>x.scenes[0].transition={type:'dissolve',durationFrames:10},x=>x.scenes[1].transition={type:'dissolve',durationFrames:1000}]){const x=template();mutate(x);assert.throws(()=>validate(x));}
});
test('captions cannot overlap or run beyond the assembled film',()=>{
 const x=template();x.captions=[{start:1,end:4,text:'a'},{start:3,end:5,text:'b'}];assert.throws(()=>validate(x),/timing/);
 x.captions=[{start:14,end:16,text:'a'}];assert.throws(()=>validate(x),/timing/);
});
test('new projects preserve existing work and start with pending creative review',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'broll-test-'));
 try{const dest=createProject({topic:'Coffee roasting',slug:'coffee',root});const b=JSON.parse(fs.readFileSync(path.join(dest,'brief.json')));assert.equal(b.brand.name,'');assert.equal(b.researchStatus,'pending');const review=JSON.parse(fs.readFileSync(path.join(dest,'review.json')));assert.equal(review.playback.status,'not_run');assert(fs.existsSync(path.join(dest,'shot-plan.json')));assert.throws(()=>createProject({topic:'Other',slug:'coffee',root}));assert.throws(()=>createProject({topic:'Other',slug:'../escape',root}));}finally{fs.rmSync(root,{recursive:true,force:true});}
});
const filledReview=()=>({schemaVersion:1,videoSha256:'fixture-hash',technical:{status:'passed',evidence:'Test fixture only'},playback:{status:'passed',method:'continuous-playback',scope:'entire-video',reviewer:'Test fixture',notes:'Test observation'},listening:{status:'passed',method:'listening',scope:'entire-video',reviewer:'Test fixture',notes:'Test observation'},creative:Object.fromEntries(creativeChecks.map(k=>[k,{status:'passed',notes:'Test observation'}])),issues:[]});
test('technical success cannot replace actual playback and listening records',()=>{
 const r=filledReview();assert.equal(checkReview(r,'fixture-hash').ready,true);
 r.listening.status='not_run';assert.equal(checkReview(r,'fixture-hash').ready,false);
 r.listening.status='passed';r.playback.method='stills';assert.equal(checkReview(r,'fixture-hash').ready,false);
 r.playback.method='continuous-playback';r.creative.depth.notes='';assert.equal(checkReview(r,'fixture-hash').ready,false);
});
test('a changed video or unresolved blocker invalidates the approval',()=>{
 const r=filledReview();assert.equal(checkReview(r,'new-hash').ready,false);r.issues=[{severity:'blocking',status:'open',note:'Cut word'}];assert.equal(checkReview(r,'fixture-hash').ready,false);
});
