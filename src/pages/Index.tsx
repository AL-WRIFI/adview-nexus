
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, MapPin, Heart, ChevronDown, Bell, Menu, 
  X, Filter, Grid3X3, LayoutList, Plus, CarFront,
  Sofa, Building, Briefcase, Cpu, Dog, Smartphone
} from 'lucide-react';
import { generateMockListing } from '@/lib/mock-data';

// Generate mock listings for demo
const mockListings = Array.from({ length: 12 }, (_, i) => generateMockListing(i + 1));

// Define categories
const categories = [
  { id: 1, name: "Cars", icon: <CarFront className="h-6 w-6" /> },
  { id: 2, name: "Real Estate", icon: <Building className="h-6 w-6" /> },
  { id: 3, name: "Jobs", icon: <Briefcase className="h-6 w-6" /> },
  { id: 4, name: "Electronics", icon: <Smartphone className="h-6 w-6" /> },
  { id: 5, name: "Home", icon: <Sofa className="h-6 w-6" /> },
  { id: 6, name: "Services", icon: <Cpu className="h-6 w-6" /> },
  { id: 7, name: "Pets", icon: <Dog className="h-6 w-6" /> },
];

// Brand logos for car brands shown in the design
const carBrands = [
  { id: 1, name: "Toyota", logo: "/lovable-uploads/3e25247d-47db-4b30-975f-d78cadf136d7.png" },
  { id: 2, name: "Ford", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/2560px-Ford_logo_flat.svg.png" },
  { id: 3, name: "Nissan", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Nissan_logo.svg/1200px-Nissan_logo.svg.png" },
  { id: 4, name: "Mercedes", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/1200px-Mercedes-Logo.svg.png" },
  { id: 5, name: "BMW", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png" },
  { id: 6, name: "Chevrolet", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Chevrolet_logo.svg/1200px-Chevrolet_logo.svg.png" },
];

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [activeCategory, setActiveCategory] = useState<number | null>(1);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">Haraj</span>
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
            
            {/* Language Toggle */}
            <div className="hidden md:flex items-center mr-4">
              <Button variant="ghost" size="sm" className="gap-1">
                <span>EN</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Dark Mode Toggle */}
            <div className="hidden md:flex items-center">
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-white">
                  <span className="text-xs">🌙</span>
                </div>
              </Button>
            </div>
            
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
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Secondary Navigation - Categories */}
      <div className="bg-primary text-white py-2 shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Post Ad</span>
            </Button>
            
            <div className="overflow-x-auto pb-1 hide-scrollbar">
              <div className="flex space-x-6">
                {categories.map(category => (
                  <Button 
                    key={category.id}
                    variant={activeCategory === category.id ? "secondary" : "ghost"} 
                    size="sm"
                    className={activeCategory === category.id ? "bg-white text-primary" : "text-white hover:bg-blue-600"}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Category Icons */}
      <div className="bg-white py-4 border-b">
        <div className="container mx-auto">
          <div className="grid grid-cols-7 gap-4">
            {categories.map(category => (
              <div 
                key={category.id} 
                className={`flex flex-col items-center justify-center cursor-pointer p-2 rounded-lg transition-colors ${activeCategory === category.id ? 'bg-blue-50 text-primary' : 'hover:bg-gray-50'}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <div className="p-3 rounded-full bg-gray-100">
                  {category.icon}
                </div>
                <span className="mt-2 text-sm font-medium">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <main className="container mx-auto py-6">
        {/* User Profile Section - Similar to Laravel implementation */}
        <div className="mb-8 rounded-xl overflow-hidden border bg-white shadow-sm">
          <div className="h-40 bg-gradient-to-r from-blue-400 to-blue-600 relative">
            {/* Cover photo - could be dynamic */}
          </div>
          <div className="p-4 flex flex-col sm:flex-row items-center justify-between">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-md -mt-10 overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt="User Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold">User Name</h2>
                <p className="text-muted-foreground text-sm">Member since 2023</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
        
        {/* Filters & View Toggle */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <h3 className="text-lg font-semibold mb-4">My Listings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Status</label>
              <select className="w-full rounded-md border border-input bg-background px-3 h-10">
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Category</label>
              <select className="w-full rounded-md border border-input bg-background px-3 h-10">
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Publication</label>
              <select className="w-full rounded-md border border-input bg-background px-3 h-10">
                <option value="all">All Publications</option>
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Listings Section */}
        <div className="space-y-4">
          {mockListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Image Column */}
                  <div className="md:w-1/4 lg:w-1/5">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={listing.image} 
                        alt={listing.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Content Column */}
                  <div className="md:w-2/4 lg:w-3/5">
                    <div>
                      <h3 className="text-lg font-medium mb-2 hover:text-primary">
                        <Link to={`/listing/${listing.id}`}>
                          {listing.title}
                        </Link>
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        {listing.is_featured && (
                          <Badge className="bg-amber-500 text-white">
                            Featured
                          </Badge>
                        )}
                        <Badge variant="outline">
                          {listing.condition}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{listing.address}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Posted 2 days ago</span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <span className="text-lg font-bold text-primary">
                          ${listing.price.toLocaleString()}
                          {listing.negotiable && (
                            <span className="text-xs font-normal text-muted-foreground ml-1">
                              (Negotiable)
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions Column */}
                  <div className="md:w-1/4 lg:w-1/5 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4 gap-3">
                    <div className="text-center">
                      <Badge variant="outline" className={`${
                        Math.random() > 0.5 ? 'bg-green-100 text-green-800 border-green-200' : 'bg-amber-100 text-amber-800 border-amber-200'
                      } px-3 py-1`}>
                        {Math.random() > 0.5 ? 'Approved' : 'Pending'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="relative inline-flex items-center">
                        <input
                          type="checkbox"
                          id={`publish-${listing.id}`}
                          className="sr-only peer"
                          defaultChecked={Math.random() > 0.5}
                        />
                        <label
                          htmlFor={`publish-${listing.id}`}
                          className="flex items-center cursor-pointer w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                        >
                        </label>
                        <span className="ml-2 text-sm text-muted-foreground">
                          {Math.random() > 0.5 ? 'Published' : 'Unpublished'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" className="px-2">
                        <Link to={`/listing/${listing.id}`}>
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="px-2">
                        Edit
                      </Button>
                      <div className="relative group">
                        <Button variant="outline" size="sm" className="px-2">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <div className="absolute right-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10 hidden group-hover:block">
                          <div className="py-1">
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              View Listing
                            </a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Edit Listing
                            </a>
                            <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                              Delete Listing
                            </a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Renew Listing
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
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
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Haraj</h3>
              <p className="text-muted-foreground text-sm">
                The premier destination for buying and selling premium products online.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {categories.slice(0, 4).map(category => (
                  <li key={category.id}>
                    <a href="#" className="hover:text-foreground transition-colors">
                      {category.name}
                    </a>
                  </li>
                ))}
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
            <p>© {new Date().getFullYear()} Haraj. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Delete Modal - Add here when needed */}
    </div>
  );
};

export default Index;
