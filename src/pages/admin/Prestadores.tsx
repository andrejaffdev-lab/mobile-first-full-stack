import { useState, useEffect } from "react";
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
  X,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  Briefcase,
  Award,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

const Prestadores = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "ativos" | "pendentes">("todos");

  const [prestadores, setPrestadores] = useState([
    { 
      id: "1", 
      nome: "João Montador", 
      telefone: "(11) 99999-1111", 
      email: "joao@email.com",
      cpf: "123.456.789-00",
      rg: "12.345.678-9",
      endereco: "Rua das Oficinas, 100",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
      status: "ativo", 
      avaliacao: 4.8, 
      servicos: 156,
      especialidades: ["Box", "Espelhos", "Portas"],
      dadosBancarios: {
        banco: "Nubank",
        agencia: "0001",
        conta: "12345678-9",
        tipoConta: "Corrente",
        pix: "joao@email.com"
      },
      dataCadastro: "15/06/2024",
      documentosVerificados: true,
      observacoes: "Profissional experiente, pontual"
    },
    { 
      id: "2", 
      nome: "Pedro Silva", 
      telefone: "(11) 99999-2222", 
      email: "pedro@email.com",
      cpf: "234.567.890-11",
      rg: "23.456.789-0",
      endereco: "Av. Industrial, 200",
      cidade: "São Paulo",
      estado: "SP",
      cep: "02345-678",
      status: "ativo", 
      avaliacao: 4.5, 
      servicos: 89,
      especialidades: ["Película", "Manutenção"],
      dadosBancarios: {
        banco: "Itaú",
        agencia: "1234",
        conta: "56789-0",
        tipoConta: "Corrente",
        pix: "(11) 99999-2222"
      },
      dataCadastro: "20/08/2024",
      documentosVerificados: true,
      observacoes: ""
    },
    { 
      id: "3", 
      nome: "Carlos Lima", 
      telefone: "(11) 99999-3333", 
      email: "carlos@email.com",
      cpf: "345.678.901-22",
      rg: "34.567.890-1",
      endereco: "Rua Técnica, 300",
      cidade: "Campinas",
      estado: "SP",
      cep: "03456-789",
      status: "pendente", 
      avaliacao: 0, 
      servicos: 0,
      especialidades: ["Box", "Janelas"],
      dadosBancarios: {
        banco: "",
        agencia: "",
        conta: "",
        tipoConta: "",
        pix: ""
      },
      dataCadastro: "28/12/2025",
      documentosVerificados: false,
      observacoes: "Aguardando envio de documentos"
    },
    { 
      id: "4", 
      nome: "Marcos Oliveira", 
      telefone: "(11) 99999-4444", 
      email: "marcos@email.com",
      cpf: "456.789.012-33",
      rg: "45.678.901-2",
      endereco: "Rua dos Vidros, 400",
      cidade: "São Paulo",
      estado: "SP",
      cep: "04567-890",
      status: "ativo", 
      avaliacao: 4.9, 
      servicos: 234,
      especialidades: ["Box", "Espelhos", "Portas", "Película"],
      dadosBancarios: {
        banco: "Bradesco",
        agencia: "4567",
        conta: "89012-3",
        tipoConta: "Corrente",
        pix: "456.789.012-33"
      },
      dataCadastro: "10/03/2024",
      documentosVerificados: true,
      observacoes: "Prestador premium, alta demanda"
    },
  ]);

  const handleDelete = (id: string, nome: string) => {
    setPrestadores(prev => prev.filter(p => p.id !== id));
    toast.success(`Prestador "${nome}" removido com sucesso`);
  };

  const [editingPrestador, setEditingPrestador] = useState<typeof prestadores[0] | null>(null);

  // Trava o scroll do body quando o modal está aberto
  useEffect(() => {
    if (editingPrestador) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [editingPrestador]);

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

  const especialidadesDisponiveis = ["Box", "Espelhos", "Portas", "Película", "Manutenção", "Janelas", "Vidros Temperados"];

  const toggleEspecialidade = (esp: string) => {
    if (!editingPrestador) return;
    const novas = editingPrestador.especialidades.includes(esp)
      ? editingPrestador.especialidades.filter(e => e !== esp)
      : [...editingPrestador.especialidades, esp];
    setEditingPrestador({ ...editingPrestador, especialidades: novas });
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

      {/* Modal de Edição Completo */}
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
                      <Input
                        value={editingPrestador.nome}
                        onChange={(e) => setEditingPrestador({ ...editingPrestador, nome: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>CPF</Label>
                      <Input
                        value={editingPrestador.cpf}
                        onChange={(e) => setEditingPrestador({ ...editingPrestador, cpf: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>RG</Label>
                      <Input
                        value={editingPrestador.rg}
                        onChange={(e) => setEditingPrestador({ ...editingPrestador, rg: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Telefone</Label>
                      <Input
                        value={editingPrestador.telefone}
                        onChange={(e) => setEditingPrestador({ ...editingPrestador, telefone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={editingPrestador.email}
                        onChange={(e) => setEditingPrestador({ ...editingPrestador, email: e.target.value })}
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
                        value={editingPrestador.endereco}
                        onChange={(e) => setEditingPrestador({ ...editingPrestador, endereco: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Cidade</Label>
                      <Input
                        value={editingPrestador.cidade}
                        onChange={(e) => setEditingPrestador({ ...editingPrestador, cidade: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Estado</Label>
                      <Input
                        value={editingPrestador.estado}
                        onChange={(e) => setEditingPrestador({ ...editingPrestador, estado: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>CEP</Label>
                      <Input
                        value={editingPrestador.cep}
                        onChange={(e) => setEditingPrestador({ ...editingPrestador, cep: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={editingPrestador.status}
                        onValueChange={(value) => setEditingPrestador({ ...editingPrestador, status: value })}
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

                {/* Especialidades */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Especialidades
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {especialidadesDisponiveis.map((esp) => (
                      <button
                        key={esp}
                        onClick={() => toggleEspecialidade(esp)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          editingPrestador.especialidades.includes(esp)
                            ? "bg-primary text-white"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {esp}
                      </button>
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
                    <div>
                      <Label>Banco</Label>
                      <Input
                        value={editingPrestador.dadosBancarios.banco}
                        onChange={(e) => setEditingPrestador({ 
                          ...editingPrestador, 
                          dadosBancarios: { ...editingPrestador.dadosBancarios, banco: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Tipo de Conta</Label>
                      <Select
                        value={editingPrestador.dadosBancarios.tipoConta}
                        onValueChange={(value) => setEditingPrestador({ 
                          ...editingPrestador, 
                          dadosBancarios: { ...editingPrestador.dadosBancarios, tipoConta: value }
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
                        value={editingPrestador.dadosBancarios.agencia}
                        onChange={(e) => setEditingPrestador({ 
                          ...editingPrestador, 
                          dadosBancarios: { ...editingPrestador.dadosBancarios, agencia: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Conta</Label>
                      <Input
                        value={editingPrestador.dadosBancarios.conta}
                        onChange={(e) => setEditingPrestador({ 
                          ...editingPrestador, 
                          dadosBancarios: { ...editingPrestador.dadosBancarios, conta: e.target.value }
                        })}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Chave PIX</Label>
                      <Input
                        value={editingPrestador.dadosBancarios.pix}
                        onChange={(e) => setEditingPrestador({ 
                          ...editingPrestador, 
                          dadosBancarios: { ...editingPrestador.dadosBancarios, pix: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* Métricas e Status */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Métricas
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Avaliação</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={editingPrestador.avaliacao}
                        onChange={(e) => setEditingPrestador({ ...editingPrestador, avaliacao: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label>Serviços Realizados</Label>
                      <Input
                        type="number"
                        value={editingPrestador.servicos}
                        onChange={(e) => setEditingPrestador({ ...editingPrestador, servicos: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label>Data de Cadastro</Label>
                      <Input
                        value={editingPrestador.dataCadastro}
                        onChange={(e) => setEditingPrestador({ ...editingPrestador, dataCadastro: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <Checkbox
                        id="docs"
                        checked={editingPrestador.documentosVerificados}
                        onCheckedChange={(checked) => setEditingPrestador({ ...editingPrestador, documentosVerificados: !!checked })}
                      />
                      <Label htmlFor="docs" className="cursor-pointer">Documentos Verificados</Label>
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <Label>Observações</Label>
                  <Textarea
                    value={editingPrestador.observacoes}
                    onChange={(e) => setEditingPrestador({ ...editingPrestador, observacoes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-6 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setEditingPrestador(null)}>
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

export default Prestadores;