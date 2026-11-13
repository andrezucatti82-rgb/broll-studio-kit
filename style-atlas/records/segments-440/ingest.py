"""Extract complete generated panels and build the candidate catalogue.
No retouching, invented review or partially installed catalogue. --install requires every asset.
"""
from pathlib import Path
from PIL import Image
import json,hashlib,copy,difflib,struct,sys,unicodedata
ROOT=Path(__file__).resolve().parents[3];REC=Path(__file__).parent;DIST=ROOT/'style-atlas/dist';WORK=ROOT.parent/'work/ads-440';OUT=DIST/'assets/segments-440';OUT.mkdir(exist_ok=True)
read=lambda p:json.loads(p.read_text())
jobs=read(REC/'concepts.json');groups=read(REC/'groups.json');catalog=read(DIST/'catalog.json');existing=copy.deepcopy(catalog['styles'][:780]);assert [s['id'] for s in existing]==read(REC/'previous-ids.json')
refinements={r['id']:r for r in read(REC/'refinement-directions.json')} if (REC/'refinement-directions.json').exists() else {}
previous=read(REC/'previous-references.json');assert all(s['image']==r['image'] and s['sequence']==r['sequence'] for s,r in zip(existing,previous))
group_by={g['id']:g for g in groups};legacy={old:g for g in groups for old in g['legacyFamilies']}
meta=read(REC/'meta-references.json')['records'];sources=read(REC/'sources.json');source_by={s['id']:s for s in sources};group_sources=read(REC/'research-map.json')
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
common_identity='Pessoas reais preservam rosto, traços, tom de pele, idade aparente, cabelo, biotipo e proporções. Originais são referência principal. Não inventar ângulos ocultos, embelezar ou alterar anatomia. Imagem isolada não comprova movimento.'
product='Produto real usa fotos originais protegidas; preservar geometria, escala, cor, materiais, construção, marca, rótulo e embalagem. Não inventar verso, interior, peças, funções, medidas ou giro 360° sem cobertura validada. '
service='Serviço real usa material autorizado e informações confirmadas; não simular atendimento executado, cliente satisfeito, diagnóstico, credencial, resultado ou comparação antes/depois. '
family_invariants={
 'ads-juridico':service+'Conteúdo jurídico informativo e sóbrio, revisado pelo responsável; sem captação, promessa de êxito, ostentação, promoção da estrutura física do escritório, símbolo oficial da OAB, caso real inventado ou documento com dados pessoais. ',
 'ads-turismo':service+'Preservar arquitetura, planta, cômodos, dimensões, vista, entorno e serviços reais. Mapas licenciados e coordenadas confirmadas; fotos isoladas não comprovam drone ou tour. ',
 'ads-servicos':service+'Usar processo seguro autorizado, escopo e condições reais; não demonstrar intervenção perigosa ou comparar resultado gerado por IA como prova. ',
 'ads-automotivo':product+service+'Preservar modelo do veículo, componentes, inscrições e aplicação. Sem defeito, homologação, teste de segurança ou compatibilidade inventados. ',
 'ads-infantil':product+'Publicidade dirigida aos responsáveis adultos; uso seguro conforme fabricante, sem culpa parental ou promessa de saúde, segurança ou desenvolvimento. Não alterar idade ou corpo de crianças. ',
 'ads-pets':product+service+'Preservar espécie, porte, anatomia e características do animal; comportamento natural supervisionado, sem preferência, cura ou benefício clínico garantidos. ',
 'ads-alimentacao':product+'Ingredientes, origem, alergênicos, porções, alegações e certificações só com fonte. Acompanhamentos são sugestões de consumo e não ingredientes atribuídos ao produto. ',
 'ads-beleza':product+'Pele e cabelo mantêm textura e características reais; não retocar poros, alterar corpo ou fabricar antes/depois, eficácia, ativos, concentração ou resultado clínico. '}
base=copy.deepcopy(existing[-1]['preset'])
def offer_type(family,subniche):
 text=unicodedata.normalize('NFKD',subniche).encode('ascii','ignore').decode().lower()
 if family in ['ads-juridico','ads-servicos','ads-turismo']:return 'service'
 if family=='ads-pets' and any(v in text for v in ['veterin','servico','banho e tosa','cuidados e atendimento']):return 'service'
 if family=='ads-beleza':
  if text=='servicos e produtos':return 'mixed'
  if 'servico' in text:return 'service'
 if family=='ads-automotivo':
  if text in ['manutencao e insumos','aplicacao e manutencao','pneus e servico','personalizacao e acessorios']:return 'mixed'
  if any(v in text for v in ['servico','oficina','agendamento','diagnostico','manutencao','revisao','higieniz','estetica','personalizacao']):return 'service'
 return 'product'
def research(family,index):
 ids=group_sources[family];refs=[source_by[i] for i in ids];observations='Referências públicas de argumento, formato e apresentação; não copiar marca, pessoa, campanha, música ou ativo. O conceito é original e depende do produto e das condições reais.'
 return {'sources':[{'id':r['id'],'title':r['title'],'url':r['url'],'evidenceType':r['kind']} for r in refs], 'observations':observations,'salesPerformanceVerified':False,'hypothesis':'Testar clareza da necessidade, demonstração, objeção e chamada; escolher vencedores somente com experimento e métricas da própria campanha.'}
def pad_webp(p):
 data=p.read_bytes()
 if len(data)%65536==65534:
  data+=b'JUNK'+struct.pack('<I',0);p.write_bytes(data[:4]+struct.pack('<I',len(data)-8)+data[8:])
hero_overrides=read(REC/'hero-overrides.json') if (REC/'hero-overrides.json').exists() else {}
prior_assets={a['id']:a['sourceSHA256'] for a in read(REC/'assets.json')} if (REC/'assets.json').exists() else {}
assets=[];new=[];missing=[]
for index,j in enumerate(jobs):
 j=copy.deepcopy(j);j['heroIndex']=hero_overrides.get(j['id'],j['heroIndex'])
 result=WORK/'results'/(j['id']+'.json')
 if j['id'] in refinements:
  refined=WORK/'refinements'/(j['id']+'.json')
  if refined.exists():
   result=refined;j['look']+='; '+refinements[j['id']]['refinementDirection'].split('. ',1)[0]+'.'
  else:missing.append('refinement:'+j['id'])
 if not result.exists():missing.append(j['id']);continue
 generated=read(result);source=Path(generated['path'])
 if not source.exists():missing.append(j['id']);continue
 source_digest=sha(source);im=Image.open(source).convert('RGB');w,h=im.size
 if abs(w/h-2/3)>.02:raise ValueError('Non-standard portrait board; regenerate rather than crop: '+j['id']+' '+str(im.size))
 rects=[(0,0,w//2,h//2),(w//2,0,w,h//2),(0,h//2,w//2,h),(w//2,h//2,w,h)];frames=[];crops=[]
 for k,rect in enumerate(rects):
  target=OUT/(j['id']+f'-{k+1:02d}.webp');thumb=OUT/(j['id']+f'-{k+1:02d}-small.webp')
  if not target.exists() or not thumb.exists() or prior_assets.get(j['id'])!=source_digest:
   panel=im.crop(rect);panel.save(target,'WEBP',quality=91,method=6);pad_webp(target);panel.thumbnail((240,360));panel.save(thumb,'WEBP',quality=84,method=6);pad_webp(thumb)
  frame={'src':target.relative_to(DIST).as_posix(),'thumbnail':thumb.relative_to(DIST).as_posix(),'width':rect[2]-rect[0],'height':rect[3]-rect[1],'label':['Gancho','Argumento','Demonstração','Fechamento'][k],'action':j['beats'][k],'caption':j['beats'][k],'alt':j['name']+' — '+j['beats'][k]};frames.append(frame);crops.append({'src':frame['src'],'rect':list(rect),'sha256':sha(target)})
 family=j['family'];invariants=family_invariants.get(family,product)+common_identity+' '+j['proofNeed']
 offer=offer_type(family,j['subniche']);is_service=offer=='service';resources=[('Material autorizado do local e serviço real; escopo, condições e identificação confirmados' if is_service else 'Originais do produto e material autorizado do serviço; modelo, aplicação e escopo confirmados' if offer=='mixed' else 'Fotos ou vídeos originais do produto real, variante e ângulos necessários'),('Documentos e informações revisados pelo responsável, sem dados privados' if family=='ads-juridico' else 'Escopo, condições e informações revisadas do atendimento' if is_service else 'Ficha real de características, medidas, instruções, rótulo e condições aplicáveis'),'Pessoas e vozes autorizadas ou personagens fictícios identificados; sem clonagem inferida','Identidade da marca, arquivos licenciados e destino real da chamada final','Narração profissional em português brasileiro, música e foley licenciados','Letreiros, legendas sincronizadas, diagramas e CTA recompostos em código editável']
 requirements='Materiais e recursos: '+ '; '.join(resources)+'. Limite específico: '+j['proofNeed']+'.'
 motion=' → '.join(j['beats'])+'. A ação acontece dentro da cena; cortes por gesto, objeto, som ou oclusão coerentes com '+j['layout']+'. Câmera confortável, foco estável, sem wiggle decorativo; zoom em foto não substitui ação.'
 sound='Foley realista dos gestos e materiais desta sequência, sincronizado à ação; música licenciada coerente com o ambiente, sem copiar a trilha das referências.'
 audio={'voice':'Obrigatória: narração em português brasileiro, voz profissional licenciada e ritmo conversado; medir a duração da fala antes da montagem.','music':('Trilha discreta e natural de criador.' if j['creativeMode']=='natural_ugc' else 'Trilha de campanha com progressão motivada e pausas para a mensagem.')+' Confirmar licença e adequação.','sfx':sound,'mix':'Voz inteligível acima da música e do foley, ducking e revisão por escuta integral; legendas acompanham a fala.','narrationRequired':True,'captionsRequired':True,'language':'pt-BR'}
 ad={'version':1,'framework':j['framework'],'frameworkMeaning':'Dor → Benefício → Objeção → Chamada para ação' if j['framework']=='DBO' else 'Atenção → Interesse → Desejo → Ação','targetDurationRange':[30,45],'hook':j['hook'],'benefitDirection':'Mostrar a utilidade ou o valor confirmado para '+j['subniche']+' por ações visíveis: '+j['beats'][1]+'; '+j['beats'][2]+'. Não criar benefício sem base factual.','objectionOrEvidence':j['proofNeed'],'cta':j['cta'],'ctaPlacement':'Encerramento com fala e texto editável; destino e condições confirmados com o usuário.','narrationRequired':True,'captionsRequired':True,'scriptInstruction':'Escrever roteiro falado completo a partir do tema e dos fatos confirmados, aplicando a estrutura escolhida e a questão do gancho. Campos de direção e restrições são instruções, não locução literal. Medir a voz e definir tempos por plano; os quatro quadros não são quatro cenas fixas nem blocos iguais. Terminar em chamada adequada à atividade.','captions':{'editable':True,'synchronized':True,'language':'pt-BR','maxLines':2,'safeArea':'Validar área segura do destino e leitura em celular; não cobrir produto, rosto, rótulo ou controles.','rule':'Transcrever fala e revisar acentos; nunca gerar legendas dentro da imagem IA.'},'finish':('UGC natural com luz e textura críveis, contraste moderado e câmera confortável.' if j['creativeMode']=='natural_ugc' else 'Publicidade elaborada com '+j['look']+'. Cenografia, camadas, tipografia e edição servem à mensagem, sem deformar originais.')+' Sem pele plástica, película cinza ou nitidez excessiva.','claimsRule':invariants,'creativeMode':j['creativeMode'],'subniche':j['subniche'],'visualLayout':j['layout'],'researchBasis':research(family,index),'professionalConstraints':{'informativeOnly':family=='ads-juridico','adultAudience':family=='ads-infantil','verifiedClaimsOnly':True,'noFabricatedTestimonials':True,'realBeforeAfterOnly':True}}
 ad['offerType']=offer
 if family=='ads-juridico':ad['frameworkAdaptation']='Adaptar DBO/AIDA a dúvida, informação, limites e acesso ao conteúdo; sem pressão comercial ou promessa de êxito. A norma profissional e a revisão do responsável prevalecem.'
 preset=copy.deepcopy(base);preset.update(avatar=False,camera=motion,quality='Comparar os quatro quadros e originais, revisar naturalidade, anatomia, identidade, foco, continuidade e texto; movimento e áudio só podem ser aprovados após playback e escuta.',productFidelity=invariants,recommendedDurationSeconds=30,targetDurationRange=[30,45],narrationRequired=True,captionsRequired=True,advertisingFramework=j['framework'],closingCTA=j['cta']);preset['requiredAssets']=requirements
 nearest=max(existing,key=lambda s:difflib.SequenceMatcher(None,j['name'].casefold(),s['name'].casefold()).ratio())
 signature=j['look']+'. '+j['layout']+'. A composição apoia a questão: '+j['hook']
 s={'id':j['id'],'name':j['name'],'family':family,'familyName':j['familyName'],'kind':'Anúncio narrado','signature':signature,'exampleTopic':j['subniche'],'uses':j['familyName']+' · '+j['subniche']+' · publicidade narrada, decisão informada e chamada final','resources':resources,'motion':motion,'complexity':'Média' if j['creativeMode']=='natural_ugc' else 'Alta','edition':'4.4','segment':'Anúncios por segmento','adSubniche':j['subniche'],'creativeMode':j['creativeMode'],'preset':preset,'readiness':{'status':'visual_reference','evidence':'Quatro quadros conceituais fictícios; sem clipe ou áudio produzido, sem teste de vendas e sem aprovação audiovisual.'},'novelty':{'comparisonMethod':'lexical_title_similarity_only_not_visual_novelty_proof','nearestId':nearest['id'],'nearestName':nearest['name'],'difference':'Necessidade e argumento próprios de '+j['subniche']+': '+j['hook']+' Ação específica: '+motion+' Composição: '+j['look']+'. Técnicas gerais podem ser compartilhadas, sem alegação de técnica inédita.'},'researchRefs':group_sources[family],'proof':'Na amostra de 10 s, testar a ação e a passagem mais exigentes deste plano: '+motion+' Comparar aparência, movimento, texto e identidade; escutar voz, música e foley; confirmar dados e limitações: '+j['proofNeed']+'. A CTA pertence ao fechamento, mesmo se a amostra cobrir outro trecho.','requirements':requirements,'audio':audio,'advertising':ad,'note':'Sequência conceitual IA fictícia, não anúncio executado, cliente real ou prova de vendas. Imagens não comprovam benefícios, movimento, atendimento ou resultado; narração, legendas e CTA serão compostas na produção.'}
 hero=frames[j['heroIndex']];s['image']={'atlas':hero['src'],'columns':1,'rows':1,'width':hero['width'],'height':hero['height'],'sourceKind':'ai','source':'Quadro completo de sequência conceitual IA fictícia.'}
 s['sequence']={'version':1,'heroIndex':j['heroIndex'],'theme':j['name'],'frames':frames,'audio':' '.join(audio[k] for k in ['voice','music','sfx']),'conceptOnly':True,'motionValidated':False,'conceptApproval':'pending_user_review'}
 s['executionPlan']={'version':1,'appearance':signature,'visualLayout':j['layout']+'. '+j['look'],'categoryDirection':ad['finish'],'referenceStates':[{'frame':i+1,'state':b} for i,b in enumerate(j['beats'])],'motionTargets':[{'fromFrame':i+1,'toFrame':i+2,'initialState':j['beats'][i],'actionAndResult':j['beats'][i+1]} for i in range(3)],'movementLanguage':motion,'resources':resources,'shotPlanFields':['initialState','action','result','camera','depth','transition','narration','editableText','sound','durationFromVoice'],'planningRule':'Quatro estados conceituais, não quatro cenas obrigatórias. Durações seguem a voz, sem divisão uniforme. Definir escopo de cada contribuição, aprovar moodboard e storyboard antes da amostra.','textRule':'Letreiros, legendas, números explicativos, diagramas e CTA são compostos em código editável com fonte licenciada. Rótulos, marcas e telas reais preservam o original protegido; reconstrução só com arquivos e conferência, nunca inventados ou alterados por IA.','invariants':invariants,'validation':'Aprovar moodboard, storyboard e amostra com quatro travas, playback e escuta. Imagem estática e anúncio ativo não comprovam qualidade audiovisual ou vendas.'}
 new.append(s);assets.append({'id':j['id'],'sourceFile':source.name,'sourceSize':[w,h],'sourceSHA256':source_digest,'generator':'OpenAI image_gen','prompt':generated.get('prompt'),'edits':generated.get('edits',[]),'promptRecord':generated.get('promptSource'),'crops':crops,'heroIndex':j['heroIndex'],'conceptApproval':'pending_user_review','motionValidated':False,'staticVisualReview':'pending'})
(REC/'assets.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2)+'\n')
if missing:
 print(str(len(new))+'/380 extracted; '+str(len(missing))+' missing. Catalogue untouched.');sys.exit(0 if '--partial' in sys.argv else 1)
for s in existing:
 old=s.get('legacyFamily',s['family']);g=legacy.get(old)
 if not g:continue
 s.setdefault('legacyFamily',old);s.setdefault('legacyFamilyName',s['familyName']);s['family']=g['id'];s['familyName']=g['name'];s['adSubniche']=s.get('adSubniche',s['legacyFamilyName']);s['creativeMode']='natural_ugc';s['researchRefs']=group_sources[g['id']];s['advertising']['researchBasis']=research(g['id'],0);s['advertising']['creativeMode']='natural_ugc';s['advertising']['subniche']=s['adSubniche'];s['advertising']['professionalConstraints']={'informativeOnly':g['id']=='ads-juridico','adultAudience':False,'verifiedClaimsOnly':True,'noFabricatedTestimonials':True,'realBeforeAfterOnly':True}
 s['advertising']['offerType']='service' if g['id']=='ads-juridico' else 'product'
 legal_rule=' Conteúdo informativo e sóbrio, revisado segundo normas profissionais vigentes; sem captação, promessa, ostentação, promoção da estrutura física do escritório, símbolo oficial da OAB ou caso inventado.'
 if g['id']=='ads-juridico' and legal_rule not in s['advertising']['claimsRule']:s['advertising']['claimsRule']+=legal_rule
styles=existing+new;assert len(styles)==1160 and len({s['id'] for s in styles})==1160;assert len({s['name'].casefold() for s in styles})==1160
families=copy.deepcopy(catalog['families'][:18])+[{'id':g['id'],'name':g['name'],'kind':'Anúncio narrado','count':40} for g in groups]
assert all(sum(s['family']==g['id'] for s in styles)==40 for g in groups)
candidate=copy.deepcopy(catalog);candidate.update(styles=styles,families=families,version='4.4',visualEditionStatus='complete');candidate['research']['edition']='4.4';candidate['research']['sources']=[s for s in candidate['research']['sources'] if not s['id'].startswith('ads26-ref-')]+sources
(WORK/'candidate-catalog.json').write_text(json.dumps(candidate,ensure_ascii=False,indent=2)+'\n')
if '--install' in sys.argv:
 review=read(REC/'visual-review.json');assert review['reviewedStyleIds'] and set(review['reviewedStyleIds'])=={j['id'] for j in jobs};assert review['scope']=='static_concept_boards' and review['motionReviewed'] is False and review['audioReviewed'] is False
 assert review['sourceSHA256']=={a['id']:a['sourceSHA256'] for a in assets},'Sources changed after static review'
 for a in assets:a['staticVisualReview']='contact_sheet_overview_checked_not_user_approved'
 (REC/'assets.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2)+'\n')
 (DIST/'catalog.json').write_text(json.dumps(candidate,ensure_ascii=False,indent=2)+'\n');print('Installed 1160 styles: 440 ads in 11 groups, 780 previous IDs/order and images retained.')
else:print('380/380 assets complete. Candidate built; --install requires the actual static review record.')
