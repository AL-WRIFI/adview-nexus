
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ADS, FEATURED_PACKAGES } from '@/data/mock-data';

interface PromoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function PromoteDialog({ open, setOpen }: PromoteDialogProps) {
  const userAds = ADS.slice(0, 5); // Simulate user's ads
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ترقية الإعلان</DialogTitle>
          <DialogDescription>
            اختر احدى الباقات لجعل إعلانك يظهر في المقدمة
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="rounded-lg border overflow-hidden">
            <div className="bg-gray-50 p-3 border-b">
              <h3 className="font-medium">اختر الإعلان المراد ترقيته</h3>
            </div>
            <div className="p-3">
              <select className="w-full border rounded-md p-2">
                {userAds.map((ad) => (
                  <option key={ad.id} value={ad.id}>{ad.title}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="rounded-lg border overflow-hidden">
            <div className="bg-gray-50 p-3 border-b">
              <h3 className="font-medium">اختر الباقة</h3>
            </div>
            <div className="p-3 space-y-2">
              {FEATURED_PACKAGES.map((pkg) => (
                <div key={pkg.id} className="flex items-center border rounded-md p-3">
                  <input 
                    type="radio" 
                    id={`package-${pkg.id}`} 
                    name="package"
                    className="ml-3"
                  />
                  <label htmlFor={`package-${pkg.id}`} className="flex-1">
                    <div className="font-medium">{pkg.name}</div>
                    <div className="text-sm text-muted-foreground">{pkg.description}</div>
                  </label>
                  <div className="font-bold text-brand">{pkg.price} ريال</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="rounded-lg border overflow-hidden">
            <div className="bg-gray-50 p-3 border-b">
              <h3 className="font-medium">طريقة الدفع</h3>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex items-center border rounded-md p-3">
                <input 
                  type="radio" 
                  id="payment-card" 
                  name="payment"
                  className="ml-3"
                  defaultChecked
                />
                <label htmlFor="payment-card" className="flex-1">
                  <div className="font-medium">بطاقة الائتمان</div>
                </label>
              </div>
              <div className="flex items-center border rounded-md p-3">
                <input 
                  type="radio" 
                  id="payment-bank" 
                  name="payment"
                  className="ml-3"
                />
                <label htmlFor="payment-bank" className="flex-1">
                  <div className="font-medium">تحويل بنكي</div>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            إلغاء
          </Button>
          <Button onClick={() => setOpen(false)}>
            تأكيد وترقية الإعلان
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
