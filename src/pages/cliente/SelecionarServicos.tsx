import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Shield, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ui/ServiceCard";

const servicos = [
  {
    id: "manutencao",
    icon: <Shield className="w-7 h-7" />,
    title: "Manutenção Anual de Box",
    description: "Revisão obrigatória para garantir a segurança do seu box.",
    price: "R$ 200,00",
    required: true,
  },
  {
    id: "pelicula",
    icon: <Film className="w-7 h-7" />,
    title: "Aplicação de Película",
    description: "Instalação de película protetora de segurança.",
    price: "~R$ 255,00",
    required: false,
  },
];

const SelecionarServicos = () => {
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState<string[]>(["manutencao"]);

  const toggleService = (id: string) => {
    if (id === "manutencao") return; // Obrigatório, não pode desmarcar
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    let total = 200; // Manutenção obrigatória
    if (selectedServices.includes("pelicula")) {
      total += 255;
    }
    return total;
  };

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
            Selecione o Serviço
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {servicos.map((servico, index) => (
            <motion.div
              key={servico.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ServiceCard
                icon={servico.icon}
                title={servico.title}
                description={servico.description}
                price={servico.price}
                selected={selectedServices.includes(servico.id)}
                required={servico.required}
                onClick={() => toggleService(servico.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Footer Fixo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground">Total estimado:</span>
          <span className="text-2xl font-bold text-primary font-display">
            R$ {calculateTotal().toFixed(2).replace(".", ",")}
          </span>
        </div>
        <Button
          onClick={() => navigate("/pagamento")}
          className="w-full"
          size="lg"
        >
          Confirmar Serviços
        </Button>
      </div>
    </div>
  );
};

export default SelecionarServicos;
