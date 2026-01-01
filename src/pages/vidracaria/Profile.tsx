import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  DollarSign, 
  Users, 
  Settings, 
  HelpCircle,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ProfileVidracaria = () => {
  const navigate = useNavigate();

  const vidracaria = {
    nome: "Vidraçaria Premium",
    email: "contato@vidracariapremium.com",
    telefone: "(11) 3333-4444",
    cnpj: "12.345.678/0001-90",
    clientesIndicados: 45,
    comissaoTotal: "R$ 4.500,00",
    membroDesde: "Janeiro 2024",
  };

  const menuItems = [
    { icon: Users, label: "Clientes Indicados", route: "/vidracaria/clientes" },
    { icon: DollarSign, label: "Minhas Comissões", route: "/vidracaria/comissoes" },
    { icon: Settings, label: "Configurações", route: "/vidracaria/configuracoes" },
    { icon: HelpCircle, label: "Ajuda", route: "/vidracaria/ajuda" },
  ];

  return (
    <div className="mobile-container min-h-screen bg-background pb-8 overflow-x-hidden">
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
            <Building2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground font-display">
            {vidracaria.nome}
          </h2>
          <p className="text-muted-foreground">{vidracaria.email}</p>
          
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border">
            <div>
              <p className="font-bold text-foreground text-xl">{vidracaria.clientesIndicados}</p>
              <p className="text-xs text-muted-foreground">Clientes Indicados</p>
            </div>
            <div>
              <p className="font-bold text-primary text-xl">{vidracaria.comissaoTotal}</p>
              <p className="text-xs text-muted-foreground">Comissão Total</p>
            </div>
          </div>
        </motion.div>

        {/* Dados da Vidraçaria */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card"
        >
          <h3 className="font-semibold text-foreground mb-4">Dados da Empresa</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Telefone</span>
              <span className="text-foreground">{vidracaria.telefone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">CNPJ</span>
              <span className="text-foreground">{vidracaria.cnpj}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Parceiro desde</span>
              <span className="text-foreground">{vidracaria.membroDesde}</span>
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

export default ProfileVidracaria;
