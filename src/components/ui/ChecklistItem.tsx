import { motion } from "framer-motion";
import { Check, ChevronRight, Camera, Upload } from "lucide-react";

interface ChecklistItemProps {
  icon?: React.ReactNode;
  title: string;
  completed?: boolean;
  hasPhoto?: boolean;
  onClick?: () => void;
}

export const ChecklistItem = ({
  icon,
  title,
  completed = false,
  hasPhoto = false,
  onClick,
}: ChecklistItemProps) => {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
        completed
          ? "border-success/30 bg-success/5"
          : "border-border bg-card hover:border-primary/30"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
          completed ? "bg-success text-white" : "bg-muted text-muted-foreground"
        }`}
      >
        {completed ? (
          <Check className="w-5 h-5" />
        ) : hasPhoto ? (
          <Camera className="w-5 h-5" />
        ) : icon ? (
          icon
        ) : (
          <Upload className="w-5 h-5" />
        )}
      </div>
      <span
        className={`flex-1 font-medium ${
          completed ? "text-success" : "text-foreground"
        }`}
      >
        {title}
      </span>
      <ChevronRight
        className={`w-5 h-5 shrink-0 ${
          completed ? "text-success" : "text-muted-foreground"
        }`}
      />
    </motion.div>
  );
};
