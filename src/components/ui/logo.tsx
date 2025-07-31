
import React from 'react';
import { useSiteIdentity, useBasicSettings } from '@/hooks/use-settings';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
}

export function Logo({ size = 'md', variant = 'dark' }: LogoProps) {
  const { data: siteIdentity } = useSiteIdentity();
  const { data: basicSettings } = useBasicSettings();
  
  const sizes = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10'
  };
  
  const sizeClass = sizes[size];
  
  // استخدام اللوغو المناسب حسب النوع
  const logoUrl = variant === 'light' && siteIdentity?.data?.site_white_logo 
    ? siteIdentity.data.site_white_logo 
    : siteIdentity?.data?.site_logo;
  
  // عنوان الموقع من API
  const siteTitle = basicSettings?.data?.site_title || 'مكس سوريا';
  
  return (
    <div className="flex items-center">
      {logoUrl ? (
        <img 
          src={logoUrl} 
          alt={siteTitle} 
          className={`${sizeClass} mr-2`}
          onError={(e) => {
            // في حالة فشل تحميل الصورة، إخفاؤها
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        // إذا لم يكن هناك لوغو، عرض أيقونة افتراضية
        <div className={`${sizeClass} mr-2 bg-brand rounded flex items-center justify-center text-white font-bold`}>
          {siteTitle.charAt(0)}
        </div>
      )}
      <span className={`font-bold ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'} text-brand`}>
        {siteTitle}
      </span>
    </div>
  );
}
