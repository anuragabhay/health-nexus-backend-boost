
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const MedicalRecords = () => {
  return (
    <MainLayout>
      <PageHeader 
        title="Medical Records" 
        description="View and manage patient medical records"
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Record
          </Button>
        }
      />
      
      <div className="flex flex-col items-center justify-center h-64 border rounded-md bg-muted/10">
        <p className="text-muted-foreground text-xl mb-4">Medical Records Module</p>
        <p className="text-muted-foreground mb-2">Feature under development</p>
      </div>
    </MainLayout>
  );
};

export default MedicalRecords;
