
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useMasroufi } from '@/lib/MasroufiContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileMenu from './MobileMenu';
import { useIsMobile } from '@/hooks/use-mobile';

const MainLayout = () => {
  const { isAuthenticated, user } = useMasroufi();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Apply dark mode based on user preferences
  useEffect(() => {
    if (user) {
      document.documentElement.classList.toggle('dark', user.darkMode);
    }
  }, [user?.darkMode]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {!isMobile && <Sidebar />}
      <div className="flex flex-col flex-1 w-full">
        <Navbar />
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
        {isMobile && <MobileMenu />}
      </div>
    </div>
  );
};

export default MainLayout;
