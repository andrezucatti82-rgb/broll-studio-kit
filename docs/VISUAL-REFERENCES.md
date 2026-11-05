# Referências visuais

Abra https://videos.gerenciadordeanuncios.com.br/references.html. A seção contém 1.000 projetos com capas hospedadas na fonte, separados da biblioteca de 540 estilos de vídeo. Não exige conta nem chave para explorar.

1. Pesquise por projeto, tema, autor, cor ou linguagem. Use categorias e favoritos.
2. Selecione de uma a seis referências. Para cada uma, marque **Paleta**, **Tipografia**, **Composição** e/ou **Materiais e luz**.
3. Use **Adicionar ao pedido** para voltar ao briefing. Escolha o estilo de vídeo, informe tema e marca e prepare o pedido.
4. Copie o texto e envie no seu ChatGPT, ou baixe o preset JSON. O pedido inclui links, imagens e os aspectos escolhidos.
5. O agente verifica as referências e os recursos disponíveis, pede somente os materiais necessários e produz roteiro, storyboard e amostra de 10 segundos para aprovação.

No site, as escolhas ficam no armazenamento local do navegador. Outra máquina, navegador ou domínio não recebe a seleção automaticamente. Na Page integrada do ChatGPT, salve o briefing e o painel de referências; o comando nativo de produção lê os dois estados. A Page não instala ferramentas na conta.

## Procedência e limites

O acervo preserva os 540 projetos anteriores e acrescenta 460 novos. A expansão pesquisou 746 candidatos em 18 buscas, eliminou projetos já cadastrados e capas repetidas e conferiu as capas selecionadas em pranchas. O catálogo tem 1.000 IDs, URLs de projeto e hashes de capa únicos. Não houve revisão integral dos textos, vídeos ou arquivos dos projetos.

Cada referência pertence a uma única categoria, definida pelo foco visual mais útil da capa e pelos metadados do projeto, com correções manuais registradas. Os dez filtros somam 1.000, sem sobreposição. Paleta, Tipografia, Composição e Materiais/luz continuam sendo aspectos de uso disponíveis em qualquer projeto. A capa não comprova se uma imagem foi fotografada, renderizada ou gerada por IA; verificar no original antes de afirmar a técnica.

O filtro **Novas · 460** mostra somente as adições desta edição e pode ser combinado com categoria, busca e favoritos. Os contadores acompanham esses filtros. A apresentação alterna categorias e exemplos novos/anteriores; a ordem dos IDs armazenados permanece estável para preservar favoritos na Page.

As cores são aproximações da capa. Fontes não foram identificadas automaticamente: o agente deve confirmar a família e a licença no projeto. Projetos e capas continuam pertencendo aos respectivos autores; não acompanham a licença MIT do código. As capas não são redistribuídas no repositório, que armazena URLs, atribuição e cores derivadas. A ficha oferece crédito e link original. Se a fonte remover uma capa, a interface informa a indisponibilidade e mantém o link.

## Arquivos e manutenção

- `style-atlas/dist/references.html`, `references.css`, `references.js`: galeria e painel.
- `style-atlas/dist/reference-bridge.js`: seleção compartilhada com o briefing e texto de direção.
- `style-atlas/dist/visual-references.json`: catálogo, autoria, links, paletas e verificações de imagem.
- `style-atlas/records/build_references.py`: validação de um catálogo curado: IDs, categorias, imagens, dimensões e hashes; recebe `--work`, `--input` e `--base`. Não realiza revisão visual automática.
- `style-atlas/records/build_reference_page.py`: widget independente para a Page, com catálogo comprimido e estado limitado a seis escolhas.

Para publicar uma cópia própria, hospede os arquivos estáticos com HTTPS, troque a marca GDA pela sua e revise as URLs de navegação, espelho e Page. Não precisa contratar Apify/Firecrawl para usar o catálogo existente; essas ferramentas foram usadas na curadoria. Atualizar a pesquisa requer conta própria e revisão antes de substituir o JSON. Não inclua contatos, credenciais ou respostas brutas dos serviços no repositório.

## Apresentação das imagens

As capas de referência são exibidas integralmente, sem zoom de hover. Nos estilos com imagem individual, a moldura acompanha as dimensões reais do arquivo. Favoritos e etiquetas ficam fora da imagem. A ficha e a comparação também preservam o enquadramento. Esta proteção vale para a exibição do arquivo: não recupera conteúdo que já estava fora do enquadramento original.

## Verificação contra repetição

Execute `npm run validate:references`. O validador exige 1.000 IDs, URLs de projeto, URLs de capa e hashes de imagem únicos, uma categoria por referência e soma de categorias igual a 1.000, dez categorias com descrição e 460 adições identificadas. O deploy executa a mesma validação antes de acessar a hospedagem. Preserve IDs e ordem ao reclassificar para manter favoritos e seleções salvos.

A galeria usa cinco colunas em telas a partir de 1200 px, três nas intermediárias e duas no celular. As capas continuam inteiras e o painel de seleção permanece acessível.

## Categorias desta edição

| Categoria | Referências | Foco |
|---|---:|---|
| Marcas e identidade | 198 | Sistemas de marca, logotipos e consistência entre aplicações. |
| Cor e paletas | 83 | Combinações cromáticas, contraste e proporção das cores na composição. |
| Tipografia e lettering | 87 | Desenho de letras, famílias tipográficas e hierarquia expressiva. |
| Editorial e layouts | 97 | Livros, revistas, grids, ritmo de leitura e relação entre texto e imagem. |
| Cartazes e campanhas | 99 | Mensagens de impacto, peças publicitárias e sistemas de campanha. |
| Interfaces e dados | 97 | Sites, aplicativos, painéis e visualização clara de informação. |
| Embalagens e produtos | 97 | Rótulos, recipientes, materiais e apresentação de produtos. |
| Fotografia e luz | 104 | Retrato, moda, still life, iluminação e composição fotográfica. |
| 3D e materiais | 81 | Volume, superfícies, esculturas digitais e estudos de materialidade. |
| Espaços e arquitetura | 57 | Interiores, fachadas, exposições e composição espacial. |

## Atualizar a curadoria

1. Guarde a pesquisa e as capas em um diretório privado de trabalho. Confirme autoria, URL original, permissão de acesso e a aparência das capas. Não publique respostas brutas, contatos ou credenciais.
2. Monte `curated-catalog.json` com a estrutura do catálogo atual. Preserve os IDs e posições anteriores, acrescente referências novas ao fim, registre categoria exclusiva e marque a revisão somente depois de inspecionar a capa. Registre exclusões e correções de categoria em `records/reference-curation.json`.
3. Valide antes de publicar: `python records/build_references.py --work /tmp/reference-review --input /tmp/reference-review/curated-catalog.json --base /caminho/catalogo-anterior.json`. O script confere capas reais e gera um relatório; não certifica qualidade criativa.
4. Após revisar o resultado, repita com `--publish` para substituir `dist/visual-references.json`. Atualize os números esperados no validador do kit somente quando o escopo aprovado mudar. Execute `npm run validate:references`, regenere o widget da Page e teste filtros, cinco colunas e transferência ao pedido.
