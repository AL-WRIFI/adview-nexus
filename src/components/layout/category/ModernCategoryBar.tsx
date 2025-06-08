
import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useCategories } from '@/hooks/use-api';
import { Category } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Grid3X3 } from 'lucide-react';
import { ModernCategoryMegaMenu } from './ModernCategoryMegaMenu';
import {
  Car, Home, Smartphone, Mouse, Briefcase, Wrench, Shirt, Gamepad,
  Gem, ShoppingBag, Utensils, Laptop, BookOpen, Baby, Bike, Camera, FileText,
  Headphones, Gift, Train
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  'Car': Car, 'Home': Home, 'Smartphone': Smartphone, 'Mouse': Mouse,
  'Briefcase': Briefcase, 'Wrench': Wrench, 'Shirt': Shirt, 'Gamepad': Gamepad,
  'Gem': Gem, 'ShoppingBag': ShoppingBag, 'Utensils': Utensils, 'Laptop': Laptop,
  'BookOpen': BookOpen, 'Baby': Baby, 'Bike': Bike, 'Camera': Camera,
  'FileText': FileText, 'Headphones': Headphones, 'Gift': Gift, 'Train': Train
};

export function ModernCategoryBar() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const params = useParams<{ categoryId: string }>();
  const [searchParams] = useSearchParams();
  
  const categoryIdFromUrl = params.categoryId ? parseInt(params.categoryId, 10) : null;
  const subcategoryIdFromUrl = searchParams.get('subcategory') ? parseInt(searchParams.get('subcategory')!, 10) : null;
  const childCategoryIdFromUrl = searchParams.get('childcategory') ? parseInt(searchParams.get('childcategory')!, 10) : null;

  const [selectedCategory, setSelectedCategory] = useState<number | null>(categoryIdFromUrl);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(subcategoryIdFromUrl);
  const [selectedChildCategory, setSelectedChildCategory] = useState<number | null>(childCategoryIdFromUrl);

  const { data: categories, isLoading: loadingCategories } = useCategories();

  const handleCategorySelect = (category: Category) => {
    if (selectedCategory === category.id) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSelectedChildCategory(null);
      navigate('/');
    } else {
      setSelectedCategory(category.id);
      setSelectedSubcategory(null);
      setSelectedChildCategory(null);
      navigate(`/category/${category.id}`);
    }
  };

  const handleSubcategorySelect = (subcategoryId: number) => {
    if (selectedSubcategory === subcategoryId) {
      setSelectedSubcategory(null);
      setSelectedChildCategory(null);
      navigate(`/category/${selectedCategory}`);
    } else {
      setSelectedSubcategory(subcategoryId);
      setSelectedChildCategory(null);
      navigate(`/category/${selectedCategory}?subcategory=${subcategoryId}`);
    }
  };

  const handleChildCategorySelect = (childCategoryId: number) => {
    if (selectedChildCategory === childCategoryId) {
      setSelectedChildCategory(null);
      navigate(`/category/${selectedCategory}?subcategory=${selectedSubcategory}`);
    } else {
      setSelectedChildCategory(childCategoryId);
      navigate(`/category/${selectedCategory}?subcategory=${selectedSubcategory}&childcategory=${childCategoryId}`);
    }
  };

  const subcategories = selectedCategory && categories
    ? categories.find(cat => cat.id === selectedCategory)?.subcategories || []
    : [];

  const childCategories = selectedSubcategory && subcategories
    ? subcategories.find(sub => sub.id === selectedSubcategory)?.children || []
    : [];

  // Don't show on mobile - it will be handled by MobileNav
  if (isMobile) {
    return null;
  }

  const CategoryItem = ({ category, isSelected }: { category: Category; isSelected: boolean }) => {
    const iconName = category.icon || 'Car';
    const Icon = iconMap[iconName] || Car;

    return (
      <div className="flex flex-col items-center min-w-0">
        <button
          onClick={() => handleCategorySelect(category)}
          className={cn(
            "group relative flex flex-col items-center p-3 rounded-2xl transition-all duration-200 min-w-[80px] border",
            isSelected 
              ? "bg-brand text-white shadow-lg scale-105 border-brand" 
              : "bg-background hover:bg-accent hover:shadow-md border-border hover:border-brand/50"
          )}
        >
          <div className={cn(
            "p-3 rounded-xl mb-2 transition-colors border",
            isSelected 
              ? "bg-white/20 border-white/30" 
              : "bg-brand/10 group-hover:bg-brand/20 border-brand/20 group-hover:border-brand/40"
          )}>
            <Icon className={cn(
              "h-6 w-6 transition-colors",
              isSelected ? "text-white" : "text-brand"
            )} />
          </div>
          <span className={cn(
            "text-xs font-medium text-center leading-tight max-w-[60px] truncate",
            isSelected ? "text-white" : "text-foreground"
          )}>
            {category.name}
          </span>
          {isSelected && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full" />
          )}
        </button>
      </div>
    );
  };

  const SubCategoryChip = ({ item, isSelected, onClick, level }: { 
    item: any; 
    isSelected: boolean; 
    onClick: () => void;
    level: 'sub' | 'child';
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border",
        isSelected
          ? "bg-brand text-white shadow-md border-brand"
          : level === 'child'
          ? "bg-background hover:bg-accent text-foreground border-border hover:border-brand/50"
          : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border-border hover:border-brand/50"
      )}
    >
      {item.name}
      {item.subcategories && item.subcategories.length > 0 && (
        <Badge variant="secondary" className="mr-2 h-4 text-xs">
          {item.subcategories.length}
        </Badge>
      )}
    </button>
  );

  if (loadingCategories) {
    return (
      <div className="bg-background border-b border-border shadow-sm">
        <div className="container px-4 mx-auto py-4">
          <div className="flex items-center justify-center h-20">
            <div className="text-muted-foreground">جاري تحميل التصنيفات...</div>
          </div>
        </div>
      </div>
    );
  }

  const displayCategories = categories?.slice(0, 8) || [];

  return (
    <div className="bg-background border-b border-border shadow-sm">
      {/* Main Categories */}
      <div className="container px-4 mx-auto py-4">
        <div className="flex items-center justify-between">
          <ScrollArea className="flex-1">
            <div className="flex gap-4 pb-2">
              {displayCategories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  isSelected={selectedCategory === category.id}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          
          {/* All Categories Button */}
          <div className="mr-4">
            <ModernCategoryMegaMenu 
              trigger={
                <Button variant="outline" className="flex items-center gap-2 bg-background border-border hover:border-brand/50">
                  <Grid3X3 className="h-4 w-4" />
                  كل التصنيفات
                </Button>
              }
            />
          </div>
        </div>
      </div>

      {/* Subcategories */}
      {selectedCategory && subcategories.length > 0 && (
        <div className="bg-accent/30 border-t border-border">
          <div className="container px-4 mx-auto py-3">
            <ScrollArea>
              <div className="flex gap-2 pb-2">
                {subcategories.map((subcategory) => (
                  <SubCategoryChip
                    key={subcategory.id}
                    item={subcategory}
                    isSelected={selectedSubcategory === subcategory.id}
                    onClick={() => handleSubcategorySelect(subcategory.id)}
                    level="sub"
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Child Categories */}
      {selectedSubcategory && childCategories.length > 0 && (
        <div className="bg-accent/50 border-t border-border">
          <div className="container px-4 mx-auto py-3">
            <ScrollArea>
              <div className="flex gap-2 pb-2">
                {childCategories.map((childCategory) => (
                  <SubCategoryChip
                    key={childCategory.id}
                    item={childCategory}
                    isSelected={selectedChildCategory === childCategory.id}
                    onClick={() => handleChildCategorySelect(childCategory.id)}
                    level="child"
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
