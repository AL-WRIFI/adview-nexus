
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, MapPin, Heart, ChevronDown, 
  Bell, Menu, X, Filter, Grid3X3, LayoutList 
} from 'lucide-react';
import { generateMockListing } from '@/lib/mock-data';

// Generate mock listings for demo
const mockListings = Array.from({ length: 12 }, (_, i) => generateMockListing(i + 1));

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50 backdrop-blur-lg bg-opacity-80">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">AdNexus</span>
            </Link>
            
            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search listings..."
                  className="pl-10 w-full"
                />
              </div>
            </div>
            
            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5 mr-2" />
                <span>Notifications</span>
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="h-5 w-5 mr-2" />
                <span>Favorites</span>
              </Button>
              <Button className="button-hover-effect">Post Ad</Button>
            </nav>
            
            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-4 animate-fade-in">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search listings..."
                  className="pl-10 w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Bell className="h-5 w-5 mr-2" />
                  <span>Notifications</span>
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Heart className="h-5 w-5 mr-2" />
                  <span>Favorites</span>
                </Button>
                <Button className="w-full button-hover-effect">Post Ad</Button>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Main content */}
      <main className="container-custom py-8">
        {/* Page Title */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Featured Listings</h1>
          <p className="text-muted-foreground">Discover premium items from verified sellers</p>
        </div>
        
        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              Category
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              Price
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            
            <Button
              variant={viewMode === 'list' ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode('list')}
              className="h-8 w-8"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Listings Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mockListings.map((listing) => (
              <Link 
                to={`/listing/${listing.id}`} 
                key={listing.id}
                className="group rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up"
              >
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  <img 
                    src={listing.image} 
                    alt={listing.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {listing.is_featured && (
                    <Badge className="absolute top-2 left-2 bg-amber-500">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                      {listing.title}
                    </h3>
                    <Badge variant="outline" className="shrink-0">
                      {listing.condition}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{listing.address}</span>
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-primary font-bold">
                      ${listing.price.toLocaleString()}
                      {listing.negotiable && (
                        <span className="text-xs font-normal text-muted-foreground ml-1">
                          (Neg.)
                        </span>
                      )}
                    </p>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 rounded-full"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Add to favorites logic
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {mockListings.map((listing) => (
              <Link 
                to={`/listing/${listing.id}`} 
                key={listing.id}
                className="group flex flex-col sm:flex-row gap-4 rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
              >
                <div className="w-full sm:w-48 md:w-60 shrink-0 aspect-[4/3] sm:aspect-square bg-muted relative overflow-hidden">
                  <img 
                    src={listing.image} 
                    alt={listing.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {listing.is_featured && (
                    <Badge className="absolute top-2 left-2 bg-amber-500">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-medium group-hover:text-primary transition-colors">
                      {listing.title}
                    </h3>
                    <Badge variant="outline">
                      {listing.condition}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span>{listing.address}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {listing.description}
                  </p>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <p className="text-primary font-bold text-lg">
                      ${listing.price.toLocaleString()}
                      {listing.negotiable && (
                        <span className="text-xs font-normal text-muted-foreground ml-1">
                          (Negotiable)
                        </span>
                      )}
                    </p>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Add to favorites logic
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">AdNexus</h3>
              <p className="text-muted-foreground text-sm">
                The premier destination for buying and selling premium products online.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">Electronics</a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">Fashion</a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">Home & Garden</a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">Vehicles</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Help & Info</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">About Us</a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">Contact Support</a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Connect With Us</h4>
              <div className="flex items-center gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61176 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.39549C5.36074 6.60513 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005V3.00005Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61992 14.1902 8.22773 13.4229 8.09407 12.5922C7.9604 11.7615 8.09207 10.9099 8.47033 10.1584C8.84859 9.40685 9.45419 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8C13.4789 8.12588 14.2649 8.52146 14.8717 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 6.5H17.51" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} AdNexus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
