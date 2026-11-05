"""Validate a curated reference catalog against its real covers before publication.

Keep research inputs and downloaded artwork outside the repository. Example:
python records/build_references.py --work /tmp/reference-review \
  --input /tmp/reference-review/curated-catalog.json --base previous-catalog.json
Inspect the generated report, then repeat with --publish to replace dist/catalog.
The script verifies evidence; it does not perform visual review or identify fonts.
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
import argparse,hashlib,io,json,urllib.request,collections,re

p=argparse.ArgumentParser()
p.add_argument('--work',type=Path,required=True)
p.add_argument('--input',type=Path,required=True)
p.add_argument('--base',type=Path)
p.add_argument('--publish',action='store_true')
a=p.parse_args();a.work.mkdir(parents=True,exist_ok=True);(a.work/'covers').mkdir(exist_ok=True)
d=json.loads(a.input.read_text());refs=d['references'];categories=d['categories']
assert len(refs)==d['count'] and d['categoryPolicy']=='exclusive-primary'
assert len(categories)==len(set(categories)) and categories
assert set(d['categoryDetails'])==set(categories)
for key in ['id','url','image']:
 assert len({x[key] for x in refs})==len(refs),f'Duplicate {key}'
assert len({x['validation']['sha256'] for x in refs})==len(refs),'Duplicate image bytes'
assert sum(x.get('addedIn')==d['version'] for x in refs)==d['addedCount']
for x in refs:
 assert x['category'] in categories and x['categories']==[x['category']]
 assert re.fullmatch(r'ref-\d+',x['id']) and x['author'] and x['authors']
 assert x['url'].startswith('https://www.behance.net/gallery/'+x['id'][4:]+'/')
 assert x['image'].startswith('https://mir-s3-cdn-cf.behance.net/')
 assert x['validation']['review'] in ['metadata-and-cover-contact-sheet','cover-contact-sheet-reviewed']
 assert 1<=len(x['palette'])<=5 and all(re.fullmatch(r'#[a-fA-F0-9]{6}',c) for c in x['palette'])
if a.base:
 prior=json.loads(a.base.read_text())['references'];assert [x['id'] for x in refs[:len(prior)]]==[x['id'] for x in prior],'Keep previous favorite bit positions stable'
 assert len(refs)-len(prior)==d['addedCount']
 for before,after in zip(prior,refs):
  assert before['image']==after['image'] and before['validation']['sha256']==after['validation']['sha256'],'Do not change saved original references'
def check(x):
 path=a.work/'covers'/(x['id'][4:]+'.img')
 if not path.exists():
  with urllib.request.urlopen(urllib.request.Request(x['image'],headers={'User-Agent':'Mozilla/5.0'}),timeout=30) as response:raw=response.read(8_000_000)
  path.write_bytes(raw)
 raw=path.read_bytes();im=Image.open(io.BytesIO(raw));im.load();v=x['validation']
 assert hashlib.sha256(raw).hexdigest()==v['sha256'],x['id']+' cover changed'
 assert im.size==(v['width'],v['height']) and min(im.size)>=180,x['id']+' image dimensions'
 return x['id']
with ThreadPoolExecutor(max_workers=12) as pool:checked=list(pool.map(check,refs))
counts=dict(collections.Counter(x['category'] for x in refs));assert set(counts)==set(categories)
report={'catalogVersion':d['version'],'selected':len(refs),'added':d['addedCount'],'uniqueProjects':len(refs),'uniqueImages':len(checked),'categoryPolicy':d['categoryPolicy'],'categoryCounts':counts,'categoryMemberships':sum(counts.values()),'crossCategoryDuplicates':0,'stableIdsAndOrderPreserved':bool(a.base),'reviewStatus':'Cover review recorded in input; this script checks metadata, image bytes and category exclusivity, not full project media.'}
(a.work/'validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
output=Path(__file__).resolve().parents[1]/'dist/visual-references.json' if a.publish else a.work/'validated-catalog.json'
output.write_text(json.dumps(d,ensure_ascii=False,separators=(',',':')))
print(json.dumps(report,ensure_ascii=False));print('Output:',output)
