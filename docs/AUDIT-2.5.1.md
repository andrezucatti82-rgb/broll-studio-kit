# Revisão do catálogo e do fluxo · 2.5.1

Data: 12/11/2026. Mantidos os 780 estilos, 28 categorias, IDs, imagens, quatro travas e aprovações de pré-produção. Nenhuma geração paga de mídia ou vídeo foi executada nesta revisão.

## Correções

- A coleta de materiais não classificava os novos segmentos de produtos. Agora inclui originais/ficha da variante, informações jurídicas para escritórios e rótulos/ingredientes/origem para alimentos. Interfaces também recebem orientação sobre capturas reais. O resumo prioriza os itens específicos.
- O pedido e os registros de produção não explicitavam o campo `avatar`. Agora ele acompanha a seleção, distinguindo apresentador sintético de filmagem autorizada de pessoas.
- As miniaturas eram renumeradas após excluir o quadro principal. Agora a numeração 01–04 corresponde à sequência real, incluindo a posição do quadro principal.
- Dados de seleção inválidos e fragmentos malformados na URL podiam impedir a inicialização. A restauração filtra entradas inválidas e mantém aprovações pendentes quando a seleção não corresponde mais à salva.
- A Page usa imagens de outro domínio, sem cabeçalhos CORS para canvas. O bloqueio foi reproduzido. Nela, o botão agora abre `download.html` na origem das imagens, onde o visitante baixa um PNG individual ou a sequência completa. No site, o download direto permanece. Links e parâmetros são resolvidos pelo catálogo; não aceitam caminhos arbitrários.
- O filtro já recebia os 19 tipos dinamicamente. Foi padronizado com valores explícitos e ordenação; não era uma ausência real de opções. Contadores e documentação histórica ambíguos foram corrigidos.

## Verificação

- `npm ci`, `npm run check`, `npm test`, `npm run validate` e build da Page.
- Pedidos dos 780 estilos: materiais, critérios de prova, identidade e preferência de avatar presentes; sem marca da interface, campos `undefined` ou objetos convertidos indevidamente em texto.
- 3.120 imagens e 3.120 miniaturas decodificadas; dimensões conferidas; hashes distintos para os quadros. Nenhum arquivo quebrado encontrado.
- Chromium: navegação nas 28 categorias; materiais de alimentos; 320, 375, 768, 1440 e 1920 px sem overflow horizontal; download de quadro, sequência e recorte de atlas; erro para referência inválida; fluxo da Page entre origens com bridge simulado e sem localStorage.
- No teste da Page, URLs da origem publicada receberam arquivos candidatos via roteamento do navegador, sem cabeçalhos CORS. Isso testa o fluxo entre origens, mas não certifica permissões do visualizador nativo do ChatGPT.
- Inspeção visual de 28 capas representativas, uma por categoria, além da prancha piloto de joias. Não foi feita inspeção manual de todos os 3.120 quadros nesta rodada.

## Limitações restantes

As sequências continuam conceituais. Não houve geração, playback nem escuta de novos vídeos. A coerência entre imagem e movimento, a naturalidade da voz e a fidelidade a produtos/pessoas reais continuam exigindo a amostra do projeto e comparação com originais. A instalação do plugin na conta de nuvem não é confirmada por atualizar o GitHub; o pacote e a instalação local do Codex são verificados separadamente.

O próximo teste criativo útil é produzir, com autorização de recursos/custos, uma amostra de um estilo sem vídeo e avaliar as quatro travas contra seus quadros. Esta revisão não executa esse teste.
