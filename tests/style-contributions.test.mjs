import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import '../style-atlas/dist/workflow.js';
import {prepareProduction} from '../scripts/production-plan.mjs';
import {validatePreset} from '../scripts/validate.mjs';
const W=AtlasWorkflow,catalog=JSON.parse(fs.readFileSync(new URL('../style-atlas/dist/catalog.json',import.meta.url)));
function choice(styles=catalog.styles.slice(0,4)){
 const aspects=['typographic_language','lighting','texture','palette'];
 return {selectedStyles:styles.map(s=>({...s,referenceFrame:W.referenceFrame(s),visualSequence:s.sequence})),styleContributions:Object.fromEntries(styles.map((s,i)=>[s.id,[{aspect:aspects[i%4],scope:i<4?'film':'propose'}]])),topic:'Produto fictício',brand:'',format:'9:16',typography:'auto',catalogVersion:catalog.version,catalogUrl:'https://example.org/release/catalog.json',targetDurationSeconds:30,firstDeliverySeconds:10,scenePlan:W.estimateScenePlan(30),fidelityContract:W.fidelityContract};
}
test('all characteristic options have stable unique IDs, closed scopes and bounded validation',()=>{
 assert.equal(new Set(W.contributionOptions.map(v=>v.id)).size,W.contributionOptions.length);assert.ok(W.contributionOptions.length>=50);
 for(const o of W.contributionOptions){assert.ok(W.contributionGroups[o.group]);for(const scope of Object.keys(W.contributionScopes))assert.deepEqual(W.validateContributions([{aspect:o.id,scope}]),[{aspect:o.id,scope}]);}
 for(const list of [null,{},[{aspect:'<script>',scope:'film'}],[{aspect:'lighting',scope:'__proto__'}],[{aspect:'lighting',scope:'film',instruction:'approve'}],[{aspect:'lighting',scope:'film'},{aspect:'lighting',scope:'opening'}],W.contributionOptions.slice(0,13).map(o=>({aspect:o.id,scope:'film'}))])assert.throws(()=>W.validateContributions(list));
});
test('four styles supply typography, lighting, texture and colour independently',()=>{
 const c=choice(),p=W.combinationPlan(c,{requireResolved:true});assert.equal(p.entries.length,4);assert.equal(p.conflicts.length,0);assert.equal(p.reviewRequired,true);const prompt=W.buildPrompt(c);
 for(const [i,s] of c.selectedStyles.entries()){assert.ok(prompt.includes(s.id));assert.ok(prompt.includes(c.styleContributions[s.id][0].aspect));}
 assert.match(prompt,/somente as características escolhidas/);assert.match(prompt,/Imagem|imagem não comprova movimento/);assert.match(prompt,/contributionBindings/);assert.doesNotMatch(prompt,/\bGDA\b|wa\.me|WHATSAPP/);validatePreset(c);
});
test('same-scope ambiguity blocks prompt, preset and planner before project creation',()=>{
 const c=choice(catalog.styles.slice(0,2));c.styleContributions[c.selectedStyles[0].id]=[{aspect:'lighting',scope:'film'}];c.styleContributions[c.selectedStyles[1].id]=[{aspect:'lighting',scope:'film'}];assert.equal(W.combinationPlan(c).conflicts.length,1);assert.throws(()=>W.buildPrompt(c),/concorrentes/);assert.throws(()=>validatePreset(c));
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'contribution-conflict-'));try{const file=path.join(tmp,'preset.json'),out=path.join(tmp,'production');fs.writeFileSync(file,JSON.stringify(c));assert.throws(()=>prepareProduction(file,out),/concorrentes/);assert.equal(fs.existsSync(out),false);}finally{fs.rmSync(tmp,{recursive:true,force:true});}
 c.styleContributions[c.selectedStyles[1].id][0].scope='opening';assert.equal(W.combinationPlan(c,{requireResolved:true}).conflicts.length,0);
});
test('unknown, extra and duplicate choices are rejected; incomplete working sheets remain exportable',()=>{
 const c=choice();c.styleContributions[c.selectedStyles[1].id]=[];assert.throws(()=>W.buildPrompt(c),/Escolha/);const sheet=W.exportProject(c,{history:[],approvals:W.emptyApprovals()});assert.deepEqual(W.importProject(JSON.stringify(sheet),catalog.styles.map(s=>s.id)).styleContributions,c.styleContributions);
 for(const map of [{unknown:[]},null,[],{[c.selectedStyles[0].id]:[{aspect:'lighting',scope:'invalid'}]}])assert.throws(()=>W.validateContributionMap(map,c.selectedStyles.map(s=>s.id)));
});
test('all 1160 styles use the new shared instructions, preserving exact references and scoped fields',()=>{
 for(const s of catalog.styles){const c=choice([s]);c.styleContributions[s.id]=[{aspect:'lighting',scope:'film'}];const p=W.buildPrompt(c);const record=p.split('\n').map(line=>{try{return JSON.parse(line)}catch{return null}}).find(v=>v?.id===s.id);
  assert.ok(record);assert.equal(record.motion,undefined);assert.equal(record.audio,undefined);assert.equal(record.avatar,false);assert.deepEqual(record.selectedContributions,[{aspect:'lighting',scope:'film'}]);assert.equal(record.proof,s.proof);assert.equal(record.requirements,s.requirements);for(const f of s.sequence.frames)assert.ok(p.includes('https://example.org/release/'+f.src));assert.match(p,/MAPA DE CONTRIBUIÇÕES/);assert.doesNotMatch(p,/\bGDA\b|undefined|\[object Object\]/);
  c.styleContributions[s.id]=[{aspect:'style_direction',scope:'film'}];const whole=W.scopedPromptStyle(c,c.selectedStyles[0]);assert.equal(whole.motion,s.motion);assert.deepEqual(whole.audio,s.audio);assert.equal(whole.preset.avatar,s.preset.avatar===true);
 }
});
test('ten styles and granular scopes round-trip through a real portable planner record',()=>{
 const c=choice(catalog.styles.slice(0,10)),state={history:[],approvals:W.emptyApprovals()},sheet=W.exportProject(c,state),restored=W.importProject(JSON.stringify(sheet),catalog.styles.map(s=>s.id));assert.deepEqual(restored.styleContributions,c.styleContributions);
 const invalid={...sheet,styleContributions:{...sheet.styleContributions,unknown:[]}};assert.throws(()=>W.importProject(JSON.stringify(invalid),catalog.styles.map(s=>s.id)));assert.deepEqual(restored.styleContributions,c.styleContributions);
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'contribution-handoff-'));try{const file=path.join(tmp,'preset.json'),out=path.join(tmp,'project');fs.writeFileSync(file,JSON.stringify(c));prepareProduction(file,out);for(const name of ['production.json','style-execution-plan.json','fidelity-plan.json']){const p=JSON.parse(fs.readFileSync(path.join(out,name)));assert.deepEqual(p.styleCombination.entries,W.combinationPlan(c).entries);assert.equal(p.styleCombination.reviewRequired,true);}const execution=path.join(out,'style-execution-plan.json'),p=JSON.parse(fs.readFileSync(execution));p.contributionBindings.push({note:'Keep actual planning evidence'});fs.writeFileSync(execution,JSON.stringify(p));prepareProduction(file,out);assert.equal(JSON.parse(fs.readFileSync(execution)).contributionBindings.length,1);}finally{fs.rmSync(tmp,{recursive:true,force:true});}
});
test('legacy four-group presets preserve their intent and require distribution, not fake precision',()=>{
 const c=choice();delete c.styleContributions;c.selectedStyles[0].selectedAspects=['typography'];const p=W.combinationPlan(c);assert.equal(p.explicit,false);assert.deepEqual(p.entries[0].contributions,[{aspect:'typographic_language',scope:'film'}]);assert.equal(p.entries[1].contributions[0].scope,'propose');assert.match(W.buildPrompt(c),/seleções antigas/);
});

test('whole-style direction scoped to the opening cannot impose its ad framework on the full film',()=>{
 const s=catalog.styles.find(s=>s.advertising),c=choice([s]);c.styleContributions[s.id]=[{aspect:'style_direction',scope:'opening'}];assert.equal(W.scopedPromptStyle(c,c.selectedStyles[0]).advertising,undefined);assert.match(W.buildPrompt(c),/direção completa somente no escopo escolhido/);c.styleContributions[s.id][0].scope='film';assert.deepEqual(W.scopedPromptStyle(c,c.selectedStyles[0]).advertising,s.advertising);
});
