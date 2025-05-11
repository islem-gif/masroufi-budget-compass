
import { useState } from 'react';
import { useMasroufi } from '@/lib/MasroufiContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Plus } from 'lucide-react';
import { toast } from 'sonner';

const Budget = () => {
  const { budgets, categories, addBudget, user } = useMasroufi();
  
  // Pour le formulaire d'ajout de budget
  const [showForm, setShowForm] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  
  // Filtrer les catégories de dépenses (pas besoin de budget pour les revenus)
  const expenseCategories = categories.filter(category => category.type === 'expense');
  
  const handleAddBudget = () => {
    if (!categoryId || !amount) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    
    // Vérifier si un budget existe déjà pour cette catégorie
    const existingBudget = budgets.find(b => b.categoryId === categoryId);
    if (existingBudget) {
      toast.error('Un budget existe déjà pour cette catégorie');
      return;
    }
    
    addBudget({
      categoryId,
      amount: Number(amount),
      period
    });
    
    toast.success('Budget ajouté avec succès!');
    
    // Réinitialiser le formulaire
    setCategoryId('');
    setAmount('');
    setPeriod('monthly');
    setShowForm(false);
  };
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Budget</h1>
          <p className="text-muted-foreground">Gérer vos limites de dépenses</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-masroufi-primary hover:bg-masroufi-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter un budget
        </Button>
      </div>
      
      {/* Formulaire d'ajout de budget */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Ajouter un budget</CardTitle>
            <CardDescription>
              Définissez une limite de budget pour une catégorie spécifique
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select onValueChange={setCategoryId}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Montant</Label>
                <div className="flex">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <div className="flex items-center px-3 bg-gray-100 dark:bg-gray-800 border border-l-0 border-input rounded-r-md">
                    {user?.currency || 'TND'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="period">Période</Label>
                <Select onValueChange={(value) => setPeriod(value as any)} defaultValue={period}>
                  <SelectTrigger id="period">
                    <SelectValue placeholder="Sélectionner une période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Quotidien</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                    <SelectItem value="yearly">Annuel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddBudget}>
              Ajouter
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Liste des budgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6 text-center space-y-4">
              <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 opacity-75" />
              <div>
                <h3 className="text-lg font-medium">Aucun budget défini</h3>
                <p className="text-sm text-muted-foreground">
                  Définissez des limites de budget pour mieux gérer vos dépenses
                </p>
                <Button className="mt-4" onClick={() => setShowForm(true)}>
                  Ajouter un budget
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          budgets.map(budget => {
            const category = categories.find(c => c.id === budget.categoryId);
            const percentage = (budget.spent / budget.amount) * 100;
            const status = percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'good';
            
            return (
              <Card key={budget.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-medium">{category?.name}</CardTitle>
                    <div className={`px-2 py-1 text-xs font-semibold rounded ${
                      status === 'exceeded' 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' 
                        : status === 'warning' 
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' 
                        : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    }`}>
                      {status === 'exceeded' 
                        ? 'Dépassé' 
                        : status === 'warning' 
                        ? 'Attention' 
                        : 'En bonne voie'
                      }
                    </div>
                  </div>
                  <CardDescription>
                    Budget {
                      budget.period === 'daily' ? 'quotidien' :
                      budget.period === 'weekly' ? 'hebdomadaire' :
                      budget.period === 'monthly' ? 'mensuel' : 'annuel'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Dépensé</span>
                      <span>{budget.spent.toFixed(2)} / {budget.amount.toFixed(2)} {user?.currency || 'TND'}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div 
                        className={`h-2.5 rounded-full ${
                          status === 'exceeded' 
                            ? 'bg-red-500' 
                            : status === 'warning' 
                            ? 'bg-amber-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Reste</span>
                    <span className={status === 'exceeded' ? 'text-red-500' : ''}>
                      {Math.max(0, budget.amount - budget.spent).toFixed(2)} {user?.currency || 'TND'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Budget;
