/* Site-only configuration. Never copy these values into presets or prompts. */
(()=>{
 const WHATSAPP='',GA4_ID=''; // Fill only after owner review. No placeholders are treated as valid settings.
 const enabled=/^[1-9][0-9]{9,14}$/.test(WHATSAPP),ga=/^G-[A-Z0-9]+$/.test(GA4_ID);let consent=false;
 window.gdaEvent=name=>{if(consent&&['gda_cta_click','pedido_preparado','pedido_copiado'].includes(name))window.gtag?.('event',name);};
 window.addEventListener('atlas:ready',()=>{
  if(ga){const b=document.createElement('button');b.textContent='Permitir medição anônima de uso';b.className='outline';b.onclick=()=>{if(consent)return;consent=true;window.dataLayer=[];window.gtag=function(){window.dataLayer.push(arguments)};window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});window.gtag('js',new Date());window.gtag('config',GA4_ID,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false});const s=document.createElement('script');s.src='https://www.googletagmanager.com/gtag/js?id='+GA4_ID;document.head.append(s);b.textContent='Medição permitida nesta sessão';};document.querySelector('footer')?.append(b);}
  document.querySelectorAll('[data-gda]').forEach(b=>b.hidden=!enabled);
 });
 document.addEventListener('click',e=>{if(!e.target.closest('[data-gda]')||!enabled)return;const c=window.AtlasCurrentChoice?.();if(!c)return;const message=`Olá! Quero que a GDA produza meu vídeo. Estilo: ${c.selectedStyles.map(s=>s.name).join(' + ')}. Duração: ${c.targetDurationSeconds} s. Formato: ${c.format}. Tema: ${c.topic||'a definir'}.${c.brand?' Marca: '+c.brand+'.':''}`;document.getElementById('gdaMessage').textContent=message;document.getElementById('gdaOpen').href='https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(message);document.getElementById('gdaDialog').showModal();});
 document.getElementById('gdaOpen')?.addEventListener('click',()=>window.gdaEvent('gda_cta_click'));
})();
