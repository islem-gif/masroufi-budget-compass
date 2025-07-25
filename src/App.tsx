
import { Route, Routes } from 'react-router-dom';
import { MasroufiProvider } from '@/lib/MasroufiContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/transactions/Transactions';
import AddTransaction from './pages/transactions/AddTransaction'; 
import Budget from './pages/budget/Budget';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';
import Goals from './pages/goals/Goals';
import Deals from './pages/deals/Deals';
import DealDetail from './pages/deals/DealDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';
import ResetPassword from './pages/auth/ResetPassword';
import Intro from './pages/Intro';
import Family from './pages/family/Family';
import Challenges from './pages/gamification/Challenges';
import PrivateRoute from './components/auth/PrivateRoute';
import './App.css';

function App() {
  return (
    <MasroufiProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Intro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected routes */}
        <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="transactions/add" element={<AddTransaction />} />
          <Route path="budget" element={<Budget />} />
          <Route path="reports" element={<Reports />} />
          <Route path="goals" element={<Goals />} />
          <Route path="deals" element={<Deals />} />
          <Route path="deals/:id" element={<DealDetail />} />
          <Route path="family" element={<Family />} />
          <Route path="challenges" element={<Challenges />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MasroufiProvider>
  );
}

export default App;
