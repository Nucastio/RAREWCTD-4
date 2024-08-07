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
      books: {
        Row: {
          aiEnabled: boolean | null
          created_at: string | null
          description: string | null
          id: number
          live: boolean | null
          movie_id: string
          policy_id: string[]
          polygonEnabled: boolean | null
          poster_url: string | null
          title: string | null
        }
        Insert: {
          aiEnabled?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: number
          live?: boolean | null
          movie_id: string
          policy_id?: string[]
          polygonEnabled?: boolean | null
          poster_url?: string | null
          title?: string | null
        }
        Update: {
          aiEnabled?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: number
          live?: boolean | null
          movie_id?: string
          policy_id?: string[]
          polygonEnabled?: boolean | null
          poster_url?: string | null
          title?: string | null
        }
        Relationships: []
      }
      conversation_log: {
        Row: {
          created_at: string | null
          id: number
          log_id: string | null
          message: string | null
          sender: string | null
          session_id: string | null
          wallet_address: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          log_id?: string | null
          message?: string | null
          sender?: string | null
          session_id?: string | null
          wallet_address?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          log_id?: string | null
          message?: string | null
          sender?: string | null
          session_id?: string | null
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_log_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "conversation_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      conversation_sessions: {
        Row: {
          character_id: string | null
          created_at: string | null
          id: number
          index_id: string | null
          session_id: string
        }
        Insert: {
          character_id?: string | null
          created_at?: string | null
          id?: number
          index_id?: string | null
          session_id?: string
        }
        Update: {
          character_id?: string | null
          created_at?: string | null
          id?: number
          index_id?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_sessions_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "indexes_characters"
            referencedColumns: ["character_id"]
          },
          {
            foreignKeyName: "conversation_sessions_index_id_fkey"
            columns: ["index_id"]
            isOneToOne: false
            referencedRelation: "feeded_indexes"
            referencedColumns: ["index_id"]
          },
        ]
      }
      feeded_indexes: {
        Row: {
          book_id: string | null
          created_at: string | null
          id: number
          index_id: string
          movie_id: string | null
        }
        Insert: {
          book_id?: string | null
          created_at?: string | null
          id?: number
          index_id?: string
          movie_id?: string | null
        }
        Update: {
          book_id?: string | null
          created_at?: string | null
          id?: number
          index_id?: string
          movie_id?: string | null
        }
        Relationships: []
      }
      indexes_characters: {
        Row: {
          character_id: string
          character_image: string | null
          character_name: string | null
          created_at: string | null
          id: number
          index_id: string | null
          live: boolean | null
          prompt_template: string | null
        }
        Insert: {
          character_id: string
          character_image?: string | null
          character_name?: string | null
          created_at?: string | null
          id: number
          index_id?: string | null
          live?: boolean | null
          prompt_template?: string | null
        }
        Update: {
          character_id?: string
          character_image?: string | null
          character_name?: string | null
          created_at?: string | null
          id?: number
          index_id?: string | null
          live?: boolean | null
          prompt_template?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "indexes_characters_index_id_fkey"
            columns: ["index_id"]
            isOneToOne: false
            referencedRelation: "feeded_indexes"
            referencedColumns: ["index_id"]
          },
        ]
      }
      movies: {
        Row: {
          aiEnabled: boolean | null
          created_at: string | null
          description: string | null
          id: number
          live: boolean | null
          movie_id: string
          policy_id: string[]
          polygonEnabled: boolean | null
          poster_url: string | null
          title: string | null
        }
        Insert: {
          aiEnabled?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: number
          live?: boolean | null
          movie_id: string
          policy_id?: string[]
          polygonEnabled?: boolean | null
          poster_url?: string | null
          title?: string | null
        }
        Update: {
          aiEnabled?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: number
          live?: boolean | null
          movie_id?: string
          policy_id?: string[]
          polygonEnabled?: boolean | null
          poster_url?: string | null
          title?: string | null
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
