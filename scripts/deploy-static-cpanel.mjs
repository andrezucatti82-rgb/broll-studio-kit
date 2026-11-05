// Scoped static deployment. Secrets stay in environment; no browser cookies or PHP helpers.
import {readFile,writeFile,mkdir,readdir,lstat} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {validateReferences} from './validate-references.mjs';
const argv=process.argv.slice(2),get=k=>{const i=argv.indexOf(k);return i<0?undefined:argv[i+1]};
const domain=get('--domain'),source=path.resolve(get('--source')||'style-atlas/dist');
const apply=argv.includes('--apply');
// Reject duplicate projects, covers or category memberships before any hosting call.
validateReferences(JSON.parse(await readFile(path.join(source,'visual-references.json'),'utf8')));
const {CPANEL_HOST:host,CPANEL_USER:user,CPANEL_TOKEN:token}=process.env;
const hash=b=>createHash('sha256').update(b).digest('hex');
if(!domain||!/^([a-z0-9-]+\.)+[a-z]{2,}$/.test(domain))throw Error('Provide --domain with the authorized hostname.');
if(process.env.DEPLOY_ALLOWED_DOMAIN&&domain!==process.env.DEPLOY_ALLOWED_DOMAIN)throw Error('Domain differs from deployment allowlist.');
if(!host||!user||!token)throw Error('Missing CPANEL_HOST, CPANEL_USER or CPANEL_TOKEN in secrets.');
if(!/^[a-z0-9.-]+(?::2083)?$/i.test(host))throw Error('Invalid cPanel host.');
const apiBase=`https://${host.replace(/:2083$/,'')}:2083`;
const headers={Authorization:`cpanel ${user}:${token}`};
async function api(module,fn,params={}){
 const u=new URL(`/execute/${module}/${fn}`,apiBase);for(const [k,v]of Object.entries(params))u.searchParams.set(k,String(v));
 const r=await fetch(u,{headers,signal:AbortSignal.timeout(45000),redirect:'error'});
 const raw=await r.json();const j=raw.result||raw;if(!r.ok||j.status!==1)throw Error(`cPanel ${module}/${fn} failed (HTTP ${r.status}): ${JSON.stringify(j.errors||[]).replaceAll(token,'[redacted]').replaceAll(user,'[account]').slice(0,700)}`);return j.data;
}
async function upload(dir,name,bytes){
 const form=new FormData();form.set('dir',dir);form.set('overwrite','1');form.set('file-1',new Blob([bytes]),name);
 const r=await fetch(`${apiBase}/execute/Fileman/upload_files`,{method:'POST',headers,body:form,signal:AbortSignal.timeout(60000),redirect:'error'});
 const raw=await r.json();const j=raw.result||raw;const item=j.data?.uploads?.[0];if(!r.ok||j.status!==1||item?.status!==1)throw Error(`Upload failed for ${name}; HTTP ${r.status}.`);
 if(item.size!=null&&Number(item.size)!==bytes.length)throw Error(`Upload size mismatch: ${name}`);
}
async function files(dir,rel=''){
 const out=[];for(const e of await readdir(path.join(dir,rel),{withFileTypes:true})){
  if(e.name.startsWith('.'))throw Error('Hidden file in static bundle.');const r=path.join(rel,e.name);
  if(e.isSymbolicLink())throw Error('Symlink in static bundle.');if(e.isDirectory())out.push(...await files(dir,r));
  else {if(!/\.(html|css|js|json|png|webp|jpe?g|svg|ico|woff2?|ttf|txt|mp4)$/i.test(e.name))throw Error('Unexpected static asset type.');out.push(r.split(path.sep).join('/'));}
 }return out;
}
const info=await api('DomainInfo','single_domain_data',{domain});
const root=path.posix.normalize(info.documentroot||'');const home=path.posix.normalize(info.homedir||'');
if(info.domain!==domain||!root.startsWith(home+'/')||!home.startsWith('/home')||root===home+'/public_html'||root===home)throw Error('Refusing unverified/shared/main document root.');
const listing=await api('Fileman','list_files',{dir:root,show_hidden:1,include_mime:1});
const entries=Array.isArray(listing)?listing:[...(listing.files||[]),...(listing.dirs||[])];
const oldEntry=entries.find(x=>x.file==='index.html'&&x.type==='file');if(!oldEntry)throw Error('Expected existing index.html not found; inspect before deploying.');
let oldBytes;
if(Number(oldEntry.size)>1024*1024){
 // cPanel refuses editor reads over 1 MiB. This target is an existing static HTML file.
 // Fetch its explicit public path without compression/cache, and require the server's exact byte size.
 const response=await fetch(`https://${domain}/index.html?backup=${Date.now()}`,{headers:{'User-Agent':'GDA-Static-Deploy/1.0','Accept-Encoding':'identity','Cache-Control':'no-cache'},signal:AbortSignal.timeout(45000),redirect:'error'});
 if(!response.ok||!response.headers.get('content-type')?.includes('text/html'))throw Error('Cannot read the existing static homepage for backup.');
 oldBytes=Buffer.from(await response.arrayBuffer());
}else{
 const old=await api('Fileman','get_file_content',{dir:root,file:'index.html',from_charset:'UTF-8',to_charset:'UTF-8',update_html_document_encoding:0});
 if(typeof old.content!=='string')throw Error('Cannot read existing homepage.');oldBytes=Buffer.from(old.content);
}
if(!oldBytes.toString('utf8').toLowerCase().includes('<html')||!Number.isFinite(Number(oldEntry.size))||Number(oldEntry.size)!==oldBytes.length)throw Error('Backup encoding/size mismatch; no overwrite.');
const paths=await files(source);if(!paths.includes('index.html')||!paths.includes('catalog.json'))throw Error('Missing static entry/catalog.');
const catalog=JSON.parse(await readFile(path.join(source,'catalog.json'),'utf8'));if(!Array.isArray(catalog.styles)||catalog.styles.length<1)throw Error('Invalid catalog.');
const release='atlas-'+new Date().toISOString().replace(/[^0-9]/g,'').slice(0,14);
const backupDir=path.posix.join(home,'gda-video-backups',release);if(backupDir.startsWith(root+'/'))throw Error('Backup must stay outside website.');
await mkdir('deployment-backup',{recursive:true});await writeFile('deployment-backup/index.html',oldBytes);
const receipt={domain,root,release,backupDir,previousSha256:hash(oldBytes),files:paths.length,styles:catalog.styles.length,mode:apply?'apply':'inspect'};
await writeFile('deployment-backup/receipt.json',JSON.stringify(receipt,null,2));
console.log(JSON.stringify({domain,root,release,files:paths.length,styles:catalog.styles.length,mode:receipt.mode}));
if(!apply){console.log('Read-only inspection complete; no server file modified.');process.exit(0);}
// Preserve the exact entry being replaced. Existing application files remain in place.
await upload(backupDir,'index.html',oldBytes);
// Verify byte-exact recovery parts below cPanel's 1 MiB editor-read limit.
const encodedBackup=oldBytes.toString('base64');receipt.backupParts=[];
for(let offset=0;offset<encodedBackup.length;offset+=512000){
 const part=encodedBackup.slice(offset,offset+512000),name=`index.html.part-${String(receipt.backupParts.length).padStart(3,'0')}.b64`;
 await upload(backupDir,name,Buffer.from(part));
 const saved=await api('Fileman','get_file_content',{dir:backupDir,file:name,from_charset:'UTF-8',to_charset:'UTF-8',update_html_document_encoding:0});
 if(saved.content!==part)throw Error('Remote backup part verification failed; homepage not modified.');receipt.backupParts.push(name);
}
await upload(backupDir,'receipt.json',Buffer.from(JSON.stringify(receipt,null,2)));
for(const rel of paths){if(rel==='index.html')continue;const dir=path.posix.join(root,release,path.posix.dirname(rel));await upload(dir,path.posix.basename(rel),await readFile(path.join(source,rel)));}
// Verify immutable release assets before switching the homepage.
for(const rel of paths){if(rel==='index.html')continue;const url=`https://${domain}/${release}/${rel}`;const r=await fetch(url,{headers:{'User-Agent':'GDA-Static-Deploy/1.0'},signal:AbortSignal.timeout(45000),redirect:'error'});if(!r.ok||hash(Buffer.from(await r.arrayBuffer()))!==hash(await readFile(path.join(source,rel))))throw Error(`Public release verification failed: ${rel}. Homepage unchanged.`);}
// A stable, bookmarked sample URL must resolve media from its immutable release.
// Back up an existing sample page before replacing it, like the main entry.
if(paths.includes('motion-campaign.html')){
 const oldSample=entries.find(x=>x.file==='motion-campaign.html'&&x.type==='file');
 if(oldSample){
  const saved=await api('Fileman','get_file_content',{dir:root,file:'motion-campaign.html',from_charset:'UTF-8',to_charset:'UTF-8',update_html_document_encoding:0});
  if(typeof saved.content!=='string'||Buffer.byteLength(saved.content)!==Number(oldSample.size))throw Error('Sample page backup size mismatch.');
  await upload(backupDir,'motion-campaign.html',Buffer.from(saved.content));
 }
 let sample=await readFile(path.join(source,'motion-campaign.html'),'utf8');
 sample=sample.replaceAll('src="previews/',`src="/${release}/previews/`).replaceAll('href="previews/',`href="/${release}/previews/`).replaceAll('poster="assets/',`poster="/${release}/assets/`).replaceAll('url(assets/',`url(/${release}/assets/`);
 await upload(root,'motion-campaign.html',Buffer.from(sample));
 const published=await fetch(`https://${domain}/motion-campaign.html?release=${release}`,{signal:AbortSignal.timeout(45000),redirect:'error'});
 if(!published.ok||hash(Buffer.from(await published.arrayBuffer()))!==hash(Buffer.from(sample)))throw Error('Sample page public verification failed.');
}
// Keep the reference gallery bookmark stable while its scripts/data are immutable.
if(paths.includes('references.html')){
 const entry=entries.find(x=>x.file==='references.html'&&x.type==='file');
 let previous=null;
 if(entry){
  const saved=await api('Fileman','get_file_content',{dir:root,file:'references.html',from_charset:'UTF-8',to_charset:'UTF-8',update_html_document_encoding:0});
  if(typeof saved.content!=='string'||Buffer.byteLength(saved.content)!==Number(entry.size))throw Error('Reference gallery backup size mismatch.');
  previous=Buffer.from(saved.content);await upload(backupDir,'references.html',previous);
 }
 let gallery=await readFile(path.join(source,'references.html'),'utf8');
 gallery=gallery.replaceAll('src="assets/',`src="/${release}/assets/`);
 for(const file of ['styles.css','references.css','reference-bridge.js','references.js'])gallery=gallery.replaceAll(`="${file}"`,`="/${release}/${file}"`);
 gallery=gallery.replace('</head>',`<meta name="gda-atlas-release" content="${release}"><script>window.ATLAS_ASSET_BASE=${JSON.stringify('/'+release+'/')};</script></head>`);
 try{
  await upload(root,'references.html',Buffer.from(gallery));
  const response=await fetch(`https://${domain}/references.html?release=${release}`,{headers:{'User-Agent':'GDA-Static-Deploy/1.0'},signal:AbortSignal.timeout(45000),redirect:'error'});
  if(!response.ok||hash(Buffer.from(await response.arrayBuffer()))!==hash(Buffer.from(gallery)))throw Error('Reference gallery public verification failed.');
 }catch(error){if(previous)await upload(root,'references.html',previous);throw error;}
}
let html=await readFile(path.join(source,'index.html'),'utf8');
html=html.replaceAll('src="assets/',`src="${release}/assets/`).replace('href="styles.css"',`href="${release}/styles.css"`).replace('src="app.js"',`src="${release}/app.js"`).replace('href="catalog.json"',`href="${release}/catalog.json"`);
for(const file of ['references.css','reference-bridge.js'])html=html.replaceAll(`="${file}"`,`="${release}/${file}"`);
html=html.replace('</head>',`<meta name="gda-atlas-release" content="${release}"><script>window.ATLAS_ASSET_BASE=${JSON.stringify(release+'/')};window.ATLAS_CATALOG_URL=${JSON.stringify(release+'/catalog.json')};</script></head>`);
try{
 await upload(root,'index.html',Buffer.from(html));
 const r=await fetch(`https://${domain}/?release=${release}`,{headers:{'User-Agent':'GDA-Static-Deploy/1.0'},signal:AbortSignal.timeout(45000),redirect:'error'});const text=await r.text();
 if(!r.ok||!text.includes(`content="${release}"`)||!text.includes(`${release}/app.js`))throw Error('Homepage readback failed.');
 receipt.status='published';receipt.url=`https://${domain}/`;receipt.newSha256=hash(Buffer.from(html));
}catch(e){await upload(root,'index.html',oldBytes);receipt.status='rolled_back';await writeFile('deployment-backup/receipt.json',JSON.stringify(receipt,null,2));throw Error('Publication verification failed; original homepage restored.');}
await writeFile('deployment-backup/receipt.json',JSON.stringify(receipt,null,2));await upload(backupDir,'receipt.json',Buffer.from(JSON.stringify(receipt,null,2)));
console.log(JSON.stringify({status:receipt.status,url:receipt.url,release,backupDir,previousSha256:receipt.previousSha256,newSha256:receipt.newSha256}));
