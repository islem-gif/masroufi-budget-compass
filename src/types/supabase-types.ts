
import { Database } from '@/integrations/supabase/types';

// Custom type definitions that extend the generated Supabase types
export type Tables = Database['public']['Tables'];

// Define your table interfaces here that match your Supabase schema
export interface UserTable {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  dark_mode: boolean;
  language: 'fr' | 'en';
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryTable {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
  user_id: string;
  created_at: string;
}

export interface TransactionTable {
  id: string;
  amount: number;
  description: string;
  date: string;
  category_id: string;
  type: 'income' | 'expense';
  recurring: boolean;
  user_id: string;
  created_at: string;
}

export interface BudgetTable {
  id: string;
  category_id: string;
  amount: number;
  spent: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  user_id: string;
  created_at: string;
}

export interface FinancialGoalTable {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  icon: string;
  user_id: string;
  category?: string;
  created_at: string;
}

export interface NotificationTable {
  id: string;
  type: 'budget_exceeded' | 'goal_reached' | 'recurring_payment' | 'tip';
  message: string;
  read: boolean;
  date: string;
  user_id: string;
  created_at: string;
}

export interface DealTable {
  id: string;
  title: string;
  description: string;
  provider: string;
  discount: string;
  expiry_date: string;
  category: string;
  location?: string;
  url?: string;
  merchant?: string;
  featured?: boolean;
  valid_until?: string;
  image?: string;
  link?: string;
  coupon_code?: string;
  created_at: string;
}
