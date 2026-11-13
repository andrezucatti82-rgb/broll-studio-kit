import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';

const root=new URL('../style-atlas/',import.meta.url);
const read=p=>JSON.parse(fs.readFileSync(new URL(p,root),'utf8'));
const pilot=read('dist/sequence-pilot.json');
const catalog=read('dist/catalog.json');
const records=read('records/sequence-pilot/assets.json');

test('approval pilot covers all 18 current categories with two distinct existing styles each',()=>{
  assert.equal(pilot.examples.length,36);
  assert.equal(pilot.families.length,18);
  assert.equal(new Set(pilot.examples.map(x=>x.styleId)).size,36);
  for(const family of pilot.families){
    assert.equal(pilot.examples.filter(x=>x.family===family.id).length,2);
    assert.ok(catalog.styles.some(x=>x.family===family.id));
  }
  for(const example of pilot.examples){
    const original=catalog.styles.find(x=>x.id===example.styleId);
    assert.ok(original,example.styleId);
    assert.equal(example.family,original.family);
    assert.equal(example.name,original.name);
  }
});

test('all 144 separate portrait frames exist, are unique and match their provenance hashes',()=>{
  const hashes=new Set();
  for(const example of pilot.examples){
    assert.equal(example.frames.length,4);
    const record=records.find(x=>x.key===example.key);
    assert.equal(record.motionValidated,false);
    assert.equal(record.videoProductionApproved,false);
    for(const [i,frame] of example.frames.entries()){
      assert.match(frame.src,/^assets\/film-sequences\/[a-z0-9-]+\.webp$/);
      assert.ok(Math.abs(frame.width/frame.height-9/16)<.015);
      assert.ok(frame.alt.length>25 && frame.action.length>20);
      const bytes=fs.readFileSync(new URL('dist/'+frame.src,root));
      assert.equal(bytes.toString('ascii',8,12),'WEBP');
      const hash=createHash('sha256').update(bytes).digest('hex');
      assert.equal(hash,record.crops[i].sha256);
      hashes.add(hash);
    }
    assert.match(example.productionPrompt,/moodboard e storyboard/);
    assert.match(example.productionPrompt,/amostra de 10 s/);
    assert.match(example.productionPrompt,/aprovação do usuário/);
    assert.doesNotMatch(example.productionPrompt,/GDA|gerenciadordeanuncios/i);
  }
  assert.equal(hashes.size,144);
});
