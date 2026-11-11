"""Separate generated 2x2 boards geometrically; no creative image alterations.
Usage: python build.py /absolute/path/to/jobs-and-generation-records
Raw generated sources stay in place. Crop rectangles and hashes are recorded.
"""
import hashlib, json, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
SOURCE = Path(sys.argv[1])
DEST = ROOT / 'style-atlas/dist'
OUT = DEST / 'assets/film-sequences'
OUT.mkdir(parents=True, exist_ok=True)

# Four chronological, scene-specific actions. The second also serves as the hero.
A = {
'cinema-1': ['A xícara vazia recebe a luz da máquina.', 'O café cai e a crema começa a se formar.', 'A xícara pronta chega ao pires; o vapor revela a luz.', 'O plano abre para a pausa e a assinatura.'],
'cinema-2': ['O arranjo aparece parcialmente escondido na sombra.', 'A bandeira de luz atravessa as pétalas.', 'O deslocamento revela a textura e o contorno do vaso.', 'O conjunto fica iluminado para a mensagem final.'],
'grafico-1': ['Peças de cerâmica aguardam sobre a mesa.', 'Os segmentos se aproximam e começam a formar letras.', 'As letras se encaixam, mantendo espessura e material.', 'A palavra completa vira a assinatura da campanha.'],
'grafico-2': ['Placas translúcidas aparecem separadas.', 'Uma placa desliza diante da outra, criando sobreposições.', 'O alinhamento das camadas revela a palavra.', 'O conjunto se estabiliza com leitura clara.'],
'ilustracao-1': ['Uma linha começa a desenhar a ideia.', 'O traço contínuo transforma o emaranhado em uma chave.', 'A linha da chave se transforma no contorno de uma porta.', 'A porta aberta revela um caminho para a mensagem final.'],
'ilustracao-2': ['A rua molhada surge em manchas de tinta.', 'Uma figura atravessa reflexos e luzes.', 'Novas marcas revelam o encontro sob o guarda-chuva.', 'A rua se afasta, preservando a textura da impressão.'],
'materiais-1': ['Uma folha recortada anuncia a paisagem.', 'As camadas se afastam para revelar profundidade.', 'O caminho atravessa a floresta de papel.', 'A paisagem se organiza ao redor da mensagem.'],
'materiais-2': ['Fragmentos cerâmicos aparecem separados.', 'As peças avançam para a malha do mosaico.', 'O encaixe revela desenho, juntas e relevos.', 'A composição completa encerra a sequência.'],
'tecnologia-1': ['A solicitação aparece como pendente na interface.', 'O detalhe abre e destaca o que precisa ser revisado.', 'A confirmação muda o estado da solicitação.', 'O painel mostra a conclusão e seu registro.'],
'tecnologia-2': ['Uma entrada de orçamento apresenta o total demonstrativo.', 'O fluxo se divide entre duas destinações.', 'O foco percorre um ramo e revela seu valor.', 'A visão geral reúne origem, destinos e total.'],
'motion-1': ['Uma palavra ocupa o primeiro plano.', 'As letras mudam de posição e criam uma passagem.', 'A composição reorganiza a hierarquia da mensagem.', 'O título final assenta e ganha tempo de leitura.'],
'motion-2': ['Uma fita coral inicia uma curva.', 'A fita muda de forma sem perder continuidade.', 'A transformação cria um novo símbolo.', 'O símbolo se resolve em uma assinatura estável.'],
'volume-1': ['O fone aparece como silhueta em um estúdio escuro.', 'A luz revela almofadas, metal e articulações.', 'O arco se move e revela a relação entre as peças.', 'O produto se apresenta inteiro em seu enquadramento final.'],
'volume-2': ['Blocos de tarefas aguardam fora de ordem.', 'Um bloco se desloca para sua posição.', 'Os demais se encaixam em uma estrutura organizada.', 'A composição estabiliza com a tarefa concluída.'],
'hibridos-1': ['Um pedido e sua embalagem apresentam a dúvida.', 'O documento destaca o item que deveria ter sido enviado.', 'A caixa aberta revela o item recebido para comparação.', 'O diagrama aponta a divergência no processo.'],
'hibridos-2': ['Uma solicitação entra em um sistema representado por peças.', 'O agente encaminha a tarefa para uma ferramenta.', 'O retorno é comparado com o objetivo inicial.', 'O resultado aprovado sai do percurso.'],
'anuncios-1': ['O frasco surge entre reflexos e sombras.', 'Uma mudança de luz revela vidro e acabamento.', 'O detalhe aproxima a relação entre tampa e frasco.', 'O produto inteiro se apresenta com espaço para a marca.'],
'anuncios-2': ['A bolsa aparece em um palco de campanha.', 'O ponto de vista muda para revelar a lateral.', 'A vista traseira revela a construção e a textura da bolsa.', 'O enquadramento abre para a apresentação final.'],
'campanhas-1': ['O croissant inteiro desperta a expectativa.', 'As mãos abrem a massa e revelam suas camadas.', 'O mel escorre sobre a superfície recém-aberta.', 'A composição final reúne produto, bebida e mensagem.'],
'campanhas-2': ['A mochila apresenta a área que precisa de reparo.', 'A costura começa a recuperar o material.', 'O detalhe mostra a peça reparada.', 'A mochila volta ao uso no ambiente externo.'],
'imoveis-1': ['Um mapa fictício localiza a região.', 'A aproximação chega ao lote indicado.', 'A fachada assume o quadro e situa a entrada.', 'A entrada conduz à apresentação do imóvel.'],
'imoveis-2': ['O ambiente completo apresenta sua composição.', 'Um destaque aponta os elementos da entrega demonstrativa.', 'O detalhe mostra um acabamento incluído.', 'O ambiente retorna com a distinção visual dos itens.'],
'software-1': ['Um registro apresenta a alteração a investigar.', 'O evento selecionado abre seus detalhes e horário.', 'A comparação revela o título antes e depois da edição.', 'A trilha organiza a sequência de alterações.'],
'software-2': ['A tabela de origem apresenta os dados demonstrativos.', 'O comando de exportação é acionado.', 'O arquivo chega ao destino com as mesmas linhas.', 'A comparação fecha a sequência de conferência.'],
'apresentacoes-1': ['O título abre a apresentação em um cenário editorial.', 'As camadas se separam e revelam a ideia central.', 'O enquadramento conecta a ideia aos seus argumentos.', 'A conclusão reúne a mensagem em uma hierarquia simples.'],
'apresentacoes-2': ['Uma frase curta estabelece o manifesto.', 'A tipografia cresce e muda a escala da composição.', 'Uma nova palavra assume o foco sem perder legibilidade.', 'O manifesto se encerra com uma frase estável.'],
'avatares-1': ['A apresentadora fictícia estabelece contato com a câmera.', 'Um gesto discreto introduz o assunto.', 'O enquadramento aproxima a explicação principal.', 'A apresentadora encerra olhando para a câmera.'],
'avatares-2': ['O apresentador fictício introduz o tema em seu escritório.', 'Um gesto natural acompanha a explicação.', 'O plano muda de escala mantendo identidade e ambiente.', 'O apresentador encerra com contato visual.'],
'saude-1': ['A conversa começa com as opções sobre a mesa.', 'Um cartão apresenta uma alternativa de forma compreensível.', 'As opções são comparadas sem promessas de resultado.', 'A escolha é discutida com espaço para dúvidas.'],
'saude-2': ['A profissional apresenta o exame usando um brinquedo.', 'O procedimento é ensaiado no ursinho.', 'O estetoscópio encosta no ursinho para demonstrar a próxima ação.', 'A conversa termina com acolhimento e sem pressão.'],
'ecommerce-1': ['A peça e o espaço disponível aparecem juntos.', 'Um gabarito demonstra o encaixe necessário.', 'O detalhe permite conferir a compatibilidade.', 'A peça instalada encerra a demonstração fictícia.'],
'ecommerce-2': ['A caixa fechada apresenta o produto.', 'A embalagem abre e revela a organização interna.', 'Cada componente é disposto para conferência.', 'O conjunto completo confirma o conteúdo demonstrativo.'],
'infoprodutores-1': ['A professora apresenta a tarefa e o material.', 'O detalhe acompanha a primeira ação com a argila.', 'Outro enquadramento esclarece o gesto e seu efeito.', 'A peça demonstra o resultado daquela etapa da aula.'],
'infoprodutores-2': ['O fotógrafo encontra o desafio no local de trabalho.', 'O ajuste de luz aplica o conteúdo ensinado.', 'O detalhe mostra a decisão sendo executada.', 'O resultado é conferido no próprio ambiente de trabalho.'],
'motion-campanha-1': ['Um palco metálico fechado cria expectativa.', 'As lâminas articuladas da íris abrem e revelam o produto.', 'Um plano próximo acompanha luz, encaixes e materiais.', 'O palco se estabiliza e valoriza o produto inteiro.'],
'motion-campanha-2': ['Um calendário cenográfico apresenta a contagem.', 'Uma página de papel grosso gira em seu eixo e revela a próxima etapa.', 'A próxima página avança a mensagem de lançamento.', 'A última página anuncia a chegada e a assinatura da marca.'],
}
SOUND = {
'cinema':'Voz próxima + trilha cinematográfica discreta + foley do produto.',
'grafico':'Voz editorial + pulso musical + encaixes e atrito dos materiais.',
'ilustracao':'Voz narrativa + trilha orgânica + traço, papel e ambiência.',
'materiais':'Voz calma + música tátil + recortes, deslizamentos e encaixes.',
'tecnologia':'Voz explicativa + trilha discreta + sons curtos de estado e confirmação.',
'motion':'Voz rítmica + música sincronizada + transições pontuais.',
'volume':'Voz de campanha + trilha espacial + foley coerente com os materiais.',
'hibridos':'Voz explicativa + pulso investigativo + sons de documentos e mecanismos.',
'anuncios':'Voz de campanha + música elegante + detalhes sonoros do produto.',
'campanhas':'Voz próxima + trilha discreta + foley do alimento ou reparo.',
'imoveis':'Voz de apresentação + trilha acolhedora + ambiência dos espaços.',
'software':'Voz objetiva + trilha sutil + confirmações discretas da interface.',
'apresentacoes':'Voz clara + trilha com respiros + acentos sincronizados à mensagem.',
'avatares':'Voz natural + música baixa + ambiência coerente com o local.',
'saude':'Voz acolhedora + trilha leve + ambiência sem efeitos alarmistas.',
'ecommerce':'Voz demonstrativa + música leve + foley de encaixe e embalagem.',
'infoprodutores':'Voz didática + trilha baixa + sons reais da demonstração.',
'motion-campanha':'Voz de lançamento + trilha cinematográfica + foley mecânico e impactos controlados.',
}

jobs=json.loads((SOURCE/'jobs.json').read_text())
examples=[]; records=[]; families=[]
for j in jobs:
    generation=json.loads((SOURCE/(j['key']+'.json')).read_text())
    path=Path(generation['path']); im=Image.open(path).convert('RGB'); w,h=im.size
    assert abs(w/h-9/16)<.015, (j['key'],im.size)
    rects=[(0,0,w//2,h//2),(w//2,0,w,h//2),(0,h//2,w//2,h),(w//2,h//2,w,h)]
    frames=[]; crops=[]
    for i,rect in enumerate(rects):
        output=OUT/f"{j['key']}-{i+1:02d}.webp"
        frame=im.crop(rect); frame.save(output,'WEBP',quality=94,method=6)
        label=['Abertura','Desenvolvimento','Transformação','Fechamento'][i]
        frames.append(dict(src=str(output.relative_to(DEST)),width=frame.width,height=frame.height,label=label,alt=f"{j['name']} — {label.lower()}. {A[j['key']][i]}",action=A[j['key']][i]))
        crops.append(dict(src=str(output.relative_to(DEST)),rect=list(rect),sha256=hashlib.sha256(output.read_bytes()).hexdigest()))
    prompt=f"ESTILO: {j['name']}. EXEMPLO FICTÍCIO: {j['theme']}.\nDireção de base: {j['signature']}\nMovimento planejado: {j['motion']}.\n"+'\n'.join(f"PLANO {i+1}: {a}" for i,a in enumerate(A[j['key']]))
    prompt+='\nRECURSOS: '+', '.join(j['resources'])+'.'
    prompt+='\nEXECUÇÃO: definir por plano estado inicial → ação → resultado; construir luz, profundidade e oclusão coerentes, com aceleração suave. Conectar os planos pela ação e pela locução, sem dividir o tempo igualmente. Zoom em fotografia não substitui a ação descrita. Compor todos os letreiros em código editável. Os quadros são conceitos, não prova de movimento ou de fidelidade. Não usar colagem como única referência de identidade: comparar quadros individuais com os originais do cliente. Gerar moodboard e storyboard para aceites separados, depois amostra de 10 s do trecho mais exigente. Validar aparência, movimento, texto e identidade com aprovação do usuário antes de concluir o vídeo.'
    if j['family'] in ['tecnologia','software']:
        prompt+='\nINTERFACE: usar captura autorizada ou reconstrução demonstrativa com componentes em código, tipografia nítida, grid consistente, estados e dados coerentes. Não animar números gerados na imagem como se fossem dados reais; validar valores, relações e sequência de ações.'
    if j['family']=='motion-campanha':
        prompt+='\nCENOGRAFIA: modelar espessura, pivôs e folgas das peças; luz principal, preenchimento e recorte com sombras de contato; separar primeiro plano, mecanismo e fundo. Provar abertura/fechamento sem interpenetração e conferir a transição inteira em movimento. Se a ferramenta não executar o mecanismo com estabilidade, informar a limitação e propor uma execução antes de gerar.'
    examples.append({k:j[k] for k in ['key','styleId','name','family','familyName','theme']}|dict(frames=frames,audio=SOUND[j['family']],productionPrompt=prompt))
    records.append(dict(key=j['key'],styleId=j['styleId'],generator='OpenAI image_gen',prompt=j['prompt'],sourceFile=path.name,revisionSource=j.get('revisionSource'),sourceSize=[w,h],sourceSHA256=hashlib.sha256(path.read_bytes()).hexdigest(),crops=crops,motionValidated=False,videoProductionApproved=False,conceptApproval="approved_by_user_2026-11-11"))
    if not any(f['id']==j['family'] for f in families):families.append(dict(id=j['family'],name=j['familyName']))
assert len(examples)==36 and len(families)==18
(DEST/'sequence-pilot.json').write_text(json.dumps(dict(version='sequence-pilot-1',families=families,examples=examples),ensure_ascii=False,indent=2)+'\n')
(Path(__file__).parent/'assets.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
print(f'{len(examples)} sequences / {len(examples)*4} frames; sources preserved')
