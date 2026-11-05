# Referências visuais

Abra https://videos.gerenciadordeanuncios.com.br/references.html. A seção contém 540 projetos com capas hospedadas na fonte, separados da biblioteca de 540 estilos de vídeo. Não exige conta nem chave para explorar.

1. Pesquise por projeto, tema, autor, cor ou linguagem. Use categorias e favoritos.
2. Selecione de uma a seis referências. Para cada uma, marque **Paleta**, **Tipografia**, **Composição** e/ou **Materiais e luz**.
3. Use **Adicionar ao pedido** para voltar ao briefing. Escolha o estilo de vídeo, informe tema e marca e prepare o pedido.
4. Copie o texto e envie no seu ChatGPT, ou baixe o preset JSON. O pedido inclui links, imagens e os aspectos escolhidos.
5. O agente verifica as referências e os recursos disponíveis, pede somente os materiais necessários e produz roteiro, storyboard e amostra de 10 segundos para aprovação.

No site, as escolhas ficam no armazenamento local do navegador. Outra máquina, navegador ou domínio não recebe a seleção automaticamente. Na Page integrada do ChatGPT, salve o briefing e o painel de referências; o comando nativo de produção lê os dois estados. A Page não instala ferramentas na conta.

## Procedência e limites

A pesquisa reuniu 720 candidatos em 18 buscas públicas. O catálogo seleciona 540 IDs e 540 capas únicas; cada imagem teve download/decodificação conferidos e inspeção em prancha. Não houve revisão integral de todos os textos, vídeos ou arquivos dos projetos. As categorias derivam dos títulos e metadados e podem se sobrepor.

As cores são aproximações da capa. Fontes não foram identificadas automaticamente: o agente deve confirmar a família e a licença no projeto. Projetos e capas continuam pertencendo aos respectivos autores; não acompanham a licença MIT do código. As capas não são redistribuídas no repositório, que armazena URLs, atribuição e cores derivadas. A ficha oferece crédito e link original. Se a fonte remover uma capa, a interface informa a indisponibilidade e mantém o link.

## Arquivos e manutenção

- `style-atlas/dist/references.html`, `references.css`, `references.js`: galeria e painel.
- `style-atlas/dist/reference-bridge.js`: seleção compartilhada com o briefing e texto de direção.
- `style-atlas/dist/visual-references.json`: catálogo, autoria, links, paletas e verificações de imagem.
- `style-atlas/records/build_references.py`: importação de metadados, validação e extração de paletas; recebe `--work` para manter downloads fora do repositório.
- `style-atlas/records/build_reference_page.py`: widget independente para a Page, com catálogo comprimido e estado limitado a seis escolhas.

Para publicar uma cópia própria, hospede os arquivos estáticos com HTTPS, troque a marca GDA pela sua e revise as URLs de navegação, espelho e Page. Não precisa contratar Apify/Firecrawl para usar o catálogo existente; essas ferramentas foram usadas na curadoria. Atualizar a pesquisa requer conta própria e revisão antes de substituir o JSON. Não inclua contatos, credenciais ou respostas brutas dos serviços no repositório.

## Apresentação das imagens

As capas de referência são exibidas integralmente, sem zoom de hover. Nos estilos com imagem individual, a moldura acompanha as dimensões reais do arquivo. Favoritos e etiquetas ficam fora da imagem. A ficha e a comparação também preservam o enquadramento. Esta proteção vale para a exibição do arquivo: não recupera conteúdo que já estava fora do enquadramento original.
