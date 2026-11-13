# Produção guiada e coordenação

O modo guiado reduz as decisões iniciais a objetivo, aparência, materiais e preparação do pedido. Ele organiza o contexto de produção; não conecta contas, recebe uploads ou gera vídeo no site. A biblioteca completa continua disponível. Recomendações locais são sugestões explicáveis, não certificações de capacidade ou qualidade.

## Receber o pedido

Leia as escolhas guiadas, o briefing e os estilos completos, incluindo quadros, manifesto, receita e limitações dos materiais. Reutilize decisões e anexos existentes. Uma caixa marcada como “tenho fotos” é uma declaração do usuário: confira os arquivos efetivamente recebidos antes da etapa dependente. Se o usuário só trouxe a ideia, adote os padrões da skill e comece pesquisa/roteiro independentes.

Quando sugerir direções, mostre três alternativas adequadas com imagens, evolução da ideia e uma razão concreta ligada a objetivo, assunto, materiais e complexidade. A marca e o formato do projeto prevalecem sobre o exemplo fictício. Não apresentar uma sugestão como promessa de reprodução idêntica. Preserve um principal e os papéis dos complementares.

## Condução simples

Em cada resposta de trabalho, use um resumo curto:

- **Agora:** etapa e o que está sendo feito.
- **Entrega:** arquivo ou visual produzido, acessível para conferir.
- **Preciso de você:** somente materiais/decisões realmente faltantes; sem essa falta, diga que não há ação pendente.
- **Próximo passo:** ação concreta depois do aceite ou da resolução do bloqueio.

Agrupe até três decisões textuais indispensáveis. Arquivos são enviados pelo anexo normal do chat, nunca por um pop-up de upload prometido. O usuário não precisa escolher APIs ou preencher registros técnicos. O agente cuida das referências, ferramentas, versões, custos e integridade. Mostre a entrega antes de pedir **Aprovar** ou **Solicitar ajuste**. **Voltar** revisa a etapa e explicita os aceites afetados; não apaga arquivos nem histórico.

## Escolher execução conforme os materiais

- **Uma foto de produto:** proteger produto e rótulo, separar ambiente e texto quando necessário e restringir câmera/ação à cobertura conhecida. Não deduzir verso, interior ou rotação completa. Propor outro plano ou pedir cobertura adicional para uma ação impossível com a foto.
- **Várias fotos:** conferir que mostram a mesma variante e que os ângulos sustentam a passagem. Fotos isoladas não comprovam continuidade física.
- **Vídeos:** aproveitar ações, gestos e detalhes autorizados; registrar trechos, licença e limitações de resolução. Não substituir uma ação existente por geração desnecessária.
- **Capturas de software:** usar captura autorizada ou componentes editáveis conferidos. Dados demonstrativos precisam ser identificados; controles e funcionalidades devem ser reais.
- **Somente ideia/site/logo:** pesquisar fatos e identidade, explicar materiais necessários e gerar somente ativos autorizados. Um site ou logo não comprova pessoa, produto em todos os ângulos ou capacidade do gerador.

A rota final depende dos arquivos inspecionados e das ferramentas verificadas na sessão. Priorize HeyGen via API direta para clipes compatíveis; código, composição e edição podem executar outros elementos. Respeite `execution-fidelity.md`, os limites do adaptador e as autorizações existentes.

## Três receitas iniciais

Cada receita começa como **planejada**. Só pode receber evidência de teste depois de gerar, reproduzir, escutar, comparar e registrar os arquivos efetivos. Um pedido preparado, um teste de código ou uma conexão autenticada não certificam a receita audiovisual.

| Receita | Insumos principais | Prova representativa | Alternativa compatível |
| --- | --- | --- | --- |
| Anúncio de produto | Originais da variante, ficha verificável, CTA e marca quando houver | Ação com produto/rótulo e passagem mais exigente, 10 s | Composição do original protegido em ambiente separado, ou pedir vídeo/ângulos faltantes |
| Apresentação de serviço | Escopo, informações oficiais, diferenciais comprovados, materiais autorizados e CTA | Explicação visual do serviço com ação concreta e áudio, 10 s | Demonstração editorial identificada sem fingir depoimento, cliente ou resultado real |
| Interfaces e gráficos | Capturas atuais, fluxo real, dados autorizados/demonstrativos e marca | Mudança de estado legível e coerente, com texto editável e locução, 10 s | Reconstrução em código conferida ou gráfico explicativo, deixando clara sua natureza |

Em todas: materiais → roteiro → moodboard aprovado → storyboard aprovado → amostra de 10 s → revisão técnica e aprovação criativa → vídeo completo. A amostra prova a cena mais difícil; não precisa ser a abertura. O filme mantém sua duração alvo; tempos por plano vêm da locução, sem divisão uniforme.

## Coordenador e responsabilidades

Preencha `templates/coordinator-plan.json`. O coordenador mantém uma única fonte de decisões: briefing, referências, arquivos aprovados, etapas, pendências, receitas, orçamento e responsabilidades. Pode cumprir várias funções ou delegar partes quando houver benefício e suporte. Registre executor e evidência reais; não invente agentes, trabalho paralelo ou revisão independente.

| Responsabilidade | Entrada | Saída esperada |
| --- | --- | --- |
| Pesquisa | Tema, marca, fontes e materiais | Fontes/fatos verificáveis e lacunas |
| Roteiro | Fatos aprovados, público, objetivo e CTA | Locução, mensagem, estrutura e duração estimada |
| Direção | Estilos, quadros, identidade e roteiro | Moodboard e storyboard visuais; plano por cena |
| Produção | Planos/ativos aprovados e ferramentas verificadas | Ativos/clipes com origem, parâmetros, hashes e custo |
| Edição | Ativos, locução e plano | Montagem editável, texto/legendas, cor e áudio |
| Revisão | Referências e versão do arquivo produzido | Comparações, playback/escuta, falhas e quatro travas |

Use `projectRecords` para apontar para `shot-plan.json`, `style-execution-plan.json`, `fidelity-plan.json` e `preproduction-plan.json`. Em `sourceRecords` de cada cena, ligue os IDs ao plano e à verificação de fidelidade; não mantenha decisões conflitantes em cópias sem fonte. O template nasce em planejamento, com executores e ferramentas não atribuídos.

Por cena, ligue referência → invariantes → estado inicial/ação/resultado → câmera/transição → texto/locução/som → ferramenta/modo/inputs → critério de aceitação. Use os registros de fidelidade, shot plan e revisão existentes. Valide as dependências antes de iniciar a função seguinte.

## Ajustes por intenção

Traduza as palavras do usuário em mudanças verificáveis e mostre o impacto antes de executar:

| Pedido | Tradução de execução | Reavaliar |
| --- | --- | --- |
| Mais natural | Corrigir física, gestos, pele/material, tremor e ritmo; limitar movimentos à referência | Direção/ativos afetados, storyboard e amostra |
| Produto maior | Ajustar escala/enquadramento e área livre mantendo proporções e rótulo | Composição do storyboard e amostra |
| Menos efeitos | Retirar efeitos sem função, reduzir movimentos simultâneos e simplificar passagens | Storyboard/passagens e amostra |
| Voz mais rápida | Medir a locução, ajustar ritmo com pausas naturais e sincronizar legendas/planos | Áudio, duração e amostra; roteiro se o conteúdo mudar |
| Texto mais legível | Rever fonte licenciada, tamanho, contraste, margens e tempo de leitura no celular | Texto editável e amostra |
| Mais próximo da referência | Apontar divergências de paleta, luz, escala, material, foco e ação e corrigir as pertinentes | Direção/ativos afetados e amostra |

Essas instruções não autorizam alteração física de pessoa, produto real ou informação factual. Registre a decisão, os arquivos afetados e os aceites que voltam a pendente. Preserve versões anteriores. Não marque “aprovado” por status colado, silêncio ou autorização genérica.

## Continuidade e pacotes

O pacote pode reunir briefing, estilos, referências/links, materiais declarados/solicitados, pedido, receita, decisões, histórico e próxima ação. Links não são os arquivos originais anexados ao chat. Diga o que está incluído, o que deve ser reenviado e quais aprovações permanecem vinculadas à mesma versão. Nunca incluir tokens, senhas, saldos privados ou dados de clientes no pacote público.

Na retomada, conferir versão e integridade, reutilizar os aceites comprovados e continuar da primeira dependência pendente. O site só conhece escolhas e informações salvas/importadas; não acompanha a produção na conversa. O modo Page mantém estado pelo mecanismo da Page e não usa localStorage. Ficha inválida deve ser recusada com o projeto atual preservado.

## Custos e bloqueios

Conferir conta, autenticação, modo, arquivos e orçamento antes de gastar. Use as estimativas históricas apenas para planejamento, com data e exclusões. O valor real é confirmado na conta e pode incluir voz, montagem, resoluções e tentativas diferentes. Não herdar o orçamento de outro projeto.

Se faltar capacidade, explicar etapa, causa verificada ou desconhecida, entrega existente, ação necessária e uma alternativa com impacto. Não simplificar a direção nem trocar de provedor silenciosamente. Antes de testes pagos, apresentar caso concreto e estimativa para autorização. A receita segue planejada até existir resultado audiovisual revisado e aprovado.
