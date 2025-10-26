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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action_type: string
          admin_user_id: string | null
          details: Json | null
          id: string
          investment_id: string | null
          ip_address: string | null
          timestamp: string | null
        }
        Insert: {
          action_type: string
          admin_user_id?: string | null
          details?: Json | null
          id?: string
          investment_id?: string | null
          ip_address?: string | null
          timestamp?: string | null
        }
        Update: {
          action_type?: string
          admin_user_id?: string | null
          details?: Json | null
          id?: string
          investment_id?: string | null
          ip_address?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "investments"
            referencedColumns: ["id"]
          },
        ]
      }
      investments: {
        Row: {
          created_at: string
          deposit_amount: number
          expected_return_date: string | null
          id: string
          investment_days: number
          jpy_amount: number | null
          jpy_received_at: string | null
          navi_deployed_at: string | null
          navi_transaction_hash: string | null
          payment_method: string
          payout_jpy_amount: number | null
          payout_processed_at: string | null
          payout_transaction_id: string | null
          product_name: string
          reference_code: string | null
          returns: number
          status: string
          updated_at: string
          usdc_amount: number | null
          usdc_converted_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          deposit_amount: number
          expected_return_date?: string | null
          id?: string
          investment_days: number
          jpy_amount?: number | null
          jpy_received_at?: string | null
          navi_deployed_at?: string | null
          navi_transaction_hash?: string | null
          payment_method: string
          payout_jpy_amount?: number | null
          payout_processed_at?: string | null
          payout_transaction_id?: string | null
          product_name: string
          reference_code?: string | null
          returns?: number
          status?: string
          updated_at?: string
          usdc_amount?: number | null
          usdc_converted_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          deposit_amount?: number
          expected_return_date?: string | null
          id?: string
          investment_days?: number
          jpy_amount?: number | null
          jpy_received_at?: string | null
          navi_deployed_at?: string | null
          navi_transaction_hash?: string | null
          payment_method?: string
          payout_jpy_amount?: number | null
          payout_processed_at?: string | null
          payout_transaction_id?: string | null
          product_name?: string
          reference_code?: string | null
          returns?: number
          status?: string
          updated_at?: string
          usdc_amount?: number | null
          usdc_converted_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      principal_withdrawal_requests: {
        Row: {
          created_at: string
          deposit_usd: number
          id: string
          indicated_jpy_amount: number
          processed_at: string | null
          status: string
          user_email: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deposit_usd: number
          id?: string
          indicated_jpy_amount: number
          processed_at?: string | null
          status?: string
          user_email: string
          user_id: string
        }
        Update: {
          created_at?: string
          deposit_usd?: number
          id?: string
          indicated_jpy_amount?: number
          processed_at?: string | null
          status?: string
          user_email?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_holder_name: string | null
          account_number: string | null
          account_type: string | null
          bank_branch: string | null
          bank_name: string | null
          created_at: string
          email: string | null
          id: string
          jpy_deposit: number | null
          total_returns: number | null
          updated_at: string
          user_id: string
          withdrawal_principal_usd: number | null
        }
        Insert: {
          account_holder_name?: string | null
          account_number?: string | null
          account_type?: string | null
          bank_branch?: string | null
          bank_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          jpy_deposit?: number | null
          total_returns?: number | null
          updated_at?: string
          user_id: string
          withdrawal_principal_usd?: number | null
        }
        Update: {
          account_holder_name?: string | null
          account_number?: string | null
          account_type?: string | null
          bank_branch?: string | null
          bank_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          jpy_deposit?: number | null
          total_returns?: number | null
          updated_at?: string
          user_id?: string
          withdrawal_principal_usd?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      withdrawal_preferences: {
        Row: {
          created_at: string
          frequency: string | null
          id: string
          updated_at: string
          user_id: string
          withdrawal_type: string
        }
        Insert: {
          created_at?: string
          frequency?: string | null
          id?: string
          updated_at?: string
          user_id: string
          withdrawal_type: string
        }
        Update: {
          created_at?: string
          frequency?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          withdrawal_type?: string
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
      log_admin_action: {
        Args: {
          p_action_type: string
          p_details: Json
          p_investment_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
