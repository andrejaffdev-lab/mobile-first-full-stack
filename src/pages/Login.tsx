import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("E-mail ou senha inválidos");
        return;
      }

      navigate("/select-profile");
    } catch (err) {
      console.error("Erro no login:", err);
      toast.error("Erro ao entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col relative">
      {/* Header com Logo - subido */}
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
            <h1 className="text-3xl font-bold text-white font-display tracking-tight">
              ECOSISTEMA
            </h1>
            <h2 className="text-2xl font-bold text-white/80 font-display -mt-1">
              VIDREIRO
            </h2>
          </motion.div>
          <p className="text-white/70 text-sm">
            Manutenção preventiva para seu box
          </p>
        </div>
      </motion.div>

      {/* Formulário - fundo azul igual ao topo */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex-1 px-6 py-6"
      >
        <form onSubmit={handleLogin} className="space-y-4">
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 pr-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-white/70 hover:text-white hover:underline"
            >
              Esqueceu a senha?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-white text-primary hover:bg-white/90"
            size="lg"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full border-white/30 text-white hover:bg-white/10"
            size="lg"
            onClick={() => navigate("/register")}
          >
            Cadastre-se
          </Button>
        </form>

        <p className="text-center text-xs text-white/50 mt-4">
          Ao entrar, você concorda com nossos{" "}
          <span className="text-white/70 hover:underline cursor-pointer">Termos de Uso</span> e{" "}
          <span className="text-white/70 hover:underline cursor-pointer">Política de Privacidade</span>
        </p>

        {/* Leia mais - seta para landing page */}
        <motion.button
          onClick={() => navigate("/sobre")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full flex flex-col items-center mt-8 pb-4 text-white/60 hover:text-white transition-colors"
        >
          <span className="text-xs mb-1">leia mais</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Login;
