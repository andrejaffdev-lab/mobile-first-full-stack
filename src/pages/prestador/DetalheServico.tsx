import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ServicoData {
  id: string;
  cliente: string;
  telefone: string;
  endereco: string;
  cidade: string;
  cep: string;
  servico: string;
  detalhes: string;
  valor: string;
  comissao: string;
  distancia: string;
  tempoEstimado: string;
  dataAgendada: string;
  itensInclusos: string[];
}

const DetalheServicoPrestador = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [servico, setServico] = useState<ServicoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarServico = async () => {
      if (!id) return;

      const { data: ordem, error } = await supabase
        .from('ordens_servico')
        .select(`
          *,
          cliente:clientes(*)
        `)
        .eq('id', id)
        .single();

      if (error || !ordem) {
        console.error('Erro ao carregar ordem:', error);
        setIsLoading(false);
        return;
      }

      // Verificar tipo de serviço
      const { data: manutencao } = await supabase
        .from('processo_manutencao')
        .select('*')
        .eq('ordem_id', id)
        .single();

      const isManutencao = !!manutencao;
      const valorTotal = Number(ordem.valor_total || 0);
      const comissao = valorTotal * 0.8; // 80% para o prestador

      const formatEndereco = () => {
        if (!ordem.cliente) return '';
        const c = ordem.cliente;
        return `${c.endereco || ''}, ${c.numero || ''} - ${c.bairro || ''}`;
      };

      const formatCidade = () => {
        if (!ordem.cliente) return '';
        const c = ordem.cliente;
        return `${c.cidade || ''} - ${c.estado || ''}`;
      };

      const getItensInclusos = () => {
        if (isManutencao) {
          return [
            "Revisão completa do box",
            "Troca de roldanas",
            "Ajuste de fixações",
            "Limpeza do trilho",
            "Verificação de vedação",
          ];
        }
        return [
          "Aplicação de película",
          "Limpeza do vidro",
          "Verificação de condições",
          "Remontagem completa",
        ];
      };

      setServico({
        id: ordem.id,
        cliente: ordem.cliente?.nome || 'Cliente',
        telefone: ordem.cliente?.telefone || ordem.cliente?.whatsapp || '',
        endereco: formatEndereco(),
        cidade: formatCidade(),
        cep: ordem.cliente?.cep || '',
        servico: isManutencao ? "Manutenção Preventiva" : "Aplicação de Película",
        detalhes: isManutencao ? "Box de vidro temperado" : "Película protetora",
        valor: `R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        comissao: `R$ ${comissao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        distancia: "-",
        tempoEstimado: "45 min",
        dataAgendada: ordem.data_agendamento 
          ? format(new Date(ordem.data_agendamento), "dd/MM/yyyy", { locale: ptBR })
          : "A definir",
        itensInclusos: getItensInclusos(),
      });

      setIsLoading(false);
    };

    carregarServico();
  }, [id]);

  const handleAceitar = () => {
    navigate(`/prestador/tarefas/${id}`);
  };

  const handleRecusar = () => {
    navigate("/dashboard/prestador");
  };

  const handleAbrirMapa = () => {
    if (!servico) return;
    const endereco = encodeURIComponent(`${servico.endereco}, ${servico.cidade}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${endereco}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="mobile-container min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!servico) {
    return (
      <div className="mobile-container min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Serviço não encontrado</p>
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
              {servico.telefone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{servico.telefone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-border">
            {servico.endereco && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-foreground">{servico.endereco}</p>
                  <p className="text-sm text-muted-foreground">{servico.cidade} - {servico.cep}</p>
                </div>
              </div>
            )}
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
            Abrir no Mapa
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
