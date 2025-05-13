
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMasroufi } from '@/lib/MasroufiContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useMasroufi();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Connecter avec Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Si la connexion est réussie, connecter l'utilisateur localement aussi
      if (data.user) {
        loginUser(email, password);
        
        toast({
          title: "Connexion réussie!",
          description: "Bienvenue sur Masroufi.",
        });
        
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = "Veuillez vérifier vos identifiants et réessayer.";
      
      // Messages d'erreur plus spécifiques
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "E-mail ou mot de passe incorrect.";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Veuillez confirmer votre e-mail avant de vous connecter.";
      }
      
      toast({
        variant: "destructive",
        title: "Échec de la connexion",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "E-mail requis",
        description: "Veuillez entrer votre adresse e-mail pour réinitialiser votre mot de passe.",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "E-mail envoyé",
        description: "Vérifiez votre e-mail pour les instructions de réinitialisation du mot de passe.",
      });
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast({
        variant: "destructive",
        title: "Échec de la réinitialisation",
        description: error.message || "Une erreur s'est produite. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-masroufi-primary">Masroufi</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Votre compas budgétaire personnel</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connectez-vous à votre compte</CardTitle>
            <CardDescription>Entrez votre e-mail et mot de passe pour accéder à votre tableau de bord</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="votre@email.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="text-sm text-right">
                <button 
                  type="button" 
                  onClick={handleResetPassword} 
                  className="text-masroufi-secondary hover:underline"
                >
                  Mot de passe oublié?
                </button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-masroufi-primary hover:bg-masroufi-primary/90" 
                disabled={isLoading}
              >
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
              <div className="text-center text-sm">
                Vous n'avez pas de compte?{" "}
                <a 
                  href="/register" 
                  className="text-masroufi-secondary hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/register');
                  }}
                >
                  S'inscrire
                </a>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
