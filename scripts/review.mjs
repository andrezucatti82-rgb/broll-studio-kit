import fs from 'node:fs';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
export const creativeChecks=['narrative','internalAction','depth','rhythm','transitions','readability','voice','sound'];
export function checkReview(report,expectedHash){
 const errors=[];
 if(report.schemaVersion!==1)errors.push('Unsupported review schema');
 if(report.videoSha256!==expectedHash)errors.push('Review does not match the current video hash');
 if(report.technical?.status!=='passed'||!report.technical?.evidence?.trim())errors.push('Technical verification evidence missing');
 for(const [key,method] of [['playback','continuous-playback'],['listening','listening']]){
  const r=report[key];
  if(r?.status!=='passed'||r?.method!==method||r?.scope!=='entire-video'||!r?.reviewer?.trim()||!r?.notes?.trim())errors.push(`${key}: complete review with method, reviewer and observations required`);
 }
 for(const key of creativeChecks)if(report.creative?.[key]?.status!=='passed'||!report.creative?.[key]?.notes?.trim())errors.push(`Creative review missing: ${key}`);
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
