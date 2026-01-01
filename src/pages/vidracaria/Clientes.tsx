import { useState, useEffect } from "react";
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
  X,
  Mail,
  MapPin,
  FileText
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
import { ptBR } from "date-fns/locale";

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  cpf: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  status: string;
  dataIndicacao: string;
  servicoIndicado: string;
  valorServico: string;
  comissaoGerada: string;
  observacoes: string;
}

const Clientes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "ativos" | "pendentes">("todos");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    const carregarClientes = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Buscar vidraçaria pelo user_id
      const { data: vidracaria } = await supabase
        .from('vidracarias')
        .select('id, comissao_percentual')
        .eq('user_id', user.id)
        .single();

      if (!vidracaria) {
        setIsLoading(false);
        return;
      }

      // Buscar ordens indicadas pela vidraçaria
      const { data: ordens } = await supabase
        .from('ordens_servico')
        .select(`
          *,
          cliente:clientes(*)
        `)
        .eq('vidracaria_id', vidracaria.id)
        .order('created_at', { ascending: false });

      if (!ordens) {
        setIsLoading(false);
        return;
      }

      // Verificar tipos de serviço
      const { data: manutencoes } = await supabase
        .from('processo_manutencao')
        .select('ordem_id')
        .in('ordem_id', ordens.map(o => o.id));

      const manutencaoIds = new Set(manutencoes?.map(m => m.ordem_id) || []);

      const comissaoPercentual = Number(vidracaria.comissao_percentual) || 10;

      const clientesData: Cliente[] = ordens
        .filter(o => o.cliente)
        .map(ordem => {
          const valorServico = Number(ordem.valor_total || 0);
          const comissao = ordem.status === 'concluido' 
            ? valorServico * (comissaoPercentual / 100) 
            : 0;
          const isManutencao = manutencaoIds.has(ordem.id);

          return {
            id: ordem.id,
            nome: ordem.cliente.nome,
            telefone: ordem.cliente.telefone || '',
            email: ordem.cliente.email || '',
            cpf: ordem.cliente.documento || '',
            endereco: ordem.cliente.endereco || '',
            cidade: ordem.cliente.cidade || '',
            estado: ordem.cliente.estado || '',
            cep: ordem.cliente.cep || '',
            status: ordem.status === 'concluido' ? 'ativo' : ordem.status === 'pendente' ? 'pendente' : 'inativo',
            dataIndicacao: format(new Date(ordem.created_at), "dd/MM/yyyy", { locale: ptBR }),
            servicoIndicado: isManutencao ? "Manutenção Box" : "Aplicação de Película",
            valorServico: `R$ ${valorServico.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            comissaoGerada: `R$ ${comissao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            observacoes: ordem.observacoes || ''
          };
        });

      setClientes(clientesData);
      setIsLoading(false);
    };

    carregarClientes();
  }, []);

  const handleDelete = (id: string, nome: string) => {
    setClientes(prev => prev.filter(c => c.id !== id));
    toast.success(`Cliente "${nome}" removido com sucesso`);
  };

  const handleEdit = (cliente: Cliente) => {
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
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-foreground font-display">
              Clientes Indicados
            </h1>
          </div>
          <Button 
            onClick={() => navigate("/vidracaria/cadastrar-cliente")}
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
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        ) : (
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
                    {cliente.telefone && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span>{cliente.telefone}</span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Indicado em {cliente.dataIndicacao}
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
        )}

        {!isLoading && filteredClientes.length === 0 && (
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
            className="bg-background rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold">Editar Cliente Indicado</h2>
              <button onClick={() => setEditingCliente(null)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {/* Dados Pessoais */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Dados Pessoais
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Nome Completo</Label>
                      <Input
                        value={editingCliente.nome}
                        onChange={(e) => setEditingCliente({ ...editingCliente, nome: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>CPF</Label>
                      <Input
                        value={editingCliente.cpf}
                        onChange={(e) => setEditingCliente({ ...editingCliente, cpf: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Telefone</Label>
                      <Input
                        value={editingCliente.telefone}
                        onChange={(e) => setEditingCliente({ ...editingCliente, telefone: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={editingCliente.email}
                        onChange={(e) => setEditingCliente({ ...editingCliente, email: e.target.value })}
                      />
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
                    <div className="col-span-2">
                      <Label>Endereço</Label>
                      <Input
                        value={editingCliente.endereco}
                        onChange={(e) => setEditingCliente({ ...editingCliente, endereco: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Cidade</Label>
                      <Input
                        value={editingCliente.cidade}
                        onChange={(e) => setEditingCliente({ ...editingCliente, cidade: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Estado</Label>
                      <Input
                        value={editingCliente.estado}
                        onChange={(e) => setEditingCliente({ ...editingCliente, estado: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>CEP</Label>
                      <Input
                        value={editingCliente.cep}
                        onChange={(e) => setEditingCliente({ ...editingCliente, cep: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={editingCliente.status}
                        onValueChange={(value) => setEditingCliente({ ...editingCliente, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="inativo">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Dados da Indicação */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Dados da Indicação
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Data da Indicação</Label>
                      <Input
                        value={editingCliente.dataIndicacao}
                        disabled
                      />
                    </div>
                    <div>
                      <Label>Serviço Indicado</Label>
                      <Input
                        value={editingCliente.servicoIndicado}
                        disabled
                      />
                    </div>
                    <div>
                      <Label>Valor do Serviço</Label>
                      <Input
                        value={editingCliente.valorServico}
                        disabled
                      />
                    </div>
                    <div>
                      <Label>Comissão Gerada</Label>
                      <Input
                        value={editingCliente.comissaoGerada}
                        disabled
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Observações</Label>
                      <Textarea
                        value={editingCliente.observacoes}
                        onChange={(e) => setEditingCliente({ ...editingCliente, observacoes: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="flex gap-3 p-6 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setEditingCliente(null)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleSaveEdit}>
                Salvar Alterações
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
