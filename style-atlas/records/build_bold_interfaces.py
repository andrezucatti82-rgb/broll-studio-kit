"""Render original, explicitly illustrative chart and UI studies. No platform screenshots."""
from pathlib import Path
import json, math, hashlib, html
from playwright.sync_api import sync_playwright
from PIL import Image
from bold_styles import DATA
ROOT=Path(__file__).resolve().parents[1]
COLORS=['#2458db','#df7250','#238877','#9661ba','#dbac43']
def line(points,color='#2458db',width=3):
 return f'<polyline points="{points}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>'
def text(x,y,s,size=11,color='#4e5c6d'):
 return f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}">{html.escape(str(s))}</text>'
def circle(x,y,r,c):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}"/>'
def rect(x,y,w,h,c,rx=4):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{c}"/>'
def path(d,c,stroke='none',width=1):return f'<path d="{d}" fill="{c}" stroke="{stroke}" stroke-width="{width}"/>'
def chart(k):
 s=''
 if k==0:
  for n in range(6):
   x=22+(n%3)*126;y=25+(n//3)*116;s+=text(x,y,chr(65+n));s+=line(' '.join(f'{x+j*18},{y+75-((j*17+n*13)%62)}' for j in range(6)),COLORS[n%5],2);s+=line(f'{x},{y+80} {x+95},{y+80}','#b5beca',1)
 elif k==1:
  for n in range(4):
   x=35+n*110;s+=line(f'{x},35 {x},205','#c4cbd4',1)+text(x-10,230,['Custo','Prazo','Volume','Nota'][n])
  for n in range(9):s+=line(' '.join(f'{35+j*110},{45+((j*43+n*19)%150)}' for j in range(4)),COLORS[n%5],1.8)
 elif k==2:
  for n in range(5):
   y=70+n*36;pts=[(30+j*8,y-48*math.exp(-((j-(12+n*4))/7)**2)) for j in range(44)];s+=path('M30 '+str(y)+' L'+' L'.join(f'{x:.1f} {v:.1f}' for x,v in pts)+f' L374 {y} Z',COLORS[n], '#fff',1)+text(5,y,n+1)
 elif k==3:
  for n in range(5):
   y=25+n*44;s+=text(3,y+22,chr(65+n))+rect(30,y,338,32,'#edf3fc',0)
   vals=[max(0,45+35*math.sin(j/5+n)+15*math.cos(j/2+n)) for j in range(49)]
   for band,c in enumerate(['#c1d6f7','#6c9de3','#2458db']):
    points=[(30+j*7,y+32-min(32,max(0,v-band*32))) for j,v in enumerate(vals)]
    s+=path(f'M30 {y+32} L'+' L'.join(f'{x:.1f} {v:.1f}' for x,v in points)+f' L366 {y+32} Z',c)
 elif k==4:
  for j in range(60):
   group=j%3;x=80+group*120+math.sin(j*2.4)*27;y=35+(j*37)%165;s+=circle(x,y,4,COLORS[group])
  for n in range(3):s+=text(50+n*120,230,['Grupo A','Grupo B','Grupo C'][n])
 elif k==5:
  s+=text(40,25,'Antes')+text(310,25,'Depois')
  for n,(a,b) in enumerate([(190,70),(65,120),(130,180),(210,145)]):s+=line(f'65,{a} 330,{b}',COLORS[n],3)+circle(65,a,5,COLORS[n])+circle(330,b,5,COLORS[n])+text(42,a-10,chr(65+n))
 elif k==6:
  for x,y,w,h,c,t in [(25,25,175,210,COLORS[0],'A · 50%'),(200,25,175,84,COLORS[1],'B · 20%'),(200,109,87.5,126,COLORS[2],'C · 15%'),(287.5,109,87.5,126,COLORS[3],'D · 15%')]:s+=rect(x,y,w,h,c)+text(x+10,y+25,t,13,'white')
 elif k==7:
  points=[(200+95*math.cos(n*math.pi/2),130+95*math.sin(n*math.pi/2)) for n in range(4)]
  for n,(x,y) in enumerate(points):s+=circle(x,y,17,COLORS[n])
  for n,m,w in [(0,1,18),(1,2,9),(2,3,23),(3,0,12),(0,2,5)]:
   x,y=points[n];a,b=points[m];s+=path(f'M{x} {y} Q200 130 {a} {b}','none',COLORS[n],w)
  for n,(x,y) in enumerate(points):s+=text(x-4,y-23,chr(65+n),12)
 elif k==8:
  s+=line('35,225 370,225','#bdc7d2',1)+text(30,248,'0')+text(355,248,'100')
  for n,(low,mid,high) in enumerate([(50,130,190),(90,210,340),(170,260,315),(75,120,205)]):
   y=50+n*48;s+=line(f'{low},{y} {high},{y}',COLORS[n],5)+circle(mid,y,7,COLORS[n])+text(8,y+4,chr(65+n))
 elif k==9:
  for n in range(4):
   def boundary(j,level):return 70+20*math.sin(j/6)+sum(23+9*math.sin(j/7+k) for k in range(level))
   top=[(25+j*9,boundary(j,n)) for j in range(40)]
   bottom=[(25+j*9,boundary(j,n+1)) for j in reversed(range(40))]
   s+=path('M'+' L'.join(f'{x:.1f} {y:.1f}' for x,y in top+bottom)+' Z',COLORS[n])
  s+=text(25,240,'Composição por período · exemplo')
 return '<svg viewBox="0 0 400 270">'+s+'</svg>'
def node(label,sub='',color='blue'):
 return f'<div class="node {color}"><b>{label}</b><small>{sub}</small></div>'
def ui(k):
 if k==0:return '<div class="canvas"><div class="cursor c1">Ana · demo</div><div class="cursor c2">Rui · demo</div>'+node('Ideia compartilhada','Comentário em contexto')+node('Revisão','2 participantes fictícios','green')+'</div>'
 if k==1:return '<div class="flow">'+node('pedido.valor','Campo de origem')+'<i>↓</i>'+node('normalizar moeda','Transformação documentada','green')+'<i>↓</i>'+node('receita por período','Visualização de destino')+'</div>'
 if k==2:return '<div class="state">'+node('Rascunho','Estado inicial')+'<i>→</i>'+node('Em revisão','Transição permitida','green')+'</div><p class="callout">Publicar requer aprovação</p><div class="ghost">Publicado · ainda não executado</div>'
 if k==3:return '<div class="kbd">TAB → TAB → ENTER</div><div class="field">Nome do relatório</div><div class="focus">Salvar rascunho<span>Foco visível · passo 2</span></div><p class="callout">Ordem de navegação demonstrativa</p>'
 if k==4:return '<div class="timeline">'+''.join(f'<div><span>{label}</span><i style="margin-left:{i*24}px;width:{150-i*20}px;background:{COLORS[i]}"></i></div>' for i,label in enumerate(['Solicitação','Processamento','Resposta','Renderização']))+'</div><p class="callout">Sequência ilustrativa · sem benchmark</p>'
 if k==5:return '<div class="canvas network">'+node('Pesquisa','Fonte')+'<span>→</span>'+node('Decisão','Contexto','green')+'<span>→</span>'+node('Entrega','Responsável','amber')+'</div>'
 if k==6:return '<table><tr><th></th><th>A</th><th>B</th></tr><tr><th>1</th><td>10</td><td>20</td></tr><tr><th>2</th><td>30</td><td>40</td></tr></table><div class="formula">= SOMA(A1:B2)</div><div class="answer">100 <small>dados de exemplo</small></div>'
 if k==7:return '<div class="dependency">'+node('1 · Conectar origem','Necessário')+'<i>↓</i>'+node('2 · Definir regra','Habilitado após etapa 1','green')+'<i>↓</i><div class="ghost">3 · Ativar · depende de validação</div></div>'
 if k==8:return '<div class="flow">'+node('Evento demonstrativo','Novo registro')+'<i>↓</i><div class="toast-demo">Uma atualização para revisar <b>1</b></div><i>↓</i>'+node('Leitura contextual','Nenhuma notificação enviada','green')+'</div>'
 return '<p class="small">Cenário demonstrativo · total fixo</p><div class="budget"><span>Canal A</span><strong>60</strong><span>Canal B</span><strong>40</strong></div><div class="slider"><i></i></div><div class="answer">100 <small>unidades simuladas</small></div><div class="ghost">Restaurar cenário inicial ↶</div>'
css='''*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;color:#223248}.atlas{width:1920px;height:1280px;display:grid;grid-template-columns:repeat(4,480px);grid-template-rows:repeat(3,1fr)}section{padding:28px;background:#e8edf5;position:relative;overflow:hidden}section:nth-child(3n){background:#e0eee8}section:nth-child(4n){background:#eee5df}.label{font-size:12px;line-height:1.3;font-weight:700;letter-spacing:1px;height:35px;margin:0}.sheet{background:#fffdf8;border:1px solid #fff;border-radius:10px;box-shadow:0 18px 24px #17324a25;height:300px;padding:16px;position:relative}svg{width:100%;height:260px}.demo{font-size:9px;letter-spacing:1px;margin-top:14px;color:#526574;font-weight:700}.title{font-size:10px;color:#738295;padding-bottom:10px;border-bottom:1px solid #dce2eb;margin-bottom:15px}.node{padding:12px;background:#e8efff;border:1px solid #b6c8ec;border-radius:7px;font-size:13px}.node small{display:block;margin-top:5px;font-size:10px;color:#5f728b}.green{background:#e1f1e8;border-color:#abd6bf}.amber{background:#fff0d3;border-color:#e8cf99}.flow,.dependency{display:flex;flex-direction:column;align-items:center;gap:5px}.flow .node,.dependency .node{width:85%;padding:10px}.flow i,.dependency i{font-style:normal;color:#76879b}.canvas{position:relative;background:radial-gradient(#bdc8d7 1px,transparent 1px);background-size:14px 14px;height:225px;padding:40px 30px}.canvas .node{margin:0 0 20px}.cursor{position:absolute;padding:5px 8px;color:white;font-size:10px;border-radius:4px;z-index:2}.cursor:before{content:"";position:absolute;left:-8px;top:-8px;width:15px;height:20px;background:inherit;clip-path:polygon(0 0,100% 65%,50% 65%,35% 100%)}.c1{background:#2458db;top:25px;left:10px}.c2{background:#df7250;bottom:30px;right:5px}.state{display:flex;align-items:center;gap:8px;margin-top:35px}.state .node{flex:1}.callout{background:#fff3d9;padding:12px;font-size:12px;border-radius:6px;margin:14px 0}.ghost{padding:12px;border:1px dashed #a5b2c3;border-radius:7px;color:#75869b;font-size:12px;text-align:center}.kbd{font-family:monospace;margin:10px 0 20px;font-size:17px}.field{border:1px solid #bdc9d8;padding:12px;border-radius:5px;font-size:13px}.focus{border:3px solid #2458db;padding:12px;margin:12px 0;border-radius:6px;font-size:14px}.focus span{font-size:10px;display:block;margin-top:8px;color:#2458db}.timeline div{display:flex;align-items:center;font-size:10px;margin:19px 0}.timeline span{width:95px;flex-shrink:0}.timeline i{height:15px;border-radius:4px}.network{display:flex;align-items:center;padding:15px;gap:7px}.network .node{font-size:12px;padding:12px 8px}.network span{color:#7f8fa2}table{border-collapse:collapse;width:100%;font-size:13px;text-align:center}td,th{border:1px solid #d5dfed;padding:9px}td{background:#edf3ff}th{background:#f6f7fa}.formula{padding:12px;font-family:monospace;color:#2458db;font-size:17px}.answer{font-size:33px;font-weight:700;color:#2458db}.answer small{font-size:11px;font-weight:400;color:#6e7d91}.toast-demo{background:#223248;color:white;padding:16px;font-size:12px;border-radius:7px}.toast-demo b{background:#db7250;border-radius:50%;padding:5px;margin-left:8px}.budget{display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:15px}.slider{height:8px;background:#db7250;margin:24px 0;border-radius:8px}.slider i{display:block;width:60%;height:100%;background:#2458db}.small{font-size:11px;color:#6e7c8b}.blank{background:#f6f1e7!important}'''
manifest=ROOT/'records/assets.json';data=json.loads(manifest.read_text())
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for family in ['tecnologia','software']:
  names=[x.split('|')[0] for x in DATA[family].splitlines()]
  panels=[]
  for i,name in enumerate(names):
   body=chart(i) if family=='tecnologia' else '<div class="title">AMBIENTE DEMONSTRATIVO · SEM CONEXÃO EXTERNA</div>'+ui(i)
   panels.append(f'<section><p class="label">{html.escape(name.upper())}</p><div class="sheet">{body}</div><div class="demo">'+('DADOS FICTÍCIOS · ESTUDO DE VISUALIZAÇÃO' if family=='tecnologia' else 'UI DEMONSTRATIVA · NÃO É CAPTURA OFICIAL')+'</div></section>')
  document='<html lang="pt-BR"><meta charset="utf-8"><style>'+css+'</style><div class="atlas">'+''.join(panels)+'<section class="blank"></section><section class="blank"></section></div></html>'
  page=browser.new_page(viewport={'width':1920,'height':1280});page.set_content(document);png=ROOT/f'records/{family}-bold.png';page.screenshot(path=str(png));page.close()
  out=ROOT/f'dist/assets/{family}-bold.webp';Image.open(png).save(out,quality=95)
  data['assets']=[a for a in data['assets'] if a['family']!=family+'-bold'];data['assets'].append(dict(family=family+'-bold',file=str(out.relative_to(ROOT)),width=1920,height=1280,cells=10,source='Demonstração original HTML/CSS/SVG, dados fictícios, sem captura oficial',processing='Render Chromium; conversão WebP',sha256=hashlib.sha256(out.read_bytes()).hexdigest()))
 browser.close()
manifest.write_text(json.dumps(data,ensure_ascii=False,indent=2));print('20 original coded studies rendered')
