import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategories, useBrands, useStates, useCities, useListing, useUpdateListing } from '@/hooks/use-api';
import { Ad, Category, Brand, State, City } from '@/types';
import { ImageIcon, PlusCircle } from 'lucide-react';
import { Dropzone } from '@/components/dropzone';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  title: z.string().min(3, {
    message: "العنوان يجب أن يكون على الأقل 3 حروف.",
  }),
  description: z.string().min(10, {
    message: "الوصف يجب أن يكون على الأقل 10 حروف.",
  }),
  price: z.number({
    invalid_type_error: 'السعر يجب أن يكون رقماً',
  }).min(1, {
    message: "السعر يجب أن يكون أكبر من 0.",
  }),
  condition: z.enum(['new', 'used'], {
    required_error: "يجب اختيار حالة المنتج.",
  }),
  listing_type: z.enum(['sale', 'rent'], {
    required_error: "يجب اختيار نوع الإعلان.",
  }),
  category_id: z.number({
    invalid_type_error: 'يجب اختيار تصنيف',
  }),
  sub_category_id: z.number().optional(),
  child_category_id: z.number().optional(),
  brand_id: z.number().optional(),
  state_id: z.number({
    invalid_type_error: 'يجب اختيار المنطقة',
  }),
  city_id: z.number({
    invalid_type_error: 'يجب اختيار المدينة',
  }),
  is_negotiable: z.boolean().default(false),
  phone_hidden: z.boolean().default(false),
  images: z.any().optional(),
});

export default function EditAd() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();

  const { data: listingData } = useListing(Number(id));

  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();
  const { data: statesData } = useStates();
  const [selectedStateId, setSelectedStateId] = useState<number | undefined>(listingData?.state_id);
  const { data: citiesData } = useCities(selectedStateId);

  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  const brands = Array.isArray(brandsData) ? brandsData : [];
  const states = Array.isArray(statesData) ? statesData : [];
  const cities = Array.isArray(citiesData) ? citiesData : [];

  const [files, setFiles] = useState<File[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (listingData) {
      setSelectedStateId(listingData.state_id);
    }
  }, [listingData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: listingData?.title || "",
      description: listingData?.description || "",
      price: listingData?.price || 0,
      condition: (listingData?.condition as "new" | "used") || "new",
      listing_type: (listingData?.listing_type as "sale" | "rent") || "sale",
      category_id: listingData?.category_id || 0,
      sub_category_id: listingData?.sub_category_id || undefined,
      child_category_id: listingData?.child_category_id || undefined,
      brand_id: listingData?.brand_id || undefined,
      state_id: listingData?.state_id || 0,
      city_id: listingData?.city_id || 0,
      is_negotiable: listingData?.is_negotiable || false,
      phone_hidden: listingData?.phone_hidden || false,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (listingData) {
      form.reset({
        title: listingData.title || "",
        description: listingData.description || "",
        price: listingData.price || 0,
        condition: (listingData.condition as "new" | "used") || "new",
        listing_type: (listingData.listing_type as "sale" | "rent") || "sale",
        category_id: listingData.category_id || 0,
        sub_category_id: listingData.sub_category_id || undefined,
        child_category_id: listingData.child_category_id || undefined,
        brand_id: listingData.brand_id || undefined,
        state_id: listingData.state_id || 0,
        city_id: listingData.city_id || 0,
        is_negotiable: listingData.is_negotiable || false,
        phone_hidden: listingData.phone_hidden || false,
      });
      setImageUrl(typeof listingData.image === 'string' ? listingData.image : listingData.image?.image_url || null);
    }
  }, [listingData, form]);

  const updateListingMutation = useUpdateListing();

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!id) return;
    
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    if (files.length > 0) {
      files.forEach((file) => {
        formData.append('images', file);
      });
    }
    
    updateListingMutation.mutate({ 
      id: Number(id), 
      data: formData 
    }, {
      onSuccess: () => {
        navigate('/dashboard');
      }
    });
  };

  const handleSaveDraft = async (data: z.infer<typeof formSchema>) => {
    if (!id) return;
    
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    if (files.length > 0) {
      files.forEach((file) => {
        formData.append('images', file);
      });
    }
    
    updateListingMutation.mutate({ 
      id: Number(id), 
      data: formData 
    }, {
      onSuccess: () => {
        // Draft saved
      }
    });
  };

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>تعديل الإعلان</CardTitle>
        </CardHeader>
        <CardContent>
          {listingData ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>عنوان الإعلان</FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: سيارة للبيع" {...field} />
                        </FormControl>
                        <FormDescription>
                          أدخل عنواناً واضحاً وموجزاً للإعلان.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>وصف الإعلان</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="مثال: سيارة بحالة ممتازة، موديل 2020،..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          أدخل وصفاً تفصيلياً للإعلان.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>السعر</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="مثال: 15000" {...field} />
                        </FormControl>
                        <FormDescription>
                          أدخل سعر المنتج أو الخدمة.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>حالة المنتج</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر حالة المنتج" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="new">جديد</SelectItem>
                            <SelectItem value="used">مستعمل</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          اختر حالة المنتج: جديد أو مستعمل.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="listing_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نوع الإعلان</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر نوع الإعلان" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sale">للبيع</SelectItem>
                            <SelectItem value="rent">للإيجار</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          اختر نوع الإعلان: بيع أو إيجار.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>التصنيف الرئيسي</FormLabel>
                        <Select onValueChange={value => field.onChange(Number(value))} defaultValue={String(field.value)}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر التصنيف الرئيسي" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={String(category.id)}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          اختر التصنيف الرئيسي للإعلان.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brand_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الماركة</FormLabel>
                        <Select onValueChange={value => field.onChange(Number(value))} defaultValue={String(field.value || '')}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الماركة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {brands.map((brand) => (
                              <SelectItem key={brand.id} value={String(brand.id)}>
                                {brand.name || brand.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          اختر الماركة التجارية للمنتج.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel>صورة الإعلان</FormLabel>
                    <FormControl>
                      <Dropzone 
                        value={files}
                        onChange={setFiles}
                        onImageChange={setImageUrl}
                        imageUrl={imageUrl}
                      />
                    </FormControl>
                    <FormDescription>
                      قم برفع صورة واضحة للإعلان.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="state_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المنطقة</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(Number(value));
                            setSelectedStateId(Number(value));
                          }} 
                          defaultValue={String(field.value)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر المنطقة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state.id} value={String(state.id)}>
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          اختر المنطقة التي يقع بها المنتج.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المدينة</FormLabel>
                        <Select onValueChange={value => field.onChange(Number(value))} defaultValue={String(field.value)}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر المدينة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city.id} value={String(city.id)}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          اختر المدينة التي يقع بها المنتج.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormLabel>خيارات إضافية</FormLabel>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <FormField
                        control={form.control}
                        name="is_negotiable"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                                قابل للتفاوض
                              </FormLabel>
                              <FormDescription>
                                تحديد ما إذا كان السعر قابل للتفاوض.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse">
                      <FormField
                        control={form.control}
                        name="phone_hidden"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                                إخفاء رقم الهاتف
                              </FormLabel>
                              <FormDescription>
                                تحديد ما إذا كان رقم الهاتف مخفياً في الإعلان.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={form.handleSubmit(handleSaveDraft)}>حفظ كمسودة</Button>
                  <Button type="submit">تحديث الإعلان</Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="flex flex-col space-y-4">
              <Skeleton className="h-10 w-[200px]" />
              <Skeleton className="h-4 w-[400px]" />
              <Skeleton className="h-4 w-[400px]" />
              <Skeleton className="h-4 w-[400px]" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
