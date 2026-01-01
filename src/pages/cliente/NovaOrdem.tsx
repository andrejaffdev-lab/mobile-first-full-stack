import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Camera, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NovaOrdem = () => {
  const navigate = useNavigate();
  const [qtdBox, setQtdBox] = useState(1);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    endereco: "",
    whatsapp: "",
    ambiente: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/selecionar-servicos");
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
            Nova Ordem de Serviço
          </h1>
        </div>
      </header>

      {/* Form */}
      <div className="px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-foreground">Nome</label>
            <Input
              name="nome"
              placeholder="Seu nome completo"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-foreground">CPF</label>
            <Input
              name="cpf"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={handleChange}
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-foreground">
              Endereço
            </label>
            <Input
              name="endereco"
              placeholder="Rua, número, bairro"
              value={formData.endereco}
              onChange={handleChange}
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-foreground">
              WhatsApp
            </label>
            <Input
              name="whatsapp"
              type="tel"
              placeholder="(00) 00000-0000"
              value={formData.whatsapp}
              onChange={handleChange}
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-foreground">
              Quantidade de Box
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setQtdBox(Math.max(1, qtdBox - 1))}
                className="w-12 h-12 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Minus className="w-5 h-5 text-muted-foreground" />
              </button>
              <span className="text-2xl font-bold text-foreground w-12 text-center font-display">
                {qtdBox}
              </span>
              <button
                type="button"
                onClick={() => setQtdBox(qtdBox + 1)}
                className="w-12 h-12 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Plus className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-foreground">
              Ambiente do Box
            </label>
            <div className="flex gap-3">
              <Input
                name="ambiente"
                placeholder="Ex: Banheiro suíte"
                value={formData.ambiente}
                onChange={handleChange}
                className="flex-1"
              />
              <button
                type="button"
                className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4"
          >
            <Button type="submit" className="w-full" size="lg">
              Continuar
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default NovaOrdem;
