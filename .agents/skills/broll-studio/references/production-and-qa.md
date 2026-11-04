# Produção e verificação

## Locução e som

Selecione voz apropriada ao idioma e à marca, com direito de uso. Voz de pessoa real exige autorização; não transportar IDs privados de projetos anteriores. Gere amostra quando necessário, escute pronúncia de marca, pausas e entonação. Escreva frases para serem faladas. Meça duração. Evite transformar uma leitura lenta em voz artificial por aceleração excessiva; reescreva ou gere novamente. Se ajustar tempo, preserve pitch e realinhe legendas.

Use música com licença verificável ou trilha original, volume abaixo da fala, fades e efeitos pontuais. Objetivo prático: aproximadamente −14 a −16 LUFS integrados e true peak abaixo de −1 dBTP, ajustado ao destino. Meça o arquivo entregue, não apenas o WAV intermediário.

## Montagem

Use o motor disponível e apropriado. O kit inclui Remotion com um exemplo determinístico; é permitido criar outros layouts, cenas e motores. Prepare mídia e animações antes de renderizar. Para imagens, movimento de câmera não corrige baixa resolução. Para cenas geradas, confira consistência e artefatos. Não use filtros caros em toda a tela sem avaliar qualidade e custo.

## Checklist de entrega

- Duração, dimensões, fps, codecs, proporção e áudio conferidos com ffprobe.
- Decodificação completa sem erro.
- Todos os títulos, acentos, logo, URLs e legendas revisados.
- Quadros no início, meio, fim e limites de transição inspecionados.
- Movimento fluido em playback; atenção a jitter, flashes e vertigem.
- Voz, pronúncia, ritmo, final das frases e música conferidos por audição quando houver ferramenta disponível. Se indisponível, registre a limitação.
- Fontes e afirmações conferidas; imagens não sugerem atributos não verificados.
- Licenças, procedência e arquivos privados revisados antes de publicar.
- Projeto reconstruído com dependências fixadas; comandos documentados.

Inclua `qa.json` com resultados reais e limitações. Se uma verificação não foi executada, use `not_run`, nunca `passed`.
