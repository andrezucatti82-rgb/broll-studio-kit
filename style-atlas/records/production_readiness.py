from pathlib import Path
import json

def apply(catalog):
    evidence=json.loads(Path(__file__).with_name('production-evidence.json').read_text())
    catalog['productionWorkflow']=evidence['workflow']
    for style in catalog['styles']:
        style['readiness']={'status':'sample_review_pending' if style.get('preview') else 'visual_reference','evidence':'Prévia de 10 segundos existente; playback, escuta e aprovação ainda pendentes.' if style.get('preview') else 'Estudo visual; sem amostra audiovisual aprovada registrada.'}
        if style['id'] in evidence['samples']:
            style.update(evidence['samples'][style['id']])
