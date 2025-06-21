
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UserCircle, Upload } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export function ProfileTab() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Update profile functionality would go here
    // For now, just toggle edit mode
    setIsEditing(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>الملف الشخصي</CardTitle>
        <CardDescription>عرض وتعديل معلومات الملف الشخصي</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar section */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mb-4">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-full h-full text-gray-400" />
              )}
            </div>
            <Button variant="outline" size="sm" className="mb-2">
              <Upload className="mr-2 h-4 w-4" />
              تغيير الصورة
            </Button>
          </div>
          
          {/* Profile info section */}
          <div className="flex-1">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">الاسم الأول</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">الاسم الأخير</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">نبذة عني</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end space-x-2 space-x-reverse">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    إلغاء
                  </Button>
                  <Button type="submit">حفظ التغييرات</Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">الاسم الأول</p>
                    <p className="font-medium">{user?.first_name || 'غير محدد'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">الاسم الأخير</p>
                    <p className="font-medium">{user?.last_name || 'غير محدد'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                    <p className="font-medium">{user?.email || 'غير محدد'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                    <p className="font-medium">{user?.phone || 'غير محدد'}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">نبذة عني</p>
                  <p className="mt-1">{user?.bio || 'لا توجد معلومات إضافية.'}</p>
                </div>
                
                <div className="pt-4">
                  <Button onClick={() => setIsEditing(true)}>تعديل الملف الشخصي</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
