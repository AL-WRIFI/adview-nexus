
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { ClassifiedFiltersUI } from '@/components/filters/ClassifiedFiltersUI';
import { SearchFilters } from '@/types';

export default function FiltersPage() {
  const navigate = useNavigate();

  const handleFilterChange = (filters: SearchFilters) => {
    // Build query string from filters
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    // Navigate to search page with filters
    navigate(`/search?${params.toString()}`);
  };

  const handleSearch = (query: string) => {
    navigate(`/search?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pb-20 md:pb-0">
        <ClassifiedFiltersUI 
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}
