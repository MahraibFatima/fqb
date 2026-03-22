import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getPlaylistBySlug } from '../data/playlists';
import {
  loadChannelPlaylistsWithCache,
  playlistListTtlMs,
  readPlaylistListCache,
} from '../lib/playlistListCache';

const PlaylistsContext = createContext(null);

export function PlaylistsProvider({ children }) {
  const initial = useMemo(() => readPlaylistListCache(), []);
  const [playlists, setPlaylists] = useState(() => initial?.playlists ?? []);
  const [loading, setLoading] = useState(() => {
    const c = readPlaylistListCache();
    if (!import.meta.env.VITE_YOUTUBE_API_KEY?.trim()) return false;
    return !c?.playlists?.length;
  });
  const [error, setError] = useState(null);
  const [cacheHint, setCacheHint] = useState(() =>
    initial?.isFresh ? `Cached · fresh for ${Math.round(playlistListTtlMs() / 60000)}m window` : null,
  );

  const onUpdate = useCallback((next) => {
    setPlaylists(next);
    setCacheHint('Updated from YouTube');
  }, []);

  useEffect(() => {
    let alive = true;

    (async () => {
      const hasKey = !!import.meta.env.VITE_YOUTUBE_API_KEY?.trim();
      if (!hasKey) {
        setLoading(false);
        setError('Add VITE_YOUTUBE_API_KEY to load playlists from YouTube.');
        return;
      }

      const c = readPlaylistListCache();
      if (!c?.playlists?.length) setLoading(true);
      setError(null);

      const result = await loadChannelPlaylistsWithCache({ onUpdate: (next) => alive && onUpdate(next) });

      if (!alive) return;

      setPlaylists(result.playlists);
      setLoading(false);
      if (result.error) setError(result.error);
      if (result.stale) {
        setCacheHint('Showing saved copy · refreshing in background…');
      } else if (result.fromCache && result.revalidated === false && !result.stale) {
        setCacheHint(`Browser cache (no playlist API for ${Math.round(playlistListTtlMs() / 60000)}m)`);
      } else if (result.revalidated) {
        setCacheHint('Fetched from YouTube');
      }
    })();

    return () => {
      alive = false;
    };
  }, [onUpdate]);

  const value = useMemo(
    () => ({
      playlists,
      loading,
      error,
      cacheHint,
      getPlaylistBySlug: (slug) => getPlaylistBySlug(slug, playlists),
    }),
    [playlists, loading, error, cacheHint],
  );

  return <PlaylistsContext.Provider value={value}>{children}</PlaylistsContext.Provider>;
}

export function usePlaylists() {
  const ctx = useContext(PlaylistsContext);
  if (!ctx) throw new Error('usePlaylists must be used within PlaylistsProvider');
  return ctx;
}
