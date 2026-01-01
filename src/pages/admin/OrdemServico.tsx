import React, { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Camera, Wrench, Shield, Plus, Minus, Check, Star, FileText, CreditCard, Phone, Calendar, Clock, User, Mail, Home, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Preços configuráveis
const PRECO_MANUTENCAO = 250.00;
const PRECO_PELICULA = 180.00;

interface BoxData {
  id: number;
  ambiente: string;
  foto: string | null;
  manutencaoSelecionada: boolean;
  peliculaSelecionada: boolean;
  manutencaoConcluida: boolean;
  peliculaConcluida: boolean;
}

interface ClienteData {
  nome: string;
  telefone: string;
  email: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const OrdemServico: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados
  const [cliente, setCliente] = useState<ClienteData>({
    nome: "", telefone: "", email: "", cep: "", endereco: "",
    numero: "", complemento: "", bairro: "", cidade: "", estado: ""
  });
  const [qtdBox, setQtdBox] = useState(1);
  const [boxes, setBoxes] = useState<BoxData[]>([{
    id: 1, ambiente: "", foto: null,
    manutencaoSelecionada: false, peliculaSelecionada: false,
    manutencaoConcluida: false, peliculaConcluida: false
  }]);
  const [dataSolicitacao, setDataSolicitacao] = useState("");
  const [dataAgendamento, setDataAgendamento] = useState("");
  const [horaAgendamento, setHoraAgendamento] = useState("");
  const [dataContato, setDataContato] = useState("");
  const [prestadorNome, setPrestadorNome] = useState("");
  const [prestadorTelefone, setPrestadorTelefone] = useState("");
  const [orcamentoAprovado, setOrcamentoAprovado] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState("");
  const [dataPagamento, setDataPagamento] = useState("");
  const [dataConclusao, setDataConclusao] = useState("");
  const [avaliacao, setAvaliacao] = useState(0);
  
  // Modais
  const [modalManutencao, setModalManutencao] = useState<{ open: boolean; boxIndex: number }>({ open: false, boxIndex: 0 });
  const [modalPelicula, setModalPelicula] = useState<{ open: boolean; boxIndex: number }>({ open: false, boxIndex: 0 });

  // Atualiza boxes quando quantidade muda
  useEffect(() => {
    const newBoxes: BoxData[] = [];
    for (let i = 0; i < qtdBox; i++) {
      if (boxes[i]) {
        newBoxes.push(boxes[i]);
      } else {
        newBoxes.push({
          id: i + 1, ambiente: "", foto: null,
          manutencaoSelecionada: false, peliculaSelecionada: false,
          manutencaoConcluida: false, peliculaConcluida: false
        });
      }
    }
    setBoxes(newBoxes);
  }, [qtdBox]);

  // Calcula total do orçamento
  const calcularTotal = () => {
    let total = 0;
    boxes.forEach(box => {
      if (box.manutencaoSelecionada) total += PRECO_MANUTENCAO;
      if (box.peliculaSelecionada) total += PRECO_PELICULA;
    });
    return total;
  };

  // Calcular rota
  const calcularRota = () => {
    const endereco = `${cliente.endereco}, ${cliente.numero}, ${cliente.bairro}, ${cliente.cidade} - ${cliente.estado}, ${cliente.cep}`;
    if (!cliente.endereco || !cliente.numero || !cliente.cidade) {
      toast.error("Preencha o endereço completo para calcular a rota");
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(endereco)}`;
    window.open(url, '_blank');
  };

  // Toggle serviço do box
  const toggleServico = (boxIndex: number, tipo: 'manutencao' | 'pelicula') => {
    setBoxes(prev => prev.map((box, i) => {
      if (i === boxIndex) {
        if (tipo === 'manutencao') {
          return { ...box, manutencaoSelecionada: !box.manutencaoSelecionada };
        } else {
          return { ...box, peliculaSelecionada: !box.peliculaSelecionada };
        }
      }
      return box;
    }));
  };

  // Aprovar orçamento
  const aprovarOrcamento = () => {
    if (calcularTotal() === 0) {
      toast.error("Selecione pelo menos um serviço");
      return;
    }
    setOrcamentoAprovado(true);
    toast.success("Orçamento aprovado!");
  };

  // Confirmar pagamento
  const confirmarPagamento = () => {
    if (!formaPagamento) {
      toast.error("Selecione a forma de pagamento");
      return;
    }
    if (!dataPagamento) {
      toast.error("Informe a data do pagamento");
      return;
    }
    toast.success("Pagamento confirmado!");
  };

  // Gerar certificado
  const gerarCertificado = () => {
    const now = new Date().toISOString().slice(0, 16);
    setDataConclusao(now);
    toast.success("Certificado gerado e enviado por e-mail!");
  };

  // Salvar ordem (primeira vez preenche data de solicitação)
  const salvarOrdem = () => {
    if (!dataSolicitacao) {
      setDataSolicitacao(new Date().toISOString().slice(0, 16));
    }
    toast.success("Ordem de serviço salva!");
  };

  // Handle foto upload
  const handleFotoUpload = (boxIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBoxes(prev => prev.map((box, i) => {
          if (i === boxIndex) {
            return { ...box, foto: event.target?.result as string };
          }
          return box;
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const total = calcularTotal();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-primary-foreground hover:bg-primary-foreground/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold">Ordem de Serviço</h1>
            <p className="text-xs opacity-80">Manutenção de Box e Película</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pb-32 space-y-4">
        {/* 1. Dados do Cliente */}
        <Card>
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-4 h-4" /> 1. Dados do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nome Completo</Label>
                <Input placeholder="Nome do cliente" value={cliente.nome} onChange={(e) => setCliente({...cliente, nome: e.target.value})} />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input placeholder="(00) 00000-0000" value={cliente.telefone} onChange={(e) => setCliente({...cliente, telefone: e.target.value})} />
              </div>
              <div>
                <Label>E-mail</Label>
                <Input type="email" placeholder="email@exemplo.com" value={cliente.email} onChange={(e) => setCliente({...cliente, email: e.target.value})} />
              </div>
              <div>
                <Label>CEP</Label>
                <Input placeholder="00000-000" value={cliente.cep} onChange={(e) => setCliente({...cliente, cep: e.target.value})} />
              </div>
              <div className="md:col-span-2 grid grid-cols-4 gap-2">
                <div className="col-span-3">
                  <Label>Endereço</Label>
                  <Input placeholder="Rua, Avenida..." value={cliente.endereco} onChange={(e) => setCliente({...cliente, endereco: e.target.value})} />
                </div>
                <div>
                  <Label>Nº</Label>
                  <Input placeholder="Nº" value={cliente.numero} onChange={(e) => setCliente({...cliente, numero: e.target.value})} />
                </div>
              </div>
              <div>
                <Label>Complemento</Label>
                <Input placeholder="Apto, Bloco..." value={cliente.complemento} onChange={(e) => setCliente({...cliente, complemento: e.target.value})} />
              </div>
              <div>
                <Label>Bairro</Label>
                <Input placeholder="Bairro" value={cliente.bairro} onChange={(e) => setCliente({...cliente, bairro: e.target.value})} />
              </div>
              <div>
                <Label>Cidade</Label>
                <Input placeholder="Cidade" value={cliente.cidade} onChange={(e) => setCliente({...cliente, cidade: e.target.value})} />
              </div>
              <div>
                <Label>Estado</Label>
                <Input placeholder="UF" value={cliente.estado} onChange={(e) => setCliente({...cliente, estado: e.target.value})} />
              </div>
            </div>
            <Button onClick={calcularRota} className="bg-cyan-600 hover:bg-cyan-700">
              <MapPin className="w-4 h-4 mr-2" /> Calcular Rota
            </Button>
          </CardContent>
        </Card>

        {/* 2. Quantidade de Box */}
        <Card>
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Building className="w-4 h-4" /> 2. Quantidade de Box
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Label>Quantos boxes serão atendidos?</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setQtdBox(Math.max(1, qtdBox - 1))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-bold text-lg">{qtdBox}</span>
                <Button variant="outline" size="icon" onClick={() => setQtdBox(Math.min(10, qtdBox + 1))}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Boxes Dinâmicos */}
        {boxes.map((box, index) => (
          <Card key={index} className="border-2">
            <CardHeader className="bg-muted pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                Box {index + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome do Ambiente</Label>
                  <Input 
                    placeholder="Ex: Banheiro Suíte, Banheiro Social..."
                    value={box.ambiente}
                    onChange={(e) => setBoxes(prev => prev.map((b, i) => i === index ? {...b, ambiente: e.target.value} : b))}
                  />
                </div>
                <div>
                  <Label>Foto do Box</Label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      id={`foto-box-${index}`}
                      onChange={(e) => handleFotoUpload(index, e)}
                    />
                    <label
                      htmlFor={`foto-box-${index}`}
                      className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <Camera className="w-6 h-6 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Clique para foto</span>
                    </label>
                    {box.foto && (
                      <img src={box.foto} alt="Preview" className="mt-2 rounded-lg max-h-32 object-cover" />
                    )}
                  </div>
                </div>
              </div>

              {/* Seleção de Serviços */}
              <div>
                <Label className="mb-3 block">Selecione os serviços:</Label>
                <div className="space-y-3">
                  {/* Manutenção Anual */}
                  <div className={cn(
                    "flex items-center gap-3 p-4 border-2 rounded-xl transition-all",
                    box.manutencaoSelecionada ? "border-success bg-success/5" : "border-border"
                  )}>
                    <Checkbox 
                      checked={box.manutencaoSelecionada}
                      onCheckedChange={() => toggleServico(index, 'manutencao')}
                      className="w-5 h-5"
                    />
                    <div className="flex-1 flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-success" />
                      <span className="font-medium">Manutenção Anual</span>
                    </div>
                    {box.manutencaoSelecionada && (
                      <>
                        <span className="font-bold text-success">{formatCurrency(PRECO_MANUTENCAO)}</span>
                        <Button 
                          size="sm" 
                          className="bg-success hover:bg-success/90"
                          onClick={() => setModalManutencao({ open: true, boxIndex: index })}
                        >
                          Checklist
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Troca de Película */}
                  <div className={cn(
                    "flex items-center gap-3 p-4 border-2 rounded-xl transition-all",
                    box.peliculaSelecionada ? "border-purple-500 bg-purple-50" : "border-border"
                  )}>
                    <Checkbox 
                      checked={box.peliculaSelecionada}
                      onCheckedChange={() => toggleServico(index, 'pelicula')}
                      className="w-5 h-5"
                    />
                    <div className="flex-1 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">Troca de Película</span>
                    </div>
                    {box.peliculaSelecionada && (
                      <>
                        <span className="font-bold text-purple-600">{formatCurrency(PRECO_PELICULA)}</span>
                        <Button 
                          size="sm" 
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => setModalPelicula({ open: true, boxIndex: index })}
                        >
                          Checklist
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Orçamento Total */}
        <Card className="border-2 border-primary">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4" /> Orçamento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {/* Resumo dos serviços */}
            <div className="space-y-2 mb-4">
              {boxes.map((box, index) => (
                <React.Fragment key={index}>
                  {box.manutencaoSelecionada && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-success" />
                        Manutenção Anual - {box.ambiente || `Box ${index + 1}`}
                      </span>
                      <span className="font-bold">{formatCurrency(PRECO_MANUTENCAO)}</span>
                    </div>
                  )}
                  {box.peliculaSelecionada && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-600" />
                        Troca de Película - {box.ambiente || `Box ${index + 1}`}
                      </span>
                      <span className="font-bold">{formatCurrency(PRECO_PELICULA)}</span>
                    </div>
                  )}
                </React.Fragment>
              ))}
              {total === 0 && (
                <p className="text-center text-muted-foreground py-4">Nenhum serviço selecionado</p>
              )}
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                <span className="text-muted-foreground">Valor Total:</span>
                <div className="text-3xl font-bold text-primary">{formatCurrency(total)}</div>
              </div>
              <Button onClick={aprovarOrcamento} className="bg-success hover:bg-success/90 text-lg px-8 py-6" disabled={orcamentoAprovado}>
                <Check className="w-5 h-5 mr-2" />
                {orcamentoAprovado ? "Aprovado" : "Aprovar Orçamento"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Seção de Pagamento */}
        {orcamentoAprovado && (
          <Card className="border-2 border-warning animate-fade-in">
            <CardHeader className="bg-warning text-warning-foreground rounded-t-lg pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="w-4 h-4" /> Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="bg-success/10 p-4 rounded-lg text-success font-medium flex items-center gap-2">
                <Check className="w-5 h-5" />
                Orçamento aprovado! Preencha os dados de pagamento.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Valor Total a Pagar</Label>
                  <Input value={formatCurrency(total)} readOnly className="bg-muted text-xl font-bold text-success" />
                </div>
                <div>
                  <Label>Forma de Pagamento</Label>
                  <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                      <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                      <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                      <SelectItem value="boleto">Boleto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Data do Pagamento</Label>
                  <Input type="date" value={dataPagamento} onChange={(e) => setDataPagamento(e.target.value)} />
                </div>
              </div>
              <Button onClick={confirmarPagamento} className="w-full bg-success hover:bg-success/90">
                <Check className="w-5 h-5 mr-2" /> Confirmar Pagamento
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Datas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="bg-primary text-primary-foreground rounded-t-lg pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="w-4 h-4" /> 3. Data da Solicitação
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Input type="datetime-local" value={dataSolicitacao} readOnly className="bg-muted" />
              <p className="text-xs text-muted-foreground mt-1">Preenchido automaticamente ao salvar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-primary text-primary-foreground rounded-t-lg pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="w-4 h-4" /> 4. Agendamento
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <div>
                <Label>Data</Label>
                <Input type="date" value={dataAgendamento} onChange={(e) => setDataAgendamento(e.target.value)} />
              </div>
              <div>
                <Label>Horário</Label>
                <Input type="time" value={horaAgendamento} onChange={(e) => setHoraAgendamento(e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prestador */}
        <Card>
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Phone className="w-4 h-4" /> 5. Contato do Prestador
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Data do Contato</Label>
                <Input type="date" value={dataContato} onChange={(e) => setDataContato(e.target.value)} />
              </div>
              <div>
                <Label>Nome do Prestador</Label>
                <Input placeholder="Nome" value={prestadorNome} onChange={(e) => setPrestadorNome(e.target.value)} />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input placeholder="(00) 00000-0000" value={prestadorTelefone} onChange={(e) => setPrestadorTelefone(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gerar Certificado */}
        <Card>
          <CardHeader className="bg-success text-success-foreground rounded-t-lg pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4" /> Gerar Certificado
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground mb-4">
              Gere o PDF do Certificado de Manutenção Anual de Box com todas as informações, fotos e garantia de 1 ano.
            </p>
            <Button onClick={gerarCertificado} className="bg-success hover:bg-success/90 text-lg px-8 py-6">
              <FileText className="w-5 h-5 mr-2" /> Gerar PDF e Enviar por E-mail
            </Button>
          </CardContent>
        </Card>

        {/* Data de Conclusão */}
        <Card>
          <CardHeader className="bg-muted pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-4 h-4" /> Data de Conclusão
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Input type="datetime-local" value={dataConclusao} readOnly className="bg-muted" />
            <p className="text-xs text-muted-foreground mt-1">Preenchida após envio do certificado</p>
          </CardContent>
        </Card>

        {/* Avaliação */}
        <Card>
          <CardHeader className="bg-warning text-warning-foreground rounded-t-lg pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="w-4 h-4" /> Avaliação do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground mb-4">Como o cliente avalia o serviço prestado?</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setAvaliacao(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "w-10 h-10",
                      star <= avaliacao ? "text-warning fill-warning" : "text-muted-foreground"
                    )}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {avaliacao === 0 ? "Clique nas estrelas para avaliar" : `Avaliação: ${avaliacao} estrela${avaliacao > 1 ? 's' : ''}`}
            </p>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-4 justify-center">
          <Button variant="outline" size="lg" onClick={() => window.print()}>
            Imprimir
          </Button>
          <Button size="lg" onClick={salvarOrdem}>
            Salvar Ordem
          </Button>
        </div>
      </div>

      {/* Modal Manutenção Anual */}
      <Dialog open={modalManutencao.open} onOpenChange={(open) => setModalManutencao({ ...modalManutencao, open })}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-success">
              <Wrench className="w-5 h-5" /> Manutenção Anual - Box {modalManutencao.boxIndex + 1}
            </DialogTitle>
          </DialogHeader>
          <ManutencaoChecklist boxIndex={modalManutencao.boxIndex} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalManutencao({ ...modalManutencao, open: false })}>
              Fechar
            </Button>
            <Button className="bg-success hover:bg-success/90" onClick={() => {
              setBoxes(prev => prev.map((b, i) => i === modalManutencao.boxIndex ? {...b, manutencaoConcluida: true} : b));
              setModalManutencao({ ...modalManutencao, open: false });
              toast.success("Manutenção finalizada!");
            }}>
              <Check className="w-4 h-4 mr-2" /> Finalizar Manutenção
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Película */}
      <Dialog open={modalPelicula.open} onOpenChange={(open) => setModalPelicula({ ...modalPelicula, open })}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-600">
              <Shield className="w-5 h-5" /> Colocação de Película - Box {modalPelicula.boxIndex + 1}
            </DialogTitle>
          </DialogHeader>
          <PeliculaChecklist boxIndex={modalPelicula.boxIndex} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalPelicula({ ...modalPelicula, open: false })}>
              Fechar
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => {
              setBoxes(prev => prev.map((b, i) => i === modalPelicula.boxIndex ? {...b, peliculaConcluida: true} : b));
              setModalPelicula({ ...modalPelicula, open: false });
              toast.success("Película finalizada!");
            }}>
              <Check className="w-4 h-4 mr-2" /> Finalizar Película
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Checklist de Manutenção
const ManutencaoChecklist: React.FC<{ boxIndex: number }> = ({ boxIndex }) => {
  const [checks, setChecks] = useState<boolean[]>(Array(6).fill(false));
  
  const items = [
    { titulo: "Foto Inicial do Box", descricao: "Tire uma foto inicial antes da manutenção", hasPhoto: true },
    { titulo: "Análise Geral do Box", descricao: "Analise o funcionamento e estado geral", hasTextarea: true },
    { titulo: "Troca das Roldanas", descricao: "Troque as roldanas e tire foto das novas", hasPhoto: true },
    { titulo: "Análise do Trilho", descricao: "Verifique fixações, batedores e faça limpeza", hasPhoto: true },
    { titulo: "Estado Geral do Vidro", descricao: "Verifique trincas e necessidade de substituição", hasPhoto: true, hasOptions: true },
    { titulo: "Remontagem Final", descricao: "Faça a remontagem e tire foto final", hasPhoto: true },
  ];

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className={cn(
          "p-4 border rounded-xl",
          checks[idx] ? "bg-success/5 border-success" : "border-border"
        )}>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center text-sm font-bold">
              {idx + 1}
            </span>
            <span className="font-bold flex-1">{item.titulo}</span>
            <div className="flex items-center gap-2">
              <Checkbox checked={checks[idx]} onCheckedChange={(checked) => {
                const newChecks = [...checks];
                newChecks[idx] = checked as boolean;
                setChecks(newChecks);
              }} />
              <span className="text-sm">Concluído</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{item.descricao}</p>
          
          {item.hasTextarea && (
            <Textarea placeholder="Descreva em que estado encontrou o box..." className="mb-3" />
          )}
          
          {item.hasOptions && (
            <div className="flex gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Checkbox id={`trincas-${boxIndex}-${idx}`} />
                <Label htmlFor={`trincas-${boxIndex}-${idx}`} className="text-destructive">Existem trincas?</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id={`substituir-${boxIndex}-${idx}`} />
                <Label htmlFor={`substituir-${boxIndex}-${idx}`} className="text-warning">Necessário substituição?</Label>
              </div>
            </div>
          )}
          
          {item.hasPhoto && (
            <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
              <Camera className="w-6 h-6 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-1">Clique para tirar foto</p>
            </div>
          )}
        </div>
      ))}
      
      {/* Assinatura */}
      <div className="p-4 border rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center text-sm">✍️</span>
          <span className="font-bold">Assinatura do Prestador</span>
        </div>
        <div className="border-2 rounded-lg h-32 bg-muted/50 flex items-center justify-center text-muted-foreground">
          Área de assinatura
        </div>
      </div>
    </div>
  );
};

// Checklist de Película
const PeliculaChecklist: React.FC<{ boxIndex: number }> = ({ boxIndex }) => {
  const [checks, setChecks] = useState<boolean[]>(Array(7).fill(false));
  
  const items = [
    { titulo: "Foto Geral do Box", descricao: "Tire uma foto geral do box", hasPhoto: true },
    { titulo: "Verificar Condições do Vidro", descricao: "Verifique as condições gerais do vidro" },
    { titulo: "Limpeza do Vidro", descricao: "Faça uma limpeza completa no vidro" },
    { titulo: "Retirar Porta", descricao: "Retire a porta, roldanas e puxador" },
    { titulo: "Aplicar Película na Porta", descricao: "Aplique a película e recoloque roldanas e puxador" },
    { titulo: "Aplicar Película no Vidro Fixo", descricao: "Aplique a película no vidro fixo", hasPhoto: true },
    { titulo: "Remontagem Final", descricao: "Remonte o box e tire foto final", hasPhoto: true },
  ];

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className={cn(
          "p-4 border rounded-xl",
          checks[idx] ? "bg-purple-50 border-purple-500" : "border-border"
        )}>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
              {idx + 1}
            </span>
            <span className="font-bold flex-1">{item.titulo}</span>
            <div className="flex items-center gap-2">
              <Checkbox checked={checks[idx]} onCheckedChange={(checked) => {
                const newChecks = [...checks];
                newChecks[idx] = checked as boolean;
                setChecks(newChecks);
              }} />
              <span className="text-sm">Concluído</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{item.descricao}</p>
          
          {item.hasPhoto && (
            <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <Camera className="w-6 h-6 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-1">Clique para tirar foto</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrdemServico;
