# Automação com evidências

Siga materiais e recursos → roteiro → storyboard visual → amostra de 10 segundos. Reaproveite respostas, anexos e decisões do projeto atual. Pergunte apenas o que falta e muda a execução. Prossiga com etapas independentes; não repita aprovações já dadas.

No kit completo, `npm run plan -- --preset arquivo.json --out projects/nome` cria um registro retomável, sem gerar mídia. Consulte `docs/AUTOMATION.md`. Registre estado e evidências em cada etapa. Um comando bem-sucedido não conclui revisão ou aprovação.

Antes de gerar, confirme a API HTTP direta do HeyGen, capacidade do modelo, referências, preço e saldo. O adaptador `scripts/heygen-clips.py` reserva custos localmente, impede reenvio automático e consulta a cobrança; ele não oferece teto de gastos no provedor. Não herde orçamento de outro projeto. Inclua tentativas e correções no orçamento autorizado, mantenha reserva quando a cobrança for desconhecida e não provoque recarga automática sem autorização.

Se o usuário escolher manter HeyGen, uma limitação exige proposta de outra execução no HeyGen para aprovação. Não substituir provedor ou simplificar o efeito silenciosamente. Tipografia, interfaces demonstrativas e montagem podem ser executadas em código sem trocar o gerador de clipes.

Em cada ficha do atlas, diferencie referência visual sem prova audiovisual, amostra executada com revisão pendente e arquivo aprovado. A revisão técnica é do agente; a aprovação criativa é do usuário. Registre método, escopo e hash. Não atribua aprovação a toda uma categoria com base em um teste. Mantenha a produção completa bloqueada até a aprovação prevista no projeto.
