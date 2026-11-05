# Preservação de identidade e características físicas

Regra global para **todos os estilos com pessoas na composição**, incluindo figurantes, modelos, apresentadores, profissionais, alunos e personagens de fantasia. Aplicar no planejamento, na seleção de ferramentas, no prompt, na geração e na revisão. Não depende de selecionar a categoria Avatares. Esta regra não habilita avatar onde a skill o proíbe e não substitui autorização de imagem/voz.

## Referências e limites

Quando o usuário fornecer fotos ou vídeos, preserve rosto, traços faciais, tom de pele, idade aparente, cabelo, biotipo e proporções corporais. Não embeleze, rejuvenesça, emagreça, altere textura natural ou modifique essas características sem solicitação explícita. Registre alterações autorizadas de forma específica; liberdade criativa, maquiagem/cenário ou seleção de um estilo não são autorização genérica para mudar o corpo.

Use **arquivos originais como referência principal de identidade**. Storyboards, colagens e imagens já geradas são referências secundárias de aparência e direção: não valide um derivado comparando apenas com outro derivado. Registre ID local da pessoa, arquivo, SHA256/versão, origem, papel primário/secundário, autorização, enquadramentos cobertos e limitações. Preserve os originais. Não envie referências pessoais a repositórios públicos ou logs de publicação; o atlas só contém personagens fictícios.

Para imagem para vídeo, prefira um quadro individual aprovado/validado, ligado aos originais. Evite colagens com vários enquadramentos como única referência: elas podem misturar rostos e proporções. Pode usar referências multivista separadas se o provedor aceitar; isso não dispensa comparação. Com apenas retrato frontal, prefira movimentos leves e enquadramento compatível. Não invente perfil, costas, corpo inteiro ou detalhes ocultos como se fossem conhecidos. Peça referências adicionais quando necessárias ou limite o plano; explique o impacto.

Em fantasia, como sereias, mantenha pessoa reconhecível, rosto, tom de pele e proporções observáveis. Altere apenas os elementos solicitados, como figurino, cauda e cenário. Não afine cintura nem mude rosto ao acrescentar uma cauda. Registre quais regiões foram alteradas e quais devem permanecer. Personagens totalmente fictícios, sem identidade real fornecida, ainda exigem consistência de aparência, anatomia e continuidade entre planos.

## Seleção de ferramenta antes do gasto

Confira suporte efetivo a referências individuais/múltiplas, imagem para vídeo, consistência temporal, movimento pedido e resolução. Documentação ou marketing não garantem fidelidade no resultado. Não prometa identidade idêntica. Se a ferramenta não suportar preservação suficiente para a cena, informe a limitação e proponha alternativa **antes de consumir créditos**: vídeo original com edição/rotoscopia, plano mais contido, outras referências ou ferramenta adequada disponível. Respeite orçamento e autorizações existentes; não repita chamadas pagas tentando corrigir sem diagnóstico.

Se a capacidade ainda for incerta, declare essa incerteza antes do teste e siga a autorização existente para uma amostra limitada. Uma referência facial não comprova corpo ou performance. Em planos com várias pessoas, mantenha as referências e rastreio separados para evitar mistura de identidades.

## Teste obrigatório antes do vídeo completo

Gere um teste curto representativo do movimento mais exigente, preferencialmente dentro da amostra de 10 segundos já prevista. Compare lado a lado com os originais, em reprodução e por quadros do início, meio, fim e mudanças de ângulo. Examine também momentos de oclusão, contato, fala e retorno ao quadro quando existirem. Confira rosto **e corpo visível**, cabelo, tom de pele, idade aparente, proporções e anatomia em movimento; não confunda mudança de iluminação com mudança de pele, nem tolere mudança estrutural como efeito de câmera.

Se não houver mudança de ângulo no teste, registre isso como limite; ele não valida ângulos que não foram testados. Da mesma forma, um close não valida corpo inteiro. Uma cena nova que exceda a cobertura ou o movimento aprovados requer novo teste específico. Alteração perceptível de identidade ou anatomia bloqueia a produção completa: corrigir fonte/ação, substituir técnica ou pedir referência e testar novamente. Não aprovar automaticamente pelo prompt, por similaridade de um único quadro ou por um render concluído.

## Evidência e estado

Preencha `identityPreservation` no relatório: presença de pessoas reais, escopo, referências originais por pessoa, mudanças autorizadas, cobertura, ferramenta/capacidades, arquivo/hash do teste, duração, responsável e observações. Para cada pessoa, registrar comparação de início, meio, fim, mudanças de ângulo, rosto e corpo visível, com evidência e status. Não preencher “passed” por suposição. Registrar problemas por timecode, ação corretiva e nova versão. O teste aprovado vale somente para o escopo observado; a revisão final repete a conferência de todos os planos usados.

Sem pessoas reais referenciadas, registrar `not_applicable` com justificativa; personagens fictícios continuam nas avaliações de naturalidade/continuidade. Com referências insuficientes ou sem capacidade de assistir/inspecionar, manter `not_run`, `failed` ou revisão pendente e informar exatamente o limite. A frase “preservar identidade” no prompt **não é prova**. O verificador do kit confere registros e bloqueios, não faz reconhecimento facial nem atesta identidade automaticamente.

No kit, antes do vídeo completo execute `npm run identity-check -- caminho/review.json`. Para cada pessoa, `originalReferences` contém `file`, `sha256` e `role: "original"`; `authorizedChanges` é uma lista (vazia quando nenhuma mudança foi pedida), `coverageLimits` explicita o limite observado. Em `checks`, preencher `start`, `middle`, `end`, `angleChanges`, `face`, `visibleBody`, cada um com `status` e `evidence`. Mudanças de ângulo não testadas podem ser `not_applicable` com motivo e não autorizam planos novos. O verificador final `npm run review` também exige esse registro. Os comandos validam completude, não identidade visual; a revisão final de todos os planos continua obrigatória.
