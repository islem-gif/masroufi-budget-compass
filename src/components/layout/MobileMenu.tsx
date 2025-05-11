
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, CreditCard, PieChart, Target, Award } from 'lucide-react';

const MobileMenu = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Transactions', path: '/transactions', icon: CreditCard },
    { name: 'Reports', path: '/reports', icon: PieChart },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Challenges', path: '/challenges', icon: Award }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-30 md:hidden">
      <div className="flex justify-between px-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center py-3 px-5 text-gray-600 dark:text-gray-400",
              location.pathname === item.path && "text-masroufi-primary dark:text-masroufi-primary"
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
