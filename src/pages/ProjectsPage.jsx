import { Link } from 'react-router-dom';
import CardProject from '../CardProject';
import { usePlaylists } from '../context/PlaylistsContext';

export default function ProjectsPage() {
  const { playlists, loading, error, cacheHint } = usePlaylists();

  return (
    <main className="min-h-screen px-4 pb-24 pt-24 sm:px-6 sm:pt-28 md:pt-32">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center sm:mb-16">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl md:text-5xl">
            <span className="text-violet-400" aria-hidden>
              &lt;{' '}
            </span>
            Playlists
            <span className="text-violet-400" aria-hidden>
              {' '}
              &gt;
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-500 sm:text-base">
            Playlists from{' '}
            <a
              href="https://www.youtube.com/@FurqanQureshiBlogs/playlists"
              target="_blank"
              rel="noreferrer"
              className="text-violet-400/90 underline-offset-2 hover:text-violet-300 hover:underline"
            >
              @FurqanQureshiBlogs
            </a>
            
          </p>
          
        </header>

        {loading && !playlists.length ? (
          <p className="text-center text-sm text-zinc-500">Loading playlists…</p>
        ) : null}

        {!loading && !playlists.length && !error ? (
          <p className="text-center text-sm text-zinc-500">No playlists returned.</p>
        ) : null}

        {playlists.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {playlists.map((p) => (
              <CardProject key={p.slug} playlist={p} />
            ))}
          </div>
        ) : null}

        <p className="mt-12 text-center text-sm text-zinc-600">
          <Link to="/" className="text-violet-400/80 underline-offset-4 hover:text-violet-300 hover:underline">
            ← Back home
          </Link>
        </p>
      </div>
    </main>
  );
}
