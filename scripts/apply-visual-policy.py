"""Apply a user-requested video policy to local video skills, with backup and manifest.
Does not update remote providers or publish anything. Dry-run unless --apply.
"""
import argparse, hashlib, json, re, shutil, subprocess
from pathlib import Path

START='<!-- universal-visual-approval:start -->'
END='<!-- universal-visual-approval:end -->'
BLOCK='''<!-- universal-visual-approval:start -->
## Aprovação visual antes de qualquer vídeo IA

Regra do usuário para toda produção de vídeo: apresentar imagens concretas e obter aprovação visual explícita ANTES de gerar qualquer vídeo com IA, inclusive testes gratuitos, prévias de avatar, B-roll e amostras pagas, em qualquer provedor. Não gerar primeiro para pedir aprovação depois. Orçamento, roteiro, voz, escolha de avatar e “pode continuar” não aprovam visuais ainda não apresentados. Registrar escopo, versão/hash e mensagem do usuário; nunca aprovar pelo usuário. Reutilizar somente aprovações válidas do material atual.

Em novas produções: moodboard → styleframes → storyboard visual → aprovação visual → animatic → amostra integrada aprovada → filme completo → revisão audiovisual integral. Para um clipe isolado, apresentar e aprovar os quadros daquele clipe; para edição simples sem geração IA, limitar ao ajuste pedido. Shooting board, beat board e color script entram quando pertinentes. Aprovar aparência não aprova automaticamente movimento ou edição. Mudança visual material invalida a aprovação afetada.

Não substituir recursos prometidos por uma solução visual mais simples sem apresentar a mudança. Testes técnicos e quadros extraídos não equivalem a assistir e ouvir o vídeo inteiro. Sem essa revisão, usar `review_pending` e nome de prévia/candidato; nunca chamar de final. Esta regra antecede receitas de geração e exemplos abaixo. Leia [protocolo visual](references/universal-visual-approval.md) antes da produção.
<!-- universal-visual-approval:end -->'''
PATTERN=re.compile(r'(?i)(?:^|-)(?:video|videos|motion|animation|cinematic|storyboard|b-roll|hyperframes|remotion|heygen|ffmpeg|captions|faceless|talking-head|ugc|slideshow|blitzreels)(?:-|$)')
EXTRA={'cut-the-curve','seam-craft','media-use','gda-editorial-lateral','gda-face-and-body-swap','music-to-video','narrator','script-writer','higgsfield','previs-storyboard','ad-campaign','consistent-characters','sound-and-voice','adobe-edit-quick-cut','adobe-resize-photos-and-videos'}

def updated(text):
    if START in text:
        return re.sub(re.escape(START)+r'.*?'+re.escape(END),lambda _:BLOCK,text,flags=re.S)
    match=re.match(r'\A---\s*\n.*?\n---\s*\n',text,flags=re.S)
    if not match: raise ValueError('Skill has no YAML frontmatter')
    return text[:match.end()]+'\n'+BLOCK+'\n\n'+text[match.end():]

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--root',action='append',required=True)
    p.add_argument('--policy',required=True)
    p.add_argument('--backup',required=True)
    p.add_argument('--apply',action='store_true')
    a=p.parse_args(); policy=Path(a.policy).read_text(encoding='utf-8'); backup=Path(a.backup)
    candidates=set()
    for root in a.root:
        r=subprocess.run(['rg','--files','--hidden',root,'-g','SKILL.md','-g','!node_modules','-g','!.git'],capture_output=True,text=True,encoding='utf-8')
        if r.returncode not in (0,1):raise RuntimeError(r.stderr)
        candidates.update(Path(s).resolve() for s in r.stdout.splitlines())
    records=[]
    for file in sorted(candidates):
        content=file.read_text(encoding='utf-8-sig')
        front=re.match(r'\A---\s*\n(.*?)\n---',content,re.S)
        related=PATTERN.search(file.parent.name) or file.parent.name in EXTRA or 'video-pro-final-editor-2026' in file.parts or 'heygen' in file.parts
        if not front or not related:continue
        ref=file.parent/'references/universal-visual-approval.md'
        changes=[(file,updated(content)),(ref,policy)]
        for target,new in changes:
            old=target.read_bytes() if target.exists() else None
            encoded=new.encode('utf-8')
            if old==encoded or (old is not None and old.decode('utf-8-sig').replace('\r\n','\n')==new):continue
            key=hashlib.sha256(str(target).encode()).hexdigest()
            if a.apply:
                backup.mkdir(parents=True,exist_ok=True)
                if old is not None and not (backup/key).exists():(backup/key).write_bytes(old)
                target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(encoded)
            records.append({'path':str(target),'backup':key if old is not None else None,'before':hashlib.sha256(old).hexdigest() if old is not None else None,'after':hashlib.sha256(encoded).hexdigest()})
    if a.apply:(backup/'manifest.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'applied':a.apply,'skills':sum(x['path'].endswith('SKILL.md') for x in records),'files':len(records),'paths':[x['path'] for x in records if x['path'].endswith('SKILL.md')]},ensure_ascii=False))

if __name__=='__main__':main()
