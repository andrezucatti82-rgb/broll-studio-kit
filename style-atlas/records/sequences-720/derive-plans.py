"""Expand existing distinct motion descriptions into traceable four-state briefs.
Authored overrides in plans/ take priority. Output remains pending visual review.
"""
import json,re
from pathlib import Path
HERE=Path(__file__).parent
ROOT=HERE.parents[2]
c=json.loads((ROOT/'style-atlas/dist/catalog.json').read_text())
for f in c['families']:
    p=HERE/'plans'/f"{f['id']}.json"
    if p.exists():continue
    rows=[]
    for s in [x for x in c['styles'] if x['family']==f['id']]:
        parts=[x.strip().rstrip('.') for x in re.split(r';',s['motion']) if x.strip()]
        first=f"Estabeleça o assunto fictício: {s['exampleTopic']}. Mostre seu estado anterior à ação, preservando a linguagem: {s['signature']}"
        if len(parts)>=3:
            beats=[first,parts[0]+'.',parts[1]+'.','; '.join(parts[2:])+'. Mostrar o resultado legível e estável, relacionado ao primeiro quadro.']
        elif len(parts)==2:
            beats=[first,parts[0]+'.','Mostrar a consequência imediata dessa ação no mesmo assunto, com um detalhe revelador e composição diferente, antes da resolução.',parts[1]+'. Resultado final estável, sem inventar atributos.']
        else:
            beats=[first,f"Início da ação específica deste estilo: {s['motion']}. Escolha o gesto ou mudança de estado inicial e mostre-o acontecendo.",f"Consequência visível da ação '{s['motion']}': mostre um novo estado do mesmo assunto, com continuidade material e causal. Esta imagem deve revelar informação que não estava visível no quadro anterior.",f"Resolva visualmente '{s['motion']}' no contexto '{s['exampleTopic']}'. O resultado deve fechar a ação iniciada, mantendo identidade e técnica; mensagem curta opcional, sem alegações inventadas."]
        rows.append(beats)
    p.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
print('Existing motion directions expanded; authored plans preserved. Visual review is still required.')
