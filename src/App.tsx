import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import ClientDashboard from "./pages/ClientDashboard";
import InvoiceDetail from "./pages/InvoiceDetail";
import Payments from "./pages/Payments";
import AdminPanel from "./pages/AdminPanel";
import LeadPipeline from "./pages/LeadPipeline";
import WebDesignKZN from "./pages/WebDesignKZN";
import SEODurban from "./pages/SEODurban";
import GoogleAdsDurban from "./pages/GoogleAdsDurban";
import WebsiteDevelopmentHosting from "./pages/WebsiteDevelopmentHosting";
import Unsubscribe from "./pages/Unsubscribe";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy-load chat widget — pulls in react-markdown (~70 KB) only when needed
const ChatWidget = lazy(() => import("./components/ChatWidget"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/web-design-kzn" element={<WebDesignKZN />} />
            <Route path="/seo-durban" element={<SEODurban />} />
            <Route path="/google-ads-durban" element={<GoogleAdsDurban />} />
            <Route path="/website-development-hosting" element={<WebsiteDevelopmentHosting />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/client" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
            <Route path="/client/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
            <Route path="/client/invoice/:id" element={<ProtectedRoute><InvoiceDetail /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminPanel /></ProtectedRoute>} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Suspense fallback={null}>
            <ChatWidget />
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
