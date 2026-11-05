import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {stableGalleryHtml} from '../scripts/static-release.mjs';
test('stable pilot URL resolves all local media from its immutable release and home from root',()=>{
 const html=stableGalleryHtml(fs.readFileSync(new URL('../style-atlas/dist/automation-pilot.html',import.meta.url),'utf8'),'atlas-20261105140000');
 const base=new URL(html.match(/<base href="([^"]+)"/)[1],'https://example.com');
 assert.ok(html.includes('href="/"'));assert.ok(!html.includes('href="index.html"'));
 const files=[...html.matchAll(/(?:src|href|poster)="(previews\/[^"#]+|styles\.css)"/g)].map(m=>m[1]);
 assert.ok(files.length>=15);for(const file of files)assert.equal(new URL(file,base).pathname,'/atlas-20261105140000/'+file);
 assert.throws(()=>stableGalleryHtml(html,'atlas-20261105140000'),/existing base/);
 assert.throws(()=>stableGalleryHtml('<head></head>','../other'),/Invalid/);
});
