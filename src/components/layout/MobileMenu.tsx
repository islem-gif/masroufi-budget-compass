
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
  Trophy, 
  MessageCircle 
} from 'lucide-react';

const MobileMenu = () => {
  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/transactions', icon: CreditCard, label: 'Transactions' },
    { to: '/budget', icon: PieChart, label: 'Budget' },
    { to: '/reports', icon: BarChart3, label: 'Rapports' },
    { to: '/goals', icon: Target, label: 'Objectifs' },
    { to: '/deals', icon: Tag, label: 'Offres' },
    { to: '/family', icon: Users, label: 'Famille' },
    { to: '/challenges', icon: Trophy, label: 'Défis' },
    { to: '/settings', icon: Settings, label: 'Paramètres' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden">
      <div className="grid grid-cols-5 py-2">
        {navItems.slice(0, 4).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-1 text-xs ${
                isActive
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`
            }
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="truncate w-full text-center">{item.label}</span>
          </NavLink>
        ))}
        
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center py-2 px-1 text-xs ${
              isActive
                ? 'text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`
          }
        >
          <Settings className="h-5 w-5 mb-1" />
          <span className="truncate w-full text-center">Plus</span>
        </NavLink>
      </div>
    </div>
  );
};

export default MobileMenu;
