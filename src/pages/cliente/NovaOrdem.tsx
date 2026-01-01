import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Camera, Plus, Minus, Loader2, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface BoxAmbiente {
  id: number;
  ambiente: string;
  foto: string | null;
}

const NovaOrdem = () => {
  const navigate = useNavigate();
  const [qtdBox, setQtdBox] = useState(1);
  const [loadingCep, setLoadingCep] = useState(false);
  const [boxes, setBoxes] = useState<BoxAmbiente[]>([
    { id: 1, ambiente: "", foto: null }
  ]);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    whatsapp: "",
  });

  // Atualiza a quantidade de boxes quando qtdBox muda
  useEffect(() => {
    setBoxes((prev) => {
      if (qtdBox > prev.length) {
        // Adiciona novos boxes
        const newBoxes = [...prev];
        for (let i = prev.length; i < qtdBox; i++) {
          newBoxes.push({ id: i + 1, ambiente: "", foto: null });
        }
        return newBoxes;
      } else if (qtdBox < prev.length) {
        // Remove boxes extras
        return prev.slice(0, qtdBox);
      }
      return prev;
    });
  }, [qtdBox]);

  // Busca endereço pelo CEP
  const buscarCep = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, "");
    
    if (cepLimpo.length !== 8) return;
    
    setLoadingCep(true);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }
      
      setFormData((prev) => ({
        ...prev,
        logradouro: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }));
      
      toast.success("Endereço encontrado!");
    } catch (error) {
      toast.error("Erro ao buscar CEP");
    } finally {
      setLoadingCep(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Busca CEP automaticamente
    if (name === "cep" && value.replace(/\D/g, "").length === 8) {
      buscarCep(value);
    }
  };

  const handleBoxAmbienteChange = (id: number, value: string) => {
    setBoxes((prev) =>
      prev.map((box) => (box.id === id ? { ...box, ambiente: value } : box))
    );
  };

  const handleFotoUpload = (id: number) => {
    // Simula upload de foto
    setBoxes((prev) =>
      prev.map((box) =>
        box.id === id ? { ...box, foto: `foto_box_${id}.jpg` } : box
      )
    );
    toast.success(`Foto do Box ${id} adicionada!`);
  };

  const removeFoto = (id: number) => {
    setBoxes((prev) =>
      prev.map((box) => (box.id === id ? { ...box, foto: null } : box))
    );
  };

  const formatCep = (value: string) => {
    const cepLimpo = value.replace(/\D/g, "");
    if (cepLimpo.length <= 5) return cepLimpo;
    return `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5, 8)}`;
  };

  const formatCpf = (value: string) => {
    const cpfLimpo = value.replace(/\D/g, "");
    if (cpfLimpo.length <= 3) return cpfLimpo;
    if (cpfLimpo.length <= 6) return `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3)}`;
    if (cpfLimpo.length <= 9) return `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3, 6)}.${cpfLimpo.slice(6)}`;
    return `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3, 6)}.${cpfLimpo.slice(6, 9)}-${cpfLimpo.slice(9, 11)}`;
  };

  const formatPhone = (value: string) => {
    const phoneLimpo = value.replace(/\D/g, "");
    if (phoneLimpo.length <= 2) return `(${phoneLimpo}`;
    if (phoneLimpo.length <= 7) return `(${phoneLimpo.slice(0, 2)}) ${phoneLimpo.slice(2)}`;
    return `(${phoneLimpo.slice(0, 2)}) ${phoneLimpo.slice(2, 7)}-${phoneLimpo.slice(7, 11)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/selecionar-servicos");
  };

  const increaseQtd = () => setQtdBox((prev) => Math.min(prev + 1, 10));
  const decreaseQtd = () => setQtdBox((prev) => Math.max(prev - 1, 1));

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
      <div className="px-6 py-6 pb-32">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Dados Pessoais
            </h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nome</label>
              <Input
                name="nome"
                placeholder="Seu nome completo"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">CPF</label>
              <Input
                name="cpf"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: formatCpf(e.target.value) })}
                maxLength={14}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">WhatsApp</label>
              <Input
                name="whatsapp"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: formatPhone(e.target.value) })}
                maxLength={15}
                required
              />
            </div>
          </motion.div>

          {/* Endereço */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Endereço
            </h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">CEP</label>
              <div className="relative">
                <Input
                  name="cep"
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={(e) => {
                    const formatted = formatCep(e.target.value);
                    setFormData({ ...formData, cep: formatted });
                    if (formatted.replace(/\D/g, "").length === 8) {
                      buscarCep(formatted);
                    }
                  }}
                  maxLength={9}
                  required
                />
                {loadingCep && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-foreground">Logradouro</label>
                <Input
                  name="logradouro"
                  placeholder="Rua, Avenida..."
                  value={formData.logradouro}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nº</label>
                <Input
                  name="numero"
                  placeholder="123"
                  value={formData.numero}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Complemento</label>
              <Input
                name="complemento"
                placeholder="Apto, Bloco... (opcional)"
                value={formData.complemento}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Bairro</label>
                <Input
                  name="bairro"
                  placeholder="Bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Cidade</label>
                <Input
                  name="cidade"
                  placeholder="Cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Estado</label>
              <Input
                name="estado"
                placeholder="UF"
                value={formData.estado}
                onChange={handleChange}
                maxLength={2}
                className="w-20"
                required
              />
            </div>
          </motion.div>

          {/* Quantidade de Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Quantidade de Box
            </h2>

            <div className="flex items-center justify-center gap-6 py-4">
              <button
                type="button"
                onClick={decreaseQtd}
                disabled={qtdBox <= 1}
                className="w-14 h-14 rounded-xl border-2 border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-6 h-6 text-muted-foreground" />
              </button>
              <div className="text-center">
                <span className="text-4xl font-bold text-primary font-display">
                  {qtdBox}
                </span>
                <p className="text-sm text-muted-foreground mt-1">
                  {qtdBox === 1 ? "box" : "boxes"}
                </p>
              </div>
              <button
                type="button"
                onClick={increaseQtd}
                disabled={qtdBox >= 10}
                className="w-14 h-14 rounded-xl border-2 border-primary bg-primary/5 flex items-center justify-center hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-6 h-6 text-primary" />
              </button>
            </div>
          </motion.div>

          {/* Ambientes de cada Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-4"
          >
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Ambiente e Fotos ({boxes.length} {boxes.length === 1 ? "box" : "boxes"})
            </h2>

            <AnimatePresence mode="popLayout">
              {boxes.map((box, index) => (
                <motion.div
                  key={box.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 rounded-xl bg-card border border-border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">
                      Box {index + 1}
                    </span>
                    {box.foto && (
                      <span className="text-xs text-success bg-success/10 px-2 py-1 rounded-full">
                        ✓ Foto adicionada
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Ambiente
                    </label>
                    <Input
                      placeholder="Ex: Banheiro suíte, Lavabo..."
                      value={box.ambiente}
                      onChange={(e) => handleBoxAmbienteChange(box.id, e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    {!box.foto ? (
                      <button
                        type="button"
                        onClick={() => handleFotoUpload(box.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-primary/30 text-primary hover:bg-primary/5 transition-colors"
                      >
                        <Camera className="w-5 h-5" />
                        <span className="text-sm font-medium">Adicionar Foto</span>
                      </button>
                    ) : (
                      <div className="flex-1 flex items-center gap-3 py-3 px-4 rounded-xl bg-success/10 border border-success/20">
                        <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                          <Camera className="w-5 h-5 text-success" />
                        </div>
                        <span className="flex-1 text-sm text-success font-medium truncate">
                          {box.foto}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFoto(box.id)}
                          className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors"
                        >
                          <X className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </form>
      </div>

      {/* Footer Fixo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-6 max-w-md mx-auto">
        <Button onClick={handleSubmit} className="w-full" size="lg">
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default NovaOrdem;
