# Atlas visual — Vídeo Multimarcas

Página simples em HTML, CSS e JavaScript. Não exige framework, login próprio, banco de dados ou chave de API. Contém 540 direções, técnicas e formatos em 18 famílias; não pretende esgotar todos os estilos existentes.

Cada ficha inclui imagem ilustrativa, usos, recursos, movimento sugerido e preset. O usuário escolhe até duas direções, informa tema e marca opcional. A primeira entrega definida é roteiro, storyboard visual e vídeo de 10 segundos, sujeito à aprovação antes de produzir o vídeo completo.

## Executar

Sirva `dist/` por HTTP. Exemplo: `python -m http.server 8765 --directory dist`. A página carrega `catalog.json`; abrir o HTML diretamente como `file://` pode bloquear esse carregamento.

## Integração

No site público, o botão prepara e copia um pedido completo. Abrir o ChatGPT não envia a mensagem automaticamente. Nenhuma API secreta é colocada no navegador.

Uma edição em Page do ChatGPT usa `window.openai.setWidgetState` para salvar seleção e briefing. O botão nativo de um bloco `codex-prompt` inicia um novo chat da Page; ele deve ler o estado salvo antes de produzir. Não há alegação de envio automático de um site externo à conversa atual.

## Privacidade

O site público guarda favoritos e briefing apenas no localStorage do navegador. O usuário decide copiar o pedido ou baixar o JSON. Na edição em Page, o estado é salvo na Page e pode ser visto por quem tem acesso a ela. Nunca publicar exemplos de clientes ou dados pessoais junto do catálogo.

## Assets

O acervo inclui estudos visuais gerados por IA e estudos de dados, interfaces e tipografia construídos em HTML/CSS/SVG. A revisão 3.2 substitui as três pranchas de infoprodutores por 30 imagens individuais: 18 fotografias fictícias e 12 estudos editoriais/UI; as pranchas anteriores ficam apenas no histórico de arquivos. Não são capturas reais, depoimentos, produtos de marcas existentes ou provas de técnicas de animação. Interface em Geist; seletor com 24 combinações e arquivos reais, documentados em `dist/fonts.json`. As pranchas PNG originais ficam fora do pacote público; WebP é apenas uma conversão de formato para carregamento mais leve. Créditos e proveniência em `records/assets.json`.

## Manutenção

`records/build_catalog.py` gera `dist/catalog.json`. Preservar IDs ao editar presets para não quebrar escolhas salvas. `records/build_page.py` gera a edição HTML autocontida para o embed de Page, usando os mesmos dados e interface. Não alterar a skill pessoal Video B-roll.

## Publicidade de produto

60 direções de publicidade incluem narração, música, SFX e requisitos de fidelidade. Imagens são exemplos fictícios. Fotos reais e rótulos devem ser preservados; 360 graus exige referências multivista ou modelo validado. Não inventar atributos, geometria oculta ou resultados.

Para reconstruir: `python records/build_catalog.py`. O gerador de Page exige `beautifulsoup4`, `fonttools` e `brotli`; a página pública não tem dependências de execução.

## Imóveis

30 direções imobiliárias cobrem mapa, drone, fachada, interiores, acabamentos, planta, staging e apresentação com corretor. Preservar arquitetura e entorno; não inferir vistas ocultas de fotos. Mapa exige fonte/licença e coordenadas confirmadas. Avatar exige consentimento; caminhada integrada exige vídeo/tour ou reconstrução validada.

## Softwares

30 direções para anúncios, analytics, e-commerce, CRM, chat, automação e dashboards. As amostras são interfaces demonstrativas em código, não screenshots oficiais. Produção de tutorial real exige captura atual autorizada ou reprodução conferida com a plataforma; não inventar recursos, botões ou resultados.

## Apresentações

30 direções de motion e mensagem. O briefing permite escolher 24 combinações tipográficas com arquivos reais, amostra editável e licenças incluídas ou seguir o estilo. Confirmar fonte/licença; texto final editável e legível. Câmera, bokeh, transparência e time remap devem servir à hierarquia e à voz, com pausas de leitura.

## Avatares e apresentadores

30 apresentadores fictícios adultos: 20 em ambientes cotidianos e dez novas direções experimentais, com roupas casuais, despojadas e profissionais. A escolha habilita o avatar somente naquele projeto. Aparência, voz, olhar à câmera, anatomia e sincronia labial devem ser aprovados na prévia de 10 segundos. As amostras são retratos estáticos, não demonstrações de fala ou caminhada.

## Identidade e fontes

Interface GDA: fundo creme claro, azul, tipografia Geist e ícones SVG originais; a identidade dos vídeos segue a marca do usuário. Substitua logo e identidade da GDA ao hospedar sua própria versão. `dist/fonts.json` registra os 24 pares tipográficos, arquivos reais e procedência; licenças em `dist/assets/fonts/`.

## Movimento e acessibilidade

Imagens do topo flutuam suavemente e respondem ao mouse com paralaxe limitada. Cartões entram ao rolar; botões e diálogos têm transições breves. Textos de leitura ficam estáveis. A preferência `prefers-reduced-motion` desativa as animações e o movimento por ponteiro.

## Edição 3.0 · pesquisa e experimentação

140 novas direções (dez por categoria), filtro Novos, distinção em relação ao repertório anterior, referências de método e prova criativa. Consulte [a pesquisa](records/RESEARCH.md). `dist/research.json` contém fontes curadas; `records/bold_styles.py` gera os novos presets e `records/build_bold_interfaces.py` renderiza os 20 estudos em código. Os 280 IDs anteriores permanecem estáveis.

## Coleta guiada e diagnóstico

O briefing mostra um diálogo de materiais condicionado às direções escolhidas. O prompt e JSON incluem `intake` com finalidade, condições e alternativas, além dos recursos de produção. No ChatGPT, perguntas nativas são usadas somente quando disponíveis e para texto; arquivos devem ser anexados no chat. Diagnóstico deve informar causa comprovada, etapa, entregas e solução. O site não detecta contas, conexões ou créditos e não gera mídia sozinho.

## Três categorias por necessidade

Mais 90 direções para saúde/estética/odontologia, e-commerce/marketplaces e infoprodutores. `records/niche_styles.py` mantém necessidades, comparações e regras específicas. Total atual: **540 direções, 18 categorias, 30 por categoria**. O filtro **Novos · 260** reúne as duas expansões desta atualização.

## Naturalidade e acabamento em todos os estilos

Os pedidos e presets incluem avaliação obrigatória de imagens IA, clipes IA e tratamento/edição final, com correção e nova revisão. A regra vale também para estilos anteriores e para a amostra de 10 segundos: fidelidade aos originais, continuidade, composição e áudio natural. Linguagens ilustradas mantêm seu estilo. Estudos estáticos não certificam vídeo pronto; sem playback e escuta reais, a revisão permanece pendente. Veja [o protocolo](https://github.com/andrezucatti82-rgb/broll-studio-kit/blob/main/.agents/skills/video-multimarcas/references/natural-finish.md).

## Pessoas e preservação de identidade

Regra global para todos os estilos: originais como referência principal, sem alterações físicas não solicitadas, planos compatíveis com as vistas disponíveis e teste curto de rosto/corpo em movimento antes do vídeo completo. Falhas perceptíveis bloqueiam avanço; limitações da ferramenta devem ser explicadas antes de consumir créditos. O kit exige registro, mas não faz reconhecimento facial automático. Veja [protocolo e evidências](https://github.com/andrezucatti82-rgb/broll-studio-kit/blob/main/.agents/skills/video-multimarcas/references/identity-preservation.md).

## Infoprodutores: revisão 3.2

As 30 opções agora separam necessidade e execução: trailers, UGC, podcast, multicâmera, POV, documentário, aftermovie, editorial, tipografia e interfaces. São 18 estudos fotográficos fictícios e 12 layouts/UI demonstrativos em arquivos individuais grandes. Os identificadores foram preservados; as outras 480 direções não mudaram. Fontes e limites estão em `records/RESEARCH.md`. Reconstruir dados com `records/build_catalog.py`; os layouts em código com `records/build_infopro_samples.py`. Assets IA aprovados são versionados, não regenerados pelo build.

## Motion Design de Campanha · edição 4.0

30 direções para anúncios, explicações, lançamentos e marca, com 12 estudos fotográficos IA fictícios, dez composições gráficas e oito cenas 3D originais. Escolher pelo objetivo, não pela quantidade de efeitos: ler necessidade, ação, materiais, distinção e áudio de cada preset. O acervo passa a 540 direções em 18 categorias, mantendo os 510 IDs anteriores.

Há três prévias audiovisuais de dez segundos: **Frase que reorganiza o quadro**, **Peça única em palco de íris** e **Janela óptica sobre fotografia**. São estudos para aprovação, não exemplos de vídeos finais aprovados. A lente amplia a mesma fotografia, sem inventar vistas; o frasco 3D é fictício. A fonte da animação, o mix e a proveniência acompanham o repositório em `style-atlas/records/motion-campaign/`. Veja as amostras em https://videos.gerenciadordeanuncios.com.br/motion-campaign.html .

Definir estado inicial → ação → resultado; planejar uma transição motivada, pausas de leitura, locução natural, trilha e SFX ligados à ação. Cena 3D, rotação, tracking, transparência técnica e reflexos exigem material e execução compatíveis. Não chamar zoom sobre uma foto de voo, tour ou novo ângulo. Não transformar referência estática em garantia de movimento. Preservar produto, pessoa, imóvel e interface conforme os protocolos globais; não alterar a identidade para facilitar um efeito.

Verificar quadros de início, meio, fim e transições, além de reprodução integral com escuta. Registrar separadamente o que foi observado, medido e ainda depende de revisão. `review_pending` continua pendente até aprovação; renderização, metadados e medição de áudio não certificam acabamento. Pedir somente os materiais pertinentes ao estilo e explicar ferramenta ausente, limite de fidelidade ou cota antes de consumir créditos. Trocar de ferramenta não autoriza clonar voz nem reutilizar identidade de outro projeto.
