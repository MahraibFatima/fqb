import OptimizedImage from './OptimizedImage';

/** Gallery item card for displaying images */
export default function CardGalleryItem({ item, onClick }) {
  return (
    <button
      onClick={() => onClick?.(item)}
      className="group relative aspect-square w-full overflow-hidden rounded-lg border border-violet-500/15 bg-violet-950/20 transition-all duration-300 hover:border-violet-400/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400/80"
    >
      <OptimizedImage
        src={item.src}
        alt={item.alt}
        title={item.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        placeholder
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />
    </button>
  );
}
