
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MobilePagination } from './MobilePagination';
import { categoriesData } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function MobileCategoryBar() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(categoriesData.length / itemsPerPage);
  
  const scrollToPage = (page: number) => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      const scrollAmount = containerWidth * (page - 1);
      
      scrollContainerRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
      
      setCurrentPage(page);
    }
  };
  
  const scrollPrev = () => {
    if (currentPage > 1) {
      scrollToPage(currentPage - 1);
    }
  };
  
  const scrollNext = () => {
    if (currentPage < totalPages) {
      scrollToPage(currentPage + 1);
    }
  };

  return (
    <div className="relative mb-4 md:hidden bg-white dark:bg-dark-background">
      <div className="flex items-center px-2 py-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-8 h-8 rounded-full flex-shrink-0 mr-1 dark:hover:bg-dark-surface dark:text-gray-300"
          onClick={scrollPrev}
          disabled={currentPage === 1}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">السابق</span>
        </Button>
        
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-hidden"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div 
            className="flex"
            style={{
              width: `${totalPages * 100}%`,
              transform: `translateX(${((totalPages - currentPage) / totalPages) * 100}%)`,
              transition: 'transform 0.3s ease-out',
            }}
          >
            {categoriesData.map((category) => (
              <Link 
                key={category.id} 
                to={`/category/${category.id}`}
                className={cn(
                  "flex-1 min-w-0 flex flex-col items-center px-2",
                  "hover:text-primary transition-colors dark:hover:text-primary"
                )}
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 mb-1 dark:bg-dark-muted">
                  <img 
                    src={category.icon || `/icons/categories/${category.name.toLowerCase()}.svg`}
                    alt={category.name}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/icons/category-fallback.svg";
                    }}
                  />
                </div>
                <span className="text-xs text-center truncate w-full dark:text-gray-300">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-8 h-8 rounded-full flex-shrink-0 ml-1 dark:hover:bg-dark-surface dark:text-gray-300"
          onClick={scrollNext}
          disabled={currentPage === totalPages}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">التالي</span>
        </Button>
      </div>
      
      <MobilePagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onChange={scrollToPage}
      />
    </div>
  );
}
