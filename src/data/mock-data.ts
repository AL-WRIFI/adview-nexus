
// Mock data for development and testing
import { Listing, Category, User, Comment, Conversation } from "../types";

export const mockCategories: Category[] = [
  {
    id: 1,
    name: "سيارات",
    description: "سيارات ومركبات",
    image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=200&fit=crop",
    count: 150,
    subcategories: [
      { id: 11, name: "سيارات للبيع", parent_id: 1 },
      { id: 12, name: "قطع غيار", parent_id: 1 }
    ]
  },
  {
    id: 2,
    name: "عقارات",
    description: "شقق ومنازل ومكاتب",
    image_url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&h=200&fit=crop",
    count: 200,
    subcategories: [
      { id: 21, name: "شقق للبيع", parent_id: 2 },
      { id: 22, name: "منازل للإيجار", parent_id: 2 }
    ]
  }
];

export const mockListings: Listing[] = [
  {
    id: 1,
    title: "سيارة تويوتا كامري 2020",
    description: "سيارة في حالة ممتازة",
    price: 50000,
    listing_type: "sell",
    condition: "used",
    main_image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop"],
    category_id: 1,
    featured: true,
    views_count: 25,
    created_at: new Date().toISOString()
  }
];

export const mockUsers: User[] = [
  {
    id: "1",
    first_name: "أحمد",
    last_name: "محمد",
    username: "ahmed_mohamed",
    email: "ahmed@example.com",
    phone: "+963123456789",
    verified: true
  }
];

export const mockComments: Comment[] = [
  {
    id: 1,
    content: "هل السيارة متاحة؟",
    listing_id: 1,
    user_id: "1",
    created_at: new Date().toISOString()
  }
];

export const mockConversations: Conversation[] = [
  {
    id: 1,
    listing_id: 1,
    buyer_id: "1",
    seller_id: "2",
    last_message_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  }
];
