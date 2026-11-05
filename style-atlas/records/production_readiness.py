from pathlib import Path
import json

def apply(catalog):
    evidence=json.loads(Path(__file__).with_name('production-evidence.json').read_text())
    catalog['productionWorkflow']=evidence['workflow']
    for style in catalog['styles']:
        style['readiness']={'status':'sample_review_pending' if style.get('preview') else 'visual_reference','evidence':'Amostra em vídeo existente; revisão audiovisual e aprovação pendentes.' if style.get('preview') else 'Estudo visual estático. Execução audiovisual ainda não validada.'}
        if style['id'] in evidence['samples']:
            style.update(evidence['samples'][style['id']])
