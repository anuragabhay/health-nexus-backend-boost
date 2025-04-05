
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, CalendarCheck, Bed, FileText, Activity, 
  Stethoscope, Pill, TestTube, Wallet, Package, 
  Ambulance, ShieldCheck, HelpCircle, Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  href: string;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, title, href, isActive }) => {
  return (
    <Link 
      to={href} 
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { icon: <Activity size={20} />, title: 'Dashboard', href: '/' },
    { icon: <Users size={20} />, title: 'Patients', href: '/patients' },
    { icon: <CalendarCheck size={20} />, title: 'Appointments', href: '/appointments' },
    { icon: <Stethoscope size={20} />, title: 'Staff', href: '/staff' },
    { icon: <FileText size={20} />, title: 'Medical Records', href: '/medical-records' },
    { icon: <Bed size={20} />, title: 'Wards & Beds', href: '/wards' },
    { icon: <Wallet size={20} />, title: 'Billing', href: '/billing' },
    { icon: <Package size={20} />, title: 'Inventory', href: '/inventory' },
    { icon: <TestTube size={20} />, title: 'Laboratory', href: '/laboratory' },
    { icon: <Ambulance size={20} />, title: 'Emergency', href: '/emergency' },
    { icon: <Pill size={20} />, title: 'Pharmacy', href: '/pharmacy' },
    { icon: <ShieldCheck size={20} />, title: 'Insurance', href: '/insurance' },
    { icon: <Phone size={20} />, title: 'Telemedicine', href: '/telemedicine' },
    { icon: <HelpCircle size={20} />, title: 'Support', href: '/support' },
  ];

  return (
    <div className="hidden border-r bg-background lg:block">
      <div className="flex h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link 
            to="/" 
            className="flex items-center gap-2 font-semibold"
          >
            <Activity className="h-6 w-6" />
            <span className="text-lg">Health Nexus</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {menuItems.map((item, index) => (
              <SidebarItem 
                key={index}
                icon={item.icon}
                title={item.title}
                href={item.href}
                isActive={currentPath === item.href}
              />
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
