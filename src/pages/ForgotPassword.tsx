import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simula envio de email - depois conectar com backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setEmailSent(true);
    setIsLoading(false);
    toast.success("Email enviado com sucesso!");
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center px-6 pt-16"
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-3"
          >
            <h1 className="text-4xl font-bold text-white font-display tracking-tight">
              BOX<span className="font-normal text-white/80">em</span>
            </h1>
            <h2 className="text-3xl font-bold text-white font-display -mt-1">
              GARANTIA
            </h2>
          </motion.div>
        </div>
      </motion.div>

      {/* Formulário */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex-1 px-6 py-6"
      >
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>

        {!emailSent ? (
          <>
            <h3 className="text-xl font-semibold text-white mb-2">
              Esqueceu a senha?
            </h3>
            <p className="text-white/70 text-sm mb-6">
              Digite seu e-mail e enviaremos instruções para redefinir sua senha.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-white text-primary hover:bg-white/90" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar instruções"}
              </Button>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Verifique seu e-mail
            </h3>
            <p className="text-white/70 text-sm mb-6">
              Enviamos as instruções de recuperação para{" "}
              <span className="text-white font-medium">{email}</span>
            </p>
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => navigate("/login")}
            >
              Voltar ao login
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
