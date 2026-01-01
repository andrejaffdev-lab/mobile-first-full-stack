import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Shield, Clock, FileText, Bell, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/layout/BottomNav";

const ClienteDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Garantia", value: "ATIVA", icon: Shield, color: "text-success" },
    { label: "Próxima Manutenção", value: "Mar 2025", icon: Clock, color: "text-primary" },
  ];

  const recentOrders = [
    {
      id: "1",
      title: "Manutenção Preventiva",
      date: "15 Mar 2024",
      status: "Concluído",
      statusColor: "bg-success/10 text-success",
    },
    {
      id: "2",
      title: "Aplicação de Película",
      date: "20 Jan 2024",
      status: "Em Andamento",
      statusColor: "bg-warning/10 text-warning",
    },
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
              João Silva
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
          {recentOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="premium-card flex items-center gap-4"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{order.title}</h3>
                <p className="text-sm text-muted-foreground">{order.date}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${order.statusColor}`}
              >
                {order.status}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ClienteDashboard;
