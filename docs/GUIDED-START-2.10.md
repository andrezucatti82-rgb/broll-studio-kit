# Início simples e continuidade — implementação em revisão

Base: main `97b7ceec4a764819fbd0dc32bfcf4cd90eeab3fb`, catálogo 4.4 (1.160 estilos/29 subcategorias). Branch: `feat/guided-start-and-continuity`. Esta entrega não autoriza merge, publicação, instalação em contas ou geração paga.

1. Alinhar o guia atual e os exemplos com os contratos existentes.
2. Unificar pedido, continuidade, materiais condicionais e protocolo de conversa ChatGPT/Claude. Preservar fichas antigas e tratar registros como dados, sem aprovação automática.
3. Aproveitar os quatro passos: declaração inicial leve, sugestões explicáveis, materiais e kit em arquivos individuais. Combinação continua opcional; mobile prioriza a imagem e a escolha.
4. Preservar decisões válidas em alterações sem efeito e invalidar as etapas dependentes de mudanças reais. Mostrar falhas de salvamento; Page continua sem localStorage.
5. Atualizar a skill canônica, templates, pacotes, guias e testes. Conferir em navegador e distinguir software/simulação de produção real.

Critérios: mesmos IDs, ordem, imagens e maturidade; dez estilos e contratos de escopos intactos; nenhuma perda silenciosa em importação/retomada; pedido autossuficiente sem ZIP/skill obrigatórios; até três perguntas pertinentes por rodada, com alternativa textual; originais e gates visuais preservados; custo histórico não vira cotação nem autorização. R$50 é referência de planejamento, não crédito disponível.

Produção hospedada, autenticação, armazenamento de mídia e o piloto audiovisual ficam pendentes. O piloto necessita materiais, visuais aprovados, cotação e autorização financeira. Nenhum teste de código certifica o vídeo.

Os resultados e as limitações efetivamente verificados serão registrados ao concluir a branch. O site publicado permanece na versão anterior até autorização de implantação.

## Entrega candidata de 14/11/2026

### 1. Contratos e contexto portátil

O pedido agora inclui histórico, correções, aceites declarados e registro limitado de materiais, capacidades, artefatos, decisões e custos. O esquema acompanha o pedido para funcionar sem skill instalada. O planejador usa `project` validado como fonte canônica quando um pacote contém `brief` antigo; guarda a continuidade sem concluir etapas importadas automaticamente.

O registro não transfere mídia, autentica decisões ou comprova execução. Aceite rico exige vínculo com artefato/versão/hash; a evidência original ainda deve ser conferida. Invalidadores e pendências prevalecem sobre recibos antigos. Fichas antigas continuam aceitas; importações inválidas preservam o projeto aberto.

### 2. Início e passagem para a conversa

Os quatro passos existentes foram aproveitados. Uma declaração inicial leve de materiais alimenta as sugestões antes de escolher aparência. Uma direção basta. No celular, há uma sugestão por vez no assistente, com setas entre as três; a biblioteca continua com duas colunas e todos os estilos. O botão principal fica junto ao título, sem cobrir as imagens.

A revisão mostra materiais necessários agora, opcionais e condicionais; downloads de quadro/seqüência identificados; seletor ChatGPT/Claude; pedido TXT, instruções TXT, manifesto JSON e projeto JSON individuais. Copiar, exibir e baixar usam o mesmo pedido atualizado. O projeto guarda escolhas e registros, não bytes da mídia. A ajuda responde o que fazer, enviar, receber e como recuperar falhas.

### 3. Decisões e armazenamento

Reabrir o assistente ou reaplicar a mesma combinação preserva decisões. Mudanças reais invalidam a partir da dependência afetada: materiais/fatos, roteiro/duração, aparência ou storyboard/áudio. Histórico e versões anteriores são conservados. Falha de armazenamento é visível de forma persistente; o projeto aberto continua disponível para download.

Na Page, gravações são serializadas e o estado é copiado antes do envio. O limite de 16 KiB é respeitado sem fallback para localStorage. Exceder o limite gera aviso e alternativa de download, sem fingir que salvou. O HTML candidato fica abaixo de 256 KiB e não foi enviado à Page publicada.

### 4. Skill, guias e pacotes

Skill genérica, plugin distribuível e kit são 2.10.0 nesta branch. Acrescentados protocolo de conversa e continuidade, template de registro e ponteiro no coordenador. Pacotes `.skill`, ZIP e plugin ZIP regenerados da fonte canônica com manifesto de hashes. Nada foi instalado em contas, outro computador ou na skill pessoal Video B-roll. Catálogo 4.4 preservado: 1.160 estilos, 29 subcategorias, mesma ordem, IDs, imagens e maturidade.

## Verificações realizadas

- `npm ci`, `npm run check`, `npm test`, `npm run validate`: passaram. Suíte Node: 129 testes; Python: 9. Após explicitar o esquema no pedido, 46 testes focados passaram. A execução final completa também passou: 129 Node + 9 Python.
- Chromium local: declaração de uma foto → sugestões → escolha → materiais → pedido; destino Claude; cópia real para clipboard; quatro downloads TXT/JSON; PNG do quadro e da seqüência; recarga; importação válida e recusa sem perda; falha simulada de storage com aviso persistente.
- Biblioteca conferida sem overflow horizontal em 320, 375, 768, 1440 e 1920 px; duas colunas no celular. Capturas de aparência e passagem produzidas em 375 e 1440 px, com imagens carregadas.
- HTML compilado da Page com bridge simulada: ordem de gravação, link Claude, localStorage proibido, aviso ao exceder 16 KiB e exportação do projeto que excedeu esse limite. Isso não certifica o visualizador nativo da conta.
- Testes cobrem compatibilidade de fichas, histórico/correções no pedido, rejeição de campos/versões/valores inválidos, recibo ligado ao artefato, ausência de marca da interface no pedido, alterações sem efeito e invalidação dependente.
- `git diff --check` e comparação com a base: catálogo e assets de estilos sem alteração. Testes de software não comprovam acabamento audiovisual.

Os scripts opcionais de navegador são `tests/browser-guided-start.py` e `tests/browser-guided-page.py`. Exigem Playwright/Chromium já disponíveis e `npm run atlas` em execução; escrevem apenas em `/tmp/guided-start-qa`. A Page usa HTML local e catálogo roteado do repositório; imagens públicas continuam externas. Nenhuma chamada paga é feita.

## O que não foi verificado

Não houve conversa real de produção no ChatGPT/Claude, uso do visualizador nativo da Page, instalação do pacote em contas, avaliação com pessoas sem conhecimento técnico, renderização de novo vídeo ou escuta/playback de uma nova produção. Não foram confirmados saldo, preço atual, permissões de geração, custos por vídeo aprovado nem fidelidade de qualquer receita. Os seis previews existentes continuam com sua maturidade anterior. Sem geração, nenhuma receita recebeu selo de validada audiovisualmente.

O protocolo depende do agente seguir as instruções; JSON bem formado não comprova verdade ou autoria. Referências remotas podem falhar. Mudanças materiais continuam exigindo aceites reais; referências não prometem cópia exata. O projeto pode exceder o armazenamento da Page: o download é a recuperação explícita.

## Próxima validação proposta, sem execução

Fazer uma sessão acompanhada com pessoa sem conhecimento técnico: produto fictício com uma foto e informações comprovadas. Comparar o fluxo anterior e o novo nas quatro travas. Obter antes a foto utilizável, restrições e proposta de ação compatível; preparar e aprovar roteiro, moodboard/styleframes, storyboard e animatic conforme a política visual. A amostra de 10s deve conter a ação/passagem mais difícil, com justificativa, voz e legendas editáveis.

Antes de qualquer imagem, voz ou clipe cobrado, verificar rota HeyGen direta compatível, conta, preço atual e estimativa de tentativas. Apresentar custo e solicitar autorização específica; R$50 é teto de planejamento, não gasto autorizado. Não trocar provedor ou reduzir a direção silenciosamente. Comparar originais, referências, storyboard e amostra; reproduzir e escutar integralmente, registrar diferenças e pedir aprovação. Só depois considerar o vídeo completo. A entrega termina com o usuário acessando e avaliando o MP4, não no clique de copiar.

Depois, cobrir produto com várias vistas, serviço sem filmagem, interface real/demonstrativa e combinação de luz/letras em escopos diferentes. Incluir anexo ausente/inadequado, material já recebido, referência inacessível, ação incompatível, conflito de características, ausência de menu, ferramenta/orçamento ausente, retomada e correção que renova aceites. Medir decisões iniciais, perguntas repetidas, reenvios, abandonos, ajuda técnica, tempo ativo/processamento, tentativas, custo por vídeo aprovado e correspondência visual. Separar simulação, teste real de conversa e execução audiovisual.

## Evolução futura preservada

Produção hospedada na mesma interface continua planejada: entrada pública, cadastro só para produção/armazenamento, anúncio de produto como primeiro percurso completo, contas/créditos próprios, OpenAI/HeyGen inicialmente considerados, configuração assistida, edição por conversa/cena, hospedagem atual complementada por uso, aviso/arquivamento de materiais inativos. Nenhum limite antigo de participantes foi reintroduzido. Não há servidor, login, integração paga ou contratação nesta entrega.

## Revisão local

```bash
git fetch origin
git switch feat/guided-start-and-continuity
npm ci
npm run check
npm test
npm run validate
npm run atlas
```

Abra http://127.0.0.1:8770/. Opcionalmente, com Playwright/Chromium já instalados:

```bash
python tests/browser-guided-start.py
python tests/browser-guided-page.py
```

Merge, publicação e piloto pago continuam pendentes de autorização. A branch é a versão candidata; o site público e a main não são alterados por esta entrega.

Capturas da candidata local: [aparência no desktop](assets/guided-start-2.10/desktop.png), [aparência no celular](assets/guided-start-2.10/mobile.png) e [revisão no celular](assets/guided-start-2.10/handoff-mobile.png). São capturas de interface, não amostras audiovisuais.
