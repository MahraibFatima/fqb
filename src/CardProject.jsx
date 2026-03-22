import { Link } from 'react-router-dom';
import { playlistThumbnail } from './data/playlists';
import OptimizedImage from './components/OptimizedImage';

const MAX_VISIBLE_TAGS = 3;

export default function CardProject({ playlist }) {
  const tags = playlist.tags ?? [];
  const visible = tags.slice(0, MAX_VISIBLE_TAGS);
  const extra = Math.max(0, tags.length - visible.length);
  const cover = playlistThumbnail(playlist);

  return (
    <Link
      to={`/projects/${playlist.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-violet-500/15 bg-zinc-950/80 shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:-translate-y-0.5 hover:border-violet-400/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400/80"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-violet-950/40">
        <OptimizedImage
          src={cover}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          placeholder
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent"
          aria-hidden
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 px-4 pb-5 pt-4">
        <div>
          <h3 className="font-semibold tracking-tight text-zinc-100 sm:text-xl">{playlist.title}</h3>
         </div>

        <div className="flex flex-wrap items-center gap-2">
          
          {extra > 0 ? (
            <span className="rounded-full border border-indigo-400/50 bg-indigo-950/50 px-2.5 py-0.5 text-xs font-medium text-indigo-200/90">
              +{extra}
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex justify-center pt-1">
          <span className="text-sm font-medium text-violet-400 transition-colors group-hover:text-violet-300">
            view details →
          </span>
        </div>
      </div>
    </Link>
  );
}
