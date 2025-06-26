
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  darkMode: boolean;
  language: 'fr' | 'en';
  currency: string;
  role?: 'admin' | 'user';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
  userId: string;
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
  category?: string;
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
  merchant?: string;
  featured?: boolean;
  validUntil?: string;
  image?: string;
  link?: string;
  couponCode?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: any;
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  progress: number;
  target: number;
  deadline: string;
  category: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  joinedAt: string;
  avatar?: string;
}

export interface FamilyGroup {
  id: string;
  name: string;
  description?: string;
  members: FamilyMember[];
  createdAt: string;
  ownerId: string;
}
