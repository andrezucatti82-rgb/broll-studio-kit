# Anúncios narrados por segmento · catálogo 4.3

O atlas passa de 720 para 780 estilos. Os estilos anteriores, seus IDs, imagens e ordem foram preservados. Há um novo grupo de navegação, **Anúncios por segmento**, com dez categorias de seis estilos: joias artesanais, capachos de fibra de coco, escritórios de advocacia, roupas masculinas, roupas femininas, biquínis, pijamas, alimentos orgânicos, barras proteicas e cereal.

Cada estilo apresenta quatro momentos conceituais, recursos, ação, argumento, chamada final e plano de execução. As seis direções piloto foram aprovadas pelo usuário em 12/11/2026; essa aprovação é visual e não aprova vídeos, áudio, fidelidade a produtos reais ou todas as novas imagens individualmente.

## Usar

1. Abra **Anúncios por segmento** na lateral ou no menu móvel e escolha uma categoria.
2. Abra uma direção para ver os quatro quadros e sua estrutura narrativa.
3. Escolha o estilo, informe tema e marca e selecione a duração. Há agora uma opção direta de **45 segundos**, além das existentes.
4. Prepare o pedido. O contrato inclui `advertising`: DBO (Dor, Benefício, Objeção e CTA) ou AIDA (Atenção, Interesse, Desejo e Ação), faixa sugerida de 30–45 s, narração em português, legendas sincronizadas editáveis e CTA no encerramento.
5. Anexe os originais necessários no chat. Aprovar roteiro, moodboard, storyboard e depois a amostra representativa de 10 s continua fazendo parte da produção. A duração escolhida pelo usuário prevalece sobre a recomendação do estilo.

Não há geração de vídeos no site, contas compartilhadas ou áudio nas fotografias. Os seis vídeos históricos continuam sendo amostras pendentes. Cada pessoa utiliza suas próprias ferramentas, contas e créditos.

## Implementação e rastreabilidade

- `style-atlas/records/natural-ads-60/concepts.json`: 60 conceitos e prompts de origem.
- `assets.json`: arquivos, dimensões, retângulos de extração e hashes dos 240 quadros.
- `previous-ids.json`: ordem dos 720 IDs anteriores.
- `visual-review.json`: observações da revisão estática e limites.
- `style-atlas/dist/assets/natural-ads-60/`: quadros e miniaturas, preservando proporções.
- `advertising` viaja no preset, pedido e planejador. Narração, legenda e CTA não dependem da presença de outro campo opcional.
- Favoritos de versões anteriores continuam migrando no modo Page, sem usar localStorage. Fora da Page, o estado permanece no navegador.
- Skill e plugin multimarcas: **2.5.0**. Conteúdo de produção neutro, sem inserir marca da interface no pedido. A skill pessoal é independente e não é substituída.

## Limites

As imagens são fictícias. Na produção comercial, cor, material, medidas, rótulo, identidade e atributos devem ser conferidos contra originais. Não transformar cenas demonstrativas em depoimentos ou resultados reais. Alimentos orgânicos exigem origem e certificação verificáveis; dados nutricionais vêm do rótulo; publicidade jurídica precisa respeitar as regras aplicáveis. A aparência natural é uma direção de acabamento, não alegação de que houve filmagem humana.

Os quatro quadros representam evolução narrativa; não impõem quatro cenas nem divisão igual do tempo. A locução real determina a montagem. As legendas e CTA serão compostas em código/editor e revisadas, não geradas dentro da imagem.

## Verificação desta entrega

`npm ci` (também executado inicialmente com `--ignore-scripts`), `npm run check`, `npm test` e `npm run validate` executados. Os 11 arquivos de testes Node e os 4 testes Python passaram. Chromium local: dez categorias com seis estilos, download PNG, pedido de 45 s, recuperação após recarregar, largura 375 px sem overflow e modo Page com acesso a localStorage proibido. O bridge de Page foi simulado; não equivale a teste em cada aplicativo instalado. Registros em `style-atlas/records/natural-ads-60/`.

As 60 pranchas foram inspecionadas em folhas de contato; composições sinalizadas foram revistas individualmente. Não houve teste de vídeo, locução ou identidade contra originais de clientes. Os seis pilotos têm aprovação conceitual; as outras direções aguardam avaliação do usuário.
