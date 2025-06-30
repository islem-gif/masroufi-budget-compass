import { User, Category, Transaction, Budget, FinancialGoal, Notification, Deal } from '@/types';
import { v4 as uuidv4 } from 'uuid'; // Install uuid package: npm install uuid

// Mock user data
export const mockUser: User = {
  id: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086', // Match your authenticated user ID
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
  { id: uuidv4(), name: 'Salary', icon: 'piggy-bank', color: '#4CAF50', type: 'income', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), name: 'Freelance', icon: 'credit-card', color: '#2196F3', type: 'income', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), name: 'Gifts', icon: 'gift', color: '#9C27B0', type: 'income', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), name: 'Food & Drinks', icon: 'utensils', color: '#FF5722', type: 'expense', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), name: 'Transportation', icon: 'car', color: '#607D8B', type: 'expense', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), name: 'Shopping', icon: 'shopping-bag', color: '#FFC107', type: 'expense', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), name: 'Bills', icon: 'file-text', color: '#795548', type: 'expense', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), name: 'Entertainment', icon: 'film', color: '#E91E63', type: 'expense', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), name: 'Health', icon: 'activity', color: '#00BCD4', type: 'expense', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), name: 'Education', icon: 'book', color: '#3F51B5', type: 'expense', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
];

// Mock transactions (update categoryId to match new UUIDs)
export const mockTransactions: Transaction[] = [
  { id: uuidv4(), amount: 5000, description: 'Salary May', date: '2023-05-01', categoryId: mockCategories[0].id, type: 'income', recurring: true, userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), amount: 1200, description: 'Web Development', date: '2023-05-05', categoryId: mockCategories[1].id, type: 'income', recurring: false, userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), amount: 200, description: 'Restaurant', date: '2023-05-06', categoryId: mockCategories[3].id, type: 'expense', recurring: false, userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), amount: 150, description: 'Taxi', date: '2023-05-07', categoryId: mockCategories[4].id, type: 'expense', recurring: false, userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), amount: 300, description: 'Clothes', date: '2023-05-10', categoryId: mockCategories[5].id, type: 'expense', recurring: false, userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), amount: 120, description: 'Electricity Bill', date: '2023-05-15', categoryId: mockCategories[6].id, type: 'expense', recurring: true, userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), amount: 80, description: 'Internet Bill', date: '2023-05-15', categoryId: mockCategories[6].id, type: 'expense', recurring: true, userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), amount: 200, description: 'Cinema & Dinner', date: '2023-05-20', categoryId: mockCategories[7].id, type: 'expense', recurring: false, userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), amount: 500, description: 'Gift from Parents', date: '2023-05-22', categoryId: mockCategories[2].id, type: 'income', recurring: false, userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), amount: 150, description: 'Medicine', date: '2023-05-25', categoryId: mockCategories[8].id, type: 'expense', recurring: false, userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
];

// Mock budgets (update categoryId to match new UUIDs)
export const mockBudgets: Budget[] = [
  { id: uuidv4(), categoryId: mockCategories[3].id, amount: 1000, spent: 200, period: 'monthly', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), categoryId: mockCategories[4].id, amount: 500, spent: 150, period: 'monthly', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), categoryId: mockCategories[5].id, amount: 800, spent: 300, period: 'monthly', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), categoryId: mockCategories[6].id, amount: 300, spent: 200, period: 'monthly', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), categoryId: mockCategories[7].id, amount: 500, spent: 200, period: 'monthly', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), categoryId: mockCategories[8].id, amount: 200, spent: 150, period: 'monthly', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
];

// Mock financial goals
export const mockGoals: FinancialGoal[] = [
  { id: uuidv4(), name: 'Vacation', targetAmount: 5000, currentAmount: 2000, deadline: '2023-08-01', icon: 'palm-tree', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), name: 'New Laptop', targetAmount: 8000, currentAmount: 3500, deadline: '2023-10-15', icon: 'laptop', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), name: 'Emergency Fund', targetAmount: 20000, currentAmount: 5000, deadline: '2024-01-01', icon: 'shield', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
];

// Mock notifications
export const mockNotifications: Notification[] = [
  { id: uuidv4(), type: 'budget_exceeded', message: 'You have exceeded your food budget!', read: false, date: '2023-05-25T10:30:00', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), type: 'recurring_payment', message: 'Electricity bill due tomorrow', read: true, date: '2023-05-24T08:00:00', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), type: 'tip', message: 'Save 15% of your income to reach your goals faster!', read: false, date: '2023-05-23T16:45:00', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
  { id: uuidv4(), type: 'goal_reached', message: 'You are halfway to your vacation goal!', read: false, date: '2023-05-22T12:15:00', userId: '8ff86d20-c6ac-4f74-97d7-5eabbfe54086' },
];

// Mock deals
export const mockDeals: Deal[] = [
  { id: uuidv4(), title: '15% Student Discount', description: 'Get 15% off at Starbucks with student ID', provider: 'Starbucks', discount: '15%', expiryDate: '2023-06-30', category: 'Food & Drinks', location: 'All Locations', url: '#' },
  { id: uuidv4(), title: '20% Off Books', description: 'Special discount on academic books', provider: 'Al Maarifa Bookstore', discount: '20%', expiryDate: '2023-07-15', category: 'Education', url: '#' },
  { id: uuidv4(), title: 'Free Cinema Ticket', description: 'Buy 1 get 1 free on weekend movies', provider: 'Megarama', discount: '2 for 1', expiryDate: '2023-06-15', category: 'Entertainment', location: 'Casablanca', url: '#' },
];