import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {checkWorkflow,sha256} from '../scripts/workflow-gate.mjs';

function fixture(t){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'visual-gate-'));
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const w={schemaVersion:1,artifacts:{},approvals:{},requiredComponents:['broll','captions']};
 for(const scope of ['visual','script','animatic','integrated_sample']){
  const file=path.join(root,scope);fs.writeFileSync(file,scope);
  w.artifacts[scope]={file:scope,sha256:sha256(file)};
  w.approvals[scope]={status:'approved',by:'user',quote:'Aprovo este material',messageRef:'fixture-'+scope,sha256:sha256(file),basis:Object.fromEntries(Object.entries(w.artifacts).filter(([k])=>k!==scope).map(([k,v])=>[k,v.sha256]))};
 }
 Object.assign(w.artifacts.integrated_sample,{components:['broll','captions'],hardestShot:'Service transition',transitionEvidence:'Reviewed transition at 3s'});
 const video=path.join(root,'candidate.mp4');fs.writeFileSync(video,'fixture bytes, not real media');
 w.review={sha256:sha256(video),technical:{status:'passed',evidence:'Synthetic fixture'},issues:[]};
 for(const k of ['playback','listening'])w.review[k]={status:'passed',scope:'entire-video',reviewer:'Fixture',notes:'Synthetic fixture, not a performed media review'};
 return {w,root,video};
}
test('valid scoped records pass all stages',t=>{const {w,root,video}=fixture(t);for(const s of ['ai-video','full-render','deliver'])assert.equal(checkWorkflow(w,s,root,video).ready,true)});
test('avatar and budget approval cannot authorize AI video',t=>{const {w,root}=fixture(t);w.approvals={avatar:{status:'approved'},budget:{status:'approved'}};assert.equal(checkWorkflow(w,'ai-video',root).ready,false)});
test('old booleans and agent self approval are rejected',t=>{const {w,root}=fixture(t);w.approvals.visual=true;assert.equal(checkWorkflow(w,'ai-video',root).ready,false);w.approvals.visual={status:'approved',by:'agent'};assert.equal(checkWorkflow(w,'ai-video',root).ready,false)});
test('changed or missing visual file invalidates approval',t=>{const {w,root}=fixture(t);fs.writeFileSync(path.join(root,'visual'),'changed');assert.equal(checkWorkflow(w,'ai-video',root).ready,false);fs.unlinkSync(path.join(root,'visual'));assert.equal(checkWorkflow(w,'ai-video',root).ready,false)});
test('newly approved visuals invalidate dependent sample',t=>{const {w,root}=fixture(t);fs.writeFileSync(path.join(root,'visual'),'v2');w.artifacts.visual.sha256=sha256(path.join(root,'visual'));w.approvals.visual.sha256=w.artifacts.visual.sha256;assert.equal(checkWorkflow(w,'ai-video',root).ready,true);assert.equal(checkWorkflow(w,'full-render',root).ready,false)});
test('avatar-only sample cannot stand for integrated edit',t=>{const {w,root}=fixture(t);w.artifacts.integrated_sample.components=['avatar'];assert.equal(checkWorkflow(w,'full-render',root).ready,false)});
test('unapproved animatic prevents full film',t=>{const {w,root}=fixture(t);delete w.approvals.animatic;assert.equal(checkWorkflow(w,'full-render',root).ready,false)});
test('technical tests alone never mark delivery ready',t=>{const {w,root,video}=fixture(t);delete w.review.playback;delete w.review.listening;assert.equal(checkWorkflow(w,'deliver',root,video).ready,false)});
test('partial listening and unresolved issues block final',t=>{const {w,root,video}=fixture(t);w.review.listening.scope='sample';assert.equal(checkWorkflow(w,'deliver',root,video).ready,false);w.review.listening.scope='entire-video';w.review.issues=[{severity:'blocking',status:'open'}];assert.equal(checkWorkflow(w,'deliver',root,video).ready,false)});
test('corrected export needs fresh review',t=>{const {w,root,video}=fixture(t);fs.appendFileSync(video,'revised');assert.equal(checkWorkflow(w,'deliver',root,video).ready,false)});
test('template fails closed without files or approvals',()=>{const w=JSON.parse(fs.readFileSync(new URL('../templates/workflow.json',import.meta.url),'utf8'));assert.equal(checkWorkflow(w,'ai-video','.').ready,false);assert.equal(checkWorkflow(w,'invalid','.').ready,false)});
