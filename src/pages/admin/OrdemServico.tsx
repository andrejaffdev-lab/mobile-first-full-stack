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
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";

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

  // Estado para loading do PDF
  const [gerandoPdf, setGerandoPdf] = useState(false);

  // Gerar certificado PDF
  const gerarCertificado = async () => {
    setGerandoPdf(true);
    try {
      const now = new Date().toISOString().slice(0, 16);
      setDataConclusao(now);
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      
      // ========== PÁGINA 1 - DADOS ==========
      
      // Header verde
      pdf.setFillColor(34, 139, 34);
      pdf.rect(0, 0, pageWidth, 35, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont(undefined, 'bold');
      pdf.text("CERTIFICADO DE MANUTENÇÃO", pageWidth / 2, 15, { align: 'center' });
      pdf.setFontSize(11);
      pdf.setFont(undefined, 'normal');
      pdf.text("Manutenção Anual de Box de Vidro", pageWidth / 2, 25, { align: 'center' });
      
      pdf.setTextColor(0, 0, 0);
      let yPos = 45;
      
      // ---- CONTRATANTE ----
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPos - 5, contentWidth, 8, 'F');
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text("DADOS DO CONTRATANTE", margin + 3, yPos);
      yPos += 10;
      
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.text(`Nome: ${cliente.nome || '___________________________'}`, margin, yPos);
      yPos += 6;
      pdf.text(`Telefone: ${cliente.telefone || '_______________'}`, margin, yPos);
      pdf.text(`E-mail: ${cliente.email || '________________________'}`, pageWidth / 2, yPos);
      yPos += 6;
      pdf.text(`Endereço: ${cliente.endereco || '_________________'}, Nº ${cliente.numero || '____'}`, margin, yPos);
      yPos += 6;
      pdf.text(`Complemento: ${cliente.complemento || '_________'}  Bairro: ${cliente.bairro || '_______________'}`, margin, yPos);
      yPos += 6;
      pdf.text(`Cidade: ${cliente.cidade || '_______________'} - ${cliente.estado || '__'}  CEP: ${cliente.cep || '________'}`, margin, yPos);
      yPos += 12;
      
      // ---- PRESTADOR ----
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPos - 5, contentWidth, 8, 'F');
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text("DADOS DO PRESTADOR DE SERVIÇO", margin + 3, yPos);
      yPos += 10;
      
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.text(`Nome: ${prestadorNome || '___________________________'}`, margin, yPos);
      pdf.text(`Telefone: ${prestadorTelefone || '_______________'}`, pageWidth / 2, yPos);
      yPos += 6;
      pdf.text(`Data do Contato: ${dataContato || '____/____/______'}`, margin, yPos);
      pdf.text(`Data do Agendamento: ${dataAgendamento || '____/____/______'}`, pageWidth / 2, yPos);
      yPos += 12;
      
      // ---- SERVIÇOS ----
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPos - 5, contentWidth, 8, 'F');
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text("SERVIÇOS CONTRATADOS", margin + 3, yPos);
      yPos += 10;
      
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      
      boxes.forEach((box, index) => {
        if (box.manutencaoSelecionada || box.peliculaSelecionada) {
          pdf.setFont(undefined, 'bold');
          pdf.text(`Box ${index + 1}: ${box.ambiente || 'Ambiente não informado'}`, margin, yPos);
          yPos += 5;
          pdf.setFont(undefined, 'normal');
          if (box.manutencaoSelecionada) {
            pdf.text(`   • Manutenção Anual .................................. ${formatCurrency(PRECO_MANUTENCAO)}`, margin, yPos);
            yPos += 5;
          }
          if (box.peliculaSelecionada) {
            pdf.text(`   • Troca de Película .................................. ${formatCurrency(PRECO_PELICULA)}`, margin, yPos);
            yPos += 5;
          }
          yPos += 3;
        }
      });
      
      yPos += 5;
      pdf.setFont(undefined, 'bold');
      pdf.setFontSize(12);
      pdf.text(`VALOR TOTAL: ${formatCurrency(calcularTotal())}`, margin, yPos);
      yPos += 15;
      
      // ---- PASSO A PASSO DO SERVIÇO ----
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPos - 5, contentWidth, 8, 'F');
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text("PASSO A PASSO DO SERVIÇO", margin + 3, yPos);
      yPos += 10;
      
      pdf.setFontSize(9);
      pdf.setFont(undefined, 'normal');
      const passos = [
        "1. Análise inicial do box e verificação das condições",
        "2. Desmontagem cuidadosa das peças (portas, vidros fixos)",
        "3. Limpeza completa dos trilhos e roldanas",
        "4. Troca de roldanas danificadas (se necessário)",
        "5. Verificação e análise do vidro (trincas, riscos)",
        "6. Aplicação de película (se contratado)",
        "7. Remontagem completa do box",
        "8. Teste de funcionamento e ajustes finais",
        "9. Limpeza final e entrega ao cliente"
      ];
      passos.forEach(passo => {
        pdf.text(passo, margin, yPos);
        yPos += 5;
      });
      
      yPos += 10;
      
      // ---- GARANTIA ----
      pdf.setFillColor(34, 139, 34);
      pdf.rect(margin, yPos - 3, contentWidth, 18, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      pdf.setFont(undefined, 'bold');
      pdf.text("GARANTIA DE 1 (UM) ANO", pageWidth / 2, yPos + 4, { align: 'center' });
      pdf.setFontSize(9);
      pdf.setFont(undefined, 'normal');
      pdf.text("Este certificado garante a manutenção realizada pelo período de 1 ano a partir da data de conclusão.", pageWidth / 2, yPos + 11, { align: 'center' });
      pdf.setTextColor(0, 0, 0);
      
      // ========== PÁGINA 2 - FOTOS E ASSINATURAS ==========
      pdf.addPage();
      
      // Header
      pdf.setFillColor(34, 139, 34);
      pdf.rect(0, 0, pageWidth, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text("REGISTRO FOTOGRÁFICO", pageWidth / 2, 13, { align: 'center' });
      pdf.setTextColor(0, 0, 0);
      
      yPos = 30;
      const fotoWidth = 55;
      const fotoHeight = 40;
      
      // Função para desenhar placeholder de foto
      const desenharFoto = (x: number, y: number, label: string) => {
        pdf.setFillColor(220, 220, 220);
        pdf.rect(x, y, fotoWidth, fotoHeight, 'F');
        pdf.setDrawColor(180, 180, 180);
        pdf.rect(x, y, fotoWidth, fotoHeight, 'S');
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text(label, x + fotoWidth / 2, y + fotoHeight / 2, { align: 'center' });
        pdf.setTextColor(0, 0, 0);
      };
      
      // Fotos - Linha 1
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'bold');
      pdf.text("Antes do Serviço:", margin, yPos);
      yPos += 5;
      desenharFoto(margin, yPos, "Foto Inicial Box");
      desenharFoto(margin + fotoWidth + 5, yPos, "Foto Roldanas");
      desenharFoto(margin + (fotoWidth + 5) * 2, yPos, "Foto Trilho");
      yPos += fotoHeight + 10;
      
      // Fotos - Linha 2
      pdf.text("Durante o Serviço:", margin, yPos);
      yPos += 5;
      desenharFoto(margin, yPos, "Análise Vidro");
      desenharFoto(margin + fotoWidth + 5, yPos, "Limpeza");
      desenharFoto(margin + (fotoWidth + 5) * 2, yPos, "Aplicação Película");
      yPos += fotoHeight + 10;
      
      // Fotos - Linha 3
      pdf.text("Após o Serviço:", margin, yPos);
      yPos += 5;
      desenharFoto(margin, yPos, "Foto Final Box");
      desenharFoto(margin + fotoWidth + 5, yPos, "Detalhe Porta");
      desenharFoto(margin + (fotoWidth + 5) * 2, yPos, "Vidro Fixo");
      yPos += fotoHeight + 15;
      
      // ---- ASSINATURAS ----
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPos - 3, contentWidth, 8, 'F');
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text("ASSINATURAS", margin + 3, yPos + 2);
      yPos += 15;
      
      const dataFormatada = new Date().toLocaleDateString('pt-BR');
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.text(`Data de Conclusão: ${dataFormatada}`, margin, yPos);
      yPos += 20;
      
      // Assinatura Prestador
      pdf.setFillColor(245, 245, 245);
      pdf.rect(margin, yPos, 80, 25, 'F');
      pdf.setDrawColor(180, 180, 180);
      pdf.rect(margin, yPos, 80, 25, 'S');
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text("Assinatura do Prestador", margin + 40, yPos + 12, { align: 'center' });
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.text("_______________________________", margin + 5, yPos + 30);
      pdf.text(prestadorNome || "Prestador de Serviço", margin + 5, yPos + 35);
      
      // Assinatura Cliente
      pdf.setFillColor(245, 245, 245);
      pdf.rect(pageWidth - margin - 80, yPos, 80, 25, 'F');
      pdf.rect(pageWidth - margin - 80, yPos, 80, 25, 'S');
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text("Assinatura do Contratante", pageWidth - margin - 40, yPos + 12, { align: 'center' });
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.text("_______________________________", pageWidth - margin - 75, yPos + 30);
      pdf.text(cliente.nome || "Contratante", pageWidth - margin - 75, yPos + 35);
      
      // Download do PDF para o prestador
      const nomeCliente = cliente.nome?.replace(/\s+/g, '_') || 'cliente';
      pdf.save(`Certificado_${nomeCliente}_${new Date().toISOString().slice(0,10)}.pdf`);
      
      // Enviar PDF por email para o cliente
      if (cliente.email) {
        try {
          const pdfBase64 = pdf.output('datauristring').split(',')[1];
          
          const { data, error } = await supabase.functions.invoke('send-certificado', {
            body: {
              clienteEmail: cliente.email,
              clienteNome: cliente.nome,
              prestadorNome: prestadorNome,
              pdfBase64: pdfBase64,
            },
          });
          
          if (error) {
            console.error('Erro ao enviar email:', error);
            toast.error("PDF baixado, mas erro ao enviar por email");
          } else {
            toast.success("PDF gerado e enviado por email para o cliente!");
          }
        } catch (emailError) {
          console.error('Erro ao enviar email:', emailError);
          toast.error("PDF baixado, mas erro ao enviar por email");
        }
      } else {
        toast.success("PDF gerado! (Email do cliente não informado)");
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error("Erro ao gerar PDF");
    } finally {
      setGerandoPdf(false);
    }
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
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/ordens")} className="text-primary-foreground hover:bg-primary-foreground/20">
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
                    "p-3 border-2 rounded-xl transition-all",
                    box.manutencaoSelecionada ? "border-success bg-success/5" : "border-border"
                  )}>
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        checked={box.manutencaoSelecionada}
                        onCheckedChange={() => toggleServico(index, 'manutencao')}
                        className="w-5 h-5 shrink-0"
                      />
                      <Wrench className="w-4 h-4 text-success shrink-0" />
                      <span className="font-medium text-sm">Manutenção Anual</span>
                      {box.manutencaoSelecionada && (
                        <span className="font-bold text-success ml-auto text-sm">{formatCurrency(PRECO_MANUTENCAO)}</span>
                      )}
                    </div>
                    {box.manutencaoSelecionada && (
                      <Button 
                        size="sm" 
                        className="bg-success hover:bg-success/90 mt-2 w-full"
                        onClick={() => setModalManutencao({ open: true, boxIndex: index })}
                      >
                        Abrir Checklist
                      </Button>
                    )}
                  </div>

                  {/* Troca de Película */}
                  <div className={cn(
                    "p-3 border-2 rounded-xl transition-all",
                    box.peliculaSelecionada ? "border-purple-500 bg-purple-50" : "border-border"
                  )}>
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        checked={box.peliculaSelecionada}
                        onCheckedChange={() => toggleServico(index, 'pelicula')}
                        className="w-5 h-5 shrink-0"
                      />
                      <Shield className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="font-medium text-sm">Troca de Película</span>
                      {box.peliculaSelecionada && (
                        <span className="font-bold text-purple-600 ml-auto text-sm">{formatCurrency(PRECO_PELICULA)}</span>
                      )}
                    </div>
                    {box.peliculaSelecionada && (
                      <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700 mt-2 w-full"
                        onClick={() => setModalPelicula({ open: true, boxIndex: index })}
                      >
                        Abrir Checklist
                      </Button>
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
            <div className="pt-4 border-t space-y-4">
              <div className="text-center">
                <span className="text-muted-foreground">Valor Total:</span>
                <div className="text-3xl font-bold text-primary">{formatCurrency(total)}</div>
              </div>
              <Button onClick={aprovarOrcamento} className="w-full bg-success hover:bg-success/90 text-lg py-6" disabled={orcamentoAprovado}>
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
            <Button onClick={gerarCertificado} disabled={gerandoPdf} className="bg-success hover:bg-success/90 text-lg px-8 py-6">
              <FileText className="w-5 h-5 mr-2" /> {gerandoPdf ? "Gerando..." : "Gerar PDF"}
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
