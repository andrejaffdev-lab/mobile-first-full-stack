import { NavLink, useLocation } from "react-router-dom";
import { Home, ClipboardList, User, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface NavItem {
  to: string;
  icon: typeof Home;
  label: string;
}

interface BottomNavProps {
  items?: NavItem[];
}

const defaultItems: NavItem[] = [
  { to: "/dashboard", icon: Home, label: "Início" },
  { to: "/orders", icon: ClipboardList, label: "Serviços" },
  { to: "/chat", icon: MessageCircle, label: "Chat" },
  { to: "/profile", icon: User, label: "Perfil" },
];

export const BottomNav = ({ items = defaultItems }: BottomNavProps) => {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around py-2 px-4">
        {items.map((item) => {
          const isActive = location.pathname.startsWith(item.to);
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-1 py-2 px-4 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <Icon
                className={`w-6 h-6 relative z-10 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-xs font-medium relative z-10 transition-colors ${
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
