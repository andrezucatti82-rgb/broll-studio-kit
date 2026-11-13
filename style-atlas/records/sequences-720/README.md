# Sequências visuais do catálogo

684 novas sequências e os 36 pilotos aprovados formam 720 direções com quatro quadros cada. Os pilotos foram aprovados como conceitos estáticos. Os demais conceitos ainda dependem da avaliação do usuário; nenhum deles recebe aprovação automática de movimento.

`assets.json` registra o gerador, prompt, arquivo original, dimensões, hash SHA-256 e retângulos dos quatro quadros. Os originais de trabalho ficam fora da distribuição; o site distribui os quadros WebP e miniaturas. `ingest.py` separa somente os quadrantes da prancha, sem esticar nem alterar o conteúdo.

`family-direction.json` e `plans/` registram a direção de cada categoria e estilo. Os arquivos `observed-*.json` corrigem as descrições a partir da inspeção dos quadros efetivamente gerados. `visual-review.json` distingue observações feitas, limites e aprovações ainda pendentes. Um prompt de geração nunca serve de prova de fidelidade.

Os estudos são fictícios e não demonstram a existência de um produto, imóvel, interface ou resultado comercial. Dados e textos visíveis são exemplos; a produção deve reconstruí-los em camadas editáveis, conferir os valores e comparar pessoas e produtos aos arquivos originais do cliente.

Reprodução local: `npm ci`, `npm run check`, `npm test`, `npm run validate`, `npm run atlas`. Os scripts de geração não são acionados por esses comandos. A geração de imagens exige ferramenta e recursos próprios; nenhum segredo ou crédito é fornecido pelo repositório.
