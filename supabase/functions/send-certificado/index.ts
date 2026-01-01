import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CertificadoRequest {
  clienteEmail: string;
  clienteNome: string;
  prestadorNome?: string;
  pdfBase64: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clienteEmail, clienteNome, prestadorNome, pdfBase64 }: CertificadoRequest = await req.json();

    console.log("Recebendo requisição para enviar certificado para:", clienteEmail);

    if (!clienteEmail) {
      return new Response(
        JSON.stringify({ error: "E-mail do cliente não informado" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!pdfBase64) {
      return new Response(
        JSON.stringify({ error: "PDF não fornecido" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const dataAtual = new Date().toLocaleDateString("pt-BR");

    // HTML do email
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    .container { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { text-align: center; border-bottom: 3px solid #22c55e; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: bold; color: #22c55e; }
    .titulo { font-size: 20px; margin-top: 10px; color: #1e293b; }
    .content { color: #374151; line-height: 1.6; }
    .destaque { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🔧 BoxManutenção</div>
      <div class="titulo">Certificado de Manutenção</div>
    </div>
    
    <div class="content">
      <p>Olá <strong>${clienteNome || "Cliente"}</strong>,</p>
      
      <p>Seu serviço de manutenção de box foi concluído com sucesso!</p>
      
      <div class="destaque">
        <strong>📎 Certificado em anexo</strong><br>
        O certificado completo do serviço está anexado a este e-mail em formato PDF. 
        Guarde este documento, pois ele comprova a garantia de <strong>1 ano</strong> do serviço realizado.
      </div>
      
      ${prestadorNome ? `<p><strong>Prestador responsável:</strong> ${prestadorNome}</p>` : ""}
      
      <p><strong>Data de conclusão:</strong> ${dataAtual}</p>
      
      <p>Agradecemos pela confiança em nossos serviços!</p>
      
      <p>Atenciosamente,<br><strong>Equipe BoxManutenção</strong></p>
    </div>
    
    <div class="footer">
      <p>Este é um e-mail automático. Por favor, não responda.</p>
      <p>BoxManutenção - Serviços de Manutenção e Instalação de Box</p>
    </div>
  </div>
</body>
</html>
    `;

    console.log("Enviando email com PDF anexo para:", clienteEmail);

    // Enviar email com o PDF anexado
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BoxManutenção <onboarding@resend.dev>",
        to: [clienteEmail],
        subject: `Certificado de Manutenção - ${clienteNome || "Cliente"}`,
        html: emailHtml,
        attachments: [
          {
            filename: `Certificado_${clienteNome?.replace(/\s+/g, '_') || 'cliente'}_${new Date().toISOString().slice(0, 10)}.pdf`,
            content: pdfBase64,
          }
        ],
      }),
    });

    const emailResult = await emailResponse.json();
    
    if (!emailResponse.ok) {
      console.error("Erro ao enviar email:", emailResult);
      return new Response(
        JSON.stringify({ error: emailResult.message || "Erro ao enviar email" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Email enviado com sucesso:", emailResult);

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
