
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

interface EmailVerificationSuccessProps {
  email: string;
}

const EmailVerificationSuccess: React.FC<EmailVerificationSuccessProps> = ({ email }) => {
  const navigate = useNavigate();
  
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
};

export default EmailVerificationSuccess;
