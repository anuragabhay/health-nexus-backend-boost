
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Support = () => {
  return (
    <MainLayout>
      <PageHeader 
        title="Support" 
        description="Get help and support for the system"
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        }
      />
      
      <div className="flex flex-col items-center justify-center h-64 border rounded-md bg-muted/10">
        <p className="text-muted-foreground text-xl mb-4">Support Module</p>
        <p className="text-muted-foreground mb-2">Feature under development</p>
      </div>
    </MainLayout>
  );
};

export default Support;
