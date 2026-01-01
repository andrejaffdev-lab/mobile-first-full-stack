import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  price: string;
  selected?: boolean;
  required?: boolean;
  onClick?: () => void;
}

export const ServiceCard = ({
  icon,
  title,
  description,
  price,
  selected = false,
  required = false,
  onClick,
}: ServiceCardProps) => {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
        selected
          ? "border-primary bg-primary/5 shadow-card"
          : "border-border bg-card hover:border-primary/30"
      }`}
    >
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-white" />
        </motion.div>
      )}

      {required && (
        <span className="absolute top-3 left-3 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
          Obrigatório
        </span>
      )}

      <div className="flex items-start gap-4 mt-6">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground font-display">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-lg font-bold text-primary font-display">{price}</p>
      </div>
    </motion.div>
  );
};
