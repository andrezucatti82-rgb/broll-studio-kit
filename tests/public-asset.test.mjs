import test from 'node:test';
import assert from 'node:assert/strict';
import {readPublicAsset} from '../scripts/public-asset.mjs';
test('release reads recover transport/body failures and transient HTTP errors',async()=>{
 let calls=0;const delays=[];
 const bytes=await readPublicAsset('https://example.test/asset.webp',{sleep:async ms=>delays.push(ms),fetchImpl:async()=>{
  calls++;
  if(calls===1)throw new TypeError('ECONNRESET');
  if(calls===2)return {ok:true,arrayBuffer:async()=>{throw new TypeError('body interrupted')}};
  if(calls===3)return new Response('',{status:503});
  return new Response('verified bytes');
 }});
 assert.equal(bytes.toString(),'verified bytes');assert.equal(calls,4);assert.deepEqual(delays,[500,1000,2000]);
});
test('release reads stop on permanent errors and have a finite retry limit',async()=>{
 let calls=0;
 await assert.rejects(readPublicAsset('https://example.test/missing',{sleep:async()=>{},fetchImpl:async()=>{calls++;return new Response('',{status:404})}}),/HTTP 404/);
 assert.equal(calls,1);calls=0;
 await assert.rejects(readPublicAsset('https://example.test/unavailable',{sleep:async()=>{},fetchImpl:async()=>{calls++;throw new TypeError('ECONNRESET')}}),/ECONNRESET/);
 assert.equal(calls,4);
});
