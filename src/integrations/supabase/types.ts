export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ordens_servico: {
        Row: {
          avaliacao_cliente: number | null
          certificado_enviado: boolean | null
          certificado_gerado: boolean | null
          certificado_pdf_url: string | null
          cliente_bairro: string | null
          cliente_cep: string | null
          cliente_cidade: string | null
          cliente_complemento: string | null
          cliente_email: string | null
          cliente_endereco: string | null
          cliente_estado: string | null
          cliente_nome: string
          cliente_numero: string | null
          cliente_telefone: string | null
          colocacao_pelicula: boolean | null
          created_at: string
          data_agendamento: string | null
          data_conclusao: string | null
          data_contato_prestador: string | null
          data_pagamento: string | null
          data_solicitacao: string
          forma_pagamento: string | null
          foto_box_inicial: string | null
          id: string
          local_box: string | null
          manut_analise_concluida: boolean | null
          manut_analise_texto: string | null
          manut_assinatura_prestador: string | null
          manut_concluida: boolean | null
          manut_foto_final: string | null
          manut_foto_inicial: string | null
          manut_foto_roldanas: string | null
          manut_foto_trilho: string | null
          manut_foto_vidro: string | null
          manut_remontagem_concluida: boolean | null
          manut_roldanas_trocadas: boolean | null
          manut_trilho_analisado: boolean | null
          manut_vidro_analisado: boolean | null
          manut_vidro_substituir: boolean | null
          manut_vidro_trincas: boolean | null
          manutencao_anual: boolean | null
          pelicula_concluida: boolean | null
          pelicula_condicoes_verificadas: boolean | null
          pelicula_foto_final: string | null
          pelicula_foto_geral: string | null
          pelicula_foto_porta: string | null
          pelicula_foto_vidro_fixo: string | null
          pelicula_limpeza_feita: boolean | null
          pelicula_porta_aplicada: boolean | null
          pelicula_porta_retirada: boolean | null
          pelicula_remontagem_concluida: boolean | null
          pelicula_vidro_fixo_aplicado: boolean | null
          prestador_id: string | null
          prestador_nome: string | null
          prestador_telefone: string | null
          status: string | null
          updated_at: string
          valor_manutencao: number | null
          valor_pelicula: number | null
          valor_total: number | null
        }
        Insert: {
          avaliacao_cliente?: number | null
          certificado_enviado?: boolean | null
          certificado_gerado?: boolean | null
          certificado_pdf_url?: string | null
          cliente_bairro?: string | null
          cliente_cep?: string | null
          cliente_cidade?: string | null
          cliente_complemento?: string | null
          cliente_email?: string | null
          cliente_endereco?: string | null
          cliente_estado?: string | null
          cliente_nome: string
          cliente_numero?: string | null
          cliente_telefone?: string | null
          colocacao_pelicula?: boolean | null
          created_at?: string
          data_agendamento?: string | null
          data_conclusao?: string | null
          data_contato_prestador?: string | null
          data_pagamento?: string | null
          data_solicitacao?: string
          forma_pagamento?: string | null
          foto_box_inicial?: string | null
          id?: string
          local_box?: string | null
          manut_analise_concluida?: boolean | null
          manut_analise_texto?: string | null
          manut_assinatura_prestador?: string | null
          manut_concluida?: boolean | null
          manut_foto_final?: string | null
          manut_foto_inicial?: string | null
          manut_foto_roldanas?: string | null
          manut_foto_trilho?: string | null
          manut_foto_vidro?: string | null
          manut_remontagem_concluida?: boolean | null
          manut_roldanas_trocadas?: boolean | null
          manut_trilho_analisado?: boolean | null
          manut_vidro_analisado?: boolean | null
          manut_vidro_substituir?: boolean | null
          manut_vidro_trincas?: boolean | null
          manutencao_anual?: boolean | null
          pelicula_concluida?: boolean | null
          pelicula_condicoes_verificadas?: boolean | null
          pelicula_foto_final?: string | null
          pelicula_foto_geral?: string | null
          pelicula_foto_porta?: string | null
          pelicula_foto_vidro_fixo?: string | null
          pelicula_limpeza_feita?: boolean | null
          pelicula_porta_aplicada?: boolean | null
          pelicula_porta_retirada?: boolean | null
          pelicula_remontagem_concluida?: boolean | null
          pelicula_vidro_fixo_aplicado?: boolean | null
          prestador_id?: string | null
          prestador_nome?: string | null
          prestador_telefone?: string | null
          status?: string | null
          updated_at?: string
          valor_manutencao?: number | null
          valor_pelicula?: number | null
          valor_total?: number | null
        }
        Update: {
          avaliacao_cliente?: number | null
          certificado_enviado?: boolean | null
          certificado_gerado?: boolean | null
          certificado_pdf_url?: string | null
          cliente_bairro?: string | null
          cliente_cep?: string | null
          cliente_cidade?: string | null
          cliente_complemento?: string | null
          cliente_email?: string | null
          cliente_endereco?: string | null
          cliente_estado?: string | null
          cliente_nome?: string
          cliente_numero?: string | null
          cliente_telefone?: string | null
          colocacao_pelicula?: boolean | null
          created_at?: string
          data_agendamento?: string | null
          data_conclusao?: string | null
          data_contato_prestador?: string | null
          data_pagamento?: string | null
          data_solicitacao?: string
          forma_pagamento?: string | null
          foto_box_inicial?: string | null
          id?: string
          local_box?: string | null
          manut_analise_concluida?: boolean | null
          manut_analise_texto?: string | null
          manut_assinatura_prestador?: string | null
          manut_concluida?: boolean | null
          manut_foto_final?: string | null
          manut_foto_inicial?: string | null
          manut_foto_roldanas?: string | null
          manut_foto_trilho?: string | null
          manut_foto_vidro?: string | null
          manut_remontagem_concluida?: boolean | null
          manut_roldanas_trocadas?: boolean | null
          manut_trilho_analisado?: boolean | null
          manut_vidro_analisado?: boolean | null
          manut_vidro_substituir?: boolean | null
          manut_vidro_trincas?: boolean | null
          manutencao_anual?: boolean | null
          pelicula_concluida?: boolean | null
          pelicula_condicoes_verificadas?: boolean | null
          pelicula_foto_final?: string | null
          pelicula_foto_geral?: string | null
          pelicula_foto_porta?: string | null
          pelicula_foto_vidro_fixo?: string | null
          pelicula_limpeza_feita?: boolean | null
          pelicula_porta_aplicada?: boolean | null
          pelicula_porta_retirada?: boolean | null
          pelicula_remontagem_concluida?: boolean | null
          pelicula_vidro_fixo_aplicado?: boolean | null
          prestador_id?: string | null
          prestador_nome?: string | null
          prestador_telefone?: string | null
          status?: string | null
          updated_at?: string
          valor_manutencao?: number | null
          valor_pelicula?: number | null
          valor_total?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
