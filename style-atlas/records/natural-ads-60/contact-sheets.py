"""Inspection sheets only; no retouching of the source assets."""
import json
from PIL import Image,ImageDraw
from pathlib import Path
r=Path(__file__).parent;jobs=json.loads((r/'concepts.json').read_text());out=Path('/workspace/work/natural-ads-60/review');out.mkdir(exist_ok=True)
for family in dict.fromkeys(j['family'] for j in jobs):
 rows=[j for j in jobs if j['family']==family];sheet=Image.new('RGB',(1536,1600),'#f5f0e7');draw=ImageDraw.Draw(sheet);n=0
 for i,j in enumerate(rows):
  result=Path('/workspace/work/natural-ads-60/results')/(j['id']+'.json')
  source=Path('/workspace/deliveries/anuncios-naturais-piloto')/j['pilot'] if j['pilot'] else Path(json.loads(result.read_text())['path']) if result.exists() else None
  if not source:continue
  im=Image.open(source).convert('RGB');im.thumbnail((506,758));x=(i%3)*512;y=(i//3)*800;sheet.paste(im,(x+(512-im.width)//2,y+30));draw.text((x+4,y+3),j['name'],fill='black');n+=1
 sheet.save(out/(family+'.jpg'),quality=90)
 print(family,n)
