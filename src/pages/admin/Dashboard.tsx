import { motion } from "framer-motion";
import { Users, Wrench, Building2, Map, TrendingUp, DollarSign } from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    { label: "Clientes", value: "30", icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Prestadores", value: "22", icon: Wrench, color: "bg-success/10 text-success" },
    { label: "Vidraçarias", value: "5", icon: Building2, color: "bg-warning/10 text-warning" },
  ];

  const montadores = [
    { name: "João Souza", distance: "0.75 km" },
    { name: "Marcelo Lima", distance: "0.59 km" },
    { name: "Roberto Silva", distance: "1.2 km" },
  ];

  return (
    <div className="mobile-container min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-hero-gradient px-6 pt-12 pb-8 rounded-b-[2rem]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-white font-display">
            Painel do Administrador
          </h1>
          <p className="text-white/70 mt-1">Gestão completa do sistema</p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-card text-center"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-foreground font-display">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Mapa Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl h-48 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 400 200" className="w-full h-full">
                <path
                  d="M50,100 Q100,50 150,100 T250,100 T350,100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary"
                />
                <circle cx="100" cy="80" r="8" className="fill-primary" />
                <circle cx="200" cy="120" r="8" className="fill-accent" />
                <circle cx="300" cy="90" r="8" className="fill-success" />
              </svg>
            </div>
            <div className="relative z-10 text-center">
              <Map className="w-12 h-12 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Mapa de Cobertura</p>
            </div>
          </div>
        </motion.div>

        {/* Montadores Próximos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <h2 className="text-lg font-semibold text-foreground font-display mb-4">
            Montadores Próximos
          </h2>
          <div className="space-y-3">
            {montadores.map((montador, index) => (
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
                <span className="flex-1 font-medium text-foreground">
                  {montador.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {montador.distance}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 grid grid-cols-2 gap-4"
        >
          <div className="premium-card text-center">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-medium text-foreground">Relatórios</p>
          </div>
          <div className="premium-card text-center">
            <DollarSign className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="font-medium text-foreground">Financeiro</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
