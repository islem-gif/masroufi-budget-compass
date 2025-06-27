
import { User, Category, Transaction, Budget, FinancialGoal, Notification, Deal } from '@/types';

// Mock user data
export const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  phone: '+212601020304',
  firstName: 'Mohammed',
  lastName: 'Alami',
  avatar: '',
  darkMode: false,
  language: 'fr',
  currency: 'MAD',
};

// Mock categories
export const mockCategories: Category[] = [
  { id: '1', name: 'Salary', icon: 'piggy-bank', color: '#4CAF50', type: 'income', userId: '1' },
  { id: '2', name: 'Freelance', icon: 'credit-card', color: '#2196F3', type: 'income', userId: '1' },
  { id: '3', name: 'Gifts', icon: 'gift', color: '#9C27B0', type: 'income', userId: '1' },
  { id: '4', name: 'Food & Drinks', icon: 'utensils', color: '#FF5722', type: 'expense', userId: '1' },
  { id: '5', name: 'Transportation', icon: 'car', color: '#607D8B', type: 'expense', userId: '1' },
  { id: '6', name: 'Shopping', icon: 'shopping-bag', color: '#FFC107', type: 'expense', userId: '1' },
  { id: '7', name: 'Bills', icon: 'file-text', color: '#795548', type: 'expense', userId: '1' },
  { id: '8', name: 'Entertainment', icon: 'film', color: '#E91E63', type: 'expense', userId: '1' },
  { id: '9', name: 'Health', icon: 'activity', color: '#00BCD4', type: 'expense', userId: '1' },
  { id: '10', name: 'Education', icon: 'book', color: '#3F51B5', type: 'expense', userId: '1' },
];

// Mock transactions
export const mockTransactions: Transaction[] = [
  { id: '1', amount: 5000, description: 'Salary May', date: '2023-05-01', categoryId: '1', type: 'income', recurring: true, userId: '1' },
  { id: '2', amount: 1200, description: 'Web Development', date: '2023-05-05', categoryId: '2', type: 'income', recurring: false, userId: '1' },
  { id: '3', amount: 200, description: 'Restaurant', date: '2023-05-06', categoryId: '4', type: 'expense', recurring: false, userId: '1' },
  { id: '4', amount: 150, description: 'Taxi', date: '2023-05-07', categoryId: '5', type: 'expense', recurring: false, userId: '1' },
  { id: '5', amount: 300, description: 'Clothes', date: '2023-05-10', categoryId: '6', type: 'expense', recurring: false, userId: '1' },
  { id: '6', amount: 120, description: 'Electricity Bill', date: '2023-05-15', categoryId: '7', type: 'expense', recurring: true, userId: '1' },
  { id: '7', amount: 80, description: 'Internet Bill', date: '2023-05-15', categoryId: '7', type: 'expense', recurring: true, userId: '1' },
  { id: '8', amount: 200, description: 'Cinema & Dinner', date: '2023-05-20', categoryId: '8', type: 'expense', recurring: false, userId: '1' },
  { id: '9', amount: 500, description: 'Gift from Parents', date: '2023-05-22', categoryId: '3', type: 'income', recurring: false, userId: '1' },
  { id: '10', amount: 150, description: 'Medicine', date: '2023-05-25', categoryId: '9', type: 'expense', recurring: false, userId: '1' },
];

// Mock budgets
export const mockBudgets: Budget[] = [
  { id: '1', categoryId: '4', amount: 1000, spent: 200, period: 'monthly', userId: '1' },
  { id: '2', categoryId: '5', amount: 500, spent: 150, period: 'monthly', userId: '1' },
  { id: '3', categoryId: '6', amount: 800, spent: 300, period: 'monthly', userId: '1' },
  { id: '4', categoryId: '7', amount: 300, spent: 200, period: 'monthly', userId: '1' },
  { id: '5', categoryId: '8', amount: 500, spent: 200, period: 'monthly', userId: '1' },
  { id: '6', categoryId: '9', amount: 200, spent: 150, period: 'monthly', userId: '1' },
];

// Mock financial goals
export const mockGoals: FinancialGoal[] = [
  { id: '1', name: 'Vacation', targetAmount: 5000, currentAmount: 2000, deadline: '2023-08-01', icon: 'palm-tree', userId: '1' },
  { id: '2', name: 'New Laptop', targetAmount: 8000, currentAmount: 3500, deadline: '2023-10-15', icon: 'laptop', userId: '1' },
  { id: '3', name: 'Emergency Fund', targetAmount: 20000, currentAmount: 5000, deadline: '2024-01-01', icon: 'shield', userId: '1' },
];

// Mock notifications
export const mockNotifications: Notification[] = [
  { id: '1', type: 'budget_exceeded', message: 'You have exceeded your food budget!', read: false, date: '2023-05-25T10:30:00', userId: '1' },
  { id: '2', type: 'recurring_payment', message: 'Electricity bill due tomorrow', read: true, date: '2023-05-24T08:00:00', userId: '1' },
  { id: '3', type: 'tip', message: 'Save 15% of your income to reach your goals faster!', read: false, date: '2023-05-23T16:45:00', userId: '1' },
  { id: '4', type: 'goal_reached', message: 'You are halfway to your vacation goal!', read: false, date: '2023-05-22T12:15:00', userId: '1' },
];

// Mock deals
export const mockDeals: Deal[] = [
  { id: '1', title: '15% Student Discount', description: 'Get 15% off at Starbucks with student ID', provider: 'Starbucks', discount: '15%', expiryDate: '2023-06-30', category: 'Food & Drinks', location: 'All Locations', url: '#' },
  { id: '2', title: '20% Off Books', description: 'Special discount on academic books', provider: 'Al Maarifa Bookstore', discount: '20%', expiryDate: '2023-07-15', category: 'Education', url: '#' },
  { id: '3', title: 'Free Cinema Ticket', description: 'Buy 1 get 1 free on weekend movies', provider: 'Megarama', discount: '2 for 1', expiryDate: '2023-06-15', category: 'Entertainment', location: 'Casablanca', url: '#' },
];
