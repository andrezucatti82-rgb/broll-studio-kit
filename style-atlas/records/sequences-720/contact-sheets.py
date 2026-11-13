"""Review sheets only. Original boards and extracted deliverables are unchanged."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,sys
root=Path(__file__).resolve().parents[3];work=Path('/workspace/work/sequences-720');out=work/'review';out.mkdir(exist_ok=True)
jobs=json.loads((work/'jobs.json').read_text());families=list(dict.fromkeys(j['family'] for j in jobs));index=[]
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',16)
for family in (sys.argv[1:] or families):
    entries=[]
    for j in jobs:
        p=work/'results'/f"{j['id']}.json"
        revision=work/'revisions'/f"{j['id']}.json"
        if revision.exists():p=revision
        if j['family']==family and p.exists():entries.append((j,json.loads(p.read_text())))
    for offset in range(0,len(entries),6):
        group=entries[offset:offset+6];sheet=Image.new('RGB',(1500,1640),'#f5f0e7');draw=ImageDraw.Draw(sheet)
        for i,(j,r) in enumerate(group):
            x=(i%3)*500;y=(i//3)*820
            draw.text((x+8,y+8),j['id'][:48],font=font,fill='#12334b')
            im=Image.open(r['path']).convert('RGB');im.thumbnail((484,772));sheet.paste(im,(x+(500-im.width)//2,y+36))
        target=out/f'{family}-{offset//6+1:02d}.jpg';sheet.save(target,quality=93)
        index.append({'path':str(target),'ids':[j['id'] for j,r in group]})
(out/'index.json').write_text(json.dumps(index,ensure_ascii=False,indent=2))
print(json.dumps({'sheets':len(index),'boards':sum(len(x['ids']) for x in index)}))
