import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminCadastrarCliente = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{5})(\d{3})/, "$1-$2");
  };

  const buscarCEP = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, "");
    if (cleanCEP.length !== 8) return;

    setLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          endereco: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === "telefone") {
      formattedValue = formatPhone(value);
    } else if (field === "cep") {
      formattedValue = formatCEP(value);
      if (value.replace(/\D/g, "").length === 8) {
        buscarCEP(value);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("clientes").insert({
        nome: formData.nome,
        email: formData.email || null,
        telefone: formData.telefone || null,
        cep: formData.cep || null,
        endereco: formData.endereco || null,
        numero: formData.numero || null,
        complemento: formData.complemento || null,
        bairro: formData.bairro || null,
        cidade: formData.cidade || null,
        estado: formData.estado || null,
        status: "ativo",
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Cliente cadastrado com sucesso!");
      setTimeout(() => {
        navigate("/admin/clientes");
      }, 2000);
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      toast.error("Erro ao cadastrar cliente");
    } finally {
      setLoading(false);
    }
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
            Cliente Cadastrado!
          </h1>
          <p className="text-muted-foreground">
            O cliente foi cadastrado com sucesso.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mobile-container min-h-screen bg-background pb-32">
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
            Novo Cliente
          </h1>
        </div>
      </header>

      <div className="px-6 py-6 space-y-6">
        {/* Dados Pessoais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-foreground font-display flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Dados Pessoais
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                placeholder="Nome do cliente"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="telefone"
                  className="pl-10"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={(e) => handleChange("telefone", e.target.value)}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Endereço */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-foreground font-display flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Endereço
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                placeholder="00000-000"
                value={formData.cep}
                onChange={(e) => handleChange("cep", e.target.value)}
                maxLength={9}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                placeholder="Rua, Avenida..."
                value={formData.endereco}
                onChange={(e) => handleChange("endereco", e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  placeholder="Nº"
                  value={formData.numero}
                  onChange={(e) => handleChange("numero", e.target.value)}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  placeholder="Apto, Bloco..."
                  value={formData.complemento}
                  onChange={(e) => handleChange("complemento", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                placeholder="Bairro"
                value={formData.bairro}
                onChange={(e) => handleChange("bairro", e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  placeholder="Cidade"
                  value={formData.cidade}
                  onChange={(e) => handleChange("cidade", e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">UF</Label>
                <Input
                  id="estado"
                  placeholder="UF"
                  value={formData.estado}
                  onChange={(e) => handleChange("estado", e.target.value)}
                  disabled={loading}
                />
              </div>
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
          disabled={!formData.nome || !formData.telefone || loading}
        >
          <CheckCircle2 className="w-5 h-5" />
          {loading ? "Cadastrando..." : "Cadastrar Cliente"}
        </Button>
      </div>
    </div>
  );
};

export default AdminCadastrarCliente;
