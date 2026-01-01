import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Download,
  CheckCircle2,
  Clock,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Financeiro {
  id: string;
  data_pagamento: string | null;
  valor: number;
  status: string | null;
  descricao: string | null;
  clientes: {
    nome: string;
  } | null;
}

const Comissoes = () => {
  const navigate = useNavigate();
  const [periodo, setPeriodo] = useState<"semana" | "mes" | "ano">("mes");
  const [financeiros, setFinanceiros] = useState<Financeiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [resumo, setResumo] = useState({
    total: 0,
    pendente: 0,
    clientesAtivos: 0,
    taxaConversao: "0%",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/login');
          return;
        }

        // Buscar vidraçaria
        const { data: vidracaria } = await supabase
          .from('vidracarias')
          .select('id, total_indicacoes')
          .eq('user_id', user.id)
          .single();

        if (!vidracaria) return;

        // Buscar registros financeiros
        const { data: financeirosData, error } = await supabase
          .from('financeiro')
          .select(`
            id,
            data_pagamento,
            valor,
            status,
            descricao,
            clientes (
              nome
            )
          `)
          .eq('vidracaria_id', vidracaria.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Erro ao buscar financeiro:', error);
        } else {
          setFinanceiros(financeirosData || []);
          
          // Calcular resumo
          const total = financeirosData?.reduce((acc, f) => acc + (f.valor || 0), 0) || 0;
          const pendente = financeirosData?.filter(f => f.status === 'pendente').reduce((acc, f) => acc + (f.valor || 0), 0) || 0;
          
          setResumo({
            total,
            pendente,
            clientesAtivos: vidracaria.total_indicacoes || 0,
            taxaConversao: "78%",
          });
        }
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Sem data';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const periodos = [
    { key: "semana", label: "Semana" },
    { key: "mes", label: "Mês" },
    { key: "ano", label: "Ano" },
  ];

  const graficoData = [30, 45, 60, 40, 75, 55, 80];
  const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  const currentMonth = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="mobile-container min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-foreground font-display">
              Minhas Comissões
            </h1>
          </div>
          <Button variant="ghost" size="icon">
            <Download className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="px-6 py-6 space-y-6">
        {/* Filtro de Período */}
        <div className="flex gap-2">
          {periodos.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriodo(p.key as typeof periodo)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                periodo === p.key
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Card de Resumo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-hero-gradient rounded-2xl p-6 text-white"
        >
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 opacity-70" />
            <span className="text-sm opacity-70 capitalize">{currentMonth}</span>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-bold font-display">{formatCurrency(resumo.total)}</span>
            <span className="text-sm opacity-70 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> +8%
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-xs opacity-70">Pendente</p>
              <p className="font-semibold">{formatCurrency(resumo.pendente)}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Clientes</p>
              <p className="font-semibold">{resumo.clientesAtivos}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Conversão</p>
              <p className="font-semibold">{resumo.taxaConversao}</p>
            </div>
          </div>
        </motion.div>

        {/* Gráfico */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card"
        >
          <h3 className="font-semibold text-foreground mb-4">Comissões por Dia</h3>
          <div className="h-32 flex items-end justify-between gap-2">
            {graficoData.map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-primary/20 rounded-t-md relative"
                  style={{ height: `${height}%` }}
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height * 0.8}%` }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-md"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            {diasSemana.map((dia) => (
              <span key={dia}>{dia}</span>
            ))}
          </div>
        </motion.div>

        {/* Histórico de Comissões */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-semibold text-foreground mb-4">Histórico</h3>
          <div className="space-y-3">
            {financeiros.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum registro encontrado
              </p>
            ) : (
              financeiros.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.status === "concluido" || item.status === "aprovado"
                      ? "bg-success/10" 
                      : "bg-warning/10"
                  }`}>
                    {item.status === "concluido" || item.status === "aprovado" ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <Clock className="w-5 h-5 text-warning" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {item.clientes?.nome || item.descricao || 'Comissão'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(item.data_pagamento)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{formatCurrency(item.valor)}</p>
                    <p className={`text-xs ${
                      item.status === "concluido" || item.status === "aprovado" ? "text-success" : "text-warning"
                    }`}>
                      {item.status === "concluido" || item.status === "aprovado" ? "Pago" : "Pendente"}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Comissoes;