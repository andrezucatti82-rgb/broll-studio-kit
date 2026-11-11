"""Expansion UI and actual Page bundle regression, without account/plugin claims."""
from pathlib import Path
from urllib.parse import urlparse
import json,os
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1];dist=root/'style-atlas/dist';catalog=json.loads((dist/'catalog.json').read_text());base=os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8770/');errors=[];shots=Path('/tmp/atlas-720-browser');shots.mkdir(exist_ok=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);page=browser.new_page(viewport={'width':1440,'height':1000},ignore_https_errors=True,accept_downloads=True);page.on('pageerror',lambda e:errors.append(str(e)));page.goto(base,wait_until='networkidle');page.wait_for_function('window.ATLAS_READY');page.locator('#newFilter').click();assert '180 opções' in page.locator('#resultCount').inner_text()
 for family in catalog['families']:
  page.locator(f'[data-family="{family["id"]}"]').click();assert '10 opções' in page.locator('#resultCount').inner_text();assert page.locator('#grid .card').count()==10
  page.locator('#grid').scroll_into_view_if_needed();page.evaluate("document.querySelectorAll('#grid img').forEach(i=>i.loading='eager')");page.wait_for_function("Array.from(document.querySelectorAll('#grid img')).every(i=>i.complete&&i.naturalWidth>=800)")
 page.screenshot(path=str(shots/'new-desktop.png'))
 s=catalog['styles'][-1];page.locator(f'[data-detail="{s["id"]}"]').first.click()
 with page.expect_download() as dl:page.locator('#detailContent [data-frame]').click()
 dl.value.save_as(shots/'new-frame.png');assert dl.value.suggested_filename==s['id']+'.png';page.locator('#detailContent [data-choose]').click();page.locator('#topic').fill('Campanha com nova direção');page.locator('#duration').select_option('custom');page.locator('#customDuration').fill('90');page.locator('#prepare').click();assert s['proof'] in page.locator('#promptOutput').input_value();page.reload(wait_until='networkidle');page.wait_for_function('window.ATLAS_READY');assert page.evaluate('AtlasCurrentChoice().targetDurationSeconds')==90
 page.set_viewport_size({'width':375,'height':812});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1');page.locator('#newFilter').click();page.screenshot(path=str(shots/'new-mobile.png'))
 # Exercise the compiled Page HTML and its content-addressed catalog payload.
 pg=browser.new_page(ignore_https_errors=True);pg.on('pageerror',lambda e:errors.append(str(e)))
 pg.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw Error('Page must not use localStorage')}});window.openai={widgetState:{privateContent:{catalogVersion:'4.0',favoriteBits:'1'+'0'.repeat(539)}},setWidgetState:async s=>{if(new TextEncoder().encode(JSON.stringify(s)).length>16384)throw Error('Widget state too large');window.__saved=s}}")
 def serve(route):
  rel=urlparse(route.request.url).path.lstrip('/');f=dist/rel
  if f.exists() and f.is_file():route.fulfill(path=str(f))
  else:route.abort()
 pg.route('https://video-multimarcas-estilos.andrezucatti82.chatgpt.site/**',serve);pg.route('http://127.0.0.1:8770/page-expansion-test',lambda route:route.fulfill(path=str(root/'style-atlas/records/page-embed.html'),content_type='text/html'));pg.goto('http://127.0.0.1:8770/page-expansion-test');pg.wait_for_function('window.ATLAS_READY');loaded=pg.evaluate('async()=>await window.ATLAS_CATALOG_PROMISE');assert len(loaded['styles'])==720
 pg.locator('#favoriteFilter').click();assert '1 opção' in pg.locator('#resultCount').inner_text();pg.locator('#favoriteFilter').click();pg.locator('#newFilter').click();assert '180 opções' in pg.locator('#resultCount').inner_text()
 selected=catalog['styles'][540:550];state={'modelContent':{'targetDurationSeconds':30,'format':'9:16','topic':'Dez estilos','selectedStyles':[{'id':s['id']} for s in selected]}}
 pg.evaluate("s=>dispatchEvent(new CustomEvent('openai:set_globals',{detail:{globals:{widgetState:s}}}))",state);pg.locator('#openBrief').click();assert pg.locator('.brief-style').count()==10;pg.locator('#topic').fill('Dez estilos com memória compacta');pg.locator('#prepare').click();saved=pg.evaluate('window.__saved');assert len(saved['modelContent']['selectedStyles'])==10;assert len(json.dumps(saved,ensure_ascii=False).encode())<16384;prompt=pg.locator('#promptOutput').input_value();assert all(s['proof'] in prompt for s in selected);assert not errors,errors;browser.close()
print('PASS: 180 new images / 18 categories, PNG download, new prompt, 90s persistence, 375px, actual Page bundle, 4.0 favorites migration, ten-style compact Page state')
