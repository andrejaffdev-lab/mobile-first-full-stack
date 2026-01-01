import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  Search, 
  Building2, 
  Phone, 
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Vidracarias = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "ativos" | "pendentes">("todos");

  const [vidracarias, setVidracarias] = useState([
    { id: "1", nome: "Vidraçaria Premium", telefone: "(11) 3333-1111", status: "ativo", cidade: "São Paulo", clientes: 45 },
    { id: "2", nome: "Glass Center", telefone: "(11) 3333-2222", status: "ativo", cidade: "Campinas", clientes: 32 },
    { id: "3", nome: "Vidros & Cia", telefone: "(11) 3333-3333", status: "pendente", cidade: "Santos", clientes: 0 },
    { id: "4", nome: "Master Vidros", telefone: "(11) 3333-4444", status: "ativo", cidade: "Guarulhos", clientes: 67 },
    { id: "5", nome: "Vidraçaria Express", telefone: "(11) 3333-5555", status: "inativo", cidade: "Osasco", clientes: 12 },
    { id: "6", nome: "Vidros Top", telefone: "(11) 3333-6666", status: "pendente", cidade: "ABC", clientes: 0 },
  ]);

  const [editingVidracaria, setEditingVidracaria] = useState<typeof vidracarias[0] | null>(null);

  const handleDelete = (id: string, nome: string) => {
    setVidracarias(prev => prev.filter(v => v.id !== id));
    toast.success(`Vidraçaria "${nome}" removida com sucesso`);
  };

  const handleEdit = (vidracaria: typeof vidracarias[0]) => {
    setEditingVidracaria(vidracaria);
  };

  const handleSaveEdit = () => {
    if (editingVidracaria) {
      setVidracarias(prev => prev.map(v => v.id === editingVidracaria.id ? editingVidracaria : v));
      toast.success(`Vidraçaria "${editingVidracaria.nome}" atualizada com sucesso`);
      setEditingVidracaria(null);
    }
  };

  const filtros = [
    { key: "todos", label: "Todos" },
    { key: "ativos", label: "Ativos" },
    { key: "pendentes", label: "Pendentes" },
  ];

  const filteredVidracarias = vidracarias.filter((vidracaria) => {
    const matchesSearch = vidracaria.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFiltro = 
      filtro === "todos" || 
      (filtro === "ativos" && vidracaria.status === "ativo") ||
      (filtro === "pendentes" && vidracaria.status === "pendente");
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
        return "Ativa";
      case "pendente":
        return "Pendente";
      default:
        return "Inativa";
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
              Vidraçarias
            </h1>
          </div>
          <Button 
            onClick={() => toast.info("Cadastro de vidraçaria será implementado")}
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
            placeholder="Buscar vidraçaria..."
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
              {vidracarias.length}
            </p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="bg-success/10 border border-success/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-success font-display">
              {vidracarias.filter(v => v.status === "ativo").length}
            </p>
            <p className="text-xs text-success">Ativas</p>
          </div>
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-warning font-display">
              {vidracarias.filter(v => v.status === "pendente").length}
            </p>
            <p className="text-xs text-warning">Pendentes</p>
          </div>
        </motion.div>

        {/* Lista de Vidraçarias */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {filteredVidracarias.map((vidracaria, index) => (
            <motion.div
              key={vidracaria.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-warning" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{vidracaria.nome}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    <span>{vidracaria.telefone}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{vidracaria.cidade}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      • {vidracaria.clientes} clientes
                    </span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(vidracaria.status)}`}>
                  {getStatusIcon(vidracaria.status)}
                  {getStatusLabel(vidracaria.status)}
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => handleEdit(vidracaria)}
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => handleDelete(vidracaria.id, vidracaria.nome)}
                >
                  <Trash2 className="w-4 h-4" />
                  Deletar
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredVidracarias.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma vidraçaria encontrada</p>
          </div>
        )}
      </div>

      {/* Modal de Edição */}
      {editingVidracaria && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Editar Vidraçaria</h2>
              <button onClick={() => setEditingVidracaria(null)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input
                  value={editingVidracaria.nome}
                  onChange={(e) => setEditingVidracaria({ ...editingVidracaria, nome: e.target.value })}
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input
                  value={editingVidracaria.telefone}
                  onChange={(e) => setEditingVidracaria({ ...editingVidracaria, telefone: e.target.value })}
                />
              </div>
              <div>
                <Label>Cidade</Label>
                <Input
                  value={editingVidracaria.cidade}
                  onChange={(e) => setEditingVidracaria({ ...editingVidracaria, cidade: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setEditingVidracaria(null)}>
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

export default Vidracarias;