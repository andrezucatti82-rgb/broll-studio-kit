# Instalar a skill

Copie a pasta `video-multimarcas` completa para a pasta de skills do seu agente, preservando `SKILL.md`, `references/`, `templates/` e `agents/`. Para agentes que usam a convenção do projeto, o destino é `.agents/skills/video-multimarcas/`.

O identificador é `video-multimarcas`. Instale lado a lado com outras skills, sem sobrescrevê-las. Diga ao agente: “Use $video-multimarcas. Tema: ...”, acrescentando nome, site ou logo se quiser.

O arquivo `.skill` é um ZIP instalável em ferramentas compatíveis com esse formato. Se o seu agente não tiver importador, use o ZIP e copie a pasta manualmente. Compatibilidade de importação depende do agente. O renderizador e a configuração inicial estão no repositório completo, não no pacote mínimo da skill.

## Plugin para Codex

O pacote `dist/video-multimarcas-plugin.zip` contém o manifesto de plugin e a skill completa. O repositório também fornece um marketplace com apenas a versão multimarcas. Com um Codex CLI que ofereça `codex plugin`, execute:

```bash
codex plugin marketplace add andrezucatti82-rgb/broll-studio-kit --ref main
codex plugin add video-multimarcas@video-multimarcas-kit --json
codex plugin list --json
```

Para usar um checkout local, substitua o primeiro comando por `codex plugin marketplace add /caminho/absoluto/broll-studio-kit`. Use a origem já configurada quando atualizar uma instalação existente; não instale uma segunda cópia com outro nome de marketplace sem necessidade. Não remova a configuração pessoal `video-b-roll`.

A versão do plugin é **2.3.0**, a do kit executável **2.3.0** e a do catálogo **4.0**, com **540 estilos em 18 categorias**. São componentes diferentes. `dist/release-manifest.json` registra versões e hashes. Para regenerar todos os pacotes após editar a skill, execute `python scripts/package-skill.py`; a pasta `plugins/video-multimarcas/` é gerada a partir de `.agents/skills/video-multimarcas/`.

## Atualizar uma instalação existente do Codex

Para a origem Git configurada como `video-multimarcas-kit`, atualize o snapshot antes de reinstalar:

```bash
codex plugin marketplace upgrade video-multimarcas-kit --json
codex plugin add video-multimarcas@video-multimarcas-kit --json
codex plugin list --marketplace video-multimarcas-kit --json
```

Se o marketplace usa um checkout local, execute `git pull --ff-only` nesse checkout e reinstale usando o nome já configurado. Se houver alterações locais, preserve-as e resolva a atualização sem descartá-las. Reabra a sessão e confira a versão efetivamente carregada. Instalação pela pasta de skills exige atualizar a pasta completa, não somente `SKILL.md`.


## ChatGPT e outros dispositivos

Instalar no Codex deste computador ou ambiente não atualiza o pacote da conta do ChatGPT nem outro computador. Se sua interface oferecer importação de plugins personalizados, use o ZIP do plugin no fluxo de atualização existente. Se ela aceitar apenas skills, use `.skill` ou o ZIP correspondente. Não há um botão universal garantido para todos os planos e superfícies. Sem importação compatível, use o pedido da galeria e anexe as instruções no projeto/conversa.

