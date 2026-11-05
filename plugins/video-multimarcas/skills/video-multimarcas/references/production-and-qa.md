# Produção e revisão: dois critérios independentes

## Primeiro teste a parte difícil

Depois da pesquisa e direção, produza uma prova curta do plano mais exigente e sua transição, com voz e som. Escolha o trecho que comprova ação, profundidade e continuidade, não apenas o título mais fácil. Reveja em movimento antes de multiplicar o layout para o filme inteiro. O rascunho do kit serve para configurar ferramentas; não é referência de qualidade nem substitui direção por tema.

Se uma ferramenta, mídia, orçamento ou prazo impedir a direção, diga qual recurso faltou e proponha uma alternativa concreta. Execute o trabalho independente já autorizado. Não troque silenciosamente vídeo por fotos estáticas, 3D por cartões inclinados ou travessia espacial por máscara. Respeite autorizações vigentes; não crie etapas de aprovação repetidas sem necessidade.

## Voz e som antes de travar a montagem

Use voz pública/licenciada ou voz pessoal autorizada. Gere uma amostra e escute pronúncia da marca, entonação e pausas. Voz pessoal não migra de outro projeto automaticamente. Meça a duração real e ajuste roteiro/pausas; não imponha velocidade universal. Se alterar tempo, preserve pitch e refaça sincronização.

Música licenciada ou original acompanha o arco narrativo. Use silêncio, ambiência, foley e efeitos ligados a ações; faça ducking para preservar a fala. −14 a −16 LUFS integrados e true peak abaixo de −1 dBTP são referências práticas, não certificado de inteligibilidade. Meça o AAC final e escute sua mixagem.

## Revisão técnica

Confirme duração, frames, fps, resolução, codecs, decodificação completa, arquivos presentes, fontes, direitos e precisão factual. Inspecione início, meio e fim de cada plano, limites de transição, legendas e recortes. Relatórios automáticos e capturas não substituem as duas revisões seguintes.

## Playback contínuo obrigatório para aprovar o acabamento

Assista ao arquivo inteiro em velocidade normal, com áudio sincronizado. Revise também em tamanho de celular. Confira ritmo, compreensão, ação interna, volume, paralaxe, oclusão, continuidade, jitter, flashes, competição de movimentos, cortes da fala, leitura e CTA. Revise as passagens exigentes com contexto antes e depois; uma grade de quadros isolados não demonstra fluidez.

## Escuta obrigatória para aprovar a locução e a mixagem

Escute a faixa final completa: pronúncia, naturalidade, respirações, emendas, palavras cortadas, inteligibilidade, música e efeitos. Timestamps, transcrição, waveform e LUFS não são escuta. Ferramenta que efetivamente reproduza/análise áudio pode sustentar a avaliação do agente; registre como foi utilizada. Nunca invente uma audição humana.

## Estados honestos de entrega

- `draft`: montagem em trabalho.
- `candidate`: render com verificações técnicas; pode ser entregue para revisão.
- `review_pending`: playback, escuta ou avaliação criativa não realizados ou incompletos.
- `reviewed`: arquivo exato passou por revisão técnica, playback, escuta e critérios criativos, com evidência e bloqueadores resolvidos.

Se o ambiente não permitir playback ou escuta, continue as verificações possíveis e entregue uma **prévia com revisão pendente**, com link para o arquivo e critérios de revisão. Peça somente a participação necessária para concluir essa avaliação. A indisponibilidade não permite marcar `passed`, anunciar acabamento aprovado ou publicar automaticamente como exemplo de qualidade. Se o usuário autorizar uma entrega/publicação com essa limitação, registre a decisão separadamente; a revisão continua pendente, não vira aprovada.

## Registro vinculado ao arquivo

Copie `../templates/review.json`. Preencha SHA256 do MP4, evidência técnica, responsável, método, escopo integral e observações reais de playback/escuta. Avalie narrativa, ação interna, profundidade, ritmo, transições, leitura, voz e som. Critérios podem ser atendidos com uma linguagem contida quando coerente e justificada. Registre problemas com tempo do vídeo, severidade, ação e estado.

Qualquer alteração posterior ao arquivo revisado muda seu hash e invalida a aprovação daquele arquivo. Faça nova revisão do novo corte, inclusive emendas, voz e transições afetadas, antes de marcá-lo como revisado.

No kit, `npm run review -- video.mp4 review.json` verifica preenchimento, pendências e correspondência do arquivo. O comando **não assiste, não escuta e não mede qualidade artística**. Aprovação registrada exige avaliação verdadeira; não preencha o formulário só para passar na validação.

## Portas de avaliação obrigatórias

Aplicar `natural-finish.md` e preencher `qualityGates` no relatório para `imageGeneration`, `videoGeneration` e `finishing`. Cada etapa aplicável exige responsável, observações e assets com arquivo, SHA256 e evidência. Geração IA não utilizada pode ser `not_applicable` com justificativa; acabamento nunca. Relatórios antigos precisam dessas evidências antes de uma nova aprovação. O validador verifica completude e bloqueios, não executa a avaliação audiovisual.

Aplique também `identity-preservation.md`, registre `identityPreservation` e execute `npm run identity-check -- review.json` antes de avançar da amostra ao vídeo completo. `npm run review` rejeita o relatório final sem esse registro. Revise novamente a identidade em todos os planos finais, além do teste de movimento.

## Prioridade de geração de vídeo

Avalie primeiro o HeyGen pela API HTTP direta. Confirme na documentação oficial o endpoint/modelo apropriado à cena; autenticação por leitura não comprova saldo, acesso ao modelo ou fidelidade. Não faça geração paga apenas para testar conexão. Use outra solução quando houver necessidade comprovada, informando o motivo e preservando a direção aprovada. Montagem, motion em código, tipografia, som e revisão continuam etapas próprias.
