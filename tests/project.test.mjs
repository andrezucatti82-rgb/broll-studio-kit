import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createProject} from '../scripts/new-project.mjs';
import {validate} from '../scripts/validate.mjs';
import {buildTimeline,reviewFrames} from '../src/timeline.mjs';
import {checkIdentityReview} from '../scripts/identity-check.mjs';
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
 try{const dest=createProject({topic:'Coffee roasting',slug:'coffee',root});const b=JSON.parse(fs.readFileSync(path.join(dest,'brief.json')));assert.equal(b.brand.name,'');assert.equal(b.researchStatus,'pending');const review=JSON.parse(fs.readFileSync(path.join(dest,'review.json')));assert.equal(review.playback.status,'not_run');assert(fs.existsSync(path.join(dest,'shot-plan.json')));const pre=JSON.parse(fs.readFileSync(path.join(dest,'preproduction-plan.json')));assert.equal(pre.moodboard.userApproval.status,'pending');assert.equal(pre.storyboard.userApproval.status,'pending');assert.throws(()=>createProject({topic:'Other',slug:'coffee',root}));assert.throws(()=>createProject({topic:'Other',slug:'../escape',root}));}finally{fs.rmSync(root,{recursive:true,force:true});}
});
const fixtureHash='a'.repeat(64);
const filledReview=()=>({schemaVersion:1,preProduction:{moodboardApproved:true,storyboardApproved:true,moodboardVersion:1,storyboardVersion:1,evidence:'Test fixture only'},fidelityContract:Object.fromEntries(['appearance','movement','text','identity'].map(k=>[k,{status:'passed',userApproval:true,evidence:'Test fixture only'}])),videoSha256:fixtureHash,identityPreservation:{realPeoplePresent:false,status:'not_applicable',notes:'Test scene contains no people'},technical:{status:'passed',evidence:'Test fixture only'},playback:{status:'passed',method:'continuous-playback',scope:'entire-video',reviewer:'Test fixture',notes:'Test observation'},listening:{status:'passed',method:'listening',scope:'entire-video',reviewer:'Test fixture',notes:'Test observation'},creative:Object.fromEntries(creativeChecks.map(k=>[k,{status:'passed',notes:'Test observation'}])),qualityGates:Object.fromEntries(['imageGeneration','videoGeneration','finishing'].map(k=>[k,{status:'passed',reviewer:'Test fixture',notes:'Test only',assets:[{file:'fixture',sha256:fixtureHash,evidence:'Test only'}]}])),issues:[]});
test('technical success cannot replace actual playback and listening records',()=>{
 const r=filledReview();assert.equal(checkReview(r,fixtureHash).ready,true);
 r.listening.status='not_run';assert.equal(checkReview(r,fixtureHash).ready,false);
 r.listening.status='passed';r.playback.method='stills';assert.equal(checkReview(r,fixtureHash).ready,false);
 r.playback.method='continuous-playback';r.creative.depth.notes='';assert.equal(checkReview(r,fixtureHash).ready,false);
});
test('a changed video or unresolved blocker invalidates the approval',()=>{
 const r=filledReview();assert.equal(checkReview(r,'new-hash').ready,false);r.issues=[{severity:'blocking',status:'open',note:'Cut word'}];assert.equal(checkReview(r,fixtureHash).ready,false);
});
test('quality stages cannot be skipped or approved without asset evidence',()=>{
 const r=filledReview();delete r.qualityGates.imageGeneration;assert.equal(checkReview(r,fixtureHash).ready,false);
 r.qualityGates.imageGeneration={status:'not_applicable',notes:'No generated images used'};assert.equal(checkReview(r,fixtureHash).ready,true);
 r.qualityGates.videoGeneration={status:'not_applicable',notes:''};assert.equal(checkReview(r,fixtureHash).ready,false);
 r.qualityGates.videoGeneration={status:'not_applicable',notes:'Controlled vector animation'};assert.equal(checkReview(r,fixtureHash).ready,true);
 r.qualityGates.finishing.assets[0].sha256='b'.repeat(64);assert.equal(checkReview(r,fixtureHash).ready,false);
 r.qualityGates.finishing={status:'not_applicable',notes:'Cannot skip finishing'};assert.equal(checkReview(r,fixtureHash).ready,false);
});

test('identity drift and generated-only references block full production',()=>{
 const r={realPeoplePresent:true,status:'passed',reviewer:'Fixture',notes:'Fixture only',toolAssessment:{tool:'Fixture',capabilities:'Fixture',limitations:'Fixture',creditDecision:'Fixture'},test:{file:'test.mp4',sha256:fixtureHash,durationSeconds:10},people:[{id:'person-1',originalReferences:[{role:'original',file:'source.jpg',sha256:fixtureHash}],authorizedChanges:[],coverageLimits:'Frontal close only',checks:Object.fromEntries(['start','middle','end','angleChanges','face','visibleBody'].map(k=>[k,{status:'passed',evidence:'Test observation only'}]))}]};
 assert.equal(checkIdentityReview(r).ready,true);
 r.people[0].checks.visibleBody.status='failed';assert.equal(checkIdentityReview(r).ready,false);
 r.people[0].checks.visibleBody.status='passed';r.people[0].originalReferences[0].role='generated';assert.equal(checkIdentityReview(r).ready,false);
 r.people[0].originalReferences[0].role='original';r.people[0].checks.angleChanges={status:'not_applicable',evidence:'No angle change; profile remains unvalidated'};assert.equal(checkIdentityReview(r).ready,true);
 r.people[0].checks.angleChanges.evidence='';assert.equal(checkIdentityReview(r).ready,false);
 assert.equal(checkIdentityReview({realPeoplePresent:false,status:'not_applicable',notes:''}).ready,false);
 assert.equal(checkIdentityReview(undefined).ready,false);
});

test('missing user fidelity approval blocks review',()=>{const r=filledReview();r.fidelityContract.appearance.userApproval=false;assert.equal(checkReview(r,fixtureHash).ready,false);});

test('visual preproduction cannot be approved without decisions and exact versions',()=>{for(const mutate of [r=>delete r.preProduction,r=>r.preProduction.moodboardApproved=false,r=>r.preProduction.storyboardApproved=false,r=>r.preProduction.moodboardVersion=null,r=>r.preProduction.evidence='']){const r=filledReview();mutate(r);assert.equal(checkReview(r,fixtureHash).ready,false);}});
