import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchManifest, normalizeManifest, PAGE_SIZE } from '../lib/manifestGallery';

/**
 * @param {{ manifestUrl: string; title: string; description?: string; folderHint?: string }} props
 */
export default function ManifestGalleryPage({ manifestUrl, title, description, folderHint }) {
  const [items, setItems] = useState([]);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const json = await fetchManifest(manifestUrl, { signal: ac.signal });
        if (cancelled) return;
        setItems(normalizeManifest(json));
      } catch (e) {
        if (e.name === 'AbortError' || cancelled) return;
        setError(e instanceof Error ? e.message : 'Failed to load gallery');
        setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [manifestUrl]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [manifestUrl]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  const shown = useMemo(() => items.slice(0, visible), [items, visible]);
  const hasMore = visible < items.length;

  const loadMore = useCallback(() => {
    setVisible((v) => Math.min(v + PAGE_SIZE, items.length));
  }, [items.length]);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  return (
    <main className="min-h-screen px-4 pb-24 pt-24 sm:px-6 sm:pt-28 md:pt-32">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-8 text-sm text-violet-300/60">
          <Link to="/" className="hover:text-violet-200">
            Home
          </Link>
          <span className="mx-2 text-violet-500/50">/</span>
          <span className="text-violet-200/80">{title}</span>
        </nav>

        <header className="mb-10 border-b border-violet-500/15 pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">{title}</h1>
          
        </header>

        {loading ? (
          <p className="text-center text-sm text-zinc-500">Loading gallery…</p>
        ) : null}

        {error ? (
          <p className="rounded-lg border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-sm text-amber-200/85">{error}</p>
        ) : null}

        {!loading && !error && items.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">
            No images in the manifest. Add files under <code className="text-violet-300">public</code> and list them in{' '}
            <code className="text-violet-300">manifest.json</code>.
          </p>
        ) : null}

        {shown.length > 0 ? (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map((item, index) => (
              <li
                key={`${item.src}-${index}`}
                className="content-visibility-auto contain-intrinsic-size-[auto_280px]"
              >
                <button
                  type="button"
                  onClick={() => setLightbox(item)}
                  className="group block w-full overflow-hidden rounded-xl border border-violet-500/15 bg-violet-950/20 text-left shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-colors hover:border-violet-400/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400/80"
                  aria-label="Open full size image"
                >
                  <div
                    className="relative w-full overflow-hidden bg-violet-950/40"
                    style={
                      item.width && item.height
                        ? { aspectRatio: `${item.width} / ${item.height}` }
                        : { aspectRatio: '4 / 3' }
                    }
                  >
                    <img
                      src={item.src}
                      alt=""
                      width={item.width}
                      height={item.height}
                      loading={index < 4 ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={index < 4 ? 'high' : 'low'}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {hasMore ? (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={loadMore}
              className="rounded-full border border-violet-400/45 bg-violet-500/15 px-8 py-2.5 text-sm font-medium text-violet-100 transition-colors hover:bg-violet-500/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400/80"
            >
              Load more..
            </button>
          </div>
        ) : null}

        {!loading && items.length > 0 && !hasMore ? (
          <p className="mt-10 text-center text-xs text-zinc-600">All {items.length} images loaded.</p>
        ) : null}

        <p className="mt-12 text-center text-sm text-zinc-600">
          <Link to="/" className="text-violet-400/80 underline-offset-4 hover:text-violet-300 hover:underline">
            ← Back home
          </Link>
        </p>
      </div>

      {lightbox ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity"
            aria-label="Close preview"
            onClick={closeLightbox}
          />
          <div className="relative z-10 max-h-[min(92vh,900px)] max-w-[min(96vw,1200px)]">
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-1 top-1 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-violet-500/40 bg-violet-950/95 text-violet-100 shadow-lg backdrop-blur-sm transition-colors hover:bg-violet-900/95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400 sm:right-2 sm:top-2"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <img
              src={lightbox.src}
              alt=""
              className="max-h-[min(88vh,860px)] max-w-full rounded-lg border border-violet-500/20 object-contain shadow-2xl"
              decoding="async"
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}
