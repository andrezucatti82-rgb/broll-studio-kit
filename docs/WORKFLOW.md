# Da temática a uma peça revisada

1. **Entrada e pesquisa:** receba tema e marca opcional. Registre fontes, identidade observada e limites.
2. **Direção:** analise referências realmente acessíveis; prepare conceitos visuais, roteiro e dashboard. Ofereça três direções quando houver escolha de estilo.
3. **Locução e plano de cenas:** gere/obtenha voz autorizada, escute uma amostra e meça duração. Preencha `shot-plan.json` com ação interna, estado inicial/final, enquadramento, camadas, iluminação, câmera, transição e som. Tempos vêm dos acontecimentos e da fala.
4. **Prova da parte difícil:** produza o plano mais exigente e sua passagem com voz e som. Confira o movimento antes de replicar a abordagem no filme inteiro.
5. **Produção:** imagens grandes, filmagens/capturas/geração temporal quando a ideia exige ação, recortes ou geometria para profundidade. Mantenha prova e procedência dos assets.
6. **Render candidato:** valide arquivo e configuração. Um render concluído não significa aprovação artística.
7. **Revisão integral:** playback contínuo, escuta e leitura em celular, além da inspeção de quadros e medições. Corrija problemas, gere novo arquivo e atualize a revisão vinculada ao hash.
8. **Entrega/publicação:** identifique o estado real. Sem revisão audiovisual, entregue prévia com pendências; não promova automaticamente a exemplo de qualidade.

## Arquivos de trabalho

`npm run new` cria `brief.json`, `shot-plan.json`, `review.json` e `START.md` na pasta do novo projeto. O agente precisa preencher os dois primeiros com pesquisa e direção; a revisão só é preenchida após avaliação real. Nenhum desses arquivos implica pesquisa ou revisão automática.

A configuração de render está documentada em [MIGRATION-2.md](MIGRATION-2.md). O rascunho `templates/project.json` usa quatro planos de tempos diferentes apenas para exercitar o formato; não é roteiro, padrão de montagem nem exemplo de qualidade. Nunca copie seus tempos para a produção por conveniência.

## Verificar o registro da revisão

```bash
python scripts/verify-video.py projects/projeto/candidate/video.mp4 --out projects/projeto/technical.json
npm run review -- projects/projeto/candidate/video.mp4 projects/projeto/review.json
```

Use o SHA256 do relatório técnico no registro de revisão. `review` exige evidências técnicas, playback integral, escuta integral, observações dos oito critérios criativos e ausência de bloqueadores abertos. Essa checagem só valida o registro; não verifica a veracidade das observações nem substitui quem assiste e escuta.

Sem ferramenta capaz de assistir/escutar, marque `review_pending` e peça apenas a participação necessária para essa avaliação. Uma autorização de publicação com limitação registrada não converte revisão pendente em revisão realizada.

## Portabilidade

A pasta da skill pode ser instalada separadamente, preservando `references/`, `templates/` e `agents/`. O repositório completo é necessário para o renderer e os comandos. Não substitua a skill pessoal de outra marca. Não há conteúdo pessoal, tokens ou voz privada incluídos.
