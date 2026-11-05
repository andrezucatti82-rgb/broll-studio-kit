import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../style-atlas/dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webp':'image/webp','.png':'image/png','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost');const rel=decodeURIComponent(u.pathname).replace(/^\/+/, '')||'index.html';const file=path.resolve(root,rel);if(!file.startsWith(root+path.sep)||!(await stat(file)).isFile())throw Error('not found');res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(await readFile(file));}catch{res.writeHead(404);res.end('Não encontrado');}}).listen(8770,'127.0.0.1',()=>console.log('Atlas local: http://127.0.0.1:8770 · Ctrl+C para encerrar. Não publicado na internet.'));
