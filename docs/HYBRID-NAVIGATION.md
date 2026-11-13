# Categorias e galeria no celular — 2.9.0

A navegação tem somente dois níveis. Há 1.160 estilos; os 780 anteriores conservam seus IDs, imagens, sequências e ordem. Os 60 anúncios antigos foram agrupados, mantendo a família histórica em legacyFamily. Os grupos do menu não alteram a ordem do catálogo usada para restaurar favoritos no modo Page.

| Categoria principal | Subcategorias | Estilos |
| --- | --- | ---: |
| Publicidade e vendas | Publicidade de produto; Campanhas e demonstrações; E-commerce e marketplaces | 120 |
| Anúncios por segmento | Moda e vestuário; Alimentação e bebidas; Casa e decoração; Joias e acessórios; Serviços jurídicos; Pets; Automotivo; Turismo; Beleza; Serviços residenciais; Infantil e maternidade | 440 |
| Serviços e educação | Imóveis; Saúde, estética e odontologia; Infoprodutores e educação | 120 |
| Tecnologia e sistemas | Softwares, telas e dashboards; Interfaces, dados e sistemas | 80 |
| Motion e apresentações | Motion Design de Campanha; Movimento e montagem; Apresentações e tipografia; Avatares e apresentadores | 160 |
| Estéticas e narrativas | Cinema e fotografia; Design gráfico e editorial; Ilustração e desenho; Papel, impressão e materiais; Volume e materiais digitais; Narrativas e combinações | 240 |

Selecionar uma categoria principal filtra todos os seus estilos. Selecionar uma subcategoria restringe a galeria. Recolher o grupo mantém o filtro; “Todas as categorias” remove o filtro de categoria. Outros filtros continuam valendo. A busca do menu considera nomes, abreviações e o grupo principal, sem distinguir acentos.

Não há mais os três estilos de exemplo nem “Ver os 40 estilos” dentro da lateral, no desktop ou no celular. Escolher categorias não muda a seleção de até dez estilos, as contribuições, o pedido nem as aprovações do projeto.

Até 700 px, a galeria usa duas colunas e prioriza capa, título, favorito e escolha. As três miniaturas adicionais ficam na ficha, onde os quatro quadros completos continuam disponíveis. A imagem conserva sua proporção e o enquadramento da sequência. O menu móvel mantém fechamento por Esc, retorno de foco e ciclo de Tab dentro do diálogo. O explorador visual começa recolhido no celular.

O modo Page continua sem localStorage. Os pacotes 2.9.0 documentam esta organização; atualizar os arquivos não instala automaticamente um plugin em outra conta.

## Possíveis coleções futuras

A leitura dos metadados do catálogo sugere estas coleções, sem criar estilos repetidos ou um terceiro nível no menu. São propostas, ainda não adicionadas como filtros públicos:

- **Gastronomia e alimentos:** reunir, por exemplo, `food-cinematografico`, os anúncios de orgânicos, barras e cereal. O tema hoje atravessa várias subcategorias.
- **Casa e decoração:** aproximar `decoracao-em-ambientes`, `ceramica-esmaltada` e anúncios de capachos, preservando a distinção entre produto real e imóvel.
- **Demonstração e conteúdo de criador:** reunir `demonstracao-de-produto`, `demonstracao-com-maos`, `unboxing-artesanal` e direções naturais por segmento.
- **Tutoriais e explicações:** reunir `tutorial-de-interface`, `quadro-de-giz` e direções de ensino, sem confundir aparência com objetivo do vídeo.

Essas coleções seriam caminhos alternativos para os mesmos IDs, não novas amostras nem categorias inferidas automaticamente. A correspondência precisa de revisão editorial antes de virar uma classificação pública. A distribuição atual e a cobertura dos IDs ficam no registro de revisão da entrega.

## Verificação e limites

Os testes DOM cobrem a partição dos 1.160 estilos nas 29 subcategorias, totais por grupo, remoção do terceiro nível, filtros, busca e preservação do projeto. Eles não medem layout. O registro `style-atlas/records/mobile-navigation-2.8.2/` documenta separadamente as verificações efetivamente executadas em Chromium, a publicação e seus limites. Capturas antigas em `hybrid-navigation/` são históricas e mostram a navegação anterior.

Não se trata de teste em aparelho físico ou no visualizador nativo de Pages. A organização anterior não gerou mídia; a expansão 4.4 acrescenta 380 sequências conceituais, sem novos vídeos. Consulte [a expansão atual](SEGMENT-ADS-4.4.md).
