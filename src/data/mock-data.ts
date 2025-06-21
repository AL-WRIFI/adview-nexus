import { Ad, Category, User, Comment, Conversation } from '../types';
// Import icons that we'll use by name
import { 
  Car, Home, Smartphone, Mouse, Briefcase, Wrench, Shirt, Gamepad, 
  Gem, ShoppingBag, Utensils, Laptop, BookOpen, Baby, Bike, Camera, FileText, 
  Headphones, Gift, Train
} from 'lucide-react';

export const CATEGORIES: Category[] = [
  { id: 1, name: 'سيارات', slug: 'cars', icon: 'Car', is_active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
  { id: 2, name: 'عقارات', slug: 'real-estate', icon: 'Home', is_active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
  { id: 3, name: 'إلكترونيات', slug: 'electronics', icon: 'Smartphone', is_active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
  { id: 4, name: 'حيوانات وطيور', slug: 'animals', icon: 'Mouse', is_active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
  { id: 5, name: 'وظائف', slug: 'jobs', icon: 'Briefcase', is_active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
  { id: 6, name: 'خدمات', slug: 'services', icon: 'Wrench', is_active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
  { id: 7, name: 'أزياء', slug: 'fashion', icon: 'Shirt', is_active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
  { id: 8, name: 'ألعاب', slug: 'games', icon: 'Gamepad', is_active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
  { id: 9, name: 'مقتنيات', slug: 'collectibles', icon: 'Gem', is_active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
  { id: 10, name: 'أثاث', slug: 'furniture', icon: 'ShoppingBag', is_active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
  { id: 11, name: 'مأكولات', slug: 'food', icon: 'Utensils', is_active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
  { id: 12, name: 'أجهزة', slug: 'devices', icon: 'Laptop', is_active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
  { id: 13, name: 'كتب', slug: 'books', icon: 'BookOpen', is_active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
  { id: 14, name: 'مستلزمات أطفال', slug: 'baby', icon: 'Baby', is_active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
  { id: 15, name: 'دراجات', slug: 'bikes', icon: 'Bike', is_active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
  { id: 16, name: 'كاميرات', slug: 'cameras', icon: 'Camera', is_active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
  { id: 17, name: 'وثائق', slug: 'documents', icon: 'FileText', is_active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
  { id: 18, name: 'سماعات', slug: 'headphones', icon: 'Headphones', is_active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
  { id: 19, name: 'هدايا', slug: 'gifts', icon: 'Gift', is_active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
  { id: 20, name: 'سفر', slug: 'travel', icon: 'Train', is_active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' }
];

export const USERS: User[] = [
  {
    id: 1,
    first_name: 'أحمد',
    last_name: 'محمد',
    username: 'ahmed_mohamed',
    email: 'ahmed@example.com',
    phone: '0500000000',
    image: 'https://i.pravatar.cc/150?img=1',
    state_id: 1,
    city_id: 1,
    address: null,
    email_verified: true,
    verified_status: 1,
    is_suspend: null,
    city: 'الرياض',
    created_at: new Date(2023, 0, 1).toISOString(),
    updated_at: new Date(2023, 0, 1).toISOString(),
    name: 'أحمد محمد',
    avatar: 'https://i.pravatar.cc/150?img=1',
    verified: true
  },
  {
    id: 2,
    first_name: 'خالد',
    last_name: 'العتيبي',
    username: 'khalid_alotaibi',
    email: 'khalid@example.com',
    phone: '0511111111',
    image: 'https://i.pravatar.cc/150?img=2',
    state_id: 2,
    city_id: 2,
    address: null,
    email_verified: true,
    verified_status: 1,
    is_suspend: null,
    city: 'جدة',
    created_at: new Date(2023, 1, 15).toISOString(),
    updated_at: new Date(2023, 1, 15).toISOString(),
    name: 'خالد العتيبي',
    avatar: 'https://i.pravatar.cc/150?img=2',
    verified: true
  },
  {
    id: 3,
    first_name: 'عبدالله',
    last_name: 'القحطاني',
    username: 'abdullah_alqahtani',
    email: 'abdullah@example.com',
    phone: '0522222222',
    image: 'https://i.pravatar.cc/150?img=3',
    state_id: 3,
    city_id: 3,
    address: null,
    email_verified: false,
    verified_status: null,
    is_suspend: null,
    city: 'الدمام',
    created_at: new Date(2023, 2, 10).toISOString(),
    updated_at: new Date(2023, 2, 10).toISOString(),
    name: 'عبدالله القحطاني',
    avatar: 'https://i.pravatar.cc/150?img=3',
    verified: false
  },
  {
    id: 4,
    first_name: 'سارة',
    last_name: 'الشمري',
    username: 'sara_alshamri',
    email: 'sara@example.com',
    phone: '0533333333',
    image: 'https://i.pravatar.cc/150?img=4',
    state_id: 4,
    city_id: 4,
    address: null,
    email_verified: true,
    verified_status: 1,
    is_suspend: null,
    city: 'مكة',
    created_at: new Date(2023, 3, 5).toISOString(),
    updated_at: new Date(2023, 3, 5).toISOString(),
    name: 'سارة الشمري',
    avatar: 'https://i.pravatar.cc/150?img=4',
    verified: true
  },
  {
    id: 5,
    first_name: 'نورة',
    last_name: 'العنزي',
    username: 'noura_alanazi',
    email: 'noura@example.com',
    phone: '0544444444',
    image: 'https://i.pravatar.cc/150?img=5',
    state_id: 5,
    city_id: 5,
    address: null,
    email_verified: false,
    verified_status: null,
    is_suspend: null,
    city: 'المدينة',
    created_at: new Date(2023, 4, 20).toISOString(),
    updated_at: new Date(2023, 4, 20).toISOString(),
    name: 'نورة العنزي',
    avatar: 'https://i.pravatar.cc/150?img=5',
    verified: false
  }
];

export const ADS: Ad[] = [
  {
    id: 1,
    title: 'تويوتا كامري 2022 خليجي',
    description: 'سيارة تويوتا كامري 2022 خليجي، فل كامل، ممشى قليل، بحالة ممتازة، اللون أبيض، المالك الأول',
    price: 120000,
    category_id: 1,
    user_id: 1,
    status: 'active',
    created_at: new Date(2023, 5, 10).toISOString(),
    updated_at: new Date(2023, 5, 10).toISOString(),
    images: [
      {
        id: 1,
        listing_id: 1,
        image_url: '/lovable-uploads/1c8bb087-b7a3-4d42-989b-3942f1844df7.png',
        is_primary: true,
        url: '/lovable-uploads/1c8bb087-b7a3-4d42-989b-3942f1844df7.png'
      },
      {
        id: 2,
        listing_id: 1,
        image_url: '/lovable-uploads/e294d6ab-081c-4d6e-9a30-e1f490614def.png',
        is_primary: false,
        url: '/lovable-uploads/e294d6ab-081c-4d6e-9a30-e1f490614def.png'
      }
    ],
    negotiable: true,
    condition: 'used',
    location: 'الرياض',
    featured: true,
    city: 'الرياض',
    city_name: 'الرياض',
    views_count: 156,
    viewCount: 156,
    is_negotiable: true,
    main_image_url: '/lovable-uploads/1c8bb087-b7a3-4d42-989b-3942f1844df7.png',
    image: '/lovable-uploads/1c8bb087-b7a3-4d42-989b-3942f1844df7.png',
    listing_type: 'sell'
  },
  {
    id: 2,
    title: 'شقة فاخرة للإيجار',
    description: 'شقة فاخرة للإيجار، 3 غرف نوم، صالة كبيرة، مطبخ حديث، حمامين، مدخل خاص، موقف سيارة، في حي الروضة',
    price: 35000,
    category_id: 2,
    user_id: 2,
    status: 'active',
    negotiable: false,
    condition: 'new',
    images: [
      {
        id: 1,
        listing_id: 2,
        image_url: '/lovable-uploads/1b313deb-e5e7-41ce-8caa-66081e55e8be.png',
        is_primary: true,
        url: '/lovable-uploads/1b313deb-e5e7-41ce-8caa-66081e55e8be.png'
      }
    ],
    category: 'عقارات',
    subcategory: 'شقق',
    city: 'جدة',
    district: 'الروضة',
    featured: false,
    views_count: 89,
    comments_count: 1,
    listing_type: 'sell',
    created_at: new Date(2023, 5, 12).toISOString(),
    updated_at: new Date(2023, 5, 12).toISOString()
  },
  {
    id: 3,
    title: 'ايفون 13 برو ماكس',
    description: 'ايفون 13 برو ماكس، 256 جيجا، لون أزرق، استخدام أسبوعين فقط، كامل الملحقات، ضمان سنة',
    price: 4800,
    category_id: 3,
    user_id: 3,
    status: 'active',
    negotiable: true,
    condition: 'used',
    images: [
      {
        id: 1,
        listing_id: 3,
        image_url: '/lovable-uploads/aa1c345e-13ff-4cb0-9d1f-3db22b25394c.png',
        is_primary: true,
        url: '/lovable-uploads/aa1c345e-13ff-4cb0-9d1f-3db22b25394c.png'
      }
    ],
    category: 'إلكترونيات',
    subcategory: 'هواتف',
    city: 'الرياض',
    district: 'العليا',
    featured: true,
    views_count: 204,
    comments_count: 5,
    listing_type: 'sell',
    created_at: new Date(2023, 5, 15).toISOString(),
    updated_at: new Date(2023, 5, 15).toISOString()
  },
  {
    id: 4,
    title: 'قطط سيامي للبيع',
    description: 'قطط سيامي أصيلة للبيع، عمرها شهرين، مطعمة بالكامل، لون أزرق، ذكر وأنثى',
    price: 1200,
    category_id: 4,
    user_id: 4,
    status: 'active',
    negotiable: true,
    condition: 'new',
    images: [
      {
        id: 1,
        listing_id: 4,
        image_url: '/lovable-uploads/fb4fed6b-6a92-490c-9fd8-6ddb94449efe.png',
        is_primary: true,
        url: '/lovable-uploads/fb4fed6b-6a92-490c-9fd8-6ddb94449efe.png'
      }
    ],
    category: 'حيوانات وطيور',
    subcategory: 'قطط',
    city: 'الدمام',
    district: 'الشاطئ',
    featured: false,
    views_count: 78,
    comments_count: 2,
    listing_type: 'sell',
    created_at: new Date(2023, 5, 18).toISOString(),
    updated_at: new Date(2023, 5, 18).toISOString()
  },
  {
    id: 5,
    title: 'مطلوب مبرمج تطبيقات',
    description: 'مطلوب مبرمج تطبيقات للعمل بدوام كامل، خبرة لا تقل عن 3 سنوات في مجال تطوير تطبيقات الجوال، رواتب مجزية',
    price: 0,
    category_id: 5,
    user_id: 5,
    status: 'active',
    negotiable: false,
    condition: 'new',
    images: [],
    category: 'وظائف',
    subcategory: 'تقنية',
    city: 'الرياض',
    district: 'العليا',
    featured: false,
    views_count: 45,
    comments_count: 0,
    listing_type: 'buy',
    created_at: new Date(2023, 5, 20).toISOString(),
    updated_at: new Date(2023, 5, 20).toISOString()
  },
  {
    id: 6,
    title: 'لكزس LX 570 موديل 2021',
    description: 'لكزس LX 570 موديل 2021، فل كامل، بلاك اديشن، ماشي 20 ألف كيلو، ضمان الوكالة، حالة ممتازة',
    price: 380000,
    category_id: 1,
    user_id: 1,
    status: 'active',
    negotiable: true,
    condition: 'used',
    images: [
      {
        id: 1,
        listing_id: 6,
        image_url: '/lovable-uploads/a41786e0-c4da-4307-980d-dfa0b52565ef.png',
        is_primary: true,
        url: '/lovable-uploads/a41786e0-c4da-4307-980d-dfa0b52565ef.png'
      }
    ],
    category: 'سيارات',
    subcategory: 'لكزس',
    city: 'مكة',
    district: 'العزيزية',
    featured: true,
    views_count: 132,
    comments_count: 4,
    listing_type: 'sell',
    created_at: new Date(2023, 5, 25).toISOString(),
    updated_at: new Date(2023, 5, 25).toISOString()
  },
  {
    id: 7,
    title: 'لابتوب ماك بوك برو',
    description: 'لابتوب ماك بوك برو 2022، شاشة 16 بوصة، معالج M1 Max، 32 جيجا رام، تخزين 1 تيرا، استخدام خفيف جدا',
    price: 12000,
    category_id: 3,
    user_id: 2,
    status: 'active',
    negotiable: true,
    condition: 'used',
    images: [
      {
        id: 1,
        listing_id: 7,
        image_url: '/lovable-uploads/61a4a3ea-b199-459a-9fe5-06f38cf3a80a.png',
        is_primary: true,
        url: '/lovable-uploads/61a4a3ea-b199-459a-9fe5-06f38cf3a80a.png'
      }
    ],
    category: 'إلكترونيات',
    subcategory: 'لابتوب',
    city: 'جدة',
    district: 'الصفا',
    featured: false,
    views_count: 65,
    comments_count: 1,
    listing_type: 'sell',
    created_at: new Date(2023, 5, 27).toISOString(),
    updated_at: new Date(2023, 5, 27).toISOString()
  },
  {
    id: 8,
    title: 'فيلا فاخرة للبيع',
    description: 'فيلا فاخرة للبيع في حي الرحاب، 6 غرف نوم، 7 حمامات، صالتين، مطبخ كبير، مسبح خارجي، جراج لسيارتين، حديقة',
    price: 2500000,
    category_id: 2,
    user_id: 3,
    status: 'active',
    negotiable: true,
    condition: 'new',
    images: [
      {
        id: 1,
        listing_id: 8,
        image_url: '/lovable-uploads/42caaf22-ff1f-4e6f-b286-e51d004d9231.png',
        is_primary: true,
        url: '/lovable-uploads/42caaf22-ff1f-4e6f-b286-e51d004d9231.png'
      }
    ],
    category: 'عقارات',
    subcategory: 'فلل',
    city: 'الرياض',
    district: 'الرحاب',
    featured: true,
    views_count: 98,
    comments_count: 3,
    listing_type: 'sell',
    created_at: new Date(2023, 5, 30).toISOString(),
    updated_at: new Date(2023, 5, 30).toISOString()
  },
  {
    id: 9,
    title: 'جلسة تصوير احترافية',
    description: 'جلسة تصوير احترافية للأفراد والعائلات والمناسبات، تصوير داخلي وخارجي، مع طباعة 10 صور بحجم كبير',
    price: 800,
    category_id: 6,
    user_id: 4,
    status: 'active',
    negotiable: false,
    condition: 'new',
    images: [
      {
        id: 1,
        listing_id: 9,
        image_url: '/lovable-uploads/ca9f9c33-a539-4bc0-871e-bb91ce4d7f6a.png',
        is_primary: true,
        url: '/lovable-uploads/ca9f9c33-a539-4bc0-871e-bb91ce4d7f6a.png'
      }
    ],
    category: 'خدمات',
    subcategory: 'تصوير',
    city: 'الدمام',
    district: 'النزهة',
    featured: false,
    views_count: 42,
    comments_count: 0,
    listing_type: 'service',
    created_at: new Date(2023, 6, 2).toISOString(),
    updated_at: new Date(2023, 6, 2).toISOString()
  },
  {
    id: 10,
    title: 'كنب مودERN جديد',
    description: 'كنب مودERN جديد، 7 مقاعد، لون رمادي، قماش مستورد ضد البقع، ضمان سنتين، مع طاولة وسط زجاج',
    price: 5500,
    category_id: 10,
    user_id: 5,
    status: 'active',
    negotiable: true,
    condition: 'new',
    images: [
      {
        id: 1,
        listing_id: 10,
        image_url: '/lovable-uploads/b5dfbd36-f217-4df4-92ca-85450a7a5809.png',
        is_primary: true,
        url: '/lovable-uploads/b5dfbd36-f217-4df4-92ca-85450a7a5809.png'
      }
    ],
    category: 'أثاث',
    subcategory: 'كنب',
    city: 'جدة',
    district: 'السلامة',
    featured: false,
    views_count: 55,
    comments_count: 1,
    listing_type: 'sell',
    created_at: new Date(2023, 6, 5).toISOString(),
    updated_at: new Date(2023, 6, 5).toISOString()
  }
];

export const COMMENTS: Record<string, Comment[]> = {
  '1': [
    {
      id: 1,
      content: 'كم آخر سعر؟',
      user_id: 2,
      listing_id: 1,
      created_at: new Date(2023, 5, 12).toISOString(),
      updated_at: new Date(2023, 5, 12).toISOString(),
      user: {
        id: 2,
        name: 'خالد العتيبي',
        avatar: 'https://i.pravatar.cc/150?img=2',
        image: 'https://i.pravatar.cc/150?img=2',
        first_name: 'خالد',
        last_name: 'العتيبي'
      },
      replies: [
        {
          id: 2,
          content: 'السعر 115 نهائي',
          user_id: 1,
          listing_id: 1,
          parent_id: 1,
          created_at: new Date(2023, 5, 12, 2).toISOString(),
          updated_at: new Date(2023, 5, 12, 2).toISOString(),
          user: {
            id: 1,
            name: 'أحمد محمد',
            avatar: 'https://i.pravatar.cc/150?img=1',
            image: 'https://i.pravatar.cc/150?img=1',
            first_name: 'أحمد',
            last_name: 'محمد'
          }
        }
      ]
    },
    {
      id: 3,
      content: 'هل فيه أي مشاكل فنية؟',
      user_id: 3,
      listing_id: 1,
      created_at: new Date(2023, 5, 15).toISOString(),
      updated_at: new Date(2023, 5, 15).toISOString(),
      user: {
        id: 3,
        name: 'عبدالله القحطاني',
        avatar: 'https://i.pravatar.cc/150?img=3',
        image: 'https://i.pravatar.cc/150?img=3',
        first_name: 'عبدالله',
        last_name: 'القحطاني'
      },
      replies: []
    }
  ],
  '3': [
    {
      id: 4,
      content: 'هل يوجد ضمان؟',
      user_id: 1,
      listing_id: 3,
      created_at: new Date(2023, 5, 16).toISOString(),
      updated_at: new Date(2023, 5, 16).toISOString(),
      user: {
        id: 1,
        name: 'أحمد محمد',
        avatar: 'https://i.pravatar.cc/150?img=1',
        image: 'https://i.pravatar.cc/150?img=1',
        first_name: 'أحمد',
        last_name: 'محمد'
      },
      replies: [
        {
          id: 5,
          content: 'نعم، ضمان سنة من الوكيل',
          user_id: 3,
          listing_id: 3,
          parent_id: 4,
          created_at: new Date(2023, 5, 16, 3).toISOString(),
          updated_at: new Date(2023, 5, 16, 3).toISOString(),
          user: {
            id: 3,
            name: 'عبدالله القحطاني',
            avatar: 'https://i.pravatar.cc/150?img=3',
            image: 'https://i.pravatar.cc/150?img=3',
            first_name: 'عبدالله',
            last_name: 'القحطاني'
          }
        }
      ]
    },
    {
      id: 6,
      content: 'هل الاستخدام فعلاً أسبوعين؟',
      user_id: 4,
      listing_id: 3,
      created_at: new Date(2023, 5, 17).toISOString(),
      updated_at: new Date(2023, 5, 17).toISOString(),
      user: {
        id: 4,
        name: 'سارة الشمري',
        avatar: 'https://i.pravatar.cc/150?img=4',
        image: 'https://i.pravatar.cc/150?img=4',
        first_name: 'سارة',
        last_name: 'الشمري'
      },
      replies: [
        {
          id: 7,
          content: 'نعم، اشتريته ولم يناسبني',
          user_id: 3,
          listing_id: 3,
          parent_id: 6,
          created_at: new Date(2023, 5, 17, 1).toISOString(),
          updated_at: new Date(2023, 5, 17, 1).toISOString(),
          user: {
            id: 3,
            name: 'عبدالله القحطاني',
            avatar: 'https://i.pravatar.cc/150?img=3',
            image: 'https://i.pravatar.cc/150?img=3',
            first_name: 'عبدالله',
            last_name: 'القحطاني'
          }
        }
      ]
    }
  ]
};

export const CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    listing: {
      id: 1,
      title: 'تويوتا كامري 2022 خليجي',
      price: 120000,
      main_image_url: '/lovable-uploads/1c8bb087-b7a3-4d42-989b-3942f1844df7.png'
    },
    other_user: USERS[1],
    last_message: {
      id: 1,
      content: 'هل مازالت السيارة متوفرة؟',
      sender_id: 2,
      conversation_id: 1,
      created_at: new Date(2023, 5, 11).toISOString(),
      sender: USERS[1]
    },
    unread_count: 0,
    created_at: new Date(2023, 5, 11).toISOString(),
    updated_at: new Date(2023, 5, 11).toISOString(),
    participants: [USERS[0], USERS[1]]
  },
  {
    id: 2,
    listing: {
      id: 1,
      title: 'تويوتا كامري 2022 خليجي',
      price: 120000,
      main_image_url: '/lovable-uploads/1c8bb087-b7a3-4d42-989b-3942f1844df7.png'
    },
    other_user: USERS[2],
    last_message: {
      id: 2,
      content: 'هل يمكن المعاينة غداً؟',
      sender_id: 1,
      conversation_id: 2,
      created_at: new Date(2023, 5, 16).toISOString(),
      sender: USERS[0]
    },
    unread_count: 1,
    created_at: new Date(2023, 5, 16).toISOString(),
    updated_at: new Date(2023, 5, 16).toISOString(),
    participants: [USERS[0], USERS[2]]
  }
];

export const FEATURED_PACKAGES = [
  { id: 1, name: 'عرض لمدة يوم', price: 50, duration: 1, description: 'عرض الإعلان في الصفحة الرئيسية لمدة يوم واحد' },
  { id: 2, name: 'عرض لمدة أسبوع', price: 300, duration: 7, description: 'عرض الإعلان في الصفحة الرئيسية لمدة أسبوع كامل' },
  { id: 3, name: 'عرض لمدة شهر', price: 1000, duration: 30, description: 'عرض الإعلان في الصفحة الرئيسية لمدة شهر كامل' }
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
  '5': ['تقنية', 'محاسبة', 'تسويق', 'مبيعات', 'إدارة', 'تصميم', 'هندسة', 'طب', 'تعليم', 'أخرى'],
  '6': ['صيانة', 'تنظيف', 'نقل', 'تصوير', 'تصميم', 'برمجة', 'استشارات', 'أخرى'],
  '7': ['رجالي', 'نسائي', 'أطفال', 'أحذية', 'حقائب', 'إكسسوارات', 'ساعات', 'نظارات'],
  '8': ['بلايستيشن', 'إكس بوكس', 'نينتندو', 'ألعاب كمبيوتر', 'ألعاب موبايل', 'ألعاب طاولة', 'ألعاب تقليدية'],
  '9': ['طوابع', 'عملات', 'تحف', 'كتب قديمة', 'ساعات قديمة', 'مقتنيات رياضية', 'فن وتحف'],
  '10': ['غرف نوم', 'صالات', 'مطابخ', 'حمامات', 'مكاتب', 'أطفال', 'حدائق', 'ديكور']
};
