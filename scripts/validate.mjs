import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
export function validate(p){
 const fail=m=>{throw new Error(m)};
 if(p.schemaVersion!==1)fail('Unsupported schemaVersion');
 if(!p.topic?.trim()||!p.brand?.name?.trim())fail('Topic and brand name required');
 if(!Number.isInteger(p.fps)||p.fps<24||p.fps>60)fail('fps must be 24–60');
 if(!Number.isFinite(p.duration)||p.duration<6||p.duration>180)fail('duration must be 6–180 seconds');
 if(!Array.isArray(p.scenes)||p.scenes.length!==6)fail('This example renderer needs six scenes; write a new composition for other structures');
 if(Math.round(p.duration*p.fps)%6!==0)fail('Frame count must divide evenly across six scenes');
 for(const k of ['primary','ink','paper'])if(!/^#[0-9a-f]{6}$/i.test(p.brand[k]))fail(`Invalid color ${k}`);
 let u;try{u=new URL(p.brand.website)}catch{fail('Invalid website')};if(!['https:','http:'].includes(u.protocol))fail('Website must be HTTP(S)');
 const assets=[p.brand.logo,p.audio,...p.scenes.map(s=>s.image)].filter(Boolean);
 for(const a of assets){if(typeof a!=='string'||a.includes('..')||a.startsWith('/')||/[:\\]/.test(a))fail('Assets must be safe relative paths in public/');if(!fs.existsSync(path.join('public',a)))fail(`Missing asset: ${a}`);}
 for(const s of p.scenes)if(!s.title?.trim()||s.title.length>90||!s.eyebrow||!s.detail)fail('Each scene needs concise copy');
 if(!p.labels||typeof p.labels.badge!=='string'||typeof p.labels.illustration!=='string'||!Array.isArray(p.labels.categories)||p.labels.categories.length!==4||p.labels.categories.some(x=>typeof x!=='string'||!x.trim()))fail('Four category labels and supporting labels required');
 if(!Array.isArray(p.captions))fail('captions must be an array');
 let end=0;for(const c of p.captions){if(!Number.isFinite(c.start)||!Number.isFinite(c.end)||c.start<end||c.end<=c.start||c.end>p.duration||typeof c.text!=='string')fail('Invalid caption timing');end=c.end;}
 return p;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){validate(JSON.parse(fs.readFileSync(process.argv[2]||'examples/dipilatti/project.json','utf8')));console.log('Project valid.');}
