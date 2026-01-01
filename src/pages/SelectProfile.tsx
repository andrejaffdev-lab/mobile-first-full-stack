import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Wrench, Building2, Shield, ChevronLeft, LogOut } from "lucide-react";
import { ProfileCard } from "@/components/ui/ProfileCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ProfileType = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  route: string;
};

const SelectProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [availableProfiles, setAvailableProfiles] = useState<ProfileType[]>([]);

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

      const profiles: ProfileType[] = [];

      // Verificar se é admin
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });

      if (isAdmin) {
        profiles.push({
          id: "admin",
          icon: <Shield className="w-7 h-7" />,
          title: "Administrador",
          description: "Gestão completa do sistema",
          route: "/dashboard/admin",
        });
      }

      // Verificar se é cliente
      const { data: clienteData } = await supabase
        .from("clientes")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (clienteData) {
        profiles.push({
          id: "cliente",
          icon: <User className="w-7 h-7" />,
          title: "Cliente",
          description: "Acompanhe seus serviços",
          route: "/dashboard/cliente",
        });
      }

      // Verificar se é prestador
      const { data: prestadorData } = await supabase
        .from("prestadores_servico")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (prestadorData) {
        profiles.push({
          id: "prestador",
          icon: <Wrench className="w-7 h-7" />,
          title: "Prestador de Serviço",
          description: "Gerencie suas tarefas",
          route: "/dashboard/prestador",
        });
      }

      // Verificar se é vidraceiro
      const { data: vidracariaData } = await supabase
        .from("vidracarias")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (vidracariaData) {
        profiles.push({
          id: "vidraceiro",
          icon: <Building2 className="w-7 h-7" />,
          title: "Vidraceiro",
          description: "Gerencie suas indicações",
          route: "/dashboard/vidracaria",
        });
      }

      if (!active) return;

      // Se só tem um perfil, redireciona direto
      if (profiles.length === 1) {
        navigate(profiles[0].route, { replace: true });
        return;
      }

      // Se não tem nenhum perfil cadastrado
      if (profiles.length === 0) {
        toast.error("Nenhum perfil encontrado para este usuário");
        await supabase.auth.signOut();
        navigate("/login", { replace: true });
        return;
      }

      setAvailableProfiles(profiles);
      setLoading(false);
    };

    load();

    return () => {
      active = false;
    };
  }, [navigate]);

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
          {availableProfiles.map((profile) => (
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
