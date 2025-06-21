import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Upload, X, MapPin, Package, DollarSign, Camera } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { isAuthenticated } from '@/services/api';
import { useCreateListing, useCategories, useBrands, useStates, useCities ,useBrand} from '@/hooks/use-api';
import { Brand } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AddAd() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [adType, setAdType] = useState<'sell' | 'buy' | 'rent'>('sell');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<number | null>(null);
  const [childCategoryId, setChildCategoryId] = useState<number | null>(null);
  const [brandId, setBrandId] = useState<number | null>(null);
  const [adTitle, setAdTitle] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [price, setPrice] = useState('');
  const [priceType, setPriceType] = useState<'fixed' | 'negotiable'>('fixed');
  const [condition, setCondition] = useState<'new' | 'used' | 'refurbished'>('used');
  const [stateId, setStateId] = useState<number | null>(null);
  const [cityId, setCityId] = useState<number | null>(null);
  const [contactPhone, setContactPhone] = useState('');
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // API queries
  const { data: categories } = useCategories();
  const { data: states } = useStates();
  const { data: cities } = useCities(stateId || undefined);
  const { data: brandsResponse } = useBrand(categoryId || undefined);
  
  // Handle brands data - ensure it's always an array of Brand objects
  const brands: Brand[] = Array.isArray(brandsResponse) 
    ? brandsResponse 
    : [];

  useEffect(() => {
    if (!isAuthenticated()) {
      const formData = {
        adType, categoryId, subCategoryId, childCategoryId, brandId,
        adTitle, adDescription, price, priceType, condition,
        stateId, cityId, contactPhone, contactWhatsapp
      };
      localStorage.setItem('addAdFormData', JSON.stringify(formData));
      navigate('/auth/login?returnTo=/add-ad');
      return;
    }

    const savedFormData = localStorage.getItem('addAdFormData');
    if (savedFormData) {
      const data = JSON.parse(savedFormData);
      setAdType(data.adType || 'sell');
      setCategoryId(data.categoryId || null);
      setSubCategoryId(data.subCategoryId || null);
      setChildCategoryId(data.childCategoryId || null);
      setBrandId(data.brandId || null);
      setAdTitle(data.adTitle || '');
      setAdDescription(data.adDescription || '');
      setPrice(data.price || '');
      setPriceType(data.priceType || 'fixed');
      setCondition(data.condition || 'used');
      setStateId(data.stateId || null);
      setCityId(data.cityId || null);
      setContactPhone(data.contactPhone || '');
      setContactWhatsapp(data.contactWhatsapp || '');
      localStorage.removeItem('addAdFormData');
    }
  }, [navigate]);

  const createListingMutation = useCreateListing();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + images.length > 10) {
      toast.error('يمكنك رفع 10 صور كحد أقصى');
      return;
    }

    setImages(prev => [...prev, ...files]);
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Get subcategories and child categories
  const selectedCategory = categories?.find(cat => cat.id === categoryId);
  const subcategories = selectedCategory?.subcategories || [];
  
  const selectedSubcategory = subcategories.find(sub => sub.id === subCategoryId);
  const childCategories = selectedSubcategory?.children || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryId) {
      toast.error('يرجى اختيار التصنيف');
      return;
    }
    
    if (!adTitle.trim()) {
      toast.error('يرجى إدخال عنوان الإعلان');
      return;
    }
    
    if (!adDescription.trim()) {
      toast.error('يرجى إدخال وصف الإعلان');
      return;
    }
    
    if (!price && adType !== 'buy') {
      toast.error('يرجى إدخال السعر');
      return;
    }
    
    if (!stateId) {
      toast.error('يرجى اختيار المحافظة');
      return;
    }
    
    if (!cityId) {
      toast.error('يرجى اختيار المدينة');
      return;
    }
    
    if (!contactPhone.trim()) {
      toast.error('يرجى إدخال رقم الهاتف');
      return;
    }

    const formData = new FormData();
    formData.append('listing_type', adType);
    formData.append('category_id', categoryId.toString());
    if (subCategoryId) formData.append('sub_category_id', subCategoryId.toString());
    if (childCategoryId) formData.append('child_category_id', childCategoryId.toString());
    if (brandId) formData.append('brand_id', brandId.toString());
    formData.append('title', adTitle);
    formData.append('description', adDescription);
    if (price) formData.append('price', price);
    formData.append('price_type', priceType);
    formData.append('condition', condition);
    formData.append('state_id', stateId.toString());
    formData.append('city_id', cityId.toString());
    formData.append('contact_phone', contactPhone);
    if (contactWhatsapp) formData.append('contact_whatsapp', contactWhatsapp);
    
    // Add images
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    try {
      await createListingMutation.mutateAsync(formData);
      toast.success('تم إنشاء الإعلان بنجاح!');
      navigate('/dashboard?tab=ads');
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('حدث خطأ أثناء إنشاء الإعلان');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">إضافة إعلان جديد</h1>
            <p className="text-muted-foreground">
              املأ البيانات التالية لإنشاء إعلانك
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Ad Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  نوع الإعلان
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={adType}
                  onValueChange={(value: 'sell' | 'buy' | 'rent') => setAdType(value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sell" id="sell" />
                    <Label htmlFor="sell">للبيع</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="buy" id="buy" />
                    <Label htmlFor="buy">مطلوب للشراء</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rent" id="rent" />
                    <Label htmlFor="rent">للإيجار</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Category Selection */}
            <Card>
              <CardHeader>
                <CardTitle>التصنيف</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">التصنيف الرئيسي *</Label>
                  <Select value={categoryId?.toString() || ''} onValueChange={(value) => {
                    setCategoryId(value ? parseInt(value) : null);
                    setSubCategoryId(null);
                    setChildCategoryId(null);
                    setBrandId(null);
                  }}>
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

                {subcategories.length > 0 && (
                  <div>
                    <Label htmlFor="subcategory">التصنيف الفرعي</Label>
                    <Select value={subCategoryId?.toString() || ''} onValueChange={(value) => {
                      setSubCategoryId(value ? parseInt(value) : null);
                      setChildCategoryId(null);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر التصنيف الفرعي" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories.map((subcategory) => (
                          <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {childCategories.length > 0 && (
                  <div>
                    <Label htmlFor="childcategory">التصنيف الفرعي الثانوي</Label>
                    <Select value={childCategoryId?.toString() || ''} onValueChange={(value) => {
                      setChildCategoryId(value ? parseInt(value) : null);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر التصنيف الفرعي الثانوي" />
                      </SelectTrigger>
                      <SelectContent>
                        {childCategories.map((child) => (
                          <SelectItem key={child.id} value={child.id.toString()}>
                            {child.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {brands.length > 0 && (
                  <div>
                    <Label htmlFor="brand">الماركة</Label>
                    <Select value={brandId?.toString() || ''} onValueChange={(value) => {
                      setBrandId(value ? parseInt(value) : null);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الماركة" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id.toString()}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>المعلومات الأساسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">عنوان الإعلان *</Label>
                  <Input
                    id="title"
                    value={adTitle}
                    onChange={(e) => setAdTitle(e.target.value)}
                    placeholder="اكتب عنواناً واضحاً ومختصراً"
                    maxLength={100}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {adTitle.length}/100 حرف
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">وصف الإعلان *</Label>
                  <Textarea
                    id="description"
                    value={adDescription}
                    onChange={(e) => setAdDescription(e.target.value)}
                    placeholder="اكتب وصفاً تفصيلياً للمنتج أو الخدمة"
                    rows={5}
                    maxLength={1000}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {adDescription.length}/1000 حرف
                  </p>
                </div>

                <div>
                  <Label htmlFor="condition">حالة المنتج</Label>
                  <Select value={condition} onValueChange={(value: 'new' | 'used' | 'refurbished') => setCondition(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">جديد</SelectItem>
                      <SelectItem value="used">مستعمل</SelectItem>
                      <SelectItem value="refurbished">مجدد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Price Information */}
            {adType !== 'buy' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    معلومات السعر
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="price">السعر (ليرة سورية) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <Label>نوع السعر</Label>
                    <RadioGroup
                      value={priceType}
                      onValueChange={(value: 'fixed' | 'negotiable') => setPriceType(value)}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="fixed" />
                        <Label htmlFor="fixed">ثابت</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="negotiable" id="negotiable" />
                        <Label htmlFor="negotiable">قابل للتفاوض</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  الموقع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="state">المحافظة *</Label>
                  <Select value={stateId?.toString() || ''} onValueChange={(value) => {
                    setStateId(value ? parseInt(value) : null);
                    setCityId(null);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المحافظة" />
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

                {cities && cities.length > 0 && (
                  <div>
                    <Label htmlFor="city">المدينة *</Label>
                    <Select value={cityId?.toString() || ''} onValueChange={(value) => {
                      setCityId(value ? parseInt(value) : null);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المدينة" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id.toString()}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات التواصل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="phone">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="مثال: 0932123456"
                  />
                </div>

                <div>
                  <Label htmlFor="whatsapp">رقم الواتساب (اختياري)</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={contactWhatsapp}
                    onChange={(e) => setContactWhatsapp(e.target.value)}
                    placeholder="مثال: 0932123456"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  الصور
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      اضغط هنا لرفع الصور أو اسحبها هنا
                    </p>
                    <p className="text-xs text-muted-foreground">
                      يمكنك رفع حتى 10 صور - الحد الأقصى 5 ميجابايت لكل صورة
                    </p>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={createListingMutation.isPending}
                className="min-w-32"
              >
                {createListingMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    جاري النشر...
                  </>
                ) : (
                  'نشر الإعلان'
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
