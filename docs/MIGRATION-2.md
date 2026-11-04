# Configuração de render: versão 2

A skill continua com o identificador `video-multimarcas`. Esta atualização altera a configuração do renderizador; briefings de entrada continuam independentes, na versão 1.

Antes, a configuração obrigava seis cenas e dividia a duração igualmente entre elas. Agora cada plano tem `id`, `durationFrames`, `layout`, `media` e `transition`. A duração total é a soma de `durationFrames`, dividida por `fps`. Não há propriedade global `duration` no projeto de render.

1. Defina `schemaVersion: 2`.
2. Remova `duration`. Escolha os tempos a partir da locução e dos acontecimentos, não de uma divisão automática.
3. Dê a cada cena um `id` único e `durationFrames` inteiro. Número de cenas é livre.
4. Escolha o layout explicitamente: `hero`, `photo`, `palette`, `spatial`, `catalog` ou `closing`. São bases técnicas; crie layouts novos quando a direção exigir. `spatial` ainda é um diagrama ilustrativo de mesas, não um ambiente 3D genérico.
5. Troque `image: "..."` por `media: {"type":"image","src":"..."}`. Vídeos usam `type: "video"`; `startFrom` opcional indica o recorte inicial em frames na taxa da composição. Confira se a mídia cobre o plano e sua saída. O áudio dos vídeos de apoio fica silenciado; a trilha principal usa `audio`.
6. Especifique `transition: {"type":"cut","durationFrames":0}` ou um `dissolve` de duração explícita. A primeira cena começa com corte. A dissolvência usa o início da nova cena, com extensão da anterior por esse intervalo, sem reduzir a duração total. Câmera e tempo local não são reiniciados dentro da passagem.
7. Para recortes em planos diferentes, use `layers` com `media`, `left`, `top`, `width`, `height`, `from` e `to` (`x`, `y`, `scale`). A ordem no array define a oclusão; a última camada cobre as anteriores. Prefira PNG/WebP/SVG com transparência quando necessário. `shadow: true` aplica sombra projetada simples, não simulação de iluminação física.

O renderer implementa imagem, vídeo, planos com movimento independente, corte e dissolvência. Zoom por um objeto, match cut geométrico, tracking, 3D e rotoscopia exigem assets e implementação específica em `src/`; não aparecem automaticamente ao preencher um prompt. Não classifique um efeito básico como uma técnica que não foi implementada.

`npm run stills` amostra início, meio e fim dos planos e fim das transições. Essa inspeção continua diferente de playback contínuo. `npm run review` valida o registro de revisão, não realiza avaliação audiovisual.
