import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, CreditCard, QrCode, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const paymentMethods = [
  {
    id: "cartao",
    icon: <CreditCard className="w-6 h-6" />,
    title: "Cartão de Crédito em até 3x",
    description: "Parcele sem juros",
  },
  {
    id: "pix",
    icon: <QrCode className="w-6 h-6" />,
    title: "Pix com 5% de Desconto",
    description: "Pagamento instantâneo",
    discount: true,
  },
];

const Pagamento = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const total = 455;

  const handleConfirm = () => {
    // Processa pagamento e navega para sucesso
    navigate("/dashboard/cliente");
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
            Pagamento
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Resumo do Valor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 rounded-2xl p-5 mb-6"
        >
          <p className="text-muted-foreground text-sm mb-1">Valor Total:</p>
          <p className="text-3xl font-bold text-primary font-display">
            R$ {total.toFixed(2).replace(".", ",")}
          </p>
        </motion.div>

        {/* Métodos de Pagamento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground mb-4">
            Forma de Pagamento
          </h2>
          <div className="space-y-3">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.1 }}
                onClick={() => setSelectedMethod(method.id)}
                className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedMethod === method.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                {selectedMethod === method.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedMethod === method.id
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {method.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      {method.title}
                    </h3>
                    {method.discount && (
                      <span className="text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                        -5%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {method.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Resumo dos Serviços */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h2 className="text-sm font-medium text-muted-foreground mb-4">
            Resumo dos Serviços
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-foreground">Manutenção Anual de Box</span>
              <span className="font-semibold text-foreground">R$ 200,00</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-foreground">Aplicação de Película</span>
              <span className="font-semibold text-foreground">R$ 255,00</span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-primary font-display">
                  R$ {selectedMethod === "pix" 
                    ? (total * 0.95).toFixed(2).replace(".", ",")
                    : total.toFixed(2).replace(".", ",")}
                </span>
              </div>
              {selectedMethod === "pix" && (
                <p className="text-xs text-success text-right mt-1">
                  Você economiza R$ {(total * 0.05).toFixed(2).replace(".", ",")}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Fixo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-6 max-w-md mx-auto">
        <Button
          onClick={handleConfirm}
          className="w-full"
          size="lg"
          disabled={!selectedMethod}
        >
          Confirmar Pagamento
        </Button>
      </div>
    </div>
  );
};

export default Pagamento;
