import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Wrench, Building2, ChevronLeft } from "lucide-react";
import { ProfileCard } from "@/components/ui/ProfileCard";

const profiles = [
  {
    id: "cliente",
    icon: <User className="w-7 h-7" />,
    title: "Cliente",
    description: "Prestador de Serviço",
    route: "/dashboard/cliente",
  },
  {
    id: "prestador",
    icon: <Wrench className="w-7 h-7" />,
    title: "Prestador de Serviço",
    description: "Tranquilidade para Você!",
    route: "/dashboard/prestador",
  },
  {
    id: "vidraceiro",
    icon: <Building2 className="w-7 h-7" />,
    title: "Vidraceiro",
    description: "Bons negócios de clientes fiéis",
    route: "/dashboard/vidracaria",
  },
];

const SelectProfile = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="mobile-container min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground font-display">
            Como você deseja se cadastrar?
          </h1>
          <p className="text-muted-foreground mt-2">
            Selecione seu perfil para continuar
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {profiles.map((profile) => (
            <motion.div key={profile.id} variants={itemVariants}>
              <ProfileCard
                icon={profile.icon}
                title={profile.title}
                description={profile.description}
                onClick={() => navigate(profile.route)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SelectProfile;
