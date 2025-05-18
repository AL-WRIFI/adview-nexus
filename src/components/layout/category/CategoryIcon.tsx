
import React from 'react';

interface CategoryIconProps {
  iconName: string;    // Changed from 'name'
  iconPath: string;    // Changed from 'icon'
  className?: string;
}

export function CategoryIcon({ iconName, iconPath, className = '' }: CategoryIconProps) {
  // Default icon if no icon path is provided
  if (!iconPath) {
    // Return a generic icon based on category name
    return <div className={`${className} bg-primary/10 text-primary rounded-full flex items-center justify-center`}>
      {iconName?.charAt(0) || '?'}
    </div>;
  }
  
  // Try to render an icon from a path
  if (iconPath.startsWith('http')) {
    return <img src={iconPath} alt={iconName} className={className} />;
  }
  
  // If icon path is a CSS class (like tailwind icon or font awesome)
  return <div className={`${iconPath} ${className}`}></div>;
}
