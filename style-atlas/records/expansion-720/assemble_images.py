"""Extract the five independent generated frames; no creative editing or upscaling."""
import argparse,json,hashlib
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
parser=argparse.ArgumentParser();parser.add_argument('--source-dir',type=Path,required=True);parser.add_argument('--partial',action='store_true');a=parser.parse_args()
root=Path(__file__).resolve().parents[2];out=root/'dist/assets/expansion-720';record=Path(__file__).parent
rows=json.loads((record/'directions.json').read_text());assets=[];boards=[]
for fam in rows:
 if fam in ['grafico','tecnologia','software','apresentacoes']:continue
 for part in range(2):
  meta=a.source_dir/f'{fam}-{part+1}.json'
  if not meta.exists():
   if a.partial:continue
   raise RuntimeError(f'Missing generated board: {meta.name}')
  j=json.loads(meta.read_text());src=Path(j['path']);im=Image.open(src).convert('RGB');w,h=im.size
  boards.append({'id':f'{fam}-{part+1}','sourceSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'sourceSize':[w,h],'rowBoundaries':j.get('bounds'),'prompt':j['prompt'],'provider':'OpenAI image generation tool','kind':'fictional visual study','review':'Static visual review required; no video execution evidence.'})
  for k in range(5):
   # Keep full frame width; measured generated row boundaries. No content-aware crop or stretch.
   bounds=j.get("bounds",[round(n*h/5) for n in range(6)])
   rect=[0,bounds[k],w,bounds[k+1]];frame=im.crop(rect);path=out/f'{fam}-{31+part*5+k:02}.webp';frame.save(path,quality=94)
   assets.append({'path':str(path.relative_to(root/'dist')),'board':f'{fam}-{part+1}','rectPixels':rect,'width':frame.width,'height':frame.height,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
for fam in ['grafico','tecnologia','software','apresentacoes']:
 for i in range(10):
  path=out/f'{fam}-{31+i:02}.webp';im=Image.open(path);assets.append({'path':str(path.relative_to(root/'dist')),'source':'render_graphics.py','kind':'original coded composition; fictional data/interface','width':im.width,'height':im.height,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
(record/'assets.json').write_text(json.dumps({'boards':boards,'assets':assets},ensure_ascii=False,indent=2)+'\n')
qa=a.source_dir/'review';qa.mkdir(exist_ok=True);font=ImageFont.truetype(str(root/'dist/assets/Geist-Regular.ttf'),17)
for fam in rows:
 paths=[out/f'{fam}-{i:02}.webp' for i in range(31,41)]
 if not all(p.exists() for p in paths):continue
 sheet=Image.new('RGB',(1800,480),'#eee9df');d=ImageDraw.Draw(sheet)
 for i,p in enumerate(paths):
  im=Image.open(p);im.thumbnail((350,195));x=(i%5)*360;y=(i//5)*240;sheet.paste(im,(x+(350-im.width)//2,y));d.text((x+8,y+200),f'{i+31:02} · {rows[fam][i]["name"][:29]}',fill='#15303a',font=font)
 sheet.save(qa/f'{fam}.jpg',quality=92)
print(f'{len(assets)} individual assets, {len(boards)} generated boards registered')
