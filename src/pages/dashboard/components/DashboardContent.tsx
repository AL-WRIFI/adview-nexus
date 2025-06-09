
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdsTab } from './tabs/AdsTab';
import { PromoteTab } from './tabs/PromoteTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { FavoritesTab } from './tabs/FavoritesTab';
import { ProfileTab } from './tabs/ProfileTab';
import { Card } from '@/components/ui/card';

interface DashboardContentProps {
  activePage: string;
  selectedAd: string | null;
  setSelectedAd: (id: string | null) => void;
  promoteDialogOpen: boolean;
  setPromoteDialogOpen: (open: boolean) => void;
  deleteConfirmOpen: boolean;
  setDeleteConfirmOpen: (open: boolean) => void;
}

export function DashboardContent({
  activePage,
  selectedAd,
  setSelectedAd,
  promoteDialogOpen,
  setPromoteDialogOpen,
  deleteConfirmOpen,
  setDeleteConfirmOpen,
}: DashboardContentProps) {
  
  const handleSetSelectedAd = (id: string | null) => {
    setSelectedAd(id);
  };

  const handleSetSelectedAdNumber = (id: number) => {
    setSelectedAd(id.toString());
  };

  // Render content based on active page from sidebar
  const renderPageContent = () => {
    switch (activePage) {
      case 'ads':
        return (
          <AdsTab />
        );
      case 'favorites':
        return <FavoritesTab />;
      case 'promote':
        return <PromoteTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'settings':
        return <ProfileTab />;
      case 'messages':
        return (
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold text-card-foreground mb-4">الرسائل</h2>
            <p className="text-muted-foreground">سيتم تطوير هذه الصفحة قريباً</p>
          </Card>
        );
      case 'notifications':
        return (
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold text-card-foreground mb-4">الإشعارات</h2>
            <p className="text-muted-foreground">سيتم تطوير هذه الصفحة قريباً</p>
          </Card>
        );
      default:
        return (
          <AdsTab />
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderPageContent()}
    </div>
  );
}

export default DashboardContent;
