
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMasroufi } from '@/lib/MasroufiContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Logo from '@/components/common/Logo';

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
      console.log("Attempting to login with:", email);
      // Connect with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Supabase login error:", error);
        throw error;
      }
      
      console.log("Login successful, user data:", data.user);
      
      // If login is successful, also login the user locally
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
      
      // More specific error messages
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

  const handleResetPassword = () => {
    navigate('/reset-password');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <div className="w-full max-w-md space-y-8 backdrop-blur-lg bg-white/30 p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" variant="simple" />
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Connectez-vous à votre compte</CardTitle>
            <CardDescription className="text-center">Entrez votre e-mail et mot de passe pour accéder à votre tableau de bord</CardDescription>
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
                  className="bg-white/70"
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
                  className="bg-white/70"
                />
              </div>
              <div className="text-sm text-right">
                <button 
                  type="button" 
                  onClick={handleResetPassword} 
                  className="text-blue-600 hover:underline"
                >
                  Mot de passe oublié?
                </button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700" 
                disabled={isLoading}
              >
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
              <div className="text-center text-sm">
                Vous n'avez pas de compte?{" "}
                <a 
                  href="/register" 
                  className="text-blue-600 hover:underline"
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
