export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      user_allergies: {
        Row: {
          allergy_id: number | null
          created_at: string
          id: string
          other: string | null
          resolved_at: string | null
          user_id: string | null
        }
        Insert: {
          allergy_id?: number | null
          created_at?: string
          id?: string
          other?: string | null
          resolved_at?: string | null
          user_id?: string | null
        }
        Update: {
          allergy_id?: number | null
          created_at?: string
          id?: string
          other?: string | null
          resolved_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_allergies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_bone_density_scans: {
        Row: {
          bone_density_result: Database["public"]["Enums"]["bone_density_result_type"]
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          bone_density_result: Database["public"]["Enums"]["bone_density_result_type"]
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          bone_density_result?: Database["public"]["Enums"]["bone_density_result_type"]
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_bone_density_scans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_family_condition_history: {
        Row: {
          created_at: string
          family_condition_id: number
          id: string
          relative_type: Database["public"]["Enums"]["family_relation"]
          user_id: string
        }
        Insert: {
          created_at?: string
          family_condition_id: number
          id?: string
          relative_type: Database["public"]["Enums"]["family_relation"]
          user_id: string
        }
        Update: {
          created_at?: string
          family_condition_id?: number
          id?: string
          relative_type?: Database["public"]["Enums"]["family_relation"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_family_condition_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_gene_conditions: {
        Row: {
          created_at: string
          gene_condition_id: number
          id: string
          user_id: string
        }
        Insert: {
          created_at: string
          gene_condition_id: number
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          gene_condition_id?: number
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_healthcare: {
        Row: {
          created_at: string | null
          healthcare_number: string
          healthcare_province: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          healthcare_number: string
          healthcare_province: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          healthcare_number?: string
          healthcare_province?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_healthcare_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_mammograms: {
        Row: {
          created_at: string | null
          has_never_had_mammogram: boolean | null
          id: string
          last_mammogram_date: string | null
          mammogram_result:
            | Database["public"]["Enums"]["mammogram_result"]
            | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          has_never_had_mammogram?: boolean | null
          id?: string
          last_mammogram_date?: string | null
          mammogram_result?:
            | Database["public"]["Enums"]["mammogram_result"]
            | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          has_never_had_mammogram?: boolean | null
          id?: string
          last_mammogram_date?: string | null
          mammogram_result?:
            | Database["public"]["Enums"]["mammogram_result"]
            | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_mammograms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_medical_conditions: {
        Row: {
          condition_id: number | null
          created_at: string
          id: string
          other: string | null
          resolved_at: string | null
          user_id: string
        }
        Insert: {
          condition_id?: number | null
          created_at?: string
          id?: string
          other?: string | null
          resolved_at?: string | null
          user_id: string
        }
        Update: {
          condition_id?: number | null
          created_at?: string
          id?: string
          other?: string | null
          resolved_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_medical_conditions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_medical_profile: {
        Row: {
          alcohol: string | null
          blood_pressure: string | null
          bmi: number | null
          cannabis: boolean | null
          cigarettes: boolean | null
          created_at: string
          height: number | null
          updated_at: string | null
          user_id: string
          weight: number | null
        }
        Insert: {
          alcohol?: string | null
          blood_pressure?: string | null
          bmi?: number | null
          cannabis?: boolean | null
          cigarettes?: boolean | null
          created_at?: string
          height?: number | null
          updated_at?: string | null
          user_id: string
          weight?: number | null
        }
        Update: {
          alcohol?: string | null
          blood_pressure?: string | null
          bmi?: number | null
          cannabis?: boolean | null
          cigarettes?: boolean | null
          created_at?: string
          height?: number | null
          updated_at?: string | null
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_medical_profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_medication: {
        Row: {
          created_at: string
          id: string
          medication_id: number | null
          other: string | null
          stopped_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          medication_id?: number | null
          other?: string | null
          stopped_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          medication_id?: number | null
          other?: string | null
          stopped_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_medication_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_surgeries: {
        Row: {
          created_at: string
          had_surgeries: boolean | null
          id: string
          surgery_names: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          had_surgeries?: boolean | null
          id?: string
          surgery_names?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          had_surgeries?: boolean | null
          id?: string
          surgery_names?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_surgeries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          dob: string
          email: string | null
          first_name: string
          last_name: string
          phone: string | null
          province: string | null
          sex: string
          user_id: string
        }
        Insert: {
          address?: string | null
          dob: string
          email?: string | null
          first_name: string
          last_name: string
          phone?: string | null
          province?: string | null
          sex: string
          user_id: string
        }
        Update: {
          address?: string | null
          dob?: string
          email?: string | null
          first_name?: string
          last_name?: string
          phone?: string | null
          province?: string | null
          sex?: string
          user_id?: string
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
      bone_density_result_type:
        | "NEVER_HAD_SCAN"
        | "SCAN_NORMAL"
        | "LOW_BONE_DENSITY"
      family_relation: "IMMEDIATE_FAMILY" | "EXTENDED_FAMILY"
      mammogram_result:
        | "NORMAL"
        | "ABNORMAL_UNDER_INVESTIGATION"
        | "ABNORMAL_CLEARED"
      special_type: "free-text" | "none-above" | "not-special"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
