import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  DollarSign, 
  FileText, 
  Star, 
  Settings, 
  HelpCircle,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ProfilePrestador = () => {
  const navigate = useNavigate();

  const prestador = {
    nome: "Pedro Montador",
    email: "pedro@email.com",
    telefone: "(11) 99999-7777",
    documento: "123.456.789-00",
    avaliacao: "4.9",
    servicosRealizados: 127,
    membroDesde: "Março 2024",
  };

  const menuItems = [
    { icon: DollarSign, label: "Meus Ganhos", route: "/prestador/ganhos" },
    { icon: FileText, label: "Histórico de Serviços", route: "/prestador/historico" },
    { icon: Star, label: "Avaliações", route: "/prestador/avaliacoes" },
    { icon: Settings, label: "Configurações", route: "/prestador/configuracoes" },
    { icon: HelpCircle, label: "Ajuda", route: "/prestador/ajuda" },
  ];

  return (
    <div className="mobile-container min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-foreground font-display">
            Meu Perfil
          </h1>
        </div>
      </header>

      <div className="px-6 py-6 space-y-6">
        {/* Card do Perfil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card text-center"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground font-display">
            {prestador.nome}
          </h2>
          <p className="text-muted-foreground">{prestador.email}</p>
          
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
            <div>
              <div className="flex items-center justify-center gap-1 text-warning">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold">{prestador.avaliacao}</span>
              </div>
              <p className="text-xs text-muted-foreground">Avaliação</p>
            </div>
            <div>
              <p className="font-bold text-foreground">{prestador.servicosRealizados}</p>
              <p className="text-xs text-muted-foreground">Serviços</p>
            </div>
            <div>
              <p className="font-bold text-foreground">Pro</p>
              <p className="text-xs text-muted-foreground">Nível</p>
            </div>
          </div>
        </motion.div>

        {/* Dados do Prestador */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card"
        >
          <h3 className="font-semibold text-foreground mb-4">Dados Pessoais</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Telefone</span>
              <span className="text-foreground">{prestador.telefone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">CPF</span>
              <span className="text-foreground">{prestador.documento}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Membro desde</span>
              <span className="text-foreground">{prestador.membroDesde}</span>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4">
            Editar Dados
          </Button>
        </motion.div>

        {/* Menu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              onClick={() => navigate(item.route)}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="flex-1 text-left font-medium text-foreground">
                {item.label}
              </span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          ))}
        </motion.div>

        {/* Botão Sair */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            variant="outline" 
            className="w-full border-destructive text-destructive hover:bg-destructive/10"
            onClick={() => navigate("/login")}
          >
            <LogOut className="w-5 h-5" />
            Sair da Conta
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePrestador;
