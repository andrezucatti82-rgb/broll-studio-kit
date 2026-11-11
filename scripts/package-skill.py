"""Package the generic skill without project media or local credentials."""
from pathlib import Path
import hashlib,json,shutil,zipfile
root=Path(__file__).resolve().parent.parent
skill=root/'.agents/skills/video-multimarcas'
(root/'dist').mkdir(exist_ok=True)
for ext in ['skill','zip']:
    output=root/f'dist/video-multimarcas.{ext}'
    with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED) as archive:
        for source in sorted(skill.rglob('*')):
            if source.is_file():
                archive.write(source,'video-multimarcas/'+source.relative_to(skill).as_posix())
        archive.write(root/'docs/INSTALL-SKILL.md','video-multimarcas/INSTALL.md')
        archive.writestr('video-multimarcas/LICENSE',(root/'LICENSE').read_text(encoding='utf-8').split('\nScope:')[0].rstrip()+'\n')
    with zipfile.ZipFile(output) as archive:
        assert archive.testzip() is None
        for source in skill.rglob('*'):
            if source.is_file():
                assert archive.read('video-multimarcas/'+source.relative_to(skill).as_posix())==source.read_bytes()
    print(output.name,output.stat().st_size)

# Build the distributable plugin from the same canonical skill, never a second copy.
name='video-multimarcas'
manifest=json.loads((root/'packaging/video-multimarcas.plugin.json').read_text(encoding='utf-8'))
plugin=root/'plugins'/name
plugin_skill=plugin/'skills'/name
if plugin_skill.exists():
    if root.resolve() not in plugin_skill.resolve().parents:
        raise ValueError('Plugin destination escapes repository')
    shutil.rmtree(plugin_skill)
shutil.copytree(skill,plugin_skill)
(plugin/'.codex-plugin').mkdir(parents=True,exist_ok=True)
(plugin/'.codex-plugin/plugin.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
shutil.copy2(root/'docs/INSTALL-SKILL.md',plugin/'INSTALL.md')
(plugin/'LICENSE').write_text((root/'LICENSE').read_text(encoding='utf-8').split('\nScope:')[0].rstrip()+'\n',encoding='utf-8')
output=root/'dist/video-multimarcas-plugin.zip'
with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED) as archive:
    for source in sorted(plugin.rglob('*')):
        if source.is_file():archive.write(source,source.relative_to(plugin).as_posix())
with zipfile.ZipFile(output) as archive:
    assert archive.testzip() is None
    for source in skill.rglob('*'):
        if source.is_file():
            assert archive.read('skills/'+name+'/'+source.relative_to(skill).as_posix())==source.read_bytes()
catalog=json.loads((root/'style-atlas/dist/catalog.json').read_text(encoding='utf-8'))
release={'plugin':name,'pluginVersion':manifest['version'],'kitVersion':json.loads((root/'package.json').read_text(encoding='utf-8'))['version'],'catalogVersion':catalog['version'],'styleCount':len(catalog['styles']),'categoryCount':len(catalog['families']),'installationScope':'Packages do not install or update a ChatGPT account automatically.','packages':{}}
for source in sorted((root/'dist').glob('video-multimarcas*')):
    if source.is_file():release['packages'][source.name]={'bytes':source.stat().st_size,'sha256':hashlib.sha256(source.read_bytes()).hexdigest()}
(root/'dist/release-manifest.json').write_text(json.dumps(release,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(output.name,output.stat().st_size)
