export function stableGalleryHtml(html, release) {
  if (!/^atlas-\d{14}$/.test(release)) throw Error('Invalid static release');
  if (!html.includes('<head>') || /<base\b/i.test(html)) throw Error('Expected a gallery without an existing base URL');
  return html.replace('<head>', `<head><base href="/${release}/">`)
    .replaceAll('href="index.html"', 'href="/"');
}
