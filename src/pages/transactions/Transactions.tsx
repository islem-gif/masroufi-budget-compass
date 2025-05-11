
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMasroufi } from '@/lib/MasroufiContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Search, ArrowUp, ArrowDown } from 'lucide-react';

const Transactions = () => {
  const { transactions, categories, user } = useMasroufi();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  
  // Filtrer les transactions
  const filteredTransactions = transactions
    .filter(transaction => 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(transaction => 
      filter === 'all' ? true : transaction.type === filter
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  // Calculer les totaux
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">Gérer vos revenus et dépenses</p>
        </div>
        <Button 
          onClick={() => navigate('/transactions/add')}
          className="bg-masroufi-primary hover:bg-masroufi-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter une transaction
        </Button>
      </div>
      
      {/* Résumé des finances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Solde actuel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalIncome - totalExpenses).toFixed(2)} {user?.currency || 'TND'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">
                {totalIncome.toFixed(2)} {user?.currency || 'TND'}
              </div>
              <ArrowUp className="ml-2 h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">
                {totalExpenses.toFixed(2)} {user?.currency || 'TND'}
              </div>
              <ArrowDown className="ml-2 h-4 w-4 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher des transactions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            onClick={() => setFilter('all')}
            size="sm"
          >
            Tout
          </Button>
          <Button 
            variant={filter === 'income' ? 'default' : 'outline'} 
            onClick={() => setFilter('income')}
            size="sm"
            className={filter === 'income' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Revenus
          </Button>
          <Button 
            variant={filter === 'expense' ? 'default' : 'outline'} 
            onClick={() => setFilter('expense')}
            size="sm"
            className={filter === 'expense' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            Dépenses
          </Button>
        </div>
      </div>
      
      {/* Liste des transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des transactions</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transaction(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune transaction trouvée
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Montant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => {
                    const category = categories.find(c => c.id === transaction.categoryId);
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {format(new Date(transaction.date), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{transaction.description}</div>
                          {transaction.recurring && (
                            <Badge variant="outline" className="text-xs">Récurrent</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            style={{ backgroundColor: category?.color || '#777' }}
                            className="text-white"
                          >
                            {category?.name || 'Non catégorisé'}
                          </Badge>
                        </TableCell>
                        <TableCell className={`font-medium ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {transaction.amount.toFixed(2)} {user?.currency || 'TND'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
