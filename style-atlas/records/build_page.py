from pathlib import Path
from bs4 import BeautifulSoup
import json,re,gzip,base64,io
from collections import Counter
from fontTools.ttLib import TTFont
from fontTools import subset
r=Path(__file__).resolve().parents[1]
origin='https://video-multimarcas-estilos.andrezucatti82.chatgpt.site/'
catalog=json.loads((r/'dist/catalog.json').read_text())
# Audio remains at top-level and travels in widget state; omit duplicate preset copy.
for item in catalog['styles']:
 item['preset'].pop('audio',None)
 for k in ['version','skill','firstDelivery','approvalGate','camera','brand','research']:
  item['preset'].pop(k,None)
 item.pop('previousName',None)
 item.pop('visualLanguage',None)
 item['image'].pop('source',None)
soup=BeautifulSoup((r/'dist/index.html').read_text(),'html.parser')
for selector in ['.hero','.workflow','.section-head','.closing','.setup-box','footer']:
 for node in soup.select(selector):node.decompose()
header=soup.select_one('.mast');header.clear();header.append(BeautifulSoup('<div class="page-toolbar"><span>Compare, escolha e salve seu briefing.</span><button id="openBrief" class="pill">Minha escolha <span id="chosenCount">0</span></button></div>','html.parser'))
for link in soup.find_all('link',rel='stylesheet'):link.decompose()
bridge=soup.find('script',src='reference-bridge.js')
if bridge:bridge.decompose()
css=((r/'dist/styles.css').read_text()+(r/'dist/references.css').read_text()).replace("url('assets/","url('"+origin+"assets/")
for font in ['Geist-Regular.ttf','Geist-Bold.ttf']:
 face=TTFont(r/'dist/assets'/font)
 # Embed Latin/Portuguese and UI symbols; unsupported scripts use browser fallback.
 sub=subset.Subsetter();sub.populate(unicodes=list(range(0x100))+list(range(0x300,0x370))+list(range(0x2000,0x2070))+list(range(0x2190,0x2200))+[0x2713,0x2714,0x2715,0x2716]);sub.subset(face)
 face.flavor='woff2';buf=io.BytesIO();face.save(buf)
 css=css.replace(origin+'assets/'+font,'data:font/woff2;base64,'+base64.b64encode(buf.getvalue()).decode())
css+='\n.mast{padding:12px 16px}.page-toolbar{display:flex;align-items:center;justify-content:space-between;width:100%;gap:15px;font-size:12px;color:var(--muted)}main{padding:20px 16px}.grid{grid-template-columns:repeat(3,minmax(0,1fr))}@media(max-width:700px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}'
def pack(text):return base64.b64encode(gzip.compress(text.encode(),mtime=0)).decode()
script=soup.find('script',src='app.js');script.decompose()
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
boot=soup.new_tag('script');boot.string='window.ATLAS_PAGE_MODE=true;window.ATLAS_ASSET_BASE='+json.dumps(origin)+';window.ATLAS_CATALOG_PROMISE=(async()=>{const bytes=Uint8Array.from(atob('+json.dumps(packed)+'),c=>c.charCodeAt(0));const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));const d=JSON.parse(await new Response(stream).text());function revive(v){if(Array.isArray(v))return v.map(revive);if(v&&typeof v==="object"){if(Object.keys(v).length===1&&"$s" in v)return d.pool[v.$s];return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,revive(x)]));}return v;}return revive(d.catalog);})();';soup.body.append(boot)
fonts=soup.new_tag('script');fonts.string='window.ATLAS_FONT_CATALOG='+json.dumps(json.loads((r/'dist/fonts.json').read_text()),ensure_ascii=False).replace('</','<\\/')+';';soup.body.append(fonts)
app=soup.new_tag('script');app.string='(async()=>{async function inflate(s){return await new Response(new Blob([Uint8Array.from(atob(s),c=>c.charCodeAt(0))]).stream().pipeThrough(new DecompressionStream("gzip"))).text();}const css=await inflate('+json.dumps(pack(css))+');const style=document.createElement("style");style.textContent=css;document.head.append(style);const source=await inflate('+json.dumps(pack((r/'dist/app.js').read_text()))+');const script=document.createElement("script");script.textContent=source;document.body.append(script);})().catch(()=>{document.getElementById("grid").textContent="Não foi possível abrir a biblioteca nesta superfície. Use o site público."});';soup.body.append(app)
# Catalogue uses standard gzip decompression in modern browsers, without eval.
html=str(soup);assert len(html.encode())<262144,len(html.encode())
(r/'records/page-embed.html').write_text(html)
print('Page embed bytes:',len(html.encode()))
