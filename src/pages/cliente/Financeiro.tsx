import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Wallet, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Receipt
} from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";

interface Pagamento {
  id: string;
  ordemId: string;
  descricao: string;
  valor: number;
  status: "pago" | "pendente" | "atrasado";
  data: string;
  metodoPagamento?: string;
}

const pagamentos: Pagamento[] = [
  {
    id: "PAG001",
    ordemId: "OS-2024-001",
    descricao: "Manutenção Preventiva Anual",
    valor: 200.00,
    status: "pago",
    data: "15 Mar 2024",
    metodoPagamento: "Pix",
  },
  {
    id: "PAG002",
    ordemId: "OS-2024-002",
    descricao: "Aplicação de Película",
    valor: 255.00,
    status: "pendente",
    data: "20 Jan 2024",
  },
  {
    id: "PAG003",
    ordemId: "OS-2023-045",
    descricao: "Manutenção Preventiva Anual",
    valor: 180.00,
    status: "pago",
    data: "10 Mar 2023",
    metodoPagamento: "Cartão 3x",
  },
  {
    id: "PAG004",
    ordemId: "OS-2024-003",
    descricao: "Manutenção Preventiva Anual",
    valor: 200.00,
    status: "pendente",
    data: "Vence em 20 Abr 2025",
  },
];

const statusConfig = {
  pago: {
    label: "Pago",
    icon: CheckCircle2,
    color: "bg-success/10 text-success",
    iconColor: "text-success",
  },
  pendente: {
    label: "Pendente",
    icon: Clock,
    color: "bg-warning/10 text-warning",
    iconColor: "text-warning",
  },
  atrasado: {
    label: "Atrasado",
    icon: AlertCircle,
    color: "bg-destructive/10 text-destructive",
    iconColor: "text-destructive",
  },
};

const Financeiro = () => {
  const navigate = useNavigate();

  const totalPago = pagamentos
    .filter((p) => p.status === "pago")
    .reduce((acc, p) => acc + p.valor, 0);

  const totalPendente = pagamentos
    .filter((p) => p.status === "pendente" || p.status === "atrasado")
    .reduce((acc, p) => acc + p.valor, 0);

  return (
    <div className="mobile-container min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-hero-gradient px-6 pt-12 pb-16 rounded-b-[2rem]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-white font-display">
            Financeiro
          </h1>
          <p className="text-white/70 mt-1">Acompanhe seus pagamentos</p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4 mt-6"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-white/80" />
              <span className="text-white/70 text-sm">Total Pago</span>
            </div>
            <p className="text-2xl font-bold text-white font-display">
              R$ {totalPago.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-warning" />
              <span className="text-white/70 text-sm">Pendente</span>
            </div>
            <p className="text-2xl font-bold text-warning font-display">
              R$ {totalPendente.toFixed(2).replace(".", ",")}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Payments List */}
      <div className="px-6 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground font-display">
              Histórico
            </h2>
            <button className="text-sm text-primary font-medium">
              Exportar
            </button>
          </div>

          <div className="space-y-3">
            {pagamentos.map((pagamento, index) => {
              const config = statusConfig[pagamento.status];
              const StatusIcon = config.icon;

              return (
                <motion.div
                  key={pagamento.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.05 }}
                  className="premium-card"
                  onClick={() => navigate(`/servico/${pagamento.ordemId}`)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      pagamento.status === "pago" ? "bg-success/10" : "bg-warning/10"
                    }`}>
                      {pagamento.status === "pago" ? (
                        <Receipt className="w-6 h-6 text-success" />
                      ) : (
                        <Wallet className="w-6 h-6 text-warning" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground font-mono">
                            {pagamento.ordemId}
                          </p>
                          <h3 className="font-semibold text-foreground mt-0.5">
                            {pagamento.descricao}
                          </h3>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                      </div>

                      <p className="text-sm text-muted-foreground mt-1">
                        {pagamento.data}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-4 h-4 ${config.iconColor}`} />
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${config.color}`}>
                            {config.label}
                          </span>
                          {pagamento.metodoPagamento && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <CreditCard className="w-3 h-3" />
                              {pagamento.metodoPagamento}
                            </span>
                          )}
                        </div>
                        <span className="font-bold text-foreground font-display">
                          R$ {pagamento.valor.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Financeiro;
