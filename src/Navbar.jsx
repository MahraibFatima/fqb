import { useCallback, useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';

export const NAV_ITEMS = [
  { id: 'posts', href: '/posts', label: 'Posts' },
  { id: 'artwork', href: '/artwork', label: 'Artwork' },
  { id: 'projects', href: '/projects', label: 'Projects' },
  { id: 'socials', href: '/#socials', label: 'Socials' },
];

export default function Navbar({ brandHref = '/', brandLabel = 'fqb' }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
        <nav
          className="pointer-events-auto flex w-full max-w-2xl items-center justify-between gap-3 rounded-full border border-violet-500/20 bg-violet-950/45 px-4 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md supports-[backdrop-filter]:bg-violet-950/30 sm:px-5 sm:py-3"
          aria-label="Primary"
        >
          <Link
            to={brandHref}
            className="min-w-0 shrink truncate text-sm font-medium tracking-wide text-violet-100/95 transition-colors hover:text-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400/80 sm:text-base"
          >
            {brandLabel}
          </Link>

          <ul className="hidden items-center gap-0.5 md:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.href}
                  className="rounded-full px-3 py-2 text-sm font-medium text-violet-200/85 transition-colors hover:bg-violet-500/15 hover:text-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400/80"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-violet-100/90 transition-colors hover:bg-violet-500/15 hover:text-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400/80 md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-[55] md:hidden ${open ? '' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-black/65 backdrop-blur-lg backdrop-saturate-150 transition-opacity duration-300 motion-reduce:backdrop-blur-sm ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
          onClick={close}
        />
        <aside
          id={menuId}
          className={`absolute right-0 top-16 flex h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)] w-[min(88vw,300px)] flex-col rounded-tl-2xl border border-violet-500/30 border-r-0 bg-violet-950/80 shadow-[-16px_0_56px_rgba(0,0,0,0.55)] backdrop-blur-2xl backdrop-saturate-150 transition-transform duration-300 ease-out motion-reduce:backdrop-blur-md sm:top-20 sm:h-[calc(100dvh-5rem)] sm:max-h-[calc(100dvh-5rem)] ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
          inert={open ? undefined : true}
        >
          <ul className="flex flex-1 flex-col gap-0.5 p-4 pt-5">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.href}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-violet-100/90 transition-colors hover:bg-violet-500/12 hover:text-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400/80"
                  onClick={close}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}

function IconMenu() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}