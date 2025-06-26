
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
import { Plus, Search } from 'lucide-react';

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
