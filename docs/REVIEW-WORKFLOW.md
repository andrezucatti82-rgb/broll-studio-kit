# Revisão das cinco fases

Branch: `feat/fidelity-project-workflow`. Trabalho local para revisão; não autoriza publicação, merge ou geração. Nenhuma API de geração foi chamada.

1. **Contrato:** PNG por estilo (atlas ou imagem individual), referência e quatro travas no preset/pedido, campos completos nos 540 IDs. Readiness preservada. Validação inicial do catálogo passou; downloads foram verificados na revisão integrada.
2. **Duração:** 15/30/60 ou 61–3600 segundos; amostra sempre 10 s. Estimativa por limites do adaptador, sem distribuir uniformemente as cenas. Testes puros de estimativa, migração e pedido passaram.
3. **Contato:** menu Produzir meu vídeo e escolha fazer sozinho/produção pela GDA. A versão final remove WhatsApp por decisão posterior do usuário; somente link institucional, sem briefing na URL. GA4 vazio: nenhum script de medição. Se configurado futuramente, carregamento somente após consentimento explícito da sessão; só três eventos permitidos e nenhum campo digitado nos eventos. Fluxo de medição com ID real não foi verificado.
4. **Continuidade:** ficha versionada exportável/importável, histórico e parser limitado. Dados colados são renderizados como texto. Aprovação exige quatro decisões do usuário; status nunca as concede. Projetos CLI antigos preservam evidências e recebem a etapa final pendente. Testes de ficha e parser passaram.
5. **Escolha:** seis recomendações determinísticas, selos conforme preview (seis existentes), estilos selecionados no briefing e avisos técnicos acessíveis. Integração inclui retirada do WhatsApp, validadores de travas e compilação Page compatível.

## Verificação executada

- `npm ci --cache /tmp/gda-npm-cache` passou. As primeiras tentativas falharam por rede restrita e cache fora das pastas graváveis; não se alterou o lockfile para contornar a instalação.
- `npm run check`, `npm test`, `npm run validate` passaram, incluindo 540 IDs preservados, maturidade inalterada.
- `npm run atlas` executado e usado nos testes Playwright/Chromium.
- PNG dos estilos `publicidade-cinematografica` (atlas) e `aula-amostra-em-bancada-de-raciocinio` (individual) baixados e dimensões conferidas contra a fonte. Não é uma avaliação artística de todos os quadros.
- Pedidos de 30/90 s, recarga, status válido e HTML/instruções maliciosas exibidos como texto, JSON quebrado recusado, exportação/importação e preservação do projeto após ficha inválida, seis recomendações e viewport 375 px passaram.
- Modo Page testado com ponte simulada e localStorage bloqueado. Bundle HTML compilado abaixo de 256 KiB; favoritos e fallback de duração verificados. Não foi alterada a Page da conta e não se verificou o host nativo real.
- Pacotes de skill/plugin 2.2.11 regenerados no repositório; não foram instalados na conta do ChatGPT ou em outros ambientes.

## Revisão local

```sh
git fetch origin
git switch feat/fidelity-project-workflow
npm ci
npm run check
npm test
npm run validate
npm run atlas
```

Abra http://127.0.0.1:8770/. Para reproduzir os testes de navegador, instale Python/Playwright, disponibilize Chromium em `/usr/bin/chromium` e, com o atlas aberto, execute `python tests/browser-workflow.py`. O relatório temporário fica em `/tmp/gda-workflow-browser`. A compilação opcional da Page usa BeautifulSoup, FontTools e Brotli: `python style-atlas/records/build_page.py`.

## Decisões antes de publicar

- Aprovar a chamada **Conhecer a produção da GDA** e o destino institucional; WhatsApp foi retirado.
- Manter GA4 vazio ou fornecer ID e aprovar o consentimento e os três eventos. Não houve verificação jurídica nem teste de coleta real.
- Autorizar publicação e eventual atualização das instalações separadamente.

## Teste real proposto, não executado

Escolher um dos 534 estilos sem preview e usar o mesmo tema, originais, modelo e orçamento nos dois fluxos. No novo, anexar PNG e escolher a cena mais difícil; no antigo, usar só nome/texto. Gerar apenas a amostra de 10 s após autorização. Comparar aparência lado a lado, movimento em playback integral, texto em celular e invariantes de produto/pessoa/marca contra os originais. Registrar hashes, custos, diferenças, correções e aprovação do usuário. Não inferir fidelidade do vídeo inteiro a partir da amostra.

## Revisão de experiência após a publicação

Acompanhamento movido para depois da biblioteca, oculto até uma escolha e centrado na próxima ação. Atualizações técnicas, histórico e arquivos ficam em seções opcionais recolhidas. A aprovação usa quatro perguntas simples; cada correção abre seu campo somente quando escolhida.

Escolha de até 10 estilos (um principal e até nove complementares) diretamente na galeria e no briefing. Controles acessíveis por teclado, relevo e textura discretos, animações suaves e movimento reduzido respeitado.

A seção comercial “Produzir meu vídeo” e seus links foram removidos por solicitação do usuário. WhatsApp e GA4 seguem sem ativação.

Verificação adicional: galeria em largura total, seleção no cartão, briefing, persistência, aprovação, 375 px e movimento reduzido. Não houve geração de vídeo.

## Acervo simplificado

A biblioteca externa e os painéis laterais foram retirados. A galeria usa toda a largura. Fichas antigas continuam importáveis: o campo legado da biblioteca externa é descartado, preservando estilos, duração, histórico e aprovações. Os quadros individuais dos estilos e os originais de clientes continuam necessários à fidelidade.
