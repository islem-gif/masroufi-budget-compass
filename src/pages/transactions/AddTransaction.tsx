
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMasroufi } from '@/lib/MasroufiContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

const AddTransaction = () => {
  const { addTransaction, categories, user } = useMasroufi();
  const navigate = useNavigate();
  
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [date, setDate] = useState<Date>(new Date());
  const [recurring, setRecurring] = useState<boolean>(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !categoryId) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Créer la transaction
    addTransaction({
      amount: Number(amount),
      description,
      categoryId,
      type,
      date: date.toISOString(),
      recurring
    });
    
    toast.success("Transaction ajoutée avec succès!");
    navigate('/transactions');
  };
  
  return (
    <div className="container max-w-md mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Ajouter une transaction</span>
            <span className={type === 'income' ? 'text-green-500' : 'text-red-500'}>
              {type === 'income' ? 'Revenu' : 'Dépense'}
            </span>
          </CardTitle>
          <CardDescription>
            Ajoutez une nouvelle transaction à votre budget
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type de transaction</Label>
              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant={type === 'expense' ? 'default' : 'outline'}
                  onClick={() => setType('expense')}
                >
                  Dépense
                </Button>
                <Button 
                  type="button" 
                  variant={type === 'income' ? 'default' : 'outline'}
                  onClick={() => setType('income')}
                >
                  Revenu
                </Button>
              </div>
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
                  className="w-full"
                  required
                />
                <div className="flex items-center px-3 bg-gray-100 dark:bg-gray-800 border border-l-0 border-input rounded-r-md">
                  {user?.currency || 'TND'}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Description de la transaction"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select onValueChange={setCategoryId} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter(category => category.type === type)
                    .map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, 'P', { locale: fr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={recurring}
                onCheckedChange={setRecurring}
              />
              <Label htmlFor="recurring">Transaction récurrente</Label>
            </div>
            
            <CardFooter className="flex justify-end space-x-2 px-0 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Annuler
              </Button>
              <Button type="submit">
                Ajouter
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTransaction;
