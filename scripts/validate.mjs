import fs from 'node:fs';
import '../style-atlas/dist/workflow.js';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {buildTimeline} from '../src/timeline.mjs';
export function validate(p){
 const fail=m=>{throw new Error(m)};
 if(p.schemaVersion!==2)fail('schemaVersion 2 required; see docs/MIGRATION-2.md');
 if(!p.topic?.trim()||!p.brand?.name?.trim())fail('Topic and brand name required');
 if(!Number.isInteger(p.fps)||p.fps<24||p.fps>60)fail('fps must be 24–60');
 if(!Array.isArray(p.scenes)||p.scenes.length<1)fail('At least one scene required');
 const ids=new Set();
 for(const [i,s] of p.scenes.entries()){
  if(!s.id||ids.has(s.id))fail('Scene IDs must be unique');ids.add(s.id);
  if(!Number.isInteger(s.durationFrames)||s.durationFrames<2)fail('Scene durationFrames must be an integer >= 2');
  if(!['hero','photo','palette','spatial','catalog','closing'].includes(s.layout))fail('Unknown layout; implement custom layouts explicitly');
  const t=s.transition;
  if(!t||!['cut','dissolve'].includes(t.type)||!Number.isInteger(t.durationFrames)||t.durationFrames<0)fail('Invalid transition');
  if(t.type==='cut'&&t.durationFrames!==0)fail('Cut duration must be zero');
  if(t.type==='dissolve'&&(i===0||t.durationFrames<1||t.durationFrames>=Math.min(s.durationFrames,p.scenes[i-1].durationFrames)))fail('Dissolve must fit both adjacent scenes; first scene starts with a cut');
 }
 const duration=buildTimeline(p.scenes).durationInFrames/p.fps;
 if(duration<1||duration>180)fail('Timeline must be 1–180 seconds');
 for(const k of ['primary','ink','paper'])if(!/^#[0-9a-f]{6}$/i.test(p.brand[k]))fail(`Invalid color ${k}`);
 let u;try{u=new URL(p.brand.website)}catch{fail('Invalid website')};if(!['https:','http:'].includes(u.protocol))fail('Website must be HTTP(S)');
 const asset=a=>{if(typeof a!=='string'||!a||a.includes('..')||a.startsWith('/')||/[:\\]/.test(a))fail('Assets must be safe relative paths in public/');if(!fs.existsSync(path.join('public',a)))fail(`Missing asset: ${a}`);};
 const media=m=>{if(!m||!['image','video'].includes(m.type))fail('Media must be image or video');asset(m.src);if(m.startFrom!==undefined&&(!Number.isInteger(m.startFrom)||m.startFrom<0))fail('Video startFrom must be a nonnegative frame');};
 asset(p.brand.logo);if(p.audio)asset(p.audio);
 for(const s of p.scenes){
  if(!s.title?.trim()||s.title.length>90||!s.eyebrow||!s.detail)fail('Each scene needs concise copy');media(s.media);
  if(s.layers!==undefined&&!Array.isArray(s.layers))fail('layers must be an array');
  for(const layer of s.layers??[]){media(layer.media);for(const k of ['left','top','width','height'])if(!Number.isFinite(layer[k]))fail('Layer geometry must be finite');if(layer.width<=0||layer.height<=0)fail('Layer size must be positive');for(const pose of [layer.from,layer.to])if(!pose||![pose.x,pose.y,pose.scale].every(Number.isFinite)||pose.scale<=0)fail('Layer poses must be finite with positive scale');}
 }
 if(!p.labels||typeof p.labels.badge!=='string'||typeof p.labels.illustration!=='string'||!Array.isArray(p.labels.categories)||p.labels.categories.length!==4||p.labels.categories.some(x=>typeof x!=='string'||!x.trim()))fail('Four category labels and supporting labels required');
 if(!Array.isArray(p.captions))fail('captions must be an array');
 let end=0;for(const c of p.captions){if(!Number.isFinite(c.start)||!Number.isFinite(c.end)||c.start<end||c.end<=c.start||c.end>duration||typeof c.text!=='string')fail('Invalid caption timing');end=c.end;}
 return p;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const input=JSON.parse(fs.readFileSync(process.argv[2]||'templates/project.json','utf8'));(input.selectedStyles?validatePreset:validate)(input);console.log('Project valid. This does not certify creative quality.');}

export function validateCatalog(c){if(c.styles.length!==540||new Set(c.styles.map(s=>s.id)).size!==540)throw Error('540 unique styles required');for(const s of c.styles)if(!s.proof||!s.requirements||!s.preset?.productFidelity||!['voice','music','sfx','mix'].every(k=>s.audio?.[k]))throw Error('Incomplete fidelity fields: '+s.id);return c;}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)validateCatalog(JSON.parse(fs.readFileSync(new URL('../style-atlas/dist/catalog.json',import.meta.url))));

export function validatePreset(p){
 if(!p.fidelityContract||!['appearance','movement','text','identity'].every(k=>typeof p.fidelityContract[k]==='string'&&p.fidelityContract[k]))throw Error('Four fidelity locks required');
 if(p.firstDeliverySeconds!==10||!Number.isInteger(p.targetDurationSeconds)||p.targetDurationSeconds<15||!p.scenePlan?.budgetOnly)throw Error('Separate target and sample duration required');
 if(!Array.isArray(p.selectedStyles)||p.selectedStyles.length<1||p.selectedStyles.length>AtlasWorkflow.MAX_SELECTED_STYLES)throw Error('Choose one to ten styles');
 for(const s of p.selectedStyles)if(!s.proof||!s.requirements||!s.audio||!s.preset?.productFidelity||s.referenceFrame?.styleId!==s.id||!s.referenceFrame?.path)throw Error('Incomplete style/reference contract');
 return p;
}
