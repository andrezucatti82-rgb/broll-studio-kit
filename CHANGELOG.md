# Histórico de versões

## 2.0.0 — Direção e revisão audiovisual

- Critérios explícitos contra execução dominada por fotos com zoom, profundidade limitada, cortes uniformes e transições escolhidas por índice.
- Plano por cena com ação interna, estado inicial/final, mídia, luz, oclusão, câmera, conexão entre planos e som.
- Prova do plano mais exigente com sua transição, antes da produção completa.
- Playback contínuo e escuta integral exigidos para registrar acabamento revisado; indisponibilidade resulta em revisão pendente, não em aprovação.
- Ficha de revisão vinculada ao SHA256 do vídeo, critérios criativos e bloqueadores; validador confere o registro, não substitui a avaliação.
- Formato de render v2: quantidade livre de planos, duração por plano em frames, mídia de imagem ou vídeo, camadas independentes e corte/dissolvência explícitos. Migração em `docs/MIGRATION-2.md`.
- Sete testes para montagem temporal, validação de mídia/legendas e estados de revisão.

O kit continua sendo infraestrutura. Travessias por objeto, 3D, rotoscopia e tracking exigem trabalho específico; não foram adicionados como efeitos automáticos. Nenhum vídeo de demonstração ou mídia de cliente acompanha esta versão.

## 1.2.0

Nome público alterado para Vídeo Multimarcas, com identificador `video-multimarcas`.

## 1.1.0

Retirada da demonstração comercial. Kit com rascunho técnico neutro.
