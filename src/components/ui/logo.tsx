
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
      <div className="relative">
        <span className="text-xl font-bold text-white">حراج</span>
      </div>
      {withText && (
        <div className="text-xl font-bold text-white">
          مكس سوريا
        </div>
      )}
    </Link>
  );
}
