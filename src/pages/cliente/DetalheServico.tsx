import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  Shield, 
  MapPin, 
  User, 
  Phone, 
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  MessageCircle,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DetalheServico = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - seria buscado do backend
  const service = {
    id: id,
    type: "manutencao",
    title: "Manutenção Preventiva Anual",
    status: "concluido",
    date: "15 Mar 2024",
    value: "R$ 200,00",
    prestador: {
      name: "João Souza",
      phone: "(11) 99999-9999",
      rating: 4.9,
    },
    address: "Rua das Flores, 123 - Centro, São Paulo - SP",
    tasks: [
      { name: "Foto Antes", completed: true },
      { name: "Revisar Vidro", completed: true },
      { name: "Trocar Roldanas", completed: true },
      { name: "Fotos das Roldanas Novas", completed: true },
      { name: "Verificar Fixações", completed: true },
      { name: "Ajustar Box", completed: true },
      { name: "Foto Final", completed: true },
    ],
    hasCertificate: true,
    garantia: {
      status: "ATIVA",
      validUntil: "15 Mar 2025",
    },
  };

  const completedTasks = service.tasks.filter((t) => t.completed).length;
  const totalTasks = service.tasks.length;

  return (
    <div className="mobile-container min-h-screen bg-background pb-8">
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
            Detalhes do Serviço
          </h1>
        </div>
      </header>

      <div className="px-6 py-6 space-y-6">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-success/10 rounded-2xl p-5 border border-success/20"
        >
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="w-6 h-6 text-success" />
            <span className="font-semibold text-success">Serviço Concluído</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Garantia</p>
              <p className="font-bold text-success text-lg font-display">
                {service.garantia.status}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Válida até</p>
              <p className="font-semibold text-foreground">
                {service.garantia.validUntil}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Service Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{service.title}</h2>
              <p className="text-2xl font-bold text-primary font-display">
                {service.value}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">Data:</span>
              <span className="text-foreground font-medium">{service.date}</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Endereço:</span>
              <span className="text-foreground">{service.address}</span>
            </div>
          </div>
        </motion.div>

        {/* Prestador */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="premium-card"
        >
          <h3 className="font-semibold text-foreground mb-4">Prestador</h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">
                {service.prestador.name}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-warning fill-warning" />
                <span className="text-sm font-medium text-foreground">
                  {service.prestador.rating}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </button>
              <button 
                onClick={() => navigate("/chat")}
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="premium-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Tarefas Realizadas</h3>
            <span className="text-sm text-success font-medium">
              {completedTasks}/{totalTasks}
            </span>
          </div>

          <div className="space-y-2">
            {service.tasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center gap-3 py-2"
              >
                <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-foreground">{task.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        {service.hasCertificate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Button variant="success" className="w-full" size="lg">
              <Download className="w-5 h-5" />
              Baixar Certificado de Garantia
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DetalheServico;
