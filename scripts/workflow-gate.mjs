import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';

export const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const nonempty = x => typeof x === 'string' && x.trim().length > 0;

// Checks recorded evidence and actual file identity, not the truth of human observations.
export function checkWorkflow(w, stage, root, video) {
  const errors = [];
  if (!['ai-video','full-render','deliver'].includes(stage)) return {ready:false,errors:['Unknown stage']};
  if (w?.schemaVersion !== 1) return {ready:false,errors:['workflow schemaVersion 1 required']};
  const current = {};
  function artifact(scope) {
    const a = w.artifacts?.[scope];
    if (!nonempty(a?.file)) { errors.push(`${scope}: material missing`); return; }
    try {
      const file = path.resolve(root, a.file);
      const h = sha256(file); current[scope] = h;
      if (a.sha256 !== h) errors.push(`${scope}: artifact changed`);
    } catch { errors.push(`${scope}: file unreadable`); }
    return a;
  }
  function approved(scope, dependencies = []) {
    artifact(scope);
    const a = w.approvals?.[scope];
    if (a?.status !== 'approved' || a?.by !== 'user' || !nonempty(a?.quote) || !nonempty(a?.messageRef) ||
        !current[scope] || a?.sha256 !== current[scope]) errors.push(`${scope}: explicit matching user approval required`);
    for (const dep of dependencies) if (!current[dep] || a?.basis?.[dep] !== current[dep]) errors.push(`${scope}: stale or missing basis ${dep}`);
  }
  approved('visual');
  if (stage !== 'ai-video') {
    approved('script');
    approved('animatic', ['visual','script']);
    approved('integrated_sample', ['visual','script','animatic']);
    if (!Array.isArray(w.requiredComponents) || !w.requiredComponents.length || w.requiredComponents.some(x=>!nonempty(x))) errors.push('Brief components missing');
    const sample = w.artifacts?.integrated_sample;
    if (!nonempty(sample?.hardestShot) || !nonempty(sample?.transitionEvidence)) errors.push('Representative sample needs hardest shot and transition evidence');
    for (const component of w.requiredComponents || []) if (!sample?.components?.includes(component)) errors.push(`Sample does not demonstrate: ${component}`);
  }
  if (stage === 'deliver') {
    let h;
    try { h = sha256(video); } catch { errors.push('Delivered video unreadable'); }
    const r = w.review;
    if (!h || r?.sha256 !== h) errors.push('Review does not match delivered file');
    if (r?.technical?.status !== 'passed' || !nonempty(r?.technical?.evidence)) errors.push('Technical review missing');
    for (const key of ['playback','listening']) {
      const v = r?.[key];
      if (v?.status !== 'passed' || v?.scope !== 'entire-video' || !nonempty(v?.reviewer) || !nonempty(v?.notes)) errors.push(`${key}: entire-video review required`);
    }
    if (!Array.isArray(r?.issues) || r.issues.some(x=>x.severity==='blocking' && x.status!=='resolved')) errors.push('Issue list missing or blocking issue unresolved');
  }
  return {ready:errors.length===0,errors};
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const [stage, record, video] = process.argv.slice(2);
    const result = checkWorkflow(JSON.parse(fs.readFileSync(record,'utf8')),stage,path.dirname(path.resolve(record)),video);
    console.log(JSON.stringify(result,null,2));
    if (!result.ready) process.exitCode = 1;
  } catch (e) { console.error(e.message); process.exitCode = 1; }
}
