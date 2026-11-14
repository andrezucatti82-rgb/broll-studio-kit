/* Account-independent planning helpers. No network, storage, generation or approvals. */
(function(g){
 'use strict';
 const OBJECTIVES=['product','service','explain','brand','other'];
 const MATERIALS=['one_photo','photos','video','logo','website','screens','idea'];
 const clean=v=>typeof v==='string'?v.trim().slice(0,1200):'';
 const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function normalizeBrief(value){
  const b=value&&typeof value==='object'&&!Array.isArray(value)?value:{};
  let materials=Array.isArray(b.materials)?[...new Set(b.materials.filter(v=>MATERIALS.includes(v)))]:[];
  if(materials.length>1)materials=materials.filter(v=>v!=='idea');
  if(materials.includes('photos'))materials=materials.filter(v=>v!=='one_photo');
  return {objective:OBJECTIVES.includes(b.objective)?b.objective:'other',subject:clean(b.subject),materials:materials.length?materials:['idea'],complexity:['simple','balanced','advanced'].includes(b.complexity)?b.complexity:'balanced'};
 }
 const families={product:['anuncios','ecommerce','campanhas','ads-joias','ads-casa','ads-moda','ads-alimentacao','ads-pets','ads-automotivo','ads-beleza','ads-infantil'],service:['campanhas','hibridos','cinema','ads-juridico','ads-turismo','ads-servicos','ads-pets','ads-automotivo','saude'],explain:['software','tecnologia','apresentacoes','infoprodutores','motion'],brand:['cinema','grafico','motion-campanha','hibridos','campanhas'],other:['cinema','grafico','hibridos','apresentacoes']};
 const topics=[
  [/\b(joia|joias|anel|aneis|brinco|brincos|colar|colares)\b/,'ads-joias','joias'],
  [/\b(capacho|capachos|fibra de coco|decoracao|luminaria|cortina|tapete)\b/,'ads-casa','casa e decoração'],
  [/\b(advogad[oa]s?|advocacia|juridic[oa]s?|escritorio de advocacia)\b/,'ads-juridico','serviços jurídicos'],
  [/\b(masculino|masculina|masculinas|masculinos|feminino|feminina|femininas|femininos|roupa|roupas|vestuario|biquini|biquinis|moda praia|pijama|pijamas)\b/,'ads-moda','moda e vestuário'],
  [/\b(organico|organicos|organica|organicas|proteica|proteicas|proteico|proteicos|cereal|cereais|alimento|alimentos|bebida|bebidas|cafe)\b/,'ads-alimentacao','alimentação e bebidas'],
  [/\b(pet|pets|cao|caes|cachorro|cachorros|gato|gatos|racao|veterinario|banho e tosa)\b/,'ads-pets','pets e cuidados animais'],
  [/\b(carro|carros|moto|motos|automotivo|oficina|pneu|pneus|bicicleta|mobilidade)\b/,'ads-automotivo','automotivo e mobilidade'],
  [/\b(turismo|viagem|viagens|hotel|hoteis|hospedagem|pousada)\b/,'ads-turismo','turismo e hospedagem'],
  [/\b(beleza|cosmetico|cosmeticos|perfume|skincare|maquiagem|sabonete|shampoo)\b/,'ads-beleza','beleza e autocuidado'],
  [/\b(diarista|limpeza residencial|eletricista|encanador|montador|servicos residenciais|ar condicionado)\b/,'ads-servicos','serviços residenciais'],
  [/\b(bebe|bebes|infantil|maternidade|fralda|fraldas|carrinho de bebe|brinquedo|brinquedos)\b/,'ads-infantil','infantil e maternidade'],
  [/\b(imovel|imoveis|apartamento|casa|corretor|corretora)\b/,'imoveis','imóveis'],
  [/\b(software|sistema|sistemas|dashboard|dashboards|aplicativo|ga4|meta ads|google ads)\b/,'software','softwares e telas'],
  [/\b(dentista|dentistas|odontologia|medico|medica|clinica|estetica)\b/,'saude','saúde e estética'],
  [/\b(curso|cursos|aula|aulas|mentoria|infoproduto|infoprodutos)\b/,'infoprodutores','educação']
 ];
 // Display order only. Persistent catalogue positions, IDs and objects never change.
 function advertisingOrder(styles,familyOrder=[]){
  const rows=Array.isArray(styles)?styles:[],present=[...new Set(rows.map(s=>s.family))];
  const families=[...new Set([...familyOrder.filter(id=>present.includes(id)),...present])];
  const queues=families.map(id=>{
   const subset=rows.filter(s=>s.family===id),campaign=subset.filter(s=>s.creativeMode==='campaign_composite'),natural=subset.filter(s=>s.creativeMode!=='campaign_composite'),queue=[];
   while(campaign.length||natural.length){if(campaign.length)queue.push(campaign.shift());if(natural.length)queue.push(natural.shift())}
   return queue;
  });
  const ordered=[];while(queues.some(q=>q.length))for(const q of queues)if(q.length)ordered.push(q.shift());
  return ordered;
 }
 function recommend(styles,value){
  const b=normalizeBrief(value),subject=norm(b.subject),tokens=[...new Set(subject.split(/[^a-z0-9]+/).filter(t=>t.length>3&&!['para','como','sobre','quero','video','fazer','criar','mostrar','minha','meus','meus','desta','este','essa'].includes(t)))];
  const topicMatches=topics.filter(([rx])=>rx.test(subject)),has=k=>b.materials.includes(k);
  const candidates=(Array.isArray(styles)?styles:[]).filter(s=>s&&typeof s.id==='string').map((s,index)=>{
   let score=0;const reasons=[];const family=s.family||'';
   if(families[b.objective].includes(family)){score+=30;reasons.push({weight:30,text:{product:'Direção orientada a apresentar produtos e apoiar uma decisão de compra.',service:'Direção adequada para explicar o serviço e tornar seu valor visível.',explain:'Ajuda a organizar explicações e destacar a mensagem.',brand:'Trabalha a presença e a linguagem visual da marca.',other:'Uma direção versátil para desenvolver sua ideia.'}[b.objective]});}
   for(const [,target,label] of topicMatches)if(family===target){score+=65;reasons.push({weight:65,text:'Tem propostas específicas para '+label+'.'});}
   const full=norm([s.name,s.signature,s.uses,s.kind,s.familyName,s.adSubniche,s.legacyFamilyName].join(' '));const hits=tokens.filter(t=>full.includes(t)).length;
   if(hits){score+=Math.min(hits*5,25);reasons.push({weight:15,text:'O tema aparece nos usos ou na direção deste estilo.'});}
   const specific=norm([s.adSubniche,s.legacyFamilyName,s.exampleTopic].join(' ')),specificHits=tokens.filter(t=>specific.includes(t)).length;
   if(specificHits&&family.startsWith('ads-')){score+=Math.min(specificHits*22,66);reasons.push({weight:66,text:'A proposta aborda especificamente '+(s.adSubniche||s.exampleTopic||s.familyName)+'.'});}
   if(has('screens')&&['software','tecnologia','apresentacoes'].includes(family)){score+=38;reasons.push({weight:38,text:'Aproveita suas capturas de tela com composição e textos editáveis.'});}
   if(has('video')&&['cinema','hibridos','campanhas'].includes(family)){score+=24;reasons.push({weight:24,text:'Permite priorizar ações e detalhes da filmagem que você já tem.'});}
   if((has('photos')||has('one_photo'))&&['anuncios','ecommerce',...families.product.filter(f=>f.startsWith('ads-'))].includes(family)){score+=20;reasons.push({weight:20,text:has('one_photo')?'Pode partir da sua foto com o produto protegido; movimentos dependem da cobertura.':'Pode aproveitar seus ângulos originais, após conferir a cobertura.'});}
   const difficult=/alta|experimental/.test(norm(s.complexity));
   if(b.complexity==='simple'){score+=difficult?-24:12;if(!difficult)reasons.push({weight:12,text:'Tem complexidade declarada mais acessível dentro do catálogo.'});}
   if(b.complexity==='balanced')score+=difficult?-5:5;
   if(b.complexity==='advanced')score+=difficult?8:0;
   // A still image does not establish geometry or unseen angles.
   if(has('one_photo')&&['volume','imoveis'].includes(family))score-=15;
   reasons.sort((a,b)=>b.weight-a.weight);
   return {id:s.id,score,index,family,reason:(reasons[0]?.text||'Alternativa próxima para comparar composição e mensagem.')+' A execução depende dos materiais e da amostra.'};
  }).sort((a,b)=>b.score-a.score||a.index-b.index);
  const chosen=[],seen=new Set();
  while(chosen.length<3){
   const ranked=candidates.filter(c=>!seen.has(c.id)).map(c=>({...c,adjusted:c.score-(chosen.filter(x=>x.family===c.family).length*16)})).sort((a,b)=>b.adjusted-a.adjusted||a.index-b.index);
   if(!ranked.length)break;const pick=ranked[0];chosen.push(pick);seen.add(pick.id);
  }
  return chosen.map(({id,reason,score})=>({id,reason,score}));
 }
 function materialPlan(value){
  const b=normalizeBrief(value),has=k=>b.materials.includes(k),needed=[],limitations=[];let route,summary;
  if(has('screens')){route='capture_and_code';summary='Usar capturas autorizadas e compor destaques, textos e relações em camadas editáveis.';needed.push('Capturas atuais ou gravação de tela autorizada, com dados demonstrativos ou privados ocultados.','Explicação das ações e informações que precisam aparecer.');limitations.push('Capturas estáticas não comprovam ações executadas nem funcionalidades; confirmar cada estado.');}
  else if(has('video')){route='footage_editing';summary='Priorizar ações reais da filmagem e completar a mensagem com edição, som e textos editáveis.';needed.push('Vídeos originais de boa resolução e autorização para pessoas, imagem e voz quando aplicável.');limitations.push('Conferir se a filmagem cobre as ações prometidas; pedir cobertura adicional quando faltar.');}
  else if(has('photos')){route='verified_angles';summary='Conferir os ângulos disponíveis e combinar fotos protegidas, composição e ações compatíveis.';needed.push('Fotos originais da mesma pessoa, produto ou imóvel e identificação de cada vista.');limitations.push('Várias fotos não garantem geometria 3D ou continuidade entre ambientes. Não inventar vistas ocultas.');}
  else if(has('one_photo')){route='protected_photo_composite';summary='Usar a foto como original protegido e planejar cenário, enquadramento e movimento compatíveis com a vista disponível.';needed.push('Foto original em boa resolução e indicação do que precisa permanecer fiel.');limitations.push('Uma foto não comprova verso, interior, medidas ou rotação 360°. Limitar a câmera ou solicitar outros ângulos.','Se a ação necessária não puder preservar o sujeito, propor outra execução para aprovação antes de gerar.');}
  else{route='asset_creation_before_sample';summary='Pesquisar o tema e planejar os materiais antes do moodboard, do storyboard e da amostra.';needed.push('Tema e informações que sustentem a mensagem.','Para pessoa, produto ou imóvel real: originais e dados verificáveis antes de representá-los.');limitations.push('Ideia, logotipo ou site não substituem originais de identidade nem comprovam características reais.');}
  if(has('logo'))needed.push('Logotipo original, regras de uso e variantes disponíveis.');
  if(has('website'))needed.push('Endereço oficial do site; confirmar fatos, marca e condições atuais.');
  if(b.objective==='product')needed.push('Modelo ou variante exata, atributos comprovados, rótulo quando houver e destino da chamada final.');
  if(b.objective==='service')needed.push('Serviço, público, processo real, informações revisadas e canal de contato.');
  if(b.objective==='explain')needed.push('Mensagem central, sequência correta da explicação e fontes dos dados.');
  limitations.push('Arquivos são enviados pelo anexo da conversa. As ferramentas e a fidelidade precisam ser verificadas naquela sessão.');
  return {route,summary,limitations,needed:[...new Set(needed)]};
 }
 const sequence=['materials_and_resources','script','moodboard','visual_storyboard','sample','technical_review','user_approval','final_video'];

 function handoffMaterials(value,records=[]){
  const b=normalizeBrief(value),has=k=>b.materials.includes(k),now=[],optional=[],later=[];
  if(has('one_photo'))now.push('Uma foto original nítida do produto ou assunto, na variante que deve aparecer.');
  if(has('photos'))now.push('As fotos originais da mesma variante, identificando as vistas disponíveis.');
  if(has('video'))now.push('Vídeos originais com os trechos úteis e autorização de uso.');
  if(has('screens'))now.push('Telas atuais ou gravação autorizada, fluxo correto e dados reais autorizados ou demonstrativos identificados.');
  if(has('idea'))now.push('A ideia e as informações confirmadas; a IA propõe roteiro e os visuais que precisarão de aprovação.');
  if(b.objective==='product')now.push('Nome/variante, características confirmadas e destino da chamada final.');
  else if(b.objective==='service')now.push('Serviço oferecido, processo real e canal da chamada final.');
  else if(b.objective==='explain')now.push('Mensagem principal, sequência da explicação e fonte dos dados quando houver.');
  if(has('logo'))now.push('O logotipo original que você declarou, se a marca aparecer.');else optional.push('Logotipo ou guia da marca, se quiser usar uma marca; não é obrigatório.');
  if(has('website'))now.push('Endereço oficial do site declarado para conferir as informações.');
  optional.push('Roteiro, voz ou trilha já disponíveis e autorizados, se quiser aproveitá-los.');
  later.push('Outros ângulos ou vistas somente se a ação aprovada depender deles; uma foto não comprova verso, interior ou giro 360°.','Referências e autorizações de pessoa/imóvel real somente quando participarem da execução.');
  const ids=['one_photo','photos','video','screens','idea'].filter(has);if(['product','service','explain'].includes(b.objective))ids.push('facts');if(has('logo'))ids.push('logo');if(has('website'))ids.push('website');
  const meta={
   one_photo:['moodboard','Preservar a aparência real na vista disponível.','Anexe a foto original no chat.','Planejar a vista disponível; pedir outra apenas se a ação depender dela.'],
   photos:['moodboard','Conferir cobertura e consistência entre vistas.','Anexe os originais com os nomes das vistas.','Limitar o enquadramento às vistas utilizáveis.'],
   video:['visual_storyboard','Identificar ações já filmadas para evitar gerar de novo.','Anexe os vídeos e indique os trechos úteis, se souber.','Propor planos compatíveis com a cobertura e os recursos disponíveis.'],
   screens:['visual_storyboard','Mostrar o fluxo correto sem inventar controles ou dados.','Anexe telas atuais ou uma gravação autorizada.','Planejar uma demonstração identificada, sujeita à aprovação.'],
   idea:['script','Definir uma mensagem sustentada antes de produzir imagens.','Descreva a ideia e aproveite informações já no briefing.','A IA propõe roteiro e uma lista curta de materiais.'],
   facts:['script','Sustentar a mensagem e o fechamento sem inventar benefícios.','Responda somente às lacunas que não estejam no briefing, anexos ou site oficial.','Usar afirmações gerais verificáveis ou deixar a informação pendente.'],
   logo:['moodboard','Aplicar a marca com nitidez e proporções corretas, quando previsto.','Anexe o original; SVG ou PNG transparente quando apropriado.','Usar outro original utilizável ou propor versão sem logo para aprovação.'],
   website:['script','Conferir informações e condições na fonte oficial.','Envie o endereço oficial se ainda não estiver no briefing.','Enviar os dados ou arquivos pertinentes se o endereço não abrir.']
  };
  const dependencies=now.map((label,i)=>{const id=ids[i],m=meta[id],r=Array.isArray(records)?records.find(x=>x.id===id):null;return {id,label,stage:m[0],why:m[1],how:m[2],alternative:m[3],status:r?.status||'declared',adequacy:r?.adequacy||'unverified',file:r?.file||'',action:r?.adequacy==='unsuitable'?'request_replacement':['received','inspected','limited'].includes(r?.status)?'verify_access':'request_if_missing',source:'declared_or_imported_not_session_proof'}});
  return {now,optional,later,dependencies,filesReceived:false,instruction:'Cole o pedido e anexe estes arquivos na conversa. Marcar materiais no site não os envia nem comprova que foram inspecionados.'};
 }

 function recipe(value){
  const b=normalizeBrief(value),m=materialPlan(b),type=b.objective==='product'?'product':b.objective==='explain'||b.materials.includes('screens')?'interface':'service';
  const variants={product:{name:'Anúncio de produto',focus:'Ação do produto, atributo verificável, benefício e chamada final; preservar forma, cor, proporções, marca e rótulo.',extra:['Identificar variante e preservar o produto em camadas quando necessário.','Só demonstrar um atributo com referência ou prova disponível.']},service:{name:'Apresentação de serviço',focus:'Problema atendido, processo real, valor do serviço e próximo passo; imagens relevantes e afirmações comprovadas.',extra:['Confirmar o processo e as informações profissionais.','Não fabricar clientes, depoimentos ou resultados.']},interface:{name:'Explicação com interfaces ou gráficos',focus:'Problema, ação, estado resultante e mensagem; telas legíveis, dados conferidos e tipografia editável.',extra:['Captura autorizada ou reprodução em código conferida.','Dados demonstrativos identificados e estados coerentes entre planos.']}};
  const v=variants[type];
  return {id:type,name:v.name,status:'planned',audiovisualValidation:'not_run',providerPriority:'heygen_direct_api',route:m.route,focus:v.focus,materials:m.needed,sequence:[...sequence],roles:[
   {role:'Coordenação',responsibility:'Manter referências, decisões, versões, orçamento e próxima ação; reaproveitar respostas já fornecidas.',output:'Ficha do projeto e histórico de decisões.'},
   {role:'Pesquisa',responsibility:'Consultar fontes oficiais, conferir fatos e distinguir observado de inferido.',output:'Fontes, limitações e informações verificadas.'},
   {role:'Roteiro',responsibility:'Escrever a mensagem e medir as durações pela locução; definir o fechamento.',output:'Roteiro e plano de cenas com durações explícitas.'},
   {role:'Direção',responsibility:'Inspecionar os quatro quadros, distribuir os papéis dos estilos e apresentar moodboard e storyboard em etapas separadas para aprovação do usuário.',output:'Moodboard, storyboard completo e quadros individuais versionados.'},
   {role:'Produção',responsibility:'Verificar ferramenta, modo, inputs e custos por cena; usar originais e quadro inicial validado antes de gerar.',output:'Arquivos por plano, registro de ferramentas utilizadas, custos e desvios.'},
   {role:'Edição',responsibility:'Montar imagem, texto editável, legendas, voz, música e efeitos; conferir sincronização.',output:'Projeto editável, vídeo reproduzível e legendas.'},
   {role:'Revisão',responsibility:'Comparar aparência e identidade aos originais, assistir e escutar integralmente; registrar ajustes e solicitar aceite do arquivo exato.',output:'Comparações, relatório técnico e decisão criativa do usuário.'}
  ],outputs:['Briefing e lista de materiais.','Roteiro, fontes e plano de cenas.','Moodboard e storyboard com aprovações separadas.','Amostra representativa de 10 segundos e comparação referência → storyboard → resultado.','Após os aceites: vídeo completo, legendas, projeto editável e relatório de revisão.'],acceptance:[...v.extra,'Estado inicial → ação → resultado por plano; zoom em foto não prova ação interna.','Amostra de 10 s escolhida pela ação e passagem mais exigentes, depois dos dois aceites visuais.','Quatro travas: aparência, movimento, texto e identidade; comparação com originais e referências.','Playback e escuta reais, pendências registradas e aceite do arquivo/direção exatos.'],alternatives:['Se faltar original, concluir pesquisa e roteiro independentes e pedir apenas o material necessário.','Se a rota não preservar a direção, propor execução compatível no HeyGen para aprovação; não trocar serviço silenciosamente.','Capturas e composição em código podem reduzir clipes pagos quando atendem à cena; verificar o plano.'],limitations:[...m.limitations,'Receita planejada. Não comprova execução audiovisual; demonstrar e revisar a amostra antes de marcar como testada.','Funções são responsabilidades; registrar agentes separados somente quando realmente executados.']};
 }
 const adjustments={
  natural:{label:'Mais natural',instruction:'Reduzir movimentos artificiais e tratamento excessivo; revisar textura, física, luz e interpretação da voz. Mostrar a alteração proposta e renovar os aceites visuais afetados.',affectedStages:['moodboard','visual_storyboard','sample','technical_review','user_approval','final_video']},
  product:{label:'Produto maior',instruction:'Aumentar a presença do produto por enquadramento e escala de composição, preservando proporções e área legível de rótulo/logo. Reapresentar os enquadramentos afetados.',affectedStages:['visual_storyboard','sample','technical_review','user_approval','final_video']},
  effects:{label:'Menos efeitos',instruction:'Simplificar transições e efeitos simultâneos mantendo a ação e a mensagem do estilo. Explicar quais efeitos serão retirados e reapresentar os planos afetados.',affectedStages:['visual_storyboard','sample','technical_review','user_approval','final_video']},
  voice:{label:'Voz mais rápida',instruction:'Ajustar a interpretação e o ritmo da locução sem alterar timbre por aceleração inadequada. Medir a nova fala e revisar tempos, legendas e cortes correspondentes.',affectedStages:['visual_storyboard','sample','technical_review','user_approval','final_video']},
  text:{label:'Texto mais legível',instruction:'Ajustar tamanho, peso, contraste, margens e tempo de leitura do texto editável. Conferir acentos e legibilidade em celular com o novo arquivo.',affectedStages:['visual_storyboard','sample','technical_review','user_approval','final_video']},
  reference:{label:'Mais próximo da referência',instruction:'Comparar lado a lado paleta, luz, materiais, escala, composição e ação. Listar diferenças concretas, corrigir as viáveis e apresentar limitações antes de novas gerações.',affectedStages:['moodboard','visual_storyboard','sample','technical_review','user_approval','final_video']}
 };
 function adjustment(key){const a=Object.prototype.hasOwnProperty.call(adjustments,key)?adjustments[key]:null;return a?{...a,affectedStages:[...a.affectedStages]}:null;}
 function nextStep(value){
  const state=value&&typeof value==='object'?value:{},history=Array.isArray(state.history)?state.history:[],pre=state.preProductionApprovals||{},locks=state.approvals||{};
  const last=k=>history.filter(x=>x&&x.etapa===k).at(-1),done=k=>last(k)?.estado==='concluido';
  const hasDecision=[...Object.values(pre),...Object.values(locks)].some(d=>d&&(['approved','correction'].includes(d.status)||clean(d.correction)));
  const output=(stage,title,detail)=>{const report=last(stage);if(report?.estado==='bloqueado'){title='Precisamos resolver uma pendência antes de continuar.';detail='Há um bloqueio informado pelo agente nesta etapa. Confira a causa e as pendências registradas e peça uma alternativa compatível; o site não consulta suas ferramentas.';}else if(report?.estado==='correcao'){title='Esta etapa precisa de ajustes.';detail='Confira as correções registradas na conversa. O agente deve reapresentar a entrega e renovar os aceites afetados.';}return {stage,title,detail,source:history.length||hasDecision?'agent_reported_and_user_decisions':'site_choice'};};
  if(!done('materials_and_resources'))return output('materials_and_resources','Vamos conferir seus materiais.','Envie os originais na conversa. O agente confere o que já recebeu e indica as faltas necessárias.');
  if(!done('script'))return output('script','Agora vamos preparar o roteiro.','Os materiais foram marcados como conferidos no histórico informado. A IA deve organizar a mensagem e os planos.');
  if(pre.moodboard?.status!=='approved')return output('moodboard',pre.moodboard?.status==='correction'?'Vamos ajustar o moodboard.':'Veja e aprove o moodboard.','A IA apresenta o painel visual; o aceite é seu e precisa corresponder à versão mostrada.');
  if(pre.visual_storyboard?.status!=='approved')return output('visual_storyboard',pre.visual_storyboard?.status==='correction'?'Vamos ajustar o storyboard.':'Agora vamos preparar o storyboard.','Seu moodboard está marcado como aprovado. Confira a sequência completa e aprove os planos antes da amostra.');
  if(!done('sample'))return output('sample','Seu storyboard está aprovado. Agora vamos preparar a amostra.','A amostra de 10 segundos deve provar a ação mais difícil. O agente confirma ferramentas e custo antes de gerar.');
  if(!done('technical_review'))return output('technical_review','A amostra precisa de revisão.','O agente deve comparar os quadros, assistir e escutar o arquivo inteiro e registrar as quatro travas.');
  const approved=['appearance','movement','text','identity'].every(k=>locks[k]?.status==='approved');
  if(Object.values(locks).some(lock=>lock?.status==='correction'))return output('user_approval','Você solicitou ajustes na amostra.','Envie suas correções na conversa. A IA deve explicar as mudanças e reapresentar os arquivos e aceites afetados antes de continuar.');
  if(!approved)return output('user_approval','Veja a comparação e avalie a amostra.','Aprovar, solicitar ajuste ou voltar à etapa anterior. Um status informado pelo agente não concede seu aceite.');
  if(done('final_video'))return output('final_video','O vídeo foi marcado como entregue.','Confira o arquivo e as pendências registradas. Este site depende das informações trazidas da conversa.');
  return output('final_video','A amostra foi aprovada. Vamos produzir o vídeo completo.','A produção ainda precisa cumprir as mesmas quatro travas em todos os planos; para 60 s ou mais, aprovar blocos.');
 }
 g.AtlasGuided={handoffMaterials,normalizeBrief,recommend,advertisingOrder,materialPlan,recipe,adjustment,nextStep};
})(globalThis);
