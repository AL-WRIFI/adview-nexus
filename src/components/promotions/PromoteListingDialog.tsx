
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, CreditCard, Banknote, Wallet } from 'lucide-react';
import { usePromotionPackages, usePromoteWithBankTransfer, usePromoteWithStripe, usePromoteWithWallet, PromotionPackage } from '@/hooks/use-promotions';
import { Listing } from '@/types';
import { useAuth } from '@/context/auth-context';

interface PromoteListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: Listing | null;
}

export function PromoteListingDialog({ open, onOpenChange, listing }: PromoteListingDialogProps) {
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'stripe' | 'wallet'>('stripe');
  const [transferProof, setTransferProof] = useState<File | null>(null);

  const { data: packages, isLoading: packagesLoading } = usePromotionPackages();
  const promoteWithBankTransfer = usePromoteWithBankTransfer();
  const promoteWithStripe = usePromoteWithStripe();
  const promoteWithWallet = usePromoteWithWallet();

  const handleSubmit = async () => {
    if (!selectedPackage || !listing) return;

    try {
      if (paymentMethod === 'bank_transfer') {
        if (!transferProof) {
          return;
        }
        await promoteWithBankTransfer.mutateAsync({
          listingId: listing.id,
          data: {
            promotion_package_id: selectedPackage,
            bank_transfer_proof: transferProof,
            payment_method: 'bank_transfer',
          },
        });
      } else if (paymentMethod === 'stripe') {
        await promoteWithStripe.mutateAsync({
          listingId: listing.id,
          data: {
            promotion_package_id: selectedPackage,
            payment_method: 'stripe',
          },
        });
      } else if (paymentMethod === 'wallet') {
        await promoteWithWallet.mutateAsync({
          listingId: listing.id,
          data: {
            promotion_package_id: selectedPackage,
            payment_method: 'wallet',
          },
        });
      }

      // Close dialog on success (except for Stripe which opens in new tab)
      if (paymentMethod !== 'stripe') {
        onOpenChange(false);
      }
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  const packagesArray = Array.isArray(packages) ? packages : [];
  const selectedPackageData = packagesArray.find(pkg => pkg.id === selectedPackage);
  const walletBalance = user?.wallet_balance || 0;
  const canAffordWithWallet = selectedPackageData ? (walletBalance >= selectedPackageData.price * 100) : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ترقية الإعلان</DialogTitle>
        </DialogHeader>

        {listing && (
          <div className="space-y-6">
            {/* Selected Listing */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">الإعلان المحدد</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {listing.main_image_url && (
                    <img 
                      src={listing.main_image_url} 
                      alt={listing.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{listing.title}</h3>
                    <p className="text-sm text-muted-foreground">{listing.price} ريال</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Promotion Packages */}
            <div>
              <h3 className="text-lg font-semibold mb-4">اختر باقة الترقية</h3>
              {packagesLoading ? (
                <div className="text-center py-4">جاري التحميل...</div>
              ) : (
                <RadioGroup value={selectedPackage?.toString()} onValueChange={(value) => setSelectedPackage(Number(value))}>
                  <div className="grid gap-3">
                    {packagesArray.map((pkg: PromotionPackage) => (
                      <Card key={pkg.id} className={selectedPackage === pkg.id ? 'ring-2 ring-primary' : ''}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={pkg.id.toString()} id={`package-${pkg.id}`} />
                            <Label htmlFor={`package-${pkg.id}`} className="flex-1 cursor-pointer">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-semibold">{pkg.name}</h4>
                                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    مدة الترقية: {pkg.duration_days} {pkg.duration_days === 1 ? 'يوم' : 'أيام'}
                                  </p>
                                </div>
                                <div className="text-left">
                                  <p className="text-lg font-bold text-primary">{pkg.price} ريال</p>
                                </div>
                              </div>
                            </Label>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </RadioGroup>
              )}
            </div>

            {/* Payment Method */}
            {selectedPackage && (
              <div>
                <h3 className="text-lg font-semibold mb-4">طريقة الدفع</h3>
                <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                  <div className="space-y-3">
                    {/* Stripe Payment */}
                    <Card className={paymentMethod === 'stripe' ? 'ring-2 ring-primary' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="stripe" id="stripe" />
                          <Label htmlFor="stripe" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <CreditCard className="h-5 w-5 text-blue-600" />
                              <div>
                                <h4 className="font-semibold">الدفع الإلكتروني</h4>
                                <p className="text-sm text-muted-foreground">دفع آمن عبر Stripe</p>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Wallet Payment */}
                    <Card className={paymentMethod === 'wallet' ? 'ring-2 ring-primary' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value="wallet" 
                            id="wallet" 
                            disabled={!canAffordWithWallet}
                          />
                          <Label htmlFor="wallet" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <Wallet className="h-5 w-5 text-green-600" />
                              <div className="flex-1">
                                <h4 className="font-semibold">رصيد المحفظة</h4>
                                <p className="text-sm text-muted-foreground">
                                  الرصيد الحالي: {(walletBalance / 100).toFixed(2)} ريال
                                </p>
                                {!canAffordWithWallet && selectedPackageData && (
                                  <Badge variant="destructive" className="mt-1">
                                    رصيد غير كافي
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </Label>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Bank Transfer */}
                    <Card className={paymentMethod === 'bank_transfer' ? 'ring-2 ring-primary' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                          <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <Banknote className="h-5 w-5 text-orange-600" />
                              <div>
                                <h4 className="font-semibold">تحويل بنكي</h4>
                                <p className="text-sm text-muted-foreground">يتطلب مراجعة إدارية</p>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </RadioGroup>

                {/* Bank Transfer Proof Upload */}
                {paymentMethod === 'bank_transfer' && (
                  <div className="mt-4">
                    <Label htmlFor="transfer-proof">إثبات التحويل</Label>
                    <Input
                      id="transfer-proof"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={(e) => setTransferProof(e.target.files?.[0] || null)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      يُرجى رفع صورة إثبات التحويل البنكي (JPG, PNG)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                إلغاء
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  !selectedPackage || 
                  (paymentMethod === 'bank_transfer' && !transferProof) ||
                  (paymentMethod === 'wallet' && !canAffordWithWallet) ||
                  promoteWithBankTransfer.isPending ||
                  promoteWithStripe.isPending ||
                  promoteWithWallet.isPending
                }
              >
                {paymentMethod === 'stripe' && 'الانتقال للدفع'}
                {paymentMethod === 'wallet' && 'الدفع من المحفظة'}
                {paymentMethod === 'bank_transfer' && 'إرسال الطلب'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
