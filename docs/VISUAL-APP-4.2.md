# Biblioteca visual 4.2

O site continua público, estático e sem login. A identidade GDA existe apenas na interface. Os pedidos, presets e a skill Vídeo Multimarcas continuam neutros.

## Escolher e produzir

1. Abra Estilos e filtre pela categoria, busca, favoritos ou amostras anteriores em vídeo.
2. Examine a capa e os três momentos adicionais. Abra a ficha para ampliar os quatro quadros e consultar recursos, som e limitações.
3. Escolha um estilo principal e até nove complementares. Em Meu vídeo, informe tema, marca opcional, formato e duração.
4. Prepare e copie o pedido. Baixe o quadro principal e a sequência e anexe-os à conversa de produção. Abrir ChatGPT não transmite o briefing ou os arquivos automaticamente.
5. Aprove separadamente moodboard, storyboard e amostra de dez segundos da ação mais difícil. O vídeo completo depende desses aceites.

## O que as imagens demonstram

São quatro estados conceituais de cada direção, não quatro cenas obrigatórias e não vídeos já executados. Os textos desenhados nas referências devem ser recompostos como elementos editáveis. Pessoas, interfaces, dados, marcas, produtos e imóveis são fictícios; os materiais reais do projeto prevalecem para identidade e características.

Os seis vídeos históricos estão nas fichas com aviso: antecedem a revisão das imagens e continuam pendentes de aprovação. Não provam a execução das novas sequências. Testes reais de movimento e áudio não foram feitos nesta atualização.

## Implementação

- `app-shell.js` e `app-shell.css`: navegação, resumo do pedido, categorias compactas e layout responsivo.
- `gallery-views.js`: capa, miniaturas e ficha da sequência; textos do catálogo escapados antes de exibir.
- `catalog.json`: 720 IDs preservados, `sequence` com quatro quadros e `executionPlan` com estados, ações, recursos e critérios de revisão.
- `workflow.js` e `production-plan.mjs`: transporte dessas referências e planos até a produção retomável.
- `records/sequences-720`: origem, extração dos quadros, direções por categoria e registros de revisão.

As molduras contêm a imagem inteira sem deformação. A proporção real permanece nos metadados. A versão Page usa o mesmo código, com armazenamento próprio da Page e sem localStorage. Mudanças das referências reabrem aprovações afetadas, preservando favoritos e histórico.

## Verificação e limites

Os testes automatizados cobrem catálogo, arquivos, neutralidade do pedido, seleção de dez estilos, duração, retomada, migração e modo Page. Esses testes não substituem inspeção visual em navegador, teste de download em canvas ou aprovação criativa. Consulte o registro de entrega para os comandos efetivamente executados e verificações pendentes.

Não há reconhecimento facial, garantia de identidade, teste automático de física ou certificação dos dados ilustrativos. Gráficos e mecanismos precisam ser reconstruídos e verificados na produção. Recursos e custos devem ser confirmados na conta do usuário antes de qualquer geração paga.
