import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  Search, 
  Wrench, 
  Phone, 
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Pencil,
  Trash2,
  Star,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Prestadores = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "ativos" | "pendentes">("todos");

  const [prestadores, setPrestadores] = useState([
    { id: "1", nome: "João Montador", telefone: "(11) 99999-1111", status: "ativo", avaliacao: 4.8, servicos: 156 },
    { id: "2", nome: "Pedro Silva", telefone: "(11) 99999-2222", status: "ativo", avaliacao: 4.5, servicos: 89 },
    { id: "3", nome: "Carlos Lima", telefone: "(11) 99999-3333", status: "pendente", avaliacao: 0, servicos: 0 },
    { id: "4", nome: "Marcos Oliveira", telefone: "(11) 99999-4444", status: "ativo", avaliacao: 4.9, servicos: 234 },
    { id: "5", nome: "Ricardo Santos", telefone: "(11) 99999-5555", status: "inativo", avaliacao: 3.8, servicos: 45 },
    { id: "6", nome: "Fernando Costa", telefone: "(11) 99999-6666", status: "pendente", avaliacao: 0, servicos: 0 },
  ]);

  const handleDelete = (id: string, nome: string) => {
    setPrestadores(prev => prev.filter(p => p.id !== id));
    toast.success(`Prestador "${nome}" removido com sucesso`);
  };

  const [editingPrestador, setEditingPrestador] = useState<typeof prestadores[0] | null>(null);

  const handleEdit = (prestador: typeof prestadores[0]) => {
    setEditingPrestador(prestador);
  };

  const handleSaveEdit = () => {
    if (editingPrestador) {
      setPrestadores(prev => prev.map(p => p.id === editingPrestador.id ? editingPrestador : p));
      toast.success(`Prestador "${editingPrestador.nome}" atualizado com sucesso`);
      setEditingPrestador(null);
    }
  };

  const filtros = [
    { key: "todos", label: "Todos" },
    { key: "ativos", label: "Ativos" },
    { key: "pendentes", label: "Pendentes" },
  ];

  const filteredPrestadores = prestadores.filter((prestador) => {
    const matchesSearch = prestador.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFiltro = 
      filtro === "todos" || 
      (filtro === "ativos" && prestador.status === "ativo") ||
      (filtro === "pendentes" && prestador.status === "pendente");
    return matchesSearch && matchesFiltro;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ativo":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "pendente":
        return <Clock className="w-4 h-4 text-warning" />;
      default:
        return <XCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ativo":
        return "Ativo";
      case "pendente":
        return "Pendente";
      default:
        return "Inativo";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-success/10 text-success";
      case "pendente":
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
              onClick={() => navigate("/dashboard/admin")}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-foreground font-display">
              Prestadores
            </h1>
          </div>
          <Button 
            onClick={() => toast.info("Cadastro de prestador será implementado")}
            size="sm"
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            Novo
          </Button>
        </div>
      </header>

      <div className="px-6 py-6 space-y-6">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            placeholder="Buscar prestador..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          {filtros.map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key as typeof filtro)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
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
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-foreground font-display">
              {prestadores.length}
            </p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="bg-success/10 border border-success/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-success font-display">
              {prestadores.filter(p => p.status === "ativo").length}
            </p>
            <p className="text-xs text-success">Ativos</p>
          </div>
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-warning font-display">
              {prestadores.filter(p => p.status === "pendente").length}
            </p>
            <p className="text-xs text-warning">Pendentes</p>
          </div>
        </motion.div>

        {/* Lista de Prestadores */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {filteredPrestadores.map((prestador, index) => (
            <motion.div
              key={prestador.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-success" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{prestador.nome}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    <span>{prestador.telefone}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {prestador.avaliacao > 0 && (
                      <div className="flex items-center gap-1 text-xs text-warning">
                        <Star className="w-3 h-3 fill-warning" />
                        <span>{prestador.avaliacao}</span>
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {prestador.servicos} serviços
                    </span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(prestador.status)}`}>
                  {getStatusIcon(prestador.status)}
                  {getStatusLabel(prestador.status)}
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => handleEdit(prestador)}
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => handleDelete(prestador.id, prestador.nome)}
                >
                  <Trash2 className="w-4 h-4" />
                  Deletar
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredPrestadores.length === 0 && (
          <div className="text-center py-12">
            <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum prestador encontrado</p>
          </div>
        )}
      </div>

      {/* Modal de Edição */}
      {editingPrestador && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Editar Prestador</h2>
              <button onClick={() => setEditingPrestador(null)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input
                  value={editingPrestador.nome}
                  onChange={(e) => setEditingPrestador({ ...editingPrestador, nome: e.target.value })}
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input
                  value={editingPrestador.telefone}
                  onChange={(e) => setEditingPrestador({ ...editingPrestador, telefone: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setEditingPrestador(null)}>
                  Cancelar
                </Button>
                <Button className="flex-1" onClick={handleSaveEdit}>
                  Salvar
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Prestadores;