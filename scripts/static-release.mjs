export function stableGalleryHtml(html, release) {
  if (!/^atlas-\d{14}$/.test(release)) throw Error('Invalid static release');
  if (!html.includes('<head>') || /<base\b/i.test(html)) throw Error('Expected a gallery without an existing base URL');
  return html.replace('<head>', `<head><base href="/${release}/">`)
    .replaceAll('href="index.html"', 'href="/"');
}

// The homepage is stable at the domain root; its code lives in an immutable release.
export function releaseEntryHtml(html, release) {
  if (!/^atlas-\d{14}$/.test(release)) throw Error('Invalid static release');
  return html.replace(/\b(src|href)="([a-zA-Z0-9_.-]+\.(?:js|css))"/g,
    (_, attribute, file) => `${attribute}="${release}/${file}"`)
    .replace(/\b(src|href)="(assets\/[^"<>]+)"/g,
      (_, attribute, file) => `${attribute}="${release}/${file}"`);
}
