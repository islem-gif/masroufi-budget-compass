
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMasroufi } from '@/lib/MasroufiContext';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Logo from '@/components/common/Logo';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { registerUser } = useMasroufi();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Les mots de passe ne correspondent pas",
        description: "Veuillez vous assurer que vos mots de passe correspondent.",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      console.log("Attempting to register with:", email, firstName, lastName);
      // Connecter avec Supabase pour l'inscription
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone || null
          },
          emailRedirectTo: `${window.location.origin}/login`
        }
      });
      
      if (error) throw error;
      
      console.log("Registration successful, user data:", data.user);

      // Si l'inscription est réussie, enregistrer l'utilisateur localement aussi
      if (data.user) {
        await registerUser(email, password, firstName, lastName);
      }
      
      // Définir emailSent à true pour afficher le message de succès
      setEmailSent(true);
      
      toast({
        title: "Inscription réussie!",
        description: "Veuillez vérifier votre e-mail pour confirmer votre compte.",
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = "Veuillez vérifier vos informations et réessayer.";
      
      // Messages d'erreur plus spécifiques basés sur le code d'erreur de Supabase
      if (error.message?.includes('email') || error.message?.includes('Email')) {
        errorMessage = "Cet e-mail est déjà utilisé ou n'est pas valide.";
      } else if (error.message?.includes('password')) {
        errorMessage = "Le mot de passe doit comporter au moins 6 caractères.";
      }
      
      toast({
        variant: "destructive",
        title: "Échec de l'inscription",
        description: errorMessage,
      });
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mx-auto rounded-full bg-green-100 p-3 mb-4">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-center">Vérifiez votre e-mail</CardTitle>
            <CardDescription className="text-center">
              Nous avons envoyé un e-mail de vérification à <span className="font-medium">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>Veuillez vérifier votre boîte de réception et cliquer sur le lien de vérification pour compléter votre inscription.</p>
            <p className="mt-2">Si vous ne voyez pas l'e-mail, vérifiez votre dossier spam.</p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              onClick={() => navigate('/login')}
              className="w-full"
              variant="outline"
            >
              Retour à la connexion
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-400 to-purple-500 p-4">
      <div className="w-full max-w-md space-y-8 backdrop-blur-lg bg-white/30 p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Logo size="lg" variant="simple" />
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Créer un compte</CardTitle>
            <CardDescription className="text-center">Entrez vos informations pour commencer</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input 
                    id="firstName" 
                    value={firstName} 
                    onChange={e => setFirstName(e.target.value)}
                    required
                    className="bg-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input 
                    id="lastName" 
                    value={lastName} 
                    onChange={e => setLastName(e.target.value)}
                    required
                    className="bg-white/70"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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
                <Label htmlFor="phone">Téléphone (optionnel)</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="+21600000000" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)}
                  className="bg-white/70"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="bg-white/70"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className="bg-white/70"
                />
              </div>
              
              <div className="text-sm text-muted-foreground">
                En vous inscrivant, vous acceptez nos conditions d'utilisation. Un e-mail de vérification sera envoyé pour confirmer votre compte.
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700" 
                disabled={isLoading}
              >
                {isLoading ? 'Création en cours...' : 'Créer un compte'}
              </Button>
              <div className="text-center text-sm">
                Vous avez déjà un compte?{" "}
                <a 
                  href="/login" 
                  className="text-blue-600 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/login');
                  }}
                >
                  Se connecter
                </a>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
