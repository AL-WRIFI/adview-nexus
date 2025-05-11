
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useListing, useUpdateListing } from '@/hooks/use-api';
import { useAuth } from '@/context/auth-context';

export default function EditAd() {
  const { adId } = useParams<{ adId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert adId to number safely
  const adIdNum = adId ? parseInt(adId, 10) : undefined;
  
  // Fetch listing details
  const { data: listingData, isLoading: isLoadingListing, error: listingError } = useListing(adIdNum);
  const updateMutation = useUpdateListing(adIdNum || 0);
  
  useEffect(() => {
    if (!isLoadingListing) {
      if (listingError) {
        setError('Failed to load listing details');
      } else if (listingData) {
        // Check if user owns the listing
        if (isAuthenticated && user && listingData.data.user_id === user.id) {
          setIsLoading(false);
        } else {
          setError('You do not have permission to edit this listing');
          navigate('/dashboard');
        }
      }
    }
  }, [isLoadingListing, listingData, listingError, isAuthenticated, user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!adId) return;
    
    const formData = new FormData(e.currentTarget);
    try {
      await updateMutation.mutateAsync(formData);
      navigate(`/ad/${adId}`);
    } catch (err) {
      console.error('Failed to update listing:', err);
    }
  };
  
  if (!isAuthenticated) {
    navigate('/auth/login', { state: { from: `/edit-ad/${adId}` } });
    return null;
  }
  
  if (isLoading || isLoadingListing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-brand" />
          <h2 className="text-xl font-semibold">جاري تحميل البيانات...</h2>
        </div>
      </div>
    );
  }
  
  if (error || !listingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500">خطأ</h2>
          <p className="text-gray-500 mt-2">{error || 'حدث خطأ غير معروف'}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">تعديل الإعلان</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form fields pre-filled with listing data */}
        {/* This is a simplified example - actual implementation would include all form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">عنوان الإعلان</label>
            <input
              id="title"
              name="title"
              type="text"
              className="w-full border-gray-300 rounded-md shadow-sm"
              defaultValue={listingData.data.title}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium">السعر</label>
            <input
              id="price"
              name="price"
              type="number"
              className="w-full border-gray-300 rounded-md shadow-sm"
              defaultValue={listingData.data.price}
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 space-x-reverse">
          <button
            type="button"
            onClick={() => navigate(`/ad/${adId}`)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-brand text-white rounded-md shadow-sm hover:bg-brand-dark"
          >
            حفظ التغييرات
          </button>
        </div>
      </form>
    </div>
  );
}
