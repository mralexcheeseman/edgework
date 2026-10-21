import { Outlet } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Masthead from '@/components/Masthead';
import SiteFooter from '@/components/SiteFooter';

export default function SiteLayout() {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="ew-label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--sheet)] focus:p-3">
        Skip to content
      </a>
      <div className="relative min-h-screen overflow-x-hidden">
        <Masthead />
        <main id="main">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </MotionConfig>
  );
}
