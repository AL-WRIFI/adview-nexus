
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListing, useUpdateListing, useStates, useCities, useCategories, useSubCategories, useChildCategories } from '@/hooks/use-api';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Upload, X, Image as ImageIcon, Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Listing } from '@/types';

// Define form schema with Zod
const formSchema = z.object({
  title: z.string().min(5, { message: 'العنوان يجب أن يكون 5 أحرف على الأقل' }).max(100, { message: 'العنوان يجب أن لا يتجاوز 100 حرف' }),
  description: z.string().min(20, { message: 'الوصف يجب أن يكون 20 حرف على الأقل' }).max(1000, { message: 'الوصف يجب أن لا يتجاوز 1000 حرف' }),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, { message: 'الرجاء إدخال سعر صحيح' }),
  is_negotiable: z.boolean().default(false),
  condition: z.enum(['new', 'used']),
  listing_type: z.enum(['sell', 'buy', 'exchange', 'service']),
  category_id: z.string(),
  sub_category_id: z.string().optional(),
  child_category_id: z.string().optional(),
  brand_id: z.string().optional(),
  model: z.string().optional(),
  state_id: z.string(),
  city_id: z.string(),
  district_id: z.string().optional(),
  address: z.string().optional(),
  has_delivery: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const listingTypeOptions = [
  { label: 'بيع', value: 'sell' },
  { label: 'شراء', value: 'buy' },
  { label: 'استبدال', value: 'exchange' },
  { label: 'خدمة', value: 'service' },
];

const conditionOptions = [
  { label: 'جديد', value: 'new' },
  { label: 'مستعمل', value: 'used' },
];

export default function EditAd() {
  const { listingId } = useParams();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch data using custom hooks
  const { data: listing, isLoading: isLoadingListing } = useListing(Number(listingId));
  const { data: states } = useStates();
  const { data: cities } = useCities(selectedState ? parseInt(selectedState) : undefined);
  const { data: categories } = useCategories();
  const { data: subCategories } = useSubCategories();
  const { data: childCategories } = useChildCategories();
  const updateListing = useUpdateListing(Number(listingId));
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      is_negotiable: false,
      condition: 'new',
      listing_type: 'sell',
      category_id: '',
      sub_category_id: '',
      child_category_id: '',
      brand_id: '',
      model: '',
      state_id: '',
      city_id: '',
      district_id: '',
      address: '',
      has_delivery: false,
    }
  });
  
  // Set form values when listing data is loaded
  useEffect(() => {
    if (listing) {
      form.reset({
        title: listing.title || '',
        description: listing.description || '',
        price: listing.price?.toString() || '',
        is_negotiable: listing.is_negotiable || false,
        condition: listing.condition || 'new',
        listing_type: listing.listing_type || 'sell',
        category_id: listing.category_id?.toString() || '',
        sub_category_id: listing.sub_category_id?.toString() || '',
        child_category_id: listing.sub_category_id?.toString() || '',
        brand_id: listing.brand_id?.toString() || '',
        model: listing.model || '',
        state_id: listing.state_id?.toString() || '',
        city_id: listing.city_id?.toString() || '',
        district_id: listing.district_id?.toString() || '',
        address: listing.address || '',
        has_delivery: false,
      });
      
      setSelectedState(listing.state_id?.toString() || '');
      setSelectedCategory(listing.category_id?.toString() || '');
      setSelectedSubCategory(listing.sub_category_id?.toString() || '');
      
      if (listing.images && Array.isArray(listing.images)) {
        setExistingImages(listing.images);
      } else if (listing.image) {
        setExistingImages([listing.image]);
      }
    }
  }, [listing, form]);

  // Handle image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (!files || files.length === 0) return;
    
    const newImages: File[] = [];
    const newPreviews: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "الصورة كبيرة جداً",
          description: `الصورة ${file.name} أكبر من 5 ميجابايت`,
          variant: "destructive",
        });
        continue;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "نوع الملف غير مدعوم",
          description: "الرجاء اختيار صور فقط",
          variant: "destructive",
        });
        continue;
      }
      
      newImages.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }
    
    setSelectedImages((prev) => [...prev, ...newImages]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };
  
  // Remove image preview
  const removeImage = (index: number) => {
    setSelectedImages((prev) => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
    
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };
  
  // Remove existing image
  const removeExistingImage = (index: number) => {
    const imageToRemove = existingImages[index];
    setRemovedImages((prev) => [...prev, imageToRemove]);
    
    setExistingImages((prev) => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // Form submission handler
  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      setError('');
      
      // Create FormData object
      const formData = new FormData();
      
      // Append text fields
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value.toString());
        }
      });
      
      // Add removed images
      removedImages.forEach(image => {
        formData.append('removed_images[]', image);
      });
      
      // Add new images
      selectedImages.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });
      
      // Add method for API compatibility (most APIs use POST with _method=PUT)
      formData.append('_method', 'PUT');
      
      // Submit form
      await updateListing.mutateAsync(formData);
      
      toast({
        title: "تم تحديث الإعلان بنجاح",
        description: "سيظهر الإعلان بعد مراجعته من قبل المشرفين",
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error("Error updating listing:", error);
      setError(error instanceof Error ? error.message : 'حدث خطأ أثناء تحديث الإعلان');
      toast({
        title: "فشل تحديث الإعلان",
        description: error instanceof Error ? error.message : 'حدث خطأ أثناء تحديث الإعلان',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth/login', { state: { from: `/edit-ad/${listingId}` } });
    }
  }, [isLoggedIn, navigate, listingId]);

  // Redirect if not ad owner
  useEffect(() => {
    if (listing && user && listing.user_id !== user.id) {
      toast({
        title: "غير مصرح",
        description: "لا يمكنك تعديل هذا الإعلان لأنه ليس من إعلاناتك",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [listing, user, navigate]);

  // Loading state
  if (isLoadingListing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-medium">جاري التحميل...</h2>
            <p className="text-muted-foreground">الرجاء الانتظار</p>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  // Check if listing exists
  if (!listing && !isLoadingListing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium">الإعلان غير موجود</h2>
            <p className="text-muted-foreground">لم يتم العثور على الإعلان المطلوب</p>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="mt-4"
            >
              العودة للوحة التحكم
            </Button>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-950">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="ml-2 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة للوحة التحكم
          </Button>
          <h1 className="text-2xl font-bold dark:text-white">تعديل الإعلان</h1>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="dark:bg-gray-900 dark:border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 dark:text-white">معلومات الإعلان الأساسية</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300">عنوان الإعلان *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="عنوان الإعلان"
                            className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="listing_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300">نوع الإعلان *</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                              <SelectValue placeholder="اختر نوع الإعلان" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                            {listingTypeOptions.map(option => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="dark:text-gray-200 dark:focus:bg-gray-700"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-6">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300">وصف الإعلان *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="وصف مفصل للإعلان"
                            className="min-h-32 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300">السعر *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="السعر"
                            className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="is_negotiable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-0 space-y-0 space-x-reverse rounded-md p-4 border dark:border-gray-700">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="dark:border-gray-600"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none mr-2">
                          <FormLabel className="dark:text-gray-300">
                            قابل للتفاوض
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-6">
                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300">حالة المنتج *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-row gap-4"
                          >
                            {conditionOptions.map(option => (
                              <FormItem key={option.value} className="flex items-center space-x-2 space-x-reverse">
                                <FormControl>
                                  <RadioGroupItem value={option.value} className="dark:border-gray-600" />
                                </FormControl>
                                <FormLabel className="font-normal dark:text-gray-300">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="dark:bg-gray-900 dark:border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 dark:text-white">التصنيف</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300">التصنيف الرئيسي *</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedCategory(value);
                            form.setValue("sub_category_id", "");
                            form.setValue("child_category_id", "");
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                              <SelectValue placeholder="اختر التصنيف" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                            {categories?.map(category => (
                              <SelectItem 
                                key={category.id}
                                value={String(category.id)}
                                className="dark:text-gray-200 dark:focus:bg-gray-700"
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sub_category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300">التصنيف الفرعي</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedSubCategory(value);
                            form.setValue("child_category_id", "");
                          }}
                          disabled={!selectedCategory}
                        >
                          <FormControl>
                            <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                              <SelectValue placeholder="اختر التصنيف الفرعي" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                            {subCategories?.filter(
                              subCat => subCat.parent_id === parseInt(selectedCategory)
                            ).map(subCategory => (
                              <SelectItem 
                                key={subCategory.id} 
                                value={String(subCategory.id)}
                                className="dark:text-gray-200 dark:focus:bg-gray-700"
                              >
                                {subCategory.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="child_category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300">التصنيف الفرعي 2</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!selectedSubCategory}
                        >
                          <FormControl>
                            <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                              <SelectValue placeholder="اختر التصنيف الفرعي" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                            {childCategories?.filter(
                              childCat => childCat.parent_id === parseInt(selectedSubCategory)
                            ).map(childCategory => (
                              <SelectItem 
                                key={childCategory.id} 
                                value={String(childCategory.id)}
                                className="dark:text-gray-200 dark:focus:bg-gray-700"
                              >
                                {childCategory.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="dark:bg-gray-900 dark:border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 dark:text-white">الموقع</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="state_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300">المحافظة *</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedState(value);
                            form.setValue("city_id", "");
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                              <SelectValue placeholder="اختر المحافظة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                            {states?.map(state => (
                              <SelectItem 
                                key={state.id} 
                                value={String(state.id)}
                                className="dark:text-gray-200 dark:focus:bg-gray-700"
                              >
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300">المدينة *</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!selectedState}
                        >
                          <FormControl>
                            <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                              <SelectValue placeholder="اختر المدينة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                            {cities?.map(city => (
                              <SelectItem 
                                key={city.id} 
                                value={String(city.id)}
                                className="dark:text-gray-200 dark:focus:bg-gray-700"
                              >
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-6">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300">العنوان التفصيلي</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="العنوان التفصيلي (اختياري)"
                            className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="dark:bg-gray-900 dark:border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 dark:text-white">صور الإعلان</h2>
                
                <div className="space-y-6">
                  <div className="border-2 border-dashed dark:border-gray-700 rounded-lg p-6 text-center">
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageSelect}
                      disabled={loading}
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center h-full cursor-pointer"
                    >
                      <Upload className="h-10 w-10 text-gray-400 mb-2 dark:text-gray-500" />
                      <span className="text-base font-medium dark:text-gray-300">اضغط لاختيار الصور</span>
                      <span className="text-sm text-muted-foreground dark:text-gray-400">
                        PNG, JPG, JPEG، حتى 5 ميجا
                      </span>
                    </label>
                  </div>
                  
                  {(existingImages.length > 0 || imagePreviews.length > 0) && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-3 dark:text-white">الصور الحالية</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {existingImages.map((image, index) => (
                          <div key={`existing-${index}`} className="relative group rounded-md overflow-hidden aspect-square border dark:border-gray-700">
                            <img
                              src={image}
                              alt={`صورة ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="absolute top-1 left-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              disabled={loading}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        
                        {imagePreviews.map((preview, index) => (
                          <div key={`new-${index}`} className="relative group rounded-md overflow-hidden aspect-square border dark:border-gray-700">
                            <img
                              src={preview}
                              alt={`صورة جديدة ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-1 right-1 bg-green-500 text-white px-1.5 py-0.5 text-xs rounded-sm">
                              جديد
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 left-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              disabled={loading}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {existingImages.length === 0 && imagePreviews.length === 0 && (
                    <div className="flex items-center justify-center p-4 border rounded-md dark:border-gray-700">
                      <div className="flex items-center text-muted-foreground dark:text-gray-400">
                        <ImageIcon className="h-5 w-5 mr-2" />
                        <span>لا توجد صور حاليًا</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end space-x-4 space-x-reverse">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                disabled={loading}
              >
                إلغاء
              </Button>
              
              <Button
                type="submit"
                disabled={loading}
                className="gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <Save className="h-4 w-4 ml-2" />
                حفظ التعديلات
              </Button>
            </div>
          </form>
        </Form>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}
