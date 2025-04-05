
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed, CalendarCheck, Users, FileText, Activity, Wallet, Building2, TestTube, Ambulance } from 'lucide-react';
import { fetchDashboardMetrics } from '@/services/api';
import DashboardCard from './DashboardCard';

const DashboardOverview: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      const data = await fetchDashboardMetrics();
      setDashboardData(data);
      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  // Helper function to find a metric by name
  const getMetricValue = (name: string) => {
    const metric = dashboardData.find(item => item.metric_name === name);
    return metric ? metric.metric_value : 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard 
          title="Total Patients" 
          value={getMetricValue('Total Patients')}
          icon={<Users className="h-5 w-5" />}
        />
        <DashboardCard 
          title="Bed Occupancy" 
          value={`${getMetricValue('Beds Occupied')}/${getMetricValue('Beds Occupied') + getMetricValue('Beds Available')}`}
          icon={<Bed className="h-5 w-5" />}
          description="Current bed utilization"
        />
        <DashboardCard 
          title="Appointments Today" 
          value={getMetricValue('Appointments Today')}
          icon={<CalendarCheck className="h-5 w-5" />}
        />
        <DashboardCard 
          title="Emergency Cases" 
          value={getMetricValue('Emergency Cases')}
          icon={<Activity className="h-5 w-5" />}
          description="Active emergency cases"
        />
        <DashboardCard 
          title="Revenue This Month" 
          value={`$${getMetricValue('Revenue This Month').toLocaleString()}`}
          icon={<Wallet className="h-5 w-5" />}
        />
        <DashboardCard 
          title="Staff On Duty" 
          value={getMetricValue('Doctors On Duty') + getMetricValue('Nurses On Duty')}
          icon={<Users className="h-5 w-5" />}
          description={`${getMetricValue('Doctors On Duty')} doctors, ${getMetricValue('Nurses On Duty')} nurses`}
        />
        <DashboardCard 
          title="Pending Bills" 
          value={getMetricValue('Pending Bills')}
          icon={<FileText className="h-5 w-5" />}
        />
        <DashboardCard 
          title="Lab Tests Today" 
          value={getMetricValue('Lab Tests Today')}
          icon={<TestTube className="h-5 w-5" />}
        />
        <DashboardCard 
          title="ICU Occupancy" 
          value={`${getMetricValue('ICU Occupancy')}%`}
          icon={<Building2 className="h-5 w-5" />}
        />
      </div>
    </div>
  );
};

export default DashboardOverview;
