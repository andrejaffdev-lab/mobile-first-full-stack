import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import SelectProfile from "./pages/SelectProfile";
import ClienteDashboard from "./pages/cliente/Dashboard";
import NovaOrdem from "./pages/cliente/NovaOrdem";
import SelecionarServicos from "./pages/cliente/SelecionarServicos";
import Pagamento from "./pages/cliente/Pagamento";
import Servicos from "./pages/cliente/Servicos";
import DetalheServico from "./pages/cliente/DetalheServico";
import Garantia from "./pages/cliente/Garantia";
import Financeiro from "./pages/cliente/Financeiro";
import Profile from "./pages/cliente/Profile";
import Chat from "./pages/Chat";
import PrestadorDashboard from "./pages/prestador/Dashboard";
import Tarefas from "./pages/prestador/Tarefas";
import DetalheServicoPrestador from "./pages/prestador/DetalheServico";
import Ganhos from "./pages/prestador/Ganhos";
import Assinatura from "./pages/prestador/Assinatura";
import ProfilePrestador from "./pages/prestador/Profile";
import VidracariaDashboard from "./pages/vidracaria/Dashboard";
import CadastrarCliente from "./pages/vidracaria/CadastrarCliente";
import Clientes from "./pages/vidracaria/Clientes";
import Comissoes from "./pages/vidracaria/Comissoes";
import ProfileVidracaria from "./pages/vidracaria/Profile";
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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sobre" element={<LandingPage />} />
          <Route path="/register" element={<Login />} />
          <Route path="/select-profile" element={<SelectProfile />} />
          
          {/* Cliente */}
          <Route path="/dashboard/cliente" element={<ClienteDashboard />} />
          <Route path="/dashboard" element={<Navigate to="/dashboard/cliente" replace />} />
          <Route path="/nova-ordem" element={<NovaOrdem />} />
          <Route path="/selecionar-servicos" element={<SelecionarServicos />} />
          <Route path="/pagamento" element={<Pagamento />} />
          <Route path="/orders" element={<Servicos />} />
          <Route path="/servico/:id" element={<DetalheServico />} />
          <Route path="/garantia" element={<Garantia />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          
          {/* Prestador */}
          <Route path="/dashboard/prestador" element={<PrestadorDashboard />} />
          <Route path="/prestador/servico/:id" element={<DetalheServicoPrestador />} />
          <Route path="/prestador/tarefas/:id" element={<Tarefas />} />
          <Route path="/prestador/tarefas" element={<Tarefas />} />
          <Route path="/prestador/assinatura" element={<Assinatura />} />
          <Route path="/prestador/ganhos" element={<Ganhos />} />
          <Route path="/prestador/profile" element={<ProfilePrestador />} />
          
          {/* Vidraçaria */}
          <Route path="/dashboard/vidracaria" element={<VidracariaDashboard />} />
          <Route path="/vidracaria/cadastrar-cliente" element={<CadastrarCliente />} />
          <Route path="/vidracaria/clientes" element={<Clientes />} />
          <Route path="/vidracaria/comissoes" element={<Comissoes />} />
          <Route path="/vidracaria/profile" element={<ProfileVidracaria />} />
          
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
