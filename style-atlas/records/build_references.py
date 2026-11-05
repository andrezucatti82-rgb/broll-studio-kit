"""Build a reference index from public project metadata; never redistribute source art.
Inputs and downloaded covers stay in an external working directory. Output contains
project links, remote cover URLs, attribution and derived approximate colors only.
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json, hashlib, urllib.request, io, collections, argparse, re, colorsys
from PIL import Image, ImageDraw

p=argparse.ArgumentParser();p.add_argument('--work',type=Path,required=True);args=p.parse_args()
work=args.work;root=Path(__file__).resolve().parents[1];(work/'covers').mkdir(exist_ok=True)
candidates=json.loads((work/'candidates.json').read_text());authors={x['id']:x['authors'] for x in json.loads((work/'authors.json').read_text())}
directions={
 'luxury brand identity':('Identidade visual','Luxo e moda','Observe proporção, respiro e relação entre marca e fotografia.'),
 'experimental typography':('Tipografia','Tipografia experimental','Observe escala, ritmo e contraste tipográfico; preserve a leitura da mensagem.'),
 'editorial magazine layout':('Layouts','Editorial e revistas','Observe hierarquia, grid e relação entre texto e imagem.'),
 'cosmetics packaging design':('Direção de arte','Cosméticos e embalagens','Observe luz, materiais e composição; substitua pelo produto original sem modificar rótulos.'),
 'restaurant visual identity':('Identidade visual','Gastronomia','Observe a relação entre apetite visual, fotografia e identidade.'),
 'architectural art direction':('Direção de arte','Arquitetura e espaços','Observe enquadramento, luz e materialidade; não invente características do imóvel.'),
 'fashion campaign design':('Direção de arte','Campanhas de moda','Observe styling, recorte e relação entre pessoa, produto e ambiente.'),
 'technology brand identity':('Identidade visual','Marcas de tecnologia','Observe hierarquia e consistência de identidade entre aplicações.'),
 'sports graphic design':('Layouts','Esporte e energia','Observe contraste, escala e organização da mensagem em composições dinâmicas.'),
 'cultural poster design':('Layouts','Cartazes e cultura','Observe foco, espaço negativo e diálogo entre imagem e título.'),
 'organic sustainable branding':('Paletas','Natural e sustentável','Observe relações de cor e material; não atribua sustentabilidade a um produto sem comprovação.'),
 'music festival identity':('Identidade visual','Música e eventos','Observe sistemas gráficos e variações de identidade entre formatos.'),
 'colorful ecommerce design':('Paletas','Comércio e cor','Observe contraste e protagonismo do produto; use ofertas e atributos confirmados.'),
 'financial dashboard design':('Layouts','Interfaces e dados','Observe densidade, agrupamento e hierarquia. Usar telas reais para demonstrar sistemas existentes.'),
 'health wellness branding':('Identidade visual','Saúde e bem-estar','Observe clareza, confiança e acolhimento visual sem inferir promessas de saúde.'),
 'kids playful branding':('Paletas','Lúdico e expressivo','Observe combinações de cor, formas e leitura apropriada ao público.'),
 'cinematic motion design':('Direção de arte','Cinema e motion','A capa mostra aparência; abra o projeto para verificar se há demonstração de movimento.'),
 'minimal swiss typography':('Tipografia','Tipografia e grid','Observe alinhamento, contraste de pesos e respiro entre elementos.')}
def inspect(x):
 try:
  if x.get('hasMatureContent') or x.get('isPremium') or x['id'] in [23533997,67629967,258013527]:return None
  url=x.get('coverUrl','')
  if not url.startswith('https://mir-s3-cdn-cf.behance.net/'):return None
  path=work/'covers'/f"{x['id']}.img"
  if not path.exists():
   req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
   with urllib.request.urlopen(req,timeout=25) as r:raw=r.read(8_000_000)
   path.write_bytes(raw)
  raw=path.read_bytes();im=Image.open(io.BytesIO(raw)).convert('RGB');w,h=im.size
  if min(w,h)<180:return None
  small=im.resize((128,128));q=small.quantize(colors=24,method=Image.Quantize.MEDIANCUT);pal=q.getpalette();colors=sorted(q.getcolors(),reverse=True)
  picked=[]
  ranked=[]
  for count,i in colors:
   rgb=tuple(pal[i*3:i*3+3]);saturation=colorsys.rgb_to_hsv(*(v/255 for v in rgb))[1]
   ranked.append((count*(1+saturation*2),rgb))
  for score,rgb in sorted(ranked,reverse=True):
   if all(sum((a-b)**2 for a,b in zip(rgb,other))**.5>58 for other in picked):picked.append(rgb)
   if len(picked)>=5:break
  palette=['#%02x%02x%02x'%rgb for rgb in picked]
  cat,theme,guide=directions[x['searchQuery']];a=authors.get(x['id'],[])
  text=' '.join([x['title']]+x.get('tags',[])+x.get('creativeFields',[])).lower()
  categories=[]
  if re.search(r'typograph|typeface|lettering|calligraph|font',text):categories.append('Tipografia')
  if re.search(r'editorial|magazine|layout|poster|dashboard|ui/ux|web design|website',text):categories.append('Layouts')
  if re.search(r'brand|identity|identidade|logo',text):categories.append('Identidade visual')
  if re.search(r'photograph|campaign|motion|cinematic|art direction|3d|packaging|architecture',text):categories.append('Direção de arte')
  if not categories:categories=['Direção de arte']
  cat='Paletas' if directions[x['searchQuery']][0]=='Paletas' else categories[0]
  categories=[cat]
  color_words=[]
  for c in palette:
   red,green,blue=[int(c[i:i+2],16)/255 for i in (1,3,5)];hue,sat,val=colorsys.rgb_to_hsv(red,green,blue)
   word='preto' if val<.18 else ('branco creme' if val>.8 and sat<.15 else ('cinza neutro' if sat<.15 else ['vermelho','laranja','amarelo','verde','verde','turquesa','ciano','azul','azul','roxo','rosa','vermelho'][min(11,int(hue*12))]))
   color_words+=word.split()
  guide={'Paletas':'Observe combinações, proporções e contraste de cores. A paleta é aproximada, extraída da capa; adapte à identidade da marca.','Tipografia':'Observe escala, contraste de pesos e legibilidade. Confirme fontes e licenças no projeto antes da produção.','Layouts':'Observe grid, hierarquia, espaço negativo e relação entre imagem e mensagem.','Identidade visual':'Observe a consistência entre cores, formas, tipografia e aplicações. Adapte a direção à marca do vídeo.','Direção de arte':'Observe enquadramento, iluminação, materiais e composição. A capa não comprova o movimento do projeto.'}[cat]
  if not a:return None
  return {'id':f"ref-{x['id']}",'title':x['title'],'url':x['url'],'image':url,'author':', '.join(y['name'] for y in a),'authors':a,'palette':palette,'category':cat,'categories':categories,'tags':list(dict.fromkeys(color_words+x.get('tags',[])[:12])),'guidance':guide,'license':x.get('license','Consultar projeto'),'query':x['searchQuery'],'validation':{'imageFetched':True,'width':w,'height':h,'sha256':hashlib.sha256(raw).hexdigest(),'review':'metadata-and-cover-contact-sheet'}}
 except Exception as e:return {'failed':x['id'],'reason':type(e).__name__}
with ThreadPoolExecutor(max_workers=12) as pool:results=list(pool.map(inspect,candidates))
good=[x for x in results if x and 'failed' not in x];seen=set();seen_ids=set();seen_urls=set();seen_images=set();groups=collections.defaultdict(list)
for x in good:
 digest=x['validation']['sha256']
 if digest in seen or x['id'] in seen_ids or x['url'] in seen_urls or x['image'] in seen_images:continue
 seen.add(digest);seen_ids.add(x['id']);seen_urls.add(x['url']);seen_images.add(x['image']);groups[x['query']].append(x)
selected=[];overflow=[]
for query in directions:selected+=groups[query][:30];overflow+=groups[query][30:]
selected+=overflow[:540-len(selected)]
assert len(selected)==540,{'usable':len(good),'selected':len(selected),'groups':{q:len(v) for q,v in groups.items()}}
# Interleave themes so the opening gallery demonstrates variety.
queues=[collections.deque([x for x in selected if x['query']==q]) for q in directions];ordered=[]
while any(queues):
 for queue in queues:
  if queue:ordered.append(queue.popleft())
assert all(x['categories']==[x['category']] for x in ordered)
assert len({x['id'] for x in ordered})==540
data={'version':'1.1','categoryPolicy':'exclusive-primary','title':'Referências visuais','collectedAt':'2026-11-05','count':540,'categories':['Identidade visual','Paletas','Tipografia','Layouts','Direção de arte'],'method':'Public project metadata and remotely hosted covers; one exclusive primary category per project. Approximate colors sampled from covers; fonts and full project content require inspection before production.','references':ordered}
(root/'dist/visual-references.json').write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')))
report={'candidates':len(candidates),'usable':len(good),'selected':len(ordered),'uniqueImages':len({x['validation']['sha256'] for x in ordered}),'uniqueProjects':len({x['id'] for x in ordered}),'categoryPolicy':'exclusive-primary','categoryCounts':dict(collections.Counter(x['category'] for x in ordered)),'categoryMemberships':len(ordered),'crossCategoryDuplicates':0,'failures':[x for x in results if x and 'failed' in x],'queryCounts':dict(collections.Counter(x['query'] for x in ordered)),'reviewStatus':'Contact sheets pending visual review; no claim of reviewing full project media.'}
(work/'validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
for batch in range(18):
 sheet=Image.new('RGB',(1500,1050),'#f6f1e7');draw=ImageDraw.Draw(sheet)
 for i,x in enumerate(ordered[batch*30:(batch+1)*30]):
  im=Image.open(work/'covers'/(x['id'][4:]+'.img')).convert('RGB');im.thumbnail((242,164));col=i%6;row=i//6;px=col*250;py=row*210;sheet.paste(im,(px,py));draw.text((px+3,py+166),f"{batch*30+i+1}: {x['title'][:30]}",fill='#18252b');draw.text((px+3,py+183),x['category'][:30],fill='#18252b')
 sheet.save(work/f'contact-{batch+1:02d}.jpg',quality=86)
print(json.dumps(report,ensure_ascii=False))
