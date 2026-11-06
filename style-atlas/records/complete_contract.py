def apply(catalog):
 for s in catalog['styles']:
  s.setdefault('proof',f"Demonstrar nos 10 segundos: {s['motion']}. Conferir início, ação e resultado em playback; estudo estático não comprova execução.")
  s.setdefault('requirements',f"Preparar recursos para {s['familyName']}: {', '.join(s['resources'])}. Confirmar direitos, originais e ângulos. Textos editáveis e teste da ação.")
  s.setdefault('audio',{'voice':'Voz licenciada natural e clara para '+s['name'],'music':'Trilha licenciada coerente com '+s['familyName'],'sfx':'Efeitos pontuais sincronizados a '+s['motion'],'mix':'Ducking e escuta integral.'})
  s['preset'].setdefault('productFidelity','Usar originais de itens reais, preservar identidade, forma, cor, rótulo e marca; limitar ângulos e comparar a amostra pelos protocolos existentes.')
