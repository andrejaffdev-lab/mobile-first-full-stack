import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  Shield, 
  ShieldCheck, 
  ShieldX,
  Calendar,
  Clock,
  FileText,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Historico {
  date: string;
  type: string;
  prestador: string;
}

interface GarantiaData {
  status: "ATIVA" | "EXPIRADA";
  ultimaManutencao: string;
  proximaManutencao: string;
  diasRestantes: number;
  historico: Historico[];
}

const Garantia = () => {
  const navigate = useNavigate();
  const [garantia, setGarantia] = useState<GarantiaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarGarantia = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Buscar cliente
      const { data: cliente } = await supabase
        .from('clientes')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!cliente) {
        setIsLoading(false);
        return;
      }

      // Buscar ordens concluídas com prestador
      const { data: ordens } = await supabase
        .from('ordens_servico')
        .select(`
          *,
          prestador:prestadores_servico(nome)
        `)
        .eq('cliente_id', cliente.id)
        .eq('status', 'concluido')
        .order('data_conclusao', { ascending: false });

      if (!ordens || ordens.length === 0) {
        setGarantia({
          status: "EXPIRADA",
          ultimaManutencao: "-",
          proximaManutencao: "-",
          diasRestantes: 0,
          historico: []
        });
        setIsLoading(false);
        return;
      }

      // Verificar tipo de cada ordem
      const { data: manutencoes } = await supabase
        .from('processo_manutencao')
        .select('ordem_id')
        .in('ordem_id', ordens.map(o => o.id));

      const manutencaoIds = new Set(manutencoes?.map(m => m.ordem_id) || []);

      // Última manutenção
      const ultimaOrdem = ordens[0];
      const dataUltimaManutencao = ultimaOrdem.data_conclusao 
        ? new Date(ultimaOrdem.data_conclusao) 
        : new Date(ultimaOrdem.created_at);
      
      // Calcular próxima manutenção (1 ano após)
      const dataProximaManutencao = new Date(dataUltimaManutencao);
      dataProximaManutencao.setFullYear(dataProximaManutencao.getFullYear() + 1);

      const hoje = new Date();
      const diasRestantes = differenceInDays(dataProximaManutencao, hoje);
      const garantiaAtiva = diasRestantes > 0;

      // Montar histórico
      const historico: Historico[] = ordens.slice(0, 5).map(ordem => {
        const isManutencao = manutencaoIds.has(ordem.id);
        return {
          date: ordem.data_conclusao 
            ? format(new Date(ordem.data_conclusao), "dd MMM yyyy", { locale: ptBR })
            : format(new Date(ordem.created_at), "dd MMM yyyy", { locale: ptBR }),
          type: isManutencao ? "Manutenção Preventiva" : "Aplicação de Película",
          prestador: ordem.prestador?.nome || "Não informado"
        };
      });

      setGarantia({
        status: garantiaAtiva ? "ATIVA" : "EXPIRADA",
        ultimaManutencao: format(dataUltimaManutencao, "dd MMM yyyy", { locale: ptBR }),
        proximaManutencao: format(dataProximaManutencao, "dd MMM yyyy", { locale: ptBR }),
        diasRestantes: Math.max(0, diasRestantes),
        historico
      });

      setIsLoading(false);
    };

    carregarGarantia();
  }, []);

  if (isLoading) {
    return (
      <div className="mobile-container min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!garantia) {
    return (
      <div className="mobile-container min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Dados não encontrados</p>
      </div>
    );
  }

  const isActive = garantia.status === "ATIVA";

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
            Minha Garantia
          </h1>
        </div>
      </header>

      <div className="px-6 py-6 space-y-6">
        {/* Status Principal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-2xl p-6 text-center ${
            isActive 
              ? "bg-gradient-to-br from-success/20 to-success/5 border border-success/30" 
              : "bg-gradient-to-br from-destructive/20 to-destructive/5 border border-destructive/30"
          }`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
              isActive ? "bg-success" : "bg-destructive"
            }`}
          >
            {isActive ? (
              <ShieldCheck className="w-12 h-12 text-white" />
            ) : (
              <ShieldX className="w-12 h-12 text-white" />
            )}
          </motion.div>

          <h2 className={`text-3xl font-bold font-display ${
            isActive ? "text-success" : "text-destructive"
          }`}>
            Garantia {garantia.status}
          </h2>

          {isActive && (
            <p className="text-muted-foreground mt-2">
              Faltam <span className="font-bold text-foreground">{garantia.diasRestantes} dias</span> para a próxima manutenção
            </p>
          )}
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="premium-card text-center">
            <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Última Manutenção</p>
            <p className="font-bold text-foreground font-display mt-1">
              {garantia.ultimaManutencao}
            </p>
          </div>
          <div className="premium-card text-center">
            <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Próxima Manutenção</p>
            <p className="font-bold text-foreground font-display mt-1">
              {garantia.proximaManutencao}
            </p>
          </div>
        </motion.div>

        {/* Informativo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-primary/5 rounded-2xl p-5 border border-primary/10"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground">Como funciona a garantia?</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Sua garantia é renovada automaticamente a cada manutenção preventiva anual realizada. 
                Mantenha sua garantia ativa para ter cobertura completa em caso de problemas.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Histórico */}
        {garantia.historico.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-semibold text-foreground mb-4">Histórico de Manutenções</h3>
            <div className="space-y-3">
              {garantia.historico.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
                >
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{item.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.date} • {item.prestador}
                    </p>
                  </div>
                  <button className="text-primary">
                    <Download className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              onClick={() => navigate("/nova-ordem")}
              className="w-full" 
              size="lg"
            >
              Agendar Manutenção
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Garantia;
