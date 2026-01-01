import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Shield, Clock, CreditCard, MapPin, FileText, Award,
  CheckCircle, ArrowRight, Wrench, Users, Building2, 
  Phone, Mail, Star, Sparkles, ChevronDown, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const benefits = [
    { icon: Shield, title: "Garantia Real", desc: "Manutenção preventiva anual conforme norma ABNT NBR 14207" },
    { icon: Clock, title: "Resposta em 6h", desc: "Atendimento ágil com execução em até 24 horas" },
    { icon: CreditCard, title: "3x sem juros", desc: "Ou 5% de desconto à vista no Pix" },
    { icon: MapPin, title: "Todo Brasil", desc: "Rede de profissionais qualificados perto de você" },
    { icon: FileText, title: "Documentação", desc: "Fotos antes/depois e ficha técnica completa" },
    { icon: Award, title: "Certificado", desc: "Comprovante digital oficial da manutenção" },
  ];

  const steps = [
    { num: "01", title: "Solicite", desc: "Preencha seus dados e envie fotos do box", color: "from-blue-500 to-cyan-500" },
    { num: "02", title: "Conectamos", desc: "Encontramos o profissional mais próximo", color: "from-cyan-500 to-teal-500" },
    { num: "03", title: "Manutenção", desc: "Serviço realizado com checklist completo", color: "from-teal-500 to-green-500" },
    { num: "04", title: "Certificado", desc: "Receba seu certificado digital ABNT", color: "from-green-500 to-emerald-500" },
  ];

  const stats = [
    { value: "1.000+", label: "Manutenções", icon: Wrench },
    { value: "500+", label: "Profissionais", icon: Users },
    { value: "4.9", label: "Avaliação", icon: Star },
    { value: "24h", label: "Atendimento", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Floating Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
      >
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm">Box em Garantia</span>
          </div>
          <Button 
            size="sm" 
            onClick={() => navigate("/login")}
            className="bg-primary hover:bg-primary/90 text-xs px-4"
          >
            Entrar
          </Button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12 bg-hero-gradient overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-white/5 to-transparent rounded-full"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-white/5 to-transparent rounded-full"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-center max-w-md mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-white/90 text-sm font-medium">Norma ABNT NBR 14207</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Seu box de vidro{" "}
            <span className="relative">
              protegido
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute bottom-1 left-0 h-2 bg-gradient-to-r from-yellow-300/50 to-orange-300/50 -z-10 rounded"
              />
            </span>
            {" "}o ano todo
          </h1>

          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            Manutenção preventiva com profissionais qualificados. 
            Garantia real e certificado digital.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <Button 
              size="lg"
              onClick={() => navigate("/register", { state: { profileType: "cliente" } })}
              className="w-full bg-white text-primary hover:bg-white/90 shadow-xl shadow-black/20 text-base font-semibold h-14 rounded-xl"
            >
              Solicitar Manutenção
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate("/register", { state: { profileType: "prestador" } })}
              className="w-full border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-base font-semibold h-14 rounded-xl"
            >
              <Users className="w-5 h-5 mr-2" />
              Seja um Prestador
            </Button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-white/60"
          >
            <span className="text-xs">Role para descobrir</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section className="relative -mt-16 px-6 z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl shadow-primary/10 p-6"
        >
          <div className="grid grid-cols-4 gap-2">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-5 h-5 mx-auto text-primary mb-1" />
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-6">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Processo</span>
            <h2 className="text-2xl font-bold mt-2">Como Funciona</h2>
            <p className="text-muted-foreground mt-2">Simples, rápido e seguro</p>
          </motion.div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 items-start"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shrink-0 shadow-lg`}>
                  <span className="text-white font-bold text-lg">{step.num}</span>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-bold text-lg">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 px-6 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Benefícios</span>
            <h2 className="text-2xl font-bold mt-2">Por que escolher</h2>
            <p className="text-muted-foreground mt-2">Tudo que você precisa em um só lugar</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-4 shadow-lg shadow-primary/5 border border-border/50"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-3">
                  <benefit.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{benefit.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prestador CTA Section */}
      <section className="py-16 px-6 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-md mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm mb-4">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Oportunidade
            </span>
            <h2 className="text-3xl font-bold text-white mb-2">Ganhe dinheiro com a gente</h2>
            <p className="text-white/80">Seja prestador ou vidraçaria parceira</p>
          </motion.div>

          {/* Prestador Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-6 shadow-2xl mb-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Seja um Prestador</h3>
                <p className="text-sm text-muted-foreground">Faça parte da nossa rede</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                <span>Receba até <strong>10 manutenções por dia</strong></span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                <span>Comissão de <strong>50% por serviço</strong></span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                <span>Flexibilidade total de horários</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                <span>Média de <strong>R$ 5.000/mês</strong> top prestadores</span>
              </div>
            </div>

            <Button 
              size="lg"
              onClick={() => {
                navigate("/register");
                setTimeout(() => {
                  // Will be handled by state in Register page
                }, 100);
              }}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold h-12 rounded-xl"
            >
              Cadastrar como Prestador
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          {/* Vidraçaria Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Vidraçaria Parceira</h3>
                <p className="text-sm text-white/70">Agregue valor aos seus clientes</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-3 text-sm text-white/90">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                <span>10% de comissão por indicação</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/90">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                <span>Upload em lote de clientes</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/90">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                <span>Dashboard completo de indicações</span>
              </div>
            </div>

            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate("/register")}
              className="w-full border-2 border-white/30 text-white hover:bg-white/10 font-semibold h-12 rounded-xl"
            >
              Cadastrar Vidraçaria
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-foreground text-background">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold">Box em Garantia</h4>
              <p className="text-xs text-background/60">Manutenção preventiva de box</p>
            </div>
          </div>

          <p className="text-sm text-background/70 mb-6 leading-relaxed">
            Garantia real para seu box de vidro conforme norma ABNT NBR 14207. 
            Profissionais qualificados e certificado digital.
          </p>

          <div className="flex gap-6 mb-8">
            <a href="mailto:contato@boxemgarantia.com.br" className="flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors">
              <Mail className="w-4 h-4" />
              contato@boxemgarantia.com.br
            </a>
          </div>

          <div className="flex gap-4 mb-8">
            <a href="mailto:contato@boxemgarantia.com.br" className="flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors">
              <Mail className="w-4 h-4" />
              contato@boxemgarantia.com.br
            </a>
          </div>

          <div className="border-t border-background/20 pt-6 flex flex-col gap-2 text-center text-xs text-background/50">
            <p>© 2026 Box em Garantia. Todos os direitos reservados.</p>
            <p>Manutenção conforme ABNT NBR 14207</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
