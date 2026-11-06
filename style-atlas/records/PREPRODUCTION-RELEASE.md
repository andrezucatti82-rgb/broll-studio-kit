# Pré-produção visual — edição 2.3.0

Fluxo: materiais e roteiro → moodboard visual para aprovação → storyboard visual completo para aprovação própria → amostra de 10 segundos → revisão e aprovação → filme completo.

O pedido exige painéis visuais concretos, fontes e quadros individuais. O moodboard traduz conceito, atmosfera, paleta, materiais, luz e tipografia; o storyboard cobre todos os planos na sequência do roteiro, com ação, enquadramento, texto editável, transições e áudio. Nenhum deles comprova movimento, identidade ou atributos reais. Originais continuam prioritários.

Todos os 540 IDs e estados de maturidade foram preservados. O gerador do catálogo reaplica a política global. O site apenas prepara pedidos e guarda decisões declaradas pelo usuário; não gera mídia, inspeciona anexos ou observa o ChatGPT automaticamente. Um status colado não aprova os painéis. As novas aprovações e seu histórico sobrevivem à ficha JSON e ao estado do navegador. Projetos antigos recebem os marcos pendentes sem perder evidências anteriores. A skill registra versões exatas e decisões nos arquivos do projeto.

Verificações executadas: npm ci, npm run check, npm test, npm run validate; scripts de navegador browser-workflow.py e browser-preproduction.py; compilação do modo Page e teste da ponte simulada sem localStorage. Foram verificados importação antiga, rejeição de ficha inválida sem apagar o projeto, decisões independentes, bloqueio da aprovação da amostra até os painéis, correções, persistência e largura de 375 px. Pacotes, JSON, YAML e hashes de cada arquivo das duas skills foram conferidos.

Nenhum moodboard, storyboard ou vídeo de cliente foi gerado por esta alteração, nenhuma chamada de geração paga foi feita e nenhum acabamento audiovisual foi aprovado. A revisão do site não comprova a qualidade de futuros vídeos. O carregamento nativo da Page e a leitura dos novos arquivos por uma sessão antiga não foram inspecionados; a compilação e a ponte foram testadas em Chromium. Atualização do Codex local não comprova atualização dos plugins da conta do ChatGPT.
