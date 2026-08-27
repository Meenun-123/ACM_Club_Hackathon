import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={`relative min-h-screen flex flex-col ${isAdminRoute ? 'bg-[#070b13]' : 'bg-navy-900'}`}>
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">
        <div key={location.pathname} className="animate-fade-in">
          <Outlet />
        </div>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}
