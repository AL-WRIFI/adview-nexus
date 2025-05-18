
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10'
  };
  
  const sizeClass = sizes[size];
  
  return (
    <div className="flex items-center">
      <img src="/logo.svg" alt="Logo" className={`${sizeClass} mr-2`} />
      <span className={`font-bold ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'} text-brand`}>
        مكس سوريا
      </span>
    </div>
  );
}
