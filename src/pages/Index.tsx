
import React from 'react';
import { CrimeMap } from '@/components/CrimeMap';
import { DataAnalytics } from '@/components/DataAnalytics';
import { Card, CardContent } from '@/components/ui/card';
import { HistoricalData } from '@/components/HistoricalData';

const Index = () => {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <DataAnalytics />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CrimeMap />
        <HistoricalData />
      </div>
    </div>
  );
};

export default Index;
