"""Direct HeyGen clips with explicit execution, resumable jobs and a local spending ledger.

Keep job files/ledger under ignored projects/. No credential or provider response belongs in Git.
The ledger reserves estimates; it is not a provider-side spending cap or a quality approval.
"""
import argparse, json, os, time, uuid, urllib.request, urllib.error, urllib.parse, subprocess
from decimal import Decimal
from pathlib import Path
import base64

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None

def read(path):
    return json.loads(Path(path).read_text())

def write(path, value):
    path=Path(path); temp=path.with_suffix(path.suffix+'.tmp')
    temp.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n');temp.replace(path)

def check_budget(ledger, estimate):
    rate=Decimal(str(ledger['planningBRLPerUSD']));cap=Decimal(str(ledger['limitBRL']))
    estimate=Decimal(str(estimate))
    if rate<=0 or cap<=0 or estimate<=0 or not ledger.get('pricingBasis'):
        raise ValueError('Positive budget/rate/estimate and a pricing basis are required')
    held=sum((Decimal(str(x.get('chargedUSD') if x.get('chargedUSD') is not None else x['reservedUSD'])) for x in ledger['jobs']),Decimal(0))
    if (held+estimate)*rate>cap:raise ValueError('Budget exceeded; no generation submitted')
    return held

def api(route, payload=None, key=None):
    secret=os.environ.get('HEYGEN_API_KEY')
    if not secret:raise ValueError('HEYGEN_API_KEY missing; configure securely outside chat/Git')
    headers={'X-Api-Key':secret,'Accept':'application/json'}
    if payload is not None:headers['Content-Type']='application/json'
    if key:headers['Idempotency-Key']=key
    req=urllib.request.Request('https://api.heygen.com'+route,data=json.dumps(payload).encode() if payload is not None else None,headers=headers)
    try:
        with urllib.request.build_opener(NoRedirect()).open(req,timeout=90) as response:
            return json.load(response),response.headers.get('X-HeyGen-Request-Id')
    except urllib.error.HTTPError as e:
        # Never print response bodies, credentials, redirects or private account fields.
        raise RuntimeError(f'HeyGen HTTP {e.code}; inspect job state before retrying') from None

def image_input(file):
    image=Path(file).resolve()
    if image.suffix.lower() not in ['.png','.jpg','.jpeg']:raise ValueError('Reference must be PNG or JPEG')
    if image.stat().st_size>5*1024*1024:raise ValueError('Reference exceeds 5 MiB')
    return {'type':'base64','media_type':'image/png' if image.suffix.lower()=='.png' else 'image/jpeg','data':base64.b64encode(image.read_bytes()).decode()}

def payload_for(job, directory):
    payload={k:job[k] for k in ['model','mode','prompt','duration','resolution','aspect_ratio','seed','prompt_enhancement'] if k in job}
    if payload.get('model')!='heygen-video-1':raise ValueError('This adapter supports heygen-video-1 only')
    if not isinstance(payload.get('duration'),int) or not 5<=payload['duration']<=15:raise ValueError('Pilot adapter accepts explicit durations from 5 to 15 seconds')
    # Approved detailed direction should not be silently rewritten by provider enhancement.
    payload.setdefault('prompt_enhancement','disabled')
    if payload['prompt_enhancement']!='disabled' and not job.get('enhancementApproval'):
        raise ValueError('Prompt enhancement requires an explicit approved execution decision')
    if payload.get('mode')=='image_to_video':payload['image']=image_input(directory/job['firstFrame'])
    elif payload.get('mode')=='reference_to_video':
        refs=job.get('referenceImages')
        if not isinstance(refs,list) or not 1<=len(refs)<=9:raise ValueError('Reference mode needs 1 to 9 approved referenceImages')
        if job.get('referenceVideos') or job.get('referenceAudio'):raise ValueError('This adapter has not implemented video/audio references; do not omit them silently')
        payload['reference_images']=[image_input(directory/file) for file in refs]
    elif payload.get('mode')!='text_to_video':raise ValueError('Unsupported mode')
    return payload

def verify_direction(job, job_path):
    if not job.get('fidelityPlan') or not job.get('shotId') or job.get('productionPhase') not in ['sample','final']:
        raise ValueError('Before paid generation: fidelityPlan, shotId and productionPhase are required; use the approved production plan')
    plan=(job_path.parent/job['fidelityPlan']).resolve()
    command=['node',str(Path(__file__).parent/'fidelity-check.mjs'),str(plan),'--phase',job['productionPhase'],'--shot',job['shotId'],'--job',str(job_path)]
    result=subprocess.run(command,capture_output=True,text=True,timeout=30)
    if result.returncode!=0:
        raise ValueError('Fidelity checkpoint blocked generation. Run npm run fidelity-check locally to inspect missing evidence; no paid API called')

def submit(job_path, ledger_path, execute=False):
    job_path=Path(job_path).resolve();ledger_path=Path(ledger_path).resolve();job=read(job_path)
    lock=ledger_path.with_suffix(ledger_path.suffix+'.lock')
    try:fd=os.open(lock,os.O_CREAT|os.O_EXCL|os.O_WRONLY)
    except FileExistsError:raise ValueError('Ledger is locked; inspect active/unknown submission before proceeding')
    try:
        ledger=read(ledger_path)
        if any(x['jobFile']==str(job_path) for x in ledger['jobs']):raise ValueError('Job already reserved/submitted; use status, do not submit again')
        check_budget(ledger,job['reserveUSD']);payload=payload_for(job,job_path.parent)
        if not execute:return {'status':'planned','reserveUSD':job['reserveUSD'],'duration':job['duration'],'provider':'heygen_direct_api'}
        verify_direction(job,job_path)
        account,_=api('/v3/users/me');wallet=account['data'].get('wallet',{})
        if wallet.get('currency')!='usd' or wallet.get('remaining_balance') is None:raise ValueError('USD wallet could not be verified')
        balance=Decimal(str(wallet['remaining_balance']));reserve=Decimal(str(job['reserveUSD']))
        threshold=Decimal(str(wallet.get('auto_reload',{}).get('threshold_usd',0))) if wallet.get('auto_reload',{}).get('enabled') else Decimal(0)
        if balance-reserve<=threshold:raise ValueError('Insufficient safe balance or auto-reload threshold; no generation submitted')
        entry={'jobFile':str(job_path),'reservedUSD':job['reserveUSD'],'chargedUSD':None,'status':'submitting','startedAt':int(time.time()),'idempotencyKey':str(uuid.uuid4())}
        ledger['jobs'].append(entry);write(ledger_path,ledger)
        try:
            result,request_id=api('/v3/models/videos',payload,entry['idempotencyKey']);data=result['data']
            entry.update(status=data['status'],videoId=data['video_id'],requestId=request_id)
        except Exception:
            entry['status']='submission_unknown';write(ledger_path,ledger);raise
        write(ledger_path,ledger)
        return {'status':entry['status'],'job':job_path.name,'reservedUSD':entry['reservedUSD']}
    finally:
        os.close(fd);lock.unlink()

def status(job_path,ledger_path,download=False):
    job_path=Path(job_path).resolve();ledger_path=Path(ledger_path).resolve()
    lock=ledger_path.with_suffix(ledger_path.suffix+'.lock')
    try:fd=os.open(lock,os.O_CREAT|os.O_EXCL|os.O_WRONLY)
    except FileExistsError:raise ValueError('Ledger is locked; retry status when the active operation finishes')
    try:
        ledger=read(ledger_path);entry=next(x for x in ledger['jobs'] if x['jobFile']==str(job_path))
        if not entry.get('videoId'):raise ValueError('Submission outcome unknown; reconcile via request log/idempotency before another generation')
        result,_=api('/v3/models/videos/'+urllib.parse.quote(entry['videoId'],safe=''));data=result['data'];entry['status']=data['status']
        query=urllib.parse.urlencode({'start_time':entry['startedAt']-60,'end_time':int(time.time())+1,'job_id':entry['videoId'],'limit':100})
        try:
            logs,_=api('/v3/requests?'+query);rows=logs.get('data',[])
            charges=[x['charge']['amount_usd'] for x in rows if x.get('charge_recorded') and x.get('charge') and x['charge'].get('amount_usd') is not None and not x['charge'].get('refunded')]
            if charges and not logs.get('has_more'):entry['chargedUSD']=float(sum(Decimal(str(x)) for x in charges))
        except Exception:entry['chargeStatus']='unverified; reservation retained unless a charge was already recorded'
        if data['status']=='completed' and download:
            url=data['video_url']
            if urllib.parse.urlparse(url).scheme!='https':raise ValueError('Video download requires HTTPS')
            target=job_path.with_suffix('.mp4')
            if not target.exists():
                # Download without authentication headers. Do not send the API key to storage hosts.
                with urllib.request.urlopen(url,timeout=120) as response:target.write_bytes(response.read())
            entry['output']=target.name
        if data['status']=='failed':entry['failureCode']=data.get('failure_code');entry['failureMessage']=data.get('failure_message')
        write(ledger_path,ledger)
        return {k:entry[k] for k in ['status','chargedUSD','output','failureCode','failureMessage'] if k in entry}
    finally:os.close(fd);lock.unlink()

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('action',choices=['submit','status']);p.add_argument('job');p.add_argument('--ledger',required=True);p.add_argument('--execute',action='store_true');p.add_argument('--download',action='store_true');a=p.parse_args()
    try:print(json.dumps(submit(a.job,a.ledger,a.execute) if a.action=='submit' else status(a.job,a.ledger,a.download),ensure_ascii=False))
    except Exception as e:raise SystemExit(str(e))
