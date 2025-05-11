
import { useState } from 'react';
import { useMasroufi } from '@/lib/MasroufiContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, Trophy, Star, Circle, Target, Medal } from 'lucide-react';
import { toast } from 'sonner';

// Interface pour les défis
interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  target: number;
  progress: number;
  reward: string;
  completed: boolean;
  category?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const Challenges = () => {
  const { user, transactions, goals } = useMasroufi();
  
  // Générer des défis basés sur l'activité de l'utilisateur
  const generateChallenges = (): Challenge[] => {
    const totalSavings = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0) -
      transactions.filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const foodExpenses = transactions
      .filter(t => t.type === 'expense' && t.categoryId === 'food')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const challenges: Challenge[] = [
      {
        id: '1',
        title: 'Économiseur débutant',
        description: 'Économisez 100 TND',
        icon: <Star className="text-yellow-500" />,
        target: 100,
        progress: Math.min(totalSavings, 100),
        reward: 'Badge économiseur débutant',
        completed: totalSavings >= 100,
        difficulty: 'easy'
      },
      {
        id: '2',
        title: 'Économiseur intermédiaire',
        description: 'Économisez 500 TND',
        icon: <Award className="text-blue-500" />,
        target: 500,
        progress: Math.min(totalSavings, 500),
        reward: 'Badge économiseur intermédiaire',
        completed: totalSavings >= 500,
        difficulty: 'medium'
      },
      {
        id: '3',
        title: 'Économiseur expert',
        description: 'Économisez 1000 TND',
        icon: <Trophy className="text-purple-500" />,
        target: 1000,
        progress: Math.min(totalSavings, 1000),
        reward: 'Badge économiseur expert',
        completed: totalSavings >= 1000,
        difficulty: 'hard'
      },
      {
        id: '4',
        title: 'Gourmet économe',
        description: 'Réduisez vos dépenses alimentaires à moins de 200 TND/mois',
        icon: <Medal className="text-green-500" />,
        target: 200,
        progress: Math.max(0, 200 - foodExpenses),
        reward: '+5% de cashback virtuel sur vos économies',
        completed: foodExpenses < 200,
        category: 'Nourriture',
        difficulty: 'medium'
      },
      {
        id: '5',
        title: 'Objectif en vue',
        description: 'Créez et atteignez 50% d\'un objectif d\'épargne',
        icon: <Target className="text-red-500" />,
        target: 50,
        progress: goals.length > 0 
          ? Math.max(...goals.map(g => (g.currentAmount / g.targetAmount) * 100))
          : 0,
        reward: 'Débloquez l\'outil de projection d\'épargne',
        completed: goals.some(g => (g.currentAmount / g.targetAmount) >= 0.5),
        difficulty: 'easy'
      }
    ];
    
    return challenges;
  };
  
  const [challenges] = useState<Challenge[]>(generateChallenges);
  const [showTip, setShowTip] = useState(true);
  
  const completedChallenges = challenges.filter(c => c.completed);
  const pendingChallenges = challenges.filter(c => !c.completed);
  
  const claimReward = (challenge: Challenge) => {
    toast.success(`Félicitations! Vous avez réclamé : ${challenge.reward}`);
  };
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Défis d'épargne</h1>
          <p className="text-muted-foreground">Relevez des défis pour économiser plus</p>
        </div>
        {completedChallenges.length > 0 && (
          <div className="flex items-center">
            <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
            <span>{completedChallenges.length} défi(s) terminé(s)</span>
          </div>
        )}
      </div>
      
      {/* Conseil du jour */}
      {showTip && (
        <Card className="bg-masroufi-secondary/10">
          <CardContent className="p-4 flex items-start space-x-4">
            <div className="bg-masroufi-secondary/20 p-2 rounded-full">
              <Circle className="h-6 w-6 text-masroufi-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Conseil du jour</h3>
              <p className="text-sm text-muted-foreground">
                Économisez 10% de vos revenus chaque mois pour atteindre la liberté financière plus rapidement.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowTip(false)}>
              Fermer
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Défis en cours */}
      <h2 className="text-xl font-semibold mt-6">Défis en cours</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pendingChallenges.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <Trophy className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 font-medium">Félicitations!</h3>
              <p className="text-sm text-muted-foreground">
                Vous avez complété tous les défis disponibles.
              </p>
            </CardContent>
          </Card>
        ) : (
          pendingChallenges.map(challenge => (
            <Card key={challenge.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {challenge.icon}
                    </div>
                    <CardTitle className="text-base">{challenge.title}</CardTitle>
                  </div>
                  <Badge variant="outline" className={
                    challenge.difficulty === 'easy' ? 'border-green-500 text-green-500' :
                    challenge.difficulty === 'medium' ? 'border-yellow-500 text-yellow-500' :
                    'border-red-500 text-red-500'
                  }>
                    {challenge.difficulty === 'easy' ? 'Facile' :
                     challenge.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                  </Badge>
                </div>
                <CardDescription>{challenge.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-2">
                {challenge.category && (
                  <Badge variant="secondary">{challenge.category}</Badge>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span>{Math.round((challenge.progress / challenge.target) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(challenge.progress / challenge.target) * 100} 
                    className="h-2"
                  />
                </div>
                
                <div className="text-sm">
                  <span className="font-medium">Récompense:</span> {challenge.reward}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {/* Défis complétés */}
      {completedChallenges.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-6">Défis complétés</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedChallenges.map(challenge => (
              <Card key={challenge.id} className="overflow-hidden border-green-200 dark:border-green-900">
                <CardHeader className="pb-2 bg-green-50/50 dark:bg-green-900/20">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        {challenge.icon}
                      </div>
                      <CardTitle className="text-base">{challenge.title}</CardTitle>
                    </div>
                    <Badge className="bg-green-500">Complété</Badge>
                  </div>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pb-2 pt-4">
                  <div className="space-y-2">
                    <Progress value={100} className="h-2 bg-green-100 dark:bg-green-900" />
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Récompense:</span> {challenge.reward}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => claimReward(challenge)}
                  >
                    Réclamer la récompense
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
      
      {/* Section de jeu simple - Économie quotidienne */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Économie quotidienne</CardTitle>
          <CardDescription>
            Faites des choix pour économiser de l'argent chaque jour
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Défi du jour :</h3>
              <p>Apporter votre déjeuner au travail/école au lieu d'acheter à l'extérieur</p>
              <div className="flex justify-between items-center mt-4">
                <div>
                  <span className="font-semibold">Économie potentielle :</span>
                  <span className="ml-2 text-green-600">15 {user?.currency || 'TND'}</span>
                </div>
                <Button onClick={() => toast.success("Défi accepté! Revenez demain pour un nouveau défi.")}>
                  J'accepte le défi
                </Button>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Astuce d'épargne :</h3>
              <p>Essayez la règle 50/30/20 : 50% pour les besoins, 30% pour les envies et 20% pour l'épargne.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Challenges;
