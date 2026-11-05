# Atlas visual — Vídeo Multimarcas

Página simples em HTML, CSS e JavaScript. Não exige framework, login próprio, banco de dados ou chave de API. Contém 280 direções, técnicas e formatos em 14 famílias; não pretende esgotar todos os estilos existentes.

Cada ficha inclui imagem ilustrativa, usos, recursos, movimento sugerido e preset. O usuário escolhe até duas direções, informa tema e marca opcional. A primeira entrega definida é roteiro, storyboard visual e vídeo de 10 segundos, sujeito à aprovação antes de produzir o vídeo completo.

## Executar

Sirva `dist/` por HTTP. Exemplo: `python -m http.server 8765 --directory dist`. A página carrega `catalog.json`; abrir o HTML diretamente como `file://` pode bloquear esse carregamento.

## Integração

No site público, o botão prepara e copia um pedido completo. Abrir o ChatGPT não envia a mensagem automaticamente. Nenhuma API secreta é colocada no navegador.

Uma edição em Page do ChatGPT usa `window.openai.setWidgetState` para salvar seleção e briefing. O botão nativo de um bloco `codex-prompt` inicia um novo chat da Page; ele deve ler o estado salvo antes de produzir. Não há alegação de envio automático de um site externo à conversa atual.

## Privacidade

O site público guarda favoritos e briefing apenas no localStorage do navegador. O usuário decide copiar o pedido ou baixar o JSON. Na edição em Page, o estado é salvo na Page e pode ser visto por quem tem acesso a ela. Nunca publicar exemplos de clientes ou dados pessoais junto do catálogo.

## Assets

26 pranchas são estudos visuais gerados por IA; duas pranchas de softwares são construídas em HTML/CSS/SVG para este catálogo. Não são capturas reais, depoimentos, produtos de marcas existentes ou provas de técnicas de animação. Interface em Geist; seletor com 24 combinações e arquivos reais, documentados em `dist/fonts.json`. As pranchas PNG originais ficam fora do pacote público; WebP é apenas uma conversão de formato para carregamento mais leve. Créditos e proveniência em `records/assets.json`.

## Manutenção

`records/build_catalog.py` gera `dist/catalog.json`. Preservar IDs ao editar presets para não quebrar escolhas salvas. `records/build_page.py` gera a edição HTML autocontida para o embed de Page, usando os mesmos dados e interface. Não alterar a skill pessoal Video B-roll.

## Publicidade de produto

24 direções incluem narração, música, SFX e requisitos de fidelidade. Imagens são exemplos fictícios. Fotos reais e rótulos devem ser preservados; 360 graus exige referências multivista ou modelo validado. Não inventar atributos, geometria oculta ou resultados.

Para reconstruir: `python records/build_catalog.py`. O gerador de Page exige `beautifulsoup4`; a página pública não tem dependências de execução.

## Imóveis

20 direções imobiliárias cobrem mapa, drone, fachada, interiores, acabamentos, planta, staging e apresentação com corretor. Preservar arquitetura e entorno; não inferir vistas ocultas de fotos. Mapa exige fonte/licença e coordenadas confirmadas. Avatar exige consentimento; caminhada integrada exige vídeo/tour ou reconstrução validada.

## Softwares

20 direções para anúncios, analytics, e-commerce, CRM, chat, automação e dashboards. As amostras são interfaces demonstrativas em código, não screenshots oficiais. Produção de tutorial real exige captura atual autorizada ou reprodução conferida com a plataforma; não inventar recursos, botões ou resultados.

## Apresentações

20 direções de motion e mensagem. O briefing permite escolher 24 combinações tipográficas com arquivos reais, amostra editável e licenças incluídas ou seguir o estilo. Confirmar fonte/licença; texto final editável e legível. Câmera, bokeh, transparência e time remap devem servir à hierarquia e à voz, com pausas de leitura.

## Avatares e apresentadores

20 apresentadores fictícios adultos: dez em interiores e dez em exteriores, com roupas casuais, despojadas e profissionais. A escolha habilita o avatar somente naquele projeto. Aparência, voz, olhar à câmera, anatomia e sincronia labial devem ser aprovados na prévia de 10 segundos. As amostras são retratos estáticos, não demonstrações de fala ou caminhada.

## Identidade e fontes

Interface GDA: fundo creme claro, azul, tipografia Geist e ícones SVG originais; a identidade dos vídeos segue a marca do usuário. Substitua logo e identidade da GDA ao hospedar sua própria versão. `dist/fonts.json` registra os 24 pares tipográficos, arquivos reais e procedência; licenças em `dist/assets/fonts/`.
