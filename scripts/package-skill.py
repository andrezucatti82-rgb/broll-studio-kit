"""Package the generic skill without project media or local credentials."""
from pathlib import Path
import zipfile
root=Path(__file__).resolve().parent.parent
skill=root/'.agents/skills/video-multimarcas'
(root/'dist').mkdir(exist_ok=True)
for ext in ['skill','zip']:
    output=root/f'dist/video-multimarcas.{ext}'
    with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED) as archive:
        for source in sorted(skill.rglob('*')):
            if source.is_file():
                archive.write(source,'video-multimarcas/'+str(source.relative_to(skill)))
        archive.write(root/'docs/INSTALL-SKILL.md','video-multimarcas/INSTALL.md')
        archive.writestr('video-multimarcas/LICENSE',(root/'LICENSE').read_text().split('\nScope:')[0]+'\n')
    with zipfile.ZipFile(output) as archive:
        assert archive.testzip() is None
        for source in skill.rglob('*'):
            if source.is_file():
                assert archive.read('video-multimarcas/'+str(source.relative_to(skill)))==source.read_bytes()
    print(output.name,output.stat().st_size)
