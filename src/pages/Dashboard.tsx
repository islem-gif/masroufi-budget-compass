
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMasroufi } from '@/lib/MasroufiContext';
import { PieChart, BarChart, Treemap, ResponsiveContainer, Pie, Bar, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ArrowUp, ArrowDown, Plus, Target, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, transactions, categories, budgets, goals, notifications } = useMasroufi();
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  
  // Filter recent transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Calculate balance
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;
  
  // Prepare data for charts
  const expensesByCategory = categories
    .filter(c => c.type === 'expense')
    .map(category => {
      const amount = transactions
        .filter(t => t.categoryId === category.id && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        name: category.name,
        value: amount,
        color: category.color
      };
    })
    .filter(item => item.value > 0);
  
  // Budget status
  const budgetStatuses = budgets.map(budget => {
    const category = categories.find(c => c.id === budget.categoryId);
    const percentage = (budget.spent / budget.amount) * 100;
    return {
      name: category?.name || 'Unknown',
      spent: budget.spent,
      limit: budget.amount,
      percentage,
      status: percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'good'
    };
  });

  const COLORS = ['#4CAF50', '#2196F3', '#FFC107', '#F44336', '#9C27B0', '#00BCD4', '#795548', '#FF9800'];

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.firstName}!</p>
        </div>
        <Button 
          onClick={() => navigate('/transactions/add')}
          className="bg-masroufi-primary hover:bg-masroufi-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
      </div>
      
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Balance Card */}
        <Card className="stats-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balance.toFixed(2)} {user?.currency || 'MAD'}
            </div>
            <p className="text-xs text-muted-foreground">
              This month's net flow
            </p>
          </CardContent>
        </Card>
        
        {/* Income Card */}
        <Card className="stats-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">
                {totalIncome.toFixed(2)} {user?.currency || 'MAD'}
              </div>
              <ArrowUp className="ml-2 h-4 w-4 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground">
              From all sources this month
            </p>
          </CardContent>
        </Card>
        
        {/* Expenses Card */}
        <Card className="stats-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">
                {totalExpenses.toFixed(2)} {user?.currency || 'MAD'}
              </div>
              <ArrowDown className="ml-2 h-4 w-4 text-red-500" />
            </div>
            <p className="text-xs text-muted-foreground">
              All spending this month
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recent Transactions */}
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Transactions</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate('/transactions')}
                  >
                    View all
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-6">
                      No recent transactions
                    </p>
                  ) : (
                    recentTransactions.map(transaction => {
                      const category = categories.find(c => c.id === transaction.categoryId);
                      return (
                        <div key={transaction.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                              <span className={`text-lg ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.type === 'income' ? '+' : '-'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.type === 'income' ? '+' : '-'}{transaction.amount} {user?.currency || 'MAD'}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {category?.name || 'Uncategorized'}
                            </Badge>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Expense Breakdown */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>This month's spending by category</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                {expensesByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={expensesByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {expensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`${value} ${user?.currency || 'MAD'}`, 'Amount']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[250px]">
                    <p className="text-muted-foreground">No expense data to display</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => navigate('/transactions/add')}
                    >
                      Add Transaction
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Financial Goals */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Financial Goals</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/goals')}
                >
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {goals.length === 0 ? (
                <div className="text-center py-10">
                  <Target className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No goals created yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Set financial goals to track your progress and stay motivated.
                  </p>
                  <Button 
                    className="mt-4 bg-masroufi-secondary hover:bg-masroufi-secondary/90" 
                    onClick={() => navigate('/goals/add')}
                  >
                    Create a Goal
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {goals.slice(0, 3).map(goal => {
                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                    return (
                      <div key={goal.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-masroufi-secondary/20 rounded-full flex items-center justify-center">
                              <Target className="h-4 w-4 text-masroufi-secondary" />
                            </div>
                            <div>
                              <p className="font-medium">{goal.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Target: {goal.targetAmount} {user?.currency || 'MAD'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{progress.toFixed(0)}%</p>
                            <p className="text-xs text-muted-foreground">
                              {goal.currentAmount} / {goal.targetAmount} {user?.currency || 'MAD'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div 
                            className="bg-masroufi-secondary h-2.5 rounded-full" 
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Spending Tab */}
        <TabsContent value="spending" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Spending Trends</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant={timeframe === 'week' ? 'default' : 'outline'} 
                    onClick={() => setTimeframe('week')}
                  >
                    Week
                  </Button>
                  <Button 
                    size="sm" 
                    variant={timeframe === 'month' ? 'default' : 'outline'} 
                    onClick={() => setTimeframe('month')}
                  >
                    Month
                  </Button>
                  <Button 
                    size="sm" 
                    variant={timeframe === 'year' ? 'default' : 'outline'} 
                    onClick={() => setTimeframe('year')}
                  >
                    Year
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={expensesByCategory}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value} ${user?.currency || 'MAD'}`, 'Amount']} />
                  <Legend />
                  <Bar dataKey="value" name="Amount" fill="#4CAF50">
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Budget Status</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/budget')}
                >
                  Manage Budget
                </Button>
              </div>
              <CardDescription>
                Track your spending against your budget limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              {budgetStatuses.length === 0 ? (
                <div className="text-center py-10">
                  <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No budgets set</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Create budget limits to help control your spending.
                  </p>
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate('/budget')}
                  >
                    Set Budget
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {budgetStatuses.map(budget => (
                    <div key={budget.name} className="space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{budget.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {budget.spent}/{budget.limit} {user?.currency || 'MAD'}
                          </p>
                        </div>
                        <Badge
                          className={
                            budget.status === 'exceeded' 
                              ? 'bg-red-500' 
                              : budget.status === 'warning' 
                              ? 'bg-amber-500' 
                              : 'bg-green-500'
                          }
                        >
                          {budget.status === 'exceeded' 
                            ? 'Exceeded' 
                            : budget.status === 'warning' 
                            ? 'Warning' 
                            : 'On Track'
                          }
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className={`h-2.5 rounded-full ${
                            budget.status === 'exceeded' 
                              ? 'bg-red-500' 
                              : budget.status === 'warning' 
                              ? 'bg-amber-500' 
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
