
import React from 'react';

export interface CategoryIconProps {
  iconName?: string;
  name?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CategoryIcon({ iconName, name, className = "", size = "md" }: CategoryIconProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };
  
  const iconSize = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };
  
  return (
    <div className={`flex items-center justify-center rounded-full bg-gray-100 dark:bg-dark-muted ${sizeClasses[size]} ${className}`}>
      {iconName ? (
        <img 
          src={iconName}
          alt={name || "category icon"}
          className={`object-contain ${iconSize[size]}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/icons/category-fallback.svg";
          }}
        />
      ) : (
        <span className={`${iconSize[size]} text-muted-foreground dark:text-gray-400`}>?</span>
      )}
    </div>
  );
}
