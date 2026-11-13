import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
import '../style-atlas/dist/workflow.js';
const text=v=>typeof v==='string'&&v.trim().length>0;
const hash=v=>/^[a-f0-9]{64}$/i.test(v||'');
function canonical(value){if(Array.isArray(value))return value.map(canonical);if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])]));return value;}
export function directionFingerprint(plan){const fields=['id','styleId','narrativeRole','styleContributions','referenceIds','originalReferenceIds','initialState','action','result','camera','transition','narration','audio','preserve','editableText','realSubject','route','capabilityId','initialFrame','inputReferenceIds','appearanceCritical','appearanceExceptionApproval','generationPrompt','durationSeconds','generationSettings'];const data={...(plan.styleCombination!==undefined?{styleCombination:plan.styleCombination,contributionBindings:(plan.contributionBindings||[]).map(b=>Object.fromEntries(['styleId','aspect','scope','resolvedScope','shotIds','referenceIds','referenceBasis','decision'].filter(k=>k in b).map(k=>[k,b[k]])))}:{}),references:(plan.references||[]).map(r=>({id:r.id,sha256:r.sha256,role:r.role})),moodboard:plan.approvals?.moodboard?.sha256,storyboard:plan.approvals?.storyboard?.sha256,shots:(plan.shots||[]).map(s=>Object.fromEntries(fields.filter(k=>k in s).map(k=>[k,s[k]]))),tools:(plan.capabilities||[]).map(c=>({id:c.id,tool:c.tool,mode:c.mode,scope:c.scope}))};return crypto.createHash('sha256').update(JSON.stringify(canonical(data))).digest('hex');}
export function checkFidelity(plan,{phase='sample',directory='.',shotId,job,jobDirectory=directory}={}){
 const errors=[],root=path.resolve(directory),refs=new Map(),caps=new Map();
 const fail=m=>errors.push(m);
 const artifact=(a,label)=>{
  if(!text(a?.file)||!hash(a?.sha256)){fail(label+': arquivo e SHA256 obrigatórios');return;}
  try{const f=fs.realpathSync(path.resolve(root,a.file));const base=fs.realpathSync(root);if(!f.startsWith(base+path.sep))throw Error('fora do projeto');if(crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')!==a.sha256)throw Error('hash divergente');return f;}catch{fail(label+': arquivo ausente, fora do projeto ou alterado');}
 };
 if(plan?.schemaVersion!==1||!['sample','final'].includes(phase))return {ready:false,errors:['Esquema ou fase inválida']};
 if(!Array.isArray(plan.references)||!plan.references.length)fail('Inspecione as referências individuais');
 for(const r of plan.references||[]){if(!text(r.id)||refs.has(r.id))fail('Referência sem ID único');refs.set(r.id,r);artifact(r,'Referência '+r.id);if(r.inspected!==true||!text(r.observations))fail('Inspeção visual ausente: '+r.id);}
 if(!Array.isArray(plan.expectedReferences)||!plan.expectedReferences.length)fail('Manifesto de referências esperadas ausente');
 for(const r of plan.expectedReferences||[])if(!refs.has(r.id))fail('Quadro esperado não inspecionado: '+r.id);
 for(const k of ['moodboard','storyboard']){const a=plan.approvals?.[k];artifact(a,k);if(a?.status!=='approved'||!text(a?.decisionEvidence))fail('Aprovação explícita ausente: '+k);}
 for(const c of plan.capabilities||[]){if(!text(c.id)||caps.has(c.id))fail('Capacidade sem ID único');caps.set(c.id,c);}
 const shots=plan.shots||[];if(!Array.isArray(shots)||!shots.length)fail('Plano de execução vazio');
 if(new Set(shots.map(s=>s.id)).size!==shots.length)fail('Planos com ID duplicado');
 if(plan.styleCombination!==undefined){
  try{
   const c=plan.styleCombination;
   if(c.version!==1||c.explicit!==true||!Array.isArray(c.entries)||!c.entries.length)throw Error('Mapa inválido');
   const expected=AtlasWorkflow.combinationPlan({selectedStyles:c.entries.map(e=>({id:e.styleId})),styleContributions:Object.fromEntries(c.entries.map(e=>[e.styleId,e.contributions]))},{requireResolved:true});
   if(JSON.stringify(canonical(c))!==JSON.stringify(canonical(expected)))throw Error('Mapa alterado');
   const bindings=plan.contributionBindings;
   if(!Array.isArray(bindings)||bindings.length!==c.entries.reduce((n,e)=>n+e.contributions.length,0))throw Error('Vínculos ausentes');
   const keys=new Set();
   for(const entry of c.entries)for(const contribution of entry.contributions){
    const key=entry.styleId+':'+contribution.aspect,matching=bindings.filter(b=>b.styleId===entry.styleId&&b.aspect===contribution.aspect);
    if(keys.has(key)||matching.length!==1)throw Error('Vínculo duplicado');keys.add(key);
    const b=matching[0],option=AtlasWorkflow.contributionOptions.find(o=>o.id===b.aspect);
    const scope=contribution.scope==='propose'?b.resolvedScope:contribution.scope;
    if(b.scope!==contribution.scope||!Object.hasOwn(AtlasWorkflow.contributionScopes,scope)||scope==='propose'||!text(b.decision)||!Array.isArray(b.shotIds)||!b.shotIds.length||new Set(b.shotIds).size!==b.shotIds.length||b.shotIds.some(id=>!shots.some(s=>s.id===id)))throw Error('Distribuição incompleta');
    if(scope==='film'&&shots.some(s=>!b.shotIds.includes(s.id)))throw Error('Escopo global incompleto');
    if(scope!=='film'&&b.shotIds.some(id=>shots.find(s=>s.id===id)?.narrativeRole!==scope))throw Error('Plano fora do escopo');
    if(!Array.isArray(b.referenceIds)||!b.referenceIds.length||b.referenceIds.some(id=>!refs.has(id))||!b.referenceIds.some(id=>(plan.expectedReferences||[]).some(r=>r.id===id&&r.styleId===entry.styleId)))throw Error('Referência de estilo ausente');
    if(!['observed_image','observed_video','observed_audio','approved_proposal'].includes(b.referenceBasis)||['motion','audio','mixed'].includes(option.evidence)&&b.referenceBasis==='observed_image')throw Error('Imagem não comprova movimento ou áudio');
   }
  }catch{fail('Mapa de características sem vínculos válidos: característica, escopo, planos, referência inspecionada e decisão são obrigatórios');}
 }
 if(shotId&&!shots.some(s=>s.id===shotId))fail('Plano solicitado não encontrado');
 for(const s of shots){
  for(const k of ['id','styleId','initialState','action','result','camera','transition','narration','audio'])if(!text(s[k]))fail('Plano incompleto: '+s.id+'/'+k);
  if(!Array.isArray(s.referenceIds)||!s.referenceIds.length||s.referenceIds.some(id=>!refs.has(id)))fail('Plano sem referências inspecionadas: '+s.id);
  if(!Array.isArray(s.preserve)||!s.preserve.length||s.preserve.some(v=>!text(v))||s.editableText!==true)fail('Invariantes e texto editável obrigatórios: '+s.id);
  if(typeof s.realSubject!=='boolean')fail('Declare presença de item/pessoa real: '+s.id);
  if(s.realSubject&&(!s.originalReferenceIds?.length||s.originalReferenceIds.some(id=>refs.get(id)?.role!=='original')))fail('Originais reais ausentes: '+s.id);
  if(!['image_to_video','reference_to_video','footage','code','3d','composite','text_to_video'].includes(s.route))fail('Rota desconhecida: '+s.id);
  if(['image_to_video','reference_to_video','text_to_video'].includes(s.route)&&(!text(s.generationPrompt)||!Number.isInteger(s.durationSeconds)||s.durationSeconds<5||s.durationSeconds>15||!['model','resolution','aspect_ratio','prompt_enhancement'].every(k=>text(s.generationSettings?.[k]))))fail('Prompt e parâmetros de geração incompletos: '+s.id);
  if(s.route==='text_to_video'&&(s.appearanceCritical!==false||!text(s.appearanceExceptionApproval)))fail('Texto sozinho não controla aparência: '+s.id);
  if(s.route==='reference_to_video'&&(!s.inputReferenceIds?.length||s.inputReferenceIds.length>9||s.inputReferenceIds.some(id=>!refs.has(id))))fail('Referências de entrada inválidas: '+s.id);
  if(s.route==='image_to_video'){artifact(s.initialFrame,'Quadro inicial '+s.id);if(s.initialFrame?.approved!==true||!text(s.initialFrame?.comparisonEvidence))fail('Quadro inicial não validado: '+s.id);}
  const c=caps.get(s.capabilityId);if(!c||!text(c.tool)||c.mode!==s.route||c.compatibility!=='verified'||!text(c.evidence)||!text(c.limitations)||!Number.isFinite(Date.parse(c.checkedAt))||(c.scope==='remote'&&c.authenticated!==true)||!['local','remote'].includes(c.scope))fail('Compatibilidade da ferramenta não verificada: '+s.id);
 }
 if(plan.approvals?.storyboard?.directionSha256!==directionFingerprint(plan))fail('Direção alterada ou sem vínculo com o aceite do storyboard');
 for(const d of plan.deviations||[])if(d.status!=='resolved'&&!(d.status==='accepted'&&text(d.userDecisionEvidence)))fail('Desvio sem solução ou aceite explícito');
 if(job){const s=shots.find(s=>s.id===shotId);if(!s||job.mode!==s.route)fail('Modo do job difere do plano');if(s&&(job.prompt!==s.generationPrompt||job.duration!==s.durationSeconds||Object.entries(s.generationSettings||{}).some(([k,v])=>(job[k]??(k==='prompt_enhancement'?'disabled':undefined))!==v)))fail('Prompt ou parâmetros do job diferem da direção aprovada');if(s?.route==='reference_to_video'){try{const expected=s.inputReferenceIds.map(id=>refs.get(id).sha256);const actual=job.referenceImages.map(f=>crypto.createHash('sha256').update(fs.readFileSync(path.resolve(jobDirectory,f))).digest('hex'));if(JSON.stringify(actual)!==JSON.stringify(expected))fail('Job usa referências ou ordem diferentes da direção aprovada');}catch{fail('Referências do job indisponíveis');}}if(s?.route==='image_to_video'){try{const p=path.resolve(jobDirectory,job.firstFrame);if(crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')!==s.initialFrame.sha256)fail('Job usa quadro diferente do aprovado');}catch{fail('Quadro do job indisponível');}}}
 if(phase==='final'){
  const s=plan.sample;artifact(s,'Amostra');if(s?.durationSeconds!==10||!text(s?.selectionReason))fail('Amostra representativa de 10 s necessária');
  if(plan.styleCombination!==undefined){
   const ids=s?.shotIds,bindings=Array.isArray(plan.contributionBindings)?plan.contributionBindings:[];
   if(!Array.isArray(ids)||!ids.length||ids.some(id=>!shots.some(shot=>shot.id===id)))fail('Declare os planos realmente cobertos pela amostra');
   else{
    const covered=bindings.filter(b=>b.shotIds?.some(id=>ids.includes(id))),remaining=bindings.filter(b=>!covered.includes(b));
    for(const b of covered){const check=s.contributionChecks?.find(v=>v.styleId===b.styleId&&v.aspect===b.aspect);if(check?.status!=='passed'||!text(check.evidence)||!Array.isArray(check.shotIds)||b.shotIds.filter(id=>ids.includes(id)).some(id=>!check.shotIds.includes(id))||check.shotIds.some(id=>!ids.includes(id)||!b.shotIds.includes(id)))fail('Característica não comparada na amostra: '+b.styleId+'/'+b.aspect);}
    for(const b of remaining)if(!s.remainingContributionChecks?.some(v=>v.styleId===b.styleId&&v.aspect===b.aspect&&text(v.plan)))fail('Declare como conferir as características fora da amostra: '+b.styleId+'/'+b.aspect);
   }
  }
  if(!s?.comparisonFiles?.length)fail('Comparação lado a lado ausente');for(const a of s?.comparisonFiles||[])artifact(a,'Comparação');
  for(const k of ['playback','listening'])if(s?.[k]?.status!=='passed'||!text(s[k].evidence))fail('Revisão audiovisual pendente: '+k);
  for(const k of ['appearance','movement','text','identity'])if(s?.locks?.[k]?.status!=='passed'||!text(s.locks[k].evidence))fail('Trava pendente: '+k);
  if(s?.userApproval?.status!=='approved'||s.userApproval.sha256!==s.sha256||s.userApproval.directionSha256!==directionFingerprint(plan)||!text(s.userApproval.decisionEvidence))fail('Aceite da amostra exata ausente');
 }
 return {ready:errors.length===0,phase,errors,scope:'Verifica registros e integridade dos arquivos; não avalia estética, movimento ou veracidade das observações.'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 try{const [file,...args]=process.argv.slice(2),get=k=>args[args.indexOf(k)+1];if(!file)throw Error('Uso: npm run fidelity-check -- projeto/fidelity-plan.json --phase sample|final [--shot ID --job job.json]');const jobFile=args.includes('--job')?path.resolve(get('--job')):null;const plan=JSON.parse(fs.readFileSync(file));if(args.includes('--fingerprint')){console.log(directionFingerprint(plan));process.exit(0);}const r=checkFidelity(plan,{phase:args.includes('--phase')?get('--phase'):'sample',directory:path.dirname(path.resolve(file)),shotId:args.includes('--shot')?get('--shot'):undefined,job:jobFile?JSON.parse(fs.readFileSync(jobFile)):undefined,jobDirectory:jobFile?path.dirname(jobFile):undefined});console.log(JSON.stringify(r,null,2));if(!r.ready)process.exitCode=1;}catch(e){console.error(e.message);process.exitCode=1;}
}
