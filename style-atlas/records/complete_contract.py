def apply(catalog):
 for s in catalog['styles']:
  s.setdefault('proof',f"Demonstrar nos 10 segundos: {s['motion']}. Comparar intenção e resultado em reprodução contínua, com início, ação e resultado visíveis; estudo estático não comprova execução.")
  s.setdefault('requirements',f"Para {s['familyName']}: confirmar tema, marca e direitos; preparar {', '.join(s['resources'])}. Fornecer originais de itens reais e referências compatíveis com os ângulos. Textos finais editáveis; testar a ação antes da montagem completa.")
  s.setdefault('audio',{'voice':'Voz licenciada em português, natural e clara, guiando a mensagem de '+s['name']+'.','music':'Trilha licenciada coerente com a linguagem '+s['familyName']+', ajustada à fala.','sfx':'Efeitos pontuais sincronizados à ação: '+s['motion']+'; evitar efeito em cada palavra.','mix':'Fala inteligível, música com ducking e escuta integral da mixagem.'})
  s['preset'].setdefault('productFidelity','Itens reais exigem originais: preservar forma, cor, proporções, rótulo, identidade física e marca. Limitar ângulos à cobertura disponível; não inventar atributos. Aplicar protocolos de identidade e fidelidade e comparar na amostra.')
