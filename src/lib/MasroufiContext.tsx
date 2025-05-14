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

// Create context with a default undefined value
const MasroufiContext = createContext<MasroufiContextType | undefined>(undefined);

// Define the provider component as a React functional component
export const MasroufiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Modifier le mockUser pour utiliser TND par défaut
  const modifiedMockUser = {...mockUser, currency: 'TND'};
  
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  
  // Écouter les changements d'état d'authentification
  useEffect(() => {
    const setupAuth = async () => {
      // Configurer les listeners avant de vérifier la session existante
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log("Auth state changed:", event, session?.user?.id);
          
          if (session && session.user) {
            // Utilisateur connecté
            try {
              // Récupérer les informations utilisateur depuis notre table custom
              let userData = await supabaseOperations.getUser(session.user.id);
              
              if (userData) {
                console.log("User data retrieved:", userData);
                setUser(userData);
                setIsAuthenticated(true);
                
                // Charger les données de l'utilisateur
                loadUserData(session.user.id);
              } else {
                console.log("Creating new user profile");
                // Créer l'utilisateur si c'est la première connexion
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
                
                console.log("New user data to create:", newUser);
                
                // Sauvegarder le nouvel utilisateur
                await supabaseOperations.createUser(newUser, session.user.id);
                setUser(newUser);
                setIsAuthenticated(true);
                
                // Initialiser des catégories de base pour le nouvel utilisateur
                initializeUserData(session.user.id);
              }
            } catch (error) {
              console.error("Erreur lors du chargement des données utilisateur:", error);
              setUser(null);
              setIsAuthenticated(false);
            }
          } else {
            // Utilisateur déconnecté
            setUser(null);
            setIsAuthenticated(false);
            resetData();
          }
        }
      );
      
      // Vérifier la session existante
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session check:", session?.user?.id);
      // Ne pas traiter la session ici, le authStateChange ci-dessus va s'en charger
    };
    
    setupAuth();
    
    // Charger les deals pour tous les utilisateurs (même non connectés)
    loadDeals();
    
    // Pas besoin de désabonnement car setupAuth est une fonction asynchrone
    // qui gère elle-même l'abonnement et le désabonnement
  }, []);
  
  // Charger les données de l'utilisateur depuis Supabase
  const loadUserData = async (userId: string) => {
    try {
      // Charger les catégories
      const userCategories = await supabaseOperations.getCategories(userId);
      setCategories(userCategories.length ? userCategories : mockCategories);
      
      // Charger les transactions
      const userTransactions = await supabaseOperations.getTransactions(userId);
      setTransactions(userTransactions.length ? userTransactions : mockTransactions);
      
      // Charger les budgets
      const userBudgets = await supabaseOperations.getBudgets(userId);
      setBudgets(userBudgets.length ? userBudgets : mockBudgets);
      
      // Charger les objectifs
      const userGoals = await supabaseOperations.getGoals(userId);
      setGoals(userGoals.length ? userGoals : mockGoals);
      
      // Charger les notifications
      const userNotifications = await supabaseOperations.getNotifications(userId);
      setNotifications(userNotifications.length ? userNotifications : mockNotifications);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      // Utiliser les données mock en cas d'erreur
      setCategories(mockCategories);
      setTransactions(mockTransactions);
      setBudgets(mockBudgets);
      setGoals(mockGoals);
      setNotifications(mockNotifications);
    }
  };
  
  // Initialiser les données de base pour un nouvel utilisateur
  const initializeUserData = async (userId: string) => {
    try {
      // Créer les catégories de base
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
      
      // On ne crée pas de transactions, budgets, etc. pour un nouvel utilisateur
      setTransactions([]);
      setBudgets([]);
      setGoals([]);
      setNotifications([]);
    } catch (error) {
      console.error("Erreur lors de l'initialisation des données utilisateur:", error);
    }
  };
  
  // Charger les deals depuis Supabase
  const loadDeals = async () => {
    try {
      const allDeals = await supabaseOperations.getDeals();
      setDeals(allDeals.length ? allDeals : mockDeals);
    } catch (error) {
      console.error("Erreur lors du chargement des deals:", error);
      setDeals(mockDeals);
    }
  };
  
  // Réinitialiser les données lors de la déconnexion
  const resetData = () => {
    setCategories([]);
    setTransactions([]);
    setBudgets([]);
    setGoals([]);
    setNotifications([]);
  };

  // User Authentication
  const registerUser = async (email: string, password: string, firstName: string, lastName: string) => {
    // L'enregistrement est géré par Supabase Auth dans le composant Register
    // Cette fonction reste pour la compatibilité avec l'existant
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
    // La connexion est gérée par Supabase Auth dans le composant Login
    // Cette fonction reste pour la compatibilité avec l'existant
    setUser(modifiedMockUser);
    setIsAuthenticated(true);
  };

  const logoutUser = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    resetData();
  };

  // Transactions
  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'userId'>) => {
    if (!user) return;
    
    try {
      const newTransaction = await supabaseOperations.createTransaction(transaction, user.id);
      
      setTransactions(prev => [...prev, newTransaction]);
  
      // Update budget spent for expense transactions
      if (transaction.type === 'expense') {
        const relevantBudget = budgets.find(b => b.categoryId === transaction.categoryId);
        if (relevantBudget) {
          await updateBudget(relevantBudget.id, relevantBudget.spent + transaction.amount);
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une transaction:", error);
      throw error;
    }
  };

  // Budgets
  const addBudget = async (budget: Omit<Budget, 'id' | 'userId' | 'spent'>) => {
    if (!user) return;
    
    try {
      const newBudget = await supabaseOperations.createBudget(budget, user.id);
      setBudgets(prev => [...prev, newBudget]);
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un budget:", error);
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
      console.error("Erreur lors de la mise à jour d'un budget:", error);
      throw error;
    }
  };

  // Goals
  const addGoal = async (goal: Omit<FinancialGoal, 'id' | 'userId' | 'currentAmount'>) => {
    if (!user) return;
    
    try {
      const newGoal = await supabaseOperations.createGoal(goal, user.id);
      setGoals(prev => [...prev, newGoal]);
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un objectif:", error);
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
      console.error("Erreur lors de la mise à jour d'un objectif:", error);
      throw error;
    }
  };

  // Notifications
  const markNotificationAsRead = async (id: string) => {
    try {
      await supabaseOperations.markNotificationAsRead(id);
      
      setNotifications(
        notifications.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error("Erreur lors du marquage d'une notification comme lue:", error);
      throw error;
    }
  };

  // User Preferences
  const toggleDarkMode = async () => {
    if (user) {
      try {
        const updatedUser = { ...user, darkMode: !user.darkMode };
        await supabaseOperations.updateUser(updatedUser);
        
        setUser(updatedUser);
        
        // Apply dark mode to document
        document.documentElement.classList.toggle('dark', updatedUser.darkMode);
      } catch (error) {
        console.error("Erreur lors du changement de mode:", error);
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
        console.error("Erreur lors du changement de langue:", error);
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
        console.error("Erreur lors du changement de devise:", error);
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
