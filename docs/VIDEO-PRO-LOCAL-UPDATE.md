# Aplicação ao Video Pro e a outros plugins locais

A política de [aprovação visual](VISUAL-APPROVAL.md) também é aplicada às nove skills do Video Pro: coordenação, diagnóstico, roteiro, direção, biblioteca, motion, edição, integrações e revisão. Inclui as referências da biblioteca; exemplos não concedem autorização para gerar.

O aplicador `scripts/apply-visual-policy.py` adiciona a regra no início dos SKILL.md relacionados a vídeo, preserva o restante e distribui uma referência portátil ao lado de cada skill. Use primeiro em modo de simulação, confira os caminhos selecionados e aplique com `--apply`. Guarde o backup fora de repositórios públicos: ele pode conter instruções pessoais anteriores. Novas versões de plugins podem sobrescrever o cache; mantenha a regra também nas instruções permanentes do usuário e reaplique após uma atualização, quando autorizado.

Para o pacote Video Pro próprio, copie também `scripts/workflow-gate.mjs`, `templates/workflow.json` e `docs/VISUAL-APPROVAL.md` para os mesmos caminhos do pacote. As nove skills devem consultar o protocolo e usar a checagem correspondente antes da etapa. O script não muda contas, audiência, integrações ou permissões de um serviço remoto.

O pacote completo e sua biblioteca privada não são redistribuídos neste repositório público. Este repositório versiona a política, o aplicador, as checagens e os testes. A instalação de um ZIP em outra conta ou superfície é distinta da alteração local. Não afirmar que uma atualização local atualizou o catálogo de terceiros.
