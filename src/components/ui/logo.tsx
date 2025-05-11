
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  withText?: boolean;
}

export function Logo({ className, withText = true }: LogoProps) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)}>
      <div className="relative w-10 h-10 overflow-hidden bg-gradient-to-r from-brand to-brand-dark rounded-lg">
        <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">مكس</span>
      </div>
      {withText && (
        <div className="text-xl font-bold bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent dark:from-brand-light dark:to-brand">
          مكس سوريا
        </div>
      )}
    </Link>
  );
}
