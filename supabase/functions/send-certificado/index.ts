import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CertificadoRequest {
  ordemId: string;
  clienteEmail: string;
  adminEmail?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ordemId, clienteEmail, adminEmail }: CertificadoRequest = await req.json();

    console.log("Recebendo requisição para enviar certificado:", { ordemId, clienteEmail, adminEmail });

    // Buscar dados da ordem
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: ordem, error: ordemError } = await supabase
      .from("ordens_servico")
      .select("*")
      .eq("id", ordemId)
      .single();

    if (ordemError || !ordem) {
      console.error("Erro ao buscar ordem:", ordemError);
      return new Response(
        JSON.stringify({ error: "Ordem não encontrada" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const servicosRealizados = [];
    if (ordem.manutencao_anual) servicosRealizados.push("Manutenção Anual de Box");
    if (ordem.colocacao_pelicula) servicosRealizados.push("Colocação de Película de Proteção");

    const dataAtual = new Date().toLocaleDateString("pt-BR");

    // Criar HTML do certificado
    const certificadoHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: bold; color: #2563eb; }
    .titulo { font-size: 24px; margin-top: 10px; color: #1e293b; }
    .secao { margin-bottom: 25px; }
    .secao-titulo { font-size: 16px; font-weight: bold; color: #2563eb; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .info-item { margin-bottom: 8px; }
    .label { font-weight: bold; color: #64748b; font-size: 12px; }
    .value { color: #1e293b; }
    .checklist-item { display: flex; align-items: center; margin-bottom: 8px; }
    .check { color: #22c55e; margin-right: 8px; }
    .foto-container { display: inline-block; margin: 10px; text-align: center; }
    .foto { max-width: 200px; border-radius: 8px; }
    .garantia { background: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 20px; text-align: center; margin-top: 30px; }
    .garantia-titulo { font-size: 20px; font-weight: bold; color: #16a34a; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">🔧 BoxManutenção</div>
    <div class="titulo">Certificado de Serviço</div>
  </div>

  <div class="secao">
    <div class="secao-titulo">📋 Dados do Cliente</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="label">Nome</div>
        <div class="value">${ordem.cliente_nome || "-"}</div>
      </div>
      <div class="info-item">
        <div class="label">Telefone</div>
        <div class="value">${ordem.cliente_telefone || "-"}</div>
      </div>
      <div class="info-item">
        <div class="label">Email</div>
        <div class="value">${ordem.cliente_email || "-"}</div>
      </div>
      <div class="info-item">
        <div class="label">Local do Box</div>
        <div class="value">${ordem.local_box || "-"}</div>
      </div>
    </div>
    <div class="info-item" style="margin-top: 10px;">
      <div class="label">Endereço Completo</div>
      <div class="value">${ordem.cliente_endereco || ""} ${ordem.cliente_numero || ""} ${ordem.cliente_complemento ? ", " + ordem.cliente_complemento : ""} - ${ordem.cliente_bairro || ""}, ${ordem.cliente_cidade || ""} - ${ordem.cliente_estado || ""} - CEP: ${ordem.cliente_cep || ""}</div>
    </div>
  </div>

  <div class="secao">
    <div class="secao-titulo">👷 Prestador de Serviço</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="label">Nome</div>
        <div class="value">${ordem.prestador_nome || "-"}</div>
      </div>
      <div class="info-item">
        <div class="label">Telefone</div>
        <div class="value">${ordem.prestador_telefone || "-"}</div>
      </div>
    </div>
  </div>

  <div class="secao">
    <div class="secao-titulo">🛠️ Serviços Realizados</div>
    <p><strong>${servicosRealizados.join(" + ") || "Nenhum serviço selecionado"}</strong></p>
  </div>

  ${ordem.manutencao_anual ? `
  <div class="secao">
    <div class="secao-titulo">✅ Checklist - Manutenção Anual</div>
    <div class="checklist-item"><span class="check">✓</span> Foto inicial do box registrada</div>
    <div class="checklist-item"><span class="check">✓</span> Análise geral do box realizada</div>
    ${ordem.manut_analise_texto ? `<div class="info-item"><div class="label">Análise:</div><div class="value">${ordem.manut_analise_texto}</div></div>` : ""}
    <div class="checklist-item"><span class="check">✓</span> Troca das roldanas realizada</div>
    <div class="checklist-item"><span class="check">✓</span> Análise do trilho, fixações e batedores</div>
    <div class="checklist-item"><span class="check">✓</span> Limpeza realizada</div>
    <div class="checklist-item"><span class="check">✓</span> Estado do vidro verificado ${ordem.manut_vidro_trincas ? "(Trincas encontradas)" : "(Sem trincas)"}</div>
    <div class="checklist-item"><span class="check">✓</span> Remontagem geral concluída</div>
  </div>
  ` : ""}

  ${ordem.colocacao_pelicula ? `
  <div class="secao">
    <div class="secao-titulo">✅ Checklist - Colocação de Película</div>
    <div class="checklist-item"><span class="check">✓</span> Foto geral do box registrada</div>
    <div class="checklist-item"><span class="check">✓</span> Condições gerais do vidro verificadas</div>
    <div class="checklist-item"><span class="check">✓</span> Limpeza do vidro realizada</div>
    <div class="checklist-item"><span class="check">✓</span> Porta, roldanas e puxador retirados</div>
    <div class="checklist-item"><span class="check">✓</span> Película aplicada na porta</div>
    <div class="checklist-item"><span class="check">✓</span> Roldanas e puxador recolocados</div>
    <div class="checklist-item"><span class="check">✓</span> Película aplicada no vidro fixo</div>
    <div class="checklist-item"><span class="check">✓</span> Box remontado</div>
  </div>
  ` : ""}

  <div class="garantia">
    <div class="garantia-titulo">🛡️ GARANTIA DE 1 ANO</div>
    <p>Este certificado garante a qualidade dos serviços prestados pelo período de <strong>1 (um) ano</strong> a partir da data de conclusão.</p>
    <p><strong>Data de Conclusão:</strong> ${dataAtual}</p>
  </div>

  <div class="footer">
    <p>Documento gerado automaticamente em ${dataAtual}</p>
    <p>BoxManutenção - Serviços de Manutenção e Instalação de Box</p>
  </div>
</body>
</html>
    `;

    // Lista de destinatários
    const recipients = [clienteEmail];
    if (adminEmail) recipients.push(adminEmail);

    console.log("Enviando email para:", recipients);

    // Enviar email com o certificado usando fetch diretamente
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BoxManutenção <onboarding@resend.dev>",
        to: recipients,
        subject: `Certificado de Manutenção - Ordem #${ordemId.slice(0, 8)}`,
        html: certificadoHtml,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log("Email enviado com sucesso:", emailResult);

    // Atualizar ordem marcando que certificado foi enviado
    const { error: updateError } = await supabase
      .from("ordens_servico")
      .update({
        certificado_enviado: true,
        data_conclusao: new Date().toISOString(),
        status: "concluido",
      })
      .eq("id", ordemId);

    if (updateError) {
      console.error("Erro ao atualizar ordem:", updateError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Certificado enviado com sucesso!",
        emailResult 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Erro ao enviar certificado:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
