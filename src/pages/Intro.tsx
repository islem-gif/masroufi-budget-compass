
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download, Menu, X } from 'lucide-react';
import Logo from '@/components/common/Logo';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Intro = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleGetStarted = () => {
    navigate('/login');
  };

  const NavItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
  >(({ className, title, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </a>
    );
  });
  
  NavItem.displayName = "NavItem";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900/30 dark:to-gray-900 overflow-hidden relative">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[url('https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80')] bg-cover bg-center"></div>
      
      {/* Content container with z-index to appear above background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="container mx-auto p-4 flex items-center justify-between">
          <Logo size="lg" />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#about" className={navigationMenuTriggerStyle()}>
                    À propos de nous
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#contact" className={navigationMenuTriggerStyle()}>
                    Contactez-nous
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download size={16} /> Télécharger
                  </Button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  <a href="#about" className="text-lg font-medium py-2 hover:text-masroufi-primary">
                    À propos de nous
                  </a>
                  <a href="#contact" className="text-lg font-medium py-2 hover:text-masroufi-primary">
                    Contactez-nous
                  </a>
                  <Button className="mt-4 flex items-center gap-2">
                    <Download size={16} /> Télécharger
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 space-y-6 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Prenez le contrôle <br/>
              <span className="text-masroufi-primary">de vos finances</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Masroufi est votre compagnon financier personnel qui vous aide à suivre vos dépenses, 
              établir des budgets et atteindre vos objectifs financiers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={handleGetStarted} 
                className="bg-masroufi-primary hover:bg-masroufi-primary/90 text-lg px-8 py-6 h-auto"
              >
                Commencer <ArrowRight className="ml-2" />
              </Button>
              <Button 
                variant="outline" 
                className="border-masroufi-primary text-masroufi-primary hover:bg-masroufi-primary/10 text-lg px-8 py-6 h-auto"
              >
                En savoir plus
              </Button>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg aspect-video bg-white p-6 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-center h-full">
                <img 
                  src="/lovable-uploads/2ed10436-0962-43ca-a505-48831c9b0a7b.png" 
                  alt="Masroufi Logo" 
                  className="h-32 w-auto" 
                />
                <h2 className="text-2xl font-bold text-masroufi-primary ml-4">Budget Management</h2>
              </div>
            </div>
          </div>
        </main>

        <section id="about" className="py-16 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10 text-masroufi-primary">À propos de nous</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Notre Mission</h3>
                <p>Aider chacun à atteindre l'indépendance financière grâce à des outils simples et intuitifs.</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Notre Vision</h3>
                <p>Créer un monde où la gestion des finances personnelles est accessible et sans stress pour tous.</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Nos Valeurs</h3>
                <p>Simplicité, transparence, sécurité et innovation au service de votre réussite financière.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-16 bg-gray-50/70 dark:bg-gray-900/70 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10 text-masroufi-primary">Contactez-nous</h2>
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Nom</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" 
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" 
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" 
                    placeholder="Votre message..."
                  ></textarea>
                </div>
                <Button className="w-full bg-masroufi-primary hover:bg-masroufi-primary/90">
                  Envoyer
                </Button>
              </form>
            </div>
          </div>
        </section>

        <footer className="bg-white dark:bg-gray-900 py-6">
          <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <Logo size="sm" />
              </div>
              <p>&copy; {new Date().getFullYear()} Masroufi. Tous droits réservés.</p>
              <div className="mt-4 md:mt-0 flex space-x-4">
                <a href="#" className="text-masroufi-primary hover:text-masroufi-primary/80">
                  Conditions d'utilisation
                </a>
                <a href="#" className="text-masroufi-primary hover:text-masroufi-primary/80">
                  Politique de confidentialité
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Intro;
