import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { button, page } from '@/lib/ui';

const links = [
  { to: '/', label: 'The Wire', end: true },
  { to: '/cut-up', label: 'Cut-up' },
  { to: '/desk', label: 'The Desk' },
  { to: '/typewriter', label: 'Typewriter' },
  { to: '/archive', label: 'Archive' },
  { to: '/positions', label: 'Positions' },
  { to: '/thinkers', label: 'Thinkers' },
];

export default function Layout() {
  const { user, logout } = useAuth();

  if (user && user.role !== 'admin') {
    return (
      <div className={page}>
        <p className="ew-type text-lg">Owl Farm is private. Nothing to see here.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="relative overflow-hidden border-b-2 border-[#121110] bg-[#121110] text-[#f1ebdd]">
        <div className="mx-auto flex max-w-3xl flex-wrap items-end gap-x-6 gap-y-3 px-4 pb-3 pt-5 sm:px-8">
          <div>
            <span className="ew-shout ew-lp block text-4xl text-[#c4211a]">Owl Farm</span>
            <span className="ew-label text-[#bdb6a8]">Edgework · the private desk</span>
          </div>
          <span className="ml-auto hidden text-xs text-[#bdb6a8] sm:block">{user?.email}</span>
          <button className={`${button} ew-btn-light`} onClick={() => logout(true)}>
            Log out
          </button>
        </div>
        <nav className="ew-nav mx-auto flex max-w-3xl flex-wrap gap-x-5 gap-y-1 px-4 pb-2 sm:px-8">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : 'text-[#f1ebdd]')}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
