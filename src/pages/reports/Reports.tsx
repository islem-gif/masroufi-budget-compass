
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMasroufi } from "@/lib/MasroufiContext";
import { BarChart, LineChart, PieChart, ResponsiveContainer, Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts";
import { AreaChart, Area } from "recharts";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FilterX } from "lucide-react";

const Reports = () => {
  const { user, transactions, categories } = useMasroufi();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  
  // Calculate data for reports
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

  // Monthly trend data (simplified mock data)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  const trendData = months.map((month, index) => {
    // Create some simulated data based on real transactions
    const baseAmount = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0) / 12;
    
    // Add some randomization to make the chart look realistic
    const randomFactor = 0.5 + Math.random();
    // Make current month match actual data
    const amount = index === currentMonth ? 
      transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) :
      baseAmount * randomFactor;

    return {
      name: month,
      expenses: Math.round(amount),
      income: Math.round(amount * (1.2 + Math.random() * 0.5)), // Income is higher than expenses
    };
  });

  const COLORS = ['#4CAF50', '#2196F3', '#FFC107', '#F44336', '#9C27B0', '#00BCD4', '#795548', '#FF9800'];

  // Option to export report (mock functionality)
  const exportReport = () => {
    alert("This would export your financial report as PDF or CSV");
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Financial Reports</h1>
          <p className="text-muted-foreground">Analyze your spending and income patterns</p>
        </div>
        <Button 
          onClick={exportReport}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" /> Export Report
        </Button>
      </div>

      <div className="flex items-center justify-between">
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
            variant={timeframe === 'quarter' ? 'default' : 'outline'} 
            onClick={() => setTimeframe('quarter')}
          >
            Quarter
          </Button>
          <Button 
            size="sm" 
            variant={timeframe === 'year' ? 'default' : 'outline'} 
            onClick={() => setTimeframe('year')}
          >
            Year
          </Button>
        </div>
        {filterCategory && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setFilterCategory(null)}
          >
            <FilterX className="h-4 w-4" /> Clear filter
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
                <CardDescription>Breakdown by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value} ${user?.currency || 'TND'}`, 'Amount']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Income vs Expenses</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F44336" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#F44336" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip formatter={(value: number) => [`${value} ${user?.currency || 'TND'}`, '']} />
                    <Legend />
                    <Area type="monotone" dataKey="expenses" stroke="#F44336" fillOpacity={1} fill="url(#colorExpenses)" />
                    <Area type="monotone" dataKey="income" stroke="#4CAF50" fillOpacity={1} fill="url(#colorIncome)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Yearly Summary</CardTitle>
              <CardDescription>Financial overview for the year</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value} ${user?.currency || 'TND'}`, '']} />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#4CAF50" />
                  <Bar dataKey="expenses" name="Expenses" fill="#F44336" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Analysis</CardTitle>
              <CardDescription>Detailed view of your spending</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value} ${user?.currency || 'TND'}`}
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} ${user?.currency || 'TND'}`, 'Amount']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Income Streams</CardTitle>
              <CardDescription>Analysis of your income sources</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value} ${user?.currency || 'TND'}`, '']} />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#4CAF50" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Period Comparison</CardTitle>
              <CardDescription>Compare financial performance across periods</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value} ${user?.currency || 'TND'}`, '']} />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#4CAF50" />
                  <Bar dataKey="expenses" name="Expenses" fill="#F44336" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
