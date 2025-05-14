
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Logo from '@/components/common/Logo';
import { ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetMode, setResetMode] = useState<'request' | 'update'>('request');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if we have a hash which would indicate we're in the password update flow
  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      setResetMode('update');
    }
  }, []);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email) {
        throw new Error("L'email est requis");
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Email envoyé",
        description: "Vérifiez votre email pour les instructions de réinitialisation du mot de passe.",
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

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (newPassword !== confirmPassword) {
        throw new Error("Les mots de passe ne correspondent pas");
      }

      if (newPassword.length < 6) {
        throw new Error("Le mot de passe doit contenir au moins 6 caractères");
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été réinitialisé avec succès.",
      });

      // Redirect to login page after successful password reset
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      console.error('Update password error:', error);
      toast({
        variant: "destructive",
        title: "Échec de la mise à jour",
        description: error.message || "Une erreur s'est produite. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-teal-400 to-blue-500 p-4">
      <div className="w-full max-w-md space-y-8 backdrop-blur-lg bg-white/30 p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" variant="simple" />
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-none shadow-lg">
          <CardHeader>
            <Button 
              variant="ghost" 
              className="w-fit p-0 h-auto mb-4" 
              onClick={() => navigate('/login')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Retour à la connexion
            </Button>
            <CardTitle>
              {resetMode === 'request' 
                ? 'Réinitialisation de mot de passe' 
                : 'Créer un nouveau mot de passe'}
            </CardTitle>
            <CardDescription>
              {resetMode === 'request' 
                ? 'Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.' 
                : 'Entrez votre nouveau mot de passe.'}
            </CardDescription>
          </CardHeader>
          
          {resetMode === 'request' ? (
            <form onSubmit={handleRequestReset}>
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
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Envoi en cours...' : 'Envoyer les instructions'}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={handleUpdatePassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    placeholder="••••••••" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    className="bg-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmez le mot de passe</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="••••••••" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className="bg-white/70"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Mise à jour en cours...' : 'Mettre à jour le mot de passe'}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
