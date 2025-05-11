
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
  language: appUser.language,
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

// Basic CRUD operations placeholder
// Note: These operations will be properly implemented once the tables are created in Supabase
export const supabaseOperations = {
  // Users
  async getUser(userId: string) {
    console.log('getUser called with ID:', userId);
    // Will be implemented once tables are created
    return null;
  },

  // Categories
  async getCategories(userId: string) {
    console.log('getCategories called for user:', userId);
    // Will be implemented once tables are created
    return [];
  },

  // Transactions
  async getTransactions(userId: string) {
    console.log('getTransactions called for user:', userId);
    // Will be implemented once tables are created
    return [];
  },

  // Budgets
  async getBudgets(userId: string) {
    console.log('getBudgets called for user:', userId);
    // Will be implemented once tables are created
    return [];
  },

  // Goals
  async getGoals(userId: string) {
    console.log('getGoals called for user:', userId);
    // Will be implemented once tables are created
    return [];
  },

  // Notifications
  async getNotifications(userId: string) {
    console.log('getNotifications called for user:', userId);
    // Will be implemented once tables are created
    return [];
  },

  // Deals
  async getDeals() {
    console.log('getDeals called');
    // Will be implemented once tables are created
    return [];
  }
};
