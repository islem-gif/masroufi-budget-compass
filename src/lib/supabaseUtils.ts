import { supabase } from '@/integrations/supabase/client';
import { User, Category, Transaction, Budget, FinancialGoal, Notification, Deal } from '@/types';

export const supabaseOperations = {
  // User operations
  async getUser(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        avatar: data.avatar_url,
        darkMode: data.dark_mode,
        language: data.language as 'fr' | 'en',
        currency: data.currency,
        role: data.role as 'admin' | 'user' | undefined
      };
    } catch (error) {
      console.error('Error in getUser:', error);
      return null;
    }
  },

  async createUser(user: User, authUserId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .insert({
          id: authUserId,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phone,
          avatar_url: user.avatar,
          dark_mode: user.darkMode,
          language: user.language,
          currency: user.currency,
          role: user.role || 'user'
        });

      if (error) {
        console.error('Error creating user:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  },

  async updateUser(user: User): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phone,
          avatar_url: user.avatar,
          dark_mode: user.darkMode,
          language: user.language,
          currency: user.currency,
          role: user.role || 'user'
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  },

  // Categories
  async getCategories(userId: string): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }

      return data.map(cat => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        type: cat.type as 'income' | 'expense',
        userId: cat.user_id
      }));
    } catch (error) {
      console.error('Error in getCategories:', error);
      return [];
    }
  },

  async createCategory(category: Omit<Category, 'id' | 'userId'>, userId: string): Promise<Category> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          icon: category.icon,
          color: category.color,
          type: category.type,
          user_id: userId
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating category:', error);
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        icon: data.icon,
        color: data.color,
        type: data.type as 'income' | 'expense',
        userId: data.user_id
      };
    } catch (error) {
      console.error('Error in createCategory:', error);
      throw error;
    }
  },

  // Transactions
  async getTransactions(userId: string): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        return [];
      }

      return data.map(trans => ({
        id: trans.id,
        amount: trans.amount,
        description: trans.description,
        date: trans.date,
        categoryId: trans.category_id,
        type: trans.type as 'income' | 'expense',
        recurring: trans.recurring,
        userId: trans.user_id
      }));
    } catch (error) {
      console.error('Error in getTransactions:', error);
      return [];
    }
  },

  async createTransaction(transaction: Omit<Transaction, 'id' | 'userId'>, userId: string): Promise<Transaction> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          amount: transaction.amount,
          description: transaction.description,
          date: transaction.date,
          category_id: transaction.categoryId,
          type: transaction.type,
          recurring: transaction.recurring,
          user_id: userId
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating transaction:', error);
        throw error;
      }

      return {
        id: data.id,
        amount: data.amount,
        description: data.description,
        date: data.date,
        categoryId: data.category_id,
        type: data.type as 'income' | 'expense',
        recurring: data.recurring,
        userId: data.user_id
      };
    } catch (error) {
      console.error('Error in createTransaction:', error);
      throw error;
    }
  },

  // Budgets
  async getBudgets(userId: string): Promise<Budget[]> {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching budgets:', error);
        return [];
      }

      return data.map(budget => ({
        id: budget.id,
        categoryId: budget.category_id,
        amount: budget.amount,
        spent: budget.spent,
        period: budget.period as 'daily' | 'weekly' | 'monthly' | 'yearly',
        userId: budget.user_id
      }));
    } catch (error) {
      console.error('Error in getBudgets:', error);
      return [];
    }
  },

  async createBudget(budget: Omit<Budget, 'id' | 'userId' | 'spent'>, userId: string): Promise<Budget> {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert({
          category_id: budget.categoryId,
          amount: budget.amount,
          period: budget.period,
          user_id: userId
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating budget:', error);
        throw error;
      }

      return {
        id: data.id,
        categoryId: data.category_id,
        amount: data.amount,
        spent: data.spent,
        period: data.period as 'daily' | 'weekly' | 'monthly' | 'yearly',
        userId: data.user_id
      };
    } catch (error) {
      console.error('Error in createBudget:', error);
      throw error;
    }
  },

  async updateBudget(budget: Budget): Promise<void> {
    try {
      const { error } = await supabase
        .from('budgets')
        .update({
          category_id: budget.categoryId,
          amount: budget.amount,
          spent: budget.spent,
          period: budget.period
        })
        .eq('id', budget.id);

      if (error) {
        console.error('Error updating budget:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateBudget:', error);
      throw error;
    }
  },

  // Goals
  async getGoals(userId: string): Promise<FinancialGoal[]> {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching goals:', error);
        return [];
      }

      return data.map(goal => ({
        id: goal.id,
        name: goal.name,
        targetAmount: goal.target_amount,
        currentAmount: goal.current_amount,
        deadline: goal.deadline,
        icon: goal.icon,
        category: goal.category,
        userId: goal.user_id
      }));
    } catch (error) {
      console.error('Error in getGoals:', error);
      return [];
    }
  },

  async createGoal(goal: Omit<FinancialGoal, 'id' | 'userId' | 'currentAmount'>, userId: string): Promise<FinancialGoal> {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .insert({
          name: goal.name,
          target_amount: goal.targetAmount,
          deadline: goal.deadline,
          icon: goal.icon,
          category: goal.category,
          user_id: userId
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating goal:', error);
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        targetAmount: data.target_amount,
        currentAmount: data.current_amount,
        deadline: data.deadline,
        icon: data.icon,
        category: data.category,
        userId: data.user_id
      };
    } catch (error) {
      console.error('Error in createGoal:', error);
      throw error;
    }
  },

  async updateGoal(goal: FinancialGoal): Promise<void> {
    try {
      const { error } = await supabase
        .from('financial_goals')
        .update({
          name: goal.name,
          target_amount: goal.targetAmount,
          current_amount: goal.currentAmount,
          deadline: goal.deadline,
          icon: goal.icon,
          category: goal.category
        })
        .eq('id', goal.id);

      if (error) {
        console.error('Error updating goal:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateGoal:', error);
      throw error;
    }
  },

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      return data.map(notif => ({
        id: notif.id,
        type: notif.type as 'budget_exceeded' | 'goal_reached' | 'recurring_payment' | 'tip',
        message: notif.message,
        read: notif.read,
        date: notif.date,
        userId: notif.user_id
      }));
    } catch (error) {
      console.error('Error in getNotifications:', error);
      return [];
    }
  },

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in markNotificationAsRead:', error);
      throw error;
    }
  },

  // Deals
  async getDeals(): Promise<Deal[]> {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching deals:', error);
        return [];
      }

      return data.map(deal => ({
        id: deal.id,
        title: deal.title,
        description: deal.description,
        provider: deal.provider,
        discount: deal.discount,
        expiryDate: deal.expiry_date,
        category: deal.category,
        location: deal.location,
        url: deal.url,
        merchant: deal.merchant,
        featured: deal.featured,
        validUntil: deal.valid_until,
        image: deal.image,
        link: deal.link,
        couponCode: deal.coupon_code
      }));
    } catch (error) {
      console.error('Error in getDeals:', error);
      return [];
    }
  },

  // Activity logging function
  async logActivity(userId: string, action: string, entityType: string, entityId?: string, details?: any): Promise<void> {
    try {
      const { error } = await supabase
        .rpc('log_activity', {
          user_id: userId,
          action,
          entity_type: entityType,
          entity_id: entityId,
          details
        });

      if (error) {
        console.error('Error logging activity:', error);
      }
    } catch (error) {
      console.error('Error in logActivity:', error);
    }
  }
};
