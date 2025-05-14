
import React, { useState } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import EmailVerificationSuccess from '@/components/auth/EmailVerificationSuccess';

const Register = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleRegistrationSuccess = (email: string) => {
    setRegisteredEmail(email);
    setEmailSent(true);
  };

  return emailSent 
    ? <EmailVerificationSuccess email={registeredEmail} /> 
    : <RegisterForm onRegistrationSuccess={handleRegistrationSuccess} />;
};

export default Register;
