import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Camera, Wrench, FileCheck, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChecklistItem } from "@/components/ui/ChecklistItem";

const tarefas = [
  { id: "foto-antes", title: "Foto Antes", hasPhoto: true },
  { id: "revisar-vidro", title: "Revisar Vidro", icon: <Wrench className="w-5 h-5" /> },
  { id: "trocar-roldanas", title: "Trocar Roldanas", icon: <Wrench className="w-5 h-5" /> },
  { id: "fotos-roldanas", title: "Fotos das Roldanas Novas", hasPhoto: true },
  { id: "verificar-fixacoes", title: "Verificar Fixações", icon: <FileCheck className="w-5 h-5" /> },
  { id: "ajustar-box", title: "Ajustar Box", icon: <Wrench className="w-5 h-5" /> },
];

const Tarefas = () => {
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const toggleTask = (id: string) => {
    setCompletedTasks((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const allCompleted = completedTasks.length === tarefas.length;

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
          <h1 className="text-lg font-semibold text-foreground font-display">
            Tarefas do Serviço
          </h1>
        </div>
      </header>

      {/* Progress */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Progresso</span>
          <span className="text-sm font-medium text-primary">
            {completedTasks.length}/{tarefas.length}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${(completedTasks.length / tarefas.length) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="px-6 pb-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {tarefas.map((tarefa, index) => (
            <motion.div
              key={tarefa.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ChecklistItem
                icon={tarefa.hasPhoto ? <Camera className="w-5 h-5" /> : tarefa.icon}
                title={tarefa.title}
                completed={completedTasks.includes(tarefa.id)}
                hasPhoto={tarefa.hasPhoto}
                onClick={() => toggleTask(tarefa.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-6 max-w-md mx-auto">
        <Button
          onClick={() => navigate("/prestador/assinatura")}
          className="w-full"
          size="lg"
          disabled={!allCompleted}
          variant={allCompleted ? "default" : "secondary"}
        >
          <PenTool className="w-5 h-5" />
          Assinatura Digital
        </Button>
      </div>
    </div>
  );
};

export default Tarefas;
