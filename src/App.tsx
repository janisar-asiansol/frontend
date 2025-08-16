// App.tsx
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FAQ from "./pages/FAQ";

import Dashboard from "./pages/Dashboard";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import Investments from "./pages/dashboard/Investments";
import ReviewPage from "./pages/dashboard/ReviewPage";
import Referrals from "./pages/dashboard/Referrals";
import Withdraw from "./pages/dashboard/Withdraw";
import Settings from "./pages/dashboard/Settings";
import { Chat } from "./pages/dashboard/Chat";
import KYCVerification from "./pages/dashboard/KYCVerification";

import AdminDashboard from "./pages/AdminDashboard";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminWithdrawals from "./pages/admin/AdminWithdrawals";
import { AdminChat } from "./pages/admin/AdminChat";
import InvestmentPlans from './components/landing/InvestmentPlans';

const queryClient = new QueryClient();

// List of public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/signup', '/faq'];

const AuthStateHandler = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);
      
      // If user is not authenticated and trying to access a private route, redirect to login
      if (!user && !isPublicRoute) {
        navigate('/login');
      }
      
      // If user is authenticated and trying to access auth pages, redirect to appropriate dashboard
      if (user && (location.pathname.includes('/login') || location.pathname.includes('/signup'))) {
        navigate(user.role === 'admin' ? '/admin' : '/dashboard');
      }
    }
  }, [user, isLoading, navigate, location.pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthStateHandler />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/faq" element={<FAQ />} />

              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardOverview />} />
                <Route path="investments" element={<Investments />} />
                <Route path="investmentplans" element={<InvestmentPlans />} />
                <Route path="review" element={<ReviewPage />} />
                <Route path="referrals" element={<Referrals />} />
                <Route path="withdraw" element={<Withdraw />} />
                <Route path="kyc" element={<KYCVerification />} />
                <Route path="chat" element={<Chat />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminOverview />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="withdrawals" element={<AdminWithdrawals />} />
                <Route path="chat" element={<AdminChat />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;