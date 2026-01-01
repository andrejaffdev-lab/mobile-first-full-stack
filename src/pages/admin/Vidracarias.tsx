import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, Search, Building2, Phone, CheckCircle2, Clock, XCircle,
  Plus, Pencil, Trash2, MapPin, X, Mail, CreditCard, Percent
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

type Vidracaria = {
  id: string;
  razao_social: string;
  nome_fantasia: string | null;
  cnpj: string;
  email: string;
  telefone: string;
  whatsapp: string | null;
  responsavel_nome: string | null;
  cep: string;
  endereco: string | null;
  numero: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  comissao_percentual: number | null;
  pix_chave: string | null;
  banco_nome: string | null;
  banco_agencia: string | null;
  banco_conta: string | null;
  total_indicacoes: number | null;
  valor_comissoes: number | null;
  observacoes: string | null;
  status: string | null;
  created_at: string;
};

const Vidracarias = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "aprovado" | "pendente">("todos");
  const [loading, setLoading] = useState(true);
  const [vidracarias, setVidracarias] = useState<Vidracaria[]>([]);
  const [editingVidracaria, setEditingVidracaria] = useState<Vidracaria | null>(null);

  const fetchVidracarias = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("vidracarias")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVidracarias(data || []);
    } catch (err: any) {
      console.error("Erro ao carregar vidracarias:", err);
      toast.error("Erro ao carregar vidracarias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVidracarias();
  }, []);

  const handleDelete = async (id: string, nome: string) => {
    try {
      const { error } = await supabase.from("vidracarias").delete().eq("id", id);
      if (error) throw error;
      setVidracarias(prev => prev.filter(v => v.id !== id));
      toast.success(`Vidraçaria "${nome}" removida com sucesso`);
    } catch (err: any) {
      console.error("Erro ao deletar vidracaria:", err);
      toast.error("Erro ao deletar vidracaria");
    }
  };

  const handleSaveEdit = async () => {
    if (!editingVidracaria) return;
    try {
      const { error } = await supabase
        .from("vidracarias")
        .update({
          razao_social: editingVidracaria.razao_social,
          nome_fantasia: editingVidracaria.nome_fantasia,
          cnpj: editingVidracaria.cnpj,
          email: editingVidracaria.email,
          telefone: editingVidracaria.telefone,
          whatsapp: editingVidracaria.whatsapp,
          responsavel_nome: editingVidracaria.responsavel_nome,
          cep: editingVidracaria.cep,
          endereco: editingVidracaria.endereco,
          numero: editingVidracaria.numero,
          bairro: editingVidracaria.bairro,
          cidade: editingVidracaria.cidade,
          estado: editingVidracaria.estado,
          comissao_percentual: editingVidracaria.comissao_percentual,
          pix_chave: editingVidracaria.pix_chave,
          banco_nome: editingVidracaria.banco_nome,
          banco_agencia: editingVidracaria.banco_agencia,
          banco_conta: editingVidracaria.banco_conta,
          observacoes: editingVidracaria.observacoes,
          status: editingVidracaria.status as any,
        })
        .eq("id", editingVidracaria.id);

      if (error) throw error;
      setVidracarias(prev => prev.map(v => v.id === editingVidracaria.id ? editingVidracaria : v));
      toast.success(`Vidraçaria "${editingVidracaria.razao_social}" atualizada com sucesso`);
      setEditingVidracaria(null);
    } catch (err: any) {
      console.error("Erro ao atualizar vidracaria:", err);
      toast.error("Erro ao atualizar vidracaria");
    }
  };

  const filtros = [
    { key: "todos", label: "Todas" },
    { key: "aprovado", label: "Aprovadas" },
    { key: "pendente", label: "Pendentes" },
  ];

  const filteredVidracarias = vidracarias.filter((vidracaria) => {
    const matchesSearch = vidracaria.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vidracaria.nome_fantasia || "").toLowerCase().includes(searchTerm.toLowerCase());
    const status = vidracaria.status || "pendente";
    const matchesFiltro = filtro === "todos" || status === filtro;
    return matchesSearch && matchesFiltro;
  });

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "aprovado": return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "pendente": return <Clock className="w-4 h-4 text-warning" />;
      default: return <XCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case "aprovado": return "Aprovada";
      case "pendente": return "Pendente";
      default: return "Inativa";
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "aprovado": return "bg-success/10 text-success";
      case "pendente": return "bg-warning/10 text-warning";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="mobile-container min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard/admin")} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-foreground font-display">Vidraçarias</h1>
          </div>
          <Button onClick={() => navigate("/register", { state: { profileType: "vidracaria" } })} size="sm" className="gap-1">
            <Plus className="w-4 h-4" />
            Nova
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            placeholder="Buscar vidraçaria..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-foreground font-display">{vidracarias.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="bg-success/10 border border-success/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-success font-display">
              {vidracarias.filter(v => v.status === "aprovado").length}
            </p>
            <p className="text-xs text-success">Aprovadas</p>
          </div>
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-warning font-display">
              {vidracarias.filter(v => v.status === "pendente").length}
            </p>
            <p className="text-xs text-warning">Pendentes</p>
          </div>
        </motion.div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
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
                    <p className="font-medium text-foreground">{vidracaria.nome_fantasia || vidracaria.razao_social}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      <span>{vidracaria.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{vidracaria.cidade || "Sem cidade"}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        • {vidracaria.total_indicacoes || 0} indicações
                      </span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(vidracaria.status)}`}>
                    {getStatusIcon(vidracaria.status)}
                    {getStatusLabel(vidracaria.status)}
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                  <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => setEditingVidracaria(vidracaria)}>
                    <Pencil className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1 gap-1" onClick={() => handleDelete(vidracaria.id, vidracaria.razao_social)}>
                    <Trash2 className="w-4 h-4" />
                    Deletar
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredVidracarias.length === 0 && (
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
            className="bg-background rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold">Editar Vidraçaria</h2>
              <button onClick={() => setEditingVidracaria(null)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {/* Dados da Empresa */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Dados da Empresa
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Razão Social</Label>
                      <Input value={editingVidracaria.razao_social} onChange={(e) => setEditingVidracaria({ ...editingVidracaria, razao_social: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <Label>Nome Fantasia</Label>
                      <Input value={editingVidracaria.nome_fantasia || ""} onChange={(e) => setEditingVidracaria({ ...editingVidracaria, nome_fantasia: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <Label>CNPJ</Label>
                      <Input value={editingVidracaria.cnpj} onChange={(e) => setEditingVidracaria({ ...editingVidracaria, cnpj: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* Contato */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contato
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Telefone</Label>
                      <Input value={editingVidracaria.telefone} onChange={(e) => setEditingVidracaria({ ...editingVidracaria, telefone: e.target.value })} />
                    </div>
                    <div>
                      <Label>WhatsApp</Label>
                      <Input value={editingVidracaria.whatsapp || ""} onChange={(e) => setEditingVidracaria({ ...editingVidracaria, whatsapp: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <Label>Email</Label>
                      <Input type="email" value={editingVidracaria.email} onChange={(e) => setEditingVidracaria({ ...editingVidracaria, email: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <Label>Responsável</Label>
                      <Input value={editingVidracaria.responsavel_nome || ""} onChange={(e) => setEditingVidracaria({ ...editingVidracaria, responsavel_nome: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Endereço
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>CEP</Label>
                      <Input value={editingVidracaria.cep} onChange={(e) => setEditingVidracaria({ ...editingVidracaria, cep: e.target.value })} />
                    </div>
                    <div>
                      <Label>Número</Label>
                      <Input value={editingVidracaria.numero || ""} onChange={(e) => setEditingVidracaria({ ...editingVidracaria, numero: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <Label>Endereço</Label>
                      <Input value={editingVidracaria.endereco || ""} onChange={(e) => setEditingVidracaria({ ...editingVidracaria, endereco: e.target.value })} />
                    </div>
                    <div>
                      <Label>Cidade</Label>
                      <Input value={editingVidracaria.cidade || ""} onChange={(e) => setEditingVidracaria({ ...editingVidracaria, cidade: e.target.value })} />
                    </div>
                    <div>
                      <Label>Estado</Label>
                      <Input value={editingVidracaria.estado || ""} onChange={(e) => setEditingVidracaria({ ...editingVidracaria, estado: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* Dados Bancários */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Dados Bancários
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Chave PIX</Label>
                      <Input value={editingVidracaria.pix_chave || ""} onChange={(e) => setEditingVidracaria({ ...editingVidracaria, pix_chave: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <Label>Banco que recebe</Label>
                      <Input value={editingVidracaria.banco_nome || ""} onChange={(e) => setEditingVidracaria({ ...editingVidracaria, banco_nome: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* Comissão e Status */}
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Comissão (%)</Label>
                      <Input 
                        type="number" 
                        value={editingVidracaria.comissao_percentual || 10} 
                        onChange={(e) => setEditingVidracaria({ ...editingVidracaria, comissao_percentual: parseFloat(e.target.value) })} 
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select value={editingVidracaria.status || "pendente"} onValueChange={(value) => setEditingVidracaria({ ...editingVidracaria, status: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="aprovado">Aprovada</SelectItem>
                          <SelectItem value="rejeitado">Rejeitada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label>Observações</Label>
                    <Textarea value={editingVidracaria.observacoes || ""} onChange={(e) => setEditingVidracaria({ ...editingVidracaria, observacoes: e.target.value })} rows={3} />
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="flex gap-2 p-6 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setEditingVidracaria(null)}>Cancelar</Button>
              <Button className="flex-1" onClick={handleSaveEdit}>Salvar</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Vidracarias;
