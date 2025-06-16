
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Logo from '@/components/common/Logo';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetMode, setResetMode] = useState<'request' | 'update' | 'success'>('request');
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

      setResetMode('success');
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

  const renderContent = () => {
    if (resetMode === 'success') {
      return (
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Email envoyé !</h3>
            <p className="text-gray-600">
              Nous avons envoyé un lien de réinitialisation à <span className="font-medium">{email}</span>
            </p>
            <p className="text-sm text-gray-500">
              Vérifiez votre boîte de réception et cliquez sur le lien pour réinitialiser votre mot de passe.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/login')}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            Retour à la connexion
          </Button>
        </div>
      );
    }

    if (resetMode === 'update') {
      return (
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
              Nouveau mot de passe
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                id="newPassword" 
                type={showPassword ? "text" : "password"}
                placeholder="Entrez votre nouveau mot de passe" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)}
                required
                className="pl-10 pr-10 h-11 bg-white/70 border-gray-200 focus:border-primary focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirmez le mot de passe
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                id="confirmPassword" 
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmez votre nouveau mot de passe" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="pl-10 pr-10 h-11 bg-white/70 border-gray-200 focus:border-primary focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Mise à jour en cours...
              </div>
            ) : (
              'Mettre à jour le mot de passe'
            )}
          </Button>
        </form>
      );
    }

    return (
      <form onSubmit={handleRequestReset} className="space-y-4">
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
              className="pl-10 h-11 bg-white/70 border-gray-200 focus:border-primary focus:ring-primary"
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Envoi en cours...
            </div>
          ) : (
            'Envoyer les instructions'
          )}
        </Button>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <Logo size="lg" variant="simple" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            {resetMode === 'update' ? 'Nouveau mot de passe' : 'Réinitialisation'}
          </h1>
          <p className="text-gray-600 mt-2">
            {resetMode === 'update' 
              ? 'Créez un nouveau mot de passe sécurisé'
              : 'Récupérez l\'accès à votre compte'
            }
          </p>
        </div>

        {/* Reset Password Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-lg">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center gap-3 mb-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/login')}
                className="p-2 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {resetMode === 'update' 
                    ? 'Nouveau mot de passe' 
                    : resetMode === 'success'
                    ? 'Email envoyé'
                    : 'Mot de passe oublié'
                  }
                </CardTitle>
                {resetMode === 'request' && (
                  <CardDescription className="text-gray-600 mt-1">
                    Entrez votre adresse e-mail pour recevoir un lien de réinitialisation
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          © 2024 Masroufi. Tous droits réservés.
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
