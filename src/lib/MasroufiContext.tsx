import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { supabaseOperations } from '@/lib/supabaseUtils';

interface MasroufiContextType {
  user: User | null;
  isAuthenticated: boolean;
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: FinancialGoal[];
  notifications: Notification[];
  deals: Deal[];
  registerUser: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  loginUser: (email: string, password: string) => void;
  logoutUser: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id' | 'userId' | 'spent'>) => Promise<void>;
  updateBudget: (id: string, amount: number) => Promise<void>;
  addGoal: (goal: Omit<FinancialGoal, 'id' | 'userId' | 'currentAmount'>) => Promise<void>;
  updateGoal: (id: string, amount: number) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  toggleDarkMode: () => Promise<void>;
  changeLanguage: (language: 'fr' | 'en') => Promise<void>;
  changeCurrency: (currency: string) => Promise<void>;
}

const MasroufiContext = createContext<MasroufiContextType | undefined>(undefined);

export const MasroufiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  
  // Authentication state management
  useEffect(() => {
    let mounted = true;
    
    const setupAuth = async () => {
      try {
        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            
            console.log("Auth state changed:", event, session?.user?.id);
            
            if (session && session.user) {
              try {
                // User is signed in
                let userData = await supabaseOperations.getUser(session.user.id);
                
                if (userData) {
                  console.log("User data retrieved:", userData);
                  setUser(userData);
                  setIsAuthenticated(true);
                  
                  // Load user data in background
                  setTimeout(() => {
                    if (mounted) loadUserData(session.user.id);
                  }, 0);
                } else {
                  // Create new user profile
                  console.log("Creating new user profile");
                  const newUser: User = {
                    id: session.user.id,
                    email: session.user.email || 'user@example.com', 
                    firstName: session.user.user_metadata?.first_name || 'New',
                    lastName: session.user.user_metadata?.last_name || 'User',
                    darkMode: false,
                    language: 'fr',
                    currency: 'TND',
                    phone: session.user.phone || session.user.user_metadata?.phone || undefined,
                    avatar: session.user.user_metadata?.avatar_url
                  };
                  
                  await supabaseOperations.createUser(newUser, session.user.id);
                  setUser(newUser);
                  setIsAuthenticated(true);
                  
                  // Initialize user data in background
                  setTimeout(() => {
                    if (mounted) initializeUserData(session.user.id);
                  }, 0);
                }
              } catch (error) {
                console.error("Error handling auth state change:", error);
                if (mounted) {
                  setUser(null);
                  setIsAuthenticated(false);
                }
              }
            } else {
              // User is signed out
              if (mounted) {
                setUser(null);
                setIsAuthenticated(false);
                resetData();
              }
            }
          }
        );
        
        // Check current session
        const { data: { session } } = await supabase.auth.getSession();
        // The onAuthStateChange above will handle the session
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error setting up auth:", error);
      }
    };
    
    setupAuth();
    
    // Load deals for all users
    loadDeals();
    
    return () => {
      mounted = false;
    };
  }, []);
  
  const loadUserData = async (userId: string) => {
    try {
      const userCategories = await supabaseOperations.getCategories(userId);
      setCategories(userCategories.length ? userCategories : mockCategories);
      
      const userTransactions = await supabaseOperations.getTransactions(userId);
      setTransactions(userTransactions.length ? userTransactions : mockTransactions);
      
      const userBudgets = await supabaseOperations.getBudgets(userId);
      setBudgets(userBudgets.length ? userBudgets : mockBudgets);
      
      const userGoals = await supabaseOperations.getGoals(userId);
      setGoals(userGoals.length ? userGoals : mockGoals);
      
      const userNotifications = await supabaseOperations.getNotifications(userId);
      setNotifications(userNotifications.length ? userNotifications : mockNotifications);
    } catch (error) {
      console.error("Error loading user data:", error);
      setCategories(mockCategories);
      setTransactions(mockTransactions);
      setBudgets(mockBudgets);
      setGoals(mockGoals);
      setNotifications(mockNotifications);
    }
  };
  
  const initializeUserData = async (userId: string) => {
    try {
      for (const category of mockCategories) {
        await supabaseOperations.createCategory(
          {
            name: category.name,
            icon: category.icon,
            color: category.color,
            type: category.type
          }, 
          userId
        );
      }
      
      setCategories(mockCategories);
      setTransactions([]);
      setBudgets([]);
      setGoals([]);
      setNotifications([]);
    } catch (error) {
      console.error("Error initializing user data:", error);
    }
  };
  
  const loadDeals = async () => {
    try {
      const allDeals = await supabaseOperations.getDeals();
      setDeals(allDeals.length ? allDeals : mockDeals);
    } catch (error) {
      console.error("Error loading deals:", error);
      setDeals(mockDeals);
    }
  };
  
  const resetData = () => {
    setCategories([]);
    setTransactions([]);
    setBudgets([]);
    setGoals([]);
    setNotifications([]);
  };

  // User Authentication - simplified
  const registerUser = async (email: string, password: string, firstName: string, lastName: string) => {
    // Registration is handled by Supabase Auth in the Register component
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      firstName,
      lastName,
      darkMode: false,
      language: 'fr',
      currency: 'TND'
    };
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const loginUser = (email: string, password: string) => {
    // This function is kept for compatibility but login is handled by Supabase Auth
    console.log("loginUser called - handled by Supabase Auth");
  };

  const logoutUser = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      resetData();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'userId'>) => {
    if (!user) return;
    
    try {
      const newTransaction = await supabaseOperations.createTransaction(transaction, user.id);
      
      setTransactions(prev => [...prev, newTransaction]);
  
      if (transaction.type === 'expense') {
        const relevantBudget = budgets.find(b => b.categoryId === transaction.categoryId);
        if (relevantBudget) {
          await updateBudget(relevantBudget.id, relevantBudget.spent + transaction.amount);
        }
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  };

  const addBudget = async (budget: Omit<Budget, 'id' | 'userId' | 'spent'>) => {
    if (!user) return;
    
    try {
      const newBudget = await supabaseOperations.createBudget(budget, user.id);
      setBudgets(prev => [...prev, newBudget]);
    } catch (error) {
      console.error("Error adding budget:", error);
      throw error;
    }
  };

  const updateBudget = async (id: string, spent: number) => {
    try {
      const budgetToUpdate = budgets.find(budget => budget.id === id);
      if (!budgetToUpdate) return;
      
      const updatedBudget = { ...budgetToUpdate, spent };
      await supabaseOperations.updateBudget(updatedBudget);
      
      setBudgets(
        budgets.map(budget => 
          budget.id === id ? { ...budget, spent } : budget
        )
      );
    } catch (error) {
      console.error("Error updating budget:", error);
      throw error;
    }
  };

  const addGoal = async (goal: Omit<FinancialGoal, 'id' | 'userId' | 'currentAmount'>) => {
    if (!user) return;
    
    try {
      const newGoal = await supabaseOperations.createGoal(goal, user.id);
      setGoals(prev => [...prev, newGoal]);
    } catch (error) {
      console.error("Error adding goal:", error);
      throw error;
    }
  };

  const updateGoal = async (id: string, amount: number) => {
    try {
      const goalToUpdate = goals.find(goal => goal.id === id);
      if (!goalToUpdate) return;
      
      const updatedGoal = { ...goalToUpdate, currentAmount: amount };
      await supabaseOperations.updateGoal(updatedGoal);
      
      setGoals(
        goals.map(goal => 
          goal.id === id ? { ...goal, currentAmount: amount } : goal
        )
      );
    } catch (error) {
      console.error("Error updating goal:", error);
      throw error;
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await supabaseOperations.markNotificationAsRead(id);
      
      setNotifications(
        notifications.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  };

  const toggleDarkMode = async () => {
    if (user) {
      try {
        const updatedUser = { ...user, darkMode: !user.darkMode };
        await supabaseOperations.updateUser(updatedUser);
        
        setUser(updatedUser);
        
        document.documentElement.classList.toggle('dark', updatedUser.darkMode);
      } catch (error) {
        console.error("Error toggling dark mode:", error);
        throw error;
      }
    }
  };

  const changeLanguage = async (language: 'fr' | 'en') => {
    if (user) {
      try {
        const updatedUser = { ...user, language };
        await supabaseOperations.updateUser(updatedUser);
        
        setUser(updatedUser);
      } catch (error) {
        console.error("Error changing language:", error);
        throw error;
      }
    }
  };

  const changeCurrency = async (currency: string) => {
    if (user) {
      try {
        const updatedUser = { ...user, currency };
        await supabaseOperations.updateUser(updatedUser);
        
        setUser(updatedUser);
      } catch (error) {
        console.error("Error changing currency:", error);
        throw error;
      }
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
