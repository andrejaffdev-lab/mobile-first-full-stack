import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Phone, Building, ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type ProfileType = "cliente" | "prestador" | "vidracaria" | null;

const Register = () => {
  const navigate = useNavigate();
  const [profileType, setProfileType] = useState<ProfileType>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Campos comuns
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  // Campos específicos
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [nomeEmpresa, setNomeEmpresa] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simula cadastro - depois conectar com backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Cadastro realizado com sucesso!");
    setIsLoading(false);
    navigate("/login");
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
      title: "Prestador",
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

  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center px-6 pt-12"
      >
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-white font-display tracking-tight">
            BOX<span className="font-normal text-white/80">em</span>
          </h1>
          <h2 className="text-2xl font-bold text-white font-display -mt-1">
            GARANTIA
          </h2>
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
          onClick={() => profileType ? setProfileType(null) : navigate("/login")}
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
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Cadastro de {profileType === "cliente" ? "Cliente" : profileType === "prestador" ? "Prestador" : "Vidraçaria"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Nome */}
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

                {/* Email */}
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

                {/* Telefone */}
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

                {/* Campos específicos para Cliente */}
                {profileType === "cliente" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">CPF</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type="text"
                          placeholder="000.000.000-00"
                          value={cpf}
                          onChange={(e) => setCpf(e.target.value)}
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
                          placeholder="Rua, número, bairro"
                          value={endereco}
                          onChange={(e) => setEndereco(e.target.value)}
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Campos específicos para Prestador */}
                {profileType === "prestador" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">CPF</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type="text"
                          placeholder="000.000.000-00"
                          value={cpf}
                          onChange={(e) => setCpf(e.target.value)}
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white/90">Região de atuação</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type="text"
                          placeholder="Cidade ou região"
                          value={endereco}
                          onChange={(e) => setEndereco(e.target.value)}
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Campos específicos para Vidraçaria */}
                {profileType === "vidracaria" && (
                  <>
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
                      <label className="text-sm font-medium text-white/90">CNPJ</label>
                      <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type="text"
                          placeholder="00.000.000/0000-00"
                          value={cnpj}
                          onChange={(e) => setCnpj(e.target.value)}
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
                          value={endereco}
                          onChange={(e) => setEndereco(e.target.value)}
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Senha */}
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
                  type="submit" 
                  className="w-full bg-white text-primary hover:bg-white/90 mt-4" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </form>

              <p className="text-center text-xs text-white/50 mt-4">
                Ao cadastrar, você concorda com nossos{" "}
                <span className="text-white/70 hover:underline cursor-pointer">Termos de Uso</span> e{" "}
                <span className="text-white/70 hover:underline cursor-pointer">Política de Privacidade</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Register;
