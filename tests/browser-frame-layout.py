"""Mixed atlas/standalone gallery geometry on desktop and mobile; no AI calls."""
from pathlib import Path
import os,json
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1];catalog=json.loads((root/'style-atlas/dist/catalog.json').read_text());out=Path('/tmp/atlas-frame-review');out.mkdir(exist_ok=True)
base=os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8770/');errors=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=browser.new_page(ignore_https_errors=True,reduced_motion='reduce');page.on('pageerror',lambda e:errors.append(str(e)));page.goto(base,wait_until='networkidle');page.wait_for_function('window.ATLAS_READY');assert page.locator('#familySelect option').count()==19;assert page.locator('#families').count()==0
 for width in [375,430,1024,1440,1920]:
  page.set_viewport_size({'width':width,'height':900})
  if width>=1280:assert page.locator('#grid').evaluate('(e)=>getComputedStyle(e).gridTemplateColumns.split(" ").length')==5
  for family in catalog['families']:
   page.locator('#familySelect').select_option(family['id']);assert page.locator('#grid .card').count()==40
   measurements=page.locator('#grid .thumb').evaluate_all('(els)=>els.map(e=>{const r=e.getBoundingClientRect();return {w:r.width,h:r.height}})')
   assert all(abs(x['w']/x['h']-1.126)<.01 for x in measurements),(width,family['id'],measurements)
   assert max(x['h'] for x in measurements)-min(x['h'] for x in measurements)<1,(width,family['id'])
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),width
   if width<=700:
    assert measurements[0]['w']>=width*.82
    assert page.locator('#grid .summary').first.evaluate('(e)=>getComputedStyle(e).display')=='none'
  page.locator('#familySelect').select_option('cinema')
  page.evaluate("async()=>{await Promise.all([...document.querySelectorAll('#grid img')].map(i=>{i.loading='eager';return i.decode()}))}")
  page.locator('#grid .card').nth(30 if width<=700 else 28).scroll_into_view_if_needed();page.screenshot(path=str(out/f'gallery-{width}.png'))
  # An individual wide frame must stay whole in detail and inside a fixed brief thumbnail.
  style=next(s for s in catalog['styles'] if s.get('edition')=='4.1' and s['family']=='cinema')
  page.locator(f'[data-detail="{style["id"]}"]').first.click()
  box=page.locator('#detailContent .detail-image').bounding_box();assert abs(box['width']/box['height']-style['image']['width']/style['image']['height'])<.02
  assert page.locator('#detailContent img').first.evaluate('(i)=>getComputedStyle(i).objectFit')=='contain'
  page.locator('#detailContent [data-choose]').click();box=page.locator('.brief-style-image').first.bounding_box();img=page.locator('.brief-style-image img').first.bounding_box()
  assert abs(box['width']/box['height']-1.5)<.02;assert abs(box['x']-img['x'])<1 and abs(box['y']-img['y'])<1
  assert abs(box['width']-img['width'])<1 and abs(box['height']-img['height'])<1
  page.locator('#briefDialog [data-close]').click()
 assert not errors,errors;browser.close()
print('PASS: equal frames across 720 styles at 375/430/1024/1440/1920px; no horizontal overflow; full detail image; contained brief thumbnail')
