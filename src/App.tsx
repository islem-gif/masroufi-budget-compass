
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MasroufiProvider } from "@/lib/MasroufiContext";
import MainLayout from "@/components/layout/MainLayout";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/transactions/Transactions";
import AddTransaction from "@/pages/transactions/AddTransaction";
import Budget from "@/pages/budget/Budget";
import Challenges from "@/pages/gamification/Challenges";
import Reports from "@/pages/reports/Reports";
import Goals from "@/pages/goals/Goals";
import Family from "@/pages/family/Family";
import Deals from "@/pages/deals/Deals";
import Settings from "@/pages/settings/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MasroufiProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/transactions/add" element={<AddTransaction />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/family" element={<Family />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/challenges" element={<Challenges />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </MasroufiProvider>
  </QueryClientProvider>
);

export default App;
