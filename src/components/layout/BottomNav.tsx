import { NavLink, useLocation } from "react-router-dom";
import { Home, ClipboardList, MessageCircle, User, Wallet } from "lucide-react";
import { motion } from "framer-motion";

interface NavItem {
  to: string;
  icon: typeof Home;
  label: string;
}

interface BottomNavProps {
  items?: NavItem[];
  variant?: "cliente" | "prestador" | "vidracaria";
}

const clienteItems: NavItem[] = [
  { to: "/dashboard/cliente", icon: Home, label: "Início" },
  { to: "/orders", icon: ClipboardList, label: "Serviços" },
  { to: "/financeiro", icon: Wallet, label: "Financeiro" },
  { to: "/chat", icon: MessageCircle, label: "Chat" },
  { to: "/profile", icon: User, label: "Perfil" },
];

const prestadorItems: NavItem[] = [
  { to: "/dashboard/prestador", icon: Home, label: "Início" },
  { to: "/prestador/servicos", icon: ClipboardList, label: "Serviços" },
  { to: "/prestador/ganhos", icon: Wallet, label: "Ganhos" },
  { to: "/chat", icon: MessageCircle, label: "Chat" },
  { to: "/profile", icon: User, label: "Perfil" },
];

const vidracariaItems: NavItem[] = [
  { to: "/dashboard/vidracaria", icon: Home, label: "Início" },
  { to: "/vidracaria/clientes", icon: User, label: "Clientes" },
  { to: "/vidracaria/comissoes", icon: Wallet, label: "Comissões" },
  { to: "/chat", icon: MessageCircle, label: "Chat" },
  { to: "/vidracaria/profile", icon: User, label: "Perfil" },
];

export const BottomNav = ({ items, variant = "cliente" }: BottomNavProps) => {
  const location = useLocation();
  
  const getNavItems = () => {
    if (items) return items;
    switch (variant) {
      case "prestador": return prestadorItems;
      case "vidracaria": return vidracariaItems;
      default: return clienteItems;
    }
  };
  
  const navItems = getNavItems();

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || 
            (item.to !== "/dashboard/cliente" && item.to !== "/dashboard/prestador" && location.pathname.startsWith(item.to));
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-1 py-2 px-3 relative min-w-0"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <Icon
                className={`w-5 h-5 relative z-10 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[10px] font-medium relative z-10 transition-colors truncate ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
