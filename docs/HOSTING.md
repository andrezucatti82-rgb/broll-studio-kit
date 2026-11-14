# Hospedagem do atlas

Endereço de divulgação: https://videos.gerenciadordeanuncios.com.br/ . Espelho: https://video-multimarcas-estilos.andrezucatti82.chatgpt.site . A implantação só é confirmada por recibo e leitura da URL, não por este documento.

A galeria é estática: publicar somente `style-atlas/dist/`. Não precisa de banco, chave de API, autenticação GDA ou backend de geração. O vídeo é produzido no ambiente do usuário, depois de enviar o pedido.

## Cópia própria

Troque o logo, textos e cores no HTML/CSS. A identidade GDA é do mantenedor e não faz parte da identidade dos vídeos. Não se apresente como GDA ao redistribuir uma cópia. Preserve licenças das fontes e procedência das imagens. O atlas usa fontes Geist distribuídas com sua licença OFL; o seletor distribui arquivos de 24 combinações, com licenças OFL/Apache e procedência em `fonts.json`. Confira os pesos necessários em cada vídeo.

Qualquer hospedagem estática que sirva HTML/CSS/JS/JSON e imagens pode funcionar. Teste HTTPS, caminhos relativos, carregamento de assets, busca, briefing e download de preset.

## cPanel / HostGator

`scripts/deploy-static-cpanel.mjs` usa a UAPI com `CPANEL_HOST`, `CPANEL_USER`, `CPANEL_TOKEN` fornecidos por segredos. Nunca coloque valores no Git. O script confirma o document root do domínio, recusa raiz principal/compartilhada, inspeciona `index.html`, salva backup local e remoto fora da área pública, publica assets em uma pasta de versão e substitui a homepage somente após verificar os assets. Os demais arquivos anteriores são preservados. Uma falha de verificação da homepage tenta restaurar o original. Para HTML acima do limite de 1 MiB do editor cPanel, lê o caminho público explícito sem compressão/cache e exige tamanho idêntico ao arquivo listado pela API. O backup remoto inclui o HTML e partes base64 verificadas individualmente; concatenar essas partes na ordem do recibo e decodificar recupera os bytes originais. Se tamanho ou verificação falharem, a homepage não é substituída.

Primeiro, inspeção sem escrita:

```bash
node scripts/deploy-static-cpanel.mjs --domain videos.seudominio.com --source style-atlas/dist
```

Depois de revisar o domínio/pasta e autorizar a implantação:

```bash
node scripts/deploy-static-cpanel.mjs --domain videos.seudominio.com --source style-atlas/dist --apply
```

`DEPLOY_ALLOWED_DOMAIN` pode fixar o único destino permitido. O script não cria DNS/subdomínio, não altera senha, não copia cookies do navegador e não instala auxiliares PHP. Exige subdomínio já existente com homepage HTML. Se a hospedagem usar outro documento inicial, root compartilhado ou API incompatível, interrompa e adapte explicitamente — não adivinhe a pasta.

Guarde `deployment-backup/receipt.json` e o backup em armazenamento privado. Nunca publique backups no repositório público. Para desfazer, restaure o `index.html` preservado pelo gerenciador de arquivos/API e confira a URL. As pastas versionadas podem ser removidas posteriormente, após confirmar que não estão em uso e preservar as versões necessárias.

Fontes da API: https://api.docs.cpanel.net/specifications/cpanel.openapi/manage-files/ e https://api.docs.cpanel.net/specifications/cpanel.openapi/domain-information/ . A disponibilidade varia com a versão do servidor.

## Espelho Sites: mídia compartilhada

A origem opcional `window.ATLAS_IMAGE_ASSET_BASE` permite servir o frontend, catálogo e fontes localmente e reutilizar imagens na edição pública imutável do mantenedor. Sem essa opção, o site principal mantém o comportamento anterior. O manifesto do pedido aponta para a origem real das imagens; downloads abrem o helper nessa origem, evitando canvas entre domínios. Não alterar ou degradar as imagens para contornar limites de hospedagem.

No espelho, o build estático deve incluir apenas os arquivos usados, fontes e prévias, declarando o diretório correto no manifesto de Sites. O serviço recusou o pacote integral acima de 256 MiB; as tentativas por build remoto também excederam limites. O frontend leve foi conferido localmente com imagens reais, fonte, exportação e PNGs por nova aba. Publicação online só é confirmada pelo recibo e leitura posterior. Preservar registros históricos e originais; não excluí-los para facilitar o deploy.
