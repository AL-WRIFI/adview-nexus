
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { useCreateListing, useCategories, useBrands, useStates, useCities } from '@/hooks/use-api';
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

export default function AddAd() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { data: categories } = useCategories();
  const { data: states } = useStates();
  const createListingMutation = useCreateListing();
  const { user } = useAuth();
  
  // Check if we're coming back from login with form data to submit
  const autoSubmit = location.state?.autoSubmit;
  const savedFormData = location.state?.formData;

  const [currentStep, setCurrentStep] = useState(1);
  const [adType, setAdType] = useState<'sell' | 'rent' | 'job' | 'service'>('sell');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<string | null>(null);
  const [childCategoryId, setChildCategoryId] = useState<string | null>(null);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [adTitle, setAdTitle] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [adPrice, setAdPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [stateId, setStateId] = useState<string | null>(null);
  const [cityId, setCityId] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [phoneHidden, setPhoneHidden] = useState(false);
  const [productCondition, setProductCondition] = useState<'new' | 'used'>('used');
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>([]);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  
  // Get filtered cities based on selected state
  const { data: cities } = useCities(stateId ? parseInt(stateId) : undefined);
  const { data: brands } = useBrands();
  
  // If coming back from login with form data, restore it
  useEffect(() => {
    if (savedFormData) {
      setAdType(savedFormData.adType);
      setCategoryId(savedFormData.categoryId);
      setSubCategoryId(savedFormData.subCategoryId);
      setChildCategoryId(savedFormData.childCategoryId);
      setBrandId(savedFormData.brandId);
      setAdTitle(savedFormData.adTitle);
      setAdDescription(savedFormData.adDescription);
      setAdPrice(savedFormData.adPrice);
      setIsNegotiable(savedFormData.isNegotiable);
      setStateId(savedFormData.stateId);
      setCityId(savedFormData.cityId);
      setAddress(savedFormData.address);
      setPhoneHidden(savedFormData.phoneHidden);
      setProductCondition(savedFormData.productCondition);
      setMainImagePreview(savedFormData.mainImagePreview);
      setGalleryImagePreviews(savedFormData.galleryImagePreviews);
      // We can't restore File objects from navigation state,
      // but we'll keep the previews so the user can see what they uploaded
      setCurrentStep(4); // Move directly to the review step
      setAgreeTerms(true);
    }
  }, [savedFormData]);
  
  // Auto submit form after coming back from login
  useEffect(() => {
    if (autoSubmit && isAuthenticated() && savedFormData) {
      handlePublish();
    }
  }, [autoSubmit, savedFormData]);
  
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
    if (mainImagePreview) {
      URL.revokeObjectURL(mainImagePreview);
      setMainImagePreview(null);
    }
  };
  
  const handleRemoveGalleryImage = (index: number) => {
    const updatedImages = [...galleryImages];
    const updatedPreviews = [...galleryImagePreviews];
    
    // Clean up URL object to prevent memory leaks
    if (galleryImagePreviews[index]) {
      URL.revokeObjectURL(galleryImagePreviews[index]);
    }
    
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    setGalleryImages(updatedImages);
    setGalleryImagePreviews(updatedPreviews);
  };
  
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'اختر نوع الإعلان';
      case 2:
        return 'أضف معلومات الإعلان';
      case 3:
        return 'أضف الصور';
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
  
  const handlePublish = async () => {
    if (!agreeTerms) {
      toast({
        variant: 'destructive',
        title: 'الموافقة على الشروط',
        description: 'يجب الموافقة على شروط الاستخدام وسياسة الخصوصية',
      });
      return;
    }

    // Check user authentication
    if (!isAuthenticated()) {
      // Save form data to state before redirecting
      const formData = {
        adType,
        categoryId,
        subCategoryId,
        childCategoryId,
        brandId,
        adTitle,
        adDescription,
        adPrice,
        isNegotiable,
        stateId,
        cityId,
        address,
        phoneHidden,
        productCondition,
        mainImagePreview,
        galleryImagePreviews,
      };
      
      // Redirect to login with form data
      navigate('/auth/login', { state: { from: '/add-ad', formData } });
      return;
    }
    
    // Validate required fields
    if (!categoryId || !adTitle || !adDescription || !stateId || !cityId || !mainImage) {
      toast({
        variant: 'destructive',
        title: 'معلومات غير مكتملة',
        description: 'يرجى التأكد من إدخال جميع الحقول المطلوبة',
      });
      return;
    }
    
    try {
      const formData = new FormData();
      
      // Add listing_type
      formData.append('listing_type', adType);
      
      // Add category
      if (categoryId) formData.append('category_id', categoryId);
      if (subCategoryId) formData.append('subcategory_id', subCategoryId);
      if (childCategoryId) formData.append('child_category_id', childCategoryId);
      if (brandId) formData.append('brand_id', brandId);
      
      // Add title, description, price
      formData.append('title', adTitle);
      formData.append('description', adDescription);
      formData.append('price', adPrice || '0');
      formData.append('is_negotiable', isNegotiable ? '1' : '0');
      
      // Add location info
      if (stateId) formData.append('state_id', stateId);
      if (cityId) formData.append('city_id', cityId);
      formData.append('address', address);
      
      // Add other details
      formData.append('phone_hidden', phoneHidden ? '1' : '0');
      formData.append('condition', productCondition);
      
      // Add main image
      if (mainImage) {
        formData.append('image', mainImage);
      }
      
      // Add gallery images
      galleryImages.forEach((image) => {
        formData.append('gallery_images[]', image);
      });
      
      // Add location if available
      if (lat !== null && lon !== null) {
        formData.append('lat', lat.toString());
        formData.append('lon', lon.toString());
      }
      
      await createListingMutation.mutateAsync(formData);
      
      // Clear form and navigate to dashboard on success
      navigate('/dashboard', {
        state: { successMessage: 'تم نشر الإعلان بنجاح' }
      });
      
    } catch (error) {
      console.error('Error submitting listing:', error);
      // Error is handled by the mutation's onError callback
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 dark:text-white">
      <Header />
      
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container px-4 mx-auto py-6">
          <div className="max-w-3xl mx-auto">
            {/* Progress */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-6 text-center">{getStepTitle()}</h1>
              
              <div className="relative">
                <div className="flex justify-between mb-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div 
                      key={step}
                      className={`text-sm font-medium ${
                        step <= currentStep ? 'text-brand dark:text-brand-light' : 'text-muted-foreground'
                      }`}
                    >
                      الخطوة {step}
                    </div>
                  ))}
                </div>
                
                <div className="overflow-hidden h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div 
                    className="h-full bg-brand dark:bg-brand-light transition-all duration-300"
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
                      type="button"
                      className={`p-6 border rounded-lg text-center hover:border-brand transition-colors dark:border-gray-700 dark:hover:border-brand-light ${adType === type.id ? 'border-brand bg-brand/5 dark:border-brand-light dark:bg-brand-light/10' : ''}`}
                      onClick={() => setAdType(type.id as any)}
                    >
                      <div className="text-lg font-bold">{type.label}</div>
                      <div className="text-sm text-muted-foreground mt-1">{type.desc}</div>
                    </button>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label>اختر تصنيف الإعلان</Label>
                    <Select 
                      value={categoryId || undefined} 
                      onValueChange={(value) => setCategoryId(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر التصنيف" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Brand selection, only for certain categories */}
                  {(adType === 'sell' || adType === 'rent') && categoryId && (
                    <div>
                      <Label>اختر الماركة</Label>
                      <Select 
                        value={brandId || undefined}
                        onValueChange={(value) => setBrandId(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الماركة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">بدون ماركة</SelectItem>
                          {brands?.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id.toString()}>
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
                  <Label htmlFor="title">عنوان الإعلان</Label>
                  <Input
                    id="title"
                    value={adTitle}
                    onChange={(e) => setAdTitle(e.target.value)}
                    placeholder="اكتب عنواناً واضحاً ومختصراً"
                    className="mt-1 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">وصف الإعلان</Label>
                  <Textarea
                    id="description"
                    value={adDescription}
                    onChange={(e) => setAdDescription(e.target.value)}
                    placeholder="اكتب وصفاً مفصلاً"
                    rows={5}
                    className="mt-1 resize-none dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">السعر (ريال)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={adPrice}
                      onChange={(e) => setAdPrice(e.target.value)}
                      placeholder="أدخل السعر"
                      className="mt-1 dark:bg-gray-800 dark:border-gray-700"
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
                      />
                      <Label htmlFor="negotiable">السعر قابل للتفاوض</Label>
                    </div>
                  </div>
                </div>
                
                {(adType === 'sell' || adType === 'rent') && (
                  <div>
                    <Label htmlFor="condition">حالة المنتج</Label>
                    <div className="grid grid-cols-2 gap-4 mt-1">
                      <button
                        type="button"
                        className={`p-3 border rounded-lg text-center dark:border-gray-700 ${productCondition === 'new' ? 'border-brand bg-brand/5 dark:border-brand-light dark:bg-brand-light/10' : ''}`}
                        onClick={() => setProductCondition('new')}
                      >
                        جديد
                      </button>
                      <button
                        type="button"
                        className={`p-3 border rounded-lg text-center dark:border-gray-700 ${productCondition === 'used' ? 'border-brand bg-brand/5 dark:border-brand-light dark:bg-brand-light/10' : ''}`}
                        onClick={() => setProductCondition('used')}
                      >
                        مستعمل
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">المنطقة / المحافظة</Label>
                    <Select 
                      value={stateId || undefined}
                      onValueChange={(value) => {
                        setStateId(value);
                        setCityId(null); // Reset city when changing state
                      }}
                    >
                      <SelectTrigger id="state" className="mt-1 dark:bg-gray-800 dark:border-gray-700">
                        <SelectValue placeholder="اختر المنطقة" />
                      </SelectTrigger>
                      <SelectContent>
                        {states?.map((state) => (
                          <SelectItem key={state.id} value={state.id.toString()}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="city">المدينة</Label>
                    <Select 
                      value={cityId || undefined}
                      onValueChange={(value) => setCityId(value)}
                      disabled={!stateId}
                    >
                      <SelectTrigger id="city" className="mt-1 dark:bg-gray-800 dark:border-gray-700">
                        <SelectValue placeholder={stateId ? "اختر المدينة" : "اختر المنطقة أولاً"} />
                      </SelectTrigger>
                      <SelectContent>
                        {cities?.map((city) => (
                          <SelectItem key={city.id} value={city.id.toString()}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">العنوان التفصيلي</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="أدخل العنوان التفصيلي"
                    className="mt-1 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                
                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="contact-settings">معلومات الاتصال</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
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
                    />
                    <Label htmlFor="phone-hidden">إخفاء رقم الهاتف (التواصل عبر الرسائل فقط)</Label>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handlePrevStep} className="dark:border-gray-700 dark:bg-gray-800">
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
                  <Label className="mb-2 block">الصورة الرئيسية</Label>
                  
                  {mainImagePreview ? (
                    <div className="relative h-64 border rounded-lg overflow-hidden mb-4 dark:border-gray-700">
                      <img src={mainImagePreview} alt="الصورة الرئيسية" className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={handleRemoveMainImage}
                        className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="relative h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 mb-4">
                      <UploadCloud className="h-16 w-16 text-muted-foreground mb-2" />
                      <span className="text-muted-foreground mb-1">اضغط لإضافة الصورة الرئيسية</span>
                      <span className="text-xs text-muted-foreground">(مطلوب)</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleMainImageChange}
                      />
                    </label>
                  )}
                  
                  <Label className="mb-2 block">صور إضافية (اختياري)</Label>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    {galleryImagePreviews.map((image, index) => (
                      <div key={index} className="relative h-32 border rounded-lg overflow-hidden dark:border-gray-700">
                        <img src={image} alt={`صورة ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(index)}
                          className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    {galleryImagePreviews.length < 9 && (
                      <label className="relative h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                        <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">اضغط لإضافة صورة</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleGalleryImageChange}
                        />
                      </label>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-700 text-sm dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300">
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
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handlePrevStep} className="dark:border-gray-700 dark:bg-gray-800">
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
                <div className="border rounded-lg overflow-hidden dark:border-gray-700">
                  <div className="bg-gray-50 border-b p-3 dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="font-bold">مراجعة معلومات الإعلان</h3>
                  </div>
                  
                  <div className="p-4 space-y-4 dark:bg-gray-900">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm text-muted-foreground">عنوان الإعلان</h4>
                        <p>{adTitle}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-muted-foreground">التصنيف</h4>
                        <p>{categories?.find(c => c.id.toString() === categoryId)?.name || '-'}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-muted-foreground">المنطقة</h4>
                        <p>{states?.find(s => s.id.toString() === stateId)?.name || '-'}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-muted-foreground">المدينة</h4>
                        <p>{cities?.find(c => c.id.toString() === cityId)?.name || '-'}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-muted-foreground">السعر</h4>
                        <p>
                          {adPrice ? `${adPrice} ريال` : '-'}
                          {isNegotiable && adPrice && ' (قابل للتفاوض)'}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-muted-foreground">نوع الإعلان</h4>
                        <p>
                          {adType === 'sell' && 'بيع منتج'}
                          {adType === 'rent' && 'تأجير'}
                          {adType === 'job' && 'وظيفة'}
                          {adType === 'service' && 'خدمة'}
                        </p>
                      </div>
                      
                      {(adType === 'sell' || adType === 'rent') && (
                        <div>
                          <h4 className="text-sm text-muted-foreground">حالة المنتج</h4>
                          <p>{productCondition === 'new' ? 'جديد' : 'مستعمل'}</p>
                        </div>
                      )}
                      
                      {brandId && brandId !== '0' && (
                        <div>
                          <h4 className="text-sm text-muted-foreground">الماركة</h4>
                          <p>{brands?.find(b => b.id.toString() === brandId)?.name || '-'}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-muted-foreground">الوصف</h4>
                      <p className="whitespace-pre-line">{adDescription}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-muted-foreground">الصور</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {mainImagePreview && (
                          <div className="w-16 h-16 rounded-md overflow-hidden border-2 border-brand dark:border-brand-light">
                            <img src={mainImagePreview} alt="الصورة الرئيسية" className="w-full h-full object-cover" />
                          </div>
                        )}
                        {galleryImagePreviews.map((image, index) => (
                          <div key={index} className="w-16 h-16 rounded-md overflow-hidden dark:border-gray-700">
                            <img src={image} alt={`صورة ${index + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-muted-foreground">معلومات الاتصال</h4>
                      <p>{phoneHidden ? 'رقم الهاتف مخفي' : 'رقم الهاتف مرئي للجميع'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex items-center space-x-2 space-x-reverse mb-4">
                    <input 
                      type="checkbox" 
                      id="terms" 
                      className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      checked={agreeTerms}
                      onChange={() => setAgreeTerms(!agreeTerms)}
                    />
                    <label htmlFor="terms" className="text-sm">
                      أوافق على <a href="/terms" className="text-brand dark:text-brand-light">شروط الاستخدام</a> و<a href="/privacy" className="text-brand dark:text-brand-light">سياسة الخصوصية</a>
                    </label>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button 
                      variant="default" 
                      size="lg"
                      onClick={handlePublish}
                      disabled={createListingMutation.isPending || !agreeTerms}
                    >
                      {createListingMutation.isPending ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          جاري نشر الإعلان...
                        </>
                      ) : (
                        'نشر الإعلان'
                      )}
                    </Button>
                    <Button variant="outline" onClick={handlePrevStep} className="dark:border-gray-700 dark:bg-transparent">تعديل الإعلان</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}
