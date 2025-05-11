
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'simple';
}

const Logo = ({ size = 'md', variant = 'default' }: LogoProps) => {
  const sizeClasses = {
    sm: {
      container: 'w-8 h-8',
      text: 'text-lg',
      fullText: 'text-lg'
    },
    md: {
      container: 'w-10 h-10',
      text: 'text-xl',
      fullText: 'text-2xl'
    },
    lg: {
      container: 'w-12 h-12',
      text: 'text-2xl',
      fullText: 'text-3xl'
    }
  };

  if (variant === 'simple') {
    return (
      <div className={`${sizeClasses[size].container} bg-masroufi-primary rounded-full flex items-center justify-center`}>
        <span className={`${sizeClasses[size].text} text-white font-bold`}>M</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={`${sizeClasses[size].container} bg-masroufi-primary rounded-full flex items-center justify-center`}>
        <span className={`${sizeClasses[size].text} text-white font-bold`}>M</span>
      </div>
      <h1 className={`${sizeClasses[size].fullText} font-bold text-masroufi-primary`}>Masroufi</h1>
    </div>
  );
};

export default Logo;
