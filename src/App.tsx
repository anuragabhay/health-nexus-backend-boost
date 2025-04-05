
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import DashboardOverview from "./components/Dashboard/DashboardOverview";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Staff from "./pages/Staff";
import MedicalRecords from "./pages/MedicalRecords";
import Wards from "./pages/Wards";
import Billing from "./pages/Billing";
import Inventory from "./pages/Inventory";
import Laboratory from "./pages/Laboratory";
import Emergency from "./pages/Emergency";
import Pharmacy from "./pages/Pharmacy";
import Insurance from "./pages/Insurance";
import Telemedicine from "./pages/Telemedicine";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <MainLayout>
                <DashboardOverview />
              </MainLayout>
            } 
          />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/wards" element={<Wards />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/laboratory" element={<Laboratory />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/telemedicine" element={<Telemedicine />} />
          <Route path="/support" element={<Support />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
