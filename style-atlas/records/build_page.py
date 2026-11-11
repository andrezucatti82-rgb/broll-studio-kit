from pathlib import Path
from bs4 import BeautifulSoup
import json,re,gzip,base64,io,hashlib
from collections import Counter
from fontTools.ttLib import TTFont
from fontTools import subset
r=Path(__file__).resolve().parents[1]
origin='https://video-multimarcas-estilos.andrezucatti82.chatgpt.site/'
catalog=json.loads((r/'dist/catalog.json').read_text())
# Audio remains at top-level and travels in widget state; omit duplicate preset copy.
for item in catalog['styles']:
 item['preset'].pop('audio',None)
 for key,field in [('requiredAssets','requirements'),('quality','proof')]:
  if item['preset'].get(key)==item.get(field):item['preset'].pop(key,None)
 for k in ['version','skill','firstDelivery','approvalGate','camera','brand','research']:
  item['preset'].pop(k,None)
 item.pop('previousName',None)
 item.pop('visualLanguage',None)
 item['image'].pop('source',None)
soup=BeautifulSoup((r/'dist/index.html').read_text(),'html.parser')
for selector in ['footer']:
 for node in soup.select(selector):node.decompose()
for link in soup.find_all('link',rel='stylesheet'):link.decompose()
# Use the original brand asset in Pages without a relative-URL dependency.
for logo in soup.select('img.app-brand-logo'):
 logo['src']='data:image/png;base64,'+base64.b64encode((r/'dist/assets/logo-gda.png').read_bytes()).decode()
css=((r/'dist/styles.css').read_text()+'\n'+(r/'dist/app-shell.css').read_text()).replace("url('assets/","url('"+origin+"assets/")
for font in ['Geist-Regular.ttf','Geist-Bold.ttf']:
 face=TTFont(r/'dist/assets'/font)
 # Embed Latin/Portuguese and UI symbols; unsupported scripts use browser fallback.
 sub=subset.Subsetter();sub.populate(unicodes=list(range(0x100))+list(range(0x300,0x370))+list(range(0x2000,0x2070))+list(range(0x2190,0x2200))+[0x2713,0x2714,0x2715,0x2716]);sub.subset(face)
 face.flavor='woff2';buf=io.BytesIO();face.save(buf)
 css=css.replace(origin+'assets/'+font,'data:font/woff2;base64,'+base64.b64encode(buf.getvalue()).decode())
def pack(text):return base64.b64encode(gzip.compress(text.encode(),mtime=0)).decode()
script=soup.find('script',src='app.js');script.decompose()
for name in ['workflow.js','site-ui.js','gallery-views.js','app-shell.js']:
 node=soup.find('script',src=name)
 if node:node.decompose()
counts=Counter()
def count_strings(v):
 if isinstance(v,str):counts[v]+=1
 elif isinstance(v,list):
  for x in v:count_strings(x)
 elif isinstance(v,dict):
  for x in v.values():count_strings(x)
count_strings(catalog)
pool=[v for v,n in counts.items() if n>1 and len(v)>24];indexes={v:i for i,v in enumerate(pool)}
def encode(v):
 if isinstance(v,str) and v in indexes:return {'$s':indexes[v]}
 if isinstance(v,list):return [encode(x) for x in v]
 if isinstance(v,dict):return {k:encode(x) for k,x in v.items()}
 return v
packed=base64.b64encode(gzip.compress(json.dumps({'pool':pool,'catalog':encode(catalog)},ensure_ascii=False,separators=(',',':')).encode(),mtime=0)).decode()
# A content-addressed data-only script keeps the Page below its 256 KiB limit.
# JSONP-style loading avoids CORS requirements; the payload contains only base64 JSON.
payload='window.ATLAS_PACKED_CATALOG='+json.dumps(packed)+';\n'
name='catalog-data-'+hashlib.sha256(payload.encode()).hexdigest()[:16]+'.js'
(r/'dist/assets'/name).write_text(payload)
boot=soup.new_tag('script');boot.string='window.ATLAS_PAGE_MODE=true;window.ATLAS_ASSET_BASE='+json.dumps(origin)+';window.ATLAS_CATALOG_PROMISE=(async()=>{await new Promise((resolve,reject)=>{const s=document.createElement("script");s.src='+json.dumps(origin+'assets/'+name)+';s.onload=resolve;s.onerror=()=>reject(Error("Catálogo remoto indisponível"));document.head.append(s);});const bytes=Uint8Array.from(atob(window.ATLAS_PACKED_CATALOG),c=>c.charCodeAt(0));const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));const d=JSON.parse(await new Response(stream).text());function revive(v){if(Array.isArray(v))return v.map(revive);if(v&&typeof v==="object"){if(Object.keys(v).length===1&&"$s" in v)return d.pool[v.$s];return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,revive(x)]));}return v;}return revive(d.catalog);})();';soup.body.append(boot)
app=soup.new_tag('script');app.string='(async()=>{async function inflate(s){return await new Response(new Blob([Uint8Array.from(atob(s),c=>c.charCodeAt(0))]).stream().pipeThrough(new DecompressionStream("gzip"))).text();}const css=await inflate('+json.dumps(pack(css))+');const style=document.createElement("style");style.textContent=css;document.head.append(style);const source=await inflate('+json.dumps(pack((r/'dist/workflow.js').read_text()+'\n'+(r/'dist/site-ui.js').read_text()+'\n'+(r/'dist/gallery-views.js').read_text()+'\n'+(r/'dist/app-shell.js').read_text()+'\n'+(r/'dist/app.js').read_text()))+');const script=document.createElement("script");script.textContent=source;document.body.append(script);})().catch(()=>{document.getElementById("grid").textContent="Não foi possível abrir a biblioteca nesta superfície. Use o site público."});';soup.body.append(app)
# Catalogue uses standard gzip decompression in modern browsers, without eval.
html=str(soup);assert len(html.encode())<262144,len(html.encode())
(r/'records/page-embed.html').write_text(html)
print('Page embed bytes:',len(html.encode()))
