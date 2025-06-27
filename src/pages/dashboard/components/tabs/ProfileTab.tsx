import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UserCircle, Upload, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { profileAPI } from '@/services/apis'; // سنستخدم النسخة المحسنة من apis.ts
import { toast } from 'sonner'; // مكتبة احترافية لإظهار التنبيهات

export function ProfileTab() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for form data, matches backend fields from UserResource
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    about: '', // Note: Backend uses 'about', not 'bio'
  });

  // State for avatar management
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effect to populate form data when user data is available or editing starts
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        about: user.about || '', // Matched with UserResource
      });
      // Reset avatar changes if editing is cancelled
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  }, [user, isEditing]);

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>الملف الشخصي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mr-4">جاري تحميل بيانات المستخدم...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    // The useEffect will handle resetting the form data
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Use FormData to send data, which is essential for file uploads
    const submissionData = new FormData();
    submissionData.append('first_name', formData.first_name);
    submissionData.append('last_name', formData.last_name);
    submissionData.append('email', formData.email);
    submissionData.append('phone', formData.phone);
    submissionData.append('about', formData.about);
    
    // Add other fields from your backend if they are in the form
    // submissionData.append('state_id', user.state_id || '');
    // submissionData.append('city_id', user.city_id || '');

    if (avatarFile) {
      submissionData.append('image', avatarFile);
    }

    try {
      const response = await profileAPI.updateProfile(submissionData);
      
      if (response.success) {
        toast.success('تم تحديث الملف الشخصي بنجاح!');
        await refreshUser(); // This is the key: refresh user data globally
        setIsEditing(false);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Profile update failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>الملف الشخصي</CardTitle>
        <CardDescription>عرض وتعديل معلومات الملف الشخصي</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar section */}
            <div className="flex flex-col items-center gap-4 flex-shrink-0">
              <div className="w-32 h-32 bg-muted rounded-full overflow-hidden flex items-center justify-center">
                <img 
                  src={avatarPreview || user.image || undefined} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  // Show placeholder if no image is available
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                {!avatarPreview && !user.image && <UserCircle className="w-full h-full text-gray-400" />}
              </div>
              {isEditing && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/png, image/jpeg, image/gif"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    <Upload className="ml-2 h-4 w-4" />
                    تغيير الصورة
                  </Button>
                </>
              )}
            </div>
            
            {/* Profile info section */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">الاسم الأول</Label>
                      <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">الاسم الأخير</Label>
                      <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="about">نبذة عني</Label>
                    <Textarea id="about" name="about" value={formData.about} onChange={handleInputChange} rows={4} />
                  </div>
                  
                  {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                      إلغاء
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                      حفظ التغييرات
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">الاسم الكامل</p>
                      <p className="font-medium">{user.first_name} {user.last_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                      <p className="font-medium">{user.email || 'غير محدد'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                      <p className="font-medium">{user.phone || 'غير محدد'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">نبذة عني</p>
                    <p className="mt-1 whitespace-pre-wrap">{user.about || 'لا توجد معلومات إضافية.'}</p>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={() => setIsEditing(true)}>تعديل الملف الشخصي</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}