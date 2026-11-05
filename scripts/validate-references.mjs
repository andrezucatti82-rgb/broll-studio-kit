import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

export function validateReferences(data) {
  const fail = message => { throw new Error(`Visual references: ${message}`); };
  const refs = data.references;
  if (!Array.isArray(refs) || refs.length !== 1000 || data.count !== 1000) fail('expected 1000 references');
  if (data.categoryPolicy !== 'exclusive-primary') fail('exclusive categories required');
  if (!Array.isArray(data.categories) || data.categories.length !== 10 || new Set(data.categories).size !== 10) fail('expected ten distinct categories');
  if (data.addedCount !== 460 || refs.filter(x => x.addedIn === data.version).length !== 460) fail('expected 460 new references');
  if (!data.categoryDetails || data.categories.some(c => !data.categoryDetails[c]?.description)) fail('category descriptions required');
  const groups = Object.fromEntries(data.categories.map(c => [c, 0]));
  const seen = {id:new Set(), url:new Set(), image:new Set(), sha256:new Set()};
  for (const ref of refs) {
    if (!Object.hasOwn(groups, ref.category) || !Array.isArray(ref.categories) || ref.categories.length !== 1 || ref.categories[0] !== ref.category) fail(`one primary category required for ${ref.id}`);
    groups[ref.category]++;
    for (const key of Object.keys(seen)) {
      const value = key === 'sha256' ? ref.validation?.sha256 : ref[key];
      if (typeof value !== 'string' || !value || seen[key].has(value)) fail(`missing or duplicate ${key}: ${ref.id}`);
      if (key === 'sha256' && !/^[a-f0-9]{64}$/.test(value)) fail(`invalid image hash: ${ref.id}`);
      seen[key].add(value);
    }
  }
  if (Object.values(groups).some(n => n === 0) || Object.values(groups).reduce((a,b) => a+b,0) !== 1000) fail('category totals must sum to 1000');
  return {references:1000, uniqueProjects:seen.id.size, uniqueImages:seen.sha256.size, crossCategoryDuplicates:0, categoryCounts:groups};
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const file = process.argv[2] || 'style-atlas/dist/visual-references.json';
  console.log(JSON.stringify(validateReferences(JSON.parse(readFileSync(file,'utf8'))), null, 2));
}
