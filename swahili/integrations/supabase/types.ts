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
      agent_traces: {
        Row: {
          agent_name: string
          created_at: string | null
          duration_ms: number | null
          feedback_score: number | null
          id: string
          input: string
          metadata: Json
          opik_trace_id: string | null
          output: string | null
          session_id: string | null
          user_id: string
        }
        Insert: {
          agent_name: string
          created_at?: string | null
          duration_ms?: number | null
          feedback_score?: number | null
          id?: string
          input: string
          metadata?: Json
          opik_trace_id?: string | null
          output?: string | null
          session_id?: string | null
          user_id: string
        }
        Update: {
          agent_name?: string
          created_at?: string | null
          duration_ms?: number | null
          feedback_score?: number | null
          id?: string
          input?: string
          metadata?: Json
          opik_trace_id?: string | null
          output?: string | null
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_traces_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_sessions: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          messages: Json
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          messages: Json
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          messages?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_progress: {
        Row: {
          created_at: string
          id: string
          last_activity_date: string | null
          lessons_completed: number
          level: number
          longest_streak: number
          streak_days: number
          updated_at: string
          user_id: string
          words_learned: number
          xp: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_activity_date?: string | null
          lessons_completed?: number
          level?: number
          longest_streak?: number
          streak_days?: number
          updated_at?: string
          user_id: string
          words_learned?: number
          xp?: number
        }
        Update: {
          created_at?: string
          id?: string
          last_activity_date?: string | null
          lessons_completed?: number
          level?: number
          longest_streak?: number
          streak_days?: number
          updated_at?: string
          user_id?: string
          words_learned?: number
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "learning_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: number
          review_count: number
          updated_at: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: number
          review_count?: number
          updated_at?: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: number
          review_count?: number
          updated_at?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_sessions: {
        Row: {
          accuracy: number | null
          ended_at: string | null
          id: string
          metadata: Json | null
          session_type: Database["public"]["Enums"]["session_type"]
          started_at: string
          user_id: string
          words_practiced: number
          xp_earned: number
        }
        Insert: {
          accuracy?: number | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          session_type: Database["public"]["Enums"]["session_type"]
          started_at?: string
          user_id: string
          words_practiced?: number
          xp_earned?: number
        }
        Update: {
          accuracy?: number | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          session_type?: Database["public"]["Enums"]["session_type"]
          started_at?: string
          user_id?: string
          words_practiced?: number
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "practice_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          daily_goal_minutes: number
          display_name: string | null
          id: string
          onboarding_completed: boolean
          preferred_difficulty: Database["public"]["Enums"]["difficulty_level"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          daily_goal_minutes?: number
          display_name?: string | null
          id?: string
          onboarding_completed?: boolean
          preferred_difficulty?: Database["public"]["Enums"]["difficulty_level"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          daily_goal_minutes?: number
          display_name?: string | null
          id?: string
          onboarding_completed?: boolean
          preferred_difficulty?: Database["public"]["Enums"]["difficulty_level"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_feedback: {
        Row: {
          created_at: string
          feedback_text: string | null
          feedback_type: string
          id: string
          rating: number
          trace_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback_text?: string | null
          feedback_type?: string
          id?: string
          rating: number
          trace_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          feedback_text?: string | null
          feedback_type?: string
          id?: string
          rating?: number
          trace_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_feedback_trace_id_fkey"
            columns: ["trace_id"]
            isOneToOne: false
            referencedRelation: "agent_traces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_vocabulary: {
        Row: {
          is_favorite: boolean | null
          correct_count: number
          created_at: string
          ease_factor: number
          growth_stage: Database["public"]["Enums"]["growth_stage"]
          id: string
          incorrect_count: number
          interval_days: number
          last_reviewed_at: string | null
          next_review_at: string
          repetitions: number
          updated_at: string
          user_id: string
          word_id: string
        }
        Insert: {
          is_favorite?: boolean | null
          correct_count?: number
          created_at?: string
          ease_factor?: number
          growth_stage?: Database["public"]["Enums"]["growth_stage"]
          id?: string
          incorrect_count?: number
          interval_days?: number
          last_reviewed_at?: string | null
          next_review_at?: string
          repetitions?: number
          updated_at?: string
          user_id: string
          word_id: string
        }
        Update: {
          is_favorite?: boolean | null
          correct_count?: number
          created_at?: string
          ease_factor?: number
          growth_stage?: Database["public"]["Enums"]["growth_stage"]
          id?: string
          incorrect_count?: number
          interval_days?: number
          last_reviewed_at?: string | null
          next_review_at?: string
          repetitions?: number
          updated_at?: string
          user_id?: string
          word_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_vocabulary_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_vocabulary_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "vocabulary_words"
            referencedColumns: ["id"]
          },
        ]
      }
      vocabulary_words: {
        Row: {
          category: string | null
          created_at: string | null
          english: string
          id: string
          stage: string | null
          swahili: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          english: string
          id?: string
          stage?: string | null
          swahili: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          english?: string
          id?: string
          stage?: string | null
          swahili?: string
        }
        Relationships: []
      }
      xp_history: {
        Row: {
          amount: number
          created_at: string
          id: string
          metadata: Json | null
          source: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          metadata?: Json | null
          source: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          source?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "xp_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_get_active_users: {
        Args: {
          days_ago?: number
        }
        Returns: number
      }
      admin_get_feedback_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      admin_get_learning_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      admin_get_session_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      admin_get_trace_breakdown: {
        Args: {
          days_back?: number
        }
        Returns: {
          agent_name: string
          trace_count: number
          successful_traces: number
          avg_feedback: number
          unique_users: number
        }[]
      }
      admin_get_trace_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      admin_get_user_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      admin_get_users_created_between: {
        Args: {
          start_date: string
          end_date: string
        }
        Returns: number
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      difficulty_level: "beginner" | "intermediate" | "advanced"
      growth_stage: "seed" | "sprout" | "growing" | "blooming" | "flourishing"
      session_type: "vocabulary" | "grammar" | "conversation" | "quiz" | "lesson"
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
