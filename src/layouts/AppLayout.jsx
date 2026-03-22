import { Outlet } from 'react-router-dom';
import { PlaylistsProvider } from '../context/PlaylistsContext';
import FallingStars from '../FallingStars';
import Navbar from '../Navbar';

const SITE_NAME = 'FQB';

export default function AppLayout() {
  return (
    <FallingStars>
      <Navbar brandLabel={SITE_NAME} brandHref="/" />
      <PlaylistsProvider>
        <Outlet />
      </PlaylistsProvider>
    </FallingStars>
  );
}
