
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Logo from '@/components/common/Logo';

const Intro = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-masroufi-primary/10 to-white dark:from-masroufi-primary/20 dark:to-gray-900">
      <header className="container mx-auto p-6">
        <Logo size="md" />
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 space-y-6 mb-12 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            Prenez le contrôle de vos finances
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Masroufi est votre compagnon financier personnel qui vous aide à suivre vos dépenses, 
            établir des budgets et atteindre vos objectifs financiers.
          </p>
          <Button 
            onClick={handleGetStarted} 
            className="bg-masroufi-primary hover:bg-masroufi-primary/90 text-lg px-8 py-6 h-auto"
          >
            Commencer ici <ArrowRight className="ml-2" />
          </Button>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-lg aspect-video rounded-lg overflow-hidden shadow-xl">
            {/* Utilisez une vidéo de présentation ou un placeholder */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
              <div className="text-gray-500 dark:text-gray-400">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-900 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
          <p>&copy; {new Date().getFullYear()} Masroufi. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Intro;
