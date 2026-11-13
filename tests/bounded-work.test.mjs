import test from 'node:test';import assert from 'node:assert/strict';
import {boundedWork,retryIdempotent} from '../scripts/bounded-work.mjs';
test('bounded publication work waits for active operations and never exceeds its limit',async()=>{
 let active=0,peak=0;const seen=[];
 await boundedWork([0,1,2,3,4,5],2,async value=>{active++;peak=Math.max(peak,active);await new Promise(r=>setTimeout(r,2));seen.push(value);active--});
 assert.equal(peak,2);assert.equal(active,0);assert.deepEqual(seen.sort(),[0,1,2,3,4,5]);
 let finished=false;const started=[];
 await assert.rejects(boundedWork([0,1,2,3],2,async value=>{started.push(value);if(value===0)throw Error('upload failed');await new Promise(r=>setTimeout(r,5));finished=true}),/upload failed/);
 assert.deepEqual(started,[0,1]);assert.equal(finished,true);
});
test('idempotent uploads retry transient errors without accepting permanent corruption',async()=>{
 let count=0;const delays=[];
 const result=await retryIdempotent(async()=>{if(++count<3)throw Error('size mismatch');return 'verified'},3,async ms=>delays.push(ms));
 assert.equal(result,'verified');assert.equal(count,3);assert.deepEqual(delays,[300,600]);
 count=0;await assert.rejects(retryIdempotent(async()=>{count++;throw Error('size mismatch')},3,async()=>{}),/size mismatch/);assert.equal(count,3);
 await assert.rejects(retryIdempotent(async()=>{},0),/Invalid attempts/);
});
