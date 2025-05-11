
import { useState } from 'react';
import { useMasroufi } from '@/lib/MasroufiContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Pencil, Plus, ArrowUp, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Goals = () => {
  const { user, goals, addGoal, updateGoal } = useMasroufi();
  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [contributeOpen, setContributeOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: 0,
    deadline: '',
    category: 'savings'
  });
  const [contribution, setContribution] = useState(0);

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount > 0) {
      addGoal({
        name: newGoal.name,
        targetAmount: newGoal.targetAmount,
        deadline: newGoal.deadline ? new Date(newGoal.deadline).toISOString() : '',
        category: newGoal.category,
      });
      
      // Reset form and close dialog
      setNewGoal({
        name: '',
        targetAmount: 0,
        deadline: '',
        category: 'savings'
      });
      setNewGoalOpen(false);
    }
  };

  const handleContribute = () => {
    if (selectedGoal && contribution > 0) {
      const goal = goals.find(g => g.id === selectedGoal);
      if (goal) {
        updateGoal(selectedGoal, goal.currentAmount + contribution);
      }
      setContribution(0);
      setContributeOpen(false);
    }
  };

  const openContributeDialog = (goalId: string) => {
    setSelectedGoal(goalId);
    setContributeOpen(true);
  };

  const getStatusColor = (current: number, target: number) => {
    const progress = (current / target) * 100;
    if (progress < 25) return "bg-red-500";
    if (progress < 50) return "bg-orange-500";
    if (progress < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Financial Goals</h1>
          <p className="text-muted-foreground">Track and achieve your savings targets</p>
        </div>
        
        <Dialog open={newGoalOpen} onOpenChange={setNewGoalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-masroufi-primary hover:bg-masroufi-primary/90">
              <Plus className="mr-2 h-4 w-4" /> New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Financial Goal</DialogTitle>
              <DialogDescription>
                Set a new savings target to help you achieve your financial dreams.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="goalName">Goal Name</Label>
                <Input
                  id="goalName"
                  placeholder="e.g., New Laptop, Vacation"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="targetAmount">Target Amount ({user?.currency || 'TND'})</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  placeholder="1000"
                  value={newGoal.targetAmount || ''}
                  onChange={(e) => setNewGoal({...newGoal, targetAmount: Number(e.target.value)})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="deadline">Target Date (Optional)</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newGoal.category} 
                  onValueChange={(value) => setNewGoal({...newGoal, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="housing">Housing</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewGoalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddGoal}>Create Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {goals.length === 0 ? (
        <div className="text-center py-20">
          <Target className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">No financial goals yet</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
            Create your first financial goal to start tracking your progress towards your dreams.
          </p>
          <Button 
            className="mt-4" 
            onClick={() => setNewGoalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Create First Goal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const statusColor = getStatusColor(goal.currentAmount, goal.targetAmount);
            const deadline = goal.deadline ? new Date(goal.deadline) : null;
            const daysLeft = deadline ? Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : null;
            
            return (
              <Card key={goal.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-masroufi-secondary" />
                      {goal.name}
                    </CardTitle>
                    <Badge variant="outline" className="capitalize">
                      {goal.category}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    {deadline && (
                      <>
                        <Calendar className="h-3 w-3" />
                        {deadline.toLocaleDateString()} 
                        {daysLeft !== null && daysLeft > 0 && (
                          <span>({daysLeft} days left)</span>
                        )}
                      </>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="font-medium">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className={statusColor} />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{goal.currentAmount} {user?.currency || 'TND'}</span>
                      <span className="text-muted-foreground">of {goal.targetAmount} {user?.currency || 'TND'}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {}}
                    className="flex items-center gap-1"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => openContributeDialog(goal.id)}
                    className="flex items-center gap-1"
                  >
                    <ArrowUp className="h-3 w-3" /> Contribute
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
      
      <Dialog open={contributeOpen} onOpenChange={setContributeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Contribution</DialogTitle>
            <DialogDescription>
              Add funds to your goal to get closer to achieving it.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="contribution">Amount ({user?.currency || 'TND'})</Label>
              <Input
                id="contribution"
                type="number"
                placeholder="100"
                value={contribution || ''}
                onChange={(e) => setContribution(Number(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContributeOpen(false)}>Cancel</Button>
            <Button onClick={handleContribute}>Add Funds</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Goals;
