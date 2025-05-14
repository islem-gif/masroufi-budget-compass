
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMasroufi } from '@/lib/MasroufiContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Logo from '@/components/common/Logo';
import { AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { loginUser } = useMasroufi();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/dashboard');
      }
    };
    
    checkSession();
  }, [navigate]);

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

  const handleResetPassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!resetMode) {
      setResetMode(true);
      return;
    }

    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: "E-mail requis",
        description: "Veuillez entrer votre adresse e-mail pour réinitialiser votre mot de passe.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setResetEmailSent(true);
      toast({
        title: "E-mail de réinitialisation envoyé",
        description: "Veuillez vérifier votre boîte de réception.",
      });
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      toast({
        variant: "destructive",
        title: "Échec de la réinitialisation",
        description: "Impossible d'envoyer l'e-mail de réinitialisation. Veuillez réessayer plus tard.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelResetPassword = () => {
    setResetMode(false);
  };

  // Affichage du formulaire de réinitialisation du mot de passe
  if (resetMode) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 p-4">
        <div className="w-full max-w-md space-y-8 backdrop-blur-lg bg-white/30 p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Logo size="lg" variant="simple" />
            </div>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">Réinitialisation du mot de passe</CardTitle>
              <CardDescription className="text-center">
                {resetEmailSent 
                  ? "Un email de réinitialisation a été envoyé." 
                  : "Entrez votre adresse e-mail pour recevoir un lien de réinitialisation"}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleResetPassword}>
              <CardContent className="space-y-4">
                {resetEmailSent ? (
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-green-800">Veuillez vérifier votre boîte de réception et cliquer sur le lien de réinitialisation.</p>
                  </div>
                ) : (
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
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                {!resetEmailSent && (
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
                  </Button>
                )}
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={cancelResetPassword}
                >
                  Retour à la connexion
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 p-4">
      <div className="w-full max-w-md space-y-8 backdrop-blur-lg bg-white/30 p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Logo size="lg" variant="simple" />
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Connexion</CardTitle>
            <CardDescription className="text-center">Accédez à votre tableau de bord</CardDescription>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <button 
                    type="button" 
                    onClick={handleResetPassword} 
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Mot de passe oublié?
                  </button>
                </div>
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
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" 
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
