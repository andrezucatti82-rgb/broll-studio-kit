import test from 'node:test';import assert from 'node:assert/strict';
import {boundedWork} from '../scripts/bounded-work.mjs';
test('bounded publication work waits for active operations and never exceeds its limit',async()=>{
 let active=0,peak=0;const seen=[];
 await boundedWork([0,1,2,3,4,5],2,async value=>{active++;peak=Math.max(peak,active);await new Promise(r=>setTimeout(r,2));seen.push(value);active--});
 assert.equal(peak,2);assert.equal(active,0);assert.deepEqual(seen.sort(),[0,1,2,3,4,5]);
 let finished=false;const started=[];
 await assert.rejects(boundedWork([0,1,2,3],2,async value=>{started.push(value);if(value===0)throw Error('upload failed');await new Promise(r=>setTimeout(r,5));finished=true}),/upload failed/);
 assert.deepEqual(started,[0,1]);assert.equal(finished,true);
});
