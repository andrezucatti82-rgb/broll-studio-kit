/* Site-only configuration. Never copy these values into presets or prompts. */
(()=>{
 const GA4_ID=''; // Optional; requires owner review and visitor consent.
 const ga=/^G-[A-Z0-9]+$/.test(GA4_ID);let consent=false;
 window.gdaEvent=name=>{if(consent&&['gda_cta_click','pedido_preparado','pedido_copiado'].includes(name))window.gtag?.('event',name);};
 window.addEventListener('atlas:ready',()=>{
  if(ga){const b=document.createElement('button');b.textContent='Permitir medição anônima de uso';b.className='outline';b.onclick=()=>{if(consent)return;consent=true;window.dataLayer=[];window.gtag=function(){window.dataLayer.push(arguments)};window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});window.gtag('js',new Date());window.gtag('config',GA4_ID,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false});const s=document.createElement('script');s.src='https://www.googletagmanager.com/gtag/js?id='+GA4_ID;document.head.append(s);b.textContent='Medição permitida nesta sessão';};document.querySelector('footer')?.append(b);}

 });
 document.addEventListener('click',e=>{if(e.target.closest('[data-gda-site]'))window.gdaEvent('gda_cta_click')});
})();
