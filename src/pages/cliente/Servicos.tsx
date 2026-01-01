import { useState } from "react";
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

const orders: Order[] = [
  {
    id: "1",
    type: "manutencao",
    title: "Manutenção Preventiva Anual",
    date: "15 Mar 2024",
    status: "concluido",
    prestador: "João Souza",
    value: "R$ 200,00",
    hasCertificate: true,
  },
  {
    id: "2",
    type: "pelicula",
    title: "Aplicação de Película",
    date: "20 Jan 2024",
    status: "andamento",
    prestador: "Marcelo Lima",
    value: "R$ 255,00",
  },
  {
    id: "3",
    type: "manutencao",
    title: "Manutenção Preventiva Anual",
    date: "10 Mar 2023",
    status: "concluido",
    prestador: "Pedro Montador",
    value: "R$ 180,00",
    hasCertificate: true,
  },
  {
    id: "4",
    type: "manutencao",
    title: "Manutenção Preventiva Anual",
    date: "Agendado para 20 Abr 2025",
    status: "pendente",
    value: "R$ 200,00",
  },
];

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

        {filteredOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhum serviço encontrado com esse filtro.
            </p>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Servicos;
