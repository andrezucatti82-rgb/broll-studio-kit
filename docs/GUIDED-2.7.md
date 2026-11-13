# Produção guiada · 2.7.0

O modo opcional “Criar meu vídeo” organiza a preparação em Objetivo → Aparência → Materiais → Preparar produção. O catálogo completo continua acessível, com os mesmos estilos, IDs e imagens. As sugestões locais ajudam a escolher; o agente verifica os recursos e os originais na conversa de produção.

## Percurso de exemplo

Uma pessoa quer divulgar uma joia artesanal e possui uma foto. Ela informa o objetivo e o assunto, compara três opções visuais e declara seu material. O pedido registra uma execução com o original protegido, sem prometer verso ou rotação completa. Na conversa, o agente confere a foto, apresenta roteiro e moodboard, depois storyboard e amostra de 10 segundos com aprovações separadas. O filme completo depende do aceite da amostra.

A pessoa pode continuar usando a biblioteca diretamente e combinar estilos. As referências externas removidas anteriormente não fazem parte desse percurso.

## Conteúdo desta edição

- Recomendações explicáveis conforme objetivo, assunto, materiais e complexidade.
- Três receitas iniciais planejadas: produto, serviço e interfaces/gráficos.
- Orientação de produção compatível com uma foto, várias fotos, vídeo, capturas ou somente ideia.
- Responsabilidades compartilhadas de pesquisa, roteiro, direção, produção, edição e revisão, registradas pelo coordenador.
- Ajustes por intenção, com descrição concreta da mudança e dos aceites afetados.
- Continuidade com briefing, referências, materiais declarados/solicitados, decisões, etapa atual, histórico e próxima ação.
- Estimativas de recursos/custo com fonte e exclusões; cada pessoa usa sua própria conta.

O site permanece público e estático. Arquivos são enviados na conversa do ChatGPT. Preparar ou copiar o pedido não dispara geração, consulta saldo nem conecta ferramentas. A Page usa seu mecanismo de estado, sem localStorage. A ficha informa o que foi salvo ou importado; não observa a produção por conta própria.

## Receitas e critérios

| Receita | Materiais a conferir | Critérios da amostra |
| --- | --- | --- |
| Anúncio de produto | Variante original, ficha verificável, marca e destino da CTA | Aparência próxima da direção; ação concreta; rótulo/produto preservados; voz/legendas/CTA quando previstos |
| Apresentação de serviço | Escopo oficial, diferenciais comprovados e materiais autorizados | Serviço compreensível; ação ilustrativa identificada; sem clientes/depoimentos ou resultados inventados; áudio e texto claros |
| Interfaces e gráficos | Capturas atuais, fluxo real e dados autorizados ou demonstrativos | Estados e relações coerentes; texto editável legível; ações e métricas conferidas; locução sincronizada |

Todas começam como **planejadas**. O [plano dos três testes](three-recipe-tests.json) contém marcas fictícias, cenas exigentes, materiais a preparar e base de custo. Não comprova geração ou acabamento. Não houve autorização de gasto por esse documento.

## Operação pelo agente

A skill neutra passa a incluir [produção guiada](../.agents/skills/video-multimarcas/references/guided-production.md) e `coordinator-plan.json`. O coordenador pode cumprir várias responsabilidades ou delegar quando houver benefício e suporte. Cada executor e evidência são registrados; a existência de uma função no plano não comprova que um agente separado foi executado.

As regras de preservação de identidade, originais, texto editável, referências inspecionadas, controle de fidelidade e quatro travas continuam valendo. A amostra prova a ação mais difícil, com comparação visual, playback e escuta reais. Uma conexão ativa ou teste de código não certificam a execução artística.

## Verificação e publicação

Verificações locais executadas: npm ci, npm run check, npm test (13 arquivos Node e oito testes Python), npm run validate e build da Page. Chromium: três percursos guiados, sugestões com imagens, pacote exportado/reimportado, ajustes, restauração, 320/375/768/1440 px sem overflow e Page com bridge simulado, recursos remotos reais e localStorage proibido. A Page compilada preserva os botões do assistente; o visualizador nativo do ChatGPT não foi certificado. Os três presets de teste também prepararam registros locais de produção e coordenação, sem mídia gerada. Veja [os presets executáveis](../examples/guided/README.md). A publicação será registrada no recibo desta edição. A geração paga dos três casos continua dependendo da apresentação do teste e autorização de custo, seguida das aprovações visuais e da revisão audiovisual.

A instalação é por superfície: atualizar repositório/pacotes não confirma a instalação de um plugin na conta do ChatGPT. A skill pessoal Video B-roll permanece separada. A identidade GDA pertence à interface; receitas, presets e instruções reutilizáveis são neutros.

## Publicação e pendências desta entrega

O domínio principal concluiu a rotina de publicação 43311927878. Uma consulta pública sem cache retornou HTTP200, o release `atlas-20261112213652` e os controles/módulos do modo guiado. A Page foi atualizada até a sequência60, e a instalação local do Codex2.7.0 foi confirmada antes da interrupção.

O espelho permanece na versão anterior: seu endpoint Git retornou502 e o ambiente de execução ficou indisponível antes da nova tentativa. A verificação interativa pós-publicação também ficou pendente; os testes completos de navegador foram executados localmente antes da interrupção. O plugin da conta de nuvem não teve instalação confirmada. Nenhuma geração de vídeo, voz ou imagem foi executada.

O [recibo de publicação](../style-atlas/records/guided-2.7/publication.json) registra esses estados. Para retomar no ambiente: preservar alterações locais, atualizar a branch por fast-forward quando possível, enviar app.js, workflow.js, index.html, app-shell.css, guided.js e guided-ui.js ao espelho, publicar sua versão e repetir os testes online. Não gerar os três casos pagos sem preço/escopo autorizados e aceites visuais.

## Conferência posterior e menu simplificado

O menu lateral passou a usar ícones uniformes nos atalhos de estilos. O site principal e a Page foram atualizados. A navegação e as imagens da galeria foram conferidas no domínio publicado em desktop e celular. Os três percursos guiados também passaram pela verificação interativa online, concluindo essa pendência da entrega anterior. O repositório foi renomeado para `studio-kit-pro`; remoto, links atuais de instalação e configuração de futuras publicações foram ajustados.

O espelho foi preparado em commit e arquivo locais, mas o serviço Sites Git informa indisponibilidade para este cliente. Ele ainda não foi enviado nem publicado; o arquivo de preparação não constitui uma versão online. Recibo: `style-atlas/records/sidebar-icons/publication.json`.
