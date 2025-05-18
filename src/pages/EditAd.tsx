
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
import { 
  Loader2, Upload, X, Image as ImageIcon, Save, ArrowLeft, 
  ChevronRight, CheckCircle, Trash2, Plus, CameraIcon
} from 'lucide-react';
import { useGeolocation } from '@/hooks/use-geolocation';
import { Listing } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { Progress } from '@/components/ui/progress';

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

// Steps in the edit process
const steps = [
  { id: 'basic', label: 'المعلومات الأساسية' },
  { id: 'category', label: 'التصنيف' },
  { id: 'location', label: 'الموقع' },
  { id: 'images', label: 'الصور' },
];

export default function EditAd() {
  const { listingId } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch data using custom hooks
  const { data: listing, isLoading: isLoadingListing } = useListing(Number(listingId));
  const { data: states } = useStates();
  const { data: cities } = useCities(selectedState ? parseInt(selectedState) : undefined);
  const { data: categories } = useCategories();
  const { data: subCategories } = useSubCategories(selectedCategory ? parseInt(selectedCategory) : undefined);
  const { data: childCategories } = useChildCategories(selectedSubCategory ? parseInt(selectedSubCategory) : undefined);
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
        has_delivery: listing.has_delivery || false,
      });
      
      setSelectedState(listing.state_id?.toString() || '');
      setSelectedCategory(listing.category_id?.toString() || '');
      setSelectedSubCategory(listing.sub_category_id?.toString() || '');
      
      if (listing.images && Array.isArray(listing.images)) {
        setExistingImages(listing.images);
        // Set the first image as featured by default
        if (listing.images.length > 0) {
          setFeaturedImage(listing.images[0]);
        }
      } else if (listing.image) {
        setExistingImages([listing.image]);
        setFeaturedImage(listing.image);
      }
    }
  }, [listing, form]);

  // Simulate progress during image upload
  const simulateImageUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    
    return () => clearInterval(interval);
  };

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
    
    // Run upload progress animation
    simulateImageUpload();
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
    
    // If it's the featured image, reset featured image
    if (featuredImage === imageToRemove) {
      const remainingImages = [...existingImages];
      remainingImages.splice(index, 1);
      setFeaturedImage(remainingImages.length > 0 ? remainingImages[0] : null);
    }
    
    setExistingImages((prev) => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };
  
  // Set an image as featured
  const setAsFeatured = (imageUrl: string) => {
    setFeaturedImage(imageUrl);
    toast({
      title: "تم تعيين الصورة الرئيسية",
      description: "تم تعيين الصورة كصورة رئيسية بنجاح",
    });
  };

  // Handle moving to next step
  const goToNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(current => current + 1);
    }
  };

  // Handle moving to previous step
  const goToPrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(current => current - 1);
    }
  };

  // Go to specific step
  const goToStep = (index: number) => {
    setActiveStep(index);
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
      
      // Add featured image
      if (featuredImage) {
        formData.append('featured_image', featuredImage);
      }
      
      // Add new images
      selectedImages.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });
      
      // Add method for API compatibility (most APIs use POST with _method=PUT)
      formData.append('_method', 'PUT');
      
      // Simulate upload progress
      const cleanupProgress = simulateImageUpload();
      
      // Submit form
      await updateListing.mutateAsync(formData);
      
      // Cleanup progress simulation
      cleanupProgress();
      
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
    if (!token) {
      navigate('/auth/login', { state: { from: `/edit-ad/${listingId}` } });
    }
  }, [token, navigate, listingId]);

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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
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

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="hidden sm:flex justify-between items-center mb-4">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => goToStep(idx)}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                    activeStep >= idx 
                      ? "bg-primary text-white" 
                      : "bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  )}
                >
                  {activeStep > idx ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </button>
                <span 
                  className={cn(
                    "hidden md:block mr-2 font-medium",
                    activeStep >= idx 
                      ? "text-primary dark:text-primary" 
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {step.label}
                </span>
                {idx < steps.length - 1 && (
                  <div 
                    className={cn(
                      "hidden md:block w-16 h-1 mx-2",
                      activeStep > idx 
                        ? "bg-primary" 
                        : "bg-gray-200 dark:bg-gray-800"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="block sm:hidden mb-4">
            <div className="text-center mb-2 font-medium text-primary dark:text-primary">
              {steps[activeStep].label} ({activeStep + 1}/{steps.length})
            </div>
            <Progress value={(activeStep + 1) / steps.length * 100} className="h-2" />
          </div>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Basic Information */}
            {activeStep === 0 && (
              <Card className="overflow-hidden border-none shadow-lg dark:bg-gray-900 dark:border-gray-800">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 px-6 py-4 border-b dark:border-gray-800">
                  <h2 className="text-xl font-bold dark:text-white">المعلومات الأساسية</h2>
                </div>
                
                <CardContent className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium dark:text-gray-300">عنوان الإعلان *</FormLabel>
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
                          <FormLabel className="font-medium dark:text-gray-300">نوع الإعلان *</FormLabel>
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
                          <FormLabel className="font-medium dark:text-gray-300">وصف الإعلان *</FormLabel>
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
                          <FormLabel className="font-medium dark:text-gray-300">السعر *</FormLabel>
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
                      name="condition"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="font-medium dark:text-gray-300">حالة المنتج *</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex gap-4"
                            >
                              {conditionOptions.map(option => (
                                <div key={option.value} className="flex items-center space-x-2 space-x-reverse">
                                  <RadioGroupItem 
                                    value={option.value} 
                                    id={`condition-${option.value}`} 
                                    className="dark:border-gray-600" 
                                  />
                                  <FormLabel 
                                    htmlFor={`condition-${option.value}`} 
                                    className="font-normal dark:text-gray-300 cursor-pointer"
                                  >
                                    {option.label}
                                  </FormLabel>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <FormField
                      control={form.control}
                      name="is_negotiable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-x-reverse rounded-md p-4 bg-primary/5 dark:bg-gray-800">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-1 dark:border-gray-600"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-medium dark:text-gray-300">
                              قابل للتفاوض
                            </FormLabel>
                            <p className="text-sm text-muted-foreground dark:text-gray-400">
                              حدد هذا الخيار إذا كنت ترغب بالتفاوض على السعر
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <FormField
                      control={form.control}
                      name="has_delivery"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-x-reverse rounded-md p-4 bg-primary/5 dark:bg-gray-800">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-1 dark:border-gray-600"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-medium dark:text-gray-300">
                              توفر خدمة التوصيل
                            </FormLabel>
                            <p className="text-sm text-muted-foreground dark:text-gray-400">
                              حدد هذا الخيار إذا كنت توفر خدمة توصيل لهذا المنتج
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Step 2: Category */}
            {activeStep === 1 && (
              <Card className="overflow-hidden border-none shadow-lg dark:bg-gray-900 dark:border-gray-800">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 px-6 py-4 border-b dark:border-gray-800">
                  <h2 className="text-xl font-bold dark:text-white">التصنيف</h2>
                </div>
                
                <CardContent className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium dark:text-gray-300">التصنيف الرئيسي *</FormLabel>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {categories?.map(category => (
                              <div 
                                key={category.id} 
                                className={cn(
                                  "border rounded-lg p-4 cursor-pointer transition-all",
                                  field.value === category.id.toString()
                                    ? "bg-primary/10 border-primary dark:bg-primary/20 dark:border-primary"
                                    : "hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-800"
                                )}
                                onClick={() => {
                                  field.onChange(category.id.toString());
                                  setSelectedCategory(category.id.toString());
                                  form.setValue("sub_category_id", "");
                                  form.setValue("child_category_id", "");
                                }}
                              >
                                <div className="flex flex-col items-center text-center">
                                  <CategoryIcon 
                                    iconName={category.name}
                                    iconPath={category.icon}
                                    className={cn(
                                      "h-12 w-12 mb-3",
                                      field.value === category.id.toString()
                                        ? "text-primary"
                                        : "text-gray-500 dark:text-gray-400"
                                    )} 
                                  />
                                  <span className="font-medium">{category.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {selectedCategory && (
                      <FormField
                        control={form.control}
                        name="sub_category_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium dark:text-gray-300">التصنيف الفرعي</FormLabel>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {subCategories?.filter(
                                subCat => subCat.parent_id === parseInt(selectedCategory)
                              ).map(subCategory => (
                                <div 
                                  key={subCategory.id} 
                                  className={cn(
                                    "border rounded-lg p-3 cursor-pointer transition-all",
                                    field.value === subCategory.id.toString()
                                      ? "bg-primary/10 border-primary dark:bg-primary/20 dark:border-primary"
                                      : "hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700"
                                  )}
                                  onClick={() => {
                                    field.onChange(subCategory.id.toString());
                                    setSelectedSubCategory(subCategory.id.toString());
                                    form.setValue("child_category_id", "");
                                  }}
                                >
                                  <div className="flex items-center">
                                    {field.value === subCategory.id.toString() && (
                                      <CheckCircle className="h-4 w-4 text-primary ml-2 flex-shrink-0" />
                                    )}
                                    <span className="font-medium">{subCategory.name}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    {selectedSubCategory && childCategories && childCategories.length > 0 && (
                      <FormField
                        control={form.control}
                        name="child_category_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium dark:text-gray-300">التصنيف الفرعي الثانوي</FormLabel>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {childCategories?.filter(
                                childCat => childCat.parent_id === parseInt(selectedSubCategory)
                              ).map(childCategory => (
                                <div 
                                  key={childCategory.id} 
                                  className={cn(
                                    "border rounded-lg p-3 cursor-pointer transition-all",
                                    field.value === childCategory.id.toString()
                                      ? "bg-primary/10 border-primary dark:bg-primary/20 dark:border-primary"
                                      : "hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700"
                                  )}
                                  onClick={() => field.onChange(childCategory.id.toString())}
                                >
                                  <div className="flex items-center">
                                    {field.value === childCategory.id.toString() && (
                                      <CheckCircle className="h-4 w-4 text-primary ml-2 flex-shrink-0" />
                                    )}
                                    <span className="font-medium">{childCategory.name}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Step 3: Location */}
            {activeStep === 2 && (
              <Card className="overflow-hidden border-none shadow-lg dark:bg-gray-900 dark:border-gray-800">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 px-6 py-4 border-b dark:border-gray-800">
                  <h2 className="text-xl font-bold dark:text-white">الموقع</h2>
                </div>
                
                <CardContent className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <FormField
                      control={form.control}
                      name="state_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium dark:text-gray-300">المحافظة *</FormLabel>
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
                          <FormLabel className="font-medium dark:text-gray-300">المدينة *</FormLabel>
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
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium dark:text-gray-300">العنوان التفصيلي</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="العنوان التفصيلي (اختياري)"
                            className="min-h-24 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-sm text-muted-foreground mt-1 dark:text-gray-400">
                          يمكنك إضافة معلومات إضافية عن الموقع هنا
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </CardContent>
              </Card>
            )}
            
            {/* Step 4: Images */}
            {activeStep === 3 && (
              <Card className="overflow-hidden border-none shadow-lg dark:bg-gray-900 dark:border-gray-800">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 px-6 py-4 border-b dark:border-gray-800">
                  <h2 className="text-xl font-bold dark:text-white">صور الإعلان</h2>
                </div>
                
                <CardContent className="p-6 md:p-8">
                  <div className="space-y-6">
                    <div 
                      className={cn(
                        "border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer",
                        "hover:bg-gray-50 dark:hover:bg-gray-800/50 dark:border-gray-700"
                      )}
                    >
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
                        <div className="bg-primary/10 rounded-full p-3 mb-3 dark:bg-primary/20">
                          <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-base font-medium dark:text-gray-300">اضغط لاختيار الصور</span>
                        <span className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
                          PNG, JPG, JPEG، حتى 5 ميجا
                        </span>
                        <p className="text-sm text-muted-foreground mt-3 dark:text-gray-400">
                          اختر صورة رئيسية واضحة للإعلان لزيادة فرص الظهور
                        </p>
                      </label>
                    </div>
                    
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>جاري الرفع...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                      </div>
                    )}
                    
                    {/* Featured Image Selection */}
                    {(existingImages.length > 0 || imagePreviews.length > 0) && (
                      <div className="mt-8">
                        <h3 className="font-medium mb-3 dark:text-white text-lg">الصورة الرئيسية</h3>
                        <p className="text-sm text-muted-foreground mb-4 dark:text-gray-400">
                          الصورة الرئيسية هي أول ما سيراه المستخدمون في نتائج البحث
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                            {featuredImage ? (
                              <img
                                src={featuredImage}
                                alt="الصورة الرئيسية"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center h-full text-muted-foreground dark:text-gray-400">
                                <ImageIcon className="h-12 w-12 mb-2" />
                                <span>اختر صورة رئيسية</span>
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2 dark:text-white">اختر الصورة الرئيسية</h4>
                            <p className="text-sm text-muted-foreground mb-4 dark:text-gray-400">
                              اختر من الصور المرفقة أدناه أو قم برفع صور جديدة
                            </p>
                          </div>
                        </div>
                        
                        <h3 className="font-medium mb-3 dark:text-white text-lg">كل الصور</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {existingImages.map((image, index) => (
                            <div key={`existing-${index}`} className="relative group rounded-md overflow-hidden aspect-square border dark:border-gray-700">
                              <img
                                src={image}
                                alt={`صورة ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-8 w-8 rounded-full bg-white text-black hover:bg-white/90"
                                  onClick={() => setAsFeatured(image)}
                                >
                                  <CameraIcon className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-8 w-8 rounded-full bg-white text-destructive hover:bg-white/90" 
                                  onClick={() => removeExistingImage(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              {featuredImage === image && (
                                <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 text-xs font-medium rounded-sm">
                                  رئيسية
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {imagePreviews.map((preview, index) => (
                            <div key={`new-${index}`} className="relative group rounded-md overflow-hidden aspect-square border dark:border-gray-700">
                              <img
                                src={preview}
                                alt={`صورة جديدة ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-8 w-8 rounded-full bg-white text-destructive hover:bg-white/90" 
                                  onClick={() => removeImage(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 text-xs font-medium rounded-sm">
                                جديد
                              </div>
                            </div>
                          ))}
                          
                          <div 
                            className="border-2 border-dashed rounded-md flex flex-col items-center justify-center p-4 cursor-pointer aspect-square hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
                            onClick={() => document.getElementById('image-upload')?.click()}
                          >
                            <Plus className="h-6 w-6 text-muted-foreground dark:text-gray-400 mb-2" />
                            <span className="text-sm text-center text-muted-foreground dark:text-gray-400">
                              إضافة صور
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {existingImages.length === 0 && imagePreviews.length === 0 && (
                      <div className="flex items-center justify-center p-8 border rounded-md dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex flex-col items-center text-center text-muted-foreground dark:text-gray-400">
                          <ImageIcon className="h-12 w-12 mb-3" />
                          <span className="text-lg font-medium">لا توجد صور حاليًا</span>
                          <p className="mt-1 max-w-md">
                            الإعلانات المزودة بصور تحظى بنسبة مشاهدة أعلى بـ 80%.
                            أضف صوراً واضحة وعالية الجودة لزيادة فرص البيع.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={goToPrevStep}
                disabled={activeStep === 0 || loading}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                الخطوة السابقة
              </Button>
              
              {activeStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={goToNextStep}
                  disabled={loading}
                >
                  الخطوة التالية
                  <ChevronRight className="h-4 w-4 mr-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  className="gap-2"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Save className="h-4 w-4 ml-2" />
                  حفظ التعديلات
                </Button>
              )}
            </div>
          </form>
        </Form>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}
