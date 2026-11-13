# Aprovação visual antes de vídeo IA

Regra universal de produção: antes de qualquer geração de vídeo com IA, apresentar imagens concretas e obter aprovação visual explícita do usuário. Aplica-se a todos os provedores, modelos, estilos, marcas, avatares, B-roll, testes gratuitos, amostras e tentativas pagas. Não gerar primeiro para pedir aprovação depois. Roteiro, orçamento, voz, avatar escolhido e “pode continuar” não aprovam visuais que não foram apresentados.

## Painéis e sequência

1. **Moodboard:** referências, paleta, tipografia, textura, atmosfera; distinguir referência de composição proposta.
2. **Styleframes:** cenas representativas com o acabamento pretendido, texto legível, identidade, enquadramento, luz e proporções. Mostrar imagens reais, não apenas descrever ou salvar arquivos sem apresentá-los.
3. **Storyboard visual:** sequência completa com ação, enquadramento, passagem e relação com a fala. Uma tabela de roteiro não substitui os quadros.
4. Após aprovação visual, **animatic** com quadros aprovados, tempo e áudio identificado como provisório quando for o caso. Pode ser montagem local dos quadros, sem gerar vídeo IA. Não confundir ritmo aprovado com acabamento aprovado.
5. **Amostra integrada:** comprovar a cena mais exigente e sua transição, incluindo os componentes prometidos (por exemplo avatar, B-roll, motion, legendas e mixagem). Teste isolado de avatar não é amostra da edição. Conferir fidelidade aos styleframes antes de apresentar.
6. Filme completo somente após aprovação da amostra integrada. Revisar o arquivo inteiro com áudio antes de chamá-lo final.

**Shooting board** detalha câmera, lentes, luz e movimentos quando houver filmagem. **Beat board** resume momentos-chave. **Color script** mapeia a evolução de cor/luz. Usar esses painéis quando pertinentes; não obrigar sete documentos em um corte simples. Para um único clipe, a aprovação visual pode ser dos styleframes/enquadramentos daquele clipe. A regra de aprovação visual anterior à geração IA permanece em qualquer escala.

## Aprovação com escopo

Registrar material apresentado, versão/hash, escopo, mensagem literal do usuário e referência à mensagem. Separar `visual`, `script`, `voice`, `avatar`, `pacing`, `budget`, `animatic`, `integrated_sample` e `publication`. O agente não concede aprovação pelo usuário. “Gostei, continue” aprova apenas o material e os aspectos apresentados para aquela decisão. Reutilizar aprovações válidas sem perguntar novamente; nunca ampliar seu alcance.

Uma troca de aparência, composição, proporção, direção, voz ou modelo que altere o resultado exige reavaliar os aspectos afetados. Marcar aprovações dependentes como desatualizadas. Uma rejeição visual invalida a direção rejeitada; preservar arquivos e corrigir primeiro os quadros, sem gastar com regeneração em série. Não converter aprovações antigas booleanas automaticamente: recuperar evidência do histórico, sem inventá-la.

## Qualidade e revisão

Antes de gerar, conferir se a ferramenta suporta a direção. Não substituir silenciosamente B-roll ou motion prometidos por cartões, zoom de foto ou cortes genéricos para facilitar a implementação. Conferir legibilidade no tamanho de celular, hierarquia, margens seguras, escala de capturas, proporção de pessoas, continuidade e transições motivadas.

Decodificação, resolução, fps, hash e quadros extraídos são testes técnicos, não reprodução e escuta completas. Registrar revisão técnica, visual e sonora separadamente, vinculadas ao hash da versão entregue. Sem revisão contínua, manter `review_pending`; usar `candidate`/`previa` no nome, nunca `final`, `pronto` ou `concluído`. Revisão do agente não substitui aprovação criativa do usuário nem autoriza publicação.

## Checagem executável

O arquivo `workflow.json` é um registro separado do formato do editor. Use `templates/workflow.json` como modelo. Arquivos são relativos à pasta desse registro. Para conjuntos de quadros, use um PDF ou uma prancha que contenha todos os quadros apresentados; mudar qualquer quadro exige atualizar esse arquivo e sua aprovação.

`node scripts/workflow-gate.mjs ai-video caminho/workflow.json` antes de qualquer chamada de geração IA. `full-render` antes do filme completo. `deliver` com o caminho do MP4 antes da entrega final. No kit, o render completo chama a checagem automaticamente; geração externa por ferramentas continua exigindo esta verificação antes da chamada. As checagens não geram mídia, não aprovam pelo usuário, não gastam créditos e não conseguem verificar se um relato de revisão é verdadeiro. Não são um bloqueio global de todos os aplicativos.

O campo `visual` aponta à prancha de visuais aprovados; as aprovações de animatic e amostra registram os hashes dos insumos em `basis`. O campo `requiredComponents` deve refletir o briefing, sem omitir recursos prometidos para passar na checagem. O custo exige autorização separada mesmo quando o gate visual passa.
