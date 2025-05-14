import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMasroufi } from '@/lib/MasroufiContext';
import { Button } from '@/components/ui/button';
import Logo from '@/components/common/Logo';

const Index = () => {
  const { isAuthenticated } = useMasroufi();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 py-12">
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
          <div className="flex md:justify-start justify-center mb-4">
            <Logo size="lg" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg">
            Prenez le contrôle de vos finances avec notre plateforme intelligente de budgétisation. 
            Suivez vos dépenses, fixez des objectifs et prenez des décisions financières éclairées.
          </p>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center md:justify-start">
            <Button 
              size="lg" 
              className="bg-masroufi-primary hover:bg-masroufi-primary/90" 
              onClick={() => navigate('/register')}
            >
              Commencer
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/login')}
            >
              Se connecter
            </Button>
          </div>
        </div>
        <div className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-masroufi-primary/20 rounded-full filter blur-2xl opacity-70 animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-masroufi-secondary/20 rounded-full filter blur-2xl opacity-70 animate-pulse"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="px-8 pt-8 pb-2">
                <h2 className="text-xl font-semibold text-center mb-6">Aperçu du tableau de bord</h2>
                {/* Mock Dashboard UI */}
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { title: "Balance", value: "5,240", color: "bg-blue-100 dark:bg-blue-900/30" },
                      { title: "Income", value: "8,500", color: "bg-green-100 dark:bg-green-900/30" },
                      { title: "Expenses", value: "3,260", color: "bg-red-100 dark:bg-red-900/30" }
                    ].map((item, i) => (
                      <div key={i} className={`${item.color} p-4 rounded-lg`}>
                        <p className="text-xs font-medium">{item.title}</p>
                        <p className="text-xl font-bold">{item.value} MAD</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Mock Chart */}
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                    <div className="h-4 w-32 mb-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    <div className="flex items-end h-32 space-x-2">
                      {[40, 65, 45, 80, 75, 50, 70].map((h, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-masroufi-primary rounded-t" 
                          style={{height: `${h}%`}}
                        ></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Mock Transactions */}
                  <div className="space-y-2">
                    {[
                      { name: "Groceries", amount: "-320", category: "Food" },
                      { name: "Salary", amount: "+5,000", category: "Income" },
                      { name: "Electricity", amount: "-150", category: "Bills" }
                    ].map((tx, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded">
                        <div>
                          <p className="text-sm font-medium">{tx.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{tx.category}</p>
                        </div>
                        <p className={`text-sm font-semibold ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.amount} MAD
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-4 bg-gray-100 dark:bg-gray-700 mt-4"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-white dark:bg-gray-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Track Expenses & Income",
                description: "Easily record transactions and categorize them automatically.",
                icon: "💰"
              },
              {
                title: "Budget Management",
                description: "Set monthly budgets by category and get alerts when you're close to limits.",
                icon: "📊"
              },
              {
                title: "Financial Goals",
                description: "Set savings goals and track your progress visually.",
                icon: "🎯"
              },
              {
                title: "Data Visualization",
                description: "Understand your spending patterns with intuitive charts and graphs.",
                icon: "📈"
              },
              {
                title: "Family Finance",
                description: "Connect accounts with family members and manage finances together.",
                icon: "👨‍👩‍👧‍👦"
              },
              {
                title: "Student Deals",
                description: "Discover exclusive discounts and offers for students.",
                icon: "🎓"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl card-hover">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-masroufi-primary py-16 px-6 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à prendre le contrôle de vos finances?</h2>
          <p className="text-lg mb-8 opacity-90">
            Rejoignez des milliers d'utilisateurs qui ont amélioré leurs habitudes financières avec Masroufi.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-masroufi-primary hover:bg-gray-100"
            onClick={() => navigate('/register')}
          >
            Créer un compte gratuit
          </Button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <div className="mb-2">
                <Logo size="md" />
              </div>
              <p className="text-sm">Votre compas budgétaire personnel</p>
            </div>
            <div className="flex space-x-8 mt-6 md:mt-0">
              <div>
                <h4 className="font-semibold mb-3">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">Features</a></li>
                  <li><a href="#" className="hover:text-white">Pricing</a></li>
                  <li><a href="#" className="hover:text-white">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">About</a></li>
                  <li><a href="#" className="hover:text-white">Blog</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">Privacy</a></li>
                  <li><a href="#" className="hover:text-white">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Masroufi. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
