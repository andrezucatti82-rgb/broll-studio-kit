"""Standalone Page widget. State belongs to this widget, not external localStorage."""
from pathlib import Path
from bs4 import BeautifulSoup
from fontTools.ttLib import TTFont
from fontTools import subset
import json,gzip,base64,io
r=Path(__file__).resolve().parents[1];origin='https://video-multimarcas-estilos.andrezucatti82.chatgpt.site/'
def pack(s):return base64.b64encode(gzip.compress(s.encode(),mtime=0)).decode()
soup=BeautifulSoup((r/'dist/references.html').read_text(),'html.parser')
for node in soup.select('header,.ref-intro,footer,link[rel=stylesheet],script'):node.decompose()
data=json.loads((r/'dist/visual-references.json').read_text())
for item in data['references']:
 for key in ['validation','query','authors']:item.pop(key,None)
css=(r/'dist/styles.css').read_text()+(r/'dist/references.css').read_text()
css=css.replace("url('assets/","url('"+origin+"assets/")
for font in ['Geist-Regular.ttf','Geist-Bold.ttf']:
 face=TTFont(r/'dist/assets'/font);sub=subset.Subsetter();sub.populate(unicodes=list(range(0x100))+list(range(0x300,0x370))+list(range(0x2000,0x2070))+list(range(0x2190,0x2200))+[0x2713,0x2714]);sub.subset(face);face.flavor='woff2';buf=io.BytesIO();face.save(buf);css=css.replace(origin+'assets/'+font,'data:font/woff2;base64,'+base64.b64encode(buf.getvalue()).decode())
css+='\n.ref-main{padding:12px}.ref-workspace{grid-template-columns:minmax(0,1fr) 260px;gap:18px}.ref-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.direction-panel{padding:18px}@media(max-width:760px){.ref-workspace{display:flex}.ref-main{padding:8px}.ref-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}'
source=(r/'dist/reference-bridge.js').read_text()+'\n'+(r/'dist/references.js').read_text()
boot=soup.new_tag('script');boot.string='window.REFERENCES_PAGE_MODE=true;(async()=>{async function inflate(s){return await new Response(new Blob([Uint8Array.from(atob(s),c=>c.charCodeAt(0))]).stream().pipeThrough(new DecompressionStream("gzip"))).text();}window.REFERENCE_CATALOG=JSON.parse(await inflate('+json.dumps(pack(json.dumps(data,ensure_ascii=False,separators=(',',':'))))+'));const style=document.createElement("style");style.textContent=await inflate('+json.dumps(pack(css))+');document.head.append(style);const script=document.createElement("script");script.textContent=await inflate('+json.dumps(pack(source))+');document.body.append(script);})().catch(()=>document.getElementById("refCount").textContent="Não foi possível abrir as referências. Use a galeria pública.");';soup.body.append(boot)
html=str(soup);assert len(html.encode())<262144
(r/'records/reference-page-embed.html').write_text(html);print('Reference Page embed bytes:',len(html.encode()))
