import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simula login - depois conectar com backend
    navigate("/select-profile");
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col relative">
      {/* Header com Logo - subido 25px */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col items-center justify-center px-6 pt-6 -mt-6"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-4"
          >
            <h1 className="text-4xl font-bold text-white font-display tracking-tight">
              BOX<span className="font-normal text-white/80">em</span>
            </h1>
            <h2 className="text-3xl font-bold text-white font-display -mt-1">
              GARANTIA
            </h2>
          </motion.div>
          <p className="text-white/70 text-sm">
            Manutenção preventiva para seu box
          </p>
        </div>
      </motion.div>

      {/* Formulário - subido */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-white rounded-t-[2rem] px-6 py-6 shadow-xl"
      >
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
              className="text-sm text-primary hover:underline"
            >
              Esqueceu a senha?
            </button>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Entrar
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => navigate("/register")}
          >
            Cadastre-se
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Ao entrar, você concorda com nossos{" "}
          <span className="text-primary">Termos de Uso</span> e{" "}
          <span className="text-primary">Política de Privacidade</span>
        </p>

        {/* Leia mais - seta para landing page */}
        <motion.button
          onClick={() => navigate("/sobre")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full flex flex-col items-center mt-6 pb-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="text-xs mb-1">leia mais</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Login;
