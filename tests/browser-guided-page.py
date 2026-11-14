# Optional local browser QA; requires installed Playwright and Chromium.
# Run npm run atlas first. Does not generate media or publish. Fixtures are not creative approvals.
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
root=Path('/tmp/guided-start-qa');root.mkdir(exist_ok=True);repo=Path(__file__).resolve().parents[1];result={}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);page=b.new_page(viewport={'width':1440,'height':1000});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.add_init_script('''window.storageReads=0;Object.defineProperty(window,'localStorage',{get(){window.storageReads++;throw Error('forbidden')}});window.savedStates=[];window.openai={widgetState:null,setWidgetState:async state=>{await new Promise(r=>setTimeout(r,30));window.savedStates.push(state);window.openai.widgetState=state}};''')
 page.route('**/page-candidate',lambda r:r.fulfill(body=(repo/'style-atlas/records/page-embed.html').read_text(),content_type='text/html'))
 page.route('**/assets/catalog-data-*.js',lambda r:r.fulfill(body=(repo/'style-atlas/dist/assets'/r.request.url.split('/')[-1]).read_text(),content_type='application/javascript'))
 page.goto('http://127.0.0.1:8770/page-candidate');page.wait_for_function('window.ATLAS_READY===true',timeout=60000)
 page.evaluate("AtlasApp.chooseStyle('publicidade-cinematografica')");page.evaluate("async()=>{const t=document.getElementById('topic');t.value='Primeiro';t.dispatchEvent(new Event('change',{bubbles:true}));t.value='Segundo';t.dispatchEvent(new Event('change',{bubbles:true}));await AtlasApp.save();}")
 assert page.evaluate('savedStates.at(-1).modelContent.topic')=='Segundo';assert page.evaluate('storageReads')==0;result['orderedPageSaves']=True
 page.locator('#openBrief').click();page.locator('#briefForm').evaluate('(e)=>e.requestSubmit()');page.wait_for_selector('#handoff:not([hidden])');page.locator('#handoffPlatform').select_option('claude');assert page.locator('#chatLink').is_visible();assert page.locator('#chatLink').get_attribute('href')=='https://claude.ai/new';result['claudeLinkInPageMode']=True
 page.evaluate('''()=>{let s=AtlasCurrentChoice().projectState;for(let i=0;i<80;i++)s.history.push({etapa:'script',estado:'pendente',versao:1,custoInformadoUSD:0,resumo:'x'.repeat(400),pendencias:[]})}''');assert page.evaluate('AtlasApp.save()')==False;assert 'limite' in page.locator('#storageStatus').inner_text();assert page.evaluate('storageReads')==0;result['pageLimitWarningWithoutLocalStorage']=True
 with page.expect_download() as d:page.locator('#starterKit').evaluate('(e)=>e.open=true');page.locator('[data-starter-file="projeto-video.json"]').click()
 d.value.save_as(str(root/'page-over-limit-project.json'));assert len(json.loads((root/'page-over-limit-project.json').read_text())['project']['history'])==80;result['overLimitProjectDownload']=True
 page.screenshot(path=str(root/'page-candidate.png'),animations='disabled');assert not errors,errors;result['pageErrors']=errors
 b.close()
(root/'page-results.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
