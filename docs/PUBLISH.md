# Publicar sua cópia

A publicação requer uma conta GitHub com permissão para criar repositórios. Algumas integrações permitem trabalhar em repositórios existentes, mas não criar novos.

Com GitHub CLI autenticado e permissão de criação:

```bash
gh repo create video-multimarcas-kit --public --source=. --remote=origin --push
```

Se a integração retornar `Resource not accessible by integration`, crie primeiro um repositório **público e vazio**, sem README ou licença automática, na interface do GitHub. Autorize o acesso da integração a esse repositório. Depois, na pasta do projeto:

```bash
git remote add origin https://github.com/SEU_USUARIO/video-multimarcas-kit.git
git push -u origin main
```

Não use force push. Se o repositório já tiver conteúdo, verifique-o antes de integrar as alterações. A criação/publicação de uma cópia comercial exige revisar os assets incorporados e suas condições em `THIRD_PARTY.md`.
