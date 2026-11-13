# Comece aqui — sua conta, suas marcas

[Galeria GDA Vídeos](https://videos.gerenciadordeanuncios.com.br/) · [Espelho do atlas](https://video-multimarcas-estilos.andrezucatti82.chatgpt.site) · [Baixar skill](../dist/video-multimarcas.skill) · [ZIP](../dist/video-multimarcas.zip) · [Plugin](../dist/video-multimarcas-plugin.zip) · [Instalar ou atualizar](INSTALL-SKILL.md)

Este é um kit para um agente de IA produzir vídeos. A página ajuda a escolher direção e montar o pedido; não renderiza vídeos sozinha. Cada pessoa usa sua própria conta do ChatGPT, seus materiais e suas conexões. Não há acesso à conta, voz, chaves ou créditos da GDA.

## 1. Experimente sem instalar programas

Use **Criar meu vídeo** para um percurso guiado de quatro passos: Objetivo → Aparência → Materiais → Preparar produção. O site sugere três direções com uma explicação; você também pode explorar a biblioteca completa. Informe os materiais que possui e confira a execução proposta. As caixas de materiais são declarações; o envio e a inspeção dos arquivos acontecem na conversa de produção.

As três receitas iniciais são planejadas: anúncio de produto, apresentação de serviço e explicação com interfaces/gráficos. Nenhuma recebe aprovação audiovisual apenas por estar no catálogo. Veja [o modo guiado e seus limites](GUIDED-2.7.md).


1. Abra a galeria. Compare estilos e clique em **Usar este estilo**. A página tem movimento suave, paralaxe discreta e ícones; a preferência de movimento reduzido do dispositivo desativa as animações. Você pode combinar até nove direções complementares, definindo o papel de cada uma.
2. Informe o tema, a marca/site se houver, formato e tipografia. Use **Alterar**, em Tipografia, para comparar as 24 combinações, ver os arquivos reais, testar uma frase e escolher. A categoria **Avatares e apresentadores** oferece 40 direções com apresentadores fictícios; escolhê-la habilita esse apresentador no pedido. Clique em **Preparar pedido** e **Copiar pedido**.
3. Abra seu ChatGPT, entre na sua conta, cole o pedido e anexe suas fotos, logo, vídeos ou capturas. Os links dos quatro quadros acompanham o pedido; se o agente não conseguir abri-los, use os downloads da galeria e anexe os PNGs. Envie a mensagem.
4. Se a skill não estiver instalada, o pedido ainda contém as regras principais. Para contexto completo, anexe o ZIP da skill ou adicione os arquivos ao projeto compatível.
5. Peça ao agente para verificar suas ferramentas antes da produção. A primeira entrega será **roteiro, moodboard aprovado, storyboard aprovado e amostra de 10 segundos para aprovação**. O vídeo completo depende dessa aprovação.

Abrir ChatGPT não envia o pedido automaticamente. Uma conta do ChatGPT, sozinha, não garante acesso a pesquisa, síntese de voz, geração de vídeo ou execução de render. A disponibilidade varia por plano, região, superfície e conexões. Quando faltar uma capacidade, o agente deve apontar exatamente qual, concluir etapas independentes e não dizer que gerou um vídeo inexistente.

## 2. Instale o repositório para produzir e renderizar

Recomendado: Codex/ambiente de agente com acesso a arquivos, terminal e internet, ou outro agente compatível. No desktop, abra a pasta clonada. Na nuvem, conecte sua própria conta GitHub e selecione um fork seu do repositório, ou clone o repositório público no ambiente.

Instale Git, Node.js **22 ou superior**, FFmpeg e um navegador Chromium compatível com Remotion. Python 3 é necessário para o cliente HTTP direto do HeyGen; também é usado no empacotamento e na revisão. As instruções oficiais dos respectivos instaladores prevalecem sobre comandos específicos de um sistema operacional.

```bash
git clone --branch feat/guided-production-2-7 https://github.com/andrezucatti82-rgb/studio-kit-pro.git
cd studio-kit-pro
npm ci
npm run doctor
npm run check
npm test
npm run validate
```

Esta edição 2.7.0 está na branch `feat/guided-production-2-7`, ainda sem merge na main. O comando acima usa a edição revisada. Veja [produção guiada](GUIDED-2.7.md) e [controles de fidelidade da edição anterior](FIDELITY-2.6.md).

Se você baixou o ZIP dessa branch no GitHub, extraia a pasta e execute a partir de `npm ci`. Para abrir a galeria local:

```bash
npm run atlas
```

Abra o endereço local informado. O servidor só atende no computador local e não publica nada. Para o editor de vídeo, use `npm run dev`. Se Remotion precisar baixar o navegador, siga a mensagem do próprio CLI; em Linux, instale as bibliotecas de sistema indicadas na documentação do Remotion. `CHROME_PATH` pode apontar para um Chromium já instalado. O diagnóstico não instala ferramentas nem valida conexões remotas.

## 3. Ative as instruções no agente

O repositório contém `.agents/skills/video-multimarcas/SKILL.md`, suas referências e templates. Abra a pasta no agente e peça explicitamente:

> Leia AGENTS.md e a skill .agents/skills/video-multimarcas/SKILL.md. Verifique as capacidades disponíveis. Vou fornecer tema, marca e estilo. Entregue primeiro roteiro e moodboard para aprovação; após o aceite, storyboard para aprovação própria; só depois, amostra de 10 segundos.

Em superfícies que aceitam importação de skills, importe `dist/video-multimarcas.skill` ou o ZIP conforme a interface disponível. Se a superfície não oferecer importação, use a pasta no ambiente do agente ou os arquivos como instruções de projeto. **Copiar arquivos não instala um plugin na conta nem sincroniza automaticamente desktop e nuvem.** Faça a ativação em cada superfície e confira se o agente consegue ler as referências.

Não existe neste kit uma instalação universal que adicione ferramentas à conta do ChatGPT. Não renomeie esta skill para `video-b-roll`: esse identificador pertence a uma configuração pessoal distinta, que não é distribuída aqui.

## 4. Conecte as capacidades de produção na sua conta

Você não precisa instalar todos os fornecedores. Escolha pelo menos uma opção disponível por capacidade necessária ao projeto.

| Capacidade | Opções de uso | Quando precisa |
|---|---|---|
| Pesquisa | Pesquisa web do agente, Firecrawl ou fonte oficial acessível | Fatos, marca, especificações e roteiro |
| Imagens | Ferramenta de imagens do ChatGPT ou serviço de imagem conectado | Storyboard e assets sintéticos |
| B-roll e vídeo | HeyGen pela API HTTP direta como prioridade; seus vídeos licenciados quando previstos pelo plano | Ação que não será produzida em código |
| Voz | Áudio enviado com autorização ou serviço de voz disponível na sua conta | Narração; não há voz pessoal distribuída |
| Motion e montagem | Node + Remotion + Chromium + FFmpeg deste kit | Render local/nuvem e composição editável |
| Revisão | Player com reprodução contínua e escuta, inspeção técnica e revisão humana | Aprovar fidelidade, voz, movimento e acabamento |
| Distribuição | Seu armazenamento e, opcionalmente, Metricool | Só quando você pedir entrega nesse destino ou publicação |

No ChatGPT, conecte os aplicativos necessários usando as opções de apps/conectores disponíveis à sua conta. Faça login em **suas** contas dos provedores. Nomes e disponibilidade podem mudar. O agente deve descobrir ferramentas efetivamente expostas; um plugin instalado em outra superfície não prova conexão na sessão atual.

Se usar APIs diretas, guarde suas chaves em segredos do ambiente ou variáveis locais fora do Git. Nunca cole chaves no prompt público, HTML, preset ou commit. Créditos, assinaturas e licenças de cada provedor são seus e devem ser verificados antes de chamadas pagas. A assinatura do ChatGPT não inclui automaticamente créditos de APIs externas ou da API OpenAI.

O fluxo confere materiais e recursos antes de roteiro, moodboard, storyboard e amostra. A ficha de cada estilo mostra requisitos e maturidade; a imagem do catálogo não certifica execução. Para retomar etapas e controlar tentativas, veja [Automação](AUTOMATION.md).

## 5. Faça o primeiro projeto

```bash
npm run new -- --topic "Como funciona meu produto" --brand "Minha marca" --slug meu-primeiro-video
```

O comando cria briefing, plano e revisão vazios; **não** pesquisa nem gera vídeo sozinho. Cole o pedido da galeria no agente, anexe os materiais e indique `projects/meu-primeiro-video/`. Ele deve pesquisar, preparar assets autorizados, medir a locução e implementar o plano de cenas.

Depois que existir um `project.json` completo com os assets reais:

```bash
npm run render -- --project projects/meu-primeiro-video/project.json
```

`templates/project.json` é somente um rascunho técnico. Não é exemplo de acabamento aprovado. Há instruções de direção, pesquisa e revisão nas referências da skill; o motor não escolhe efeitos avançados sozinho.

## 6. Aprovação e fidelidade

Revise os 10 segundos com som: legibilidade no celular, movimento, narração, música, SFX e fidelidade aos originais. Produtos: preservar cor, forma, material, logotipo e rótulo. Imóveis: preservar planta, medidas, vista e entorno. Software: preservar tela, funções e estados. Sem referência suficiente, não inventar ângulos, detalhes, resultados ou dados.

Se houver correções, refaça a prévia. Só então autorize o vídeo completo. Publicação em redes sociais é uma ação separada. Um MP4 válido não certifica qualidade; sem playback/escuta, a revisão permanece pendente.

## 7. Integração opcional com uma Page sua

A Page criada pelo mantenedor não é necessária e não concede acesso a outras contas. No seu ChatGPT, quando Pages e visualizações interativas estiverem disponíveis, peça ao agente para criar uma Page pessoal usando [PAGE-TEMPLATE.md](PAGE-TEMPLATE.md). O agente deve inserir a galeria HTML, salvar o estado com a API suportada e criar o botão nativo de chat. Sem essas ferramentas, o fluxo de copiar e enviar pedido funciona normalmente.

## 8. Atualizações, personalização e hospedagem

Use `git pull` quando sua árvore de trabalho estiver preservada e resolva conflitos sem apagar projetos. Reimporte o pacote nas superfícies que não atualizam skills automaticamente. Seus projetos ficam em `projects/`, ignorado pelo Git por padrão.

A GDA é a identidade da galeria hospedada. O vídeo é adaptado à marca do briefing; nenhum preset deve herdar GDA automaticamente. Para hospedar uma cópia com sua marca, troque logo/textos/variáveis CSS em `style-atlas/dist/`, confira as licenças e publique apenas essa pasta em uma hospedagem estática. Não publique backups, chaves ou projetos de clientes. Veja [HOSTING.md](HOSTING.md).

## Problemas frequentes

- **“Não consigo gerar MP4 no chat.”** Use um ambiente de agente com terminal/render e conecte as capacidades de mídia. Não confunda ChatGPT de conversa com ambiente de execução.
- **“O HTML não carrega os estilos.”** Use `npm run atlas`; abrir como `file://` pode impedir o carregamento do JSON.
- **“O estilo virou uma sequência de fotos.”** Exija ação interna, plano mais exigente e transição demonstrados na amostra; não aceite apenas render técnico.
- **“O produto mudou.”** Rejeite o plano e use o original protegido, captação real ou modelo validado. Mais efeitos não compensam perda de fidelidade.
- **“Instalei, mas o serviço pede créditos.”** A licença do repositório não inclui contas, franquias ou licenças dos provedores. Remotion também tem condições próprias.

## Novas direções da edição 3.1

Na galeria, explore o menu de categorias. Há 780 presets em 28 categorias: 18 famílias de 40 e dez segmentos de anúncios com seis direções cada. A ficha mostra diferenças, recursos, áudio e referências; esses dados acompanham o pedido e o JSON exportado. Atualize o repositório com `git pull` e reimporte o pacote da skill na superfície que exigir instalação própria. Atualizar GitHub ou o site não atualiza automaticamente plugins já importados em outras contas. Consulte [a pesquisa](../style-atlas/records/RESEARCH.md).

## Materiais e solução de bloqueios

Clique em **Ver materiais necessários para este vídeo** no briefing. A lista adapta-se aos estilos e explica o que fornecer, quando é necessário e o que pode substituí-lo. Ela não faz upload: anexe os arquivos na conversa do ChatGPT. Ao colar o pedido, o agente deve conferir o contexto, abrir perguntas textuais quando a ferramenta existir e pedir somente as faltas relevantes.

Se não conseguir gerar, o agente deve explicar a etapa bloqueada, o motivo confirmado (ou desconhecido), o que já está pronto, como resolver e a alternativa. Gerador não conectado, falta de renderização, permissões, arquivo ausente e limite confirmado são situações diferentes. Nem todo estilo exige gerador IA; motion em código pode ser suficiente se houver renderizador. O site não consulta suas conexões ou créditos. [Guia completo](../.agents/skills/video-multimarcas/references/intake-and-diagnostics.md).

## Naturalidade e acabamento em todos os estilos

Os pedidos e presets incluem avaliação obrigatória de imagens IA, clipes IA e tratamento/edição final, com correção e nova revisão. A regra vale também para estilos anteriores e para a amostra de 10 segundos: fidelidade aos originais, continuidade, composição e áudio natural. Linguagens ilustradas mantêm seu estilo. Estudos estáticos não certificam vídeo pronto; sem playback e escuta reais, a revisão permanece pendente. Veja [o protocolo](../.agents/skills/video-multimarcas/references/natural-finish.md).

## Pessoas e preservação de identidade

Regra global para todos os estilos: originais como referência principal, sem alterações físicas não solicitadas, planos compatíveis com as vistas disponíveis e teste curto de rosto/corpo em movimento antes do vídeo completo. Falhas perceptíveis bloqueiam avanço; limitações da ferramenta devem ser explicadas antes de consumir créditos. O kit exige registro, mas não faz reconhecimento facial automático. Veja [protocolo e evidências](../.agents/skills/video-multimarcas/references/identity-preservation.md).

## Infoprodutores: formato não é uma estética única

Na revisão 3.2, os 30 formatos separam necessidade e linguagem. Identifique primeiro venda/aquisição, demonstração/ensino ou experiência do aluno. Depois escolha execução: filme de lançamento, multicâmera, POV, UGC, podcast, documentário, aftermovie, screencast, motion tipográfico ou editorial. Não transformar todos os formatos em ilustrações, caixinhas, cadernos e metáforas de objetos. Variar câmera, composição, contraste, paleta, ritmo e áudio de acordo com a função. O mesmo nicho comporta estilos diferentes.

O atlas contém 18 novos estudos fotográficos fictícios e 12 layouts/UI demonstrativos individuais para esta categoria. São referências de aparência, não vídeos, capturas reais, alunos ou prova de resultado. Para filmagens, falas, trabalhos, depoimentos e interfaces reais, pedir os originais autorizados; preservar identidade e informações. Não produzir avatar por inferência. Toda promessa visual precisa aparecer na prévia de 10 segundos. Recursos devem servir à decisão ou aprendizagem; composição chamativa não substitui clareza e execução. IDs das 30 opções foram mantidos, as direções e imagens foram revisadas.

## Motion Design de Campanha · edição 4.0

30 direções para anúncios, explicações, lançamentos e marca, com 12 estudos fotográficos IA fictícios, dez composições gráficas e oito cenas 3D originais. Escolher pelo objetivo, não pela quantidade de efeitos: ler necessidade, ação, materiais, distinção e áudio de cada preset. Naquela edição, o acervo passou a 540 direções em 18 categorias, mantendo os 510 IDs anteriores. A edição atual tem 780 estilos em 28 categorias.

Há três prévias audiovisuais de dez segundos: **Frase que reorganiza o quadro**, **Peça única em palco de íris** e **Janela óptica sobre fotografia**. São estudos para aprovação, não exemplos de vídeos finais aprovados. A lente amplia a mesma fotografia, sem inventar vistas; o frasco 3D é fictício. A fonte da animação, o mix e a proveniência acompanham o repositório em `style-atlas/records/motion-campaign/`. Veja as amostras em https://videos.gerenciadordeanuncios.com.br/motion-campaign.html .

Definir estado inicial → ação → resultado; planejar uma transição motivada, pausas de leitura, locução natural, trilha e SFX ligados à ação. Cena 3D, rotação, tracking, transparência técnica e reflexos exigem material e execução compatíveis. Não chamar zoom sobre uma foto de voo, tour ou novo ângulo. Não transformar referência estática em garantia de movimento. Preservar produto, pessoa, imóvel e interface conforme os protocolos globais; não alterar a identidade para facilitar um efeito.

Verificar quadros de início, meio, fim e transições, além de reprodução integral com escuta. Registrar separadamente o que foi observado, medido e ainda depende de revisão. `review_pending` continua pendente até aprovação; renderização, metadados e medição de áudio não certificam acabamento. Pedir somente os materiais pertinentes ao estilo e explicar ferramenta ausente, limite de fidelidade ou cota antes de consumir créditos. Trocar de ferramenta não autoriza clonar voz nem reutilizar identidade de outro projeto.



## Ajustar e retomar

Use intenções simples como “Mais natural”, “Produto maior”, “Menos efeitos”, “Voz mais rápida”, “Texto mais legível” e “Mais próximo da referência”. O agente explica a alteração, preserva versões e reapresenta os aceites afetados. Não há autorização automática para gerar ao selecionar um ajuste.

Ao baixar/reimportar o pacote do projeto, confira briefing, estilos, referências, materiais, decisões e próxima ação. Referências por URL não são originais enviados no chat; anexe novamente o que não estiver disponível na nova conversa. O site só sabe o que foi salvo/importado. O agente retoma a primeira dependência pendente e aproveita os aceites comprovados da mesma versão.
