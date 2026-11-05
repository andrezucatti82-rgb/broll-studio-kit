"""Download actual Google Fonts Latin subsets plus their upstream licenses."""
from pathlib import Path
import json,re,urllib.request,urllib.error,time,hashlib
r=Path(__file__).resolve().parents[1];out=r/'dist/assets/fonts';out.mkdir(parents=True,exist_ok=True)
rows=[
('Contemporânea','Inter','Manrope',700),('Editorial','Source Serif 4','Inter',700),('Condensada','Bebas Neue','Manrope',400),('Premium','Cormorant Garamond','Inter',700),('Tecnológica','Sora','Inter',700),('Técnica','IBM Plex Mono','IBM Plex Sans',700),('Expressiva','Archivo Black','Inter',400),('Amigável','Rubik','Nunito Sans',700),('Elegância clássica','Playfair Display','Inter',700),('Impacto vertical','Oswald','Inter',700),('Geométrica','Montserrat','Inter',700),('Circular','Poppins','Inter',700),('Serifa robusta','Roboto Slab','Inter',700),('Leitura editorial','Merriweather','Inter',700),('Literária','Lora','Inter',700),('Contraste de revista','DM Serif Display','Inter',400),('Digital expressiva','Space Grotesk','Inter',700),('Código criativo','Space Mono','Inter',700),('Esportiva','Barlow Condensed','Inter',700),('Cartaz de impacto','Anton','Inter',400),('Moda de alto contraste','Abril Fatface','Inter',400),('Marcador autoral','Permanent Marker','Inter',400),('Manuscrita espontânea','Caveat','Inter',700),('Humanista','Source Sans 3','Inter',700)]
UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
def get(url):
 for attempt in range(3):
  try:return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':UA}),timeout=30).read()
  except Exception as e:
   if isinstance(e,urllib.error.HTTPError) and e.code==404:raise
   if attempt==2:raise
   time.sleep(1)
files={};licenses={}
for _,heading,body,weight in rows:
 for name,w in [(heading,weight),(body,400)]:
  key=f'{name}:{w}'
  if key in files:continue
  slug=name.lower().replace(' ','');cssurl='https://fonts.googleapis.com/css2?family='+name.replace(' ','+')+f':wght@{w}&display=swap';css=get(cssurl).decode()
  latin=css.split('/* latin */')[-1];urls=re.findall(r'url\((https://fonts.gstatic.com/[^)]+)\)',latin)
  if not urls:raise ValueError('No font URL for '+name)
  url=urls[-1];blob=get(url);assert blob[:4] in [b'wOF2',b'wOFF'],name
  filename=f'{slug}-{w}.woff2';(out/filename).write_bytes(blob)
  files[key]={'family':name,'weight':w,'file':'assets/fonts/'+filename,'sourceUrl':url,'cssSource':cssurl,'sha256':hashlib.sha256(blob).hexdigest(),'bytes':len(blob)}
  if name not in licenses:
   license_url=f'https://raw.githubusercontent.com/google/fonts/main/ofl/{slug}/OFL.txt'
   try:license_data=get(license_url)
   except urllib.error.HTTPError:
    license_url=f'https://raw.githubusercontent.com/google/fonts/main/apache/{slug}/LICENSE.txt';license_data=get(license_url)
   assert b'OPEN FONT LICENSE' in license_data.upper() or b'APACHE' in license_data.upper()
   (out/(slug+'-LICENSE.txt')).write_bytes(license_data);licenses[name]=license_url
  print('Font ready:',name,w,flush=True)
options=[dict(id=h.lower().replace(' ','-'),label=f'{label} · {h} + {b}',heading=h,body=b,weight=w,headingKey=f'{h}:{w}',bodyKey=f'{b}:400') for label,h,b,w in rows]
(r/'dist/fonts.json').write_text(json.dumps(dict(version=1,options=options,files=files,licenses=licenses),ensure_ascii=False,indent=2))
print('24 real typography options prepared')
