
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Grid3X3, List, Search, ChevronRight } from 'lucide-react';
import { useCategories } from '@/hooks/use-api';
import { Category } from '@/types';
import { cn } from '@/lib/utils';
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

interface ModernCategoryMegaMenuProps {
  trigger?: React.ReactNode;
}

export function ModernCategoryMegaMenu({ trigger }: ModernCategoryMegaMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const { data: categories = [], isLoading } = useCategories();
  
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const CategoryIcon = ({ category }: { category: Category }) => {
    const iconName = category.icon || 'Car';
    const Icon = iconMap[iconName] || Car;
    return <Icon className="h-6 w-6" />;
  };

  const CategoryGridView = ({ categories }: { categories: Category[] }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/category/${category.id}`}
          className="group flex flex-col items-center p-4 rounded-xl border border-border hover:border-brand/50 hover:shadow-md transition-all duration-200"
        >
          <div className="p-3 rounded-xl bg-brand/10 group-hover:bg-brand/20 transition-colors mb-3">
            <CategoryIcon category={category} />
          </div>
          <span className="text-sm font-medium text-center leading-tight">
            {category.name}
          </span>
          {category.subcategories && category.subcategories.length > 0 && (
            <Badge variant="secondary" className="mt-2 text-xs">
              {category.subcategories.length}
            </Badge>
          )}
        </Link>
      ))}
    </div>
  );

  const CategoryListView = ({ categories }: { categories: Category[] }) => (
    <div className="space-y-2">
      {categories.map((category) => (
        <div key={category.id} className="border border-border rounded-lg overflow-hidden">
          <Link
            to={`/category/${category.id}`}
            className="flex items-center justify-between p-4 hover:bg-accent transition-colors"
            onClick={() => setSelectedCategory(selectedCategory?.id === category.id ? null : category)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand/10">
                <CategoryIcon category={category} />
              </div>
              <div>
                <h3 className="font-medium">{category.name}</h3>
                {category.subcategories && category.subcategories.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {category.subcategories.length} تصنيف فرعي
                  </p>
                )}
              </div>
            </div>
            {category.subcategories && category.subcategories.length > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </Link>
          
          {selectedCategory?.id === category.id && category.subcategories && (
            <div className="bg-accent/30 border-t border-border p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {category.subcategories.map((subcat) => (
                  <Link
                    key={subcat.id}
                    to={`/category/${category.id}?subcategory=${subcat.id}`}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-background transition-colors"
                  >
                    <span className="text-sm">{subcat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            كل التصنيفات
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[80vh] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">جميع التصنيفات</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search and View Controls */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في التصنيفات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 bg-background border-border"
              />
            </div>
            
            <div className="flex border rounded-lg overflow-hidden bg-background">
              <Button
                variant={viewMode === 'grid' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Categories Display */}
          <ScrollArea className="h-[60vh]">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-muted-foreground">جاري تحميل التصنيفات...</div>
              </div>
            ) : filteredCategories.length > 0 ? (
              viewMode === 'grid' ? (
                <CategoryGridView categories={filteredCategories} />
              ) : (
                <CategoryListView categories={filteredCategories} />
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>لم يتم العثور على تصنيفات</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
