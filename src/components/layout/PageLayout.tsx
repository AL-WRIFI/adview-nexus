
import React from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { MobileNav } from './mobile-nav';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  showFooter?: boolean;
  isLoading?: boolean;
  showSkeleton?: boolean;
}

export function PageLayout({ 
  children, 
  className = "", 
  showFooter = true,
  isLoading = false,
  showSkeleton = false
}: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Fixed Header */}
      <Header />
      
      {/* Main content with proper top padding to avoid header overlap */}
      <main className={`flex-1 pt-20 pb-4 ${className}`}>
        {isLoading || showSkeleton ? (
          <div className="container mx-auto px-4 py-6">
            {/* Page Skeleton */}
            <div className="space-y-6">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="h-4 bg-muted rounded w-4/6"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted rounded-lg h-48 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                      <div className="h-6 bg-muted rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          children
        )}
      </main>
      
      {/* Fixed Footer */}
      {showFooter && (
        <Footer />
      )}
      
      {/* Mobile Navigation with proper bottom spacing */}
      <div className="pb-safe">
        <MobileNav />
      </div>
    </div>
  );
}
