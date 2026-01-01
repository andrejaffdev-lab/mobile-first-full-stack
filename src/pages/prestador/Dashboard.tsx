import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, MapPin, DollarSign, ClipboardList, Clock, MessageCircle } from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";

const PrestadorDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Serviços Pendentes", value: "3", icon: Clock, color: "bg-warning/10 text-warning" },
    { label: "Ganhos do Mês", value: "R$ 2.400", icon: DollarSign, color: "bg-success/10 text-success" },
  ];

  const pendingServices = [
    {
      id: "1",
      client: "Maria Santos",
      address: "Rua das Flores, 123 - Centro",
      service: "Manutenção Preventiva",
      value: "R$ 200,00",
      distance: "2.5 km",
    },
    {
      id: "2",
      client: "Carlos Oliveira",
      address: "Av. Brasil, 456 - Jardins",
      service: "Manutenção + Película",
      value: "R$ 455,00",
      distance: "4.8 km",
    },
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
              Pedro Montador
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
            {pendingServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="premium-card"
                onClick={() => navigate(`/prestador/servico/${service.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{service.client}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{service.address}</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {service.distance}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {service.service}
                    </span>
                  </div>
                  <span className="font-bold text-primary font-display">
                    {service.value}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default PrestadorDashboard;
