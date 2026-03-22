import { Link } from 'react-router-dom';
import heroImage from '../assets/image.png';
import SocialsSection from '../components/SocialsSection';
import GalleryPreview from '../components/GalleryPreview';
import ProjectsPreview from '../components/ProjectsPreview';
import OptimizedImage from '../components/OptimizedImage';

const SITE_NAME = 'FQB';

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 pb-20 pt-24 sm:px-6 sm:pt-28 md:pt-32">
      <section className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center md:gap-12 lg:gap-16">
        <div className="order-1 flex flex-col justify-center text-center md:text-left">
          <h1 className="bg-gradient-to-b from-violet-100 to-violet-300/90 bg-clip-text text-3xl font-light tracking-[0.12em] text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
            {SITE_NAME}
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-violet-200/50 md:mx-0 md:text-base">
            {SITE_NAME} Blogs is a research platform for Quran, Hadith, Modern Science, Archeology and
            Ancient History.
          </p>
        </div>
        <div className="order-2 flex justify-center md:justify-end">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-violet-500/25 bg-violet-950/30 shadow-[0_24px_64px_rgba(0,0,0,0.35)]">
            <OptimizedImage
              src={heroImage}
              alt={SITE_NAME}
              width={480}
              height={480}
              className="aspect-square w-full object-cover"
              placeholder
            />
          </div>
        </div>
      </section>

      <ProjectsPreview />

      <GalleryPreview
        manifestUrl="/posts/manifest.json"
        title="Recent Posts"
        viewAllLink="/posts"
        viewAllLabel="All posts"
      />

      <GalleryPreview
        manifestUrl="/ArtWork/manifest.json"
        title="Artwork"
        viewAllLink="/artwork"
        viewAllLabel="All artwork"
      />

      <SocialsSection />
    </main>
  );
}
