import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Link } from 'react-router-dom';
import { Building2, Car, Cpu, GamepadIcon, Heart, Sofa, Users, Briefcase, Hammer, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

// Define category types
type Category = {
  id: number;
  name: string;
  arabicName: string;
  icon: React.ReactNode;
  slug: string;
};

// Define listing types
type Listing = {
  id: number;
  title: string;
  price?: number;
  location: string;
  image: string;
  timeAgo: string;
  user: string;
  userAvatar?: string;
};

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<'all' | 'nearby'>('all');
  const isMobile = useIsMobile();
  
  // Categories data
  const categories: Category[] = [
    { id: 1, name: 'Furniture', arabicName: 'أثاث', icon: <Sofa className="w-8 h-8 text-blue-600" />, slug: 'furniture' },
    { id: 2, name: 'Animals', arabicName: 'حيوانات', icon: <Heart className="w-8 h-8 text-blue-600" />, slug: 'animals' },
    { id: 3, name: 'Electronics', arabicName: 'أجهزة', icon: <Cpu className="w-8 h-8 text-blue-600" />, slug: 'electronics' },
    { id: 4, name: 'Real Estate', arabicName: 'عقارات', icon: <Building2 className="w-8 h-8 text-blue-600" />, slug: 'real-estate' },
    { id: 5, name: 'Cars', arabicName: 'سيارات', icon: <Car className="w-8 h-8 text-blue-600" />, slug: 'cars' },
    { id: 6, name: 'Collectibles', arabicName: 'نوادر', icon: <Hammer className="w-8 h-8 text-blue-600" />, slug: 'collectibles' },
    { id: 7, name: 'Games', arabicName: 'العاب', icon: <GamepadIcon className="w-8 h-8 text-blue-600" />, slug: 'games' },
    { id: 8, name: 'Fashion', arabicName: 'ازياء', icon: <Users className="w-8 h-8 text-blue-600" />, slug: 'fashion' },
    { id: 9, name: 'Services', arabicName: 'خدمات', icon: <Hammer className="w-8 h-8 text-blue-600" />, slug: 'services' },
    { id: 10, name: 'Jobs', arabicName: 'وظائف', icon: <Briefcase className="w-8 h-8 text-blue-600" />, slug: 'jobs' }
  ];
  
  // Mock listings data
  const listings: Listing[] = [
    {
      id: 1,
      title: 'إنفنتي QX60',
      price: undefined,
      location: 'جدة',
      image: '/assets/car-listing.jpg',
      timeAgo: 'قبل 39 دقيقة',
      user: 'kartana.card'
    },
    {
      id: 2,
      title: 'مجلس صالة',
      price: 700,
      location: 'مكة',
      image: '/assets/furniture-listing.jpg',
      timeAgo: 'قبل 39 دقيقة',
      user: 'alabakar'
    },
    {
      id: 3,
      title: 'فرشات للبيع',
      price: 250,
      location: 'الرياض',
      image: '/assets/mattress-listing.jpg',
      timeAgo: 'قبل 45 دقيقة',
      user: 'furniture_dealer'
    }
  ];
  
  const handleCategoryClick = (categoryId: number) => {
    setActiveCategory(categoryId);
  };
  
  // Render different category layouts for mobile and desktop
  const renderCategories = () => {
    if (isMobile) {
      // Enhanced mobile category design inspired by Haraj.sa
      return (
        <div className="bg-white py-4 px-2 mb-2 shadow-sm">
          <div className="grid grid-cols-5 gap-3">
            {categories.slice(0, 10).map((category) => (
              <Link 
                key={category.id}
                to={`/category/${category.slug}`}
                className="flex flex-col items-center"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className={cn(
                  "w-14 h-14 flex items-center justify-center rounded-lg bg-slate-100",
                  activeCategory === category.id && "bg-blue-100"
                )}>
                  {category.icon}
                </div>
                <span className="text-xs mt-1 text-center">{category.arabicName}</span>
              </Link>
            ))}
          </div>
          
          {/* Category Pagination Dots */}
          <div className="flex justify-center mt-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="w-6 h-2 rounded-full bg-blue-500"></div>
            </div>
          </div>
        </div>
      );
    } else {
      // Keep the original desktop category layout
      return (
        <div className="bg-white py-4 px-2 mb-2 shadow-sm">
          <div className="grid grid-cols-5 gap-3">
            {categories.slice(0, 10).map((category) => (
              <Link 
                key={category.id}
                to={`/category/${category.slug}`}
                className="flex flex-col items-center"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className={cn(
                  "w-14 h-14 flex items-center justify-center rounded-lg bg-slate-100",
                  activeCategory === category.id && "bg-blue-100"
                )}>
                  {category.icon}
                </div>
                <span className="text-xs mt-1 text-center">{category.arabicName}</span>
              </Link>
            ))}
          </div>
          
          {/* Category Pagination Dots */}
          <div className="flex justify-center mt-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="w-6 h-2 rounded-full bg-blue-500"></div>
            </div>
          </div>
        </div>
      );
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-16 md:pb-0">
      <Header />
      
      {/* Categories Section - Responsive */}
      {renderCategories()}
      
      {/* Location Filter */}
      <div className="bg-white py-2 px-4 mb-2 flex items-center justify-between">
        <div className="flex space-x-1 space-x-reverse">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <div 
            className={cn(
              "px-4 py-2 rounded-lg flex items-center justify-center text-sm",
              selectedLocation === 'nearby' ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-800"
            )}
            onClick={() => setSelectedLocation('nearby')}
          >
            القريب
          </div>
        </div>
        
        <div 
          className={cn(
            "px-4 py-2 rounded-lg flex items-center justify-center text-sm",
            selectedLocation === 'all' ? "bg-white text-slate-800 border border-slate-200" : "text-slate-600"
          )}
          onClick={() => setSelectedLocation('all')}
        >
          كل المناطق <ChevronDown className="h-4 w-4 mr-1" />
        </div>
      </div>
      
      {/* Listings Section */}
      <div className="flex-1 px-2">
        <div className="space-y-2">
          {listings.map((listing) => (
            <Link key={listing.id} to={`/ad/${listing.id}`} className="block">
              <div className="bg-white rounded-lg overflow-hidden">
                <div className="flex">
                  <div className="w-1/3 h-24">
                    <img 
                      src={listing.image || "/placeholder.svg"} 
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-2/3 p-2 flex flex-col justify-between">
                    <div>
                      <h3 className="text-green-500 font-bold text-right">{listing.title}</h3>
                      {listing.price && (
                        <div className="text-blue-600 font-bold text-right">
                          {listing.price} ﷼
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {listing.timeAgo}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {listing.location}
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-1">
                      <div className="text-xs bg-gray-200 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center">
                        {listing.user.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-600">{listing.user}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default Index;
