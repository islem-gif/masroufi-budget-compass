
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Logo from '@/components/common/Logo';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

interface RegisterFormProps {
  onRegistrationSuccess: (email: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegistrationSuccess }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs.",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Mots de passe différents",
        description: "Les mots de passe ne correspondent pas.",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Mot de passe trop court",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
      });
      return;
    }

    setIsLoading(true);
    console.log("Starting registration process for:", email);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          }
        }
      });

      if (error) {
        console.error("Registration error:", error);
        throw error;
      }

      if (data.user) {
        console.log("Registration successful for user:", data.user.id);
        onRegistrationSuccess(email);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = "Une erreur s'est produite lors de l'inscription.";
      
      if (error.message?.includes('User already registered')) {
        errorMessage = "Un compte avec cette adresse e-mail existe déjà.";
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = "Adresse e-mail invalide.";
      } else if (error.message?.includes('Password should be at least')) {
        errorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
      }
      
      toast({
        variant: "destructive",
        title: "Échec de l'inscription",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <Logo size="lg" variant="simple" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Rejoignez Masroufi
          </h1>
          <p className="text-gray-600 mt-2">
            Créez votre compte pour commencer
          </p>
        </div>

        {/* Registration Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-lg">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl font-semibold text-center text-gray-900">
              Inscription
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Remplissez vos informations pour créer votre compte
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    Prénom
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="firstName" 
                      type="text" 
                      placeholder="Jean" 
                      value={firstName} 
                      onChange={e => setFirstName(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pl-10 h-11 bg-white/70 border-gray-200 focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Nom
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="lastName" 
                      type="text" 
                      placeholder="Dupont" 
                      value={lastName} 
                      onChange={e => setLastName(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pl-10 h-11 bg-white/70 border-gray-200 focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Adresse e-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="votre@email.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10 h-11 bg-white/70 border-gray-200 focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10 pr-10 h-11 bg-white/70 border-gray-200 focus:border-primary focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10 pr-10 h-11 bg-white/70 border-gray-200 focus:border-primary focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium transition-all duration-200" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Création du compte...
                  </div>
                ) : (
                  'Créer mon compte'
                )}
              </Button>
              
              <div className="text-center text-sm text-gray-600">
                Vous avez déjà un compte?{" "}
                <button 
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-primary hover:text-primary/80 hover:underline font-medium"
                  disabled={isLoading}
                >
                  Se connecter
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          © 2024 Masroufi. Tous droits réservés.
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
