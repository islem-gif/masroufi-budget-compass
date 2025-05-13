import { supabase } from '@/integrations/supabase/client';
import type { 
  UserTable, 
  CategoryTable, 
  TransactionTable, 
  BudgetTable, 
  FinancialGoalTable, 
  NotificationTable, 
  DealTable 
} from '@/types/supabase-types';
import { 
  User, 
  Category, 
  Transaction, 
  Budget, 
  FinancialGoal, 
  Notification, 
  Deal 
} from '@/types';

// Helper functions to convert between our app types and Supabase table types

// User conversions
export const toAppUser = (dbUser: UserTable): User => ({
  id: dbUser.id,
  email: dbUser.email,
  firstName: dbUser.first_name,
  lastName: dbUser.last_name,
  phone: dbUser.phone,
  avatar: dbUser.avatar_url,
  darkMode: dbUser.dark_mode,
  language: dbUser.language,
  currency: dbUser.currency
});

export const toDbUser = (appUser: User): Omit<UserTable, 'created_at' | 'updated_at'> => ({
  id: appUser.id,
  email: appUser.email,
  first_name: appUser.firstName,
  last_name: appUser.lastName,
  phone: appUser.phone,
  avatar_url: appUser.avatar,
  dark_mode: appUser.darkMode,
  language: appUser.language as 'fr' | 'en', // Fix: Ensure language is typed as 'fr' | 'en'
  currency: appUser.currency
});

// Category conversions
export const toAppCategory = (dbCategory: CategoryTable): Category => ({
  id: dbCategory.id,
  name: dbCategory.name,
  icon: dbCategory.icon,
  color: dbCategory.color,
  type: dbCategory.type
});

export const toDbCategory = (appCategory: Category, userId: string): Omit<CategoryTable, 'created_at'> => ({
  id: appCategory.id,
  name: appCategory.name,
  icon: appCategory.icon,
  color: appCategory.color,
  type: appCategory.type,
  user_id: userId
});

// Transaction conversions
export const toAppTransaction = (dbTransaction: TransactionTable): Transaction => ({
  id: dbTransaction.id,
  amount: dbTransaction.amount,
  description: dbTransaction.description,
  date: dbTransaction.date,
  categoryId: dbTransaction.category_id,
  type: dbTransaction.type,
  recurring: dbTransaction.recurring,
  userId: dbTransaction.user_id
});

export const toDbTransaction = (appTransaction: Transaction): Omit<TransactionTable, 'created_at'> => ({
  id: appTransaction.id,
  amount: appTransaction.amount,
  description: appTransaction.description,
  date: appTransaction.date,
  category_id: appTransaction.categoryId,
  type: appTransaction.type,
  recurring: appTransaction.recurring,
  user_id: appTransaction.userId
});

// Budget conversions
export const toAppBudget = (dbBudget: BudgetTable): Budget => ({
  id: dbBudget.id,
  categoryId: dbBudget.category_id,
  amount: dbBudget.amount,
  spent: dbBudget.spent,
  period: dbBudget.period,
  userId: dbBudget.user_id
});

export const toDbBudget = (appBudget: Budget): Omit<BudgetTable, 'created_at'> => ({
  id: appBudget.id,
  category_id: appBudget.categoryId,
  amount: appBudget.amount,
  spent: appBudget.spent,
  period: appBudget.period,
  user_id: appBudget.userId
});

// FinancialGoal conversions
export const toAppFinancialGoal = (dbGoal: FinancialGoalTable): FinancialGoal => ({
  id: dbGoal.id,
  name: dbGoal.name,
  targetAmount: dbGoal.target_amount,
  currentAmount: dbGoal.current_amount,
  deadline: dbGoal.deadline,
  icon: dbGoal.icon,
  userId: dbGoal.user_id,
  category: dbGoal.category
});

export const toDbFinancialGoal = (appGoal: FinancialGoal): Omit<FinancialGoalTable, 'created_at'> => ({
  id: appGoal.id,
  name: appGoal.name,
  target_amount: appGoal.targetAmount,
  current_amount: appGoal.currentAmount,
  deadline: appGoal.deadline,
  icon: appGoal.icon,
  user_id: appGoal.userId,
  category: appGoal.category
});

// Notification conversions
export const toAppNotification = (dbNotification: NotificationTable): Notification => ({
  id: dbNotification.id,
  type: dbNotification.type,
  message: dbNotification.message,
  read: dbNotification.read,
  date: dbNotification.date,
  userId: dbNotification.user_id
});

export const toDbNotification = (appNotification: Notification): Omit<NotificationTable, 'created_at'> => ({
  id: appNotification.id,
  type: appNotification.type,
  message: appNotification.message,
  read: appNotification.read,
  date: appNotification.date,
  user_id: appNotification.userId
});

// Deal conversions
export const toAppDeal = (dbDeal: DealTable): Deal => ({
  id: dbDeal.id,
  title: dbDeal.title,
  description: dbDeal.description,
  provider: dbDeal.provider,
  discount: dbDeal.discount,
  expiryDate: dbDeal.expiry_date,
  category: dbDeal.category,
  location: dbDeal.location,
  url: dbDeal.url,
  merchant: dbDeal.merchant,
  featured: dbDeal.featured,
  validUntil: dbDeal.valid_until,
  image: dbDeal.image,
  link: dbDeal.link,
  couponCode: dbDeal.coupon_code
});

export const toDbDeal = (appDeal: Deal): Omit<DealTable, 'created_at'> => ({
  id: appDeal.id,
  title: appDeal.title,
  description: appDeal.description,
  provider: appDeal.provider,
  discount: appDeal.discount,
  expiry_date: appDeal.expiryDate,
  category: appDeal.category,
  location: appDeal.location,
  url: appDeal.url,
  merchant: appDeal.merchant,
  featured: appDeal.featured,
  valid_until: appDeal.validUntil,
  image: appDeal.image,
  link: appDeal.link,
  coupon_code: appDeal.couponCode
});

// Implement CRUD operations using Supabase
export const supabaseOperations = {
  // Users
  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    
    // Fix: Add type assertion for user data to ensure language is correctly typed
    if (data) {
      const typedData = {
        ...data,
        language: data.language as 'fr' | 'en'
      };
      return toAppUser(typedData);
    }
    
    return null;
  },

  async createUser(user: Omit<User, 'id'>, id: string) {
    const dbUser = {
      ...toDbUser({...user, id}),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('users')
      .insert([dbUser]);
      
    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }
      
    return {...user, id};
  },

  async updateUser(user: User) {
    const dbUser = {
      ...toDbUser(user),
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('users')
      .update(dbUser)
      .eq('id', user.id);
      
    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }
      
    return user;
  },

  // Categories
  async getCategories(userId: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    
    return data ? data.map(toAppCategory) : [];
  },

  async createCategory(category: Omit<Category, 'id'>, userId: string) {
    const id = crypto.randomUUID();
    const dbCategory = {
      ...toDbCategory({...category, id}, userId),
      created_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('categories')
      .insert([dbCategory]);
      
    if (error) {
      console.error('Error creating category:', error);
      throw error;
    }
      
    return {...category, id};
  },

  async updateCategory(category: Category, userId: string) {
    const dbCategory = toDbCategory(category, userId);
    
    const { error } = await supabase
      .from('categories')
      .update(dbCategory)
      .eq('id', category.id);
      
    if (error) {
      console.error('Error updating category:', error);
      throw error;
    }
      
    return category;
  },

  async deleteCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // Transactions
  async getTransactions(userId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
    
    return data ? data.map(toAppTransaction) : [];
  },

  async createTransaction(transaction: Omit<Transaction, 'id' | 'userId'>, userId: string) {
    const id = crypto.randomUUID();
    const dbTransaction = {
      ...toDbTransaction({...transaction, id, userId}),
      created_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('transactions')
      .insert([dbTransaction]);
      
    if (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
      
    return {...transaction, id, userId};
  },

  async updateTransaction(transaction: Transaction) {
    const dbTransaction = toDbTransaction(transaction);
    
    const { error } = await supabase
      .from('transactions')
      .update(dbTransaction)
      .eq('id', transaction.id);
      
    if (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
      
    return transaction;
  },

  async deleteTransaction(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  // Budgets
  async getBudgets(userId: string) {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching budgets:', error);
      return [];
    }
    
    return data ? data.map(toAppBudget) : [];
  },

  async createBudget(budget: Omit<Budget, 'id' | 'userId' | 'spent'>, userId: string) {
    const id = crypto.randomUUID();
    const dbBudget = {
      ...toDbBudget({...budget, id, userId, spent: 0}),
      created_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('budgets')
      .insert([dbBudget]);
      
    if (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
      
    return {...budget, id, userId, spent: 0};
  },

  async updateBudget(budget: Budget) {
    const dbBudget = toDbBudget(budget);
    
    const { error } = await supabase
      .from('budgets')
      .update(dbBudget)
      .eq('id', budget.id);
      
    if (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
      
    return budget;
  },

  async deleteBudget(id: string) {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  },

  // Goals
  async getGoals(userId: string) {
    const { data, error } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching goals:', error);
      return [];
    }
    
    return data ? data.map(toAppFinancialGoal) : [];
  },

  async createGoal(goal: Omit<FinancialGoal, 'id' | 'userId' | 'currentAmount'>, userId: string) {
    const id = crypto.randomUUID();
    const dbGoal = {
      ...toDbFinancialGoal({...goal, id, userId, currentAmount: 0}),
      created_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('financial_goals')
      .insert([dbGoal]);
      
    if (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
      
    return {...goal, id, userId, currentAmount: 0};
  },

  async updateGoal(goal: FinancialGoal) {
    const dbGoal = toDbFinancialGoal(goal);
    
    const { error } = await supabase
      .from('financial_goals')
      .update(dbGoal)
      .eq('id', goal.id);
      
    if (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
      
    return goal;
  },

  async deleteGoal(id: string) {
    const { error } = await supabase
      .from('financial_goals')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  },

  // Notifications
  async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
      
    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    
    return data ? data.map(toAppNotification) : [];
  },

  async createNotification(notification: Omit<Notification, 'id' | 'userId'>, userId: string) {
    const id = crypto.randomUUID();
    const dbNotification = {
      ...toDbNotification({...notification, id, userId}),
      created_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('notifications')
      .insert([dbNotification]);
      
    if (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
      
    return {...notification, id, userId};
  },

  async markNotificationAsRead(id: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
      
    if (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Deals
  async getDeals() {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching deals:', error);
      return [];
    }
    
    return data ? data.map(toAppDeal) : [];
  },

  async getDealById(id: string) {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching deal:', error);
      return null;
    }
    
    return data ? toAppDeal(data) : null;
  }
};
