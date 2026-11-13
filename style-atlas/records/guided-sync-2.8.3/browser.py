from pathlib import Path
import json,threading,sys,hashlib,tempfile
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[2];out=Path(tempfile.mkdtemp(prefix='guided-sync-'));live='--live' in sys.argv;errors=[]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();local='http://127.0.0.1:'+str(server.server_address[1])+'/'
base='https://videos.gerenciadordeanuncios.com.br/' if live else local;main='natural-barras-a-pausa-cabe-na-bolsa';complement='publicidade-cinematografica';hashes={};release=None
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':1440,'height':1000},ignore_https_errors=True);page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(base,wait_until='networkidle');page.wait_for_function('window.ATLAS_READY&&typeof window.AtlasApp.setPrincipalStyle==="function"')
 if live:
  release=page.evaluate('new URL(window.ATLAS_CATALOG_URL,location.href).href').rsplit('/',1)[0]+'/'
  for name in ['app.js','guided-ui.js','app-shell.css','app-shell.js','workflow.js','gallery-views.js','guided.js','style-picker.js','catalog.json']:
   h=page.evaluate('''async url=>{const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);return [...new Uint8Array(await crypto.subtle.digest('SHA-256',await r.arrayBuffer()))].map(v=>v.toString(16).padStart(2,'0')).join('')}''',release+name)
   assert h==hashlib.sha256((root/'dist'/name).read_bytes()).hexdigest(),name;hashes[name]=h
 for id,name in [(main,'A pausa cabe na bolsa'),(complement,'Publicidade cinematográfica')]:page.locator('#search').fill(name);page.locator('#grid [data-choose="'+id+'"]').click()
 page.evaluate('''([a,b])=>{AtlasApp.setStyleContributions(a,[{aspect:'palette',scope:'film'}]);AtlasApp.setStyleContributions(b,[{aspect:'lighting',scope:'closing'}])}''',[main,complement])
 before=page.evaluate('JSON.stringify(AtlasCurrentChoice().styleContributions)')
 page.locator('#selectionTray .primary').click();page.locator('#topic').fill('Quero criar um anúncio com sugestão de uso do produto, estilo UGC');page.locator('#brand').fill('Marca fictícia do teste');page.locator('#startGuided').click();page.locator('#guidedNext').click()
 assert page.locator('#guidedCurrentStyle [data-detail="'+main+'"]').is_visible();assert not page.locator('#guidedAlternatives').evaluate('(e)=>e.open')
 page.screenshot(path=str(out/(('live-' if live else '')+'desktop.png')))
 page.set_viewport_size({'width':375,'height':812});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1');page.screenshot(path=str(out/(('live-' if live else '')+'mobile.png')))
 page.locator('#guidedNext').click();page.locator('#guidedMaterials input[value="one_photo"]').check();page.locator('#guidedNext').click();page.locator('#guidedRefresh').click()
 assert page.locator('#guidedCurrentStyle [data-detail="'+main+'"]').is_visible()
 page.locator('#guidedNext').click();page.locator('#guidedNext').click();page.locator('#guidedNext').click();page.wait_for_function('AtlasCurrentChoice().requestPrepared===true')
 assert page.evaluate('AtlasCurrentChoice().selectedStyles[0].id')==main
 assert page.evaluate('JSON.stringify(AtlasCurrentChoice().styleContributions)')==before
 assert 'A pausa cabe na bolsa' in page.locator('#promptOutput').input_value()
 page.locator('#startGuided').click();page.locator('#guidedNext').click();page.locator('#guidedAlternatives>summary').click()
 target=page.locator('[data-guided-pick]').first.get_attribute('data-guided-pick');assert target not in [main,complement]
 page.locator('[data-guided-pick="'+target+'"]').click();assert page.evaluate('AtlasCurrentChoice().selectedStyles[0].id')==target
 assert page.evaluate('AtlasCurrentChoice().selectedStyles[1].id')==complement
 assert page.evaluate('AtlasApp.getStyleContributions("'+complement+'")[0].scope')=='closing'
 assert page.locator('#guidedCurrentStyle [data-detail="'+target+'"]').is_visible();page.keyboard.press('Escape')
 assert page.locator('#briefVisual [data-detail="'+target+'"]').is_visible()
 page.reload(wait_until='networkidle');page.wait_for_function('window.ATLAS_READY&&typeof window.AtlasApp.setPrincipalStyle==="function"');assert page.evaluate('AtlasCurrentChoice().selectedStyles[0].id')==target
 page.locator('#selectionTray .primary').click();page.locator('#startGuided').click();page.locator('#guidedSubject').fill('Rascunho antigo');page.keyboard.press('Escape')
 page.locator('#topic').fill('Tema mais recente do briefing');page.locator('#brand').fill('Marca mais recente');page.locator('#startGuided').click()
 assert page.locator('#guidedSubject').input_value()=='Tema mais recente do briefing';assert page.locator('#guidedBrand').input_value()=='Marca mais recente';page.keyboard.press('Escape')
 for width in [320,375,768,1440]:
  page.set_viewport_size({'width':width,'height':900});page.locator('#startGuided').click();page.locator('#guidedNext').click();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1');assert page.locator('#guidedCurrentStyle [data-detail="'+target+'"]').is_visible();page.keyboard.press('Escape')
 if not live:
  pg=b.new_page(viewport={'width':375,'height':812},ignore_https_errors=True);pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw Error('storage forbidden')}});window.openai={widgetState:{},setWidgetState:async s=>window.__saved=s}")
  pg.route(local+'page-test',lambda route:route.fulfill(content_type='text/html',body=(root/'records/page-embed.html').read_text()))
  pg.goto(local+'page-test',wait_until='networkidle');pg.wait_for_function('window.ATLAS_READY&&typeof window.AtlasApp.setPrincipalStyle==="function"')
  pg.locator('#search').fill('A pausa cabe na bolsa');pg.locator('#grid [data-choose="'+main+'"]').click();pg.locator('#selectionTray .primary').click();pg.locator('#topic').fill('Anúncio fictício de barras proteicas');pg.locator('#startGuided').click();pg.locator('#guidedNext').click();assert pg.locator('#guidedCurrentStyle [data-detail="'+main+'"]').is_visible()
  pg.locator('#guidedAlternatives>summary').click();target2=pg.locator('[data-guided-pick]').first.get_attribute('data-guided-pick');pg.locator('[data-guided-pick="'+target2+'"]').click();pg.wait_for_function('([id])=>window.__saved?.modelContent?.selectedStyles?.[0]?.id===id',arg=[target2])
  pg.evaluate('''()=>{const incoming=structuredClone(window.__saved);incoming.modelContent.selectedStyles=[{id:'publicidade-cinematografica'}];incoming.modelContent.styleContributions={'publicidade-cinematografica':[{aspect:'style_direction',scope:'film'}]};window.dispatchEvent(new CustomEvent('openai:set_globals',{detail:{globals:{widgetState:incoming}}}))}''')
  assert pg.locator('#guidedCurrentStyle [data-detail="'+complement+'"]').is_visible();assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
 assert not errors,errors;b.close()
result={'live':live,'release':release,'runtimeFilesMatchSource':hashes,'principalPinnedOutsideRecommendations':True,'refreshRetainsPrincipal':True,'preparePreservesTwoStylesAndContributions':True,'explicitSwapImmediatelyUpdatesBrief':True,'swapPreservesComplementaryScope':True,'reloadRetainsSwap':True,'dirtyDraftAdoptsLatestBriefFields':True,'viewports':[320,375,768,1440],'noHorizontalOverflow':True,'pageBridgeNoLocalStorageAndIncomingState':not live,'nativePageViewerTested':False,'physicalDeviceTested':False,'paidGenerationCalls':0,'errors':errors}
(out/('live-result.json' if live else 'browser-result.json')).write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps(result,ensure_ascii=False))
