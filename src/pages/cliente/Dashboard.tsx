import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Shield, Clock, FileText, Bell, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/layout/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface Cliente {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
}

interface OrdemServico {
  id: string;
  numero_ordem: string | null;
  status: string | null;
  data_solicitacao: string;
  observacoes: string | null;
}

const ClienteDashboard = () => {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClienteData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/login');
          return;
        }

        // Buscar dados do cliente
        const { data: clienteData, error: clienteError } = await supabase
          .from('clientes')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (clienteError) {
          console.error('Erro ao buscar cliente:', clienteError);
        } else {
          setCliente(clienteData);
        }

        // Buscar ordens de serviço do cliente
        if (clienteData) {
          const { data: ordensData, error: ordensError } = await supabase
            .from('ordens_servico')
            .select('*')
            .eq('cliente_id', clienteData.id)
            .order('data_solicitacao', { ascending: false })
            .limit(5);

          if (ordensError) {
            console.error('Erro ao buscar ordens:', ordensError);
          } else {
            setOrdens(ordensData || []);
          }
        }
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClienteData();
  }, [navigate]);

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case 'concluido': return 'Concluído';
      case 'andamento': return 'Em Andamento';
      case 'pendente': return 'Pendente';
      case 'cancelado': return 'Cancelado';
      default: return 'Pendente';
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'concluido': return 'bg-success/10 text-success';
      case 'andamento': return 'bg-warning/10 text-warning';
      case 'pendente': return 'bg-primary/10 text-primary';
      case 'cancelado': return 'bg-destructive/10 text-destructive';
      default: return 'bg-primary/10 text-primary';
    }
  };

  const stats = [
    { label: "Garantia", value: "ATIVA", icon: Shield, color: "text-success" },
    { label: "Próxima Manutenção", value: "Mar 2025", icon: Clock, color: "text-primary" },
  ];

  return (
    <div className="mobile-container min-h-screen bg-background pb-24">
      {/* Header com Gradiente */}
      <div className="bg-hero-gradient px-6 pt-12 pb-20 rounded-b-[2rem]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <p className="text-white/70 text-sm">Olá,</p>
            <h1 className="text-2xl font-bold text-white font-display">
              {loading ? 'Carregando...' : (cliente?.nome || 'Cliente')}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/chat')}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
            >
              <stat.icon className="w-6 h-6 text-white/80 mb-2" />
              <p className={`text-lg font-bold text-white font-display`}>
                {stat.value}
              </p>
              <p className="text-white/60 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <div className="px-6 -mt-8 mb-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={() => navigate("/nova-ordem")}
            className="w-full shadow-xl"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            Nova Ordem de Serviço
          </Button>
        </motion.div>
      </div>

      {/* Histórico */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground font-display">
            Histórico de Serviços
          </h2>
          <button className="text-sm text-primary font-medium">Ver todos</button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {ordens.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma ordem de serviço encontrada
            </p>
          ) : (
            ordens.map((ordem, index) => (
              <motion.div
                key={ordem.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="premium-card flex items-center gap-4"
                onClick={() => navigate(`/orders/${ordem.id}`)}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">
                    {ordem.numero_ordem || 'Ordem de Serviço'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(ordem.data_solicitacao).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ordem.status)}`}
                >
                  {getStatusLabel(ordem.status)}
                </span>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ClienteDashboard;
