
import React from 'react';
import { CrimeMap } from '@/components/CrimeMap';
import { DataAnalytics } from '@/components/DataAnalytics';
import { Card, CardContent } from '@/components/ui/card';
import { HistoricalData } from '@/components/HistoricalData';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { AddCrimeDialog } from '@/components/crime/AddCrimeDialog';

const Index = () => {
  const { signOut } = useAuth();

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">
          Crime Pattern Detection System
        </h1>
        <div className="flex gap-4 items-center">
          <AddCrimeDialog />
          <Button onClick={signOut} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      <DataAnalytics />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CrimeMap />
        <HistoricalData />
      </div>
    </div>
  );
};

export default Index;
