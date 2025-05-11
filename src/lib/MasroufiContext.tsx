
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  User, 
  Category, 
  Transaction, 
  Budget, 
  FinancialGoal, 
  Notification, 
  Deal 
} from '@/types';
import { 
  mockUser, 
  mockCategories, 
  mockTransactions, 
  mockBudgets, 
  mockGoals, 
  mockNotifications, 
  mockDeals 
} from '@/lib/mockData';

interface MasroufiContextType {
  user: User | null;
  isAuthenticated: boolean;
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: FinancialGoal[];
  notifications: Notification[];
  deals: Deal[];
  registerUser: (email: string, password: string, firstName: string, lastName: string) => void;
  loginUser: (email: string, password: string) => void;
  logoutUser: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'userId' | 'spent'>) => void;
  updateBudget: (id: string, amount: number) => void;
  addGoal: (goal: Omit<FinancialGoal, 'id' | 'userId' | 'currentAmount'>) => void;
  updateGoal: (id: string, amount: number) => void;
  markNotificationAsRead: (id: string) => void;
  toggleDarkMode: () => void;
  changeLanguage: (language: 'fr' | 'en') => void;
  changeCurrency: (currency: string) => void;
}

const MasroufiContext = createContext<MasroufiContextType | undefined>(undefined);

export const MasroufiProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [goals, setGoals] = useState<FinancialGoal[]>(mockGoals);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [deals, setDeals] = useState<Deal[]>(mockDeals);

  // User Authentication
  const registerUser = (email: string, password: string, firstName: string, lastName: string) => {
    // In a real app, we'd call an API to register
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 15),
      email,
      firstName,
      lastName,
      darkMode: false,
      language: 'fr',
      currency: 'MAD'
    };
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const loginUser = (email: string, password: string) => {
    // In a real app, we'd validate credentials
    // For demo, we'll just use mockUser
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  const logoutUser = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  // Transactions
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'userId'>) => {
    if (!user) return;
    
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substring(2, 15),
      userId: user.id
    };
    
    setTransactions([...transactions, newTransaction]);

    // Update budget spent for expense transactions
    if (transaction.type === 'expense') {
      const relevantBudget = budgets.find(b => b.categoryId === transaction.categoryId);
      if (relevantBudget) {
        updateBudget(relevantBudget.id, relevantBudget.spent + transaction.amount);
      }
    }
  };

  // Budgets
  const addBudget = (budget: Omit<Budget, 'id' | 'userId' | 'spent'>) => {
    if (!user) return;
    
    const newBudget: Budget = {
      ...budget,
      id: Math.random().toString(36).substring(2, 15),
      userId: user.id,
      spent: 0
    };
    
    setBudgets([...budgets, newBudget]);
  };

  const updateBudget = (id: string, spent: number) => {
    setBudgets(
      budgets.map(budget => 
        budget.id === id ? { ...budget, spent } : budget
      )
    );
  };

  // Goals
  const addGoal = (goal: Omit<FinancialGoal, 'id' | 'userId' | 'currentAmount'>) => {
    if (!user) return;
    
    const newGoal: FinancialGoal = {
      ...goal,
      id: Math.random().toString(36).substring(2, 15),
      userId: user.id,
      currentAmount: 0
    };
    
    setGoals([...goals, newGoal]);
  };

  const updateGoal = (id: string, amount: number) => {
    setGoals(
      goals.map(goal => 
        goal.id === id ? { ...goal, currentAmount: amount } : goal
      )
    );
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // User Preferences
  const toggleDarkMode = () => {
    if (user) {
      const updatedUser = { ...user, darkMode: !user.darkMode };
      setUser(updatedUser);
      
      // Apply dark mode to document
      document.documentElement.classList.toggle('dark', updatedUser.darkMode);
    }
  };

  const changeLanguage = (language: 'fr' | 'en') => {
    if (user) {
      setUser({ ...user, language });
    }
  };

  const changeCurrency = (currency: string) => {
    if (user) {
      setUser({ ...user, currency });
    }
  };

  const value = {
    user,
    isAuthenticated,
    categories,
    transactions,
    budgets,
    goals,
    notifications,
    deals,
    registerUser,
    loginUser,
    logoutUser,
    addTransaction,
    addBudget,
    updateBudget,
    addGoal,
    updateGoal,
    markNotificationAsRead,
    toggleDarkMode,
    changeLanguage,
    changeCurrency,
  };

  return <MasroufiContext.Provider value={value}>{children}</MasroufiContext.Provider>;
};

export const useMasroufi = () => {
  const context = useContext(MasroufiContext);
  if (context === undefined) {
    throw new Error('useMasroufi must be used within a MasroufiProvider');
  }
  return context;
};
