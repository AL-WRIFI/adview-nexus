
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PromoteDialog } from '@/pages/dashboard/dialogs/PromoteDialog';
import { UserPromotionsTab } from '@/components/promotions/UserPromotionsTab';

export function PromoteTab() {
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>ترقية الإعلانات</CardTitle>
            <Button onClick={() => setPromoteDialogOpen(true)}>
              <Plus className="h-4 w-4 ml-2" />
              ترقية إعلان
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            قم بترقية إعلاناتك لزيادة الظهور والوصول لعدد أكبر من المشترين
          </p>
        </CardContent>
      </Card>

      <UserPromotionsTab />

      <PromoteDialog 
        open={promoteDialogOpen} 
        setOpen={setPromoteDialogOpen} 
      />
    </div>
  );
}
