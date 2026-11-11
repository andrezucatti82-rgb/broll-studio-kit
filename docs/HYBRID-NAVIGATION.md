# Navegação híbrida de categorias

A biblioteca mantém os mesmos 720 estilos, IDs e 18 categorias. A navegação aprovada combina:

- Menu lateral em três grupos: Linguagens visuais (6), Movimento e apresentação (4), Aplicações e negócios (8).
- Três atalhos de estilos dentro da categoria selecionada e acesso às suas 40 opções.
- Explorador visual recolhível, com miniaturas extraídas das sequências existentes, sem novas imagens geradas.
- Busca de categoria sem distinção de acentos, nomes completos na lateral e nomes curtos nas miniaturas.
- Menu deslizante no celular, com fechamento por Esc, retorno de foco ao botão Categorias e ciclo de Tab/Shift+Tab dentro do diálogo.

No celular, o explorador começa recolhido. A lateral tem rolagem própria. O menu não altera o briefing nem a seleção de até dez estilos. A seleção de categoria e os filtros da galeria continuam sincronizados. O modo Page permanece sem localStorage.

## Verificações

`npm ci`, `npm run check`, `npm test` e `npm run validate` passaram após a implementação principal. Os ajustes posteriores de CSS e foco tiveram nova execução dos testes DOM da aplicação. O teste específico do ciclo de foco passou com as medidas de layout simuladas; ele não substitui a checagem real.

O espelho público foi inspecionado em navegador remoto. Foram conferidas seleção de Cinema (40 estilos e três atalhos), seleção de Softwares pelo painel visual e correspondência da categoria ativa. Em 375 × 812 foram verificados abertura do diálogo, abertura de uma ficha por atalho, fechamento por Esc, restauração da rolagem e retorno de foco. Após corrigir o ciclo de teclado, Shift+Tab levou ao botão Explorar categoria e Tab retornou ao botão Fechar, mantendo o foco dentro do diálogo. Sem overflow horizontal nessa checagem.

Capturas reais de desktop (1440 px) e celular (375 px) ficam em `style-atlas/records/hybrid-navigation/`. A inspeção não cobre todos os navegadores ou aparelhos físicos. A renderização dentro do ChatGPT não foi inspecionada visualmente; a Page teve seu HTML atualizado e o comportamento sem localStorage passou nos testes DOM.

O catálogo e os protocolos de produção permanecem iguais. Esta alteração de interface não exige nova versão das skills ou geração de vídeos.
