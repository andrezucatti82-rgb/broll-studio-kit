"""Forty original editable raster compositions. Data/screens are explicitly fictitious."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import math,json
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'dist/assets/expansion-720-r2';OUT.mkdir(exist_ok=True)
FONTS=ROOT/'dist/assets'
W,H=1080,960
SX,SY=W/1440,H/810
class LayoutDraw:
 """Reflow vector coordinates into a 9:8 canvas; never resize a rendered image."""
 def __init__(self,im):self.draw=ImageDraw.Draw(im)
 def point(self,p):return (p[0]*SX,p[1]*SY)
 def bounds(self,b,circle=False):
  x0,y0,x1,y1=b
  if circle and abs((x1-x0)-(y1-y0))<.01:
   cx,cy=self.point(((x0+x1)/2,(y0+y1)/2));r=(x1-x0)*min(SX,SY)/2
   return (cx-r,cy-r,cx+r,cy+r)
  return (*self.point((x0,y0)),*self.point((x1,y1)))
 def text(self,p,text,**kwargs):return self.draw.text(self.point(p),text,**kwargs)
 def rounded_rectangle(self,b,radius,**kwargs):return self.draw.rounded_rectangle(self.bounds(b),radius*min(SX,SY),**kwargs)
 def polygon(self,p,**kwargs):return self.draw.polygon([self.point(x) for x in p],**kwargs)
 def ellipse(self,b,**kwargs):return self.draw.ellipse(self.bounds(b,circle=True),**kwargs)
 def line(self,p,**kwargs):return self.draw.line([self.point(x) for x in p],**kwargs)
 def arc(self,b,start,end,**kwargs):return self.draw.arc(self.bounds(b,circle=True),start,end,**kwargs)
PALETTES=[('#efe9dc','#162c36','#e95039','#126376'),('#e7edf1','#152c49','#ea843b','#587b8d'),('#f5edda','#252624','#e54e46','#b4bf70'),('#dbd9ed','#29263c','#bc572f','#8473b2'),('#192c31','#f7ecd7','#ecc34b','#69b7ad')]
def font(n,bold=False):return ImageFont.truetype(str(FONTS/('Geist-Bold.ttf' if bold else 'Geist-Regular.ttf')),max(10,round(n*SX)))
def render(fam,i,row):
 bg,ink,accent,secondary=PALETTES[i%5];im=Image.new('RGB',(W,H),bg);d=LayoutDraw(im)
 def text(x,y,s,size=32,color=None,bold=False):d.text((x,y),s.replace('→',' / '),font=font(size,bold),fill=color or ink)
 def box(x,y,w,h,c,r=0):d.rounded_rectangle((x,y,x+w,y+h),r,fill=c)
 def line(points,c=ink,w=3):d.line(points,fill=c,width=w)
 def circle(x,y,r,c):d.ellipse((x-r,y-r,x+r,y+r),fill=c)
 def header(a,b):text(64,42,a,19,secondary,True);text(64,80,b,56,ink,True)
 text(64,764,'ESTUDO ORIGINAL · DADOS E CONTEÚDO DEMONSTRATIVOS',16,secondary)
 if fam=='grafico':
  if i==0:
   header('01 / ORGANIZAÇÃO EDITORIAL','Uma ideia por capítulo')
   for k,label in enumerate(['CONTEXTO','QUESTÃO','MÉTODO','EVIDÊNCIA','PRÓXIMO']):
    x=100+k*225;box(x,240,215,430,'#fffaf0',5);box(x,240,215,65,[accent,secondary,ink,accent,secondary][k]);text(x+20,340,f'0{k+1}',64,ink,True);text(x+20,620,label,19)
  elif i==1:
   box(80,120,1280,580,'#143e80',28);box(105,145,1230,530,'#f6eddc',15);box(116,156,1208,508,'#143e80',12)
   for x in [135,1305]:
    for y in [175,645]:circle(x,y,9,'#c6d0d4');line([(x-5,y),(x+5,y)],ink,2)
   text(180,220,'INFORMAÇÃO',82,'#fff7e6',True);text(180,330,'QUE ORIENTA.',82,'#fff7e6',True);line([(180,465),(1250,465)],'#fff7e6',4);text(180,515,'Direção clara. Ação possível.',39,'#fff7e6')
  elif i==2:
   header('DOCUMENTO / TRECHO RELEVANTE','O que sustenta a afirmação')
   for k in range(6):box(100,250+k*62,1180-(k%3)*130,28,ink)
   box(100,370,1175,74,accent);text(125,380,'A EVIDÊNCIA FICA VISÍVEL.',48,'#fffaf0',True)
  elif i==3:
   for k,(title,sub) in enumerate([('OBSERVAR','o contexto'),('ENTENDER','as relações'),('EXPLICAR','com clareza')]):
    x=90+k*435;box(x+12,150,395,540,'#b5adc2');box(x,135,395,540,'#f3eadb',4)
    for yy in [165,210,560,630]:line([(x+25,yy),(x+370,yy)],'#254637',3)
    text(x+30,250,title,42,'#254637',True);text(x+30,325,sub,28,'#254637');text(x+30,590,'ARQUIVO  /  0'+str(k+1),20,'#254637')
  elif i==4:
   header('ALFABETO MODULAR','Peças que fazem sentido')
   for k in range(6):
    x=110+k*210
    for a,b,c,e in [(0,0,155,34),(0,0,34,300),(0,130,120,34),(0,266,155,34)]:box(x+a,280+b,c,e,accent if k%2 else secondary,12)
   text(110,650,'COMBINAR  →  CONSTRUIR',33,ink,True)
  elif i==5:
   header('PROVA / REVISÃO','A palavra certa muda tudo.')
   text(100,290,'Nós talvez podemos ajudar.',66,ink,True);line([(280,335),(545,315)],accent,7);text(290,235,'retirar',30,accent)
   text(100,440,'Podemos ajudar.',96,ink,True);d.arc((1080,245,1280,445),10,320,fill=accent,width=8);text(1060,500,'mais claro',31,accent)
  elif i==6:
   box(90,150,1260,550,'#d1e2e8',12)
   for x in range(90,1350,70):d.polygon([(x,150),(x+25,150),(x+65,180),(x+40,180)],fill=accent if x%140 else '#2b568a')
   text(145,235,'UMA MENSAGEM',72,ink,True);text(145,325,'QUE ATRAVESSA.',72,ink,True);line([(145,500),(900,500)],secondary,3);line([(145,560),(780,560)],secondary,3);box(1120,220,150,180,'#eef5ed');text(1140,270,'VIA',35,secondary,True);text(1140,320,'AR',35,secondary,True)
  elif i==7:
   header('ACERVO / CURADORIA','Encontrar também é criar.')
   for k in range(5):box(140+k*16,260+k*42,1100,280,'#d1cbb9',12)
   box(145,390,1100,300,'#faf5e9',12);box(145,355,250,60,accent,8);text(180,365,'SELEÇÃO 03',28,'white',True);text(190,450,'O detalhe que importa',64,ink,True);text(190,560,'Fonte  /  contexto  /  aplicação',30)
  elif i==8:
   header('COMPLEMENTARIDADE','Duas partes. Uma leitura.')
   box(100,240,780,370,'#645d5b',10);box(560,300,780,370,'#d5b635',10);text(150,315,'CO',155,'#f4eadb',True);text(620,380,'NEXÃO',155,'#272626',True)
  elif i==9:
   for k in range(6):box(90+k*220,160,115,530,secondary)
   for k,s in enumerate(['IDEIAS','EM','CONEXÃO']):
    box(60,240+k*140,1320,100,accent if k%2 else ink);text(110,250+k*140,s,66,bg,True)
 elif fam=='tecnologia':
  titles=['Cada observação conta','Permanência ao longo do tempo','A distância mostra a mudança','Prever é mostrar limites','O que os grupos compartilham','De onde vem o saldo','Valor, faixa e meta','Quando os horários se cruzam','Duas medidas no território','Entradas e saídas no tempo'];header('DADOS FICTÍCIOS / EXPLICAÇÃO VISUAL',titles[i]);x0,y0=130,650
  if i in [0,1,2,3,5,6,9]:
   for y in range(240,680,90):line([(130,y),(1320,y)],'#adb6b5',1)
   line([(130,215),(130,650),(1320,650)],secondary,3)
  if i==0:
   pts=[(130,650)]
   for k in range(1,13):pts.extend([(130+k*90,650-(k-1)*31),(130+k*90,650-k*31)])
   line(pts,accent,8)
   for x,y in pts[2::2]:circle(x,y,7,accent)
   text(1050,220,'ACUMULADO',26,accent,True)
  elif i==1:
   for k,c in enumerate([accent,secondary,ink]):
    pts=[(140,250)]
    for j in range(1,11):pts.extend([(140+j*110,250+(j-1)*(24+k*8)),(140+j*110,250+j*(24+k*8))])
    line(pts,c,6);text(180+k*360,700,'COORTE '+chr(65+k),23,c,True)
  elif i==2:
   for k in range(5):
    y=280+k*75;x=350+k*70;end=1050-k*45;line([(x,y),(end,y)],secondary,6);circle(x,y,17,secondary);circle(end,y,17,accent);text(155,y-20,chr(65+k),28)
  elif i==3:
   d.polygon([(650,390),(1280,210),(1280,635)],fill='#d9b78a');d.polygon([(650,390),(1280,300),(1280,530)],fill='#c98b51');line([(150,590),(270,520),(390,545),(500,430),(650,390)],secondary,8);line([(650,390),(1280,420)],ink,4);text(820,680,'INTERVALOS · NÃO CERTEZA',24)
  elif i==4:
   overlay=Image.new('RGBA',im.size);o=LayoutDraw(overlay)
   for x,y,c in [(590,390,(236,195,75,130)),(840,390,(105,183,173,130)),(715,540,(230,100,80,130))]:o.ellipse((x-200,y-200,x+200,y+200),fill=c)
   im=Image.alpha_composite(im.convert('RGBA'),overlay).convert('RGB');d=LayoutDraw(im);text(660,430,'COMUM',28,ink,True)
  elif i==5:
   vals=[(150,400,220),(360,330,70),(570,260,70),(780,260,120),(990,380,70),(1200,450,170)]
   for k,(x,y,h) in enumerate(vals):box(x,y,100,h,accent if k in [3,4] else secondary);text(x,y-45,['INÍCIO','+','+','−','−','FINAL'][k],25)
  elif i==6:
   for k in range(4):
    y=255+k*100
    for j,c in enumerate(['#d0cbc1','#bcb6a8','#a49d8d']):box(300+j*300,y,300,60,c)
    box(300,y+19,520+k*70,22,ink);line([(1040,y-10),(1040,y+70)],accent,7);text(155,y+12,'0'+str(k+1),27)
  elif i==7:
   for k in range(4):d.arc((350+k*45,180+k*45,1090-k*45,920-k*45),190+k*25,340+k*25,fill=[accent,secondary,ink,accent][k],width=32)
   text(600,440,'24 h',100,ink,True);text(150,250,'MANHÃ',24);text(1110,620,'NOITE',24)
  elif i==8:
   colors=['#d5dadd','#7dacc1','#28647f','#d8b399','#a18b8f','#67657a','#c37649','#93555c','#453951']
   for y in range(6):
    for x in range(10):
     xx=150+x*85+(y%2)*20;yy=240+y*65;d.polygon([(xx,yy),(xx+75,yy+5),(xx+70,yy+58),(xx+4,yy+62)],fill=colors[(x+y*2)%9])
   for y in range(3):
    for x in range(3):box(1100+x*50,400+y*50,46,46,colors[y*3+x])
   text(1060,340,'LEGENDA',25)
  elif i==9:
   line([(150,430),(1310,430)],ink,5)
   for k in range(9):
    x=220+k*120;up=k%3!=1;y=270-(k%2)*40 if up else 600;line([(x,430),(x,y)],secondary if up else accent,10);d.polygon([(x-13,y+(20 if up else -20)),(x,y),(x+13,y+(20 if up else -20))],fill=secondary if up else accent);text(x-22,690,str(k+1),24)
 elif fam=='software':
  # Purpose-built illustrative screens: never official screenshots or fabricated measured results.
  bg='#e9edf2';im=Image.new('RGB',(W,H),bg);d=LayoutDraw(im);ink='#18303d';accent='#145dd9';secondary='#527185'
  box(60,40,1320,700,'#fbfcfe',22);box(60,40,1320,72,'#18303d',22);text(95,62,'AMBIENTE DEMONSTRATIVO',23,'#dce9ed',True)
  for k in range(3):circle(1280+k*25,76,5,'#83a5b6')
  titles=['Trabalhar sem conexão','Você confirma a ação','Ajustar a pesquisa','O plano acompanha a tarefa','Conferir o arquivo exportado','Experimentar e desfazer','Um encontro, dois fusos','Resposta acompanhada de fonte','Testar antes de publicar','Retomar o pagamento'];text(110,145,titles[i],48,ink,True)
  if i==0:
   box(110,245,340,55,'#f7e8c7',10);text(130,256,'OFFLINE · SALVO LOCALMENTE',19,ink,True)
   for k,s in enumerate(['Revisar documento','Atualizar observação','Preparar envio']):box(110,340+k*85,740,60,'#edf1f5',8);text(140,351+k*85,s,29)
   text(950,355,'AGUARDANDO',24,secondary,True);text(950,400,'conexão',42,ink,True)
  elif i==1:
   box(110,245,760,285,'#edf3fb',14);text(145,280,'PROPOSTA DO AGENTE',23,accent,True);text(145,345,'Organizar os itens selecionados',34,ink,True);text(145,405,'Revise o escopo antes de continuar.',25)
   box(110,565,270,65,accent,12);text(140,580,'Confirmar ação',28,'white',True);box(410,565,250,65,'#e7ecf0',12);text(450,580,'Ajustar',28)
  elif i==2:
   box(110,250,1200,75,'#edf1f5',10);text(145,268,'Pesquisar no catálogo',32);text(145,380,'Nenhum item com esses filtros.',38,ink,True)
   for k,s in enumerate(['Verificar termo','Remover filtro','Buscar por categoria']):box(145+k*380,500,340,80,'#e0ebfb',10);text(165+k*380,523,s,25,accent,True)
  elif i==3:
   for k,s in enumerate(['Tarefa','Recurso necessário','Condição do plano']):box(110+k*410,270,370,300,['#edf1f5','#e5eefb','#e5f1e8'][k],15);text(135+k*410,305,s,24,ink,True)
   text(140,410,'Exportar',34);text(550,410,'Relatório',34);text(960,410,'Conferir conta',29);text(110,630,'Disponibilidade e preço precisam ser confirmados.',25,secondary)
  elif i==4:
   for x,title in [(110,'RELATÓRIO'),(745,'ARQUIVO EXPORTADO')]:
    text(x,260,title,23,accent,True)
    for k in range(5):box(x,320+k*55,560,45,'#edf1f5');text(x+20,326+k*55,['Campo | Valor','Item A | Exemplo','Item B | Exemplo','Item C | Exemplo','Total | Demonstrativo'][k],23)
  elif i==5:
   box(110,250,760,350,'#edf1f5',12);text(155,320,'Documento de trabalho',42,ink,True);text(155,405,'Uma mudança reversível.',32)
   for k,s in enumerate(['Versão inicial','Alteração','Desfazer','Reaplicar']):text(940,280+k*85,s,29,accent if k==2 else secondary,k==2)
  elif i==6:
   for k,(city,hour) in enumerate([('SÃO PAULO','09:00'),('LISBOA','12:00')]):box(110+k*625,260,580,330,'#edf3fb',14);text(145+k*625,300,city,25,accent,True);text(145+k*625,375,hour,110,ink,True)
   text(110,630,'Exemplo ilustrativo · confirmar data e horário de verão.',24,secondary)
  elif i==7:
   box(110,255,565,360,'#eaf1fb',14);text(140,285,'RESPOSTA',24,accent,True);text(140,355,'Síntese do documento',32,ink,True);text(140,420,'Conferir fonte →',29,accent)
   box(735,255,575,360,'#f3f0e7',14);text(765,285,'DOCUMENTO AUTORIZADO',23,secondary,True)
   for k in range(5):box(765,360+k*40,470-(k%2)*80,18,'#b8bdba' if k!=2 else '#f0ce72')
  elif i==8:
   box(110,245,320,55,'#e3efe3',10);text(135,258,'TESTE · DADOS SINTÉTICOS',20,'#315b3b',True)
   for k,(a,b) in enumerate([('1','Configurar regra'),('2','Executar teste'),('3','Inspecionar resultado')]):circle(145,365+k*95,25,accent);text(136,346+k*95,a,28,'white',True);text(200,345+k*95,b,32)
   box(920,350,350,160,'#f1eadb',14);text(950,390,'Produção separada',25,ink,True)
  elif i==9:
   box(110,250,1200,110,'#f9e9df',12);text(145,272,'Pagamento não concluído',36,ink,True);text(145,320,'Confira o motivo informado pelo provedor.',23)
   for k,s in enumerate(['Revisar dados','Escolher outro meio']):box(110+k*610,430,560,130,'#edf1f5',12);text(145+k*610,475,s,33,accent,True)
  text(100,690,'TELA FICTÍCIA · SUBSTITUIR PELAS CAPTURAS REAIS DO SISTEMA',18,secondary)
 elif fam=='apresentacoes':
  if i==0:text(110,180,'CLAREZA',170,ink,True);text(115,410,'também é saber parar.',60);circle(1250,640,23,accent)
  elif i==1:
   for k,s in enumerate(['AFIRMAÇÃO','EVIDÊNCIA','DECISÃO']):box(130+k*25,160+k*160,1150,150,'#fcf8ed',8);text(220+k*25,190+k*160,s,66,ink,True);circle(175+k*25,230+k*160,18,secondary)
  elif i==2:text(70,70,'A',490,accent,True);text(480,210,'PARTE',108,ink,True);text(480,350,'E O TODO.',108,ink,True);text(495,535,'Mudar a distância muda a leitura.',28)
  elif i==3:
   for k,s in enumerate(['PREMISSA 01','PREMISSA 02','CONCLUSÃO']):box(110+k*210,180+k*115,800,200,['#eee9df','#c9d7d6','#9eb9bd'][k],10);text(160+k*210,230+k*115,s,51,'#183b45',True)
  elif i==4:
   box(80,160,1280,450,ink,15);text(130,220,'IDEIA → AÇÃO',115,bg,True);line([(140,490),(1240,490)],accent,18);circle(140,490,22,accent);circle(680,490,22,accent);circle(1240,490,22,accent)
  elif i==5:text(100,130,'ENTENDER.',100,ink,True);line([(100,380),(1340,380)],accent,3);text(530,520,'E SÓ ENTÃO AGIR.',68,ink,True)
  elif i==6:
   text(100,160,'E se fosse assim?',75,secondary);line([(110,260),(960,230)],accent,6);text(100,380,'VAMOS TESTAR.',104,ink,True);text(105,550,'Hipótese → evidência → revisão',34)
  elif i==7:
   for k,s in enumerate(['CONTEXTO','PRINCÍPIO','CRITÉRIO','DECISÃO']):text(90+k*130,150+k*130,s,76,ink,True);line([(80+k*130,145+k*130),(80+k*130,230+k*130)],accent,7)
  elif i==8:
   text(70,150,'24',320,ink,True);text(100,540,'UNIDADES',46,accent,True)
   for k in range(24):box(650+(k%6)*110,190+(k//6)*120,75,85,secondary,9)
  elif i==9:
   text(90,160,'MUITAS PALAVRAS',77,secondary,True);line([(100,220),(1240,205)],accent,8);text(90,340,'UMA IDEIA.',145,ink,True);text(100,560,'O essencial permanece.',36)
 im.save(OUT/f'{fam}-{i+31:02}.webp',quality=94)
if __name__=='__main__':
 data=json.loads((Path(__file__).parent/'directions.json').read_text())
 for fam in ['grafico','tecnologia','software','apresentacoes']:
  for i,row in enumerate(data[fam]):render(fam,i,row)
 print('40 original 1080×960 compositions rendered; no external assets.')
