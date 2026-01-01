import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, Search, Users, Phone, CheckCircle2, Clock, XCircle,
  Plus, Pencil, Trash2, X, Mail, MapPin, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

type Cliente = {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  documento: string | null;
  cep: string | null;
  endereco: string | null;
  numero: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  status: string | null;
  observacoes: string | null;
  created_at: string;
};

const AdminClientes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "ativo" | "pendente">("todos");
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClientes(data || []);
    } catch (err: any) {
      console.error("Erro ao carregar clientes:", err);
      toast.error("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleDelete = async (id: string, nome: string) => {
    try {
      const { error } = await supabase.from("clientes").delete().eq("id", id);
      if (error) throw error;
      setClientes(prev => prev.filter(c => c.id !== id));
      toast.success(`Cliente "${nome}" removido com sucesso`);
    } catch (err: any) {
      console.error("Erro ao deletar cliente:", err);
      toast.error("Erro ao deletar cliente");
    }
  };

  const handleSaveEdit = async () => {
    if (!editingCliente) return;
    try {
      const { error } = await supabase
        .from("clientes")
        .update({
          nome: editingCliente.nome,
          email: editingCliente.email,
          telefone: editingCliente.telefone,
          documento: editingCliente.documento,
          cep: editingCliente.cep,
          endereco: editingCliente.endereco,
          numero: editingCliente.numero,
          bairro: editingCliente.bairro,
          cidade: editingCliente.cidade,
          estado: editingCliente.estado,
          status: editingCliente.status as any,
          observacoes: editingCliente.observacoes,
        })
        .eq("id", editingCliente.id);

      if (error) throw error;
      setClientes(prev => prev.map(c => c.id === editingCliente.id ? editingCliente : c));
      toast.success(`Cliente "${editingCliente.nome}" atualizado com sucesso`);
      setEditingCliente(null);
    } catch (err: any) {
      console.error("Erro ao atualizar cliente:", err);
      toast.error("Erro ao atualizar cliente");
    }
  };

  const filtros = [
    { key: "todos", label: "Todos" },
    { key: "ativo", label: "Ativos" },
    { key: "pendente", label: "Pendentes" },
  ];

  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const status = cliente.status || "ativo";
    const matchesFiltro = filtro === "todos" || status === filtro;
    return matchesSearch && matchesFiltro;
  });

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "ativo": return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "pendente": return <Clock className="w-4 h-4 text-warning" />;
      default: return <XCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case "ativo": return "Ativo";
      case "pendente": return "Pendente";
      default: return "Inativo";
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "ativo": return "bg-success/10 text-success";
      case "pendente": return "bg-warning/10 text-warning";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="mobile-container h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard/admin")}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-foreground font-display">Clientes</h1>
          </div>
          <Button onClick={() => navigate("/admin/novo-cliente")} size="sm" className="gap-1">
            <Plus className="w-4 h-4" />
            Novo
          </Button>
        </div>
      </header>

      <ScrollArea className="flex-1">
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
                filtro === f.key ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Resumo */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-foreground font-display">{clientes.length}</p>
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

        {/* Lista */}
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
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
                      <span>{cliente.telefone || "Sem telefone"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(cliente.created_at), "dd/MM/yyyy")}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(cliente.status)}`}>
                    {getStatusIcon(cliente.status)}
                    {getStatusLabel(cliente.status)}
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                  <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => setEditingCliente(cliente)}>
                    <Pencil className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1 gap-1" onClick={() => handleDelete(cliente.id, cliente.nome)}>
                    <Trash2 className="w-4 h-4" />
                    Deletar
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredClientes.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum cliente encontrado</p>
          </div>
        )}
        </div>
      </ScrollArea>

      {/* Modal de Edição */}
      {editingCliente && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold">Editar Cliente</h2>
              <button onClick={() => setEditingCliente(null)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Nome Completo</Label>
                    <Input
                      value={editingCliente.nome}
                      onChange={(e) => setEditingCliente({ ...editingCliente, nome: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>CPF/CNPJ</Label>
                    <Input
                      value={editingCliente.documento || ""}
                      onChange={(e) => setEditingCliente({ ...editingCliente, documento: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Telefone</Label>
                    <Input
                      value={editingCliente.telefone || ""}
                      onChange={(e) => setEditingCliente({ ...editingCliente, telefone: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={editingCliente.email || ""}
                      onChange={(e) => setEditingCliente({ ...editingCliente, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>CEP</Label>
                    <Input
                      value={editingCliente.cep || ""}
                      onChange={(e) => setEditingCliente({ ...editingCliente, cep: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Número</Label>
                    <Input
                      value={editingCliente.numero || ""}
                      onChange={(e) => setEditingCliente({ ...editingCliente, numero: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Endereço</Label>
                    <Input
                      value={editingCliente.endereco || ""}
                      onChange={(e) => setEditingCliente({ ...editingCliente, endereco: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Bairro</Label>
                    <Input
                      value={editingCliente.bairro || ""}
                      onChange={(e) => setEditingCliente({ ...editingCliente, bairro: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Cidade</Label>
                    <Input
                      value={editingCliente.cidade || ""}
                      onChange={(e) => setEditingCliente({ ...editingCliente, cidade: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Estado</Label>
                    <Input
                      value={editingCliente.estado || ""}
                      onChange={(e) => setEditingCliente({ ...editingCliente, estado: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={editingCliente.status || "ativo"}
                      onValueChange={(value) => setEditingCliente({ ...editingCliente, status: value })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label>Observações</Label>
                    <Textarea
                      value={editingCliente.observacoes || ""}
                      onChange={(e) => setEditingCliente({ ...editingCliente, observacoes: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="flex gap-2 p-6 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setEditingCliente(null)}>Cancelar</Button>
              <Button className="flex-1" onClick={handleSaveEdit}>Salvar</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminClientes;
