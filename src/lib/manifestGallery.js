const PAGE_SIZE = 8;

export { PAGE_SIZE };

/**
 * @param {unknown} data - raw JSON from public manifest
 * @returns {{ src: string, alt: string, title: string, width?: number, height?: number }[]}
 */
export function normalizeManifest(data) {
  const raw = Array.isArray(data) ? data : data?.items;
  if (!Array.isArray(raw)) return [];

  return raw
    .map((entry, i) => {
      if (typeof entry === 'string') {
        return { src: entry, alt: `Image ${i + 1}`, title: '' };
      }
      if (!entry || typeof entry !== 'object') return null;
      const src = entry.src;
      if (typeof src !== 'string' || !src.trim()) return null;
      const title = typeof entry.title === 'string' ? entry.title : '';
      const alt = typeof entry.alt === 'string' && entry.alt.trim() ? entry.alt : title || `Image ${i + 1}`;
      const width = typeof entry.width === 'number' ? entry.width : undefined;
      const height = typeof entry.height === 'number' ? entry.height : undefined;
      return { src: src.trim(), alt, title, width, height };
    })
    .filter(Boolean);
}

export async function fetchManifest(url, init = {}) {
  const res = await fetch(url, {
    cache: 'default',
    headers: { Accept: 'application/json' },
    ...init,
  });
  if (!res.ok) throw new Error(`Could not load ${url} (${res.status})`);
  return res.json();
}
