import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PlaylistsProvider } from '../context/PlaylistsContext';
import FallingStars from '../FallingStars';
import Navbar from '../Navbar';

const SITE_NAME = 'FQB';

export default function AppLayout() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.replace('#', ''));
    if (!id) return;

    const element = document.getElementById(id);
    if (!element) return;

    requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [hash]);

  return (
    <FallingStars>
      <Navbar brandLabel={SITE_NAME} brandHref="/" />
      <PlaylistsProvider>
        <Outlet />
      </PlaylistsProvider>
    </FallingStars>
  );
}
