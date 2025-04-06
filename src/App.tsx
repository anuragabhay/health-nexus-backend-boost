
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
import Auth from "./pages/Auth";
import { AuthProvider } from "./context/AuthContext";
import { AuthGuard, RedirectIfAuthenticated } from "./components/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth routes */}
            <Route 
              path="/auth" 
              element={
                <RedirectIfAuthenticated>
                  <Auth />
                </RedirectIfAuthenticated>
              } 
            />
            
            {/* Protected routes */}
            <Route element={<AuthGuard />}>
              <Route 
                path="/" 
                element={
                  <MainLayout>
                    <DashboardOverview />
                  </MainLayout>
                } 
              />
              <Route 
                path="/patients" 
                element={
                  <MainLayout>
                    <Patients />
                  </MainLayout>
                } 
              />
              <Route 
                path="/appointments" 
                element={
                  <MainLayout>
                    <Appointments />
                  </MainLayout>
                } 
              />
              <Route 
                path="/staff" 
                element={
                  <MainLayout>
                    <Staff />
                  </MainLayout>
                } 
              />
              <Route 
                path="/medical-records" 
                element={
                  <MainLayout>
                    <MedicalRecords />
                  </MainLayout>
                } 
              />
              <Route 
                path="/wards" 
                element={
                  <MainLayout>
                    <Wards />
                  </MainLayout>
                } 
              />
              <Route 
                path="/billing" 
                element={
                  <MainLayout>
                    <Billing />
                  </MainLayout>
                } 
              />
              <Route 
                path="/inventory" 
                element={
                  <MainLayout>
                    <Inventory />
                  </MainLayout>
                } 
              />
              <Route 
                path="/laboratory" 
                element={
                  <MainLayout>
                    <Laboratory />
                  </MainLayout>
                } 
              />
              <Route 
                path="/emergency" 
                element={
                  <MainLayout>
                    <Emergency />
                  </MainLayout>
                } 
              />
              <Route 
                path="/pharmacy" 
                element={
                  <MainLayout>
                    <Pharmacy />
                  </MainLayout>
                } 
              />
              <Route 
                path="/insurance" 
                element={
                  <MainLayout>
                    <Insurance />
                  </MainLayout>
                } 
              />
              <Route 
                path="/telemedicine" 
                element={
                  <MainLayout>
                    <Telemedicine />
                  </MainLayout>
                } 
              />
              <Route 
                path="/support" 
                element={
                  <MainLayout>
                    <Support />
                  </MainLayout>
                } 
              />
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
