import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Image, X, UploadCloud, ChevronDown, Info, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { isAuthenticated } from '@/services/api';
import { useUpdateListing, useListing, useCategories, useBrands, useStates, useCities, useBrand } from '@/hooks/use-api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";

export default function EditAd() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: categories } = useCategories();
  const { data: states } = useStates();
  const { data: listing, isLoading: isLoadingListing } = useListing(Number(listingId));
  const updateListingMutation = useUpdateListing(Number(listingId));
  const { user } = useAuth();
  
  // Local state for form
  const [currentStep, setCurrentStep] = useState(3); // Start at final step
  const [adType, setAdType] = useState<'sell' | 'rent' | 'job' | 'service'>('sell');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<number | null>(null);
  const [childCategoryId, setChildCategoryId] = useState<number | null>(null);
  const [brandId, setBrandId] = useState<number | null>(null);
  const [adTitle, setAdTitle] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [adPrice, setAdPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [stateId, setStateId] = useState<number | null>(null);
  const [cityId, setCityId] = useState<number | null>(null);
  const [address, setAddress] = useState('');
  const [phoneHidden, setPhoneHidden] = useState(false);
  const [productCondition, setProductCondition] = useState<'new' | 'used'>('used');
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>([]);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalMainImage, setOriginalMainImage] = useState<string | null>(null);
  const [originalGalleryImages, setOriginalGalleryImages] = useState<string[]>([]);
  
  // Get filtered cities based on selected state
  const { data: cities } = useCities(stateId || undefined);
  const { data: brands } = useBrand(categoryId || undefined);

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      toast({
        variant: 'destructive',
        title: 'تسجيل الدخول مطلوب',
        description: 'يجب تسجيل الدخول لتعديل الإعلان',
      });
      navigate('/auth/login', { state: { from: `/edit-ad/${listingId}` } });
    }
  }, []);
  
  // Load listing data when available
  useEffect(() => {
    if (listing) {
      // Set form data from listing
      setAdType(listing.listing_type as any || 'sell');
      setCategoryId(listing.category_id || null);
      setSubCategoryId(listing.sub_category_id || null);
      setChildCategoryId(listing?.child_category_id || null);
      setBrandId(listing.brand_id || null);
      setAdTitle(listing.title || '');
      setAdDescription(listing.description || '');
      setAdPrice(listing.price ? listing.price.toString() : '');
      setIsNegotiable(listing.is_negotiable || false);
      setStateId(listing.state_id || null);
      setCityId(listing.city_id || null);
      setAddress(listing.address || '');
      setPhoneHidden(listing?.phone_hidden || false);
      setProductCondition(listing.condition as 'new' | 'used' || 'used');
      
      // Set location data if available
      if (listing.lat && listing.lon) {
        setLat(parseFloat(listing.lat));
        setLon(parseFloat(listing.lon));
      }
      
      // Set image previews
      if (listing.image) {
        setMainImagePreview(listing.image);
        setOriginalMainImage(listing.image);
      }
      
      if (listing.images && listing.images.length > 0) {
        setGalleryImagePreviews(listing.images);
        setOriginalGalleryImages(listing.images);
      }
    }
  }, [listing]);
  
  // Try to get user's location if not already set
  useEffect(() => {
    if (!lat && !lon && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    }
  }, []);
  
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Create preview URLs
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      
      setGalleryImages([...galleryImages, ...newFiles]);
      setGalleryImagePreviews([...galleryImagePreviews, ...newPreviews]);
    }
  };
  
  const handleRemoveMainImage = () => {
    setMainImage(null);
    setMainImagePreview(null);
    if (originalMainImage === mainImagePreview) {
      setOriginalMainImage(null);
    } else if (mainImagePreview) {
      URL.revokeObjectURL(mainImagePreview);
    }
  };
  
  const handleRemoveGalleryImage = (index: number) => {
    const updatedImages = [...galleryImages];
    const updatedPreviews = [...galleryImagePreviews];
    const removedPreview = galleryImagePreviews[index];
    
    // Check if it's an original image or a new one
    const isOriginalImage = originalGalleryImages.includes(removedPreview);
    
    if (!isOriginalImage && removedPreview) {
      URL.revokeObjectURL(removedPreview);
    }
    
    updatedPreviews.splice(index, 1);
    
    // Only splice the galleryImages array if it's a new image
    if (index < updatedImages.length) {
      updatedImages.splice(index, 1);
    }
    
    setGalleryImages(updatedImages);
    setGalleryImagePreviews(updatedPreviews);
  };
  
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'تعديل نوع الإعلان';
      case 2:
        return 'تعديل معلومات الإعلان';
      case 3:
        return 'تعديل الصور';
      case 4:
        return 'مراجعة نهائية';
      default:
        return '';
    }
  };
  
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleUpdate = async () => {
    if (!agreeTerms) {
      toast({
        variant: 'destructive',
        title: 'الموافقة على الشروط',
        description: 'يجب الموافقة على شروط الاستخدام وسياسة الخصوصية',
      });
      return;
    }

    // Validate required fields
    if (!categoryId || !adTitle || !adDescription || !stateId || !cityId) {
      toast({
        variant: 'destructive',
        title: 'معلومات غير مكتملة',
        description: 'يرجى التأكد من إدخال جميع الحقول المطلوبة',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('_method', 'POST'); // Laravel convention for PUT/PATCH requests
      formData.append('listing_type', adType);
      formData.append('category_id', categoryId.toString());
      if (subCategoryId) formData.append('sub_category_id', subCategoryId.toString());
      if (childCategoryId) formData.append('child_category_id', childCategoryId.toString());
      if (brandId) formData.append('brand_id', brandId.toString());
      formData.append('title', adTitle);
      formData.append('description', adDescription);
      formData.append('price', adPrice || '0');
      formData.append('negotiable', isNegotiable ? '1' : '0');
      formData.append('state_id', stateId.toString());
      formData.append('city_id', cityId.toString());
      formData.append('address', address);
      formData.append('phone_hidden', phoneHidden ? '1' : '0');
      formData.append('condition', productCondition);
      
      // Add main image if changed
      if (mainImage) {
        formData.append('image', mainImage);
      }
      
      // Add gallery images if new ones were added
      galleryImages.forEach((image) => {
        formData.append('images[]', image);
      });
      
      // Add original images to keep (if any were removed, they won't be in the list)
      if (originalGalleryImages.length > 0) {
        const keptImages = originalGalleryImages.filter(img => galleryImagePreviews.includes(img));
        formData.append('original_images', JSON.stringify(keptImages));
      }
      
      // Add location if available
      if (lat !== null && lon !== null) {
        formData.append('lat', lat.toString());
        formData.append('lon', lon.toString());
      }
      
      // Submit the update
      await updateListingMutation.mutateAsync({ id: listingId, data: formData });
      
      // Navigate to dashboard on success
      navigate('/dashboard', {
        state: { successMessage: 'تم تحديث الإعلان بنجاح' }
      });
      
    } catch (error) {
      console.error("Error updating listing:", error);
      toast({
        variant: 'destructive',
        title: 'خطأ في تحديث الإعلان',
        description: 'حدث خطأ أثناء تحديث الإعلان. يرجى المحاولة مرة أخرى',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    try {
      // API call to delete listing
      await updateListingMutation.mutateAsync({ 
        id: listingId, 
        data: { _method: 'DELETE' } 
      });
      
      setIsDeleteDialogOpen(false);
      navigate('/dashboard', {
        state: { successMessage: 'تم حذف الإعلان بنجاح' }
      });
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast({
        variant: 'destructive',
        title: 'خطأ في حذف الإعلان',
        description: 'حدث خطأ أثناء حذف الإعلان. يرجى المحاولة مرة أخرى',
      });
    }
  };
  
  if (isLoadingListing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={isAuthenticated()} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-brand" />
            <h2 className="text-xl font-medium">جاري تحميل بيانات الإعلان...</h2>
          </div>
        </main>
        <MobileNav />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-dark-background">
      <Header isLoggedIn={isAuthenticated()} />
      
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container px-4 mx-auto py-6">
          <div className="max-w-3xl mx-auto">
            {/* Progress */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-6 text-center dark:text-gray-100">{getStepTitle()}</h1>
              
              <div className="relative">
                <div className="flex justify-between mb-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div 
                      key={step}
                      className={`text-sm font-medium ${
                        step <= currentStep ? 'text-brand dark:text-brand' : 'text-muted-foreground dark:text-gray-400'
                      }`}
                    >
                      الخطوة {step}
                    </div>
                  ))}
                </div>
                
                <div className="overflow-hidden h-2 rounded-full bg-gray-200 dark:bg-dark-muted">
                  <div 
                    className="h-full bg-brand transition-all duration-300"
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            
            {/* Step 1: Choose ad type */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'sell', label: 'بيع منتج', desc: 'بيع أي منتج تملكه' },
                    { id: 'rent', label: 'تأجير', desc: 'عقار، سيارة، معدات' },
                    { id: 'job', label: 'وظيفة', desc: 'إعلان توظيف' },
                    { id: 'service', label: 'خدمة', desc: 'تقديم خدمة احترافية' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      className={`p-6 border dark:border-dark-border rounded-lg text-center hover:border-brand transition-colors ${
                        adType === type.id 
                          ? 'border-brand bg-brand/5 dark:border-brand dark:bg-brand/10' 
                          : 'dark:border-dark-border dark:bg-dark-card'
                      }`}
                      onClick={() => setAdType(type.id as any)}
                    >
                      <div className="text-lg font-bold dark:text-gray-100">{type.label}</div>
                      <div className="text-sm text-muted-foreground dark:text-gray-400 mt-1">{type.desc}</div>
                    </button>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="dark:text-gray-200">اختر تصنيف الإعلان</Label>
                    <Select value={categoryId?.toString()} onValueChange={(value) => setCategoryId(parseInt(value))}>
                      <SelectTrigger className="dark:border-dark-border dark:bg-dark-card dark:text-gray-200">
                        <SelectValue placeholder="اختر التصنيف" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-dark-card dark:border-dark-border">
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()} className="dark:text-gray-200 dark:focus:bg-dark-muted">
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Brand selection, only for certain categories */}
                  {(adType === 'sell' || adType === 'rent') && categoryId && (
                    <div>
                      <Label className="dark:text-gray-200">اختر الماركة</Label>
                      <Select value={brandId?.toString()} onValueChange={(value) => setBrandId(parseInt(value))}>
                        <SelectTrigger className="dark:border-dark-border dark:bg-dark-card dark:text-gray-200">
                          <SelectValue placeholder="اختر الماركة" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-dark-card dark:border-dark-border">
                          <SelectItem value="0" className="dark:text-gray-200 dark:focus:bg-dark-muted">بدون ماركة</SelectItem>
                          {brands?.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id.toString()} className="dark:text-gray-200 dark:focus:bg-dark-muted">
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button onClick={handleNextStep} disabled={!categoryId}>
                    التالي
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 2: Ad details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="dark:text-gray-200">عنوان الإعلان</Label>
                  <Input
                    id="title"
                    value={adTitle}
                    onChange={(e) => setAdTitle(e.target.value)}
                    placeholder="اكتب عنواناً واضحاً ومختصراً"
                    className="mt-1 dark:bg-dark-card dark:border-dark-border dark:text-gray-200"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="dark:text-gray-200">وصف الإعلان</Label>
                  <Textarea
                    id="description"
                    value={adDescription}
                    onChange={(e) => setAdDescription(e.target.value)}
                    placeholder="اكتب وصفاً مفصلاً"
                    rows={5}
                    className="mt-1 resize-none dark:bg-dark-card dark:border-dark-border dark:text-gray-200"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price" className="dark:text-gray-200">السعر (ريال)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={adPrice}
                      onChange={(e) => setAdPrice(e.target.value)}
                      placeholder="أدخل السعر"
                      className="mt-1 dark:bg-dark-card dark:border-dark-border dark:text-gray-200"
                      disabled={adType === 'job'}
                    />
                  </div>
                  
                  <div>
                    <div className="h-8" />
                    <div className="flex items-center space-x-2 space-x-reverse mt-1">
                      <Switch 
                        id="negotiable" 
                        checked={isNegotiable}
                        onCheckedChange={setIsNegotiable}
                        disabled={adType === 'job'}
                        className="dark:bg-dark-muted"
                      />
                      <Label htmlFor="negotiable" className="dark:text-gray-200">السعر قابل للتفاوض</Label>
                    </div>
                  </div>
                </div>
                
                {(adType === 'sell' || adType === 'rent') && (
                  <div>
                    <Label htmlFor="condition" className="dark:text-gray-200">حالة المنتج</Label>
                    <div className="grid grid-cols-2 gap-4 mt-1">
                      <button
                        type="button"
                        className={`p-3 border rounded-lg text-center ${
                          productCondition === 'new' 
                            ? 'border-brand bg-brand/5 dark:border-brand dark:bg-brand/10' 
                            : 'dark:border-dark-border dark:bg-dark-card dark:text-gray-300'
                        }`}
                        onClick={() => setProductCondition('new')}
                      >
                        جديد
                      </button>
                      <button
                        type="button"
                        className={`p-3 border rounded-lg text-center ${
                          productCondition === 'used' 
                            ? 'border-brand bg-brand/5 dark:border-brand dark:bg-brand/10' 
                            : 'dark:border-dark-border dark:bg-dark-card dark:text-gray-300'
                        }`}
                        onClick={() => setProductCondition('used')}
                      >
                        مستعمل
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state" className="dark:text-gray-200">المنطقة / المحافظة</Label>
                    <Select value={stateId?.toString()} onValueChange={(value) => {
                      setStateId(parseInt(value));
                      setCityId(null); // Reset city when changing state
                    }}>
                      <SelectTrigger id="state" className="mt-1 dark:bg-dark-card dark:border-dark-border dark:text-gray-200">
                        <SelectValue placeholder="اختر المنطقة" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-dark-card dark:border-dark-border">
                        {states?.map((state) => (
                          <SelectItem key={state.id} value={state.id.toString()} className="dark:text-gray-200 dark:focus:bg-dark-muted">
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="city" className="dark:text-gray-200">المدينة</Label>
                    <Select value={cityId?.toString()} onValueChange={(value) => setCityId(parseInt(value))} disabled={!stateId}>
                      <SelectTrigger id="city" className="mt-1 dark:bg-dark-card dark:border-dark-border dark:text-gray-200">
                        <SelectValue placeholder={stateId ? "اختر المدينة" : "اختر المنطقة أولاً"} />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-dark-card dark:border-dark-border">
                        {cities?.map((city) => (
                          <SelectItem key={city.id} value={city.id.toString()} className="dark:text-gray-200 dark:focus:bg-dark-muted">
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address" className="dark:text-gray-200">العنوان التفصيلي</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="أدخل العنوان التفصيلي"
                    className="mt-1 dark:bg-dark-card dark:border-dark-border dark:text-gray-200"
                  />
                </div>
                
                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="contact-settings" className="dark:text-gray-200">معلومات الاتصال</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="dark:text-gray-400">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="dark:bg-dark-card dark:border-dark-border dark:text-gray-200">
                          <p>يمكنك التحكم في كيفية ظهور معلومات الاتصال الخاصة بك</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse mt-1">
                    <Switch 
                      id="phone-hidden" 
                      checked={phoneHidden}
                      onCheckedChange={setPhoneHidden}
                      className="dark:bg-dark-muted"
                    />
                    <Label htmlFor="phone-hidden" className="dark:text-gray-200">إخفاء رقم الهاتف (التواصل عبر الرسائل فقط)</Label>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handlePrevStep} className="dark:bg-dark-card dark:border-dark-border dark:text-gray-200 dark:hover:bg-dark-muted">
                    السابق
                  </Button>
                  <Button 
                    onClick={handleNextStep} 
                    disabled={!adTitle || !adDescription || (adType !== 'job' && !adPrice) || !stateId || !cityId}
                  >
                    التالي
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 3: Images */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Main image */}
                <div>
                  <Label className="mb-2 block dark:text-gray-200">الصورة الرئيسية</Label>
                  
                  {mainImagePreview ? (
                    <div className="relative h-64 border rounded-lg overflow-hidden mb-4 dark:border-dark-border dark:bg-dark-muted">
                      <img src={mainImagePreview} alt="الصورة الرئيسية" className="w-full h-full object-contain" />
                      <button
                        onClick={handleRemoveMainImage}
                        className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="relative h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 mb-4 dark:border-dark-border dark:hover:bg-dark-card/80">
                      <UploadCloud className="h-16 w-16 text-muted-foreground mb-2 dark:text-gray-400" />
                      <span className="text-muted-foreground mb-1 dark:text-gray-400">اضغط لإضافة الصورة الرئيسية</span>
                      <span className="text-xs text-muted-foreground dark:text-gray-500">(مطلوب)</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleMainImageChange}
                      />
                    </label>
                  )}
                  
                  <Label className="mb-2 block dark:text-gray-200">صور إضافية (اختياري)</Label>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    {galleryImagePreviews.map((image, index) => (
                      <div key={index} className="relative h-32 border rounded-lg overflow-hidden dark:border-dark-border dark:bg-dark-muted">
                        <img src={image} alt={`صورة ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleRemoveGalleryImage(index)}
                          className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    {galleryImagePreviews.length < 9 && (
                      <label className="relative h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:border-dark-border dark:hover:bg-dark-card/80">
                        <UploadCloud className="h-10 w-10 text-muted-foreground mb-2 dark:text-gray-400" />
                        <span className="text-sm text-muted-foreground dark:text-gray-400">اضغط لإضافة صورة</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleGalleryImageChange}
                        />
                      </label>
                    )}
                  </div>
                  
                  <Card className="dark:bg-dark-surface dark:border-dark-border">
                    <CardContent className="p-4 text-blue-700 text-sm dark:text-blue-400">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 ml-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold mb-1">نصائح لصور أفضل:</p>
                          <ul className="list-disc pr-5">
                            <li>استخدم صوراً واضحة وبجودة عالية</li>
                            <li>أضف صوراً من زوايا مختلفة</li>
                            <li>تأكد من إضاءة جيدة للصور</li>
                            <li>تجنب استخدام شعارات أو نصوص على الصور</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handlePrevStep} className="dark:bg-dark-card dark:border-dark-border dark:text-gray-200 dark:hover:bg-dark-muted">
                    السابق
                  </Button>
                  <Button onClick={handleNextStep} disabled={!mainImagePreview}>
                    التالي
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <Card className="dark:bg-dark-card dark:border-dark-border">
                  <div className="bg-gray-50 dark:bg-dark-surface border-b dark:border-dark-border p-3">
                    <h3 className="font-bold dark:text-gray-200">مراجعة معلومات الإعلان</h3>
                  </div>
                  
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm text-muted-foreground dark:text-gray-400">عنوان الإعلان</h4>
                        <p className="dark:text-gray-200">{adTitle}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-muted-foreground dark:text-gray-400">التصنيف</h4>
                        <p className="dark:text-gray-200">{categories?.find(c => c.id === categoryId)?.name || '-'}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-muted-foreground dark:text-gray-400">المنطقة</h4>
                        <p className="dark:text-gray-200">{states?.find(s => s.id === stateId)?.name || '-'}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-muted-foreground dark:text-gray-400">المدينة</h4>
                        <p className="dark:text-gray-200">{cities?.find(c => c.id === cityId)?.name || '-'}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-muted-foreground dark:text-gray-400">السعر</h4>
                        <p className="dark:text-gray-200">
                          {adPrice ? `${adPrice} ريال` : '-'}
                          {isNegotiable && adPrice && ' (قابل للتفاوض)'}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-muted-foreground dark:text-gray-400">نوع الإعلان</h4>
                        <p className="dark:text-gray-200">
                          {adType === 'sell' && 'بيع منتج'}
                          {adType === 'rent' && 'تأجير'}
                          {adType === 'job' && 'وظيفة'}
                          {adType === 'service' && 'خدمة'}
                        </p>
                      </div>
                      
                      {(adType === 'sell' || adType === 'rent') && (
                        <div>
                          <h4 className="text-sm text-muted-foreground dark:text-gray-400">حالة المنتج</h4>
                          <p className="dark:text-gray-200">{productCondition === 'new' ? 'جديد' : 'مستعمل'}</p>
                        </div>
                      )}
                      
                      {brandId && brandId > 0 && (
                        <div>
                          <h4 className="text-sm text-muted-foreground dark:text-gray-400">الماركة</h4>
                          <p className="dark:text-gray-200">{brands?.find(b => b.id === brandId)?.name || '-'}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-muted-foreground dark:text-gray-400">الوصف</h4>
                      <p className="whitespace-pre-line dark:text-gray-200">{adDescription}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-muted-foreground dark:text-gray-400">الصور</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {mainImagePreview && (
                          <div className="w-16 h-16 rounded-md overflow-hidden border-2 border-brand">
                            <img src={mainImagePreview} alt="الصورة الرئيسية" className="w-full h-full object-cover" />
                          </div>
                        )}
                        {galleryImagePreviews.map((image, index) => (
                          <div key={index} className="w-16 h-16 rounded-md overflow-hidden dark:border dark:border-dark-border">
                            <img src={image} alt={`صورة ${index + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-muted-foreground dark:text-gray-400">معلومات الاتصال</h4>
                      <p className="dark:text-gray-200">{phoneHidden ? 'رقم الهاتف مخفي' : 'رقم الهاتف مرئي للجميع'}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="border dark:border-dark-border rounded-lg p-4 bg-gray-50 dark:bg-dark-surface">
                  <div className="flex items-center space-x-2 space-x-reverse mb-4">
                    <input 
                      type="checkbox" 
                      id="terms" 
                      className="rounded border-gray-300 dark:bg-dark-card dark:border-dark-border"
                      checked={agreeTerms}
                      onChange={() => setAgreeTerms(!agreeTerms)}
                    />
                    <label htmlFor="terms" className="text-sm dark:text-gray-300">
                      أوافق على <a href="/terms" className="text-brand">شروط الاستخدام</a> و<a href="/privacy" className="text-brand">سياسة الخصوصية</a>
                    </label>
                  </div>
                  
                  <div className="grid gap-2">
                    <Button 
                      variant="default" 
                      size="lg"
                      onClick={handleUpdate}
                      disabled={isSubmitting || !agreeTerms}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          جاري تحديث الإعلان...
                        </>
                      ) : (
                        'تحديث الإعلان'
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handlePrevStep}
                      className="dark:bg-dark-card dark:border-dark-border dark:text-gray-200 dark:hover:bg-dark-muted"
                    >
                      تعديل الإعلان
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDelete}
                      className="mt-2"
                    >
                      <X className="h-4 w-4 ml-1" />
                      حذف الإعلان
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="dark:bg-dark-card dark:border-dark-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-gray-100">تأكيد حذف الإعلان</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-300">
              هل أنت متأكد من رغبتك في حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-dark-muted dark:text-gray-200 dark:border-dark-border">إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              نعم، قم بالحذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
      <MobileNav />
    </div>
  );
}
