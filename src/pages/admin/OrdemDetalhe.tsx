import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  Camera,
  CheckCircle2,
  Circle,
  Navigation,
  Star,
  FileText,
  DollarSign,
  Send,
  Wrench,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrdemServico {
  id: string;
  cliente_nome: string;
  cliente_telefone: string | null;
  cliente_email: string | null;
  cliente_cep: string | null;
  cliente_endereco: string | null;
  cliente_numero: string | null;
  cliente_complemento: string | null;
  cliente_bairro: string | null;
  cliente_cidade: string | null;
  cliente_estado: string | null;
  manutencao_anual: boolean;
  colocacao_pelicula: boolean;
  local_box: string | null;
  foto_box_inicial: string | null;
  data_solicitacao: string;
  data_agendamento: string | null;
  data_contato_prestador: string | null;
  data_conclusao: string | null;
  prestador_id: string | null;
  prestador_nome: string | null;
  prestador_telefone: string | null;
  manut_foto_inicial: string | null;
  manut_analise_texto: string | null;
  manut_analise_concluida: boolean;
  manut_roldanas_trocadas: boolean;
  manut_foto_roldanas: string | null;
  manut_trilho_analisado: boolean;
  manut_foto_trilho: string | null;
  manut_vidro_analisado: boolean;
  manut_vidro_trincas: boolean;
  manut_vidro_substituir: boolean;
  manut_foto_vidro: string | null;
  manut_remontagem_concluida: boolean;
  manut_foto_final: string | null;
  manut_assinatura_prestador: string | null;
  manut_concluida: boolean;
  pelicula_foto_geral: string | null;
  pelicula_condicoes_verificadas: boolean;
  pelicula_limpeza_feita: boolean;
  pelicula_porta_retirada: boolean;
  pelicula_porta_aplicada: boolean;
  pelicula_vidro_fixo_aplicado: boolean;
  pelicula_foto_porta: string | null;
  pelicula_foto_vidro_fixo: string | null;
  pelicula_remontagem_concluida: boolean;
  pelicula_foto_final: string | null;
  pelicula_concluida: boolean;
  certificado_gerado: boolean;
  certificado_enviado: boolean;
  certificado_pdf_url: string | null;
  valor_manutencao: number | null;
  valor_pelicula: number | null;
  valor_total: number | null;
  data_pagamento: string | null;
  forma_pagamento: string | null;
  avaliacao_cliente: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const OrdemDetalhe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ordem, setOrdem] = useState<OrdemServico | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enviandoCertificado, setEnviandoCertificado] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPhotoField, setCurrentPhotoField] = useState<string>("");

  const isUuid = (value: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

  const createNovaOrdemAndRedirect = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("ordens_servico")
        .insert({
          cliente_nome: "Novo Cliente",
        })
        .select("id")
        .single();

      if (error) throw error;

      navigate(`/admin/ordem/${data.id}`, { replace: true });
    } catch (error: any) {
      console.error("Erro ao criar nova ordem:", error);
      toast.error("Erro ao criar nova ordem");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    // /admin/ordem/nova -> cria a ordem no backend e redireciona
    if (id === "nova") {
      createNovaOrdemAndRedirect();
      return;
    }

    // Evita erro 400 quando o id não é UUID (ex: "1")
    if (!isUuid(id)) {
      setOrdem(null);
      setLoading(false);
      toast.error("ID da ordem inválido");
      return;
    }

    fetchOrdem(id);
  }, [id]);

  const fetchOrdem = async (ordemId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("ordens_servico")
        .select("*")
        .eq("id", ordemId)
        .maybeSingle();

      if (error) throw error;
      setOrdem((data as OrdemServico) ?? null);
    } catch (error: any) {
      console.error("Erro ao buscar ordem:", error);
      toast.error("Erro ao carregar ordem");
      setOrdem(null);
    } finally {
      setLoading(false);
    }
  };

  const saveOrdem = async (updates: Partial<OrdemServico>) => {
    if (!ordem) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("ordens_servico")
        .update(updates)
        .eq("id", ordem.id);

      if (error) throw error;
      setOrdem({ ...ordem, ...updates });
      toast.success("Salvo com sucesso!");
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoCapture = async (field: string) => {
    setCurrentPhotoField(field);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !ordem) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${ordem.id}/${currentPhotoField}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("ordem-fotos")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("ordem-fotos")
        .getPublicUrl(fileName);

      await saveOrdem({ [currentPhotoField]: urlData.publicUrl } as any);
      toast.success("Foto salva!");
    } catch (error: any) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Erro ao salvar foto");
    }

    e.target.value = "";
  };

  const calcularRota = () => {
    if (!ordem?.cliente_endereco) {
      toast.error("Endereço não disponível");
      return;
    }
    const endereco = `${ordem.cliente_endereco}, ${ordem.cliente_numero || ""}, ${ordem.cliente_bairro || ""}, ${ordem.cliente_cidade || ""} - ${ordem.cliente_estado || ""}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(endereco)}`;
    window.open(url, "_blank");
  };

  const enviarCertificado = async () => {
    if (!ordem) return;
    
    if (!ordem.cliente_email) {
      toast.error("Email do cliente não informado");
      return;
    }

    setEnviandoCertificado(true);
    try {
      const response = await supabase.functions.invoke("send-certificado", {
        body: {
          ordemId: ordem.id,
          clienteEmail: ordem.cliente_email,
          adminEmail: "admin@exemplo.com", // TODO: pegar email do admin logado
        },
      });

      if (response.error) throw response.error;

      toast.success("Certificado enviado com sucesso!");
      await fetchOrdem(ordem.id); // Recarregar para atualizar status
    } catch (error: any) {
      console.error("Erro ao enviar certificado:", error);
      toast.error("Erro ao enviar certificado");
    } finally {
      setEnviandoCertificado(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => saveOrdem({ avaliacao_cliente: star })}
            className="focus:outline-none"
          >
            <Star
              className={cn(
                "w-8 h-8 transition-colors",
                (ordem?.avaliacao_cliente || 0) >= star
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!ordem) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <p className="text-muted-foreground mb-4">Ordem não encontrada</p>
        <Button onClick={() => navigate("/admin/ordens")}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="mobile-container min-h-screen bg-background pb-32">
      {/* Hidden file input for camera/file upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/ordens")}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-foreground font-display">
              Ordem de Serviço
            </h1>
            <p className="text-xs text-muted-foreground">#{ordem.id.slice(0, 8)}</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* 1. Dados do Cliente */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <h2 className="text-sm font-semibold text-primary flex items-center gap-2 mb-4">
            <User className="w-4 h-4" />
            1. Dados do Cliente
          </h2>
          
          <div className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input
                value={ordem.cliente_nome}
                onChange={(e) => setOrdem({ ...ordem, cliente_nome: e.target.value })}
                onBlur={() => saveOrdem({ cliente_nome: ordem.cliente_nome })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Telefone</Label>
                <Input
                  value={ordem.cliente_telefone || ""}
                  onChange={(e) => setOrdem({ ...ordem, cliente_telefone: e.target.value })}
                  onBlur={() => saveOrdem({ cliente_telefone: ordem.cliente_telefone })}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={ordem.cliente_email || ""}
                  onChange={(e) => setOrdem({ ...ordem, cliente_email: e.target.value })}
                  onBlur={() => saveOrdem({ cliente_email: ordem.cliente_email })}
                />
              </div>
            </div>

            <div>
              <Label>CEP</Label>
              <Input
                value={ordem.cliente_cep || ""}
                onChange={(e) => setOrdem({ ...ordem, cliente_cep: e.target.value })}
                onBlur={() => saveOrdem({ cliente_cep: ordem.cliente_cep })}
                placeholder="00000-000"
              />
            </div>

            <div>
              <Label>Endereço</Label>
              <Input
                value={ordem.cliente_endereco || ""}
                onChange={(e) => setOrdem({ ...ordem, cliente_endereco: e.target.value })}
                onBlur={() => saveOrdem({ cliente_endereco: ordem.cliente_endereco })}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>Número</Label>
                <Input
                  value={ordem.cliente_numero || ""}
                  onChange={(e) => setOrdem({ ...ordem, cliente_numero: e.target.value })}
                  onBlur={() => saveOrdem({ cliente_numero: ordem.cliente_numero })}
                />
              </div>
              <div className="col-span-2">
                <Label>Complemento</Label>
                <Input
                  value={ordem.cliente_complemento || ""}
                  onChange={(e) => setOrdem({ ...ordem, cliente_complemento: e.target.value })}
                  onBlur={() => saveOrdem({ cliente_complemento: ordem.cliente_complemento })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Bairro</Label>
                <Input
                  value={ordem.cliente_bairro || ""}
                  onChange={(e) => setOrdem({ ...ordem, cliente_bairro: e.target.value })}
                  onBlur={() => saveOrdem({ cliente_bairro: ordem.cliente_bairro })}
                />
              </div>
              <div>
                <Label>Cidade</Label>
                <Input
                  value={ordem.cliente_cidade || ""}
                  onChange={(e) => setOrdem({ ...ordem, cliente_cidade: e.target.value })}
                  onBlur={() => saveOrdem({ cliente_cidade: ordem.cliente_cidade })}
                />
              </div>
            </div>

            <div>
              <Label>Estado</Label>
              <Input
                value={ordem.cliente_estado || ""}
                onChange={(e) => setOrdem({ ...ordem, cliente_estado: e.target.value })}
                onBlur={() => saveOrdem({ cliente_estado: ordem.cliente_estado })}
                maxLength={2}
                placeholder="SP"
              />
            </div>

            <Button onClick={calcularRota} className="w-full gap-2" variant="outline">
              <Navigation className="w-4 h-4" />
              Calcular Rota
            </Button>
          </div>
        </motion.section>

        {/* 2. Descrição / Tipo de Serviço */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <h2 className="text-sm font-semibold text-primary flex items-center gap-2 mb-4">
            <Wrench className="w-4 h-4" />
            2. Descrição do Serviço
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="manutencao"
                checked={ordem.manutencao_anual}
                onCheckedChange={(checked) => {
                  setOrdem({ ...ordem, manutencao_anual: !!checked });
                  saveOrdem({ manutencao_anual: !!checked });
                }}
              />
              <label htmlFor="manutencao" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Manutenção Anual
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="pelicula"
                checked={ordem.colocacao_pelicula}
                onCheckedChange={(checked) => {
                  setOrdem({ ...ordem, colocacao_pelicula: !!checked });
                  saveOrdem({ colocacao_pelicula: !!checked });
                }}
              />
              <label htmlFor="pelicula" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Colocação de Película
              </label>
            </div>

            <div>
              <Label>Local onde fica o Box</Label>
              <Input
                value={ordem.local_box || ""}
                onChange={(e) => setOrdem({ ...ordem, local_box: e.target.value })}
                onBlur={() => saveOrdem({ local_box: ordem.local_box })}
                placeholder="Ex: Banheiro da suíte principal"
              />
            </div>
          </div>
        </motion.section>

        {/* 3. Foto do Box */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <h2 className="text-sm font-semibold text-primary flex items-center gap-2 mb-4">
            <Camera className="w-4 h-4" />
            3. Foto do Box
          </h2>
          
          <div className="space-y-4">
            {ordem.foto_box_inicial ? (
              <div className="relative">
                <img
                  src={ordem.foto_box_inicial}
                  alt="Foto do Box"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute bottom-2 right-2"
                  onClick={() => handlePhotoCapture("foto_box_inicial")}
                >
                  <Camera className="w-4 h-4 mr-1" />
                  Trocar
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full h-32 border-dashed"
                onClick={() => handlePhotoCapture("foto_box_inicial")}
              >
                <Camera className="w-6 h-6 mr-2" />
                Tirar Foto do Box
              </Button>
            )}
          </div>
        </motion.section>

        {/* 4. Data de Solicitação */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <h2 className="text-sm font-semibold text-primary flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4" />
            4. Solicitação
          </h2>
          <p className="text-sm text-muted-foreground">
            Data automática: {format(new Date(ordem.data_solicitacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
        </motion.section>

        {/* 5. Agendamento */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <h2 className="text-sm font-semibold text-primary flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4" />
            5. Agendamento
          </h2>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !ordem.data_agendamento && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {ordem.data_agendamento
                  ? format(new Date(ordem.data_agendamento), "PPP", { locale: ptBR })
                  : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={ordem.data_agendamento ? new Date(ordem.data_agendamento) : undefined}
                onSelect={(date) => {
                  if (date) {
                    const dateStr = format(date, "yyyy-MM-dd");
                    setOrdem({ ...ordem, data_agendamento: dateStr });
                    saveOrdem({ data_agendamento: dateStr });
                  }
                }}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </motion.section>

        {/* 6. Data do Contato do Prestador */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <h2 className="text-sm font-semibold text-primary flex items-center gap-2 mb-4">
            <Phone className="w-4 h-4" />
            6. Contato do Prestador
          </h2>
          
          <div className="space-y-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !ordem.data_contato_prestador && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {ordem.data_contato_prestador
                    ? format(new Date(ordem.data_contato_prestador), "PPP", { locale: ptBR })
                    : "Data do contato"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={ordem.data_contato_prestador ? new Date(ordem.data_contato_prestador) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const dateStr = format(date, "yyyy-MM-dd");
                      setOrdem({ ...ordem, data_contato_prestador: dateStr });
                      saveOrdem({ data_contato_prestador: dateStr });
                    }
                  }}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome do Prestador</Label>
                <Input
                  value={ordem.prestador_nome || ""}
                  onChange={(e) => setOrdem({ ...ordem, prestador_nome: e.target.value })}
                  onBlur={() => saveOrdem({ prestador_nome: ordem.prestador_nome })}
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input
                  value={ordem.prestador_telefone || ""}
                  onChange={(e) => setOrdem({ ...ordem, prestador_telefone: e.target.value })}
                  onBlur={() => saveOrdem({ prestador_telefone: ordem.prestador_telefone })}
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Separador visual */}
        <div className="border-t-4 border-primary/20 my-8" />

        {/* CHECKLIST MANUTENÇÃO ANUAL */}
        {ordem.manutencao_anual && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border-2 border-primary/30 p-4"
          >
            <h2 className="text-lg font-bold text-primary flex items-center gap-2 mb-6">
              <Wrench className="w-5 h-5" />
              Checklist - Manutenção Anual
            </h2>
            
            <div className="space-y-6">
              {/* 1. Foto inicial */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  {ordem.manut_foto_inicial ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="font-medium">1. Foto Inicial do Box</span>
                </div>
                
                {ordem.manut_foto_inicial ? (
                  <div className="relative">
                    <img src={ordem.manut_foto_inicial} alt="Foto inicial" className="w-full h-32 object-cover rounded-lg" />
                    <Button size="sm" variant="secondary" className="absolute bottom-2 right-2" onClick={() => handlePhotoCapture("manut_foto_inicial")}>
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => handlePhotoCapture("manut_foto_inicial")}>
                    <Camera className="w-4 h-4 mr-2" /> Tirar Foto
                  </Button>
                )}
              </div>

              {/* 2. Análise geral */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  {ordem.manut_analise_concluida ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="font-medium">2. Análise Geral do Box</span>
                </div>
                
                <div>
                  <Label>Análise: (funcionamento e estado geral)</Label>
                  <Textarea
                    value={ordem.manut_analise_texto || ""}
                    onChange={(e) => setOrdem({ ...ordem, manut_analise_texto: e.target.value })}
                    onBlur={() => saveOrdem({ manut_analise_texto: ordem.manut_analise_texto })}
                    rows={3}
                    placeholder="Descreva o estado em que encontrou o box..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="analise_concluida"
                    checked={ordem.manut_analise_concluida}
                    onCheckedChange={(checked) => {
                      setOrdem({ ...ordem, manut_analise_concluida: !!checked });
                      saveOrdem({ manut_analise_concluida: !!checked });
                    }}
                  />
                  <label htmlFor="analise_concluida" className="text-sm">Análise concluída</label>
                </div>
              </div>

              {/* 3. Troca das roldanas */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  {ordem.manut_roldanas_trocadas ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="font-medium">3. Troca das Roldanas</span>
                </div>
                
                {ordem.manut_foto_roldanas ? (
                  <div className="relative">
                    <img src={ordem.manut_foto_roldanas} alt="Roldanas" className="w-full h-32 object-cover rounded-lg" />
                    <Button size="sm" variant="secondary" className="absolute bottom-2 right-2" onClick={() => handlePhotoCapture("manut_foto_roldanas")}>
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => handlePhotoCapture("manut_foto_roldanas")}>
                    <Camera className="w-4 h-4 mr-2" /> Foto das roldanas novas
                  </Button>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="roldanas_trocadas"
                    checked={ordem.manut_roldanas_trocadas}
                    onCheckedChange={(checked) => {
                      setOrdem({ ...ordem, manut_roldanas_trocadas: !!checked });
                      saveOrdem({ manut_roldanas_trocadas: !!checked });
                    }}
                  />
                  <label htmlFor="roldanas_trocadas" className="text-sm">Roldanas trocadas</label>
                </div>
              </div>

              {/* 4. Trilho */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  {ordem.manut_trilho_analisado ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="font-medium">4. Trilho, Fixações e Batedores</span>
                </div>
                
                <p className="text-sm text-muted-foreground">Analisar estado interno, realizar limpeza</p>

                {ordem.manut_foto_trilho ? (
                  <div className="relative">
                    <img src={ordem.manut_foto_trilho} alt="Trilho" className="w-full h-32 object-cover rounded-lg" />
                    <Button size="sm" variant="secondary" className="absolute bottom-2 right-2" onClick={() => handlePhotoCapture("manut_foto_trilho")}>
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => handlePhotoCapture("manut_foto_trilho")}>
                    <Camera className="w-4 h-4 mr-2" /> Foto após limpeza
                  </Button>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trilho_analisado"
                    checked={ordem.manut_trilho_analisado}
                    onCheckedChange={(checked) => {
                      setOrdem({ ...ordem, manut_trilho_analisado: !!checked });
                      saveOrdem({ manut_trilho_analisado: !!checked });
                    }}
                  />
                  <label htmlFor="trilho_analisado" className="text-sm">Análise e limpeza concluídas</label>
                </div>
              </div>

              {/* 5. Estado do vidro */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  {ordem.manut_vidro_analisado ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="font-medium">5. Estado Geral do Vidro</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vidro_trincas"
                    checked={ordem.manut_vidro_trincas}
                    onCheckedChange={(checked) => {
                      setOrdem({ ...ordem, manut_vidro_trincas: !!checked });
                      saveOrdem({ manut_vidro_trincas: !!checked });
                    }}
                  />
                  <label htmlFor="vidro_trincas" className="text-sm">Existe sinal de trincas?</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vidro_substituir"
                    checked={ordem.manut_vidro_substituir}
                    onCheckedChange={(checked) => {
                      setOrdem({ ...ordem, manut_vidro_substituir: !!checked });
                      saveOrdem({ manut_vidro_substituir: !!checked });
                    }}
                  />
                  <label htmlFor="vidro_substituir" className="text-sm">Necessário substituição?</label>
                </div>

                {ordem.manut_foto_vidro ? (
                  <div className="relative">
                    <img src={ordem.manut_foto_vidro} alt="Vidro" className="w-full h-32 object-cover rounded-lg" />
                    <Button size="sm" variant="secondary" className="absolute bottom-2 right-2" onClick={() => handlePhotoCapture("manut_foto_vidro")}>
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => handlePhotoCapture("manut_foto_vidro")}>
                    <Camera className="w-4 h-4 mr-2" /> Foto do vidro
                  </Button>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vidro_analisado"
                    checked={ordem.manut_vidro_analisado}
                    onCheckedChange={(checked) => {
                      setOrdem({ ...ordem, manut_vidro_analisado: !!checked });
                      saveOrdem({ manut_vidro_analisado: !!checked });
                    }}
                  />
                  <label htmlFor="vidro_analisado" className="text-sm">Análise do vidro concluída</label>
                </div>
              </div>

              {/* 6. Remontagem */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  {ordem.manut_remontagem_concluida ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="font-medium">6. Remontagem Geral + Foto Final</span>
                </div>

                {ordem.manut_foto_final ? (
                  <div className="relative">
                    <img src={ordem.manut_foto_final} alt="Foto final" className="w-full h-32 object-cover rounded-lg" />
                    <Button size="sm" variant="secondary" className="absolute bottom-2 right-2" onClick={() => handlePhotoCapture("manut_foto_final")}>
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => handlePhotoCapture("manut_foto_final")}>
                    <Camera className="w-4 h-4 mr-2" /> Foto Final
                  </Button>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remontagem_concluida"
                    checked={ordem.manut_remontagem_concluida}
                    onCheckedChange={(checked) => {
                      setOrdem({ ...ordem, manut_remontagem_concluida: !!checked });
                      saveOrdem({ manut_remontagem_concluida: !!checked });
                    }}
                  />
                  <label htmlFor="remontagem_concluida" className="text-sm">Remontagem concluída</label>
                </div>
              </div>

              {/* Assinatura */}
              <div className="p-4 bg-success/10 border border-success/30 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-success" />
                  <span className="font-medium text-success">Responsabilidade pela Manutenção</span>
                </div>
                
                <div>
                  <Label>Assinatura do Prestador (nome completo)</Label>
                  <Input
                    value={ordem.manut_assinatura_prestador || ""}
                    onChange={(e) => setOrdem({ ...ordem, manut_assinatura_prestador: e.target.value })}
                    onBlur={() => saveOrdem({ manut_assinatura_prestador: ordem.manut_assinatura_prestador })}
                    placeholder="Nome completo do prestador"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manut_concluida"
                    checked={ordem.manut_concluida}
                    onCheckedChange={(checked) => {
                      setOrdem({ ...ordem, manut_concluida: !!checked });
                      saveOrdem({ manut_concluida: !!checked });
                    }}
                  />
                  <label htmlFor="manut_concluida" className="text-sm font-medium">Finalizar Manutenção Anual</label>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* CHECKLIST PELÍCULA */}
        {ordem.colocacao_pelicula && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border-2 border-accent/30 p-4 mt-6"
          >
            <h2 className="text-lg font-bold text-accent flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5" />
              Checklist - Colocação de Película
            </h2>
            
            <div className="space-y-6">
              {/* 1. Foto geral */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  {ordem.pelicula_foto_geral ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="font-medium">1. Foto Geral do Box</span>
                </div>

                {ordem.pelicula_foto_geral ? (
                  <div className="relative">
                    <img src={ordem.pelicula_foto_geral} alt="Foto geral" className="w-full h-32 object-cover rounded-lg" />
                    <Button size="sm" variant="secondary" className="absolute bottom-2 right-2" onClick={() => handlePhotoCapture("pelicula_foto_geral")}>
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => handlePhotoCapture("pelicula_foto_geral")}>
                    <Camera className="w-4 h-4 mr-2" /> Tirar Foto
                  </Button>
                )}
              </div>

              {/* 2. Condições do vidro */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  {ordem.pelicula_condicoes_verificadas ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="font-medium">2. Verificar Condições do Vidro</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="condicoes_verificadas"
                    checked={ordem.pelicula_condicoes_verificadas}
                    onCheckedChange={(checked) => {
                      setOrdem({ ...ordem, pelicula_condicoes_verificadas: !!checked });
                      saveOrdem({ pelicula_condicoes_verificadas: !!checked });
                    }}
                  />
                  <label htmlFor="condicoes_verificadas" className="text-sm">Condições verificadas</label>
                </div>
              </div>

              {/* 3. Limpeza */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  {ordem.pelicula_limpeza_feita ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="font-medium">3. Limpeza do Vidro</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="limpeza_feita"
                    checked={ordem.pelicula_limpeza_feita}
                    onCheckedChange={(checked) => {
                      setOrdem({ ...ordem, pelicula_limpeza_feita: !!checked });
                      saveOrdem({ pelicula_limpeza_feita: !!checked });
                    }}
                  />
                  <label htmlFor="limpeza_feita" className="text-sm">Limpeza realizada</label>
                </div>
              </div>

              {/* 4. Retirar porta */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  {ordem.pelicula_porta_retirada ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="font-medium">4. Retirar Porta, Roldanas e Puxador</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="porta_retirada"
                    checked={ordem.pelicula_porta_retirada}
                    onCheckedChange={(checked) => {
                      setOrdem({ ...ordem, pelicula_porta_retirada: !!checked });
                      saveOrdem({ pelicula_porta_retirada: !!checked });
                    }}
                  />
                  <label htmlFor="porta_retirada" className="text-sm">Porta retirada</label>
                </div>
              </div>

              {/* 5. Película na porta */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  {ordem.pelicula_porta_aplicada ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="font-medium">5. Aplicar Película na Porta</span>
                </div>

                {ordem.pelicula_foto_porta ? (
                  <div className="relative">
                    <img src={ordem.pelicula_foto_porta} alt="Porta" className="w-full h-32 object-cover rounded-lg" />
                    <Button size="sm" variant="secondary" className="absolute bottom-2 right-2" onClick={() => handlePhotoCapture("pelicula_foto_porta")}>
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => handlePhotoCapture("pelicula_foto_porta")}>
                    <Camera className="w-4 h-4 mr-2" /> Foto da porta
                  </Button>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="porta_aplicada"
                    checked={ordem.pelicula_porta_aplicada}
                    onCheckedChange={(checked) => {
                      setOrdem({ ...ordem, pelicula_porta_aplicada: !!checked });
                      saveOrdem({ pelicula_porta_aplicada: !!checked });
                    }}
                  />
                  <label htmlFor="porta_aplicada" className="text-sm">Película aplicada + roldanas e puxador recolocados</label>
                </div>
              </div>

              {/* 6. Película no vidro fixo */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  {ordem.pelicula_vidro_fixo_aplicado ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="font-medium">6. Aplicar Película no Vidro Fixo</span>
                </div>

                {ordem.pelicula_foto_vidro_fixo ? (
                  <div className="relative">
                    <img src={ordem.pelicula_foto_vidro_fixo} alt="Vidro fixo" className="w-full h-32 object-cover rounded-lg" />
                    <Button size="sm" variant="secondary" className="absolute bottom-2 right-2" onClick={() => handlePhotoCapture("pelicula_foto_vidro_fixo")}>
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => handlePhotoCapture("pelicula_foto_vidro_fixo")}>
                    <Camera className="w-4 h-4 mr-2" /> Foto do vidro fixo
                  </Button>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vidro_fixo_aplicado"
                    checked={ordem.pelicula_vidro_fixo_aplicado}
                    onCheckedChange={(checked) => {
                      setOrdem({ ...ordem, pelicula_vidro_fixo_aplicado: !!checked });
                      saveOrdem({ pelicula_vidro_fixo_aplicado: !!checked });
                    }}
                  />
                  <label htmlFor="vidro_fixo_aplicado" className="text-sm">Película aplicada no vidro fixo</label>
                </div>
              </div>

              {/* 7. Remontagem */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  {ordem.pelicula_remontagem_concluida ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="font-medium">7. Remontagem + Foto Final</span>
                </div>

                {ordem.pelicula_foto_final ? (
                  <div className="relative">
                    <img src={ordem.pelicula_foto_final} alt="Foto final" className="w-full h-32 object-cover rounded-lg" />
                    <Button size="sm" variant="secondary" className="absolute bottom-2 right-2" onClick={() => handlePhotoCapture("pelicula_foto_final")}>
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => handlePhotoCapture("pelicula_foto_final")}>
                    <Camera className="w-4 h-4 mr-2" /> Foto Final
                  </Button>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pelicula_remontagem_concluida"
                    checked={ordem.pelicula_remontagem_concluida}
                    onCheckedChange={(checked) => {
                      setOrdem({ ...ordem, pelicula_remontagem_concluida: !!checked });
                      saveOrdem({ pelicula_remontagem_concluida: !!checked });
                    }}
                  />
                  <label htmlFor="pelicula_remontagem_concluida" className="text-sm">Remontagem concluída</label>
                </div>
              </div>

              {/* Finalizar Película */}
              <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pelicula_concluida"
                    checked={ordem.pelicula_concluida}
                    onCheckedChange={(checked) => {
                      setOrdem({ ...ordem, pelicula_concluida: !!checked });
                      saveOrdem({ pelicula_concluida: !!checked });
                    }}
                  />
                  <label htmlFor="pelicula_concluida" className="text-sm font-medium">Finalizar Colocação de Película</label>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Botão Gerar Certificado */}
        {(ordem.manutencao_anual || ordem.colocacao_pelicula) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-white"
          >
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6" />
              <h2 className="text-lg font-bold">Certificado de Manutenção</h2>
            </div>
            
            <p className="text-sm opacity-90 mb-4">
              Gerar PDF do Certificado de Manutenção Anual
              {ordem.colocacao_pelicula && " e Colocação de Película"} com garantia de 1 ano.
            </p>

            <Button
              onClick={enviarCertificado}
              disabled={enviandoCertificado || ordem.certificado_enviado}
              className="w-full bg-white text-primary hover:bg-white/90"
            >
              {enviandoCertificado ? (
                "Enviando..."
              ) : ordem.certificado_enviado ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Certificado Enviado
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Gerar e Enviar Certificado por Email
                </>
              )}
            </Button>

            {ordem.data_conclusao && (
              <p className="text-xs text-center mt-3 opacity-75">
                Concluído em: {format(new Date(ordem.data_conclusao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            )}
          </motion.section>
        )}

        {/* Separador */}
        <div className="border-t-4 border-muted my-8" />

        {/* Dados Financeiros */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <h2 className="text-sm font-semibold text-primary flex items-center gap-2 mb-4">
            <DollarSign className="w-4 h-4" />
            Dados Financeiros
          </h2>
          
          <div className="space-y-4">
            {ordem.manutencao_anual && (
              <div>
                <Label>Valor Manutenção Anual (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={ordem.valor_manutencao || ""}
                  onChange={(e) => setOrdem({ ...ordem, valor_manutencao: parseFloat(e.target.value) || null })}
                  onBlur={() => saveOrdem({ valor_manutencao: ordem.valor_manutencao })}
                  placeholder="0.00"
                />
              </div>
            )}

            {ordem.colocacao_pelicula && (
              <div>
                <Label>Valor Película (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={ordem.valor_pelicula || ""}
                  onChange={(e) => setOrdem({ ...ordem, valor_pelicula: parseFloat(e.target.value) || null })}
                  onBlur={() => saveOrdem({ valor_pelicula: ordem.valor_pelicula })}
                  placeholder="0.00"
                />
              </div>
            )}

            <div>
              <Label>Valor Total (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={ordem.valor_total || ""}
                onChange={(e) => setOrdem({ ...ordem, valor_total: parseFloat(e.target.value) || null })}
                onBlur={() => saveOrdem({ valor_total: ordem.valor_total })}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label>Data do Pagamento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !ordem.data_pagamento && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {ordem.data_pagamento
                      ? format(new Date(ordem.data_pagamento), "PPP", { locale: ptBR })
                      : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={ordem.data_pagamento ? new Date(ordem.data_pagamento) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const dateStr = format(date, "yyyy-MM-dd");
                        setOrdem({ ...ordem, data_pagamento: dateStr });
                        saveOrdem({ data_pagamento: dateStr });
                      }
                    }}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Forma de Pagamento</Label>
              <Select
                value={ordem.forma_pagamento || ""}
                onValueChange={(value) => {
                  setOrdem({ ...ordem, forma_pagamento: value });
                  saveOrdem({ forma_pagamento: value });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                  <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                  <SelectItem value="Boleto">Boleto</SelectItem>
                  <SelectItem value="Transferência">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.section>

        {/* Avaliação do Cliente */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <h2 className="text-sm font-semibold text-primary flex items-center gap-2 mb-4">
            <Star className="w-4 h-4" />
            Avaliação do Cliente
          </h2>
          
          <div className="flex justify-center py-4">
            {renderStars()}
          </div>
          
          <p className="text-center text-sm text-muted-foreground">
            {ordem.avaliacao_cliente 
              ? `${ordem.avaliacao_cliente} de 5 estrelas` 
              : "Clique nas estrelas para avaliar"}
          </p>
        </motion.section>
      </div>
    </div>
  );
};

export default OrdemDetalhe;
