import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdsTab } from './tabs/AdsTab';
import { PromoteTab } from './tabs/PromoteTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';

interface DashboardContentProps {
  activePage: string;
  selectedAd: string | null;
  setSelectedAd: (id: string | null) => void;
  promoteDialogOpen: boolean;
  setPromoteDialogOpen: (open: boolean) => void;
  deleteConfirmOpen: boolean;
  setDeleteConfirmOpen: (open: boolean) => void;
  className?: string;
}

export function DashboardContent({
  activePage,
  selectedAd,
  setSelectedAd,
  promoteDialogOpen,
  setPromoteDialogOpen,
  deleteConfirmOpen,
  setDeleteConfirmOpen,
  className
}: DashboardContentProps) {
  return (
    <div className={className}>
      <Tabs defaultValue={activePage} className="w-full">
        <TabsList>
          <TabsTrigger value="ads">إعلاناتي</TabsTrigger>
          <TabsTrigger value="promote">الترويج</TabsTrigger>
          <TabsTrigger value="analytics">إحصائيات</TabsTrigger>
        </TabsList>
        <TabsContent value="ads" className="space-y-4">
          <AdsTab 
            setSelectedAd={(id: string | null) => setSelectedAd(id)}
            setPromoteDialogOpen={setPromoteDialogOpen}
          />
        </TabsContent>
        <TabsContent value="promote" className="space-y-4">
          <PromoteTab setPromoteDialogOpen={setPromoteDialogOpen} />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
