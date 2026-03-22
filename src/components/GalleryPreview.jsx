import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchManifest, normalizeManifest } from '../lib/manifestGallery';
import CardGalleryItem from './CardGalleryItem';

// Reduce initial preview load for better performance
const PREVIEW_SIZE = 6;
const TOTAL_PREVIEW = 6;

/** Gallery preview component for the home page */
export default function GalleryPreview({ manifestUrl, title, viewAllLink, viewAllLabel }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PREVIEW_SIZE);

  useEffect(() => {
    const ac = new AbortController();
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const json = await fetchManifest(manifestUrl, { signal: ac.signal });
        if (cancelled) return;
        setItems(normalizeManifest(json).slice(0, TOTAL_PREVIEW));
      } catch (e) {
        if (e.name === 'AbortError' || cancelled) return;
        setError(e instanceof Error ? e.message : 'Failed to load gallery');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [manifestUrl]);

  const displayedItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  if (error) {
    return (
      <section className="mx-auto mt-16 max-w-6xl">
        <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-sm text-amber-200/85">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-16 max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-bold text-violet-100/90">{title}</h2>
        <Link
          to={viewAllLink}
          className="text-sm font-medium text-violet-400/90 hover:text-violet-300 hover:underline"
        >
          {viewAllLabel || 'View all'} →
        </Link>
      </div>
      
      {loading && items.length === 0 ? (
        <div className="mt-6 text-sm text-violet-300/60">Loading…</div>
      ) : displayedItems.length === 0 ? (
        <div className="mt-6 text-sm text-violet-300/60">No items available</div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {displayedItems.map((item, idx) => (
              <CardGalleryItem key={`${manifestUrl}-${idx}`} item={item} />
            ))}
          </div>
          {hasMore && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setVisibleCount(TOTAL_PREVIEW)}
                className="text-sm font-medium text-violet-400/90 hover:text-violet-300 hover:underline"
              >
                Show more
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
