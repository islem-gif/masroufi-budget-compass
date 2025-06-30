
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  PieChart, 
  BarChart3, 
  Target, 
  Settings, 
  Tag, 
  Users, 
  Trophy 
} from 'lucide-react';
import Logo from '../common/Logo';

const Sidebar = () => {
  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/transactions', icon: CreditCard, label: 'Transactions' },
    { to: '/budget', icon: PieChart, label: 'Budget' },
    { to: '/reports', icon: BarChart3, label: 'Reports' },
    { to: '/goals', icon: Target, label: 'Goals' },
    { to: '/deals', icon: Tag, label: 'Deals' },
    { to: '/family', icon: Users, label: 'Family' },
    { to: '/challenges', icon: Trophy, label: 'Challenges' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-900 shadow-lg h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Logo size="md" />
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`
            }
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
