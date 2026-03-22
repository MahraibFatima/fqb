
import fs from 'node:fs';
import path from 'node:path';

const IMAGE_EXT = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.svg',
  '.avif',
  '.bmp',
  '.tif',
  '.tiff',
]);

const GALLERIES = [
  { folder: 'ArtWork', publicPath: '/ArtWork' },
  { folder: 'posts', publicPath: '/posts' },
];

function titleFromFilename(filename) {
  const base = path.parse(filename).name;
  const spaced = base.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!spaced) return filename;
  return spaced.replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function listImageFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name)
    .filter((n) => n !== 'manifest.json' && IMAGE_EXT.has(path.extname(n).toLowerCase()));
}

function main() {
  const publicRoot = path.join(process.cwd(), 'public');

  for (const { folder, publicPath } of GALLERIES) {
    const dir = path.join(publicRoot, folder);
    fs.mkdirSync(dir, { recursive: true });

    const names = listImageFiles(dir).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }),
    );

    const items = names.map((name) => {
      const src = `${publicPath}/${encodeURIComponent(name)}`;
      const title = titleFromFilename(name);
      return { src, title, alt: title };
    });

    const outFile = path.join(dir, 'manifest.json');
    fs.writeFileSync(outFile, `${JSON.stringify(items, null, 2)}\n`, 'utf8');
    console.log(`[gallery] ${items.length} images → ${path.relative(process.cwd(), outFile)}`);
  }
}

main();
