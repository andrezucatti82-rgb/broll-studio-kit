# Vídeo Multimarcas

**Skill pública de uso geral.** Identificador: `video-multimarcas`. Adapta cada produção à marca informada; não carrega identidade ou voz pessoal como padrão.

**Uma temática vira um vídeo narrado, com pesquisa e identidade adaptada à sua marca.** Skill para agentes de IA, acompanhada de código editável para produção.

Informe o assunto. Opcionalmente, acrescente o nome da marca, logotipo ou site. O agente pesquisa, desenvolve roteiro e direção, prepara mídia, monta, revisa e entrega o vídeo. Sem avatar por padrão; câmera livre, imagens grandes e movimento com propósito.

[**Instalação completa com sua própria conta**](docs/START-HERE.md) · [**Galeria GDA Vídeos**](https://videos.gerenciadordeanuncios.com.br/)

[Baixar a skill](dist/video-multimarcas.skill) · [ZIP da skill](dist/video-multimarcas.zip) · [Instruções da skill](.agents/skills/video-multimarcas/SKILL.md)

Este repositório não apresenta um vídeo de demonstração. O arquivo `templates/project.json` é um rascunho técnico com espaços reservados, destinado à configuração do editor.

## Biblioteca visual e publicidade

[Abrir o Atlas público](https://video-multimarcas-estilos.andrezucatti82.chatgpt.site): 720 direções em 18 famílias, imagens, usos, recursos, comparação, tipografia e briefing. Inclui produtos, imóveis, softwares, apresentações e 40 avatares fictícios, além de 24 combinações tipográficas com prévia real. Código e assets genéricos em [style-atlas/](style-atlas/).

A primeira entrega é **roteiro e moodboard visual para aprovação; após o aceite, storyboard visual para aprovação própria e, depois, amostra de 10 segundos**. O site externo copia o pedido; não envia automaticamente ao chat. Fotos, vídeos e capturas reais são anexados na conversa de produção. O agente preserva produto/rótulo, arquitetura/entorno e interface; não inventa vistas ocultas ou resultados. Veja [regras de publicidade e fidelidade](.agents/skills/video-multimarcas/references/advertising-and-fidelity.md).

## Qualidade na versão 2

A direção exige ação dentro do quadro, profundidade coerente, cortes ligados à locução e transições motivadas. Antes do filme inteiro, o agente deve testar o plano mais exigente e sua passagem. Fotografias com zoom e cartões inclinados não bastam para atender um pedido de cinema e interação.

Um MP4 renderizado é um candidato. Acabamento revisado exige playback e escuta integrais do arquivo entregue, além de verificação técnica. Sem essas capacidades, a entrega fica como **revisão pendente**. A ficha de revisão é vinculada ao SHA256; alterar o vídeo invalida a revisão anterior.

O kit oferece infraestrutura, não transforma mídia automaticamente em cinema: travessia por objeto, 3D, rotoscopia e tracking precisam de produção e implementação próprias. O código inclui corte e dissolvência explícitos; não escolhe wipes pela posição da cena.

Veja [migração do formato de render](docs/MIGRATION-2.md) e [fluxo de produção e revisão](docs/WORKFLOW.md).

## Usar a skill

Copie a pasta `.agents/skills/video-multimarcas/` inteira para a pasta de skills do seu agente, preservando `references/`, `templates/` e `agents/`. Em agentes compatíveis com a convenção `.agents/skills`, mantenha esse caminho no projeto. Não substitua skills existentes: o identificador desta é `video-multimarcas`.

> Use $video-multimarcas. Tema: como escolher plantas para um apartamento.

> Use $video-multimarcas. Marca: Minha Marca. Site: https://exemplo.com. Tema: como escolher o produto ideal. Faça um vídeo de 30 segundos.

A skill depende das capacidades do agente para pesquisar, gerar mídia e sintetizar voz. Não é um serviço hospedado nem um aplicativo de geração autônoma sem modelo de IA. Não inclui contas, créditos ou credenciais. Somente tema pode usar identidade editorial provisória; nome de marca ambíguo pode exigir esclarecimento.

## Preparar o ambiente

Requisitos: Node.js 22 ou superior, npm e FFmpeg. Python 3 é necessário para o verificador opcional de vídeo. O Remotion precisa de um navegador compatível e bibliotecas de sistema; consulte a [documentação oficial](https://www.remotion.dev/docs/renderer).

```bash
npm ci
npm run check
npm test
npm run validate
npm run dev
```

O editor abre o rascunho técnico. Substitua textos, logo, fotografias, direção e áudio antes de produzir uma peça. Nenhuma locução, música ou mídia comercial acompanha o kit.

## Começar um projeto novo

```bash
npm run new -- --topic "Como escolher o café" --brand "Minha Marca" --website "https://exemplo.com" --slug cafe
```

Também aceita `--logo ./meu-logo.png`. Só `--topic` é obrigatório. O comando cria `projects/cafe/brief.json`, `shot-plan.json`, `review.json` e `START.md`, sem sobrescrever projetos existentes. É um scaffold de briefing: entregue essa pasta ao agente com a skill para pesquisar e produzir.

O agente pode preparar uma configuração a partir de `templates/project.json`, colocar seus assets em `public/` e executar:

```bash
npm run validate -- projects/cafe/project.json
npm run render -- --project projects/cafe/project.json --out projects/cafe/candidate
npm run stills -- --project projects/cafe/project.json --out projects/cafe/review
python scripts/verify-video.py projects/cafe/candidate/video.mp4 --out projects/cafe/technical.json
# Depois de assistir, escutar e registrar a revisão real:
npm run review -- projects/cafe/candidate/video.mp4 projects/cafe/review.json
```

`render` e `stills` exigem uma configuração explícita. O renderizador aceita quantidade livre de planos, tempos por cena, imagens, vídeos e camadas independentes em 1080 × 1920; para outras narrativas e formatos, crie ou altere a composição em `src/`. A skill não se limita a essa estrutura ou estética. Veja [o fluxo de adaptação](docs/WORKFLOW.md).

O render não chama APIs de IA. A primeira execução pode baixar o navegador. Para usar Chromium já instalado, defina `CHROME_PATH`; por exemplo, no Linux:

```bash
CHROME_PATH=/usr/bin/chromium npm run render -- --project projects/cafe/project.json
```

Windows PowerShell: `$env:CHROME_PATH='C:\caminho\chrome.exe'` antes do comando. Memória limitada: use `RENDER_CONCURRENCY=1`.

## O que acompanha o kit

- Skill genérica e referências de pesquisa, direção, produção e distribuição.
- Renderizador React/Remotion editável, dependências fixadas e testes de entrada.
- Configuração técnica neutra e espaços reservados para mídia.
- Validação de configuração e verificador de metadados, decodificação e volume do vídeo.
- Instruções de instalação e publicação.

## Licenças e limites

Código, documentação e SVGs originais: MIT. As fontes e dependências têm condições próprias; consulte [THIRD_PARTY.md](THIRD_PARTY.md). O Remotion tem [licença própria](https://www.remotion.dev/license), com condições comerciais que dependem do uso e da organização.

Pesquisa web exige internet; geração por provedores pode ter custo e limites. Cada novo projeto precisa registrar fontes, direitos de mídia e verificações reais. O verificador técnico não substitui revisão visual e escuta.

## Naturalidade e acabamento em todos os estilos

Os pedidos e presets incluem avaliação obrigatória de imagens IA, clipes IA e tratamento/edição final, com correção e nova revisão. A regra vale também para estilos anteriores e para a amostra de 10 segundos: fidelidade aos originais, continuidade, composição e áudio natural. Linguagens ilustradas mantêm seu estilo. Estudos estáticos não certificam vídeo pronto; sem playback e escuta reais, a revisão permanece pendente. Veja [o protocolo](https://github.com/andrezucatti82-rgb/broll-studio-kit/blob/main/.agents/skills/video-multimarcas/references/natural-finish.md).

## Pessoas e preservação de identidade

Regra global para todos os estilos: originais como referência principal, sem alterações físicas não solicitadas, planos compatíveis com as vistas disponíveis e teste curto de rosto/corpo em movimento antes do vídeo completo. Falhas perceptíveis bloqueiam avanço; limitações da ferramenta devem ser explicadas antes de consumir créditos. O kit exige registro, mas não faz reconhecimento facial automático. Veja [protocolo e evidências](https://github.com/andrezucatti82-rgb/broll-studio-kit/blob/main/.agents/skills/video-multimarcas/references/identity-preservation.md).

## Infoprodutores: revisão 3.2

As 30 direções foram refeitas a partir de necessidades de venda, demonstração do ensino e experiência do aluno, com cinema, documental, UGC, podcast, multicâmera, screencast e motion tipográfico. São 30 estudos visuais individuais (18 fotográficos fictícios e 12 editoriais/UI), com materiais necessários, áudio e prova criativa de 10 segundos. Os IDs anteriores e as outras 480 direções foram preservados. [Pesquisa e critérios](style-atlas/records/RESEARCH.md).

## Motion Design de Campanha · edição 4.0

30 direções para anúncios, explicações, lançamentos e marca, com 12 estudos fotográficos IA fictícios, dez composições gráficas e oito cenas 3D originais. Escolher pelo objetivo, não pela quantidade de efeitos: ler necessidade, ação, materiais, distinção e áudio de cada preset. O acervo passa a 540 direções em 18 categorias, mantendo os 510 IDs anteriores.

Há três prévias audiovisuais de dez segundos: **Frase que reorganiza o quadro**, **Peça única em palco de íris** e **Janela óptica sobre fotografia**. São estudos para aprovação, não exemplos de vídeos finais aprovados. A lente amplia a mesma fotografia, sem inventar vistas; o frasco 3D é fictício. A fonte da animação, o mix e a proveniência acompanham o repositório em `style-atlas/records/motion-campaign/`. Veja as amostras em https://videos.gerenciadordeanuncios.com.br/motion-campaign.html .

Definir estado inicial → ação → resultado; planejar uma transição motivada, pausas de leitura, locução natural, trilha e SFX ligados à ação. Cena 3D, rotação, tracking, transparência técnica e reflexos exigem material e execução compatíveis. Não chamar zoom sobre uma foto de voo, tour ou novo ângulo. Não transformar referência estática em garantia de movimento. Preservar produto, pessoa, imóvel e interface conforme os protocolos globais; não alterar a identidade para facilitar um efeito.

Verificar quadros de início, meio, fim e transições, além de reprodução integral com escuta. Registrar separadamente o que foi observado, medido e ainda depende de revisão. `review_pending` continua pendente até aprovação; renderização, metadados e medição de áudio não certificam acabamento. Pedir somente os materiais pertinentes ao estilo e explicar ferramenta ausente, limite de fidelidade ou cota antes de consumir créditos. Trocar de ferramenta não autoriza clonar voz nem reutilizar identidade de outro projeto.

## Pacotes de instalação e atualização

[Skill](dist/video-multimarcas.skill) · [ZIP da skill](dist/video-multimarcas.zip) · [Plugin Codex](dist/video-multimarcas-plugin.zip) · [Versões e hashes](dist/release-manifest.json) · [Instalar ou atualizar](docs/INSTALL-SKILL.md). Plugin 2.3.1, kit 2.3.1 e catálogo 4.1 (720 estilos/18 categorias). O marketplace público distribui somente `video-multimarcas`; a skill pessoal `video-b-roll` permanece separada. Importação na conta do ChatGPT depende da interface disponível e não acontece automaticamente ao atualizar este repositório.

## Referências visuais para o pedido


Geração de vídeo: HeyGen via API HTTP direta é a primeira opção a avaliar. Cada usuário fornece sua própria conexão; a preferência não substitui a verificação de capacidade, custo, materiais e fidelidade. Outros provedores exigem justificativa para a cena, respeitando a escolha do usuário.

## Automação de produção

O atlas agora mostra materiais, ferramentas e maturidade dentro de cada ficha. O fluxo segue materiais → roteiro → moodboard aprovado → storyboard aprovado → amostra, com aprovação criativa separada da revisão técnica. Consulte [produção retomável e HeyGen direto](docs/AUTOMATION.md) para `npm run plan`, orçamento local, consultas de jobs e limites de automação.

[Primeira rodada de três amostras HeyGen](https://videos.gerenciadordeanuncios.com.br/automation-pilot.html): produto fictício, interface demonstrativa e explicação de agente de IA. Dez segundos cada, ainda com revisão audiovisual e aprovação criativa pendentes. Não são referências de acabamento aprovado.

## Expansão 4.1 · 180 novas direções

Cada uma das 18 categorias recebe dez propostas, passando a 40 estilos e 720 no total. O filtro **Novos · 180** isola esta edição. Os 540 IDs e sua ordem anterior foram preservados para migrar favoritos e projetos. Há 140 estudos IA fictícios e 40 composições originais em código, cada um em arquivo individual; nenhum vídeo foi gerado nesta expansão.

As fichas incluem ação, uso, recursos, áudio, comparação com um conceito próximo e critério da amostra. Técnicas podem ser compartilhadas; a diferenciação é editorial e não uma garantia de originalidade absoluta. Pesquisa, procedência e auditoria estão em [expansion-720](style-atlas/records/expansion-720/). A aprovação de moodboard, storyboard e amostra continua obrigatória.
