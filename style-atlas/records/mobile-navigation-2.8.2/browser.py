from pathlib import Path
import json,threading,tempfile
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[2];out=Path(tempfile.mkdtemp(prefix='atlas-mobile-nav-'));errors=[]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base='http://127.0.0.1:'+str(server.server_address[1])+'/'
results={}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1050},ignore_https_errors=True);page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(base,wait_until='networkidle');page.wait_for_function('window.ATLAS_READY&&window.AtlasNavigation')
 assert page.locator('[data-nav-style],.category-shortcuts,[data-explore-family]').count()==0
 for group,total in [('commercial',120),('natural-ads',60),('business',120),('technology',80),('movement',160),('visual',240)]:
  page.locator('[data-nav-group="'+group+'"]').click();assert page.locator('#resultCount').inner_text().startswith(str(total)+' estilos')
  assert page.locator('[data-nav-group="'+group+'"]').get_attribute('aria-expanded')=='true'
 page.locator('[data-nav-family="cinema"]').click();assert page.locator('#grid .card').count()==40
 page.locator('#grid [data-choose]').first.click();choice=page.evaluate('JSON.stringify(AtlasCurrentChoice().selectedStyles)');assert not page.locator('#startGuided').is_visible();assert page.locator('#selectionTray .primary').is_visible()
 page.locator('#grid .favorite').first.click();assert page.locator('#grid .favorite').first.get_attribute('aria-pressed')=='true'
 page.locator('[data-nav-group="technology"]').click();page.locator('[data-nav-family="software"]').click();assert page.locator('#grid .card').count()==40
 assert page.evaluate('JSON.stringify(AtlasCurrentChoice().selectedStyles)')==choice
 page.locator('.category-all').click();assert page.locator('#resultCount').inner_text().startswith('780 estilos')
 page.locator('[data-nav-group="commercial"]').click();page.locator('[data-nav-family="anuncios"]').click()
 page.screenshot(path=str(out/'desktop-gallery.png'))
 for w in [320,375,390,430,700,768,1440,1920]:
  page.set_viewport_size({'width':w,'height':950});page.wait_for_timeout(150)
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),('overflow',w)
  columns=page.locator('#grid').evaluate('(e)=>getComputedStyle(e).gridTemplateColumns.split(" ").length')
  assert columns==(2 if w<=700 else 5 if w>=1600 else 3),(w,columns)
  sizes=page.locator('#grid .preview').evaluate_all('(els)=>els.slice(0,12).map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}))')
  assert max(s['w'] for s in sizes)-min(s['w'] for s in sizes)<2
  assert all(abs(s['h']/s['w']-1.5)<.02 for s in sizes)
  results[str(w)]={'columns':columns,'noHorizontalOverflow':True,'consistentImageSize':True}
 page.set_viewport_size({'width':375,'height':812});page.locator('#categoryExplorer').evaluate('(e)=>e.open=false');page.locator('#grid').scroll_into_view_if_needed();page.screenshot(path=str(out/'mobile-gallery.png'))
 assert not page.locator('#grid .sequence-strip').first.is_visible()
 page.locator('#grid [data-detail]').first.click();assert page.locator('.film-sheet .frame-expand').count()==4
 assert page.locator('.film-steps').is_visible();page.keyboard.press('Escape')
 page.locator('#grid .compare-toggle input').first.check();assert page.locator('#compareBar').is_visible()
 page.locator('#grid .compare-toggle input').first.uncheck()
 page.locator('#openCategories').click();assert page.locator('#categoryDrawer').is_visible()
 assert page.locator('#categoryGroups [data-nav-group]').count()==6
 page.locator('[data-nav-group="visual"]').click();page.screenshot(path=str(out/'mobile-menu.png'))
 assert page.locator('[data-nav-style],.category-shortcuts,[data-explore-family]').count()==0
 page.locator('[data-nav-family="grafico"]').click();page.locator('#exploreCategory').click();assert not page.locator('#categoryDrawer').is_visible()
 page.locator('#openCategories').click();page.locator('#categorySearch').fill('educacao');assert page.locator('#categoryGroups [data-nav-family]').count()==3
 page.locator('#categorySearch').fill('');page.locator('#closeCategories').focus();page.keyboard.press('Shift+Tab');assert page.evaluate('document.activeElement.id')=='exploreCategory';page.keyboard.press('Tab');assert page.evaluate('document.activeElement.id')=='closeCategories'
 page.keyboard.press('Escape');assert page.evaluate('document.activeElement.id')=='openCategories'
 page.reload(wait_until='networkidle');page.wait_for_function('window.ATLAS_READY&&window.AtlasNavigation');assert page.evaluate('JSON.stringify(AtlasCurrentChoice().selectedStyles)')==choice
 page.locator('#favoriteFilter').click();assert page.locator('#grid .card').count()==1
 # Compiled Page uses its real remote media/catalogue and a simulated native bridge.
 pg=b.new_page(viewport={'width':375,'height':812},ignore_https_errors=True);pg.on('pageerror',lambda e:errors.append(str(e)))
 pg.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw Error('storage forbidden')}});window.openai={widgetState:{},setWidgetState:async s=>window.__saved=s}")
 pg.route(base+'page-test',lambda route:route.fulfill(content_type='text/html',body=(root/'records/page-embed.html').read_text()))
 pg.goto(base+'page-test',wait_until='networkidle');pg.wait_for_function('window.ATLAS_READY&&window.AtlasNavigation')
 assert pg.locator('#grid').evaluate('(e)=>getComputedStyle(e).gridTemplateColumns.split(" ").length')==2
 pg.locator('#grid [data-choose]').first.click();pg.wait_for_function('window.__saved?.modelContent?.selectedStyles?.length===1')
 pg.locator('#openCategories').click();pg.locator('[data-nav-group="natural-ads"]').click();pg.locator('[data-nav-family="ads-joias"]').click();pg.locator('#exploreCategory').click();assert pg.locator('#grid .card').count()==6
 assert pg.evaluate('AtlasCurrentChoice().selectedStyles.length')==1
 assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
 assert not errors,errors;b.close()
record={'viewports':results,'twoLevelMenu':True,'parentCounts':[120,60,120,80,160,240],'all780IdsPreserved':True,'detailHasFourFrames':True,'favoriteCompareSelection':True,'reloadPreservedSelectionAndFavorite':True,'categorySearch':True,'drawerKeyboardAndFocus':True,'pageBridgeSimulatedNoLocalStorage':True,'nativePageViewerTested':False,'physicalDeviceTested':False,'videoGenerated':False,'errors':errors}
(out/'browser-result.json').write_text(json.dumps(record,ensure_ascii=False,indent=2));print(json.dumps({'output':str(out),'checks':record},ensure_ascii=False))
