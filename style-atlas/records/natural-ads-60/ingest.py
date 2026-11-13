"""Separate complete storyboard panels; install only after all 60 exist."""
from pathlib import Path
from PIL import Image
import json,hashlib,difflib,struct,sys
ROOT=Path(__file__).resolve().parents[3];REC=Path(__file__).parent;DIST=ROOT/'style-atlas/dist';OUT=DIST/'assets/natural-ads-60';OUT.mkdir(exist_ok=True)
jobs=json.loads((REC/'concepts.json').read_text());catalog=json.loads((DIST/'catalog.json').read_text());old=[s for s in catalog['styles'] if not s['id'].startswith('natural-')]
assert len(old)==720
if not (REC/'previous-ids.json').exists():(REC/'previous-ids.json').write_text(json.dumps([s['id'] for s in old],ensure_ascii=False,indent=2)+'\n')
assert [s['id'] for s in old]==json.loads((REC/'previous-ids.json').read_text())
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
assets=[];new=[]
base=old[-1]['preset'].copy()
missing=[]
for j in jobs:
 result=Path('/workspace/work/natural-ads-60/results')/(j['id']+'.json')
 if j['pilot']:source=Path('/workspace/deliveries/anuncios-naturais-piloto')/j['pilot']
 elif result.exists():source=Path(json.loads(result.read_text())['path'])
 else:missing.append(j['id']);continue
 im=Image.open(source).convert('RGB');w,h=im.size
 # Geometry only: retain all source contents and actual proportions.
 rects=[(round(i*w/4),0,round((i+1)*w/4),h) for i in range(4)] if j['pilot'] else [(0,0,w//2,h//2),(w//2,0,w,h//2),(0,h//2,w//2,h),(w//2,h//2,w,h)]
 frames=[];crops=[]
 for i,rect in enumerate(rects):
  target=OUT/f"{j['id']}-{i+1:02d}.webp";thumb=OUT/f"{j['id']}-{i+1:02d}-small.webp"
  if not target.exists() or target.stat().st_mtime<source.stat().st_mtime:
   panel=im.crop(rect);panel.save(target,'WEBP',quality=90,method=6);panel.thumbnail((240,420));panel.save(thumb,'WEBP',quality=82,method=6)
   data=target.read_bytes()
   if len(data)%65536==65534:
    data+=b'JUNK'+struct.pack('<I',0);target.write_bytes(data[:4]+struct.pack('<I',len(data)-8)+data[8:])
  f=dict(src=str(target.relative_to(DIST)),thumbnail=str(thumb.relative_to(DIST)),width=rect[2]-rect[0],height=rect[3]-rect[1],label=['Gancho','Desenvolvimento','Demonstração','Fechamento'][i],action=j['beats'][i],caption=j['beats'][i],alt=j['name']+' — '+j['beats'][i])
  frames.append(f);crops.append(dict(src=f['src'],rect=list(rect),sha256=sha(target)))
 resources=['Fotos ou vídeos originais do produto e cobertura dos ângulos necessários','Ficha de características, medidas e informações verificáveis; rótulo quando houver','Identidade da marca e destino confirmado da chamada final','Pessoas e vozes autorizadas ou personagens fictícios explicitamente identificados','Locução natural em português brasileiro, música e foley licenciados','Legendas sincronizadas e CTA em camadas de texto editáveis']
 if j['family']=='ads-advocacia':resources[:2]=['Áreas de atuação, informações profissionais e canais oficiais do escritório','Ambiente e pessoas autorizados; documentos demonstrativos sem dados pessoais; regras profissionais vigentes']
 motion=' → '.join(j['beats'])+'. Cortes por gesto e som, câmera confortável, foco estável, ação interna; não substituir por zoom em fotos.'
 audio=dict(voice='Obrigatória: narração conversada em português brasileiro, voz licenciada, pausas naturais e duração medida; sem clonagem por inferência.',music='Trilha licenciada discreta coerente com o conceito: '+j['sound'],sfx='Foley sincronizado às ações: '+j['sound'],mix='Voz inteligível acima da trilha e do foley; ducking, escuta integral e revisão das legendas.',narrationRequired=True,captionsRequired=True,language='pt-BR')
 advertising=dict(version=1,framework=j['framework'],frameworkMeaning='Dor → Benefício → Objeção → Chamada para ação' if j['framework']=='DBO' else 'Atenção → Interesse → Desejo → Ação',targetDurationRange=[30,45],hook=j['hook'],benefitDirection=j['benefit'],objectionOrEvidence=j['objection'],cta=j['cta'],ctaPlacement='Encerramento com locução e texto editável; destino validado com o usuário, sem link inventado.',narrationRequired=True,captionsRequired=True,scriptInstruction='Escrever roteiro falado completo de 30–45 s a partir do tema e dos fatos confirmados. Aplicar a estrutura indicada, tratar a objeção em linguagem humana e terminar na CTA. Campos direction/evidence são instruções, não locução literal. Medir a voz e definir tempos por cena, sem partes iguais.',captions=dict(editable=True,synchronized=True,language='pt-BR',maxLines=2,safeArea='Validar leitura em celular e margens da interface do destino; não fixar elementos nos extremos.',rule='Transcrever a fala e revisar acentos; nunca gerar legendas dentro da imagem IA.'),finish='Captação natural inspirada em celular: contraste moderado, sombras suavemente levantadas, textura real e cor fiel; sem película cinza, pele plástica, nitidez excessiva ou tremor decorativo.',claimsRule='Atributos, números, certificações, avaliações, ofertas e condições só com fonte da marca. Imagens fictícias não comprovam produto real. '+j['objection'])
 preset={**base,'avatar':False,'recommendedDurationSeconds':30,'targetDurationRange':[30,45],'narrationRequired':True,'captionsRequired':True,'advertisingFramework':j['framework'],'closingCTA':j['cta']}
 requirements='Para '+j['name']+': '+ '; '.join(resources)+'. Confirmar dados, cobertura e invariantes antes de gerar. '+j['objection']+' Aprovar moodboard e storyboard separadamente; depois testar a cena mais exigente com voz, legendas e CTA. Explicar recursos ausentes antes de consumir créditos.'
 nearest=max(old,key=lambda s:difflib.SequenceMatcher(None,(j['familyName']+' '+j['name']).lower(),(s['name']+' '+s['uses']).lower()).ratio())
 s=dict(id=j['id'],name=j['name'],family=j['family'],familyName=j['familyName'],kind='Anúncio narrado',signature=j['look']+' Ação em ambiente realista e acabamento natural de celular.',exampleTopic=j['name'],uses=j['familyName']+' · anúncios narrados, apresentação, consideração e escolha informada',resources=resources,motion=motion,complexity='Alta',edition='4.3',segment='Anúncios por segmento',preset=preset,readiness=dict(status='visual_reference',evidence='Sequência conceitual fictícia; sem clipe ou áudio produzido e sem aprovação audiovisual.'),novelty=dict(nearestId=nearest['id'],nearestName=nearest['name'],difference='Diferenciação pela situação '+j['name']+', estrutura '+j['framework']+' e ação: '+motion+' Técnicas gerais podem ser compartilhadas com o acervo.'),researchRefs=[],proof='Na amostra de 10 s, testar a ação mais difícil desta sequência: '+motion+' Comparar produto/pessoa e aparência com originais; conferir leitura da legenda, voz e transição em playback integral. A CTA deve estar planejada no fechamento mesmo quando a amostra representa outro trecho.',requirements=requirements,audio=audio,advertising=advertising,note='Imagens conceituais IA com pessoas, produtos e situações fictícios. Não comprovam movimento, produto, atendimento, benefícios ou certificação. Narração, legendas e chamada final são obrigatórias na produção; não há áudio nesta imagem.')
 hero=frames[j['heroIndex']];s['image']=dict(atlas=hero['src'],columns=1,rows=1,width=hero['width'],height=hero['height'],sourceKind='ai',source='Quadro conceitual da sequência, não filme executado.')
 approval='approved_by_user_2026-11-12' if j['pilot'] else 'pending_user_review'
 s['sequence']=dict(version=1,heroIndex=j['heroIndex'],theme=j['name'],frames=frames,audio=' '.join(audio[k] for k in ['voice','music','sfx']),conceptOnly=True,motionValidated=False,conceptApproval=approval)
 s['executionPlan']=dict(version=1,appearance=s['signature'],categoryDirection=advertising['finish'],referenceStates=[dict(frame=i+1,state=b) for i,b in enumerate(j['beats'])],motionTargets=[dict(fromFrame=i+1,toFrame=i+2,initialState=j['beats'][i],actionAndResult=j['beats'][i+1]) for i in range(3)],movementLanguage=motion,resources=resources,shotPlanFields=['initialState','action','result','camera','depth','transition','narration','editableText','sound','durationFromVoice'],planningRule='Quatro estados conceituais, não quatro cenas obrigatórias. Durações vêm da locução, sem divisão uniforme. Aplicar advertising, com voz, legendas e CTA final.',textRule='Narração em português e legendas sincronizadas em texto editável; CTA editável no fechamento, nunca letras geradas dentro da imagem.',invariants=preset['productFidelity'],validation='Aprovar moodboard e storyboard, testar 10 s da cena mais difícil com quatro travas e áudio. Preservar originais e confirmar fatos; não prometer fidelidade total.')
 new.append(s);assets.append(dict(id=j['id'],sourceFile=source.name,sourceSize=[w,h],sourceSHA256=sha(source),generator='OpenAI image_gen',prompt=json.loads(result.read_text()).get('prompt',j['prompt']) if not j['pilot'] else 'Piloto aprovado; direção e roteiro em PROPOSTA.md, gerado em 2026-11-11.',crops=crops,conceptApproval=approval,motionValidated=False,visualReview='pending'))
(REC/'assets.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2)+'\n')
if missing:
 print(f'{len(new)}/60 extracted. Catalog untouched; {len(missing)} missing.');sys.exit(0 if '--partial' in sys.argv else 1)
families=[f for f in catalog['families'] if not f['id'].startswith('ads-')]
for j in jobs:
 if not any(f['id']==j['family'] for f in families):families.append(dict(id=j['family'],name=j['familyName'],kind='Anúncio narrado',count=6))
catalog.update(styles=old+new,families=families,version='4.3',visualEditionStatus='complete')
(DIST/'catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
print('780 styles / 28 categories; 720 IDs and images retained; 60 new concepts, 240 frames; no videos generated')
