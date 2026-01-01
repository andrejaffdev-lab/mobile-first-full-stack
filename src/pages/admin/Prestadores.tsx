import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, Search, Wrench, Phone, CheckCircle2, Clock, XCircle,
  Plus, Pencil, Trash2, Star, X, Mail, MapPin, CreditCard, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

type Prestador = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  whatsapp: string | null;
  documento: string;
  tipo_documento: string;
  tipo_veiculo: string;
  cep: string;
  endereco: string | null;
  numero: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  qualificacoes: string[] | null;
  nota_media: number | null;
  total_servicos: number | null;
  pix_chave: string | null;
  banco_nome: string | null;
  banco_agencia: string | null;
  banco_conta: string | null;
  observacoes: string | null;
  status: string | null;
  created_at: string;
};

const qualificacoesDisponiveis = [
  { id: "box_padrao_aluminio", label: "Box Padrão Alumínio" },
  { id: "box_especial_aluminio", label: "Box Especial de Alumínio" },
  { id: "box_ideia_glass", label: "Box da linha Idéia Glass" },
  { id: "box_aparente_inox", label: "Box Aparente de Inox" },
  { id: "box_rollit", label: "Box da linha Rollit" },
  { id: "box_encaixilhado", label: "Box Encaixilhado" },
  { id: "pelicula_seguranca", label: "Instala Película de Segurança" },
];

const Prestadores = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "aprovado" | "pendente">("todos");
  const [loading, setLoading] = useState(true);
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [editingPrestador, setEditingPrestador] = useState<Prestador | null>(null);

  const fetchPrestadores = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("prestadores_servico")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPrestadores(data || []);
    } catch (err: any) {
      console.error("Erro ao carregar prestadores:", err);
      toast.error("Erro ao carregar prestadores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrestadores();
  }, []);

  useEffect(() => {
    if (editingPrestador) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [editingPrestador]);

  const handleDelete = async (id: string, nome: string) => {
    try {
      const { error } = await supabase.from("prestadores_servico").delete().eq("id", id);
      if (error) throw error;
      setPrestadores(prev => prev.filter(p => p.id !== id));
      toast.success(`Prestador "${nome}" removido com sucesso`);
    } catch (err: any) {
      console.error("Erro ao deletar prestador:", err);
      toast.error("Erro ao deletar prestador");
    }
  };

  const handleSaveEdit = async () => {
    if (!editingPrestador) return;
    try {
      const { error } = await supabase
        .from("prestadores_servico")
        .update({
          nome: editingPrestador.nome,
          email: editingPrestador.email,
          telefone: editingPrestador.telefone,
          whatsapp: editingPrestador.whatsapp,
          documento: editingPrestador.documento,
          cep: editingPrestador.cep,
          endereco: editingPrestador.endereco,
          numero: editingPrestador.numero,
          bairro: editingPrestador.bairro,
          cidade: editingPrestador.cidade,
          estado: editingPrestador.estado,
          qualificacoes: editingPrestador.qualificacoes,
          pix_chave: editingPrestador.pix_chave,
          banco_nome: editingPrestador.banco_nome,
          banco_agencia: editingPrestador.banco_agencia,
          banco_conta: editingPrestador.banco_conta,
          observacoes: editingPrestador.observacoes,
          status: editingPrestador.status as any,
        })
        .eq("id", editingPrestador.id);

      if (error) throw error;
      setPrestadores(prev => prev.map(p => p.id === editingPrestador.id ? editingPrestador : p));
      toast.success(`Prestador "${editingPrestador.nome}" atualizado com sucesso`);
      setEditingPrestador(null);
    } catch (err: any) {
      console.error("Erro ao atualizar prestador:", err);
      toast.error("Erro ao atualizar prestador");
    }
  };

  const toggleQualificacao = (qualId: string) => {
    if (!editingPrestador) return;
    const current = editingPrestador.qualificacoes || [];
    const updated = current.includes(qualId) 
      ? current.filter(q => q !== qualId) 
      : [...current, qualId];
    setEditingPrestador({ ...editingPrestador, qualificacoes: updated });
  };

  const filtros = [
    { key: "todos", label: "Todos" },
    { key: "aprovado", label: "Aprovados" },
    { key: "pendente", label: "Pendentes" },
  ];

  const filteredPrestadores = prestadores.filter((prestador) => {
    const matchesSearch = prestador.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const status = prestador.status || "pendente";
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
      case "aprovado": return "Aprovado";
      case "pendente": return "Pendente";
      case "rejeitado": return "Rejeitado";
      default: return "Inativo";
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
    <div className="mobile-container h-screen bg-background flex flex-col overflow-hidden">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard/admin")} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-foreground font-display">Prestadores</h1>
          </div>
          <Button onClick={() => navigate("/register", { state: { profileType: "prestador" } })} size="sm" className="gap-1">
            <Plus className="w-4 h-4" />
            Novo
          </Button>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="px-6 py-6 space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            placeholder="Buscar prestador..."
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
            <p className="text-2xl font-bold text-foreground font-display">{prestadores.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="bg-success/10 border border-success/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-success font-display">
              {prestadores.filter(p => p.status === "aprovado").length}
            </p>
            <p className="text-xs text-success">Aprovados</p>
          </div>
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-warning font-display">
              {prestadores.filter(p => p.status === "pendente").length}
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
                      {(prestador.nota_media || 0) > 0 && (
                        <div className="flex items-center gap-1 text-xs text-warning">
                          <Star className="w-3 h-3 fill-warning" />
                          <span>{prestador.nota_media}</span>
                        </div>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {prestador.total_servicos || 0} serviços
                      </span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(prestador.status)}`}>
                    {getStatusIcon(prestador.status)}
                    {getStatusLabel(prestador.status)}
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                  <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => setEditingPrestador(prestador)}>
                    <Pencil className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1 gap-1" onClick={() => handleDelete(prestador.id, prestador.nome)}>
                    <Trash2 className="w-4 h-4" />
                    Deletar
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredPrestadores.length === 0 && (
          <div className="text-center py-12">
            <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum prestador encontrado</p>
          </div>
        )}
        </div>
      </ScrollArea>

      {/* Modal de Edição */}
      {editingPrestador && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h2 className="text-lg font-semibold">Editar Prestador</h2>
              <button onClick={() => setEditingPrestador(null)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Dados Pessoais */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Dados Pessoais
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Nome Completo</Label>
                      <Input value={editingPrestador.nome} onChange={(e) => setEditingPrestador({ ...editingPrestador, nome: e.target.value })} />
                    </div>
                    <div>
                      <Label>Documento</Label>
                      <Input value={editingPrestador.documento} onChange={(e) => setEditingPrestador({ ...editingPrestador, documento: e.target.value })} />
                    </div>
                    <div>
                      <Label>Telefone</Label>
                      <Input value={editingPrestador.telefone} onChange={(e) => setEditingPrestador({ ...editingPrestador, telefone: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <Label>Email</Label>
                      <Input type="email" value={editingPrestador.email} onChange={(e) => setEditingPrestador({ ...editingPrestador, email: e.target.value })} />
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
                      <Input value={editingPrestador.cep} onChange={(e) => setEditingPrestador({ ...editingPrestador, cep: e.target.value })} />
                    </div>
                    <div>
                      <Label>Número</Label>
                      <Input value={editingPrestador.numero || ""} onChange={(e) => setEditingPrestador({ ...editingPrestador, numero: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <Label>Endereço</Label>
                      <Input value={editingPrestador.endereco || ""} onChange={(e) => setEditingPrestador({ ...editingPrestador, endereco: e.target.value })} />
                    </div>
                    <div>
                      <Label>Cidade</Label>
                      <Input value={editingPrestador.cidade || ""} onChange={(e) => setEditingPrestador({ ...editingPrestador, cidade: e.target.value })} />
                    </div>
                    <div>
                      <Label>Estado</Label>
                      <Input value={editingPrestador.estado || ""} onChange={(e) => setEditingPrestador({ ...editingPrestador, estado: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* Qualificações */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">Qualificações</h3>
                  <div className="space-y-2">
                    {qualificacoesDisponiveis.map((qual) => (
                      <label key={qual.id} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={(editingPrestador.qualificacoes || []).includes(qual.id)}
                          onCheckedChange={() => toggleQualificacao(qual.id)}
                        />
                        <span className="text-sm">{qual.label}</span>
                      </label>
                    ))}
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
                      <Input value={editingPrestador.pix_chave || ""} onChange={(e) => setEditingPrestador({ ...editingPrestador, pix_chave: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <Label>Banco que recebe</Label>
                      <Input value={editingPrestador.banco_nome || ""} onChange={(e) => setEditingPrestador({ ...editingPrestador, banco_nome: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* Status e Observações */}
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Status</Label>
                      <Select value={editingPrestador.status || "pendente"} onValueChange={(value) => setEditingPrestador({ ...editingPrestador, status: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="aprovado">Aprovado</SelectItem>
                          <SelectItem value="rejeitado">Rejeitado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label>Observações</Label>
                    <Textarea value={editingPrestador.observacoes || ""} onChange={(e) => setEditingPrestador({ ...editingPrestador, observacoes: e.target.value })} rows={3} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-6 border-t border-border shrink-0">
              <Button variant="outline" className="flex-1" onClick={() => setEditingPrestador(null)}>Cancelar</Button>
              <Button className="flex-1" onClick={handleSaveEdit}>Salvar</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Prestadores;
