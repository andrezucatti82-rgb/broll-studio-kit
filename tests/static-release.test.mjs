import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {stableGalleryHtml,releaseEntryHtml} from '../scripts/static-release.mjs';
test('stable pilot URL resolves all local media from its immutable release and home from root',()=>{
 const html=stableGalleryHtml(fs.readFileSync(new URL('../style-atlas/dist/automation-pilot.html',import.meta.url),'utf8'),'atlas-20261105140000');
 const base=new URL(html.match(/<base href="([^"]+)"/)[1],'https://example.com');
 assert.ok(html.includes('href="/"'));assert.ok(!html.includes('href="index.html"'));
 const files=[...html.matchAll(/(?:src|href|poster)="(previews\/[^"#]+|styles\.css)"/g)].map(m=>m[1]);
 assert.ok(files.length>=15);for(const file of files)assert.equal(new URL(file,base).pathname,'/atlas-20261105140000/'+file);
 assert.throws(()=>stableGalleryHtml(html,'atlas-20261105140000'),/existing base/);
 assert.throws(()=>stableGalleryHtml('<head></head>','../other'),/Invalid/);
});
test('every homepage script and stylesheet resolves inside the release, including new workflow modules',()=>{
 const source=fs.readFileSync(new URL('../style-atlas/dist/index.html',import.meta.url),'utf8');
 const release='atlas-20261106140000',html=releaseEntryHtml(source,release);
 const files=[...source.matchAll(/\b(?:src|href)="([a-zA-Z0-9_.-]+\.(?:js|css))"/g)].map(m=>m[1]);
 assert.ok(files.includes('workflow.js'));assert.ok(files.includes('site-ui.js'));
 for(const file of files){assert.ok(html.includes(`="${release}/${file}"`));assert.ok(!html.includes(`="${file}"`));}
 assert.ok(html.includes('https://gerenciadordeanuncios.com.br/'));
 for(const file of ['favicon.ico','favicon-32.png','favicon-16.png','apple-touch-icon.png']){assert.ok(html.includes(`href="${release}/assets/${file}"`));assert.ok(fs.existsSync(new URL('../style-atlas/dist/assets/'+file,import.meta.url)));}
 assert.throws(()=>releaseEntryHtml(source,'../other'),/Invalid/);
});
