import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  ChevronRight, 
  Shield, 
  Bell, 
  HelpCircle,
  FileText,
  LogOut,
  Phone,
  Mail,
  MapPin,
  Edit2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/layout/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface ClienteData {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  endereco: string | null;
  numero: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<ClienteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from('clientes')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar cliente:', error);
        } else {
          setCliente(data);
        }
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [navigate]);

  const formatAddress = () => {
    if (!cliente) return 'Endereço não cadastrado';
    const parts = [
      cliente.endereco,
      cliente.numero,
      cliente.bairro,
      cliente.cidade,
      cliente.estado
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Endereço não cadastrado';
  };

  const menuItems = [
    {
      icon: Shield,
      label: "Minha Garantia",
      description: "Verifique o status da sua garantia",
      action: () => navigate("/garantia"),
    },
    {
      icon: Bell,
      label: "Notificações",
      description: "Configure suas preferências",
      action: () => {},
    },
    {
      icon: FileText,
      label: "Termos de Uso",
      description: "Leia nossos termos",
      action: () => {},
    },
    {
      icon: HelpCircle,
      label: "Ajuda e Suporte",
      description: "Fale conosco",
      action: () => {},
    },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="mobile-container min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-hero-gradient px-6 pt-12 pb-20 rounded-b-[2rem]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mx-auto flex items-center justify-center border-4 border-white/30">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white font-display mt-4">
            {loading ? 'Carregando...' : (cliente?.nome || 'Cliente')}
          </h1>
          <p className="text-white/70 mt-1">Cliente</p>
        </motion.div>
      </div>

      {/* User Info Card */}
      <div className="px-6 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Dados Pessoais</h2>
            <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Edit2 className="w-4 h-4 text-primary" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">Email:</span>
              <span className="text-foreground">{cliente?.email || 'Não informado'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">Telefone:</span>
              <span className="text-foreground">{cliente?.telefone || 'Não informado'}</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Endereço:</span>
              <span className="text-foreground">{formatAddress()}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Menu Items */}
      <div className="px-6 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + index * 0.05 }}
              onClick={item.action}
              className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 cursor-pointer transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          ))}
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
            size="lg"
          >
            <LogOut className="w-5 h-5" />
            Sair da Conta
          </Button>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Box em Garantia v1.0.0
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
