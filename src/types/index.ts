
export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  darkMode: boolean;
  language: 'fr' | 'en';
  currency: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  type: 'income' | 'expense';
  recurring: boolean;
  userId: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  spent: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  userId: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  userId: string;
}

export interface Notification {
  id: string;
  type: 'budget_exceeded' | 'goal_reached' | 'recurring_payment' | 'tip';
  message: string;
  read: boolean;
  date: string;
  userId: string;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  provider: string;
  discount: string;
  expiryDate: string;
  category: string;
  location?: string;
  url?: string;
}
