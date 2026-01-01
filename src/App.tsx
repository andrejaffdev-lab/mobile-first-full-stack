import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import SelectProfile from "./pages/SelectProfile";
import ClienteDashboard from "./pages/cliente/Dashboard";
import NovaOrdem from "./pages/cliente/NovaOrdem";
import SelecionarServicos from "./pages/cliente/SelecionarServicos";
import Pagamento from "./pages/cliente/Pagamento";
import PrestadorDashboard from "./pages/prestador/Dashboard";
import Tarefas from "./pages/prestador/Tarefas";
import VidracariaDashboard from "./pages/vidracaria/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          <Route path="/select-profile" element={<SelectProfile />} />
          
          {/* Cliente */}
          <Route path="/dashboard/cliente" element={<ClienteDashboard />} />
          <Route path="/dashboard" element={<Navigate to="/dashboard/cliente" replace />} />
          <Route path="/nova-ordem" element={<NovaOrdem />} />
          <Route path="/selecionar-servicos" element={<SelecionarServicos />} />
          <Route path="/pagamento" element={<Pagamento />} />
          <Route path="/orders" element={<ClienteDashboard />} />
          <Route path="/chat" element={<ClienteDashboard />} />
          <Route path="/profile" element={<ClienteDashboard />} />
          
          {/* Prestador */}
          <Route path="/dashboard/prestador" element={<PrestadorDashboard />} />
          <Route path="/prestador/tarefas/:id" element={<Tarefas />} />
          <Route path="/prestador/tarefas" element={<Tarefas />} />
          
          {/* Vidraçaria */}
          <Route path="/dashboard/vidracaria" element={<VidracariaDashboard />} />
          
          {/* Admin */}
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
