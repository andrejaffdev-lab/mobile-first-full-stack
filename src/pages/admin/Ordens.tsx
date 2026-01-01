import { useState, useEffect } from "react";
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
  Calendar,
  X,
  MapPin,
  Phone,
  Image,
  FileText,
  DollarSign,
  Wrench
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

const Ordens = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "concluido" | "andamento" | "pendente">("todos");

  const [ordens, setOrdens] = useState([
    { 
      id: "1", 
      titulo: "Manutenção Box Banheiro", 
      descricao: "Troca de roldanas e ajuste de portas do box",
      cliente: "Ana Paula",
      clienteTelefone: "(11) 99999-1111",
      clienteEndereco: "Rua das Flores, 123 - São Paulo, SP",
      status: "concluido", 
      dataSolicitacao: "10/01/2026",
      dataAgendamento: "15/01/2026",
      dataConclusao: "15/01/2026",
      valor: "R$ 200,00",
      formaPagamento: "PIX",
      prestador: "João Montador",
      prestadorTelefone: "(11) 99999-1111",
      tipoServico: "Manutenção",
      materiais: "Roldanas (2un), Parafusos",
      observacoesSolicitacao: "Box com dificuldade de deslizar",
      observacoesExecucao: "Trocadas as roldanas superiores e inferiores. Ajustado o trilho.",
      fotoAntes: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200",
      fotoDepois: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200",
      avaliacaoCliente: 5
    },
    { 
      id: "2", 
      titulo: "Instalação Película", 
      descricao: "Aplicação de película fumê nas janelas da sala",
      cliente: "Roberto Carlos",
      clienteTelefone: "(11) 99999-2222",
      clienteEndereco: "Av. Brasil, 456 - São Paulo, SP",
      status: "andamento", 
      dataSolicitacao: "12/01/2026",
      dataAgendamento: "18/01/2026",
      dataConclusao: "",
      valor: "R$ 350,00",
      formaPagamento: "Cartão de Crédito",
      prestador: "Pedro Silva",
      prestadorTelefone: "(11) 99999-2222",
      tipoServico: "Instalação",
      materiais: "Película fumê 3m x 1.5m",
      observacoesSolicitacao: "Janelas da sala de estar, 3 folhas",
      observacoesExecucao: "",
      fotoAntes: "",
      fotoDepois: "",
      avaliacaoCliente: 0
    },
    { 
      id: "3", 
      titulo: "Troca de Roldanas", 
      descricao: "Substituição das roldanas do box",
      cliente: "Maria José",
      clienteTelefone: "(11) 99999-3333",
      clienteEndereco: "Rua Augusta, 789 - São Paulo, SP",
      status: "pendente", 
      dataSolicitacao: "18/01/2026",
      dataAgendamento: "20/01/2026",
      dataConclusao: "",
      valor: "R$ 150,00",
      formaPagamento: "Dinheiro",
      prestador: "",
      prestadorTelefone: "",
      tipoServico: "Manutenção",
      materiais: "",
      observacoesSolicitacao: "Roldanas quebradas, box não fecha",
      observacoesExecucao: "",
      fotoAntes: "",
      fotoDepois: "",
      avaliacaoCliente: 0
    },
    { 
      id: "4", 
      titulo: "Manutenção Preventiva", 
      descricao: "Revisão geral do box e espelhos",
      cliente: "Fernando Lima",
      clienteTelefone: "(11) 99999-4444",
      clienteEndereco: "Rua Oscar Freire, 321 - São Paulo, SP",
      status: "concluido", 
      dataSolicitacao: "05/01/2026",
      dataAgendamento: "12/01/2026",
      dataConclusao: "12/01/2026",
      valor: "R$ 180,00",
      formaPagamento: "PIX",
      prestador: "Marcos Oliveira",
      prestadorTelefone: "(11) 99999-4444",
      tipoServico: "Manutenção",
      materiais: "Silicone, parafusos de reposição",
      observacoesSolicitacao: "Revisão semestral",
      observacoesExecucao: "Tudo em ordem, aplicado silicone preventivo nas bordas.",
      fotoAntes: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200",
      fotoDepois: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200",
      avaliacaoCliente: 5
    },
  ]);

  const [editingOrdem, setEditingOrdem] = useState<typeof ordens[0] | null>(null);

  // Trava o scroll do body quando o modal está aberto
  useEffect(() => {
    if (editingOrdem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [editingOrdem]);

  const handleDelete = (id: string, titulo: string) => {
    setOrdens(prev => prev.filter(o => o.id !== id));
    toast.success(`Ordem "${titulo}" removida com sucesso`);
  };

  const handleEdit = (ordem: typeof ordens[0]) => {
    setEditingOrdem(ordem);
  };

  const handleSaveEdit = () => {
    if (editingOrdem) {
      setOrdens(prev => prev.map(o => o.id === editingOrdem.id ? editingOrdem : o));
      toast.success(`Ordem "${editingOrdem.titulo}" atualizada com sucesso`);
      setEditingOrdem(null);
    }
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
              onClick={() => navigate("/dashboard/admin")}
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
                      <span>{ordem.dataAgendamento}</span>
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
                  onClick={() => handleEdit(ordem)}
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

      {/* Modal de Edição Completo */}
      {editingOrdem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h2 className="text-lg font-semibold">Editar Ordem de Serviço</h2>
              <button onClick={() => setEditingOrdem(null)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Dados do Serviço */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4" />
                    Dados do Serviço
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Título</Label>
                      <Input
                        value={editingOrdem.titulo}
                        onChange={(e) => setEditingOrdem({ ...editingOrdem, titulo: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Descrição</Label>
                      <Textarea
                        value={editingOrdem.descricao}
                        onChange={(e) => setEditingOrdem({ ...editingOrdem, descricao: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Tipo de Serviço</Label>
                      <Select
                        value={editingOrdem.tipoServico}
                        onValueChange={(value) => setEditingOrdem({ ...editingOrdem, tipoServico: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Manutenção">Manutenção</SelectItem>
                          <SelectItem value="Instalação">Instalação</SelectItem>
                          <SelectItem value="Reparo">Reparo</SelectItem>
                          <SelectItem value="Troca">Troca</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={editingOrdem.status}
                        onValueChange={(value) => setEditingOrdem({ ...editingOrdem, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="andamento">Em Andamento</SelectItem>
                          <SelectItem value="concluido">Concluído</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Cliente */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Dados do Cliente
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nome do Cliente</Label>
                      <Input
                        value={editingOrdem.cliente}
                        onChange={(e) => setEditingOrdem({ ...editingOrdem, cliente: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Telefone</Label>
                      <Input
                        value={editingOrdem.clienteTelefone}
                        onChange={(e) => setEditingOrdem({ ...editingOrdem, clienteTelefone: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Endereço</Label>
                      <Input
                        value={editingOrdem.clienteEndereco}
                        onChange={(e) => setEditingOrdem({ ...editingOrdem, clienteEndereco: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Datas */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Datas
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Solicitação</Label>
                      <Input
                        value={editingOrdem.dataSolicitacao}
                        onChange={(e) => setEditingOrdem({ ...editingOrdem, dataSolicitacao: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Agendamento</Label>
                      <Input
                        value={editingOrdem.dataAgendamento}
                        onChange={(e) => setEditingOrdem({ ...editingOrdem, dataAgendamento: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Conclusão</Label>
                      <Input
                        value={editingOrdem.dataConclusao}
                        onChange={(e) => setEditingOrdem({ ...editingOrdem, dataConclusao: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Financeiro */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Financeiro
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Valor</Label>
                      <Input
                        value={editingOrdem.valor}
                        onChange={(e) => setEditingOrdem({ ...editingOrdem, valor: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Forma de Pagamento</Label>
                      <Select
                        value={editingOrdem.formaPagamento}
                        onValueChange={(value) => setEditingOrdem({ ...editingOrdem, formaPagamento: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PIX">PIX</SelectItem>
                          <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                          <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                          <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                          <SelectItem value="Boleto">Boleto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Prestador */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    Prestador Responsável
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nome do Prestador</Label>
                      <Input
                        value={editingOrdem.prestador}
                        onChange={(e) => setEditingOrdem({ ...editingOrdem, prestador: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Telefone</Label>
                      <Input
                        value={editingOrdem.prestadorTelefone}
                        onChange={(e) => setEditingOrdem({ ...editingOrdem, prestadorTelefone: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Materiais Utilizados</Label>
                      <Input
                        value={editingOrdem.materiais}
                        onChange={(e) => setEditingOrdem({ ...editingOrdem, materiais: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Observações
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Observações da Solicitação</Label>
                      <Textarea
                        value={editingOrdem.observacoesSolicitacao}
                        onChange={(e) => setEditingOrdem({ ...editingOrdem, observacoesSolicitacao: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Observações da Execução</Label>
                      <Textarea
                        value={editingOrdem.observacoesExecucao}
                        onChange={(e) => setEditingOrdem({ ...editingOrdem, observacoesExecucao: e.target.value })}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Fotos */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Fotos
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Foto Antes (URL)</Label>
                      <Input
                        value={editingOrdem.fotoAntes}
                        onChange={(e) => setEditingOrdem({ ...editingOrdem, fotoAntes: e.target.value })}
                        placeholder="https://..."
                      />
                      {editingOrdem.fotoAntes && (
                        <img src={editingOrdem.fotoAntes} alt="Antes" className="mt-2 w-full h-24 object-cover rounded-lg" />
                      )}
                    </div>
                    <div>
                      <Label>Foto Depois (URL)</Label>
                      <Input
                        value={editingOrdem.fotoDepois}
                        onChange={(e) => setEditingOrdem({ ...editingOrdem, fotoDepois: e.target.value })}
                        placeholder="https://..."
                      />
                      {editingOrdem.fotoDepois && (
                        <img src={editingOrdem.fotoDepois} alt="Depois" className="mt-2 w-full h-24 object-cover rounded-lg" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Avaliação */}
                <div>
                  <Label>Avaliação do Cliente (0-5)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    value={editingOrdem.avaliacaoCliente}
                    onChange={(e) => setEditingOrdem({ ...editingOrdem, avaliacaoCliente: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-6 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setEditingOrdem(null)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleSaveEdit}>
                Salvar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Ordens;