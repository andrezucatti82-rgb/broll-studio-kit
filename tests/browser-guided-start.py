# Optional local browser QA; requires installed Playwright and Chromium.
# Run npm run atlas first. Does not generate media or publish. Fixtures are not creative approvals.
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
root=Path('/tmp/guided-start-qa');root.mkdir(exist_ok=True);out={'checks':[], 'errors':[]}
def passed(x):out['checks'].append(x)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':375,'height':812},accept_downloads=True,permissions=['clipboard-read','clipboard-write'])
 page=context.new_page();page.on('pageerror',lambda e:out['errors'].append(str(e)))
 page.goto('http://127.0.0.1:8770/');page.wait_for_function('window.ATLAS_READY===true')
 page.locator('#startGuided').click();page.locator('#guidedSubject').fill('Anunciar joias artesanais fictícias');page.locator('#guidedStartingMaterial').select_option('one_photo');page.locator('#guidedNext').click()
 assert page.locator('[data-guided-pick]:visible').count()==1
 first=page.locator('[data-guided-pick]:visible').get_attribute('data-guided-pick');page.locator('#guidedNextSuggestion').click();assert page.locator('[data-guided-pick]:visible').get_attribute('data-guided-pick')!=first
 page.screenshot(path=str(root/'mobile-appearance-final.png'),animations='disabled');page.locator('[data-guided-pick]:visible').click();page.locator('#guidedNext').click();assert page.locator('#guidedMaterials input[value="one_photo"]').is_checked();page.locator('#guidedNext').click();page.locator('#guidedNext').click();page.wait_for_selector('#handoff:not([hidden])');passed('375px: one-photo declaration, three alternatives, selection, materials and prepared request')
 page.locator('#handoffPlatform').select_option('claude');assert page.locator('#chatLink').get_attribute('href')=='https://claude.ai/new';page.locator('#copyPrompt').click();copied=page.evaluate('navigator.clipboard.readText()');assert 'PRIMEIRA RESPOSTA' in copied and 'Claude' in copied;passed('Claude destination and actual clipboard copy')
 page.locator('#starterKit').evaluate('(e)=>e.open=true')
 files={}
 for name in ['pedido.txt','projeto-video.json','LEIA-ME.txt','referencias.json']:
  with page.expect_download() as d:page.locator('[data-starter-file="'+name+'"]').click()
  path=root/name;d.value.save_as(str(path));files[name]=path.read_text()
 assert files['pedido.txt']==page.locator('#promptOutput').input_value();bundle=json.loads(files['projeto-video.json']);assert bundle['project']['conversationPlatform']=='claude';passed('Four independent starter downloads with complete request and canonical project')
 for attr in ['data-frame','data-board']:
  with page.expect_download() as d:page.locator('#referenceFiles ['+attr+']').first.click()
  path=root/d.value.suggested_filename;d.value.save_as(str(path));assert path.read_bytes()[:8]==b'\x89PNG\r\n\x1a\n'
 passed('Reference frame and four-frame sequence download as PNG')
 page.reload();page.wait_for_function('window.ATLAS_READY===true');assert page.evaluate('AtlasCurrentChoice().topic')=='Anunciar joias artesanais fictícias';assert page.evaluate('AtlasCurrentChoice().conversationPlatform')=='claude';passed('Reload restores selected style, briefing and platform')
 page.locator('#importProject').set_input_files(str(root/'projeto-video.json'));page.wait_for_function('document.getElementById("projectMessage").textContent==="Ficha importada."')
 before=page.evaluate('JSON.stringify(AtlasApp.exportBundle().project)');bad=json.loads(files['projeto-video.json']);bad['project']['styles']=['unknown'];page.locator('#importProject').set_input_files({'name':'bad.json','mimeType':'application/json','buffer':json.dumps(bad).encode()});page.wait_for_function('document.getElementById("projectMessage").textContent.includes("recusada")');assert page.evaluate('JSON.stringify(AtlasApp.exportBundle().project)')==before;passed('Valid import and rejected invalid import without project loss')
 page.evaluate('()=>{Storage.prototype.setItem=()=>{throw Error("fixture quota")}}');assert page.evaluate('AtlasApp.save()')==False;assert page.locator('#storageStatus').is_visible();assert 'Não foi possível' in page.locator('#storageStatus').inner_text();passed('Persistent storage failure warning without losing open choices')
 for width in [320,375,768,1440,1920]:
  tab=browser.new_page(viewport={'width':width,'height':900});tab.goto('http://127.0.0.1:8770/');tab.wait_for_function('window.ATLAS_READY===true');assert tab.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),width
  if width==375:assert tab.locator('#grid').evaluate('(e)=>getComputedStyle(e).gridTemplateColumns.split(" ").length')==2
  tab.screenshot(path=str(root/f'library-{width}.png'),animations='disabled');tab.close()
 passed('Library without horizontal overflow at 320, 375, 768, 1440 and 1920px; mobile retains two columns')
 browser.close()
assert not out['errors'],out['errors']
(root/'browser-results.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print(json.dumps(out,ensure_ascii=False))
