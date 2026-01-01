import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Wrench, Building2, Shield, ChevronLeft, LogOut } from "lucide-react";
import { ProfileCard } from "@/components/ui/ProfileCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const baseProfiles = [
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
] as const;

const adminProfile = {
  id: "admin",
  icon: <Shield className="w-7 h-7" />,
  title: "Administrador",
  description: "Gestão completa do sistema",
  route: "/dashboard/admin",
} as const;

const SelectProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!active) return;

      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      const { data: roleData, error } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });

      if (!active) return;

      if (error) {
        console.error("Erro ao carregar permissões:", error);
        toast.error("Erro ao carregar permissões");
        setIsAdmin(false);
      } else {
        setIsAdmin(Boolean(roleData));
      }

      setLoading(false);
    };

    load();

    return () => {
      active = false;
    };
  }, [navigate]);

  const profiles = useMemo(() => {
    return isAdmin ? [...baseProfiles, adminProfile] : [...baseProfiles];
  }, [isAdmin]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

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

  if (loading) {
    return (
      <div className="mobile-container min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="mobile-container min-h-screen bg-background">
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
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
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
          <h1 className="text-2xl font-bold text-foreground font-display">Selecione seu perfil</h1>
          <p className="text-muted-foreground mt-2">Escolha como deseja continuar</p>
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
