
import React from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { MobileNav } from './mobile-nav';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  showFooter?: boolean;
  isLoading?: boolean;
}

export function PageLayout({ 
  children, 
  className = "", 
  showFooter = true,
  isLoading = false 
}: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Page content with proper spacing for fixed header */}
      <main className={`flex-1 pt-16 ${className}`}>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded w-48 mx-auto mb-4"></div>
                <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
              </div>
            </div>
          </div>
        ) : (
          children
        )}
      </main>
      
      {/* Footer always at bottom */}
      {showFooter && (
        <Footer />
      )}
      
      {/* Mobile navigation with proper spacing */}
      <div className="pb-16 md:pb-0">
        <MobileNav />
      </div>
    </div>
  );
}
