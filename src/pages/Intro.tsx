import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download, Phone, Mail, MapPin, ExternalLink, Users, Info, Link } from 'lucide-react';
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
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';

const Intro = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Effect to track scrolling for navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Animation for elements when they come into view
  const useInView = (ref: React.RefObject<HTMLElement>, options = {}) => {
    const [isInView, setIsInView] = useState(false);
    
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting);
        },
        { threshold: 0.1, ...options }
      );
      
      if (ref.current) {
        observer.observe(ref.current);
      }
      
      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, [ref, options]);
    
    return isInView;
  };
  
  // References for animations
  const aboutRef = React.useRef<HTMLElement>(null);
  const contactRef = React.useRef<HTMLElement>(null);
  const partnersRef = React.useRef<HTMLElement>(null);
  const infoRef = React.useRef<HTMLElement>(null);
  
  const aboutInView = useInView(aboutRef);
  const contactInView = useInView(contactRef);
  const partnersInView = useInView(partnersRef);
  const infoInView = useInView(infoRef);
  
  // Updated partners with better images
  const partners = [
    { 
      name: "Finance Plus", 
      logo: "https://images.unsplash.com/photo-1586076100131-32505c71d0d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
    },
    { 
      name: "BankSecure", 
      logo: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
    },
    { 
      name: "InvestGroup", 
      logo: "https://images.unsplash.com/photo-1598425237654-4fc758e50a93?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
    },
    { 
      name: "TechFinance", 
      logo: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 via-green-100 to-white dark:from-green-900/30 dark:via-gray-900 dark:to-gray-950 overflow-hidden relative">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[url('https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80')] bg-cover bg-fixed bg-center opacity-10"></div>
      
      {/* Content container with z-index to appear above background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
          <div className="container mx-auto p-4 flex items-center justify-between">
            <Logo size={isScrolled ? "sm" : "lg"} />
            
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
                    <NavigationMenuLink href="#partners" className={navigationMenuTriggerStyle()}>
                      Partenaires
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink href="#info" className={navigationMenuTriggerStyle()}>
                      Informations
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
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <nav className="flex flex-col gap-4 mt-8">
                    <a href="#about" className="text-lg font-medium py-2 hover:text-masroufi-primary">
                      À propos de nous
                    </a>
                    <a href="#partners" className="text-lg font-medium py-2 hover:text-masroufi-primary">
                      Partenaires
                    </a>
                    <a href="#info" className="text-lg font-medium py-2 hover:text-masroufi-primary">
                      Informations
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
          </div>
        </header>

        {/* Hero Section with improved animation */}
        <main className="pt-24 flex-1 container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 space-y-6 mb-12 md:mb-0">
            <div className="animate-fade-in opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Prenez le contrôle <br/>
                <span className="bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">de vos finances</span>
              </h1>
            </div>
            <div className="animate-fade-in opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Masroufi est votre compagnon financier personnel qui vous aide à suivre vos dépenses, 
                établir des budgets et atteindre vos objectifs financiers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in opacity-0" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
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

          <div className="md:w-1/2 flex justify-center animate-fade-in opacity-0" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
            <div className="relative w-full max-w-lg bg-white/30 dark:bg-black/20 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30 transform transition-all duration-500 hover:scale-105">
              <div className="flex flex-col items-center justify-center h-full gap-6">
                <img 
                  src="/lovable-uploads/cf8af45a-72bc-40af-8161-3bae1274fbfa.png" 
                  alt="Masroufi Logo" 
                  className="h-40 w-auto animate-pulse" 
                />
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
                  Budget Management
                </h2>
                
                {/* Interactive feature bubbles */}
                <div className="grid grid-cols-3 gap-3 w-full mt-4">
                  {['Tracking', 'Budgeting', 'Goals'].map((feature, i) => (
                    <div 
                      key={feature}
                      className="bg-white/40 dark:bg-gray-800/40 p-2 rounded-lg text-center text-sm font-medium transform hover:scale-105 transition-transform"
                      style={{ animationDelay: `${1.5 + i * 0.2}s` }}
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* About Section */}
        <section 
          id="about" 
          ref={aboutRef} 
          className={`py-16 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm transition-all duration-700 ${aboutInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">À propos de nous</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md transform transition-all hover:shadow-xl hover:-translate-y-1">
                <h3 className="text-xl font-semibold mb-3">Notre Mission</h3>
                <p>Aider chacun à atteindre l'indépendance financière grâce à des outils simples et intuitifs.</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md transform transition-all hover:shadow-xl hover:-translate-y-1">
                <h3 className="text-xl font-semibold mb-3">Notre Vision</h3>
                <p>Créer un monde où la gestion des finances personnelles est accessible et sans stress pour tous.</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md transform transition-all hover:shadow-xl hover:-translate-y-1">
                <h3 className="text-xl font-semibold mb-3">Nos Valeurs</h3>
                <p>Simplicité, transparence, sécurité et innovation au service de votre réussite financière.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Partners Section */}
        <section 
          id="partners" 
          ref={partnersRef}
          className={`py-16 bg-gradient-to-r from-green-50 to-white dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm transition-all duration-700 ${partnersInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center mb-10">
              <Users className="mr-2 text-masroufi-primary" size={28} />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">Nos Partenaires</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {partners.map((partner, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center justify-center bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md transition-all transform hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="w-32 h-32 mb-4 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                    <img src={partner.logo} alt={partner.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{partner.name}</h3>
                  <Button variant="link" className="flex items-center gap-1 text-masroufi-primary">
                    <Link size={14} /> Visiter
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Info Section */}
        <section 
          id="info" 
          ref={infoRef}
          className={`py-16 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm transition-all duration-700 ${infoInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center mb-10">
              <Info className="mr-2 text-masroufi-primary" size={28} />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">Informations</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Contactez Nous</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Phone className="mr-3 text-masroufi-primary" />
                    <div>
                      <p className="font-medium">Téléphone</p>
                      <p className="text-gray-600 dark:text-gray-300">+216 71 123 456</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="mr-3 text-masroufi-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600 dark:text-gray-300">contact@masroufi.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="mr-3 text-masroufi-primary" />
                    <div>
                      <p className="font-medium">Adresse</p>
                      <p className="text-gray-600 dark:text-gray-300">123 Rue Finance, Tunis 1002, Tunisie</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">À Propos de l'Application</h3>
                <div className="space-y-4">
                  <p><strong>Version:</strong> 2.0.1</p>
                  <p><strong>Plateformes:</strong> iOS, Android, Web</p>
                  <p><strong>Langues:</strong> Français, Anglais, Arabe</p>
                  <p><strong>Dernière mise à jour:</strong> Mai 2025</p>
                  <div className="flex mt-4">
                    <Button className="flex items-center gap-2 bg-masroufi-primary hover:bg-masroufi-primary/90">
                      <Download size={16} /> Télécharger
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section - Enhanced and more dynamic */}
        <section 
          id="contact" 
          ref={contactRef}
          className={`py-16 bg-gradient-to-r from-green-50 to-white dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm transition-all duration-700 ${contactInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">Contactez-nous</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg transform transition-all hover:shadow-xl">
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Nom</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-masroufi-primary focus:border-transparent" 
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-masroufi-primary focus:border-transparent" 
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                    <textarea 
                      id="message" 
                      rows={4} 
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-masroufi-primary focus:border-transparent" 
                      placeholder="Votre message..."
                    ></textarea>
                  </div>
                  <Button className="w-full bg-masroufi-primary hover:bg-masroufi-primary/90 transition-transform transform hover:scale-105">
                    Envoyer
                  </Button>
                </form>
              </div>
              
              {/* Map or office image */}
              <div className="rounded-lg overflow-hidden shadow-lg h-[400px]">
                <iframe 
                  title="Masroufi Location" 
                  className="w-full h-full border-0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d51136.39369137809!2d10.122897349999999!3d36.8064948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd337f5e7ef543%3A0xd671924e714a0275!2sTunis%2C%20Tunisie!5e0!3m2!1sfr!2sus!4v1684197025972!5m2!1sfr!2sus"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-white dark:bg-gray-900 py-6">
          <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <Logo size="md" />
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
