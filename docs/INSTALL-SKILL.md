# Instalar a skill

Copie a pasta `broll-studio` completa para a pasta de skills do seu agente, preservando `SKILL.md` e `references/`. Para agentes que usam a convenção do projeto, o destino é `.agents/skills/broll-studio/`.

O identificador é `broll-studio`. Instale lado a lado com outras skills, sem sobrescrevê-las. Diga ao agente: “Use $broll-studio. Tema: ...”, acrescentando nome, site ou logo se quiser.

O arquivo `.skill` é um ZIP instalável em ferramentas compatíveis com esse formato. Se o seu agente não tiver importador, use o ZIP e copie a pasta manualmente. Compatibilidade de importação depende do agente. O renderizador e a configuração inicial estão no repositório completo, não no pacote mínimo da skill.
