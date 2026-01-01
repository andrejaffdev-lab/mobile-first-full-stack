import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ClipboardList,
  Clock,
  Pencil,
  Plus,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type FiltroStatus = "todos" | "concluido" | "andamento" | "pendente";

type OrdemListItem = {
  id: string;
  cliente_nome: string;
  status: string | null;
  data_solicitacao: string;
  data_agendamento: string | null;
  manutencao_anual: boolean | null;
  colocacao_pelicula: boolean | null;
  valor_total: number | null;
};

const formatMoneyBRL = (value: number | null) => {
  if (value === null || Number.isNaN(value)) return "—";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const getTituloServico = (ordem: OrdemListItem) => {
  const manut = !!ordem.manutencao_anual;
  const pel = !!ordem.colocacao_pelicula;
  if (manut && pel) return "Manutenção + Película";
  if (manut) return "Manutenção Anual";
  if (pel) return "Colocação de Película";
  return "Ordem de Serviço";
};

const formatDate = (iso: string | null) => {
  if (!iso) return "—";
  try {
    return format(new Date(iso), "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return "—";
  }
};

const Ordens = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtro, setFiltro] = useState<FiltroStatus>("todos");
  const [ordens, setOrdens] = useState<OrdemListItem[]>([]);

  const fetchOrdens = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("ordens_servico")
        .select(
          "id, cliente_nome, status, data_solicitacao, data_agendamento, manutencao_anual, colocacao_pelicula, valor_total"
        )
        .order("data_solicitacao", { ascending: false });

      if (error) throw error;
      setOrdens((data as OrdemListItem[]) ?? []);
    } catch (err: any) {
      console.error("Erro ao carregar ordens:", err);
      toast.error("Erro ao carregar ordens");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdens();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("ordens_servico").delete().eq("id", id);
      if (error) throw error;

      setOrdens((prev) => prev.filter((o) => o.id !== id));
      toast.success("Ordem removida");
    } catch (err: any) {
      console.error("Erro ao deletar ordem:", err);
      toast.error("Erro ao deletar ordem");
    }
  };

  const filtros = [
    { key: "todos" as const, label: "Todos" },
    { key: "concluido" as const, label: "Concluídos" },
    { key: "andamento" as const, label: "Em Andamento" },
    { key: "pendente" as const, label: "Pendentes" },
  ];

  const filteredOrdens = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return ordens.filter((ordem) => {
      const titulo = getTituloServico(ordem).toLowerCase();
      const cliente = (ordem.cliente_nome ?? "").toLowerCase();
      const matchesSearch = !term || titulo.includes(term) || cliente.includes(term);
      const status = (ordem.status ?? "pendente") as FiltroStatus;
      const matchesFiltro = filtro === "todos" || status === filtro;
      return matchesSearch && matchesFiltro;
    });
  }, [ordens, searchTerm, filtro]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "concluido":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "andamento":
        return <Clock className="w-4 h-4 text-warning" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "concluido":
        return "Concluído";
      case "andamento":
        return "Em Andamento";
      default:
        return "Pendente";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluido":
        return "bg-success/10 text-success";
      case "andamento":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const qtdConcluido = ordens.filter((o) => (o.status ?? "pendente") === "concluido").length;
  const qtdAndamento = ordens.filter((o) => (o.status ?? "pendente") === "andamento").length;
  const qtdPendente = ordens.filter((o) => (o.status ?? "pendente") === "pendente").length;

  return (
    <div className="mobile-container min-h-screen bg-background pb-8">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard/admin")}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-foreground font-display">Ordens de Serviço</h1>
          </div>
          <Button onClick={() => navigate("/admin/ordem-servico")} size="sm" className="gap-1">
            <Plus className="w-4 h-4" />
            Nova
          </Button>
        </div>
      </header>

      <div className="px-6 py-6 space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            placeholder="Buscar ordem..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {filtros.map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={`py-2 px-4 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                filtro === f.key ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-3">
          <div className="bg-success/10 border border-success/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-success font-display">{qtdConcluido}</p>
            <p className="text-xs text-success">Concluídos</p>
          </div>
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-warning font-display">{qtdAndamento}</p>
            <p className="text-xs text-warning">Em Andamento</p>
          </div>
          <div className="bg-muted border border-border rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-muted-foreground font-display">{qtdPendente}</p>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </div>
        </motion.div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {filteredOrdens.map((ordem, index) => {
              const titulo = getTituloServico(ordem);
              const status = (ordem.status ?? "pendente") as string;

              return (
                <motion.div
                  key={ordem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <ClipboardList className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <p className="font-medium text-foreground">{titulo}</p>
                        <p className="font-bold text-primary text-sm">{formatMoneyBRL(ordem.valor_total)}</p>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <User className="w-3 h-3" />
                        <span>{ordem.cliente_nome}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(ordem.data_agendamento)}</span>
                        </div>
                        <div
                          className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                            status
                          )}`}
                        >
                          {getStatusIcon(status)}
                          {getStatusLabel(status)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={() => navigate(`/admin/ordem-servico/${ordem.id}`)}
                    >
                      <Pencil className="w-4 h-4" />
                      Abrir
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={() => handleDelete(ordem.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Deletar
                    </Button>
                  </div>
                </motion.div>
              );
            })}

            {!filteredOrdens.length && (
              <div className="text-center py-12">
                <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma ordem encontrada</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate("/admin/ordem-servico")}>
                  <Plus className="w-4 h-4 mr-2" /> Criar primeira ordem
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Ordens;
