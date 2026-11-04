# Vídeo Multimarcas

**Skill pública de uso geral.** Identificador: `video-multimarcas`. Adapta cada produção à marca informada; não carrega identidade ou voz pessoal como padrão.

**Uma temática vira um vídeo narrado, com pesquisa e identidade adaptada à sua marca.** Skill para agentes de IA, acompanhada de código editável para produção.

Informe o assunto. Opcionalmente, acrescente o nome da marca, logotipo ou site. O agente pesquisa, desenvolve roteiro e direção, prepara mídia, monta, revisa e entrega o vídeo. Sem avatar por padrão; câmera livre, imagens grandes e movimento com propósito.

[Baixar a skill](dist/video-multimarcas.skill) · [ZIP da skill](dist/video-multimarcas.zip) · [Instruções da skill](.agents/skills/video-multimarcas/SKILL.md)

Este repositório não apresenta um vídeo de demonstração. O arquivo `templates/project.json` é um rascunho técnico com espaços reservados, destinado à configuração do editor.

## Usar a skill

Copie a pasta `.agents/skills/video-multimarcas/` inteira para a pasta de skills do seu agente, preservando `references/`. Em agentes compatíveis com a convenção `.agents/skills`, mantenha esse caminho no projeto. Não substitua skills existentes: o identificador desta é `video-multimarcas`.

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

Também aceita `--logo ./meu-logo.png`. Só `--topic` é obrigatório. O comando cria `projects/cafe/brief.json` e `START.md`, sem sobrescrever projetos existentes. É um scaffold de briefing: entregue essa pasta ao agente com a skill para pesquisar e produzir.

O agente pode preparar uma configuração a partir de `templates/project.json`, colocar seus assets em `public/` e executar:

```bash
npm run validate -- projects/cafe/project.json
npm run render -- --project projects/cafe/project.json --out projects/cafe/final
npm run stills -- --project projects/cafe/project.json --out projects/cafe/review
python scripts/verify-video.py projects/cafe/final/video.mp4 --out projects/cafe/final/qa.json
```

`render` e `stills` exigem uma configuração explícita. O renderizador incluído usa seis cenas em 1080 × 1920; para outras narrativas e formatos, crie ou altere a composição em `src/`. A skill não se limita a essa estrutura ou estética. Veja [o fluxo de adaptação](docs/WORKFLOW.md).

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
