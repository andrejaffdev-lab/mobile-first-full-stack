import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ServiceData {
  id: string;
  type: string;
  title: string;
  status: string;
  date: string;
  value: string;
  prestador: {
    name: string;
    phone: string;
    rating: number;
  } | null;
  address: string;
  tasks: { name: string; completed: boolean }[];
  hasCertificate: boolean;
  garantia: {
    status: string;
    validUntil: string;
  };
}

const DetalheServico = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [service, setService] = useState<ServiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarServico = async () => {
      if (!id) return;

      const { data: ordem, error } = await supabase
        .from('ordens_servico')
        .select(`
          *,
          cliente:clientes(*),
          prestador:prestadores_servico(*)
        `)
        .eq('id', id)
        .single();

      if (error || !ordem) {
        console.error('Erro ao carregar ordem:', error);
        setIsLoading(false);
        return;
      }

      // Carregar processo de manutenção ou película
      const { data: manutencao } = await supabase
        .from('processo_manutencao')
        .select('*')
        .eq('ordem_id', id)
        .single();

      const { data: pelicula } = await supabase
        .from('processo_pelicula')
        .select('*')
        .eq('ordem_id', id)
        .single();

      // Verificar certificado
      const { data: certificado } = await supabase
        .from('certificados')
        .select('*')
        .eq('ordem_id', id)
        .single();

      const processo = manutencao || pelicula;
      const isManutencao = !!manutencao;

      const formatAddress = () => {
        if (!ordem.cliente) return '';
        const c = ordem.cliente;
        return `${c.endereco || ''}, ${c.numero || ''} - ${c.bairro || ''}, ${c.cidade || ''} - ${c.estado || ''}`;
      };

      const getTasks = () => {
        if (isManutencao && manutencao) {
          return [
            { name: "Foto Antes", completed: !!manutencao.foto_inicial },
            { name: "Revisar Vidro", completed: !!manutencao.vidro_analisado },
            { name: "Trocar Roldanas", completed: !!manutencao.roldanas_trocadas },
            { name: "Fotos das Roldanas Novas", completed: !!manutencao.foto_roldanas },
            { name: "Verificar Trilho", completed: !!manutencao.trilho_analisado },
            { name: "Remontagem", completed: !!manutencao.remontagem_concluida },
            { name: "Foto Final", completed: !!manutencao.foto_final },
          ];
        }
        if (pelicula) {
          return [
            { name: "Verificar Condições", completed: !!pelicula.condicoes_verificadas },
            { name: "Limpeza", completed: !!pelicula.limpeza_feita },
            { name: "Retirar Porta", completed: !!pelicula.porta_retirada },
            { name: "Aplicar Porta", completed: !!pelicula.porta_aplicada },
            { name: "Aplicar Vidro Fixo", completed: !!pelicula.vidro_fixo_aplicado },
            { name: "Remontagem", completed: !!pelicula.remontagem_concluida },
            { name: "Foto Final", completed: !!pelicula.foto_final },
          ];
        }
        return [];
      };

      // Calcular garantia
      const dataManutencao = ordem.data_conclusao ? new Date(ordem.data_conclusao) : new Date();
      const dataGarantia = new Date(dataManutencao);
      dataGarantia.setFullYear(dataGarantia.getFullYear() + 1);
      const garantiaAtiva = dataGarantia > new Date();

      setService({
        id: ordem.id,
        type: isManutencao ? "manutencao" : "pelicula",
        title: isManutencao ? "Manutenção Preventiva" : "Aplicação de Película",
        status: ordem.status || 'pendente',
        date: ordem.data_solicitacao ? format(new Date(ordem.data_solicitacao), "dd MMM yyyy", { locale: ptBR }) : '',
        value: `R$ ${Number(ordem.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        prestador: ordem.prestador ? {
          name: ordem.prestador.nome,
          phone: ordem.prestador.telefone || '',
          rating: Number(ordem.prestador.nota_media) || 0,
        } : null,
        address: formatAddress(),
        tasks: getTasks(),
        hasCertificate: !!certificado,
        garantia: {
          status: garantiaAtiva ? "ATIVA" : "EXPIRADA",
          validUntil: format(dataGarantia, "dd MMM yyyy", { locale: ptBR }),
        },
      });

      setIsLoading(false);
    };

    carregarServico();
  }, [id]);

  if (isLoading) {
    return (
      <div className="mobile-container min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="mobile-container min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Serviço não encontrado</p>
      </div>
    );
  }

  const completedTasks = service.tasks.filter((t) => t.completed).length;
  const totalTasks = service.tasks.length;
  const isCompleted = service.status === 'concluido';

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
          className={`rounded-2xl p-5 border ${
            isCompleted 
              ? "bg-success/10 border-success/20" 
              : "bg-warning/10 border-warning/20"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-success" />
            ) : (
              <Clock className="w-6 h-6 text-warning" />
            )}
            <span className={`font-semibold ${isCompleted ? 'text-success' : 'text-warning'}`}>
              {isCompleted ? 'Serviço Concluído' : 'Em Andamento'}
            </span>
          </div>
          {isCompleted && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Garantia</p>
                <p className={`font-bold text-lg font-display ${
                  service.garantia.status === 'ATIVA' ? 'text-success' : 'text-destructive'
                }`}>
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
          )}
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
            {service.address && (
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Endereço:</span>
                <span className="text-foreground">{service.address}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Prestador */}
        {service.prestador && (
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
                {service.prestador.rating > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="text-sm font-medium text-foreground">
                      {service.prestador.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {service.prestador.phone && (
                  <a 
                    href={`tel:${service.prestador.phone}`}
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
                  >
                    <Phone className="w-5 h-5 text-primary" />
                  </a>
                )}
                <button 
                  onClick={() => navigate("/chat")}
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 text-primary" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Checklist */}
        {service.tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="premium-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Tarefas</h3>
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
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    task.completed ? 'bg-success' : 'bg-muted'
                  }`}>
                    {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <span className={task.completed ? 'text-foreground' : 'text-muted-foreground'}>
                    {task.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

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
