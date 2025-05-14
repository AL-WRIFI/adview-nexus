
import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';

export default function ProfileTab() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    address: user?.address || ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "تم تحديث البيانات بنجاح",
        description: "تم حفظ بيانات الملف الشخصي"
      });
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم يتم حفظ البيانات، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">الملف الشخصي</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.first_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
              )}
              <Button size="icon" className="absolute bottom-0 right-0 rounded-full w-8 h-8">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
            <h3 className="text-lg font-medium mt-2">
              {user?.first_name} {user?.last_name}
            </h3>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
            <p className="text-muted-foreground text-sm mt-1">{user?.phone}</p>
            
            <div className="mt-4 text-sm">
              <p>عضو منذ {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</p>
              <p className="mt-1">{user?.verified ? 'حساب موثق ✓' : 'حساب غير موثق'}</p>
            </div>
          </div>
        </div>
        
        <div className="md:w-2/3">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">الاسم الأول</Label>
                <Input 
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="الاسم الأول"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="last_name">الاسم الأخير</Label>
                <Input 
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="الاسم الأخير"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="البريد الإلكتروني"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input 
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="رقم الهاتف"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">العنوان</Label>
              <Input 
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="العنوان"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">نبذة عني</Label>
              <Textarea 
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="نبذة قصيرة عنك"
                rows={4}
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                حفظ التغييرات
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
