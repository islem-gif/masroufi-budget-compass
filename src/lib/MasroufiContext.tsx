
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
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            
            console.log("Auth state changed:", event, session?.user?.id);
            
            if (session && session.user) {
              setIsAuthenticated(true);
              
              setTimeout(async () => {
                if (!mounted) return;
                
                try {
                  let userData = await supabaseOperations.getUser(session.user.id);
                  
                  if (userData) {
                    console.log("User data retrieved:", userData);
                    setUser(userData);
                    await loadUserData(session.user.id);
                  } else {
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
                    await initializeUserData(session.user.id);
                  }
                } catch (error) {
                  console.error("Error handling auth state change:", error);
                }
              }, 0);
            } else {
              if (mounted) {
                setUser(null);
                setIsAuthenticated(false);
                resetData();
              }
            }
          }
        );
        
        const { data: { session } } = await supabase.auth.getSession();
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error setting up auth:", error);
      }
    };
    
    setupAuth();
    loadDeals();
    
    return () => {
      mounted = false;
    };
  }, []);
  
  const loadUserData = async (userId: string) => {
  try {
    console.log("Loading user data for:", userId);
    
    const userCategories = await supabaseOperations.getCategories(userId);
    console.log("Categories loaded:", userCategories.length);
    if (userCategories.length === 0) {
      await initializeUserData(userId);
      const initializedCategories = await supabaseOperations.getCategories(userId);
      setCategories(initializedCategories.length > 0 ? initializedCategories : mockCategories);
    } else {
      setCategories(userCategories);
    }
    
    const userTransactions = await supabaseOperations.getTransactions(userId);
    console.log("Transactions loaded:", userTransactions.length);
    setTransactions(userTransactions);
    
    const userBudgets = await supabaseOperations.getBudgets(userId);
    console.log("Budgets loaded:", userBudgets.length);
    setBudgets(userBudgets);
    
    const userGoals = await supabaseOperations.getGoals(userId);
    console.log("Goals loaded:", userGoals.length);
    setGoals(userGoals);
    
    const userNotifications = await supabaseOperations.getNotifications(userId);
    console.log("Notifications loaded:", userNotifications.length);
    setNotifications(userNotifications.length > 0 ? userNotifications : mockNotifications);
  } catch (error) {
    console.error("Error loading user data:", error);
    setCategories(mockCategories);
    setTransactions([]);
    setBudgets([]);
    setGoals([]);
    setNotifications(mockNotifications);
  }
};
  
  const initializeUserData = async (userId: string) => {
  try {
    console.log("Initializing user data for new user:", userId);
    
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
    
    setCategories(mockCategories); // Set immediately to reflect in UI
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

  // User Authentication
  const registerUser = async (email: string, password: string, firstName: string, lastName: string) => {
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
    if (!user) {
      console.error("No user found for adding transaction");
      return;
    }
    
    try {
      console.log("Adding transaction to database:", transaction);
      const newTransaction = await supabaseOperations.createTransaction(transaction, user.id);
      console.log("Transaction created successfully:", newTransaction);
      
      setTransactions(prev => {
        const updated = [...prev, newTransaction];
        console.log("Transactions updated, total count:", updated.length);
        return updated;
      });
  
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
    if (!user) {
      console.error("No user found for adding budget");
      return;
    }
    
    try {
      console.log("Adding budget to database:", budget);
      const newBudget = await supabaseOperations.createBudget(budget, user.id);
      console.log("Budget created successfully:", newBudget);
      
      setBudgets(prev => {
        const updated = [...prev, newBudget];
        console.log("Budgets updated, total count:", updated.length);
        return updated;
      });
    } catch (error) {
      console.error("Error adding budget:", error);
      throw error;
    }
  };

  const updateBudget = async (id: string, spent: number) => {
    try {
      const budgetToUpdate = budgets.find(budget => budget.id === id);
      if (!budgetToUpdate) return;
      
      console.log("Updating budget:", id, "spent:", spent);
      const updatedBudget = { ...budgetToUpdate, spent };
      await supabaseOperations.updateBudget(updatedBudget);
      console.log("Budget updated successfully");
      
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
    if (!user) {
      console.error("No user found for adding goal");
      return;
    }
    
    try {
      console.log("Adding goal to database:", goal);
      const newGoal = await supabaseOperations.createGoal(goal, user.id);
      console.log("Goal created successfully:", newGoal);
      
      setGoals(prev => {
        const updated = [...prev, newGoal];
        console.log("Goals updated, total count:", updated.length);
        return updated;
      });
    } catch (error) {
      console.error("Error adding goal:", error);
      throw error;
    }
  };

  const updateGoal = async (id: string, amount: number) => {
    try {
      const goalToUpdate = goals.find(goal => goal.id === id);
      if (!goalToUpdate) return;
      
      console.log("Updating goal:", id, "amount:", amount);
      const updatedGoal = { ...goalToUpdate, currentAmount: amount };
      await supabaseOperations.updateGoal(updatedGoal);
      console.log("Goal updated successfully");
      
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
      console.log("Marking notification as read:", id);
      await supabaseOperations.markNotificationAsRead(id);
      console.log("Notification marked as read successfully");
      
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
        console.log("Toggling dark mode for user:", user.id);
        const updatedUser = { ...user, darkMode: !user.darkMode };
        await supabaseOperations.updateUser(updatedUser);
        console.log("Dark mode updated successfully");
        
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
        console.log("Changing language for user:", user.id, "to:", language);
        const updatedUser = { ...user, language };
        await supabaseOperations.updateUser(updatedUser);
        console.log("Language updated successfully");
        
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
        console.log("Changing currency for user:", user.id, "to:", currency);
        const updatedUser = { ...user, currency };
        await supabaseOperations.updateUser(updatedUser);
        console.log("Currency updated successfully");
        
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
