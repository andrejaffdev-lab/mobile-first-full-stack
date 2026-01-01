import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  Search, 
  Users, 
  Phone, 
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Pencil,
  Trash2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminClientes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "ativos" | "pendentes">("todos");

  const [clientes, setClientes] = useState([
    { id: "1", nome: "Ana Paula Silva", telefone: "(11) 99999-1111", status: "ativo", dataIndicacao: "10/01/2026" },
    { id: "2", nome: "Roberto Carlos", telefone: "(11) 99999-2222", status: "ativo", dataIndicacao: "08/01/2026" },
    { id: "3", nome: "Maria José", telefone: "(11) 99999-3333", status: "pendente", dataIndicacao: "05/01/2026" },
    { id: "4", nome: "Fernando Lima", telefone: "(11) 99999-4444", status: "ativo", dataIndicacao: "03/01/2026" },
    { id: "5", nome: "Carla Santos", telefone: "(11) 99999-5555", status: "inativo", dataIndicacao: "01/01/2026" },
    { id: "6", nome: "José Oliveira", telefone: "(11) 99999-6666", status: "pendente", dataIndicacao: "28/12/2025" },
  ]);

  const handleDelete = (id: string, nome: string) => {
    setClientes(prev => prev.filter(c => c.id !== id));
    toast.success(`Cliente "${nome}" removido com sucesso`);
  };

  const [editingCliente, setEditingCliente] = useState<typeof clientes[0] | null>(null);

  const handleEdit = (cliente: typeof clientes[0]) => {
    setEditingCliente(cliente);
  };

  const handleSaveEdit = () => {
    if (editingCliente) {
      setClientes(prev => prev.map(c => c.id === editingCliente.id ? editingCliente : c));
      toast.success(`Cliente "${editingCliente.nome}" atualizado com sucesso`);
      setEditingCliente(null);
    }
  };

  const filtros = [
    { key: "todos", label: "Todos" },
    { key: "ativos", label: "Ativos" },
    { key: "pendentes", label: "Pendentes" },
  ];

  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFiltro = 
      filtro === "todos" || 
      (filtro === "ativos" && cliente.status === "ativo") ||
      (filtro === "pendentes" && cliente.status === "pendente");
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
              Clientes
            </h1>
          </div>
          <Button 
            onClick={() => toast.info("Cadastro de cliente será implementado")}
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
            placeholder="Buscar cliente..."
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
              {clientes.length}
            </p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="bg-success/10 border border-success/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-success font-display">
              {clientes.filter(c => c.status === "ativo").length}
            </p>
            <p className="text-xs text-success">Ativos</p>
          </div>
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-warning font-display">
              {clientes.filter(c => c.status === "pendente").length}
            </p>
            <p className="text-xs text-warning">Pendentes</p>
          </div>
        </motion.div>

        {/* Lista de Clientes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {filteredClientes.map((cliente, index) => (
            <motion.div
              key={cliente.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{cliente.nome}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    <span>{cliente.telefone}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cadastrado em {cliente.dataIndicacao}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(cliente.status)}`}>
                  {getStatusIcon(cliente.status)}
                  {getStatusLabel(cliente.status)}
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => handleEdit(cliente)}
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => handleDelete(cliente.id, cliente.nome)}
                >
                  <Trash2 className="w-4 h-4" />
                  Deletar
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredClientes.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum cliente encontrado</p>
          </div>
        )}
      </div>

      {/* Modal de Edição */}
      {editingCliente && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Editar Cliente</h2>
              <button onClick={() => setEditingCliente(null)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input
                  value={editingCliente.nome}
                  onChange={(e) => setEditingCliente({ ...editingCliente, nome: e.target.value })}
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input
                  value={editingCliente.telefone}
                  onChange={(e) => setEditingCliente({ ...editingCliente, telefone: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setEditingCliente(null)}>
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

export default AdminClientes;