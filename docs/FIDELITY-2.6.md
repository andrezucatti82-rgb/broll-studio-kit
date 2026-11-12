# Fidelidade e execução por etapa · 2.6.0

Revisão de 12/11/2026. Os 780 estilos, IDs, imagens e readiness foram preservados. O objetivo é aproximar a produção da direção escolhida com evidências e aprovações; nenhuma ferramenta garante reprodução idêntica.

## O que mudou

- O pedido leva a URL completa do catálogo e um manifesto com URLs dos quatro quadros de cada estilo. Caminhos relativos sozinhos não bastavam para outra conversa recuperar imagens. O agente deve confirmar quais imagens inspecionou, ou solicitar os PNGs se o acesso falhar.
- Todo pedido orienta referência → características observadas → plano → ferramenta/modo → assets → teste → comparação. A escolha da ferramenta depende da cena, preservando a API direta HeyGen como prioridade para clipes compatíveis.
- A condução usa Agora / Entrega / Preciso de você / Próximo passo. Na revisão do pedido há uma explicação compacta de como preservar o estilo; os detalhes técnicos ficam recolhidos.
- `fidelity-plan.json` registra referências com hash, observações, aprovações, ferramentas, planos e desvios. `npm run fidelity-check` verifica arquivos e registros, aceita somente o quadro/referências corretos do job e invalida o aceite quando a direção muda.
- O adaptador HeyGen exige esse controle antes da API paga. Há suporte documental e testes locais para até nove imagens de referência, com ordem e hashes conferidos. Referências de áudio/vídeo não implementadas são recusadas. O aprimoramento automático do prompt fica desativado por padrão; sua ativação exige decisão explícita.
- Para avançar ao filme completo, o registro exige amostra de 10 s, comparação lado a lado, playback, escuta, quatro travas e aceite do arquivo/direção exatos. Chamadas fora do adaptador dependem da aplicação do protocolo pelo agente; o site público não intercepta APIs.
- O diagnóstico local distingue ferramenta ausente de execução não verificada por permissão. Isso evita orientar uma instalação desnecessária quando o problema é o ambiente.

## Conexões e recursos conferidos nesta sessão

| Recurso | Evidência | Limite da conclusão |
| --- | --- | --- |
| HeyGen API direta | GET autenticado de conta respondeu; carteira consultável | Não houve geração nem certificação de qualidade |
| HeyGen MCP | Duas conexões responderam; apontam para a mesma conta MCP; capacidades de voz incluem português | Não são duas contas de produção independentes; não transferir saldo/consentimento para API direta |
| Modos HeyGen | Documentação oficial consultada e payloads testados localmente | Modo de referências não foi testado com geração paga nesta rodada |
| FFmpeg/FFprobe, Chromium e Blender | Comandos de versão executados | Não comprova modelos 3D, render final ou revisão audiovisual |
| Node/Remotion | Dependências e testes do kit | Não comprova execução artística de cada um dos 780 estilos |
| Geração de imagens, pesquisa e ferramentas alternativas | Ferramentas anunciadas na sessão | Não chamadas para produção nesta revisão; autenticação/custo/capacidade devem ser revalidados quando necessários |
| Plugin Multimarcas no ChatGPT | Busca e listagem não localizaram correspondência exata editável | Não afirmar instalação/atualização na nuvem nem alterar um plugin parecido |

Nenhum identificador privado, saldo, voz, token ou resposta bruta de conta foi incluído no repositório. A API direta e o MCP foram consultados apenas por leitura. Não foram gerados vídeos, vozes ou novas imagens.

Fonte técnica: [HeyGen Video](https://developers.heygen.com/docs/models/heygen-video.md), consultada em 12/11/2026. A documentação distingue imagem inicial, referências múltiplas, áudio próprio do clipe e aprimoramento de prompt. Não assumir os mesmos limites entre MCP, API e adaptador local.

## O que ainda precisa ser comprovado

O validador não vê imagens, não ouve áudio e não autentica uma afirmação escrita de aprovação. Ele detecta lacunas e alterações de arquivos/direção. O agente e o usuário ainda precisam fazer comparação visual e audiovisual real. Também não foi feita nesta rodada inspeção manual dos 3.120 quadros nem teste em vídeo de todos os estilos.

O teste criativo recomendado é escolher um estilo sem vídeo, preparar originais e uma cena exigente, aprovar moodboard/storyboard e gerar a amostra pelo fluxo novo. Comparar as quatro travas com o fluxo anterior, com custo previamente autorizado. Esse teste não foi executado.

## Verificação desta edição

`npm ci`, `npm run check`, `npm test` (12 arquivos Node e sete testes Python), `npm run validate` e build da Page. O teste dos 780 pedidos confere manifesto, URLs dos quatro quadros, protocolo e neutralidade de marca. Testes do controle cobrem arquivos alterados, referência faltante, origem real ausente, compatibilidade pendente, troca de prompt/quadro, direção modificada e aceite antigo. O teste Python confirma que a API não é chamada sem o registro obrigatório.

A execução da Page com recursos remotos reais revelou bloqueio CORS no fetch de `fonts.json`, que impedia concluir a inicialização. O build agora inclui os metadados das fontes na Page; os arquivos de fontes continuam usando suas URLs de origem compatíveis. O teste anterior com roteamento de arquivos candidatos não detectava esse problema.

Chromium local: pedido com URLs completas, explicação recolhida, 375 e 1440 px sem overflow e Page com bridge simulado sem localStorage. O diagnóstico inicial executado no sandbox produziu EPERM para comandos instalados; a checagem autorizada fora dessa restrição confirmou os executáveis. Não confundir uma execução bloqueada com falta da ferramenta.
