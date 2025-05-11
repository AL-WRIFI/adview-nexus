import { Ad, Category, User, Comment, Conversation } from '../types';
// Import icons that we'll use by name
import { 
  Car, Home, Smartphone, Mouse, Briefcase, Wrench, Shirt, Gamepad, 
  Gem, ShoppingBag, Utensils, Laptop, BookOpen, Baby, Bike, Camera, FileText, 
  Headphones, Gift, Train
} from 'lucide-react';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'سيارات', icon: 'Car' },
  { id: '2', name: 'عقارات', icon: 'Home' },
  { id: '3', name: 'إلكترونيات', icon: 'Smartphone' },
  { id: '4', name: 'حيوانات وطيور', icon: 'Mouse' },
  { id: '5', name: 'وظائف', icon: 'Briefcase' },
  { id: '6', name: 'خدمات', icon: 'Wrench' },
  { id: '7', name: 'أزياء', icon: 'Shirt' },
  { id: '8', name: 'ألعاب', icon: 'Gamepad' },
  { id: '9', name: 'مقتنيات', icon: 'Gem' },
  { id: '10', name: 'أثاث', icon: 'ShoppingBag' },
  { id: '11', name: 'مأكولات', icon: 'Utensils' },
  { id: '12', name: 'أجهزة', icon: 'Laptop' },
  { id: '13', name: 'كتب', icon: 'BookOpen' },
  { id: '14', name: 'مستلزمات أطفال', icon: 'Baby' },
  { id: '15', name: 'دراجات', icon: 'Bike' },
  { id: '16', name: 'كاميرات', icon: 'Camera' },
  { id: '17', name: 'وثائق', icon: 'FileText' },
  { id: '18', name: 'سماعات', icon: 'Headphones' },
  { id: '19', name: 'هدايا', icon: 'Gift' },
  { id: '20', name: 'سفر', icon: 'Train' }
];

export const USERS: User[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    phone: '0500000000',
    nationalId: '1000000000',
    city: 'الرياض',
    avatar: 'https://i.pravatar.cc/150?img=1',
    verified: true,
    createdAt: new Date(2023, 0, 1).toISOString()
  },
  {
    id: '2',
    name: 'خالد العتيبي',
    phone: '0511111111',
    nationalId: '1000000001',
    city: 'جدة',
    avatar: 'https://i.pravatar.cc/150?img=2',
    verified: true,
    createdAt: new Date(2023, 1, 15).toISOString()
  },
  {
    id: '3',
    name: 'عبدالله القحطاني',
    phone: '0522222222',
    nationalId: '1000000002',
    city: 'الدمام',
    avatar: 'https://i.pravatar.cc/150?img=3',
    verified: false,
    createdAt: new Date(2023, 2, 10).toISOString()
  },
  {
    id: '4',
    name: 'سارة الشمري',
    phone: '0533333333',
    nationalId: '1000000003',
    city: 'مكة',
    avatar: 'https://i.pravatar.cc/150?img=4',
    verified: true,
    createdAt: new Date(2023, 3, 5).toISOString()
  },
  {
    id: '5',
    name: 'نورة العنزي',
    phone: '0544444444',
    nationalId: '1000000004',
    city: 'المدينة',
    avatar: 'https://i.pravatar.cc/150?img=5',
    verified: false,
    createdAt: new Date(2023, 4, 20).toISOString()
  }
];

export const ADS: Ad[] = [
  {
    id: '1',
    title: 'تويوتا كامري 2022 خليجي',
    description: 'سيارة تويوتا كامري 2022 خليجي، فل كامل، ممشى قليل، بحالة ممتازة، اللون أبيض، المالك الأول',
    price: 120000,
    negotiable: true,
    images: [
      '/lovable-uploads/1c8bb087-b7a3-4d42-989b-3942f1844df7.png',
      '/lovable-uploads/e294d6ab-081c-4d6e-9a30-e1f490614def.png'
    ],
    category: '1',
    subcategory: 'تويوتا',
    city: 'الرياض',
    district: 'النخيل',
    featured: true,
    seller: USERS[0],
    createdAt: new Date(2023, 5, 10).toISOString(),
    viewCount: 156,
    commentCount: 3,
    adType: 'sale',
    status: 'active'
  },
  {
    id: '2',
    title: 'شقة فاخرة للإيجار',
    description: 'شقة فاخرة للإيجار، 3 غرف نوم، صالة كبيرة، مطبخ حديث، حمامين، مدخل خاص، موقف سيارة، في حي الروضة',
    price: 35000,
    negotiable: false,
    images: [
      '/lovable-uploads/1b313deb-e5e7-41ce-8caa-66081e55e8be.png'
    ],
    category: '2',
    subcategory: 'شقق',
    city: 'جدة',
    district: 'الروضة',
    featured: false,
    seller: USERS[1],
    createdAt: new Date(2023, 5, 12).toISOString(),
    viewCount: 89,
    commentCount: 1,
    adType: 'rent',
    status: 'active'
  },
  {
    id: '3',
    title: 'ايفون 13 برو ماكس',
    description: 'ايفون 13 برو ماكس، 256 جيجا، لون أزرق، استخدام أسبوعين فقط، كامل الملحقات، ضمان سنة',
    price: 4800,
    negotiable: true,
    images: [
      '/lovable-uploads/aa1c345e-13ff-4cb0-9d1f-3db22b25394c.png'
    ],
    category: '3',
    subcategory: 'هواتف',
    city: 'الرياض',
    district: 'العليا',
    featured: true,
    seller: USERS[2],
    createdAt: new Date(2023, 5, 15).toISOString(),
    viewCount: 204,
    commentCount: 5,
    adType: 'sale',
    status: 'active'
  },
  {
    id: '4',
    title: 'قطط سيامي للبيع',
    description: 'قطط سيامي أصيلة للبيع، عمرها شهرين، مطعمة بالكامل، لون أزرق، ذكر وأنثى',
    price: 1200,
    negotiable: true,
    images: [
      '/lovable-uploads/fb4fed6b-6a92-490c-9fd8-6ddb94449efe.png'
    ],
    category: '4',
    subcategory: 'قطط',
    city: 'الدمام',
    district: 'الشاطئ',
    featured: false,
    seller: USERS[3],
    createdAt: new Date(2023, 5, 18).toISOString(),
    viewCount: 78,
    commentCount: 2,
    adType: 'sale',
    status: 'active'
  },
  {
    id: '5',
    title: 'مطلوب مبرمج تطبيقات',
    description: 'مطلوب مبرمج تطبيقات للعمل بدوام كامل، خبرة لا تقل عن 3 سنوات في مجال تطوير تطبيقات الجوال، رواتب مجزية',
    price: 0,
    negotiable: false,
    images: [],
    category: '5',
    subcategory: 'تقنية',
    city: 'الرياض',
    district: 'العليا',
    featured: false,
    seller: USERS[4],
    createdAt: new Date(2023, 5, 20).toISOString(),
    viewCount: 45,
    commentCount: 0,
    adType: 'job',
    status: 'active'
  },
  {
    id: '6',
    title: 'لكزس LX 570 موديل 2021',
    description: 'لكزس LX 570 موديل 2021، فل كامل، بلاك اديشن، ماشي 20 ألف كيلو، ضمان الوكالة، حالة ممتازة',
    price: 380000,
    negotiable: true,
    images: [
      '/lovable-uploads/a41786e0-c4da-4307-980d-dfa0b52565ef.png'
    ],
    category: '1',
    subcategory: 'لكزس',
    city: 'مكة',
    district: 'العزيزية',
    featured: true,
    seller: USERS[0],
    createdAt: new Date(2023, 5, 25).toISOString(),
    viewCount: 132,
    commentCount: 4,
    adType: 'sale',
    status: 'active'
  },
  {
    id: '7',
    title: 'لابتوب ماك بوك برو',
    description: 'لابتوب ماك بوك برو 2022، شاشة 16 بوصة، معالج M1 Max، 32 جيجا رام، تخزين 1 تيرا، استخدام خفيف جدا',
    price: 12000,
    negotiable: true,
    images: [
      '/lovable-uploads/61a4a3ea-b199-459a-9fe5-06f38cf3a80a.png'
    ],
    category: '3',
    subcategory: 'لابتوب',
    city: 'جدة',
    district: 'الصفا',
    featured: false,
    seller: USERS[1],
    createdAt: new Date(2023, 5, 27).toISOString(),
    viewCount: 65,
    commentCount: 1,
    adType: 'sale',
    status: 'active'
  },
  {
    id: '8',
    title: 'فيلا فاخرة للبيع',
    description: 'فيلا فاخرة للبيع في حي الرحاب، 6 غرف نوم، 7 حمامات، صالتين، مطبخ كبير، مسبح خارجي، جراج لسيارتين، حديقة',
    price: 2500000,
    negotiable: true,
    images: [
      '/lovable-uploads/42caaf22-ff1f-4e6f-b286-e51d004d9231.png'
    ],
    category: '2',
    subcategory: 'فلل',
    city: 'الرياض',
    district: 'الرحاب',
    featured: true,
    seller: USERS[2],
    createdAt: new Date(2023, 5, 30).toISOString(),
    viewCount: 98,
    commentCount: 3,
    adType: 'sale',
    status: 'active'
  },
  {
    id: '9',
    title: 'جلسة تصوير احترافية',
    description: 'جلسة تصوير احترافية للأفراد والعائلات والمناسبات، تصوير داخلي وخارجي، مع طباعة 10 صور بحجم كبير',
    price: 800,
    negotiable: false,
    images: [
      '/lovable-uploads/ca9f9c33-a539-4bc0-871e-bb91ce4d7f6a.png'
    ],
    category: '6',
    subcategory: 'تصوير',
    city: 'الدمام',
    district: 'النزهة',
    featured: false,
    seller: USERS[3],
    createdAt: new Date(2023, 6, 2).toISOString(),
    viewCount: 42,
    commentCount: 0,
    adType: 'service',
    status: 'active'
  },
  {
    id: '10',
    title: 'كنب مودرن جديد',
    description: 'كنب مودرن جديد، 7 مقاعد، لون رمادي، قماش مستورد ضد البقع، ضمان سنتين، مع طاولة وسط زجاج',
    price: 5500,
    negotiable: true,
    images: [
      '/lovable-uploads/b5dfbd36-f217-4df4-92ca-85450a7a5809.png'
    ],
    category: '10',
    subcategory: 'كنب',
    city: 'جدة',
    district: 'السلامة',
    featured: false,
    seller: USERS[4],
    createdAt: new Date(2023, 6, 5).toISOString(),
    viewCount: 55,
    commentCount: 1,
    adType: 'sale',
    status: 'active'
  }
];

export const COMMENTS: Record<string, Comment[]> = {
  '1': [
    {
      id: '1',
      user: USERS[1],
      text: 'كم آخر سعر؟',
      createdAt: new Date(2023, 5, 12).toISOString(),
      adId: '1', // Added missing adId property
      replies: [
        {
          id: '2',
          user: USERS[0],
          text: 'السعر 115 نهائي',
          createdAt: new Date(2023, 5, 12, 2).toISOString(),
          adId: '1' // Added missing adId property
        }
      ]
    },
    {
      id: '3',
      user: USERS[2],
      text: 'هل فيه أي مشاكل فنية؟',
      createdAt: new Date(2023, 5, 15).toISOString(),
      adId: '1', // Added missing adId property
      replies: []
    }
  ],
  '3': [
    {
      id: '4',
      user: USERS[0],
      text: 'هل يوجد ضمان؟',
      createdAt: new Date(2023, 5, 16).toISOString(),
      adId: '3', // Added missing adId property
      replies: [
        {
          id: '5',
          user: USERS[2],
          text: 'نعم، ضمان سنة من الوكيل',
          createdAt: new Date(2023, 5, 16, 3).toISOString(),
          adId: '3' // Added missing adId property
        }
      ]
    },
    {
      id: '6',
      user: USERS[3],
      text: 'هل الاستخدام فعلاً أسبوعين؟',
      createdAt: new Date(2023, 5, 17).toISOString(),
      adId: '3', // Added missing adId property
      replies: [
        {
          id: '7',
          user: USERS[2],
          text: 'نعم، اشتريته ولم يناسبني',
          createdAt: new Date(2023, 5, 17, 1).toISOString(),
          adId: '3' // Added missing adId property
        }
      ]
    }
  ]
};

export const CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    participants: [USERS[0], USERS[1]],
    lastMessage: {
      id: '1',
      senderId: USERS[1].id,
      receiverId: USERS[0].id,
      conversationId: '1', // Added missing conversationId property
      adId: '1',
      text: 'هل مازالت السيارة متوفرة؟',
      read: true,
      createdAt: new Date(2023, 5, 11).toISOString()
    },
    unreadCount: 0,
    adId: '1',
    adTitle: 'تويوتا كامري 2022 خليجي',
    adImage: '/lovable-uploads/1c8bb087-b7a3-4d42-989b-3942f1844df7.png',
    createdAt: new Date(2023, 5, 10).toISOString(),
    updatedAt: new Date(2023, 5, 11).toISOString(),
    isActive: true
  },
  {
    id: '2',
    participants: [USERS[0], USERS[2]],
    lastMessage: {
      id: '2',
      senderId: USERS[0].id,
      receiverId: USERS[2].id,
      conversationId: '2', // Added missing conversationId property
      adId: '3',
      text: 'هل يمكن المعاينة غداً؟',
      read: false,
      createdAt: new Date(2023, 5, 16).toISOString()
    },
    unreadCount: 1,
    adId: '3',
    adTitle: 'ايفون 13 برو ماكس',
    adImage: '/lovable-uploads/aa1c345e-13ff-4cb0-9d1f-3db22b25394c.png',
    createdAt: new Date(2023, 5, 15).toISOString(),
    updatedAt: new Date(2023, 5, 16).toISOString(),
    isActive: true
  }
];

export const FEATURED_PACKAGES = [
  { id: '1', name: 'عرض لمدة يوم', price: 50, duration: 1, description: 'عرض الإعلان في الصفحة الرئيسية لمدة يوم واحد' },
  { id: '2', name: 'عرض لمدة أسبوع', price: 300, duration: 7, description: 'عرض الإعلان في الصفحة الرئيسية لمدة أسبوع كامل' },
  { id: '3', name: 'عرض لمدة شهر', price: 1000, duration: 30, description: 'عرض الإعلان في الصفحة الرئيسية لمدة شهر كامل' }
];

export const CITIES = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الظهران', 'الأحساء', 'الطائف', 
  'بريدة', 'الجبيل', 'خميس مشيط', 'ينبع', 'أبها', 'حائل', 'نجران', 'جيزان', 'الباحة', 'سكاكا', 'عرعر', 'تبوك'
];

export const subcategories = {
  '1': ['تويوتا', 'لكزس', 'نيسان', 'مرسيدس', 'بي إم دبليو', 'جي إم سي', 'شيفروليه', 'فورد', 'هوندا', 'هيونداي', 'كيا'],
  '2': ['شقق', 'فلل', 'أراضي', 'عمائر', 'استراحات', 'محلات تجارية', 'مكاتب', 'مزارع'],
  '3': ['هواتف', 'لابتوب', 'تابلت', 'تلفزيونات', 'كاميرات', 'أجهزة منزلية', 'سماعات', 'ألعاب فيديو'],
  '4': ['قطط', 'كلاب', 'طيور', 'أسماك', 'خيول', 'إبل', 'أرانب', 'حيوانات أخرى'],
  '5': ['إدارية', 'تقنية', 'هندسية', 'طبية', 'تعليمية', 'مبيعات', 'خدمة عملاء', 'سائقين', 'عمالة']
};
