import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Download,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Ganhos = () => {
  const navigate = useNavigate();
  const [periodo, setPeriodo] = useState<"semana" | "mes" | "ano">("mes");

  const resumo = {
    total: "R$ 3.840,00",
    pendente: "R$ 640,00",
    servicosRealizados: 19,
    mediaServico: "R$ 202,00",
  };

  const historico = [
    { id: "001", data: "14/01/2026", cliente: "Maria Santos", valor: "R$ 160,00", status: "pago" },
    { id: "002", data: "13/01/2026", cliente: "Carlos Oliveira", valor: "R$ 364,00", status: "pago" },
    { id: "003", data: "12/01/2026", cliente: "Ana Paula", valor: "R$ 160,00", status: "pendente" },
    { id: "004", data: "11/01/2026", cliente: "Roberto Silva", valor: "R$ 240,00", status: "pago" },
    { id: "005", data: "10/01/2026", cliente: "Fernanda Lima", valor: "R$ 480,00", status: "pendente" },
    { id: "006", data: "09/01/2026", cliente: "José Santos", valor: "R$ 160,00", status: "pago" },
  ];

  const periodos = [
    { key: "semana", label: "Semana" },
    { key: "mes", label: "Mês" },
    { key: "ano", label: "Ano" },
  ];

  const graficoData = [40, 65, 45, 80, 55, 90, 70];
  const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  return (
    <div className="mobile-container min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-foreground font-display">
              Meus Ganhos
            </h1>
          </div>
          <Button variant="ghost" size="icon">
            <Download className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="px-6 py-6 space-y-6">
        {/* Filtro de Período */}
        <div className="flex gap-2">
          {periodos.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriodo(p.key as typeof periodo)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                periodo === p.key
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Card de Resumo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-hero-gradient rounded-2xl p-6 text-white"
        >
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 opacity-70" />
            <span className="text-sm opacity-70">Janeiro 2026</span>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-bold font-display">{resumo.total}</span>
            <span className="text-sm opacity-70 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> +12%
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-xs opacity-70">Pendente</p>
              <p className="font-semibold">{resumo.pendente}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Serviços</p>
              <p className="font-semibold">{resumo.servicosRealizados}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Média</p>
              <p className="font-semibold">{resumo.mediaServico}</p>
            </div>
          </div>
        </motion.div>

        {/* Gráfico */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card"
        >
          <h3 className="font-semibold text-foreground mb-4">Ganhos por Dia</h3>
          <div className="h-32 flex items-end justify-between gap-2">
            {graficoData.map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-primary/20 rounded-t-md relative"
                  style={{ height: `${height}%` }}
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height * 0.8}%` }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-md"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            {diasSemana.map((dia) => (
              <span key={dia}>{dia}</span>
            ))}
          </div>
        </motion.div>

        {/* Histórico de Ganhos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-semibold text-foreground mb-4">Histórico</h3>
          <div className="space-y-3">
            {historico.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.status === "pago" 
                    ? "bg-success/10" 
                    : "bg-warning/10"
                }`}>
                  {item.status === "pago" ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <Clock className="w-5 h-5 text-warning" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.cliente}</p>
                  <p className="text-sm text-muted-foreground">
                    #{item.id} • {item.data}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{item.valor}</p>
                  <p className={`text-xs ${
                    item.status === "pago" ? "text-success" : "text-warning"
                  }`}>
                    {item.status === "pago" ? "Pago" : "Pendente"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Ganhos;
