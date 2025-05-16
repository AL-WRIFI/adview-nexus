
import React from 'react';
import { 
  Car, Home, Smartphone, Mouse, Briefcase, Wrench, Shirt, Gamepad, 
  Gem, ShoppingBag, Utensils, Laptop, BookOpen, Baby, Bike, Camera, 
  FileText, Headphones, Gift, Train, Sofa, MonitorSmartphone, Dog, Users, Building, 
  Paintbrush, Wallet, Glasses, ShoppingBasket
} from 'lucide-react';
import { Category } from '@/types';

interface CategoryIconProps {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
}

// Improved icon map
const iconMap: Record<string, React.ComponentType<any>> = {
  'Car': Car,
  'Home': Home,
  'Building': Building,
  'Smartphone': Smartphone,
  'MonitorSmartphone': MonitorSmartphone,
  'Mouse': Mouse,
  'Briefcase': Briefcase,
  'Wrench': Wrench,
  'Shirt': Shirt,
  'Gamepad': Gamepad,
  'Gem': Gem,
  'ShoppingBag': ShoppingBag,
  'Utensils': Utensils,
  'Laptop': Laptop,
  'BookOpen': BookOpen,
  'Baby': Baby,
  'Bike': Bike,
  'Camera': Camera,
  'FileText': FileText,
  'Headphones': Headphones,
  'Gift': Gift,
  'Train': Train,
  'Sofa': Sofa,
  'Dog': Dog,
  'Users': Users,
  'Paintbrush': Paintbrush,
  'Wallet': Wallet,
  'Glasses': Glasses,
  'ShoppingBasket': ShoppingBasket,
};

export function CategoryIcon({ category, isSelected, onClick, size = 'md' }: CategoryIconProps) {
  const iconName = category.icon || 'Car';
  const Icon = iconMap[iconName] || Car;
  
  // Different sizes based on requested size
  const sizes = {
    sm: {
      container: "min-w-[80px]", // Made smaller for mobile
      icon: "p-2 h-10 w-10",
      iconSize: "h-5 w-5",
      text: "text-xs mt-1"
    },
    md: {
      container: "min-w-[85px]",
      icon: "p-3 h-12 w-12",
      iconSize: "h-6 w-6",
      text: "text-sm mt-2"
    },
    lg: {
      container: "min-w-[100px]",
      icon: "p-4 h-16 w-16",
      iconSize: "h-8 w-8",
      text: "text-base mt-2"
    }
  };
  
  const currentSize = sizes[size];
  
  return (
    <div
      className={`category-icon min-h-[80px] flex flex-col items-center justify-center ${currentSize.container} cursor-pointer transition-all`}
      onClick={onClick}
    >
      <div 
        className={`${currentSize.icon} flex items-center justify-center rounded-full mx-auto mb-1
          ${isSelected 
            ? 'bg-brand shadow-md' 
            : 'bg-gray-100 dark:bg-dark-card'}`
        }
      >
        <Icon className={`${currentSize.iconSize} ${isSelected ? 'text-white' : 'text-brand dark:text-brand'}`} />
      </div>
      <span 
        className={`${currentSize.text} truncate block text-center w-full
          ${isSelected ? 'text-brand font-bold' : 'text-gray-700 dark:text-gray-300'}`}
      >
        {category.name}
      </span>
    </div>
  );
}
