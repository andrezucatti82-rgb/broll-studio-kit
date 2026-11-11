# Expansão do atlas para 720 direções

São dez propostas em cada uma das 18 categorias, totalizando 180 adições. Os 540 registros anteriores e sua ordem são preservados integralmente. O catálogo passa a 4.1, com 40 estilos por categoria; a skill e o plugin genéricos passam a 2.3.1.

## Direção e procedência

`directions.json` contém nome, composição, ação e aplicação. `distinctions.json` registra um conceito próximo para comparação editorial e o mecanismo que diferencia a proposta. Técnicas e necessidades podem ser compartilhadas: a triagem lexical em `similarity-audit.json` não é uma certificação de originalidade semântica. A pesquisa textual está em `research.json`; ativos das fontes não foram copiados.

As 140 imagens IA fictícias foram geradas em 28 pranchas de cinco quadros. Os quadros foram separados pelas divisões medidas, preservando a largura e sem ampliação artificial. Os 40 estudos de grafismo, dados, software e apresentação são composições originais em `render_graphics.py`, com texto em Geist, editável no código. `assets.json` registra origem, prompt, limites medidos, dimensão e SHA256 de cada arquivo. As imagens ficam em `dist/assets/expansion-720/`.

Revisão estática: foram inspecionadas as pranchas de todas as categorias, com correção das divisões irregulares e dos glifos ausentes nos estudos em código. Essa inspeção verifica aparência e apresentação; não valida física, alegações científicas, sistemas reais ou identidade em movimento. Pessoas, produtos, imóveis, dados e interfaces são fictícios. Nenhum vídeo foi gerado. Todos os novos estilos permanecem `visual_reference`.

## Reconstrução

```sh
python style-atlas/records/expansion-720/render_graphics.py
python style-atlas/records/build_catalog.py
python style-atlas/records/build_page.py
python scripts/package-skill.py
```

As imagens finais são distribuídas com o repositório; reconstruir o catálogo não chama o gerador. `assemble_images.py --source-dir CAMINHO` é apenas a extração técnica das pranchas originais e depende dos arquivos locais de geração, que não acompanham o kit. Os prompts documentam a direção, mas uma nova geração não garante reprodução idêntica.

## Page e continuidade

A Page conserva código, fontes e interface no HTML. O catálogo comprimido é carregado por um script de dados com nome derivado do SHA256, servido pelo espelho público. O arquivo contém apenas atribuição de JSON codificado em base64. Não há credenciais, chamadas de geração nem servidor de aplicação. Manter os payloads já publicados permite que Pages antigas continuem abrindo. Sem acesso ao arquivo remoto, a biblioteca fica indisponível nessa superfície; o site público continua sendo a alternativa.

O estado Page armazena estilos por ID e referências compactas; o pedido completo é reconstruído pelo catálogo ao abrir. O teste verifica dez estilos abaixo do limite de 16 KiB e migração dos favoritos 4.0, sem acessar localStorage. A renderização no host nativo do ChatGPT exige inspeção separada; o teste automatizado usa Chromium com a ponte Page simulada.

## Validação

`npm ci`, `npm run check`, `npm test`, `npm run validate`; testes adicionais `tests/browser-workflow.py`, `tests/browser-preproduction.py` e `tests/browser-expansion.py` com Playwright e o servidor `npm run atlas`. A expansão verifica quantidade, famílias, IDs, arquivos, hashes, contratos, ausência de aprovação automática, carregamento das 180 imagens, download PNG, duração, persistência, celular em 375 px e o HTML Page compilado.
