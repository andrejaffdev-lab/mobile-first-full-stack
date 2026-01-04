import { useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";

type ProfileType = "cliente" | "prestador" | "vidracaria" | null;
type DocumentType = "cpf" | "cnpj";
type VehicleType = "carro" | "moto" | "ambos";

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
  const [cepCliente, setCepCliente] = useState("");
  const [enderecoCliente, setEnderecoCliente] = useState("");
  const [numeroCliente, setNumeroCliente] = useState("");
  const [bairroCliente, setBairroCliente] = useState("");
  const [cidadeCliente, setCidadeCliente] = useState("");
  const [estadoCliente, setEstadoCliente] = useState("");

  // Campos Prestador
  const [documentType, setDocumentType] = useState<DocumentType>("cpf");
  const [cpfPrestador, setCpfPrestador] = useState("");
  const [cnpjPrestador, setCnpjPrestador] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("carro");
  const [cep, setCep] = useState("");
  const [enderecoPrestador, setEnderecoPrestador] = useState("");
  const [numeroPrestador, setNumeroPrestador] = useState("");
  const [bairroPrestador, setBairroPrestador] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [selectedQualificacoes, setSelectedQualificacoes] = useState<string[]>([]);
  const [fotosObras, setFotosObras] = useState<File[]>([]);
  const [cnh, setCnh] = useState<File[]>([]);

  // Campos Vidraçaria
  const [razaoSocial, setRazaoSocial] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [cnpjVidracaria, setCnpjVidracaria] = useState("");
  const [cepVidracaria, setCepVidracaria] = useState("");
  const [enderecoVidracaria, setEnderecoVidracaria] = useState("");
  const [numeroVidracaria, setNumeroVidracaria] = useState("");
  const [bairroVidracaria, setBairroVidracaria] = useState("");
  const [cidadeVidracaria, setCidadeVidracaria] = useState("");
  const [estadoVidracaria, setEstadoVidracaria] = useState("");

  // Campos Bancários (prestador e vidraçaria)
  const [pixChave, setPixChave] = useState("");
  const [bancoNome, setBancoNome] = useState("");

  const uploadFiles = async (files: File[], bucket: string, folder: string): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of files) {
      const fileName = `${folder}/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage.from(bucket).upload(fileName, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      urls.push(urlData.publicUrl);
    }
    return urls;
  };

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
    
    try {
      // Criar usuário no auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (authError) throw authError;

      const userId = authData.user?.id;

      if (profileType === "cliente") {
        const { error } = await supabase.from("clientes").insert({
          user_id: userId,
          nome,
          email,
          telefone,
          documento: cpfCliente,
          tipo_documento: "cpf",
          cep: cepCliente,
          endereco: enderecoCliente,
          numero: numeroCliente,
          bairro: bairroCliente,
          cidade: cidadeCliente,
          estado: estadoCliente,
          status: "ativo"
        });
        if (error) throw error;
        toast.success("Cadastro realizado com sucesso!");
      } 
      else if (profileType === "prestador") {
        // Upload fotos de obras
        const fotosUrls = await uploadFiles(fotosObras, "prestadores-fotos", email.replace(/[@.]/g, "_"));
        // Upload CNH
        const cnhUrls = await uploadFiles(cnh, "prestadores-cnh", email.replace(/[@.]/g, "_"));

        const { error } = await supabase.from("prestadores_servico").insert({
          user_id: userId,
          nome,
          email,
          telefone,
          whatsapp: telefone,
          documento: documentType === "cpf" ? cpfPrestador : cnpjPrestador,
          tipo_documento: documentType,
          tipo_veiculo: vehicleType,
          cep,
          endereco: enderecoPrestador,
          numero: numeroPrestador,
          bairro: bairroPrestador,
          cidade,
          estado,
          qualificacoes: selectedQualificacoes,
          fotos_obras: fotosUrls,
          cnh_urls: cnhUrls,
          pix_chave: pixChave,
          banco_nome: bancoNome,
          status: "pendente"
        });
        if (error) throw error;
        toast.success("Cadastro enviado! Aguarde aprovação do administrador.");
      }
      else if (profileType === "vidracaria") {
        const { error } = await supabase.from("vidracarias").insert({
          user_id: userId,
          razao_social: razaoSocial,
          nome_fantasia: nomeFantasia,
          cnpj: cnpjVidracaria,
          email,
          telefone,
          responsavel_nome: nome,
          cep: cepVidracaria,
          endereco: enderecoVidracaria,
          numero: numeroVidracaria,
          bairro: bairroVidracaria,
          cidade: cidadeVidracaria,
          estado: estadoVidracaria,
          pix_chave: pixChave,
          banco_nome: bancoNome,
          status: "pendente"
        });
        if (error) throw error;
        toast.success("Cadastro enviado! Aguarde aprovação do administrador.");
      }

      navigate("/login");
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      if (error.message?.includes("already registered")) {
        toast.error("Este email já está cadastrado");
      } else {
        toast.error(error.message || "Erro ao cadastrar");
      }
    } finally {
      setIsLoading(false);
    }
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

  const buscarCep = async (cepValue: string, tipo: "cliente" | "prestador" | "vidracaria") => {
    if (cepValue.length < 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepValue.replace(/\D/g, '')}/json/`);
      const data = await response.json();
      if (!data.erro) {
        if (tipo === "cliente") {
          setEnderecoCliente(data.logradouro || "");
          setBairroCliente(data.bairro || "");
          setCidadeCliente(data.localidade || "");
          setEstadoCliente(data.uf || "");
        } else if (tipo === "prestador") {
          setEnderecoPrestador(data.logradouro || "");
          setBairroPrestador(data.bairro || "");
          setCidade(data.localidade || "");
          setEstado(data.uf || "");
        } else if (tipo === "vidracaria") {
          setEnderecoVidracaria(data.logradouro || "");
          setBairroVidracaria(data.bairro || "");
          setCidadeVidracaria(data.localidade || "");
          setEstadoVidracaria(data.uf || "");
        }
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
            ECOSISTEMA <span className="font-normal text-white/80">VIDREIRO</span>
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
                      <label className="text-sm font-medium text-white/90">CEP</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type="text"
                          placeholder="00000-000"
                          value={cepCliente}
                          onChange={(e) => setCepCliente(e.target.value)}
                          onBlur={() => buscarCep(cepCliente, "cliente")}
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 space-y-1">
                        <label className="text-sm font-medium text-white/90">Endereço</label>
                        <Input
                          type="text"
                          placeholder="Rua"
                          value={enderecoCliente}
                          onChange={(e) => setEnderecoCliente(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-white/90">Nº</label>
                        <Input
                          type="text"
                          placeholder="123"
                          value={numeroCliente}
                          onChange={(e) => setNumeroCliente(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-white/90">Bairro</label>
                        <Input
                          type="text"
                          placeholder="Bairro"
                          value={bairroCliente}
                          onChange={(e) => setBairroCliente(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-white/90">Cidade</label>
                        <Input
                          type="text"
                          placeholder="Cidade"
                          value={cidadeCliente}
                          onChange={(e) => setCidadeCliente(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">Estado</label>
                      <Input
                        type="text"
                        placeholder="UF"
                        value={estadoCliente}
                        onChange={(e) => setEstadoCliente(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                        required
                      />
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
                      <label className="text-sm font-medium text-white/90">Razão Social</label>
                      <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type="text"
                          placeholder="Razão Social"
                          value={razaoSocial}
                          onChange={(e) => setRazaoSocial(e.target.value)}
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">Nome Fantasia</label>
                      <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type="text"
                          placeholder="Nome Fantasia"
                          value={nomeFantasia}
                          onChange={(e) => setNomeFantasia(e.target.value)}
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
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
                      <label className="text-sm font-medium text-white/90">CEP</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type="text"
                          placeholder="00000-000"
                          value={cepVidracaria}
                          onChange={(e) => setCepVidracaria(e.target.value)}
                          onBlur={() => buscarCep(cepVidracaria, "vidracaria")}
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 space-y-1">
                        <label className="text-sm font-medium text-white/90">Endereço</label>
                        <Input
                          type="text"
                          placeholder="Rua"
                          value={enderecoVidracaria}
                          onChange={(e) => setEnderecoVidracaria(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-white/90">Nº</label>
                        <Input
                          type="text"
                          placeholder="123"
                          value={numeroVidracaria}
                          onChange={(e) => setNumeroVidracaria(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-white/90">Bairro</label>
                        <Input
                          type="text"
                          placeholder="Bairro"
                          value={bairroVidracaria}
                          onChange={(e) => setBairroVidracaria(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-white/90">Cidade</label>
                        <Input
                          type="text"
                          placeholder="Cidade"
                          value={cidadeVidracaria}
                          onChange={(e) => setCidadeVidracaria(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">Estado</label>
                      <Input
                        type="text"
                        placeholder="UF"
                        value={estadoVidracaria}
                        onChange={(e) => setEstadoVidracaria(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                        required
                      />
                    </div>

                    {/* Dados Bancários para recebimento */}
                    <div className="border-t border-white/20 pt-4 mt-4">
                      <p className="text-sm font-medium text-white/90 mb-3">Dados Bancários para Recebimento</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">Chave PIX</label>
                      <Input
                        type="text"
                        placeholder="CPF, CNPJ, e-mail ou telefone"
                        value={pixChave}
                        onChange={(e) => setPixChave(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">Banco que recebe</label>
                      <Input
                        type="text"
                        placeholder="Nome do banco"
                        value={bancoNome}
                        onChange={(e) => setBancoNome(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                      />
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
                        <button
                          type="button"
                          onClick={() => setVehicleType("ambos")}
                          className={`flex-1 py-3 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                            vehicleType === "ambos" 
                              ? "bg-white text-primary border-white" 
                              : "bg-white/10 text-white border-white/20"
                          }`}
                        >
                          Ambos
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
                          onBlur={() => buscarCep(cep, "prestador")}
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 space-y-1">
                        <label className="text-sm font-medium text-white/90">Endereço</label>
                        <Input
                          type="text"
                          placeholder="Rua"
                          value={enderecoPrestador}
                          onChange={(e) => setEnderecoPrestador(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-white/90">Nº</label>
                        <Input
                          type="text"
                          placeholder="123"
                          value={numeroPrestador}
                          onChange={(e) => setNumeroPrestador(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-white/90">Bairro</label>
                        <Input
                          type="text"
                          placeholder="Bairro"
                          value={bairroPrestador}
                          onChange={(e) => setBairroPrestador(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                        />
                      </div>
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
                    <p className="text-white/70 text-sm mb-4">
                      Envie fotos das suas obras e sua CNH para validação:
                    </p>

                    {/* Upload de fotos de obras */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/90">
                        Fotos de obras realizadas (mínimo 5, máximo 10)
                      </label>
                      <div className="border-2 border-dashed border-white/30 rounded-lg p-4">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFotosObrasChange}
                          className="hidden"
                          id="fotos-obras"
                        />
                        <label
                          htmlFor="fotos-obras"
                          className="flex flex-col items-center gap-2 cursor-pointer"
                        >
                          <Camera className="w-8 h-8 text-white/50" />
                          <span className="text-white/70 text-sm">
                            Clique para selecionar fotos
                          </span>
                        </label>
                      </div>
                      {fotosObras.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {fotosObras.map((foto, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-white text-xs"
                            >
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              {foto.name.slice(0, 15)}...
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-white/50 text-xs">
                        {fotosObras.length}/10 fotos selecionadas
                      </p>
                    </div>

                    {/* Upload de CNH */}
                    <div className="space-y-2 mt-4">
                      <label className="text-sm font-medium text-white/90">
                        CNH (foto frente e verso ou PDF)
                      </label>
                      <div className="border-2 border-dashed border-white/30 rounded-lg p-4">
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
                          className="flex flex-col items-center gap-2 cursor-pointer"
                        >
                          <FileText className="w-8 h-8 text-white/50" />
                          <span className="text-white/70 text-sm">
                            Clique para enviar CNH
                          </span>
                        </label>
                      </div>
                      {cnh.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-white text-sm">
                            {cnh.length} arquivo(s) selecionado(s)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Dados Bancários para recebimento */}
                    <div className="border-t border-white/20 pt-4 mt-4">
                      <p className="text-sm font-medium text-white/90 mb-3">Dados Bancários para Recebimento</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">Chave PIX</label>
                      <Input
                        type="text"
                        placeholder="CPF, CNPJ, e-mail ou telefone"
                        value={pixChave}
                        onChange={(e) => setPixChave(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">Banco que recebe</label>
                      <Input
                        type="text"
                        placeholder="Nome do banco"
                        value={bancoNome}
                        onChange={(e) => setBancoNome(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                      />
                    </div>

                    <div className="bg-white/10 rounded-lg p-4 mt-4">
                      <p className="text-white/90 text-sm font-medium mb-2">
                        ⚠️ Importante
                      </p>
                      <p className="text-white/70 text-xs">
                        Seu cadastro será analisado por nossa equipe. Após aprovação,
                        você receberá um e-mail de confirmação e poderá começar a receber
                        solicitações de serviço.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-white text-primary hover:bg-white/90 mt-4"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Enviando cadastro..." : "Enviar Cadastro"}
                    </Button>
                  </>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="px-6 pb-8 text-center"
      >
        <p className="text-white/60 text-sm">
          Já tem uma conta?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-white font-semibold hover:underline"
          >
            Entrar
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
