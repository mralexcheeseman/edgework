import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const NAV = [
  { to: '/positions', label: 'Positions' },
  { to: '/essays', label: 'Essays' },
  { to: '/dispatches', label: 'Dispatches' },
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
];

export default function Masthead() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="ew-night sticky top-0 z-30">
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-4 md:px-10">
        <Link to="/" className="ew-shout ew-lp text-[30px] leading-none" style={{ color: 'var(--on-night)' }} aria-label="Edgework, home">
          Edgework
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className="ew-label border-b-2 py-1 transition-colors"
              style={({ isActive }) => ({
                color: isActive ? 'var(--red-night)' : 'var(--on-night-2)',
                borderColor: isActive ? 'var(--red-night)' : 'transparent',
              })}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          className="ew-label min-h-[44px] px-2 md:hidden"
          style={{ color: 'var(--on-night)' }}
          aria-expanded={open}
          aria-controls="ew-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      {open && (
        <nav id="ew-menu" aria-label="Main" className="ew-night fixed inset-x-0 bottom-0 top-[72px] z-30 flex flex-col gap-2 px-4 pt-8 md:hidden">
          {NAV.map((n, i) => (
            <NavLink
              key={n.to}
              to={n.to}
              className="ew-shout ew-drop py-2 text-[56px]"
              style={({ isActive }) => ({ color: isActive ? 'var(--red-night)' : 'var(--on-night)', '--d': `${i * 0.05}s`, '--r0': '-3deg' })}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
