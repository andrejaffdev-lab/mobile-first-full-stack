import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, Lock, Eye, EyeOff, User, Phone, Building, ArrowLeft, MapPin, 
  Car, Bike, Upload, Camera, FileText, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type ProfileType = "cliente" | "prestador" | "vidracaria" | null;
type DocumentType = "cpf" | "cnpj";
type VehicleType = "carro" | "moto";

const qualificacoes = [
  { id: "box_padrao_aluminio", label: "Box Padrão Alumínio" },
  { id: "box_especial_aluminio", label: "Box Especial de Alumínio" },
  { id: "box_ideia_glass", label: "Box da linha Idéia Glass" },
  { id: "box_aparente_inox", label: "Box Aparente de Inox" },
  { id: "box_rollit", label: "Box da linha Rollit" },
  { id: "box_encaixilhado", label: "Box Encaixilhado" },
  { id: "pelicula_seguranca", label: "Instala Película de Segurança" },
];

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialProfileType = (location.state as { profileType?: ProfileType })?.profileType || null;
  
  const [profileType, setProfileType] = useState<ProfileType>(initialProfileType);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Campos comuns
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  // Campos Cliente
  const [cpfCliente, setCpfCliente] = useState("");
  const [enderecoCliente, setEnderecoCliente] = useState("");

  // Campos Prestador
  const [documentType, setDocumentType] = useState<DocumentType>("cpf");
  const [cpfPrestador, setCpfPrestador] = useState("");
  const [cnpjPrestador, setCnpjPrestador] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("carro");
  const [cep, setCep] = useState("");
  const [enderecoPrestador, setEnderecoPrestador] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [selectedQualificacoes, setSelectedQualificacoes] = useState<string[]>([]);
  const [fotosObras, setFotosObras] = useState<File[]>([]);
  const [cnh, setCnh] = useState<File[]>([]);

  // Campos Vidraçaria
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [cnpjVidracaria, setCnpjVidracaria] = useState("");
  const [enderecoVidracaria, setEnderecoVidracaria] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profileType === "prestador") {
      if (selectedQualificacoes.length === 0) {
        toast.error("Selecione pelo menos uma qualificação");
        return;
      }
      if (fotosObras.length < 5) {
        toast.error("Envie pelo menos 5 fotos de obras realizadas");
        return;
      }
      if (cnh.length === 0) {
        toast.error("Envie a foto ou PDF da sua CNH");
        return;
      }
    }

    setIsLoading(true);
    
    // Simula cadastro - depois conectar com backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (profileType === "prestador") {
      toast.success("Cadastro enviado! Aguarde aprovação do administrador.");
    } else {
      toast.success("Cadastro realizado com sucesso!");
    }
    setIsLoading(false);
    navigate("/login");
  };

  const handleQualificacaoChange = (qualId: string, checked: boolean) => {
    if (checked) {
      setSelectedQualificacoes(prev => [...prev, qualId]);
    } else {
      setSelectedQualificacoes(prev => prev.filter(id => id !== qualId));
    }
  };

  const handleFotosObrasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (fotosObras.length + files.length > 10) {
      toast.error("Máximo de 10 fotos permitidas");
      return;
    }
    setFotosObras(prev => [...prev, ...files]);
  };

  const handleCnhChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setCnh(files);
  };

  const buscarCep = async () => {
    if (cep.length < 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setEnderecoPrestador(`${data.logradouro}, ${data.bairro}`);
        setCidade(data.localidade);
        setEstado(data.uf);
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  const profiles = [
    {
      type: "cliente" as ProfileType,
      title: "Cliente",
      description: "Tenho um box e quero manutenção",
      icon: User,
      color: "from-blue-500 to-blue-600"
    },
    {
      type: "prestador" as ProfileType,
      title: "Montador/Prestador",
      description: "Quero oferecer serviços de manutenção",
      icon: Building,
      color: "from-green-500 to-green-600"
    },
    {
      type: "vidracaria" as ProfileType,
      title: "Vidraçaria",
      description: "Sou uma vidraçaria parceira",
      icon: Building,
      color: "from-purple-500 to-purple-600"
    }
  ];

  const getTotalSteps = () => {
    if (profileType === "prestador") return 3;
    return 1;
  };

  const canProceed = () => {
    if (profileType === "prestador") {
      if (step === 1) {
        return nome && email && telefone && password && 
          ((documentType === "cpf" && cpfPrestador) || (documentType === "cnpj" && cnpjPrestador)) &&
          cep && enderecoPrestador;
      }
      if (step === 2) {
        return selectedQualificacoes.length > 0;
      }
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center px-6 pt-8"
      >
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-white font-display tracking-tight">
            BOX<span className="font-normal text-white/80">em</span> GARANTIA
          </h1>
        </div>
      </motion.div>

      {/* Conteúdo */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex-1 px-6 py-4 overflow-auto"
      >
        <button
          onClick={() => {
            if (profileType && step > 1) {
              setStep(step - 1);
            } else if (profileType) {
              setProfileType(null);
              setStep(1);
            } else {
              navigate("/login");
            }
          }}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>

        <AnimatePresence mode="wait">
          {!profileType ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <h3 className="text-xl font-semibold text-white mb-2">
                Como deseja se cadastrar?
              </h3>
              <p className="text-white/70 text-sm mb-6">
                Escolha o tipo de perfil que melhor se encaixa
              </p>

              <div className="space-y-3">
                {profiles.map((profile) => (
                  <motion.button
                    key={profile.type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setProfileType(profile.type)}
                    className="w-full p-4 rounded-xl bg-white/10 border border-white/20 flex items-center gap-4 hover:bg-white/15 transition-colors"
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${profile.color} flex items-center justify-center`}>
                      <profile.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-white font-semibold">{profile.title}</h4>
                      <p className="text-white/60 text-sm">{profile.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`form-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Progress indicator for Prestador */}
              {profileType === "prestador" && (
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        s <= step ? "bg-white" : "bg-white/30"
                      }`}
                    />
                  ))}
                  <span className="text-white/70 text-sm ml-2">
                    Etapa {step} de 3
                  </span>
                </div>
              )}

              <h3 className="text-lg font-semibold text-white mb-4">
                {profileType === "cliente" && "Cadastro de Cliente"}
                {profileType === "vidracaria" && "Cadastro de Vidraçaria"}
                {profileType === "prestador" && step === 1 && "Dados Pessoais"}
                {profileType === "prestador" && step === 2 && "Qualificações"}
                {profileType === "prestador" && step === 3 && "Documentos e Fotos"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* ========== CLIENTE ========== */}
                {profileType === "cliente" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">Nome completo</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type="text"
                          placeholder="Seu nome"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
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
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">Telefone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type="tel"
                          placeholder="(00) 00000-0000"
                          value={telefone}
                          onChange={(e) => setTelefone(e.target.value)}
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">CPF</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type="text"
                          placeholder="000.000.000-00"
                          value={cpfCliente}
                          onChange={(e) => setCpfCliente(e.target.value)}
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">Endereço</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type="text"
                          placeholder="Rua, número, bairro, cidade"
                          value={enderecoCliente}
                          onChange={(e) => setEnderecoCliente(e.target.value)}
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
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
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-white text-primary hover:bg-white/90 mt-4" size="lg" disabled={isLoading}>
                      {isLoading ? "Cadastrando..." : "Cadastrar"}
                    </Button>
                  </>
                )}

                {/* ========== VIDRAÇARIA ========== */}
                {profileType === "vidracaria" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">Nome do responsável</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type="text"
                          placeholder="Seu nome"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">Nome da empresa</label>
                      <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type="text"
                          placeholder="Nome fantasia"
                          value={nomeEmpresa}
                          onChange={(e) => setNomeEmpresa(e.target.value)}
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">E-mail</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type="email"
                          placeholder="empresa@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">Telefone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type="tel"
                          placeholder="(00) 00000-0000"
                          value={telefone}
                          onChange={(e) => setTelefone(e.target.value)}
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">CNPJ</label>
                      <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type="text"
                          placeholder="00.000.000/0000-00"
                          value={cnpjVidracaria}
                          onChange={(e) => setCnpjVidracaria(e.target.value)}
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">Endereço da vidraçaria</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type="text"
                          placeholder="Rua, número, bairro, cidade"
                          value={enderecoVidracaria}
                          onChange={(e) => setEnderecoVidracaria(e.target.value)}
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
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
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-white text-primary hover:bg-white/90 mt-4" size="lg" disabled={isLoading}>
                      {isLoading ? "Cadastrando..." : "Cadastrar"}
                    </Button>
                  </>
                )}

                {/* ========== PRESTADOR - ETAPA 1 ========== */}
                {profileType === "prestador" && step === 1 && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">Nome completo</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type="text"
                          placeholder="Seu nome"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
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

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">Telefone/WhatsApp</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type="tel"
                          placeholder="(00) 00000-0000"
                          value={telefone}
                          onChange={(e) => setTelefone(e.target.value)}
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>

                    {/* CPF ou CNPJ */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/90">Tipo de documento</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setDocumentType("cpf")}
                          className={`flex-1 py-2 rounded-lg border transition-colors ${
                            documentType === "cpf" 
                              ? "bg-white text-primary border-white" 
                              : "bg-white/10 text-white border-white/20"
                          }`}
                        >
                          CPF
                        </button>
                        <button
                          type="button"
                          onClick={() => setDocumentType("cnpj")}
                          className={`flex-1 py-2 rounded-lg border transition-colors ${
                            documentType === "cnpj" 
                              ? "bg-white text-primary border-white" 
                              : "bg-white/10 text-white border-white/20"
                          }`}
                        >
                          CNPJ
                        </button>
                      </div>
                    </div>

                    {documentType === "cpf" ? (
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-white/90">CPF</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                          <Input
                            type="text"
                            placeholder="000.000.000-00"
                            value={cpfPrestador}
                            onChange={(e) => setCpfPrestador(e.target.value)}
                            className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-white/90">CNPJ</label>
                        <div className="relative">
                          <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                          <Input
                            type="text"
                            placeholder="00.000.000/0000-00"
                            value={cnpjPrestador}
                            onChange={(e) => setCnpjPrestador(e.target.value)}
                            className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* Veículo */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/90">Veículo próprio (obrigatório)</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setVehicleType("carro")}
                          className={`flex-1 py-3 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                            vehicleType === "carro" 
                              ? "bg-white text-primary border-white" 
                              : "bg-white/10 text-white border-white/20"
                          }`}
                        >
                          <Car className="w-5 h-5" />
                          Carro
                        </button>
                        <button
                          type="button"
                          onClick={() => setVehicleType("moto")}
                          className={`flex-1 py-3 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                            vehicleType === "moto" 
                              ? "bg-white text-primary border-white" 
                              : "bg-white/10 text-white border-white/20"
                          }`}
                        >
                          <Bike className="w-5 h-5" />
                          Moto
                        </button>
                      </div>
                    </div>

                    {/* Endereço via CEP */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">CEP</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type="text"
                          placeholder="00000-000"
                          value={cep}
                          onChange={(e) => setCep(e.target.value)}
                          onBlur={buscarCep}
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">Endereço</label>
                      <Input
                        type="text"
                        placeholder="Rua, número, bairro"
                        value={enderecoPrestador}
                        onChange={(e) => setEnderecoPrestador(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-white/90">Cidade</label>
                        <Input
                          type="text"
                          placeholder="Cidade"
                          value={cidade}
                          onChange={(e) => setCidade(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-white/90">Estado</label>
                        <Input
                          type="text"
                          placeholder="UF"
                          value={estado}
                          onChange={(e) => setEstado(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
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
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full bg-white text-primary hover:bg-white/90 mt-4"
                      size="lg"
                      disabled={!canProceed()}
                    >
                      Continuar
                    </Button>
                  </>
                )}

                {/* ========== PRESTADOR - ETAPA 2: QUALIFICAÇÕES ========== */}
                {profileType === "prestador" && step === 2 && (
                  <>
                    <p className="text-white/70 text-sm mb-4">
                      Selecione os tipos de box que você tem experiência em instalar/manter:
                    </p>

                    <div className="space-y-3">
                      {qualificacoes.map((qual) => (
                        <label
                          key={qual.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedQualificacoes.includes(qual.id)
                              ? "bg-white/20 border-white/40"
                              : "bg-white/5 border-white/20 hover:bg-white/10"
                          }`}
                        >
                          <Checkbox
                            checked={selectedQualificacoes.includes(qual.id)}
                            onCheckedChange={(checked) => handleQualificacaoChange(qual.id, checked as boolean)}
                            className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-primary"
                          />
                          <span className="text-white">{qual.label}</span>
                        </label>
                      ))}
                    </div>

                    <Button
                      type="button"
                      onClick={() => setStep(3)}
                      className="w-full bg-white text-primary hover:bg-white/90 mt-4"
                      size="lg"
                      disabled={selectedQualificacoes.length === 0}
                    >
                      Continuar
                    </Button>
                  </>
                )}

                {/* ========== PRESTADOR - ETAPA 3: DOCUMENTOS E FOTOS ========== */}
                {profileType === "prestador" && step === 3 && (
                  <>
                    {/* CNH */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/90">
                        CNH (frente e verso ou PDF)
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          multiple
                          onChange={handleCnhChange}
                          className="hidden"
                          id="cnh-upload"
                        />
                        <label
                          htmlFor="cnh-upload"
                          className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-white/30 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                        >
                          <FileText className="w-6 h-6 text-white/70" />
                          <span className="text-white/70">
                            {cnh.length > 0 
                              ? `${cnh.length} arquivo(s) selecionado(s)` 
                              : "Clique para enviar CNH"}
                          </span>
                        </label>
                      </div>
                      {cnh.length > 0 && (
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          CNH enviada
                        </div>
                      )}
                    </div>

                    {/* Fotos de obras */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/90">
                        Fotos de obras realizadas (5 a 10 fotos)
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFotosObrasChange}
                          className="hidden"
                          id="fotos-upload"
                        />
                        <label
                          htmlFor="fotos-upload"
                          className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-white/30 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                        >
                          <Camera className="w-6 h-6 text-white/70" />
                          <span className="text-white/70">
                            Clique para enviar fotos ({fotosObras.length}/10)
                          </span>
                        </label>
                      </div>
                      {fotosObras.length > 0 && (
                        <div className="grid grid-cols-5 gap-2 mt-2">
                          {fotosObras.map((foto, index) => (
                            <div
                              key={index}
                              className="aspect-square rounded-lg bg-white/10 flex items-center justify-center overflow-hidden"
                            >
                              <img
                                src={URL.createObjectURL(foto)}
                                alt={`Obra ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-white/50 text-xs">
                        Mínimo 5 fotos, máximo 10 fotos
                      </p>
                    </div>

                    <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-lg p-3 mt-4">
                      <p className="text-yellow-200 text-sm">
                        ⚠️ Após o cadastro, seu perfil será analisado pela nossa equipe. 
                        Você receberá uma notificação quando for aprovado.
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-white text-primary hover:bg-white/90 mt-4" 
                      size="lg"
                      disabled={isLoading || fotosObras.length < 5 || cnh.length === 0}
                    >
                      {isLoading ? "Enviando cadastro..." : "Enviar cadastro para análise"}
                    </Button>
                  </>
                )}
              </form>

              {profileType !== "prestador" && (
                <p className="text-center text-xs text-white/50 mt-4">
                  Ao cadastrar, você concorda com nossos{" "}
                  <span className="text-white/70 hover:underline cursor-pointer">Termos de Uso</span> e{" "}
                  <span className="text-white/70 hover:underline cursor-pointer">Política de Privacidade</span>
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Register;
