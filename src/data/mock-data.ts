
import { Ad, User } from '@/types';

export const featuredAds: Ad[] = [
  {
    id: 1,
    title: 'سيارة تويوتا كامري 2020',
    description: 'سيارة بحالة ممتازة، استعمال خفيف، صيانة دورية',
    price: 85000,
    negotiable: true,
    condition: 'used',
    category: 'سيارات',
    subcategory: 'تويوتا',
    city: 'الرياض',
    state: 'الرياض',
    address: 'حي الملقا، الرياض',
    images: ['/images/car1.jpg', '/images/car2.jpg'],
    featured: true,
    views_count: 120,
    comments_count: 5,
    listing_type: 'sell',
    created_at: '2023-04-15',
    seller: {
      id: 1,
      name: 'محمد أحمد',
      avatar: '/images/avatar1.jpg',
      verified: true,
      phone: '0501234567',
      createdAt: '2022-01-20'
    }
  },
  {
    id: 2,
    title: 'شقة فاخرة للإيجار',
    description: 'شقة فاخرة مؤثثة بالكامل، 3 غرف وصالة، مطبخ مجهز',
    price: 3500,
    negotiable: false,
    condition: 'new',
    category: 'عقارات',
    subcategory: 'شقق للإيجار',
    city: 'جدة',
    state: 'مكة المكرمة',
    address: 'حي الروضة، جدة',
    images: ['/images/apartment1.jpg', '/images/apartment2.jpg'],
    featured: true,
    views_count: 85,
    comments_count: 2,
    listing_type: 'sell',
    created_at: '2023-04-20',
    seller: {
      id: 2,
      name: 'سارة محمد',
      avatar: '/images/avatar2.jpg',
      verified: true,
      phone: '0567891234',
      createdAt: '2022-03-15'
    }
  },
  {
    id: 3,
    title: 'جهاز ايفون 13 برو ماكس',
    description: 'جهاز جديد لم يستخدم، مع كامل الملحقات والضمان',
    price: 4500,
    negotiable: true,
    condition: 'new',
    category: 'جوالات',
    subcategory: 'أيفون',
    city: 'الدمام',
    state: 'المنطقة الشرقية',
    address: 'حي الشاطئ، الدمام',
    images: ['/images/iphone1.jpg', '/images/iphone2.jpg'],
    featured: true,
    views_count: 200,
    comments_count: 8,
    listing_type: 'sell',
    created_at: '2023-04-22',
    seller: {
      id: 3,
      name: 'خالد العلي',
      avatar: '/images/avatar3.jpg',
      verified: false,
      phone: '0512345678',
      createdAt: '2023-01-10'
    }
  }
];

export const recentAds: Ad[] = [
  {
    id: 4,
    title: 'لابتوب ماك بوك برو 2021',
    description: 'لابتوب بحالة ممتازة، استعمال شهر واحد فقط، كامل الملحقات',
    price: 6500,
    negotiable: false,
    condition: 'used',
    category: 'أجهزة كمبيوتر',
    subcategory: 'لابتوبات',
    city: 'الرياض',
    state: 'الرياض',
    address: 'حي النزهة، الرياض',
    images: ['/images/macbook1.jpg', '/images/macbook2.jpg'],
    featured: false,
    views_count: 45,
    comments_count: 1,
    listing_type: 'sell',
    created_at: '2023-04-25',
    seller: {
      id: 4,
      name: 'فهد المحمد',
      avatar: '/images/avatar4.jpg',
      verified: true,
      phone: '0523456789',
      createdAt: '2022-06-15'
    }
  },
  {
    id: 5,
    title: 'طاولة طعام خشبية فاخرة',
    description: 'طاولة طعام خشب ماليزي أصلي، 8 كراسي، حالة ممتازة',
    price: 2200,
    negotiable: true,
    condition: 'used',
    category: 'أثاث منزلي',
    subcategory: 'طاولات',
    city: 'جدة',
    state: 'مكة المكرمة',
    address: 'حي الصفا، جدة',
    images: ['/images/table1.jpg', '/images/table2.jpg'],
    featured: false,
    views_count: 30,
    comments_count: 0,
    listing_type: 'sell',
    created_at: '2023-04-26',
    seller: {
      id: 5,
      name: 'نورة العبدالله',
      avatar: '/images/avatar5.jpg',
      verified: false,
      phone: '0534567890',
      createdAt: '2022-11-20'
    }
  },
  {
    id: 6,
    title: 'دراجة هوائية جبلية',
    description: 'دراجة هوائية للطرق الوعرة، استعمال خفيف، إطارات حديثة',
    price: 1500,
    negotiable: true,
    condition: 'used',
    category: 'رياضة',
    subcategory: 'دراجات',
    city: 'الدمام',
    state: 'المنطقة الشرقية',
    address: 'حي الفيصلية، الدمام',
    images: ['/images/bike1.jpg', '/images/bike2.jpg'],
    featured: false,
    views_count: 25,
    comments_count: 2,
    listing_type: 'sell',
    created_at: '2023-04-27',
    seller: {
      id: 6,
      name: 'عبدالله السالم',
      avatar: '/images/avatar6.jpg',
      verified: true,
      phone: '0545678901',
      createdAt: '2022-07-05'
    }
  },
  {
    id: 7,
    title: 'كاميرا كانون احترافية',
    description: 'كاميرا كانون EOS 5D Mark IV مع عدسات إضافية وحقيبة',
    price: 8000,
    negotiable: false,
    condition: 'used',
    category: 'الكترونيات',
    subcategory: 'كاميرات',
    city: 'الرياض',
    state: 'الرياض',
    address: 'حي الورود، الرياض',
    images: ['/images/camera1.jpg', '/images/camera2.jpg'],
    featured: false,
    views_count: 40,
    comments_count: 3,
    listing_type: 'sell',
    created_at: '2023-04-28',
    seller: {
      id: 7,
      name: 'سلمان العتيبي',
      avatar: '/images/avatar7.jpg',
      verified: true,
      phone: '0556789012',
      createdAt: '2022-09-15'
    }
  },
  {
    id: 8,
    title: 'كنب مجلس عربي فاخر',
    description: 'كنب مجلس عربي مع طاولة وسط، خشب صنوبر، قماش مخمل',
    price: 5000,
    negotiable: true,
    condition: 'new',
    category: 'أثاث منزلي',
    subcategory: 'كنب وجلسات',
    city: 'جدة',
    state: 'مكة المكرمة',
    address: 'حي السلامة، جدة',
    images: ['/images/sofa1.jpg', '/images/sofa2.jpg'],
    featured: false,
    views_count: 35,
    comments_count: 1,
    listing_type: 'sell',
    created_at: '2023-04-29',
    seller: {
      id: 8,
      name: 'منى الخالدي',
      avatar: '/images/avatar8.jpg',
      verified: false,
      phone: '0567890123',
      createdAt: '2023-02-10'
    }
  },
  {
    id: 9,
    title: 'تويوتا لاندكروزر 2019',
    description: 'لاندكروزر VXR فل كامل، بحالة الوكالة، صيانة دورية منتظمة',
    price: 250000,
    negotiable: true,
    condition: 'used',
    category: 'سيارات',
    subcategory: 'تويوتا',
    city: 'الرياض',
    state: 'الرياض',
    address: 'حي الياسمين، الرياض',
    images: ['/images/landcruiser1.jpg', '/images/landcruiser2.jpg'],
    featured: false,
    views_count: 150,
    comments_count: 6,
    listing_type: 'sell',
    created_at: '2023-04-30',
    seller: {
      id: 9,
      name: 'فهد القحطاني',
      avatar: '/images/avatar9.jpg',
      verified: true,
      phone: '0578901234',
      createdAt: '2022-04-20'
    }
  }
];

export const categories = [
  {
    id: 1,
    name: 'سيارات',
    icon: 'car',
    count: 2350
  },
  {
    id: 2,
    name: 'عقارات',
    icon: 'home',
    count: 1450
  },
  {
    id: 3,
    name: 'إلكترونيات',
    icon: 'cpu',
    count: 3200
  },
  {
    id: 4,
    name: 'موبايلات',
    icon: 'smartphone',
    count: 2800
  },
  {
    id: 5,
    name: 'أثاث منزلي',
    icon: 'couch',
    count: 1900
  },
  {
    id: 6,
    name: 'وظائف',
    icon: 'briefcase',
    count: 750
  },
  {
    id: 7,
    name: 'خدمات',
    icon: 'tool',
    count: 980
  },
  {
    id: 8,
    name: 'ملابس',
    icon: 'shirt',
    count: 1250
  }
];

export const brands = [
  {
    id: 1,
    name: 'تويوتا',
    logo: '/images/brands/toyota.jpg',
    count: 550
  },
  {
    id: 2,
    name: 'سامسونج',
    logo: '/images/brands/samsung.jpg',
    count: 420
  },
  {
    id: 3,
    name: 'آبل',
    logo: '/images/brands/apple.jpg',
    count: 380
  },
  {
    id: 4,
    name: 'نيسان',
    logo: '/images/brands/nissan.jpg',
    count: 310
  },
  {
    id: 5,
    name: 'هيونداي',
    logo: '/images/brands/hyundai.jpg',
    count: 295
  },
  {
    id: 6,
    name: 'سوني',
    logo: '/images/brands/sony.jpg',
    count: 180
  }
];

export const cities = [
  {
    id: 1,
    name: 'الرياض',
    count: 2450
  },
  {
    id: 2,
    name: 'جدة',
    count: 1850
  },
  {
    id: 3,
    name: 'الدمام',
    count: 920
  },
  {
    id: 4,
    name: 'مكة المكرمة',
    count: 780
  },
  {
    id: 5,
    name: 'المدينة المنورة',
    count: 620
  },
  {
    id: 6,
    name: 'الطائف',
    count: 450
  }
];

export const currentUser: User = {
  id: 1,
  first_name: 'محمد',
  last_name: 'العبدالله',
  username: 'mohammed_a',
  phone: '0501234567',
  email: 'mohammed@example.com',
  image: '/images/avatar1.jpg',
  created_at: '2022-03-15',
  is_verified: true,
  name: 'محمد العبدالله',
  verified: true
};
