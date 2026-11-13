import fs from 'node:fs';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {checkIdentityReview} from './identity-check.mjs';
export const creativeChecks=['narrative','internalAction','depth','rhythm','transitions','readability','voice','sound'];
export function checkReview(report,expectedHash){
 const errors=[];
 const pre=report.preProduction;if(pre?.moodboardApproved!==true||pre?.storyboardApproved!==true||!Number.isInteger(pre?.moodboardVersion)||pre.moodboardVersion<1||!Number.isInteger(pre?.storyboardVersion)||pre.storyboardVersion<1||typeof pre?.evidence!=='string'||!pre.evidence.trim())errors.push('Moodboard and storyboard need approved versions and decision evidence');
 for(const key of ['appearance','movement','text','identity']){const lock=report.fidelityContract?.[key];if(lock?.status!=='passed'||lock.userApproval!==true||!lock.evidence?.trim())errors.push('Fidelity lock needs evidence and user approval: '+key);}
 if(report.schemaVersion!==1)errors.push('Unsupported review schema');
 if(report.videoSha256!==expectedHash)errors.push('Review does not match the current video hash');
 errors.push(...checkIdentityReview(report.identityPreservation).errors);
 if(report.technical?.status!=='passed'||!report.technical?.evidence?.trim())errors.push('Technical verification evidence missing');
 for(const [key,method] of [['playback','continuous-playback'],['listening','listening']]){
  const r=report[key];
  if(r?.status!=='passed'||r?.method!==method||r?.scope!=='entire-video'||!r?.reviewer?.trim()||!r?.notes?.trim())errors.push(`${key}: complete review with method, reviewer and observations required`);
 }
 for(const key of creativeChecks)if(report.creative?.[key]?.status!=='passed'||!report.creative?.[key]?.notes?.trim())errors.push(`Creative review missing: ${key}`);
 for(const key of ['imageGeneration','videoGeneration','finishing']){
  const gate=report.qualityGates?.[key];
  if(key!=='finishing'&&gate?.status==='not_applicable'&&gate?.notes?.trim())continue;
  if(gate?.status!=='passed'||!gate?.reviewer?.trim()||!gate?.notes?.trim()||!Array.isArray(gate?.assets)||gate.assets.length===0){errors.push(`Quality gate missing: ${key}`);continue;}
  for(const asset of gate.assets)if(!asset?.file?.trim()||!/^[a-f0-9]{64}$/i.test(asset?.sha256||'')||!asset?.evidence?.trim())errors.push(`Asset review evidence missing: ${key}`);
  if(key==='finishing'&&!gate.assets.some(a=>a.sha256===expectedHash))errors.push('Finishing review does not match the current video hash');
 }
 if(!Array.isArray(report.issues)||report.issues.some(x=>x.status!=='resolved'&&x.severity==='blocking'))errors.push('Unresolved blocking issues or missing issue list');
 return {ready:errors.length===0,errors};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const [video,reportPath]=process.argv.slice(2);
 if(!video||!reportPath){console.error('Usage: npm run review -- video.mp4 review.json');process.exit(1);}
 const hash=crypto.createHash('sha256').update(fs.readFileSync(video)).digest('hex');
 const result=checkReview(JSON.parse(fs.readFileSync(reportPath,'utf8')),hash);
 console.log(JSON.stringify(result,null,2));
 console.log('Checks review completeness and file identity; does not perform playback, listening or artistic assessment.');
 if(!result.ready)process.exitCode=1;
}
