# Referência visível → execução verificável

O objetivo é a maior fidelidade possível, nunca garantia de resultado idêntico. Uma conexão ativa não prova capacidade de reproduzir determinado mecanismo; um prompt detalhado não é prova de execução. Este protocolo vale para todo estilo, inclusive se a skill estiver isolada do kit.

## Primeiro contato fácil

Abra o manifesto do pedido e os quatro arquivos individuais. Registre quais abriu e as características observadas, sem inventar observações quando a ferramenta não permite ver imagens. Links inacessíveis: peça PNGs pelo anexo normal. Só continue etapas que não dependam do material ausente. Preserve IDs, versão e hash local das referências. Originais reais têm prioridade sobre exemplos fictícios. Explique em poucas frases o que será preservado, o que será adaptado ao tema e o que precisa de teste.

Use **Agora / Entrega / Preciso de você / Próximo passo**. Aproveite respostas anteriores, agrupe até três decisões textuais essenciais e mostre os arquivos antes de pedir Aprovar ou Ajustar. Não exponha um checklist técnico gigante nem obrigue o usuário a escolher APIs. Não diga que criou agentes separados sem execução real: pesquisa, direção, produção, edição e revisão são responsabilidades que o mesmo agente pode cumprir.

## Escolher a rota de cada plano

- **Filmagem real:** originais licenciados/autorizados; montagem, cor, tracking e texto editável preservam o sujeito. Filmar ações faltantes ou pedir cobertura; não fabricar vista oculta.
- **Imagem para vídeo:** criar/adaptar quadro individual para o formato alvo, comparar e validar antes de animar. Passar o arquivo no campo de referência do endpoint. Confirmar upload/asset_id, resolução, proporção e limites. Anexo no chat não significa asset recebido pela API. Não usar colagem nem depender de texto sozinho para aparência crítica.
- **Referências múltiplas:** somente em endpoint cuja documentação atual confirme os campos, quantidade e função dos arquivos. O adaptador 2.6 aceita até nove imagens locais PNG/JPEG de até 5 MiB cada; referências de áudio/vídeo continuam fora dele.
- **Interfaces, gráficos e tipografia:** código editável ou capturas autorizadas; valores e ações conferidos. Gerador de vídeo não é responsável por letras exatas, dados ou widgets funcionais.
- **3D/360 e oclusão:** geometria/rig/cobertura suficientes e iluminação coerente. Blender disponível não comprova que o modelo existe. Sem cobertura, limitar câmera ou propor outra execução para aprovação.
- **Composição híbrida:** proteger produto/pessoa/logo/rótulo em camadas; gerar ambiente separado quando adequado. Confirmar se perspectiva e movimento permitem integração convincente. Não achatar o produto protegido numa nova geração esperando que permaneça exato.
- **Avatar:** autorização específica, consentimento do provedor quando aplicável, identidade e voz testadas. Nunca habilitar avatar só porque o provedor o oferece.

HeyGen pela API direta continua prioritário para clipes compatíveis. A edição pode usar código, FFmpeg e composição local. Essa preferência não torna um serviço competente para qualquer efeito. MCP e API direta podem ter contas, limites e contratos diferentes. No kit, `heygen-clips.py` aceita 5–15 s, texto, imagem inicial ou até nove referências de imagem; isso não é o limite universal do HeyGen. Sem suporte à direção, explicar e propor alternativa dentro da preferência do usuário. Não trocar provedor ou simplificar silenciosamente.

## Estado de capacidade com evidência

Para cada recurso necessário, registre ferramenta/endpoint/modelo/modo, data, escopo local/remoto, autenticação, compatibilidade documentada, evidência e limitações. Diferencie **anunciada**, **autenticada**, **compatível** e **testada em mídia**. Consulta de conta é só autenticação. Execução bem-sucedida ainda exige revisão artística. Não use conta, orçamento ou consentimento de outro projeto. Conexões mudam entre desktop, navegador e usuários; revalidar na sessão de produção. Não chamar APIs de geração apenas para testar conexão.

## Plano verificável e bloqueio de execução

Preencha `templates/fidelity-plan.json`, mantendo mídia e informações privadas fora do Git. `references` contém `{id, role: "style"|"original", file, sha256, inspected: true, observations}`. `expectedReferences` identifica os quadros esperados pelo plano; todos devem estar presentes. `approvals` liga moodboard e storyboard aos arquivos/hash exatos e à decisão explícita do usuário.

`capabilities`: `{id, tool, mode, scope: "local"|"remote", authenticated, compatibility: "verified", checkedAt, evidence, limitations}`. Compatibilidade significa documentação/inputs conferidos; não certificação artística.

Cada item de `shots` precisa de `id`, `styleId`, `referenceIds`, `originalReferenceIds`, `initialState`, `action`, `result`, `camera`, `transition`, `narration`, `audio`, `preserve` (lista), `editableText: true`, `realSubject` (booleano), `route` e `capabilityId`. Rotas: `image_to_video`, `reference_to_video`, `footage`, `code`, `3d`, `composite`, `text_to_video`. Registre “sem locução”/“sem música” com motivo quando adequado, sem inventar fala. Durações reais seguem a locução, nunca divisão uniforme.

Para imagem para vídeo, `initialFrame` tem `file`, `sha256`, `approved: true` e `comparisonEvidence`. Texto para vídeo só em plano sem aparência crítica, com `appearanceCritical: false` e `appearanceExceptionApproval` explícito. Um desvio só deixa de bloquear quando resolvido ou aceito com `userDecisionEvidence`.

No kit:

```sh
npm run fidelity-check -- projects/exemplo/fidelity-plan.json --phase sample
npm run fidelity-check -- projects/exemplo/fidelity-plan.json --phase final
```

O adaptador pago exige no job `fidelityPlan` (caminho relativo ao job), `shotId` e `productionPhase` (`sample` ou `final`). Antes da API, verifica registros, integridade dos arquivos e se o job usa o quadro aprovado. Dry-run não gera mídia nem aprova o plano. Chamadas feitas fora do adaptador não são interceptadas: o agente deve aplicar os mesmos controles manualmente. O validador não vê imagens nem confirma a veracidade de observações escritas; não o apresente como avaliação criativa automática.

## Comparação e entrega

Depois dos dois aceites visuais, amostra de 10 s da ação e transição mais difíceis. Mostre referência → storyboard → quadros do início/meio/fim lado a lado, junto do vídeo reproduzível. Assista e escute integralmente; inspecione mudanças de ângulo, identidade, textura, física, rótulo, letras, foco, flicker, voz e mixagem. Registre divergências concretas e as quatro travas. Peça aprovação para o hash/versão exatos. Não use similaridade de pixels ou nota de IA como prova de identidade; imagens bonitas não comprovam movimento.

`sample` registra vídeo/hash, justificativa, comparações com hashes, playback, listening, locks e decisão do usuário vinculada ao mesmo hash. Para `final`, o validador exige esses registros além dos materiais e aceites. Repita a revisão em todos os planos; o aceite da amostra não libera desvios posteriores. Sem acesso real a playback/escuta, marque pendente e solicite revisão do usuário, sem alegar que foi feita. Entregue MP4, legendas/textos editáveis, projeto, fontes e pendências honestas. Ferramentas e agente não garantem reprodução idêntica.

## Mudança após aprovação

Depois de completar e apresentar a direção, calcule `npm run fidelity-check -- projects/exemplo/fidelity-plan.json --fingerprint`. Registre o resultado em `approvals.storyboard.directionSha256` somente após o aceite explícito daquela direção. O hash inclui referências, quadros aprovados e planos; mudar ação, câmera, ferramentas ou arquivos invalida o vínculo. O aceite da amostra registra também `sample.userApproval.directionSha256`. Não recalcular e reaproveitar um aceite antigo: reapresente mudanças materiais. O hash é controle de integridade, não assinatura autenticada nem prova de que o usuário aprovou; a decisão continua exigindo evidência real.

## HeyGen: campos de direção

Documentação consultada em 12/11/2026: https://developers.heygen.com/docs/models/heygen-video.md. No kit 2.6, `reference_to_video` recebe `referenceImages` (arquivos locais); o plano lista `inputReferenceIds` na mesma ordem. O adaptador envia `reference_images` em base64 e o verificador compara hashes e ordem. Use `<Picture 1>`, `<Picture 2>` no prompt com papel explícito: identidade/original, cenário ou aparência. Não prometa identidade perfeita. Referências de vídeo/áudio precisam de outro adaptador documentado, sem omissão silenciosa.

`prompt_enhancement` fica `disabled` por padrão para evitar reescrita silenciosa da direção detalhada. Outro valor exige `enhancementApproval` explícito no job e registro da decisão. Isso não torna o modelo determinístico. Seed, quando disponível, ajuda rastreio mas não garante igualdade. O modelo gera áudio próprio: defina se será aproveitado como foley/ambiente ou removido para locução controlada; não sobreponha vozes/músicas acidentais. Legendas exatas continuam em código editável. Os limites e preços da documentação/API prevalecem; não extrapolar os limites conservadores do adaptador para todos os endpoints. Novos modos foram verificados contra documentação e testes locais, não por geração paga nesta revisão.

O plano de cena gerativa registra também `generationPrompt` exato, `durationSeconds` (5–15 no adaptador) e `generationSettings` com `model`, `resolution`, `aspect_ratio`, `prompt_enhancement` e seed quando usado. O job precisa coincidir: não aprovar uma direção e enviar outra à API. Os campos entram no fingerprint do aceite. Selecionar parâmetros segue os inputs e o orçamento confirmados, sem fixar uma resolução cara por padrão.
