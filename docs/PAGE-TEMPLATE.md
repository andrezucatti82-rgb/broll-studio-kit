# Galeria em uma Page da sua conta

Use este roteiro com um agente que tenha as ferramentas Pages. Não cole identificadores da Page pessoal de outra pessoa.

1. Leia a skill Pages e a documentação de visualizações disponível na sessão.
2. Crie uma Page pessoal, inicialmente privada, para seu briefing.
3. Gere o HTML com `python style-atlas/records/build_page.py` (requer `beautifulsoup4`). A galeria usa assets públicos do atlas; confira o endereço em `build_page.py` se hospedar uma cópia própria.
4. Insira `style-atlas/records/page-embed.html` com a ferramenta de visualização da Page. O HTML deve ter menos de 256 KiB. A produção usa `window.openai.setWidgetState` quando suportada, sem chaves no navegador.
5. Inclua um bloco nativo `codex-prompt` com o pedido abaixo. Abrir a Page não executa o pedido; o usuário aciona o botão nativo.
6. Teste salvar/ler o estado no ambiente real. Não afirme que um teste com host simulado prova execução no ChatGPT. Se o estado não estiver disponível, peça o preset ou pedido copiado.

Texto para o bloco nativo:

> Leia o estado atual da galeria: modelContent.selectedStyles, topic, brand, format, typography e firstDeliverySeconds; leia audio, requirements e preset de cada estilo. Peça apenas tema/estilo ausentes. Aplique video-multimarcas se disponível, sem alegar instalação inexistente. Verifique ferramentas, pesquise fontes e entregue roteiro, storyboard visual e vídeo de 10 segundos para aprovação. Não produza o vídeo completo antes da aprovação. Preserve produto/rótulo, arquitetura/vista e interface/dados. Fotos isoladas não provam 360°, drone ou caminhada contínua. Avatar somente com autorização e identificação sintética. Use voz, música e SFX autorizados; texto editável e legível. Informe bloqueios e revisão pendente quando faltar capacidade. Não publique em redes sociais nem use contas, marca ou voz de outro projeto.

O estado contém o briefing e pode ficar acessível a quem tiver acesso à Page. Não compartilhar dados de cliente sem autorização. O site externo continua oferecendo cópia manual do pedido para qualquer conta, sem depender desta integração.
