# Produção retomável e HeyGen direto

O fluxo é **materiais e recursos → roteiro → storyboard visual → amostra de 10 segundos → revisão técnica → aprovação do usuário**. O atlas informa os requisitos e o estado de cada direção. Uma imagem de referência não comprova que o vídeo daquele estilo já foi executado.

## Retomar sem refazer o briefing

Baixe o preset no atlas e execute, no repositório completo:

```sh
npm ci
npm run plan -- --preset caminho/video-multimarcas-preset.json --out projects/meu-video
```

O comando cria `brief.json`, `production.json` e `START.md`. Ele organiza as etapas; não gera mídia. Repetir o comando com o mesmo preset preserva todos os arquivos e evidências. Um preset diferente exige outro diretório. Abra `START.md` no seu agente, que deve aproveitar respostas e arquivos existentes e trabalhar a partir da primeira etapa incompleta. Instalar a skill não instala ferramentas nem transfere créditos ou autorização de outra conta.

## Gerar um clipe pela API HTTP do HeyGen

Requer Python 3, acesso de rede e `HEYGEN_API_KEY` configurada como segredo no ambiente. Nunca cole a chave no chat ou no preset. Consulte a documentação atual do modelo e confirme preço, referências, saldo e direitos antes de executar. O adaptador atual suporta apenas `heygen-video-1`, `text_to_video` ou `image_to_video`, de 5 a 15 segundos. Outros endpoints exigem adaptação e validação próprias.

Crie em `projects/meu-video/` um `job.json`, por exemplo:

```json
{
  "model": "heygen-video-1",
  "mode": "image_to_video",
  "firstFrame": "quadro-validado.png",
  "prompt": "Direção específica, ação, limites de fidelidade e áudio aprovado para este projeto.",
  "duration": 10,
  "resolution": "1080p",
  "prompt_enhancement": "disabled",
  "reserveUSD": 2
}
```

Crie `budget.private.json` no mesmo diretório:

```json
{
  "limitBRL": 20,
  "planningBRLPerUSD": 7,
  "pricingBasis": "SUBSTITUIR pela fonte, data e preço verificados para este modelo e configuração",
  "jobs": []
}
```

**Valores apenas ilustrativos:** orçamento, câmbio conservador e reserva devem refletir a autorização e os preços do projeto atual. A reserva local não constitui teto de cobrança imposto ao provedor. Confira também limites da conta e recarga automática. A autorização financeira de um projeto nunca migra para outro.

```sh
# Planeja e valida arquivos/orçamento, sem gerar e sem consumir créditos:
python3 scripts/heygen-clips.py submit projects/meu-video/job.json --ledger projects/meu-video/budget.private.json
# Somente com geração e orçamento autorizados:
python3 scripts/heygen-clips.py submit projects/meu-video/job.json --ledger projects/meu-video/budget.private.json --execute
# Consulta, reconcilia cobranças e baixa quando concluído:
python3 scripts/heygen-clips.py status projects/meu-video/job.json --ledger projects/meu-video/budget.private.json --download
```

O cliente usa bloqueio do registro, reserva anterior ao envio e chave de idempotência; não reenvia automaticamente jobs de resultado desconhecido. Falha/timeout mantém a reserva até reconciliação. Não apague o registro para tentar de novo: consulte logs e estado no provedor. O cliente verifica saldo USD e bloqueia quando a reserva alcançaria o limiar conhecido de recarga automática. Isso não controla gastos concorrentes feitos fora do cliente nem garante o preço futuro do provedor.

Faça uma tentativa por direção; examine o resultado antes de corrigir. Quando o HeyGen não sustentar a execução ou fidelidade, informe a limitação e proponha uma execução alternativa no mesmo provedor para aprovação, respeitando a escolha do usuário. Não trocar silenciosamente de gerador.

## Evidência e publicação

Guarde originais, quadro inicial individual validado, roteiro, storyboard, mídia, hashes, custos e revisão no projeto. UI e texto podem ser compostos em código; uma interface fictícia deve ser identificada. Verifique imagem, clipe e acabamento; informe o que não foi possível avaliar. Decodificação, contato de quadros, transcrição e LUFS não equivalem a playback e escuta completos. Sem estes, mantenha `review_pending`.

O selo de aprovação exige revisão técnica real e aprovação criativa do usuário para aquele arquivo exato. Não estenda a aprovação de uma amostra a todas as variações do estilo. Não publique registros privados de cobrança, IDs de conta, respostas brutas, credenciais ou mídia de clientes. O site público é uma biblioteca e prepara o pedido; não executa chamadas pagas nem consulta a conta do visitante.
