/* Same-origin canvas export for links opened from the cross-origin Page viewer. */
(async()=>{
 const $=id=>document.getElementById(id),params=new URLSearchParams(location.search);
 let url;
 try{
  const response=await fetch('catalog.json');if(!response.ok)throw Error('Catálogo indisponível.');
  const catalog=await response.json(),s=catalog.styles.find(s=>s.id===params.get('style'));
  if(!s)throw Error('Estilo não encontrado. Volte à biblioteca e escolha uma referência.');
  const sequence=params.get('sequence')==='1',raw=params.get('frame');
  if(raw!==null&&!/^[0-3]$/.test(raw))throw Error('Quadro inválido. Use um dos quatro quadros da ficha.');
  const index=raw===null?null:Number(raw);
  const refs=sequence?s.sequence.frames.map(f=>({path:f.src,crop:null})):index===null?[AtlasWorkflow.referenceFrame(s)]:[{path:s.sequence.frames[index].src,crop:null}];
  const panels=await Promise.all(refs.map(async ref=>{
   if(!/^assets\/[a-zA-Z0-9_,./-]+\.(webp|png|jpe?g)$/.test(ref.path)||ref.path.includes('..'))throw Error('Referência inválida.');
   const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error('Não foi possível carregar a imagem. Tente novamente.'));img.src=ref.path;});
   const [x,y,w,h]=ref.crop||[0,0,1,1],c=document.createElement('canvas');c.width=Math.round(img.naturalWidth*w);c.height=Math.round(img.naturalHeight*h);c.getContext('2d').drawImage(img,img.naturalWidth*x,img.naturalHeight*y,img.naturalWidth*w,img.naturalHeight*h,0,0,c.width,c.height);return c;
  }));
  let canvas=panels[0];
  if(sequence){const widths=[Math.max(panels[0].width,panels[2].width),Math.max(panels[1].width,panels[3].width)],heights=[Math.max(panels[0].height,panels[1].height),Math.max(panels[2].height,panels[3].height)];canvas=document.createElement('canvas');canvas.width=widths[0]+widths[1];canvas.height=heights[0]+heights[1];const ctx=canvas.getContext('2d');ctx.fillStyle='#f7f3ea';ctx.fillRect(0,0,canvas.width,canvas.height);panels.forEach((p,i)=>ctx.drawImage(p,i%2?widths[0]:0,i>1?heights[0]:0));}
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('Não foi possível preparar o PNG.');url=URL.createObjectURL(blob);
  const file=s.id+(sequence?'-sequencia':index!==null?'-'+String(index+1).padStart(2,'0'):'')+'.png';
  $('title').textContent=s.name;$('status').textContent=sequence?'Sequência pronta: quatro quadros na ordem 01 → 04.':'Quadro pronto. Baixe o PNG e anexe no ChatGPT.';$('preview').src=url;$('preview').hidden=false;$('save').disabled=false;
  $('save').onclick=()=>{const a=document.createElement('a');a.href=url;a.download=file;a.click();};
 }catch(error){$('title').textContent='Não foi possível preparar o arquivo';$('status').textContent=error.message;$('save').hidden=true;}
 window.addEventListener('pagehide',()=>{if(url)URL.revokeObjectURL(url)});
})();
