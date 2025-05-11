
import { useState } from 'react';
import { MobileNav } from '@/components/layout/mobile-nav';
import { DarkModeToggle } from '@/components/theme/dark-mode-toggle';
import { Logo } from '@/components/ui/logo';

const Index = () => {
  const [isLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-gray-900 shadow-sm border-b border-border dark:border-gray-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">مرحبا بك في مكس سوريا</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">منصة الإعلانات المبوبة السورية</p>
        </div>

        <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">استكشف الفئات</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {['عقارات', 'سيارات', 'إلكترونيات', 'خدمات', 'وظائف', 'أثاث'].map((category) => (
                <div 
                  key={category} 
                  className="category-icon dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">آخر الإعلانات</h2>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">جارٍ التحميل...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className="ad-card hover:shadow-md transition-shadow dark:bg-gray-700 dark:border-gray-600"
                  >
                    <div className="p-4">
                      <h3 className="font-bold dark:text-white">عنوان الإعلان {i}</h3>
                      <p className="text-gray-600 mt-2 dark:text-gray-300">
                        هذا هو وصف مختصر للإعلان {i}
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="font-semibold text-brand dark:text-brand-light">
                          {i * 1000} ل.س
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          منذ {i} ساعة
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default Index;
