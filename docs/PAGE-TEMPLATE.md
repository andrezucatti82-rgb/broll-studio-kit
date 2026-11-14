# Galeria em uma Page da sua conta

Use este roteiro com um agente que tenha as ferramentas Pages. Não cole identificadores da Page pessoal de outra pessoa.

1. Leia a skill Pages e a documentação de visualizações disponível na sessão.
2. Crie uma Page pessoal, inicialmente privada, para seu briefing.
3. Instale as dependências com `python -m pip install -r style-atlas/requirements-build.txt`. Gere o HTML com `python style-atlas/records/build_page.py --asset-origin https://SEU-DOMINIO/PASTA-DA-EDICAO/`. Use a pasta pública real que contém `catalog.json` e `assets/`, incluindo o script `catalog-data-*.js` produzido pelo build. Publique esses arquivos antes de inserir o HTML na Page. `--output caminho.html` permite uma saída de preparação; sem essa opção, o destino é `style-atlas/records/page-embed.html`.
4. Insira `style-atlas/records/page-embed.html` com a ferramenta de visualização da Page. O HTML deve ter menos de 256 KiB. A produção usa `window.openai.setWidgetState` quando suportada, sem chaves no navegador.
5. Inclua um bloco nativo `codex-prompt` com o pedido abaixo. Abrir a Page não executa o pedido; o usuário aciona o botão nativo.
6. Teste salvar/ler o estado no ambiente real. Não afirme que um teste com host simulado prova execução no ChatGPT. Se o estado não estiver disponível, peça o preset ou pedido copiado.

Texto para o bloco nativo:

Gere o núcleo a partir da mesma implementação usada no pedido: `AtlasWorkflow.pagePrompt(catalogUrl)`, carregando guided.js e workflow.js. Use o endereço público verificado do catálogo. O texto recupera os campos compactos pelos IDs, aplica características/escopos, confere recebimento e orienta a conversa com o mesmo protocolo ChatGPT/Claude. Não crie um segundo prompt manual divergente. Se não conseguir recuperar os dados, peça o pedido completo copiado, sem inventar valores.

O estado contém o briefing e pode ficar acessível a quem tiver acesso à Page. Não compartilhar dados de cliente sem autorização. O site externo continua oferecendo cópia manual do pedido para qualquer conta, sem depender desta integração.
