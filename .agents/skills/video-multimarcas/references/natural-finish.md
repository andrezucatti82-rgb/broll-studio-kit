# Avaliação de naturalidade e acabamento profissional

Regra obrigatória para **todos os estilos e todos os vídeos**, incluindo a primeira amostra de 10 segundos. O alvo é acabamento convincente e intencional, próximo de uma edição profissional, sem os defeitos recorrentes da geração automática. Não prometer realismo perfeito ou ausência absoluta de artefatos. Não remover identificação sintética, procedência ou avisos necessários para fazer uma simulação passar por registro real.

## 1. Imagem antes da animação

Avaliar cada imagem gerada que entrará no vídeo, em tamanho de entrega e ampliada nos detalhes críticos, lado a lado com as referências autorizadas. Conferir anatomia, mãos, olhos, dentes, roupa, proporções, perspectiva, escala, contato com superfícies, sombras, reflexos, refração, materiais e coerência da iluminação. Procurar pele encerada/plástica, poros e grão artificiais, excesso de nitidez, bokeh impossível, objetos fundidos, duplicações e detalhes sem função. Manter textura natural e particularidades reais; não inventar imperfeições num produto para fazê-lo parecer real.

Proteger logotipo, rótulo, embalagem, forma, cor, acabamento e atributos reais. Conferir arquitetura, aberturas, vista, interface e dados. Gerar cenário separado e compor recortes originais quando a geração alterar o objeto. Reconstruir textos, números, legendas e UI como tipografia/vetores ou captura conferida; texto aparentemente plausível não basta. Reprovar ou corrigir a imagem antes de propagá-la para vídeo.

## 2. Clipe antes da montagem

Assistir a cada clipe gerado em velocidade normal, repetir trechos críticos em câmera lenta e examinar quadros ao longo da ação, principalmente contato, oclusões, viradas e transições. Comparar início, meio e fim sem limitar a avaliação a três quadros. Procurar identidade instável, membros extras, mudanças de roupa/produto/cenário, rótulos que se dissolvem, texture swimming, flicker, morphing involuntário, objetos que surgem/desaparecem, pés deslizando, peso/inércia incoerentes e câmeras impossíveis. Conferir foco, motion blur, paralaxe e ritmo; evitar movimento excessivo ou tremor decorativo. Avatar, quando autorizado pelo projeto, exige expressão, olhar, respiração, gestos e sincronia labial plausíveis.

Se falhar: corrigir a fonte ou o prompt, limitar a ação, regenerar o trecho, compor a partir de mídia original ou substituir por filmagem/render controlado. Não tentar disfarçar falha estrutural com blur, grain, glitch, speed ramp ou cortes rápidos. Alteração substancial da técnica prometida exige explicar o impacto e obter a escolha da alternativa, respeitando autorizações já dadas. Não repetir gerações pagas cegamente.

## 3. Tratamento, edição e entrega

Conferir rotoscopia/máscaras sem halo ou borda pulsante, tracking, oclusão, sombra de contato, direção de luz, exposição, balanço de branco, contraste, textura e nitidez coerentes entre planos. Harmonizar cor sem aparência plástica ou filtro genérico. Usar grão, aberração, flare, bokeh e desfoque somente quando coerentes com a direção; não são maquiagem automática contra artefatos. Montar pela intenção e pela locução, com pausas e variação motivada, sem sequência repetitiva de zooms.

Escutar a fala para detectar prosódia mecânica, pronúncia errada, respirações falsas, cortes de sílabas, velocidade excessiva/lenta e timbre alterado. Revisar música, foley, ambiência, transições de áudio e ducking. A mixagem deve conservar voz clara e ações sonoras coerentes, sem efeitos em cada palavra. Conferir legendas e textos na tela no formato final e em escala de celular.

Após correções, reproduzir e escutar **o arquivo final inteiro** e conferir sua identidade/hash. Exportação tecnicamente válida e inspeção de quadros não substituem essa revisão. Qualquer mudança posterior no conteúdo invalida a revisão da versão anterior para aquele arquivo.

## Linguagem de cada estilo

Fotorrealismo pede materiais, ótica, movimento e performance naturais. Ilustração, papel, stop motion, pixel art, surrealismo, tipografia e 3D estilizado mantêm sua linguagem: exigir consistência intencional, desenho, continuidade e acabamento profissional, não convertê-los automaticamente em fotografia. Movimento descontínuo deliberado do stop motion não é flicker defeituoso. Distinguir decisão estética aprovada de erro incidental. Não inventar resultados clínicos, desempenho, testemunhos ou documentação real para aumentar o realismo.

## Registro e critérios de aprovação

Registrar, por etapa, assets/planos revisados, referência usada, arquivo/versão/hash, método, observações concretas, defeito/localização ou timecode, gravidade, ação e resultado da nova revisão. Etapas: `imageGeneration`, `videoGeneration`, `finishing`. Imagem/vídeo IA não usados podem ser `not_applicable` com justificativa; acabamento final sempre obrigatório. Usar `not_run`, `failed` ou `passed` de forma honesta. Uma lista preenchida por suposição não é avaliação.

Bloqueadores: alteração de identidade/atributo real, informação falsa ou ilegível, deformação evidente, instabilidade temporal perceptível, quebra de continuidade que muda o sentido, falha de voz/sincronia ou erro de composição que comprometa a entrega. Corrigir e rever antes de marcar como aprovado. Se ferramenta de playback, escuta ou inspeção necessária estiver ausente, dizer qual avaliação falta e manter `review_pending`, com caminho para conclusão. Aprovação do usuário não prova que uma checagem técnica foi realizada. Não declarar que os estudos estáticos do atlas já passaram por avaliação de vídeo.

## Enquadramento e apresentação das referências

Preserve a composição completa de capas, storyboards e imagens de aprovação. Use as dimensões reais do arquivo para definir a moldura; mantenha proporções e cantos consistentes. Não use preenchimento com corte, esticamento ou zoom de hover que esconda texto, produto, rosto ou bordas relevantes. Se for necessário encaixar proporções diferentes, mostre a imagem inteira sobre fundo neutro e declare qualquer recorte narrativo proposto. Controles, etiquetas e favoritos ficam fora da área da imagem. Revise galeria, comparação e ficha em desktop e celular; confira o arquivo original para distinguir recorte da interface de enquadramento já existente na imagem. Corrigir o CSS não recupera conteúdo ausente no arquivo de origem. Preserve as regras de identidade e fidelidade na adaptação ao vídeo.
