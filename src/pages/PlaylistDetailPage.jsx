import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePlaylists } from '../context/PlaylistsContext';
import { fetchPlaylistVideos } from '../lib/youtube';

export default function PlaylistDetailPage() {
  const { slug } = useParams();
  const { getPlaylistBySlug, playlists, loading: playlistsLoading } = usePlaylists();
  const playlist = slug ? getPlaylistBySlug(slug) : null;

  const [videos, setVideos] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playlist) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const fromApi = await fetchPlaylistVideos(playlist.youtubePlaylistId);
        if (cancelled) return;

        if (fromApi?.length) {
          setVideos(fromApi);
        } else if (fromApi && fromApi.length === 0) {
          setVideos([]);
        } else {
          setVideos([]);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load playlist');
          setVideos([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [playlist]);

  if (playlistsLoading && !playlists.length) {
    return (
      <main className="min-h-screen px-4 pb-20 pt-28">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-sm text-zinc-500">Loading playlists…</p>
        </div>
      </main>
    );
  }

  if (!playlist) {
    return (
      <main className="min-h-screen px-4 pb-20 pt-28">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-xl font-semibold text-violet-100">Playlist not found</h1>
          <Link to="/projects" className="mt-4 inline-block text-violet-400 hover:underline">
            ← All projects
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 pb-24 pt-24 sm:px-6 sm:pt-28 md:pt-32">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-8 text-sm text-violet-300/60">
          <Link to="/" className="hover:text-violet-200">
            Home
          </Link>
          <span className="mx-2 text-violet-500/50">/</span>
          <Link to="/projects" className="hover:text-violet-200">
            projects
          </Link>
          <span className="mx-2 text-violet-500/50">/</span>
          <span className="text-violet-200/80">{playlist.title}</span>
        </nav>

        <header className="mb-10 border-b border-violet-500/15 pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">{playlist.title}</h1>
          <p className="mt-2 max-w-2xl text-zinc-500">{playlist.subtitle}</p>
          <a
            href={`https://www.youtube.com/playlist?list=${playlist.youtubePlaylistId}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex text-sm font-medium text-violet-400 hover:text-violet-300"
          >
            Open on YouTube ↗
          </a>
        </header>

        {loading ? (
          <p className="text-center text-sm text-zinc-500">Loading videos…</p>
        ) : null}

        {error ? (
          <p className="mb-6 rounded-lg border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-sm text-amber-200/80">
            API: {error}
          </p>
        ) : null}

        {!loading && videos?.length === 0 ? (
          <p className="text-center text-zinc-500">
            No videos in this playlist or they could not be loaded. Check{' '}
            <code className="text-violet-300">VITE_YOUTUBE_API_KEY</code> and playlist visibility.
          </p>
        ) : null}

        {videos?.length ? (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <li key={v.id}>
                <a
                  href={v.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col overflow-hidden rounded-xl border border-violet-500/15 bg-zinc-950/75 transition-colors hover:border-violet-400/40 hover:bg-violet-950/20"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-violet-950/30">
                    <img
                      src={v.thumb}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent opacity-60" />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h2 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-100 group-hover:text-violet-100">
                      {v.title}
                    </h2>
                    <span className="text-xs font-medium text-violet-400 group-hover:text-violet-300">
                      Watch on YouTube →
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </main>
  );
}
