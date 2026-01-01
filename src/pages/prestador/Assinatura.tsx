import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, RotateCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Assinatura = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      navigate("/dashboard/prestador");
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="mobile-container min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center px-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-success" />
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground font-display mb-2">
            Serviço Concluído!
          </h1>
          <p className="text-muted-foreground">
            A assinatura do cliente foi registrada com sucesso.
          </p>
        </motion.div>
      </div>
    );
  }

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
            Assinatura do Cliente
          </h1>
        </div>
      </header>

      <div className="px-6 py-6 space-y-6">
        {/* Instruções */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Assinatura Digital
          </h2>
          <p className="text-muted-foreground text-sm">
            Peça ao cliente para assinar no campo abaixo confirmando a conclusão do serviço.
          </p>
        </motion.div>

        {/* Canvas de Assinatura */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <canvas
            ref={canvasRef}
            width={320}
            height={200}
            className="w-full border-2 border-dashed border-border rounded-2xl bg-muted/30 touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          {!hasSignature && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-muted-foreground text-sm">Assine aqui</p>
            </div>
          )}
        </motion.div>

        {/* Botão Limpar */}
        <Button
          variant="outline"
          className="w-full"
          onClick={clearSignature}
          disabled={!hasSignature}
        >
          <RotateCcw className="w-4 h-4" />
          Limpar Assinatura
        </Button>

        {/* Resumo do Serviço */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="premium-card"
        >
          <h3 className="font-semibold text-foreground mb-3">Resumo do Serviço</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cliente</span>
              <span className="text-foreground">Maria Santos</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Serviço</span>
              <span className="text-foreground">Manutenção Preventiva</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data</span>
              <span className="text-foreground">15/01/2026</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-muted-foreground">Valor</span>
              <span className="font-bold text-primary">R$ 200,00</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-6 max-w-md mx-auto">
        <Button
          onClick={handleSubmit}
          className="w-full"
          size="lg"
          disabled={!hasSignature}
        >
          <CheckCircle2 className="w-5 h-5" />
          Finalizar Serviço
        </Button>
      </div>
    </div>
  );
};

export default Assinatura;
