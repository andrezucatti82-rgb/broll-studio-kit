"""Extract four complete panels; never stretch, retouch or crop their contents.
The approved pilot and generated boards retain their actual source proportions.
Run repeatedly while generation continues; --complete requires all 720 sequences.
"""
from pathlib import Path
from PIL import Image
import hashlib,json,sys

ROOT=Path(__file__).resolve().parents[3]; DIST=ROOT/'style-atlas/dist'; RECORD=Path(__file__).parent
WORK=Path('/workspace/work/sequences-720'); OUT=DIST/'assets/style-sequences';OUT.mkdir(exist_ok=True)
catalog=json.loads((DIST/'catalog.json').read_text());jobs={j['id']:j for j in json.loads((WORK/'jobs.json').read_text())}
pilots={x['styleId']:x for x in json.loads((DIST/'sequence-pilot.json').read_text())['examples']}
directions=json.loads((RECORD/'family-direction.json').read_text())
observed={}
for observed_file in sorted(RECORD.glob('observed-*.json')):
    observed.update(json.loads(observed_file.read_text()))
labels=['Abertura','Desenvolvimento','Transformação','Fechamento']; records=[];count=0
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
for s in catalog['styles']:
    sid=s['id'];result=WORK/'results'/f'{sid}.json';pilot=pilots.get(sid)
    revision=WORK/'revisions'/f'{sid}.json'
    if revision.exists():result=revision
    if not pilot and not result.exists():continue
    frames=[]
    if pilot:
        theme=pilot['theme'];beats=[f['action'] for f in pilot['frames']];sound=pilot['audio']
        for f in pilot['frames']:
            f=dict(f);source=DIST/f['src'];thumb=OUT/f"{sid}-{len(frames)+1:02d}-small.webp"
            if not thumb.exists():
                im=Image.open(source);im.thumbnail((240,420));im.save(thumb,'WEBP',quality=82,method=6)
            f['thumbnail']=str(thumb.relative_to(DIST));frames.append(f)
        record={'id':sid,'source':'approved-sequence-pilot','conceptApproval':'approved_by_user_2026-11-11','motionValidated':False}
    else:
        j=jobs[sid];r=json.loads(result.read_text());source=Path(r['path']);im=Image.open(source).convert('RGB');w,h=im.size
        # Only divide the four-panel board at its actual midpoint. No forced 9:16.
        assert w>600 and h>600,(sid,im.size)
        rects=[(0,0,w//2,h//2),(w//2,0,w,h//2),(0,h//2,w//2,h),(w//2,h//2,w,h)]
        beats=observed.get(sid,r.get('beats',j['beats']));theme=j['topic'];sound=' '.join(s['audio'][k] for k in ['voice','music','sfx'])
        crops=[]
        for i,rect in enumerate(rects):
            target=OUT/f'{sid}-{i+1:02d}.webp';thumb=OUT/f'{sid}-{i+1:02d}-small.webp'
            if not target.exists() or target.stat().st_mtime<source.stat().st_mtime:
                frame=im.crop(rect);frame.save(target,'WEBP',quality=92,method=6)
                frame.thumbnail((240,420));frame.save(thumb,'WEBP',quality=82,method=6)
            data=target.read_bytes()
            if len(data)%65536==65534 and data[:4]==b'RIFF':
                data+=b'JUNK'+struct.pack('<I',0)
                target.write_bytes(data[:4]+struct.pack('<I',len(data)-8)+data[8:])
            width,height=rect[2]-rect[0],rect[3]-rect[1]
            frames.append({'src':str(target.relative_to(DIST)),'thumbnail':str(thumb.relative_to(DIST)),'width':width,'height':height,'label':labels[i],'action':beats[i],'caption':([theme+'.',s['motion'].rstrip('.')+'.','A ação transforma o estado inicial.','A sequência encerra a mensagem.'][i] if beats[i].startswith(('Estabeleça','Início da ação','Consequência visível','Resolva visualmente')) else beats[i]),'alt':s['name']+' — '+labels[i].lower()+'. '+beats[i]})
            crops.append({'src':str(target.relative_to(DIST)),'rect':list(rect),'sha256':sha(target)})
        record={'id':sid,'sourceFile':source.name,'sourceSize':[w,h],'sourceSHA256':sha(source),'generator':'OpenAI image_gen','prompt':r.get('prompt',j['prompt']),'crops':crops,'conceptApproval':'pending_user_review','visualReview':'static_contact_sheet_reviewed' if sid in observed else 'pending','motionValidated':False}
    s.setdefault('legacyImage',s['image'])
    heroIndex=3 if (not pilot and s['family']=='tecnologia') or sid in ['titulos-em-relevo-por-luz-rasante','campanha-dados-em-faixas-de-comparacao','exp-identidade-em-painel-de-cabos-tensionados','exp-mensagem-em-relevo-de-superficie-mutavel','exp-campanha-de-pigmento-em-sedimentacao'] else 1
    hero=frames[heroIndex];s['image']={'atlas':hero['src'],'columns':1,'rows':1,'width':hero['width'],'height':hero['height'],'sourceKind':'ai','source':'Quadro conceitual da sequência; não comprova vídeo executado.'}
    s['exampleTopic']=theme
    s['sequence']={'version':1,'heroIndex':heroIndex,'theme':theme,'frames':frames,'audio':sound,'conceptOnly':True,'motionValidated':False,'conceptApproval':record['conceptApproval']}
    s['executionPlan']={
        'version':1,'appearance':s['signature'],'categoryDirection':directions[s['family']],
        'referenceStates':[{'frame':i+1,'state':beat} for i,beat in enumerate(beats)],
        'motionTargets':[{'fromFrame':i+1,'toFrame':i+2,'initialState':beats[i],'actionAndResult':beats[i+1]} for i in range(3)],
        'movementLanguage':s['motion'],'resources':s['resources'],
        'shotPlanFields':['initialState','action','result','camera','depth','transition','narration','editableText','sound','durationFromVoice'],
        'planningRule':'Os quatro quadros são referências da evolução, não quatro cenas obrigatórias. Adaptar ao roteiro e à locução, sem divisão uniforme. Preencher por plano os campos shotPlanFields e provar a ação em vídeo.',
        'textRule':'Recompor texto e dados em código editável; a tipografia no conceito não é um asset final. Conferir fonte, acentos, valores e leitura no formato escolhido.',
        'invariants':s['preset']['productFidelity'],
        'validation':'Comparar cada estado proposto com os quadros e originais aplicáveis. Confirmar recursos antes de gastar créditos; apresentar desvios. Moodboard e storyboard exigem aceites separados; depois amostra de 10 s da ação mais difícil, com quatro travas. Não prometer fidelidade total.'
    }
    records.append(record);count+=1
if '--complete' in sys.argv:assert count==720,f'Only {count}/720 generated'
catalog['visualEdition']='film-sequences-1';catalog['visualEditionStatus']='complete' if count==720 else 'building';catalog['version']='4.2'
(DIST/'catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
(RECORD/'assets.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
print(f'{count}/720 sequences installed; actual proportions retained; video approval unchanged')
