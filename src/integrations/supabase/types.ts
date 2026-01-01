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
      agendamentos: {
        Row: {
          cliente_id: string | null
          created_at: string
          data_agendada: string
          hora_fim: string | null
          hora_inicio: string | null
          id: string
          observacoes: string | null
          ordem_id: string
          prestador_id: string | null
          status: Database["public"]["Enums"]["status_geral"] | null
          updated_at: string
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          data_agendada: string
          hora_fim?: string | null
          hora_inicio?: string | null
          id?: string
          observacoes?: string | null
          ordem_id: string
          prestador_id?: string | null
          status?: Database["public"]["Enums"]["status_geral"] | null
          updated_at?: string
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          data_agendada?: string
          hora_fim?: string | null
          hora_inicio?: string | null
          id?: string
          observacoes?: string | null
          ordem_id?: string
          prestador_id?: string | null
          status?: Database["public"]["Enums"]["status_geral"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_ordem_id_fkey"
            columns: ["ordem_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "prestadores_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      avaliacoes: {
        Row: {
          cliente_id: string | null
          comentario: string | null
          created_at: string
          data_avaliacao: string | null
          id: string
          nota: number | null
          ordem_id: string
          prestador_id: string | null
        }
        Insert: {
          cliente_id?: string | null
          comentario?: string | null
          created_at?: string
          data_avaliacao?: string | null
          id?: string
          nota?: number | null
          ordem_id: string
          prestador_id?: string | null
        }
        Update: {
          cliente_id?: string | null
          comentario?: string | null
          created_at?: string
          data_avaliacao?: string | null
          id?: string
          nota?: number | null
          ordem_id?: string
          prestador_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_ordem_id_fkey"
            columns: ["ordem_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "prestadores_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      box_clientes: {
        Row: {
          ambiente: string
          cliente_id: string
          created_at: string
          foto_url: string | null
          id: string
          observacoes: string | null
          tipo_box: string | null
          updated_at: string
        }
        Insert: {
          ambiente: string
          cliente_id: string
          created_at?: string
          foto_url?: string | null
          id?: string
          observacoes?: string | null
          tipo_box?: string | null
          updated_at?: string
        }
        Update: {
          ambiente?: string
          cliente_id?: string
          created_at?: string
          foto_url?: string | null
          id?: string
          observacoes?: string | null
          tipo_box?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "box_clientes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      certificados: {
        Row: {
          cliente_id: string | null
          created_at: string
          data_envio: string | null
          data_geracao: string | null
          data_validade: string | null
          enviado_email: boolean | null
          id: string
          numero_certificado: string | null
          ordem_id: string
          pdf_url: string | null
          prestador_id: string | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          data_envio?: string | null
          data_geracao?: string | null
          data_validade?: string | null
          enviado_email?: boolean | null
          id?: string
          numero_certificado?: string | null
          ordem_id: string
          pdf_url?: string | null
          prestador_id?: string | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          data_envio?: string | null
          data_geracao?: string | null
          data_validade?: string | null
          enviado_email?: boolean | null
          id?: string
          numero_certificado?: string | null
          ordem_id?: string
          pdf_url?: string | null
          prestador_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificados_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificados_ordem_id_fkey"
            columns: ["ordem_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificados_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "prestadores_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          bairro: string | null
          cep: string | null
          cidade: string | null
          complemento: string | null
          created_at: string
          documento: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          latitude: number | null
          longitude: number | null
          nome: string
          numero: string | null
          observacoes: string | null
          status: Database["public"]["Enums"]["status_geral"] | null
          telefone: string | null
          tipo_documento: Database["public"]["Enums"]["tipo_documento"] | null
          updated_at: string
          user_id: string | null
          whatsapp: string | null
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          created_at?: string
          documento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome: string
          numero?: string | null
          observacoes?: string | null
          status?: Database["public"]["Enums"]["status_geral"] | null
          telefone?: string | null
          tipo_documento?: Database["public"]["Enums"]["tipo_documento"] | null
          updated_at?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          created_at?: string
          documento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome?: string
          numero?: string | null
          observacoes?: string | null
          status?: Database["public"]["Enums"]["status_geral"] | null
          telefone?: string | null
          tipo_documento?: Database["public"]["Enums"]["tipo_documento"] | null
          updated_at?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      financeiro: {
        Row: {
          cliente_id: string | null
          comprovante_url: string | null
          created_at: string
          data_pagamento: string | null
          data_vencimento: string | null
          descricao: string | null
          forma_pagamento: Database["public"]["Enums"]["forma_pagamento"] | null
          id: string
          observacoes: string | null
          ordem_id: string | null
          prestador_id: string | null
          status: Database["public"]["Enums"]["status_geral"] | null
          tipo: string
          updated_at: string
          valor: number
          vidracaria_id: string | null
        }
        Insert: {
          cliente_id?: string | null
          comprovante_url?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          forma_pagamento?:
            | Database["public"]["Enums"]["forma_pagamento"]
            | null
          id?: string
          observacoes?: string | null
          ordem_id?: string | null
          prestador_id?: string | null
          status?: Database["public"]["Enums"]["status_geral"] | null
          tipo: string
          updated_at?: string
          valor: number
          vidracaria_id?: string | null
        }
        Update: {
          cliente_id?: string | null
          comprovante_url?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          forma_pagamento?:
            | Database["public"]["Enums"]["forma_pagamento"]
            | null
          id?: string
          observacoes?: string | null
          ordem_id?: string | null
          prestador_id?: string | null
          status?: Database["public"]["Enums"]["status_geral"] | null
          tipo?: string
          updated_at?: string
          valor?: number
          vidracaria_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financeiro_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financeiro_ordem_id_fkey"
            columns: ["ordem_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financeiro_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "prestadores_servico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financeiro_vidracaria_id_fkey"
            columns: ["vidracaria_id"]
            isOneToOne: false
            referencedRelation: "vidracarias"
            referencedColumns: ["id"]
          },
        ]
      }
      mapa_gps: {
        Row: {
          ativo: boolean | null
          cor: string | null
          created_at: string
          endereco_completo: string | null
          icone: string | null
          id: string
          latitude: number
          longitude: number
          nome: string | null
          referencia_id: string
          tipo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          cor?: string | null
          created_at?: string
          endereco_completo?: string | null
          icone?: string | null
          id?: string
          latitude: number
          longitude: number
          nome?: string | null
          referencia_id: string
          tipo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          cor?: string | null
          created_at?: string
          endereco_completo?: string | null
          icone?: string | null
          id?: string
          latitude?: number
          longitude?: number
          nome?: string | null
          referencia_id?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      mensagens: {
        Row: {
          conteudo: string
          created_at: string
          destinatario_id: string | null
          destinatario_tipo: string | null
          id: string
          lida: boolean | null
          remetente_id: string
          remetente_tipo: string
        }
        Insert: {
          conteudo: string
          created_at?: string
          destinatario_id?: string | null
          destinatario_tipo?: string | null
          id?: string
          lida?: boolean | null
          remetente_id: string
          remetente_tipo: string
        }
        Update: {
          conteudo?: string
          created_at?: string
          destinatario_id?: string | null
          destinatario_tipo?: string | null
          id?: string
          lida?: boolean | null
          remetente_id?: string
          remetente_tipo?: string
        }
        Relationships: []
      }
      orcamentos: {
        Row: {
          cliente_id: string | null
          created_at: string
          data_aprovacao: string | null
          id: string
          observacoes: string | null
          ordem_id: string
          status: Database["public"]["Enums"]["status_geral"] | null
          updated_at: string
          valor_desconto: number | null
          valor_manutencao: number | null
          valor_pelicula: number | null
          valor_total: number | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          data_aprovacao?: string | null
          id?: string
          observacoes?: string | null
          ordem_id: string
          status?: Database["public"]["Enums"]["status_geral"] | null
          updated_at?: string
          valor_desconto?: number | null
          valor_manutencao?: number | null
          valor_pelicula?: number | null
          valor_total?: number | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          data_aprovacao?: string | null
          id?: string
          observacoes?: string | null
          ordem_id?: string
          status?: Database["public"]["Enums"]["status_geral"] | null
          updated_at?: string
          valor_desconto?: number | null
          valor_manutencao?: number | null
          valor_pelicula?: number | null
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orcamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_ordem_id_fkey"
            columns: ["ordem_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      ordens_servico: {
        Row: {
          cliente_id: string | null
          created_at: string
          data_agendamento: string | null
          data_conclusao: string | null
          data_inicio: string | null
          data_solicitacao: string
          id: string
          numero_ordem: string | null
          observacoes: string | null
          prestador_id: string | null
          status: Database["public"]["Enums"]["status_geral"] | null
          updated_at: string
          valor_total: number | null
          vidracaria_id: string | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          data_agendamento?: string | null
          data_conclusao?: string | null
          data_inicio?: string | null
          data_solicitacao?: string
          id?: string
          numero_ordem?: string | null
          observacoes?: string | null
          prestador_id?: string | null
          status?: Database["public"]["Enums"]["status_geral"] | null
          updated_at?: string
          valor_total?: number | null
          vidracaria_id?: string | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          data_agendamento?: string | null
          data_conclusao?: string | null
          data_inicio?: string | null
          data_solicitacao?: string
          id?: string
          numero_ordem?: string | null
          observacoes?: string | null
          prestador_id?: string | null
          status?: Database["public"]["Enums"]["status_geral"] | null
          updated_at?: string
          valor_total?: number | null
          vidracaria_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ordens_servico_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_servico_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "prestadores_servico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_servico_vidracaria_id_fkey"
            columns: ["vidracaria_id"]
            isOneToOne: false
            referencedRelation: "vidracarias"
            referencedColumns: ["id"]
          },
        ]
      }
      prestadores_servico: {
        Row: {
          bairro: string | null
          banco_agencia: string | null
          banco_conta: string | null
          banco_nome: string | null
          cep: string
          cidade: string | null
          cnh_urls: string[] | null
          complemento: string | null
          created_at: string
          data_aprovacao: string | null
          documento: string
          email: string
          endereco: string | null
          estado: string | null
          fotos_obras: string[] | null
          id: string
          latitude: number | null
          longitude: number | null
          nome: string
          nota_media: number | null
          numero: string | null
          observacoes: string | null
          pix_chave: string | null
          placa_veiculo: string | null
          qualificacoes: string[] | null
          status: Database["public"]["Enums"]["status_geral"] | null
          telefone: string
          tipo_documento: Database["public"]["Enums"]["tipo_documento"]
          tipo_veiculo: Database["public"]["Enums"]["tipo_veiculo"]
          total_servicos: number | null
          updated_at: string
          user_id: string | null
          valor_ganhos: number | null
          whatsapp: string | null
        }
        Insert: {
          bairro?: string | null
          banco_agencia?: string | null
          banco_conta?: string | null
          banco_nome?: string | null
          cep: string
          cidade?: string | null
          cnh_urls?: string[] | null
          complemento?: string | null
          created_at?: string
          data_aprovacao?: string | null
          documento: string
          email: string
          endereco?: string | null
          estado?: string | null
          fotos_obras?: string[] | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome: string
          nota_media?: number | null
          numero?: string | null
          observacoes?: string | null
          pix_chave?: string | null
          placa_veiculo?: string | null
          qualificacoes?: string[] | null
          status?: Database["public"]["Enums"]["status_geral"] | null
          telefone: string
          tipo_documento: Database["public"]["Enums"]["tipo_documento"]
          tipo_veiculo: Database["public"]["Enums"]["tipo_veiculo"]
          total_servicos?: number | null
          updated_at?: string
          user_id?: string | null
          valor_ganhos?: number | null
          whatsapp?: string | null
        }
        Update: {
          bairro?: string | null
          banco_agencia?: string | null
          banco_conta?: string | null
          banco_nome?: string | null
          cep?: string
          cidade?: string | null
          cnh_urls?: string[] | null
          complemento?: string | null
          created_at?: string
          data_aprovacao?: string | null
          documento?: string
          email?: string
          endereco?: string | null
          estado?: string | null
          fotos_obras?: string[] | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome?: string
          nota_media?: number | null
          numero?: string | null
          observacoes?: string | null
          pix_chave?: string | null
          placa_veiculo?: string | null
          qualificacoes?: string[] | null
          status?: Database["public"]["Enums"]["status_geral"] | null
          telefone?: string
          tipo_documento?: Database["public"]["Enums"]["tipo_documento"]
          tipo_veiculo?: Database["public"]["Enums"]["tipo_veiculo"]
          total_servicos?: number | null
          updated_at?: string
          user_id?: string | null
          valor_ganhos?: number | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      processo_manutencao: {
        Row: {
          analise_concluida: boolean | null
          analise_texto: string | null
          assinatura_prestador: string | null
          box_id: string | null
          concluido: boolean | null
          created_at: string
          data_conclusao: string | null
          foto_final: string | null
          foto_inicial: string | null
          foto_roldanas: string | null
          foto_trilho: string | null
          foto_vidro: string | null
          id: string
          ordem_id: string
          remontagem_concluida: boolean | null
          roldanas_trocadas: boolean | null
          trilho_analisado: boolean | null
          updated_at: string
          valor: number | null
          vidro_analisado: boolean | null
          vidro_substituir: boolean | null
          vidro_trincas: boolean | null
        }
        Insert: {
          analise_concluida?: boolean | null
          analise_texto?: string | null
          assinatura_prestador?: string | null
          box_id?: string | null
          concluido?: boolean | null
          created_at?: string
          data_conclusao?: string | null
          foto_final?: string | null
          foto_inicial?: string | null
          foto_roldanas?: string | null
          foto_trilho?: string | null
          foto_vidro?: string | null
          id?: string
          ordem_id: string
          remontagem_concluida?: boolean | null
          roldanas_trocadas?: boolean | null
          trilho_analisado?: boolean | null
          updated_at?: string
          valor?: number | null
          vidro_analisado?: boolean | null
          vidro_substituir?: boolean | null
          vidro_trincas?: boolean | null
        }
        Update: {
          analise_concluida?: boolean | null
          analise_texto?: string | null
          assinatura_prestador?: string | null
          box_id?: string | null
          concluido?: boolean | null
          created_at?: string
          data_conclusao?: string | null
          foto_final?: string | null
          foto_inicial?: string | null
          foto_roldanas?: string | null
          foto_trilho?: string | null
          foto_vidro?: string | null
          id?: string
          ordem_id?: string
          remontagem_concluida?: boolean | null
          roldanas_trocadas?: boolean | null
          trilho_analisado?: boolean | null
          updated_at?: string
          valor?: number | null
          vidro_analisado?: boolean | null
          vidro_substituir?: boolean | null
          vidro_trincas?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "processo_manutencao_box_id_fkey"
            columns: ["box_id"]
            isOneToOne: false
            referencedRelation: "box_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processo_manutencao_ordem_id_fkey"
            columns: ["ordem_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      processo_pelicula: {
        Row: {
          box_id: string | null
          concluido: boolean | null
          condicoes_verificadas: boolean | null
          created_at: string
          data_conclusao: string | null
          foto_final: string | null
          foto_geral: string | null
          foto_porta: string | null
          foto_vidro_fixo: string | null
          id: string
          limpeza_feita: boolean | null
          ordem_id: string
          porta_aplicada: boolean | null
          porta_retirada: boolean | null
          remontagem_concluida: boolean | null
          updated_at: string
          valor: number | null
          vidro_fixo_aplicado: boolean | null
        }
        Insert: {
          box_id?: string | null
          concluido?: boolean | null
          condicoes_verificadas?: boolean | null
          created_at?: string
          data_conclusao?: string | null
          foto_final?: string | null
          foto_geral?: string | null
          foto_porta?: string | null
          foto_vidro_fixo?: string | null
          id?: string
          limpeza_feita?: boolean | null
          ordem_id: string
          porta_aplicada?: boolean | null
          porta_retirada?: boolean | null
          remontagem_concluida?: boolean | null
          updated_at?: string
          valor?: number | null
          vidro_fixo_aplicado?: boolean | null
        }
        Update: {
          box_id?: string | null
          concluido?: boolean | null
          condicoes_verificadas?: boolean | null
          created_at?: string
          data_conclusao?: string | null
          foto_final?: string | null
          foto_geral?: string | null
          foto_porta?: string | null
          foto_vidro_fixo?: string | null
          id?: string
          limpeza_feita?: boolean | null
          ordem_id?: string
          porta_aplicada?: boolean | null
          porta_retirada?: boolean | null
          remontagem_concluida?: boolean | null
          updated_at?: string
          valor?: number | null
          vidro_fixo_aplicado?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "processo_pelicula_box_id_fkey"
            columns: ["box_id"]
            isOneToOne: false
            referencedRelation: "box_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processo_pelicula_ordem_id_fkey"
            columns: ["ordem_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      servicos: {
        Row: {
          ativo: boolean | null
          created_at: string
          descricao: string | null
          id: string
          nome: string
          tipo: string
          updated_at: string
          valor_base: number | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          tipo: string
          updated_at?: string
          valor_base?: number | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string
          valor_base?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vidracarias: {
        Row: {
          bairro: string | null
          banco_agencia: string | null
          banco_conta: string | null
          banco_nome: string | null
          cep: string
          cidade: string | null
          cnpj: string
          comissao_percentual: number | null
          complemento: string | null
          created_at: string
          data_aprovacao: string | null
          email: string
          endereco: string | null
          estado: string | null
          id: string
          latitude: number | null
          longitude: number | null
          nome_fantasia: string | null
          numero: string | null
          observacoes: string | null
          pix_chave: string | null
          razao_social: string
          responsavel_nome: string | null
          responsavel_telefone: string | null
          status: Database["public"]["Enums"]["status_geral"] | null
          telefone: string
          total_indicacoes: number | null
          updated_at: string
          user_id: string | null
          valor_comissoes: number | null
          whatsapp: string | null
        }
        Insert: {
          bairro?: string | null
          banco_agencia?: string | null
          banco_conta?: string | null
          banco_nome?: string | null
          cep: string
          cidade?: string | null
          cnpj: string
          comissao_percentual?: number | null
          complemento?: string | null
          created_at?: string
          data_aprovacao?: string | null
          email: string
          endereco?: string | null
          estado?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome_fantasia?: string | null
          numero?: string | null
          observacoes?: string | null
          pix_chave?: string | null
          razao_social: string
          responsavel_nome?: string | null
          responsavel_telefone?: string | null
          status?: Database["public"]["Enums"]["status_geral"] | null
          telefone: string
          total_indicacoes?: number | null
          updated_at?: string
          user_id?: string | null
          valor_comissoes?: number | null
          whatsapp?: string | null
        }
        Update: {
          bairro?: string | null
          banco_agencia?: string | null
          banco_conta?: string | null
          banco_nome?: string | null
          cep?: string
          cidade?: string | null
          cnpj?: string
          comissao_percentual?: number | null
          complemento?: string | null
          created_at?: string
          data_aprovacao?: string | null
          email?: string
          endereco?: string | null
          estado?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome_fantasia?: string | null
          numero?: string | null
          observacoes?: string | null
          pix_chave?: string | null
          razao_social?: string
          responsavel_nome?: string | null
          responsavel_telefone?: string | null
          status?: Database["public"]["Enums"]["status_geral"] | null
          telefone?: string
          total_indicacoes?: number | null
          updated_at?: string
          user_id?: string | null
          valor_comissoes?: number | null
          whatsapp?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      forma_pagamento:
        | "pix"
        | "cartao_credito"
        | "cartao_debito"
        | "boleto"
        | "dinheiro"
        | "transferencia"
      status_geral:
        | "pendente"
        | "aprovado"
        | "rejeitado"
        | "ativo"
        | "inativo"
        | "concluido"
        | "cancelado"
        | "andamento"
      tipo_documento: "cpf" | "cnpj"
      tipo_veiculo: "carro" | "moto" | "ambos"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
      forma_pagamento: [
        "pix",
        "cartao_credito",
        "cartao_debito",
        "boleto",
        "dinheiro",
        "transferencia",
      ],
      status_geral: [
        "pendente",
        "aprovado",
        "rejeitado",
        "ativo",
        "inativo",
        "concluido",
        "cancelado",
        "andamento",
      ],
      tipo_documento: ["cpf", "cnpj"],
      tipo_veiculo: ["carro", "moto", "ambos"],
    },
  },
} as const
