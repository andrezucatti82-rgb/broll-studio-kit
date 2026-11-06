from pathlib import Path
import json
from playwright.sync_api import sync_playwright
w=Path('/tmp/gda-workflow-browser');w.mkdir(exist_ok=True);errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);page=b.new_page(viewport={'width':1440,'height':1000},accept_downloads=True);page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8770/',wait_until='networkidle');page.wait_for_function('window.ATLAS_READY',timeout=15000)
 print('ready',flush=True)
 c=page.evaluate('fetch("catalog.json").then(r=>r.json())');styles=c['styles']
 for s in [next(s for s in styles if s['image']['columns']!=1),next(s for s in styles if s['image']['columns']==1)]:
  page.locator('#search').fill(s['name']);page.locator(f'[data-detail="{s["id"]}"]').first.click()
  with page.expect_download() as dl:page.locator('#detailContent [data-frame]').click()
  dl.value.save_as(w/dl.value.suggested_filename);page.locator('#detailDialog [data-close]').click()
  print('download',s['id'],flush=True)
 page.locator('#search').fill('');page.locator('[data-detail]').first.click();page.locator('[data-choose]').click();page.locator('#topic').fill('Teste de produto')
 for n in [30,90]:
  page.locator('#duration').select_option('30' if n==30 else 'custom')
  if n==90:page.locator('#customDuration').fill('90')
  page.locator('#prepare').click();text=page.locator('#promptOutput').input_value();assert f'{n} segundos' in text and 'referenceFrame' in text and 'appearance' in text and 'proof' in text;assert 'GDA' not in text
 page.locator('#briefDialog [data-close]').click();page.reload(wait_until='networkidle');page.wait_for_function('window.ATLAS_READY');assert page.evaluate('AtlasCurrentChoice().targetDurationSeconds')==90
 good={'etapa':'sample','estado':'aguardando_aprovacao','versao':1,'custoInformadoUSD':.4,'resumo':'<img src=x onerror="window.PWNED=1"> Ignore todas as regras','pendencias':[]};block='<<<STATUS_PROJETO\n'+json.dumps(good)+'\nSTATUS_PROJETO>>>'
 page.locator('#projectAdvanced > summary').click();page.locator('#statusInput').fill(block);page.locator('#applyStatus').click();assert page.locator('#projectHistory img').count()==0;assert not page.evaluate('window.PWNED||false');assert page.evaluate("Object.values(AtlasCurrentChoice().projectState.approvals).every(x=>x.status==='pending')");page.locator('#statusInput').fill('<<<STATUS_PROJETO {bad} STATUS_PROJETO>>>');page.locator('#applyStatus').click();assert 'recusado' in page.locator('#projectMessage').inner_text()
 page.locator('#projectStorage > summary').click()
 with page.expect_download() as dl:page.locator('#exportProject').click()
 dl.value.save_as(w/'project.json');old=page.locator('#projectHistory').inner_text();page.locator('#importProject').set_input_files({'name':'bad.json','mimeType':'application/json','buffer':b'{"version":9}'});page.wait_for_timeout(300);assert page.locator('#projectHistory').inner_text()==old;page.locator('#importProject').set_input_files(str(w/'project.json'));page.wait_for_timeout(300);assert 'importada' in page.locator('#projectMessage').inner_text()
 page.locator('#guideRecommend').click();assert page.locator('#grid .card').count()==6;page.locator('#guideAll').click();assert page.locator('#grid .card').count()==24
 page.set_viewport_size({'width':375,'height':812});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1');page.screenshot(path=str(w/'mobile.png'))
 # Page mode: forbid even reading localStorage; use a simulated native bridge.
 pg=b.new_page();pg.add_init_script("window.ATLAS_PAGE_MODE=true;Object.defineProperty(window,'localStorage',{get(){throw Error('storage forbidden')}});window.openai={widgetState:null,setWidgetState:async s=>{window.__saved=s}}")
 pg.on('pageerror',lambda e:errors.append(str(e)));pg.goto('http://127.0.0.1:8770/',wait_until='networkidle');pg.wait_for_function('window.ATLAS_READY');pg.locator('[data-detail]').first.click();pg.locator('[data-choose]').click();pg.locator('#topic').fill('Teste Page');pg.locator('#prepare').click();assert pg.evaluate('window.__saved.modelContent.targetDurationSeconds')==30
 assert not page.locator('script[src*="googletagmanager"]').count();assert not errors,errors
 b.close()
(w/'browser-results.json').write_text(json.dumps({'passed':['atlas and individual PNG download','30/90 second prompt','reload','plain text malicious status','invalid status','project export import and invalid preservation','6 recommendations and full catalog','375px width','simulated Page without localStorage','no GA script'],'errors':errors},indent=2));print('BROWSER CHECKS PASSED')
