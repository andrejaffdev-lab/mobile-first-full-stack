import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  Search, 
  ClipboardList, 
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Pencil,
  Trash2,
  User,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Ordens = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "concluido" | "andamento" | "pendente">("todos");

  const [ordens, setOrdens] = useState([
    { id: "1", titulo: "Manutenção Box Banheiro", cliente: "Ana Paula", status: "concluido", data: "15/01/2026", valor: "R$ 200,00" },
    { id: "2", titulo: "Instalação Película", cliente: "Roberto Carlos", status: "andamento", data: "18/01/2026", valor: "R$ 350,00" },
    { id: "3", titulo: "Troca de Roldanas", cliente: "Maria José", status: "pendente", data: "20/01/2026", valor: "R$ 150,00" },
    { id: "4", titulo: "Manutenção Preventiva", cliente: "Fernando Lima", status: "concluido", data: "12/01/2026", valor: "R$ 180,00" },
    { id: "5", titulo: "Reparo Porta Blindex", cliente: "Carla Santos", status: "andamento", data: "17/01/2026", valor: "R$ 280,00" },
    { id: "6", titulo: "Instalação Box", cliente: "José Oliveira", status: "pendente", data: "22/01/2026", valor: "R$ 1.200,00" },
  ]);

  const handleDelete = (id: string, titulo: string) => {
    setOrdens(prev => prev.filter(o => o.id !== id));
    toast.success(`Ordem "${titulo}" removida com sucesso`);
  };

  const handleEdit = (id: string) => {
    toast.info("Função de edição será implementada em breve");
  };

  const filtros = [
    { key: "todos", label: "Todos" },
    { key: "concluido", label: "Concluídos" },
    { key: "andamento", label: "Em Andamento" },
    { key: "pendente", label: "Pendentes" },
  ];

  const filteredOrdens = ordens.filter((ordem) => {
    const matchesSearch = ordem.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ordem.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFiltro = filtro === "todos" || ordem.status === filtro;
    return matchesSearch && matchesFiltro;
  });

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
              Ordens de Serviço
            </h1>
          </div>
          <Button 
            onClick={() => navigate("/nova-ordem")}
            size="sm"
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            Nova
          </Button>
        </div>
      </header>

      <div className="px-6 py-6 space-y-6">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            placeholder="Buscar ordem..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {filtros.map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key as typeof filtro)}
              className={`py-2 px-4 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                filtro === f.key
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Resumo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-success/10 border border-success/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-success font-display">
              {ordens.filter(o => o.status === "concluido").length}
            </p>
            <p className="text-xs text-success">Concluídos</p>
          </div>
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-warning font-display">
              {ordens.filter(o => o.status === "andamento").length}
            </p>
            <p className="text-xs text-warning">Em Andamento</p>
          </div>
          <div className="bg-muted border border-border rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-muted-foreground font-display">
              {ordens.filter(o => o.status === "pendente").length}
            </p>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </div>
        </motion.div>

        {/* Lista de Ordens */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {filteredOrdens.map((ordem, index) => (
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
                    <p className="font-medium text-foreground">{ordem.titulo}</p>
                    <p className="font-bold text-primary text-sm">{ordem.valor}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <User className="w-3 h-3" />
                    <span>{ordem.cliente}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{ordem.data}</span>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(ordem.status)}`}>
                      {getStatusIcon(ordem.status)}
                      {getStatusLabel(ordem.status)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => handleEdit(ordem.id)}
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => handleDelete(ordem.id, ordem.titulo)}
                >
                  <Trash2 className="w-4 h-4" />
                  Deletar
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredOrdens.length === 0 && (
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma ordem encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ordens;