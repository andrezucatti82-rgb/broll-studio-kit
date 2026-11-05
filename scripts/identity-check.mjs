import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
const hash=value=>typeof value==='string'&&/^[a-f0-9]{64}$/i.test(value);
const text=value=>typeof value==='string'&&value.trim().length>0;
export function checkIdentityReview(r){
 const errors=[];
 if(r?.realPeoplePresent===false&&r.status==='not_applicable'&&text(r.notes))return {ready:true,errors};
 if(r?.realPeoplePresent!==true||r?.status!=='passed'||!text(r?.reviewer)||!text(r?.notes))errors.push('Identity review must be completed or explicitly not applicable');
 for(const key of ['tool','capabilities','limitations','creditDecision'])if(!text(r?.toolAssessment?.[key]))errors.push(`Identity tool assessment missing: ${key}`);
 if(!text(r?.test?.file)||!hash(r?.test?.sha256)||!Number.isFinite(r?.test?.durationSeconds)||r.test.durationSeconds<=0)errors.push('Identity motion test file, hash and duration required');
 if(!Array.isArray(r?.people)||r.people.length===0)errors.push('Per-person comparison with original references required');
 const ids=new Set();
 for(const person of r?.people||[]){
  if(!text(person.id)||ids.has(person.id))errors.push('Unique person ID required');ids.add(person.id);
  if(!Array.isArray(person.originalReferences)||person.originalReferences.length===0||person.originalReferences.some(x=>x?.role!=='original'||!text(x.file)||!hash(x.sha256)))errors.push('Original identity references required; generated derivatives are insufficient');
  if(!Array.isArray(person.authorizedChanges)||!text(person.coverageLimits))errors.push('Authorized changes and observed coverage must be recorded');
  for(const key of ['start','middle','end','angleChanges','face','visibleBody']){
   const check=person.checks?.[key];
   if(key==='angleChanges'&&check?.status==='not_applicable'&&text(check.evidence))continue;
   if(check?.status!=='passed'||!text(check.evidence))errors.push(`Identity comparison missing or failed: ${person.id||'person'} / ${key}`);
  }
 }
 return {ready:errors.length===0,errors};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const file=process.argv[2];if(!file){console.error('Usage: npm run identity-check -- review.json');process.exit(1);}
 const report=JSON.parse(fs.readFileSync(file,'utf8'));const result=checkIdentityReview(report.identityPreservation);
 console.log(JSON.stringify(result,null,2));
 console.log('Checks identity review records only. Does not compare faces, watch the test or certify identity. Use before full production and repeat visual checks on the final video.');
 if(!result.ready)process.exitCode=1;
}
