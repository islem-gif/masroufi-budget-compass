import React from 'react';
interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'simple';
}
const Logo = ({
  size = 'md',
  variant = 'default'
}: LogoProps) => {
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
      container: 'w-16 h-16',
      text: 'text-2xl',
      fullText: 'text-4xl'
    }
  };
  if (variant === 'simple') {
    return <div className={`${sizeClasses[size].container} flex items-center justify-center`}>
        <img src="/lovable-uploads/d75e54f2-79d1-4cf3-8787-8f9c4f14b7df.png" alt="Masroufi Logo" className="h-full w-auto" />
      </div>;
  }
  return <div className="flex items-center space-x-2">
      <div className={`${sizeClasses[size].container} flex items-center justify-center`}>
        
      </div>
      <div>
        
      </div>
    </div>;
};
export default Logo;