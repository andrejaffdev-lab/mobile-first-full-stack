import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, MapPin, DollarSign, ClipboardList, Clock, MessageCircle } from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface Prestador {
  id: string;
  nome: string;
  valor_ganhos: number | null;
}

interface OrdemServico {
  id: string;
  numero_ordem: string | null;
  status: string | null;
  valor_total: number | null;
  observacoes: string | null;
  clientes: {
    nome: string;
    endereco: string | null;
    bairro: string | null;
  } | null;
}

const PrestadorDashboard = () => {
  const navigate = useNavigate();
  const [prestador, setPrestador] = useState<Prestador | null>(null);
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/login');
          return;
        }

        // Buscar dados do prestador
        const { data: prestadorData, error: prestadorError } = await supabase
          .from('prestadores_servico')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (prestadorError) {
          console.error('Erro ao buscar prestador:', prestadorError);
        } else {
          setPrestador(prestadorData);
        }

        // Buscar ordens de serviço pendentes
        if (prestadorData) {
          const { data: ordensData, error: ordensError } = await supabase
            .from('ordens_servico')
            .select(`
              id,
              numero_ordem,
              status,
              valor_total,
              observacoes,
              clientes (
                nome,
                endereco,
                bairro
              )
            `)
            .eq('prestador_id', prestadorData.id)
            .in('status', ['pendente', 'andamento'])
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

    fetchData();
  }, [navigate]);

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const stats = [
    { label: "Serviços Pendentes", value: ordens.length.toString(), icon: Clock, color: "bg-warning/10 text-warning" },
    { label: "Ganhos do Mês", value: formatCurrency(prestador?.valor_ganhos || 0), icon: DollarSign, color: "bg-success/10 text-success" },
  ];

  return (
    <div className="mobile-container min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-hero-gradient px-6 pt-12 pb-20 rounded-b-[2rem]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <p className="text-white/70 text-sm">Bem-vindo,</p>
            <h1 className="text-2xl font-bold text-white font-display">
              {loading ? 'Carregando...' : (prestador?.nome || 'Prestador')}
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

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-4 shadow-card"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-foreground font-display">
                {stat.value}
              </p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Serviços Disponíveis */}
      <div className="px-6 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground font-display">
              Serviços Disponíveis
            </h2>
            <button className="text-sm text-primary font-medium">Ver mapa</button>
          </div>

          <div className="space-y-4">
            {ordens.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum serviço pendente
              </p>
            ) : (
              ordens.map((ordem, index) => (
                <motion.div
                  key={ordem.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="premium-card"
                  onClick={() => navigate(`/prestador/servico/${ordem.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {ordem.clientes?.nome || 'Cliente'}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {ordem.clientes?.endereco 
                            ? `${ordem.clientes.endereco}${ordem.clientes.bairro ? ` - ${ordem.clientes.bairro}` : ''}`
                            : 'Endereço não informado'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {ordem.numero_ordem || 'Ordem de Serviço'}
                      </span>
                    </div>
                    <span className="font-bold text-primary font-display">
                      {formatCurrency(ordem.valor_total)}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default PrestadorDashboard;