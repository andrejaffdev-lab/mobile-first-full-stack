import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  MapPin, 
  Phone, 
  Navigation, 
  Clock, 
  User,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DetalheServicoPrestador = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const servico = {
    id: id || "1",
    cliente: "Maria Santos",
    telefone: "(11) 99999-8888",
    endereco: "Rua das Flores, 123 - Centro",
    cidade: "São Paulo - SP",
    cep: "01310-100",
    servico: "Manutenção Preventiva",
    detalhes: "Box de vidro temperado - 2 folhas",
    valor: "R$ 200,00",
    comissao: "R$ 160,00",
    distancia: "2.5 km",
    tempoEstimado: "45 min",
    dataAgendada: "15/01/2026 - 14:00",
    itensInclusos: [
      "Revisão completa do box",
      "Troca de roldanas",
      "Ajuste de fixações",
      "Limpeza do trilho",
      "Verificação de vedação",
    ],
  };

  const handleAceitar = () => {
    navigate(`/prestador/tarefas/${id}`);
  };

  const handleRecusar = () => {
    navigate("/dashboard/prestador");
  };

  const handleAbrirMapa = () => {
    const endereco = encodeURIComponent(`${servico.endereco}, ${servico.cidade}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${endereco}`, "_blank");
  };

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
            Detalhes do Serviço
          </h1>
        </div>
      </header>

      <div className="px-6 py-6 space-y-6">
        {/* Card do Cliente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">{servico.cliente}</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{servico.telefone}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-foreground">{servico.endereco}</p>
                <p className="text-sm text-muted-foreground">{servico.cidade} - {servico.cep}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <p className="text-foreground">{servico.dataAgendada}</p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={handleAbrirMapa}
          >
            <Navigation className="w-4 h-4" />
            Abrir no Mapa ({servico.distancia})
          </Button>
        </motion.div>

        {/* Detalhes do Serviço */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card"
        >
          <h3 className="font-semibold text-foreground mb-4">Serviço</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tipo</span>
              <span className="font-medium text-foreground">{servico.servico}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Detalhes</span>
              <span className="font-medium text-foreground">{servico.detalhes}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tempo estimado</span>
              <span className="font-medium text-foreground">{servico.tempoEstimado}</span>
            </div>
            <div className="pt-3 border-t border-border flex justify-between items-center">
              <span className="text-muted-foreground">Valor total</span>
              <span className="font-medium text-foreground">{servico.valor}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Sua comissão</span>
              <span className="font-bold text-primary text-lg">{servico.comissao}</span>
            </div>
          </div>
        </motion.div>

        {/* Itens Inclusos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="premium-card"
        >
          <h3 className="font-semibold text-foreground mb-4">Itens Inclusos</h3>
          <ul className="space-y-3">
            {servico.itensInclusos.map((item, index) => (
              <li key={index} className="flex items-center gap-3 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Footer com botões */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 max-w-md mx-auto">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
            onClick={handleRecusar}
          >
            <XCircle className="w-5 h-5" />
            Recusar
          </Button>
          <Button
            className="flex-1"
            onClick={handleAceitar}
          >
            <CheckCircle2 className="w-5 h-5" />
            Aceitar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetalheServicoPrestador;
