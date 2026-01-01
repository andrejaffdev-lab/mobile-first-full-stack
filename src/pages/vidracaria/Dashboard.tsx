import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Users, DollarSign, UserPlus, Upload, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/layout/BottomNav";

const VidracariaDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Clientes Indicados", value: "45", icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Comissões do Mês", value: "R$ 1.890", icon: DollarSign, color: "bg-success/10 text-success" },
  ];

  const recentClients = [
    { name: "Ana Paula", date: "Há 2 dias", status: "Ativo" },
    { name: "Roberto Carlos", date: "Há 5 dias", status: "Ativo" },
    { name: "Maria José", date: "Há 1 semana", status: "Pendente" },
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
              Vidraçaria Premium
            </h1>
          </div>
          <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center relative">
            <Bell className="w-5 h-5 text-white" />
          </button>
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

      {/* Ações Rápidas */}
      <div className="px-6 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <UserPlus className="w-6 h-6" />
            <span className="text-sm">Cadastrar Cliente</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <Upload className="w-6 h-6" />
            <span className="text-sm">Upload em Massa</span>
          </Button>
        </motion.div>

        {/* Clientes Recentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground font-display">
              Indicações Recentes
            </h2>
            <button className="text-sm text-primary font-medium">Ver todas</button>
          </div>

          <div className="space-y-3">
            {recentClients.map((client, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{client.name}</p>
                  <p className="text-sm text-muted-foreground">{client.date}</p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    client.status === "Ativo"
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                  }`}
                >
                  {client.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Gráfico de Comissões */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <div className="premium-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Comissões</h3>
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div className="h-24 flex items-end justify-between gap-2">
              {[40, 65, 45, 80, 55, 90, 70].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 bg-primary/20 rounded-t-md relative"
                  style={{ height: `${height}%` }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-md"
                    style={{ height: `${height * 0.7}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span>Sáb</span>
              <span>Dom</span>
            </div>
          </div>
        </motion.div>
      </div>

      <BottomNav variant="vidracaria" />
    </div>
  );
};

export default VidracariaDashboard;
