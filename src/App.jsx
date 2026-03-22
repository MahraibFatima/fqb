import './App.css';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import ProjectsPage from './pages/ProjectsPage';

const ManifestGalleryPage = lazy(() => import('./pages/ManifestGalleryPage'));

function GalleryFallback() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 pt-28 text-sm text-violet-300/60">
      Loading gallery…
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route
          path="artwork"
          element={
            <Suspense fallback={<GalleryFallback />}>
              <ManifestGalleryPage
                manifestUrl="/ArtWork/manifest.json"
                title="Artwork"
                description="Images are read from public/ArtWork. A manifest is regenerated from that folder whenever you run dev or build (npm run gallery:manifest anytime)."
                folderHint="public/ArtWork/"
              />
            </Suspense>
          }
        />
        <Route
          path="posts"
          element={
            <Suspense fallback={<GalleryFallback />}>
              <ManifestGalleryPage
                manifestUrl="/posts/manifest.json"
                title="Posts"
                description="Images are read from public/posts. The manifest is rebuilt from files in that folder on dev/build (add photos, then npm run gallery:manifest or restart dev)."
                folderHint="public/posts/"
              />
            </Suspense>
          }
        />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:slug" element={<PlaylistDetailPage />} />
      </Route>
    </Routes>
  );
}
