
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Grid3X3, Search, ChevronDown, ChevronRight } from 'lucide-react';
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

interface MobileCategorySheetProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MobileCategorySheet({ trigger, open, onOpenChange }: MobileCategorySheetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategories, setOpenCategories] = useState<Set<number>>(new Set());
  
  const { data: categories = [], isLoading } = useCategories();
  
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCategory = (categoryId: number) => {
    setOpenCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const CategoryIcon = ({ category }: { category: Category }) => {
    const iconName = category.icon || 'Car';
    const Icon = iconMap[iconName] || Car;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            التصنيفات
          </Button>
        )}
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-full sm:w-96 bg-background border-border overflow-hidden"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl font-bold">التصنيفات</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-4 h-full flex flex-col">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في التصنيفات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-background border-border"
            />
          </div>

          {/* Categories List */}
          <ScrollArea className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-muted-foreground">جاري تحميل التصنيفات...</div>
              </div>
            ) : filteredCategories.length > 0 ? (
              <div className="space-y-2">
                {filteredCategories.map((category) => (
                  <Collapsible
                    key={category.id}
                    open={openCategories.has(category.id)}
                    onOpenChange={() => toggleCategory(category.id)}
                  >
                    <div className="border border-border rounded-lg overflow-hidden">
                      <CollapsibleTrigger asChild>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-brand/10">
                              <CategoryIcon category={category} />
                            </div>
                            <div className="text-left">
                              <h3 className="font-medium">{category.name}</h3>
                              {category.subcategories && category.subcategories.length > 0 && (
                                <p className="text-sm text-muted-foreground">
                                  {category.subcategories.length} تصنيف فرعي
                                </p>
                              )}
                            </div>
                          </div>
                          {category.subcategories && category.subcategories.length > 0 ? (
                            <ChevronDown 
                              className={cn(
                                "h-4 w-4 text-muted-foreground transition-transform",
                                openCategories.has(category.id) && "rotate-180"
                              )} 
                            />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <div className="bg-accent/30 border-t border-border">
                          {/* Main Category Link */}
                          <Link
                            to={`/category/${category.id}`}
                            className="block p-3 hover:bg-background transition-colors border-b border-border/50"
                            onClick={() => onOpenChange?.(false)}
                          >
                            <span className="text-sm font-medium">كل {category.name}</span>
                          </Link>
                          
                          {/* Subcategories */}
                          {category.subcategories && category.subcategories.length > 0 && (
                            <div className="p-2 space-y-1">
                              {category.subcategories.map((subcat) => (
                                <Link
                                  key={subcat.id}
                                  to={`/category/${category.id}?subcategory=${subcat.id}`}
                                  className="block p-2 rounded-md hover:bg-background transition-colors"
                                  onClick={() => onOpenChange?.(false)}
                                >
                                  <span className="text-sm">{subcat.name}</span>
                                  {subcat.children && subcat.children.length > 0 && (
                                    <Badge variant="secondary" className="mr-2 text-xs">
                                      {subcat.children.length}
                                    </Badge>
                                  )}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>لم يتم العثور على تصنيفات</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
