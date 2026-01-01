import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FileText, 
  Shield, 
  Film, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Download,
  ChevronRight,
  Filter
} from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type StatusType = "todos" | "concluido" | "andamento" | "pendente";

interface Order {
  id: string;
  type: "manutencao" | "pelicula";
  title: string;
  date: string;
  status: "concluido" | "andamento" | "pendente";
  prestador?: string;
  value: string;
  hasCertificate?: boolean;
}

const statusConfig = {
  concluido: {
    label: "Concluído",
    icon: CheckCircle2,
    color: "bg-success/10 text-success",
    iconColor: "text-success",
  },
  andamento: {
    label: "Em Andamento",
    icon: Clock,
    color: "bg-warning/10 text-warning",
    iconColor: "text-warning",
  },
  pendente: {
    label: "Pendente",
    icon: AlertCircle,
    color: "bg-muted text-muted-foreground",
    iconColor: "text-muted-foreground",
  },
};

const Servicos = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<StatusType>("todos");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarServicos = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Buscar cliente pelo user_id
      const { data: cliente } = await supabase
        .from('clientes')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!cliente) {
        setIsLoading(false);
        return;
      }

      // Buscar ordens de serviço
      const { data: ordens } = await supabase
        .from('ordens_servico')
        .select(`
          *,
          prestador:prestadores_servico(nome)
        `)
        .eq('cliente_id', cliente.id)
        .order('created_at', { ascending: false });

      if (!ordens) {
        setIsLoading(false);
        return;
      }

      // Buscar certificados
      const { data: certificados } = await supabase
        .from('certificados')
        .select('ordem_id')
        .in('ordem_id', ordens.map(o => o.id));

      const certificadoIds = new Set(certificados?.map(c => c.ordem_id) || []);

      // Verificar tipo de serviço
      const { data: manutencoes } = await supabase
        .from('processo_manutencao')
        .select('ordem_id')
        .in('ordem_id', ordens.map(o => o.id));

      const manutencaoIds = new Set(manutencoes?.map(m => m.ordem_id) || []);

      const mappedOrders: Order[] = ordens.map(ordem => {
        const isManutencao = manutencaoIds.has(ordem.id);
        const mapStatus = (status: string): "concluido" | "andamento" | "pendente" => {
          if (status === 'concluido') return 'concluido';
          if (status === 'andamento') return 'andamento';
          return 'pendente';
        };

        return {
          id: ordem.id,
          type: isManutencao ? "manutencao" : "pelicula",
          title: isManutencao ? "Manutenção Preventiva" : "Aplicação de Película",
          date: ordem.data_solicitacao 
            ? format(new Date(ordem.data_solicitacao), "dd MMM yyyy", { locale: ptBR })
            : '',
          status: mapStatus(ordem.status || 'pendente'),
          prestador: ordem.prestador?.nome,
          value: `R$ ${Number(ordem.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          hasCertificate: certificadoIds.has(ordem.id),
        };
      });

      setOrders(mappedOrders);
      setIsLoading(false);
    };

    carregarServicos();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (filter === "todos") return true;
    return order.status === filter;
  });

  const filters: { value: StatusType; label: string }[] = [
    { value: "todos", label: "Todos" },
    { value: "concluido", label: "Concluídos" },
    { value: "andamento", label: "Em Andamento" },
    { value: "pendente", label: "Pendentes" },
  ];

  return (
    <div className="mobile-container min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground font-display">
            Meus Serviços
          </h1>
          <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <Filter className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar -mx-6 px-6">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === f.value
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      {/* Orders List */}
      <div className="px-6 py-6">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredOrders.map((order, index) => {
              const config = statusConfig[order.status];
              const StatusIcon = config.icon;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/servico/${order.id}`)}
                  className="premium-card cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      {order.type === "manutencao" ? (
                        <Shield className="w-6 h-6 text-primary" />
                      ) : (
                        <Film className="w-6 h-6 text-primary" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-foreground line-clamp-1">
                          {order.title}
                        </h3>
                        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                      </div>

                      <p className="text-sm text-muted-foreground mt-1">
                        {order.date}
                      </p>

                      {order.prestador && (
                        <p className="text-sm text-muted-foreground">
                          Prestador: {order.prestador}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-4 h-4 ${config.iconColor}`} />
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                        <span className="font-bold text-primary font-display">
                          {order.value}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Button */}
                  {order.hasCertificate && (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Download certificate logic
                      }}
                      className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-success/10 text-success font-medium text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Baixar Certificado
                    </motion.button>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {!isLoading && filteredOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {orders.length === 0 
                ? "Nenhum serviço encontrado." 
                : "Nenhum serviço encontrado com esse filtro."}
            </p>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Servicos;
