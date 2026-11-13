# Estilo principal compartilhado — 2.8.3

Galeria, assistente e briefing usam a mesma seleção. Ao abrir “Criar meu vídeo”, a etapa Aparência mostra o principal atual, mesmo quando ele não estiver entre as três sugestões. É possível continuar diretamente com essa escolha. As sugestões ficam separadas e recolhidas quando já existe principal; são calculadas localmente por tema/objetivo e não analisam automaticamente o site da marca.

“Trocar estilo principal” substitui explicitamente o principal e atualiza briefing, pedido e armazenamento imediatamente. Fechar o assistente não desfaz essa troca. Os complementares restantes e suas características/escopos são mantidos. Se a alternativa já era complementar, passa a ocupar o lugar do principal sem duplicação; o principal anterior é removido. Uma troca invalida os aceites dependentes, preservando o histórico. Características que concorram no mesmo escopo continuam exigindo resolução antes de preparar o pedido.

Os campos de tema, marca, materiais e duração no assistente são um rascunho até “Preparar meu pedido”. Reabrir reaproveita um rascunho quando o briefing original não mudou; se os campos foram atualizados fora do assistente, a versão mais recente do briefing prevalece. O principal nunca depende desse rascunho: vem da seleção compartilhada. Preparar não escolhe novamente nem apaga as contribuições existentes.

O modo Page usa a ponte de estado, sem localStorage. Atualizações recebidas da Page também renovam o principal mostrado no assistente aberto. O catálogo 4.3, seus 780 IDs, quadros e sua ordem não foram alterados. Os protocolos de produção e aprovação continuam iguais.

A revisão tem testes de regressão para a escolha fora das recomendações, atualização imediata, preservação de complementares, rascunho antigo, limite de dez, restauração e estado Page. O registro `style-atlas/records/guided-sync-2.8.3/` distingue verificação local, navegador com ponte Page simulada e publicação. Esses testes não certificam fidelidade audiovisual ou instalação de plugin na conta do usuário.
