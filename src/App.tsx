import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import PickPurchase from "./pages/PickPurchase";
import DecideDeposit from "./pages/DecideDeposit";
import PaymentMethod from "./pages/PaymentMethod";
import PaymentProcess from "./pages/PaymentProcess";
import RiskMitigation from "./pages/RiskMitigation";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/pick-purchase" element={<ProtectedRoute><PickPurchase /></ProtectedRoute>} />
              <Route path="/decide-deposit" element={<ProtectedRoute><DecideDeposit /></ProtectedRoute>} />
              <Route path="/payment-method" element={<ProtectedRoute><PaymentMethod /></ProtectedRoute>} />
              <Route path="/payment-process" element={<ProtectedRoute><PaymentProcess /></ProtectedRoute>} />
              <Route path="/risk-mitigation" element={<ProtectedRoute><RiskMitigation /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
