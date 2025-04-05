
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import DashboardOverview from '@/components/Dashboard/DashboardOverview';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // No need to navigate, we're already on the root path
    // This is just here in case we need to add any initialization logic
  }, [navigate]);

  return (
    <MainLayout>
      <DashboardOverview />
    </MainLayout>
  );
};

export default Index;
