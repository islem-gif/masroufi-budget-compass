
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  CreditCard, 
  Home, 
  PieChart, 
  Target, 
  DollarSign, 
  Settings, 
  Users, 
  Tag,
  Award 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Transactions', path: '/transactions', icon: CreditCard },
    { name: 'Budget', path: '/budget', icon: DollarSign },
    { name: 'Reports', path: '/reports', icon: PieChart },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Family', path: '/family', icon: Users },
    { name: 'Deals', path: '/deals', icon: Tag },
    { name: 'Challenges', path: '/challenges', icon: Award },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="py-8 px-6 text-center border-b border-gray-200 dark:border-gray-700">
        <Link to="/dashboard">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-masroufi-primary to-masroufi-secondary bg-clip-text text-transparent">
            Masroufi
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Budget Compass</p>
        </Link>
      </div>
      <nav className="flex-1 py-6 px-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                  location.pathname === item.path && "bg-masroufi-primary/10 text-masroufi-primary dark:bg-masroufi-primary/20 dark:text-masroufi-primary"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-center font-medium">
            Made with ❤️ for better finances
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
