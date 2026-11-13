# Combinar características dos estilos

A edição 2.8 permite escolher o que aproveitar de cada referência: tipografia de uma, iluminação de outra, textura de uma terceira e cores de uma quarta. O menu oferece busca, grupos e escolhas de aplicação. Você pode combinar até dez estilos e até 12 características por estilo.

No briefing, use o botão de características abaixo do nome de cada estilo. Marque as opções e indique onde entram: filme inteiro, abertura, detalhes, demonstração, encerramento ou momentos que serão propostos no roteiro. O resumo mostra o mapa escolhido. Características concorrentes no mesmo escopo precisam ser resolvidas antes do pedido. Uma substituição local explícita só atua no trecho indicado.

As características se distribuem entre direção completa, aparência, tipografia, câmera, movimento, montagem, elementos gráficos, pessoas e som. Imagem não comprova áudio ou movimento; o agente deve inspecionar uma referência adequada ou propor uma execução para aprovação. Aparência de fonte não garante o arquivo tipográfico exato. Os originais e a marca do projeto prevalecem.

## O que acompanha a produção

`styleContributions` acompanha o pedido, preset, ficha JSON e estado salvo. O gerador compartilhado aplica o protocolo aos 780 estilos, sem mudar IDs, imagens ou maturidade. Não é preciso reescrever 780 textos independentes para manter o mesmo contrato. O planejador transporta `styleCombination` para os registros de produção e fidelidade; `contributionBindings` deve associar cada escolha a planos, referências inspecionadas e decisões de execução.

O `fidelity-check` inclui o mapa na impressão digital da direção aprovada e recusa vínculos ausentes, referências de outro estilo, planos fora do escopo e imagem tratada como prova de áudio/movimento. Projetos existentes são retomados sem sobrescrever evidências. Fichas antigas mantêm os grupos amplos, cuja distribuição deve ser proposta antes da geração.

O modo Page usa widget state, sem localStorage. O site comum conserva a escolha localmente; exportação e importação permitem portabilidade. Instalar o pacote não atualiza automaticamente uma conta do ChatGPT ou outras superfícies.

## Verificação e limites

Testes automatizados verificam os 780 pedidos, escopos, conflitos, arquivos de planejamento, roundtrip, dados inválidos e invalidação dos aceites. Testes de navegador devem conferir o seletor, retorno do foco, teclado, persistência, downloads, importação e larguras desktop/mobile. Registre os resultados da execução antes de dizer que passaram.

Esses testes verificam transporte e regras, não a qualidade do vídeo. O teste audiovisual proposto é produzir, após aprovação dos visuais e orçamento, uma amostra integrada de 10 segundos combinando tipografia, luz, textura e cor, e comparar referências, storyboard e vídeo nas quatro travas. Não há autorização de novos créditos embutida no seletor.

## Resultado desta revisão

Passaram npm ci, check, 15 arquivos de testes Node e nove testes Python, validate e build da Page. O teste específico percorreu os 780 pedidos com iluminação isolada e direção completa. Chromium: quatro fontes/características, concorrência bloqueada, cancelar sem alterar, retorno do foco, download real de preset, importação de ficha e restauração. Conferidas larguras 320/375/768/1440 px. Page com bridge simulado e recursos remotos reais, sem localStorage. Dez estilos com 120 escolhas ocuparam 15.363 bytes de estado; fichas maiores recebem aviso, sem apagar a edição atual. O visualizador nativo da Page e geração audiovisual não foram verificados. [Registro](../style-atlas/records/style-contributions-2.8/review.json).

O kit inclui um [preset fictício com quatro fontes](../examples/contributions/four-sources.json). Para preparar seus registros locais, sem gerar mídia:

```bash
npm run plan -- --preset examples/contributions/four-sources.json --out projects/piloto-quatro-fontes
```

O teste real permanece bloqueado até criar e aprovar visuais concretos e confirmar orçamento. Compare o fluxo anterior e o novo nas quatro travas, usando o mesmo assunto, originais e duração. A amostra deve demonstrar a combinação e a passagem mais exigentes; registre o que ela não cobre. Não há promessa de fidelidade total.
