import { Link } from 'react-router-dom';
import { usePlaylists } from '../context/PlaylistsContext';
import CardProject from '../CardProject';

const PREVIEW_SIZE = 4;

/** Projects preview component for the home page */
export default function ProjectsPreview() {
  const { playlists, loading, error } = usePlaylists();

  const previewItems = playlists.slice(0, PREVIEW_SIZE);

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
        <h2 className="text-2xl font-bold text-violet-100/90">Featured Projects</h2>
        <Link
          to="/projects"
          className="text-sm font-medium text-violet-400/90 hover:text-violet-300 hover:underline"
        >
          All projects →
        </Link>
      </div>

      {loading ? (
        <div className="mt-6 text-sm text-violet-300/60">Loading…</div>
      ) : previewItems.length === 0 ? (
        <div className="mt-6 text-sm text-violet-300/60">No projects available</div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {previewItems.map((p) => (
            <CardProject key={p.slug} playlist={p} />
          ))}
        </div>
      )}
    </section>
  );
}
