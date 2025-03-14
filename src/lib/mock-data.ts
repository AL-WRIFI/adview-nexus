
import { Listing, conditions } from '@/types/listing';

// Generate a random listing for demo purposes
export const generateMockListing = (id: number): Listing => {
  const randomPrice = Math.floor(Math.random() * 10000) + 100;
  const randomViews = Math.floor(Math.random() * 1000);
  const randomConditionIndex = Math.floor(Math.random() * conditions.length);
  
  return {
    id,
    user_id: 1,
    admin_id: Math.random() > 0.5 ? 1 : undefined,
    category_id: Math.floor(Math.random() * 5) + 1,
    sub_category_id: Math.random() > 0.5 ? Math.floor(Math.random() * 10) + 1 : undefined,
    child_category_id: Math.random() > 0.7 ? Math.floor(Math.random() * 15) + 1 : undefined,
    brand_id: Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 1 : undefined,
    country_id: 1,
    state_id: Math.floor(Math.random() * 50) + 1,
    city_id: Math.floor(Math.random() * 100) + 1,
    title: `Premium Designer ${['Watch', 'Phone', 'Laptop', 'Camera', 'Headphones'][Math.floor(Math.random() * 5)]} - Limited Edition`,
    slug: `premium-product-${id}`,
    description: "This premium product features a sleek, minimalist design inspired by the best industrial designers in the world. Crafted with precision and attention to detail, it offers exceptional performance and durability. The clean lines and high-quality materials reflect a commitment to excellence in both form and function. Whether you're a professional or an enthusiast, this product will exceed your expectations with its intuitive interface and premium build quality. It represents the perfect balance between innovation and usability, making complex technology accessible through thoughtful design.",
    image: `https://picsum.photos/seed/${id}/800/600`,
    gallery_images: JSON.stringify([
      `https://picsum.photos/seed/${id + 100}/800/600`,
      `https://picsum.photos/seed/${id + 200}/800/600`,
      `https://picsum.photos/seed/${id + 300}/800/600`,
    ]),
    video_url: Math.random() > 0.7 ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : undefined,
    price: randomPrice,
    negotiable: Math.random() > 0.5,
    condition: conditions[randomConditionIndex],
    contact_name: "Alex Johnson",
    email: "contact@example.com",
    phone: "+1 (555) 123-4567",
    phone_hidden: Math.random() > 0.7,
    address: "123 Design Blvd, San Francisco, CA 94107",
    lon: "-122.4194",
    lat: "37.7749",
    is_featured: Math.random() > 0.7,
    view: randomViews,
    status: ['active', 'pending', 'sold'][Math.floor(Math.random() * 3)],
    is_published: true,
    published_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    
    // Related data
    category: {
      id: Math.floor(Math.random() * 5) + 1,
      name: ['Electronics', 'Fashion', 'Home & Garden', 'Vehicles', 'Services'][Math.floor(Math.random() * 5)],
      slug: 'category-slug',
    },
    brand: Math.random() > 0.5 ? {
      id: Math.floor(Math.random() * 20) + 1,
      name: ['Apple', 'Samsung', 'Sony', 'Google', 'Microsoft'][Math.floor(Math.random() * 5)],
      logo: 'brand-logo.png'
    } : undefined,
    location: {
      country: 'United States',
      state: 'California',
      city: 'San Francisco',
      full_address: "123 Design Blvd, San Francisco, CA 94107, United States"
    }
  };
};

export const getMockListing = (id: number): Promise<Listing> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockListing(id));
    }, 500);
  });
};
