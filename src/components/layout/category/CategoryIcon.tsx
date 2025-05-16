
import React from 'react';
import { Category } from '@/types';

export interface CategoryIconProps {
  iconName?: string;
  name?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  category?: Category;
  isSelected?: boolean;
  onClick?: () => void;
}

export function CategoryIcon({ 
  iconName, 
  name, 
  className = "", 
  size = "md",
  category,
  isSelected,
  onClick
}: CategoryIconProps) {
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

  // Use category icon if provided via category prop
  const icon = category?.icon || iconName;
  const displayName = category?.name || name;
  
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gray-100 dark:bg-dark-muted ${sizeClasses[size]} ${className} ${
        isSelected ? 'border-2 border-brand' : ''
      }`}
      onClick={onClick}
    >
      {icon ? (
        <img 
          src={icon}
          alt={displayName || "category icon"}
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
