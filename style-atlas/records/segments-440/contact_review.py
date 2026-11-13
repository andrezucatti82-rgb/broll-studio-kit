"""Private contact sheets for static review. Does not approve images or modify sources."""
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont

record = Path(__file__).resolve().parent
work = record.parents[3] / 'work/ads-440'
jobs = json.loads((record / 'concepts.json').read_text())
out = work / 'visual-contact'
out.mkdir(exist_ok=True)
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12)
created = []
for start in range(0, len(jobs), 10):
    chunk = jobs[start:start + 10]
    records = []
    for j in chunk:
        refined = work / 'refinements' / (j['id'] + '.json')
        records.append(refined if refined.exists() else work / 'results' / (j['id'] + '.json'))
    if not all(r.exists() for r in records):
        continue
    target = out / f'{start // 10:02d}.jpg'
    if target.exists() and target.stat().st_mtime >= max(r.stat().st_mtime for r in records):
        continue
    canvas = Image.new('RGB', (1250, 830), '#f7f3eb')
    draw = ImageDraw.Draw(canvas)
    for i, (j, r) in enumerate(zip(chunk, records)):
        im = Image.open(json.loads(r.read_text())['path']).convert('RGB')
        im.thumbnail((246, 369))
        x, y = (i % 5) * 250, (i // 5) * 415
        canvas.paste(im, (x, y))
        draw.text((x + 3, y + 372), str(start + i) + ': ' + j['name'][:28], font=font, fill='#102344')
        draw.text((x + 3, y + 389), j['family'] + ' / ' + str(j['heroIndex'] + 1), font=font, fill='#102344')
    canvas.save(target, quality=94)
    created.append(target.name)
print('Created/updated:', created, '; total:', len(list(out.glob('*.jpg'))))
