import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Shield, Clock, CreditCard, MapPin, FileText, Award,
  CheckCircle, ArrowLeft, Wrench, Users, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const LandingPage = () => {
  const navigate = useNavigate();

  const benefits = [
    { icon: Shield, title: "Garantia Real", desc: "Manutenção preventiva anual que valida a garantia do seu box conforme norma ABNT." },
    { icon: Clock, title: "Atendimento Ágil", desc: "Prestadores respondem em até 6 horas e executam o serviço em até 24 horas." },
    { icon: CreditCard, title: "Pagamento Facilitado", desc: "Pague em até 3x no cartão ou ganhe 5% de desconto à vista no Pix." },
    { icon: MapPin, title: "Cobertura Nacional", desc: "Rede de prestadores qualificados em todo o Brasil, sempre perto de você." },
    { icon: FileText, title: "Documentação Completa", desc: "Fotos antes e depois, checklist detalhado e ficha técnica do serviço." },
    { icon: Award, title: "Certificado Digital", desc: "Comprovante oficial da manutenção preventiva para sua tranquilidade." },
  ];

  const steps = [
    { num: 1, title: "Solicite", desc: "Preencha seus dados e envie fotos do seu box. Em poucos minutos sua solicitação está pronta." },
    { num: 2, title: "Conectamos", desc: "Nossa plataforma encontra automaticamente o prestador mais próximo e qualificado para você." },
    { num: 3, title: "Manutenção", desc: "Profissional realiza a manutenção preventiva seguindo checklist completo com fotos." },
    { num: 4, title: "Certificado", desc: "Receba seu certificado digital de manutenção conforme norma ABNT NBR 14207." },
  ];

  const services = [
    "Troca de roldanas",
    "Verificação de fixações",
    "Ajuste de alinhamento",
    "Certificado digital",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/login")} className="flex items-center gap-2 text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Voltar</span>
          </button>
          <h1 className="text-lg font-bold text-primary">Box em Garantia</h1>
          <div className="w-16" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-hero-gradient text-white py-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <h2 className="text-2xl font-bold mb-2">Manutenção Preventiva de Box</h2>
          <p className="text-3xl font-bold mb-4">Seu box de vidro<br />o ano todo</p>
          <p className="text-white/80 text-sm mb-6">
            Garanta a manutenção preventiva anual do seu box de banheiro conforme a norma ABNT NBR 14207. 
            Profissionais qualificados, garantia real e tranquilidade para sua família.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate("/login")} className="bg-white text-primary hover:bg-white/90">
              Solicitar Manutenção
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              Seja um Prestador
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary/10 py-4 px-6">
        <div className="flex justify-around text-center max-w-md mx-auto">
          <div>
            <Shield className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Norma ABNT</p>
          </div>
          <div>
            <Clock className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Atendimento 24h</p>
          </div>
          <div>
            <Award className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Certificado Digital</p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-8 px-6">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            Manutenção Preventiva
          </h3>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-3">Box de Banheiro</p>
              <ul className="space-y-2">
                {services.map((service) => (
                  <li key={service} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-success" />
                    {service}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between items-center">
                <div className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
                  5% desconto no Pix
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">1.000+</p>
                  <p className="text-xs text-muted-foreground">Manutenções realizadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-8 px-6 bg-muted/30">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-bold mb-2 text-center">Como Funciona</h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Processo simples e rápido para garantir a segurança do seu box de vidro
          </p>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                  {step.num}
                </div>
                <div>
                  <h4 className="font-semibold">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-8 px-6">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-bold mb-2 text-center">Por que escolher o Box em Garantia?</h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Segurança, praticidade e profissionais qualificados em um só lugar
          </p>
          <div className="grid grid-cols-2 gap-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full">
                  <CardContent className="p-4">
                    <benefit.icon className="w-8 h-8 text-primary mb-2" />
                    <h4 className="font-semibold text-sm mb-1">{benefit.title}</h4>
                    <p className="text-xs text-muted-foreground">{benefit.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section className="py-8 px-6 bg-hero-gradient text-white">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-bold mb-2 text-center">Cresça com a gente</h3>
          <p className="text-sm text-white/80 text-center mb-6">
            Seja prestador de serviços ou vidraçaria parceira e aumente sua renda
          </p>
          
          {/* Stats */}
          <div className="flex justify-around mb-6 text-center">
            <div>
              <p className="text-2xl font-bold">R$ 5.000+</p>
              <p className="text-xs text-white/70">Média mensal top prestadores</p>
            </div>
            <div>
              <p className="text-2xl font-bold">24h</p>
              <p className="text-xs text-white/70">Para execução</p>
            </div>
            <div>
              <p className="text-2xl font-bold">500+</p>
              <p className="text-xs text-white/70">Profissionais</p>
            </div>
          </div>

          {/* Prestador Card */}
          <Card className="mb-4 bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5" />
                <h4 className="font-semibold">Seja um Prestador</h4>
              </div>
              <p className="text-sm text-white/80 mb-3">
                Faça parte da nossa rede de profissionais qualificados.
              </p>
              <ul className="space-y-1 text-sm text-white/80 mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Receba até 10 manutenções por dia
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Comissão de 50% por serviço
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Flexibilidade de horários
                </li>
              </ul>
              <Button className="w-full bg-white text-primary hover:bg-white/90">
                Cadastrar como Prestador
              </Button>
            </CardContent>
          </Card>

          {/* Vidraçaria Card */}
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-5 h-5" />
                <h4 className="font-semibold">Seja uma Vidraçaria Parceira</h4>
              </div>
              <p className="text-sm text-white/80 mb-3">
                Agregue valor aos seus clientes oferecendo garantia real.
              </p>
              <ul className="space-y-1 text-sm text-white/80 mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  10% de comissão por indicação
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Upload em lote de clientes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Dashboard de indicações
                </li>
              </ul>
              <Button variant="outline" className="w-full border-white text-white hover:bg-white/10">
                Cadastrar Vidraçaria
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-foreground text-background">
        <div className="max-w-md mx-auto">
          <h4 className="text-lg font-bold mb-2">Box em Garantia</h4>
          <p className="text-sm text-background/70 mb-6">
            Manutenção preventiva de box de vidro conforme norma ABNT NBR 14207. 
            Segurança e tranquilidade para sua família.
          </p>
          
          <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
            <div>
              <h5 className="font-semibold mb-2">Links Rápidos</h5>
              <ul className="space-y-1 text-background/70">
                <li>Como Funciona</li>
                <li>Benefícios</li>
                <li>Seja Parceiro</li>
                <li>Entrar</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Para Parceiros</h5>
              <ul className="space-y-1 text-background/70">
                <li>Seja Prestador</li>
                <li>Vidraçaria Parceira</li>
                <li>Termos de Uso</li>
                <li>Política de Privacidade</li>
              </ul>
            </div>
          </div>

          <div className="text-sm text-background/70 mb-4">
            <p>contato@boxemgarantia.com.br</p>
            <p>(11) 99999-9999</p>
            <p>Atendimento em todo o Brasil</p>
          </div>

          <div className="border-t border-background/20 pt-4 text-center text-xs text-background/50">
            <p>© 2026 Box em Garantia. Todos os direitos reservados.</p>
            <p className="mt-1">Manutenção conforme ABNT NBR 14207</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
