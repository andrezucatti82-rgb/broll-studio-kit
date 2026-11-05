# Motion Design de Campanha — estudos para aprovação

30 referências visuais e três estudos audiovisuais de 10 segundos, 1280×720, 24 fps. Não são vídeos finais aprovados. Imagens fictícias não documentam produtos, pessoas ou resultados reais.

- `scene.html` / `scene.js`: Canvas 2D, composição de fotografia e cenas Three.js originais, com tempo determinístico `renderFrame(t)`.
- `render.py`: renderiza os 18 estudos em código ou os três clipes. As 12 imagens IA são assets versionados, não regenerados pelo build.
- `mix_audio.py`: trilhas e efeitos originais sintetizados, mix com locução fornecida separadamente e normalização. Não clona voz nem faz chamada paga.
- `vendor/`: Three.js 0.181 e RoomEnvironment, licença MIT incluída. Fontes no diretório de assets com suas licenças.
- `production.json`: origem, roteiro, plano e limites da revisão.

## Reproduzir

Na raiz de `style-atlas`, sirva `python -m http.server 8765`. Instale Playwright, Pillow, numpy e soundfile; disponibilize Chromium e ffmpeg. Informe `CHROME_PATH` se necessário.

```sh
python records/motion-campaign/render.py --out /tmp/campaign
python records/motion-campaign/render.py --video 1 --out /tmp/campaign
python records/motion-campaign/render.py --video 2 --out /tmp/campaign
python records/motion-campaign/render.py --video 3 --out /tmp/campaign
python records/motion-campaign/mix_audio.py --work /tmp/campaign --out dist/previews
```

O mix espera `voice-type.wav`, `voice-stage.wav` e `voice-lens.wav` no diretório de trabalho. Use gravações autorizadas ou voz pública/licenciada. A duração de cada fala deve caber nos 10 segundos com sua entrada; o script não deve servir para cortar uma fala mais longa. Para outros projetos, ajuste roteiro e duração primeiro.

Na produção destes estudos, a tentativa de voz via Freepik/Magnific foi bloqueada pela cota gratuita diária, sem cobrança. Foi usada síntese local Kokoro-82M, voz pública `pf_dora`, idioma pt-br, velocidade 1.08. Não é a voz de André nem clonagem de pessoa fornecida pelo usuário. Modelo e runtime não são incluídos no repositório: https://huggingface.co/hexgrad/Kokoro-82M (model card declara Apache-2.0), https://github.com/thewh1teagle/kokoro-onnx (MIT). Consulte as versões/licenças antes de reinstalar. Não exige esse provedor para usar o atlas.

## Limites

A amostra 1 mostra reorganização tipográfica; a 2 usa objeto fictício em cena 3D estilizada e painéis articulados; a 3 amplia a mesma fotografia por uma janela óptica, sem revelar nova geometria. As referências 3D são estudos de composição, não simulações físicas certificadas. Texto de pesquisas consultado; vídeos externos não foram considerados assistidos.

Conferência de quadros, decodificação e medição de áudio não substituem reprodução contínua com escuta. O estado permanece `review_pending` para aprovação de direção, ritmo, voz e acabamento. Para um vídeo real, aplicar também os protocolos de fidelidade e identidade e testar os recursos exigentes antes de expandir.
