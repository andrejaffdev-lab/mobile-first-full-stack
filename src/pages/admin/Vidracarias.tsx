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
  X,
  Mail,
  FileText,
  CreditCard,
  Users,
  Percent
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

const Vidracarias = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "ativos" | "pendentes">("todos");

  const [vidracarias, setVidracarias] = useState([
    { 
      id: "1", 
      nome: "Vidraçaria Premium", 
      nomeFantasia: "Premium Vidros",
      cnpj: "12.345.678/0001-90",
      inscricaoEstadual: "123.456.789.000",
      telefone: "(11) 3333-1111", 
      telefone2: "(11) 99999-1111",
      email: "contato@premium.com.br",
      responsavel: "José da Silva",
      endereco: "Rua dos Vidros, 100",
      cidade: "São Paulo", 
      estado: "SP",
      cep: "01234-567",
      status: "ativo", 
      clientes: 45,
      comissao: 5,
      dadosBancarios: {
        banco: "Itaú",
        agencia: "1234",
        conta: "56789-0",
        tipoConta: "Corrente",
        pix: "12.345.678/0001-90"
      },
      dataCadastro: "15/01/2024",
      observacoes: "Parceiro desde 2024"
    },
    { 
      id: "2", 
      nome: "Glass Center", 
      nomeFantasia: "Glass Center SP",
      cnpj: "23.456.789/0001-01",
      inscricaoEstadual: "234.567.890.111",
      telefone: "(19) 3333-2222", 
      telefone2: "",
      email: "contato@glasscenter.com.br",
      responsavel: "Maria Santos",
      endereco: "Av. das Indústrias, 500",
      cidade: "Campinas", 
      estado: "SP",
      cep: "13000-000",
      status: "ativo", 
      clientes: 32,
      comissao: 4.5,
      dadosBancarios: {
        banco: "Bradesco",
        agencia: "2345",
        conta: "67890-1",
        tipoConta: "Corrente",
        pix: "contato@glasscenter.com.br"
      },
      dataCadastro: "20/03/2024",
      observacoes: ""
    },
    { 
      id: "3", 
      nome: "Vidros & Cia", 
      nomeFantasia: "Vidros & Cia",
      cnpj: "34.567.890/0001-12",
      inscricaoEstadual: "",
      telefone: "(13) 3333-3333", 
      telefone2: "",
      email: "vidrosecia@email.com",
      responsavel: "Carlos Lima",
      endereco: "Rua do Comércio, 200",
      cidade: "Santos", 
      estado: "SP",
      cep: "11000-000",
      status: "pendente", 
      clientes: 0,
      comissao: 5,
      dadosBancarios: {
        banco: "",
        agencia: "",
        conta: "",
        tipoConta: "",
        pix: ""
      },
      dataCadastro: "28/12/2025",
      observacoes: "Aguardando documentação completa"
    },
    { 
      id: "4", 
      nome: "Master Vidros", 
      nomeFantasia: "Master Vidros GRU",
      cnpj: "45.678.901/0001-23",
      inscricaoEstadual: "456.789.012.333",
      telefone: "(11) 3333-4444", 
      telefone2: "(11) 99999-4444",
      email: "master@vidros.com.br",
      responsavel: "Fernando Oliveira",
      endereco: "Av. Guarulhos, 1000",
      cidade: "Guarulhos", 
      estado: "SP",
      cep: "07000-000",
      status: "ativo", 
      clientes: 67,
      comissao: 6,
      dadosBancarios: {
        banco: "Nubank",
        agencia: "0001",
        conta: "12345678-9",
        tipoConta: "Corrente",
        pix: "(11) 99999-4444"
      },
      dataCadastro: "10/02/2024",
      observacoes: "Parceiro premium, alto volume"
    },
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

      {/* Modal de Edição Completo */}
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
                      <Input
                        value={editingVidracaria.nome}
                        onChange={(e) => setEditingVidracaria({ ...editingVidracaria, nome: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Nome Fantasia</Label>
                      <Input
                        value={editingVidracaria.nomeFantasia}
                        onChange={(e) => setEditingVidracaria({ ...editingVidracaria, nomeFantasia: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>CNPJ</Label>
                      <Input
                        value={editingVidracaria.cnpj}
                        onChange={(e) => setEditingVidracaria({ ...editingVidracaria, cnpj: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Inscrição Estadual</Label>
                      <Input
                        value={editingVidracaria.inscricaoEstadual}
                        onChange={(e) => setEditingVidracaria({ ...editingVidracaria, inscricaoEstadual: e.target.value })}
                      />
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
                      <Label>Telefone Principal</Label>
                      <Input
                        value={editingVidracaria.telefone}
                        onChange={(e) => setEditingVidracaria({ ...editingVidracaria, telefone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Telefone Secundário</Label>
                      <Input
                        value={editingVidracaria.telefone2}
                        onChange={(e) => setEditingVidracaria({ ...editingVidracaria, telefone2: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={editingVidracaria.email}
                        onChange={(e) => setEditingVidracaria({ ...editingVidracaria, email: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Responsável</Label>
                      <Input
                        value={editingVidracaria.responsavel}
                        onChange={(e) => setEditingVidracaria({ ...editingVidracaria, responsavel: e.target.value })}
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
                        value={editingVidracaria.endereco}
                        onChange={(e) => setEditingVidracaria({ ...editingVidracaria, endereco: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Cidade</Label>
                      <Input
                        value={editingVidracaria.cidade}
                        onChange={(e) => setEditingVidracaria({ ...editingVidracaria, cidade: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Estado</Label>
                      <Input
                        value={editingVidracaria.estado}
                        onChange={(e) => setEditingVidracaria({ ...editingVidracaria, estado: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>CEP</Label>
                      <Input
                        value={editingVidracaria.cep}
                        onChange={(e) => setEditingVidracaria({ ...editingVidracaria, cep: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={editingVidracaria.status}
                        onValueChange={(value) => setEditingVidracaria({ ...editingVidracaria, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ativo">Ativa</SelectItem>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="inativo">Inativa</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <div>
                      <Label>Banco</Label>
                      <Input
                        value={editingVidracaria.dadosBancarios.banco}
                        onChange={(e) => setEditingVidracaria({ 
                          ...editingVidracaria, 
                          dadosBancarios: { ...editingVidracaria.dadosBancarios, banco: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Tipo de Conta</Label>
                      <Select
                        value={editingVidracaria.dadosBancarios.tipoConta}
                        onValueChange={(value) => setEditingVidracaria({ 
                          ...editingVidracaria, 
                          dadosBancarios: { ...editingVidracaria.dadosBancarios, tipoConta: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Corrente">Corrente</SelectItem>
                          <SelectItem value="Poupança">Poupança</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Agência</Label>
                      <Input
                        value={editingVidracaria.dadosBancarios.agencia}
                        onChange={(e) => setEditingVidracaria({ 
                          ...editingVidracaria, 
                          dadosBancarios: { ...editingVidracaria.dadosBancarios, agencia: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Conta</Label>
                      <Input
                        value={editingVidracaria.dadosBancarios.conta}
                        onChange={(e) => setEditingVidracaria({ 
                          ...editingVidracaria, 
                          dadosBancarios: { ...editingVidracaria.dadosBancarios, conta: e.target.value }
                        })}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Chave PIX</Label>
                      <Input
                        value={editingVidracaria.dadosBancarios.pix}
                        onChange={(e) => setEditingVidracaria({ 
                          ...editingVidracaria, 
                          dadosBancarios: { ...editingVidracaria.dadosBancarios, pix: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* Métricas */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Métricas e Comissão
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Clientes Indicados</Label>
                      <Input
                        type="number"
                        value={editingVidracaria.clientes}
                        onChange={(e) => setEditingVidracaria({ ...editingVidracaria, clientes: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label>Comissão (%)</Label>
                      <Input
                        type="number"
                        step="0.5"
                        min="0"
                        max="100"
                        value={editingVidracaria.comissao}
                        onChange={(e) => setEditingVidracaria({ ...editingVidracaria, comissao: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Data de Cadastro</Label>
                      <Input
                        value={editingVidracaria.dataCadastro}
                        onChange={(e) => setEditingVidracaria({ ...editingVidracaria, dataCadastro: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <Label>Observações</Label>
                  <Textarea
                    value={editingVidracaria.observacoes}
                    onChange={(e) => setEditingVidracaria({ ...editingVidracaria, observacoes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </ScrollArea>
            <div className="flex gap-2 p-6 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setEditingVidracaria(null)}>
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

export default Vidracarias;