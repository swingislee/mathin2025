export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  edu_core: {
    Tables: {
      attendance: {
        Row: {
          remark: string | null
          session_id: string
          status: string
          student_id: string
        }
        Insert: {
          remark?: string | null
          session_id: string
          status: string
          student_id: string
        }
        Update: {
          remark?: string | null
          session_id?: string
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      class_students: {
        Row: {
          class_id: string
          id: string
          student_id: string
        }
        Insert: {
          class_id: string
          id?: string
          student_id: string
        }
        Update: {
          class_id?: string
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_students_class_id_fkey"
            columns: ["class_id"]
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_students_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      classes: {
        Row: {
          assessment_difficulty: string | null
          campus: string | null
          class_name: string
          class_status: string | null
          classrooms: string | null
          course_fee: number | null
          course_id: string | null
          created_at: string | null
          current_session: number | null
          end_time: string | null
          enrolled_students: number | null
          grades: string | null
          id: string
          is_published: boolean | null
          max_students: number | null
          planned_capacity: number | null
          season: string | null
          start_time: string | null
          subject: string | null
          teacher_id: string | null
          total_sessions: number | null
          updated_at: string | null
        }
        Insert: {
          assessment_difficulty?: string | null
          campus?: string | null
          class_name: string
          class_status?: string | null
          classrooms?: string | null
          course_fee?: number | null
          course_id?: string | null
          created_at?: string | null
          current_session?: number | null
          end_time?: string | null
          enrolled_students?: number | null
          grades?: string | null
          id?: string
          is_published?: boolean | null
          max_students?: number | null
          planned_capacity?: number | null
          season?: string | null
          start_time?: string | null
          subject?: string | null
          teacher_id?: string | null
          total_sessions?: number | null
          updated_at?: string | null
        }
        Update: {
          assessment_difficulty?: string | null
          campus?: string | null
          class_name?: string
          class_status?: string | null
          classrooms?: string | null
          course_fee?: number | null
          course_id?: string | null
          created_at?: string | null
          current_session?: number | null
          end_time?: string | null
          enrolled_students?: number | null
          grades?: string | null
          id?: string
          is_published?: boolean | null
          max_students?: number | null
          planned_capacity?: number | null
          season?: string | null
          start_time?: string | null
          subject?: string | null
          teacher_id?: string | null
          total_sessions?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_teacher_id_fkey"
            columns: ["teacher_id"]
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          grade: string
          id: string
          level: string | null
          name: string
          season: string
          season_order: number
          series: string
          updated_at: string | null
          version: string
        }
        Insert: {
          created_at?: string | null
          grade: string
          id?: string
          level?: string | null
          name: string
          season: string
          season_order?: number
          series: string
          updated_at?: string | null
          version: string
        }
        Update: {
          created_at?: string | null
          grade?: string
          id?: string
          level?: string | null
          name?: string
          season?: string
          season_order?: number
          series?: string
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      lecture_resources: {
        Row: {
          config: Json | null
          created_at: string | null
          display_order: number
          lecture_id: string
          resource_id: string
          slot: string
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          display_order?: number
          lecture_id: string
          resource_id: string
          slot: string
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          display_order?: number
          lecture_id?: string
          resource_id?: string
          slot?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lecture_resources_lecture_id_fkey"
            columns: ["lecture_id"]
            referencedRelation: "lectures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lecture_resources_resource_id_fkey"
            columns: ["resource_id"]
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      lectures: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          id: string
          lecture_number: number
          title: string | null
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          lecture_number: number
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          lecture_number?: number
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lectures_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          component_path: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          name: string
          order: number | null
          storage_path: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          component_path?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name: string
          order?: number | null
          storage_path?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          component_path?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          order?: number | null
          storage_path?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rooms: {
        Row: {
          building: string | null
          capacity: number
          floor: number
          id: string
          room_number: string | null
        }
        Insert: {
          building?: string | null
          capacity: number
          floor: number
          id?: string
          room_number?: string | null
        }
        Update: {
          building?: string | null
          capacity?: number
          floor?: number
          id?: string
          room_number?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          class_id: string
          course_id: string
          created_at: string | null
          end_time: string | null
          id: string
          lecture_id: string | null
          notes: string | null
          room_id: string | null
          start_time: string
          teacher_id: string | null
          updated_at: string | null
        }
        Insert: {
          class_id: string
          course_id: string
          created_at?: string | null
          end_time?: string | null
          id?: string
          lecture_id?: string | null
          notes?: string | null
          room_id?: string | null
          start_time: string
          teacher_id?: string | null
          updated_at?: string | null
        }
        Update: {
          class_id?: string
          course_id?: string
          created_at?: string | null
          end_time?: string | null
          id?: string
          lecture_id?: string | null
          notes?: string | null
          room_id?: string | null
          start_time?: string
          teacher_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_class_id_fkey"
            columns: ["class_id"]
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_lecture_id_fkey"
            columns: ["lecture_id"]
            referencedRelation: "lectures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_room_id_fkey"
            columns: ["room_id"]
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_teacher_id_fkey"
            columns: ["teacher_id"]
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      student_stars: {
        Row: {
          created_at: string
          id: string
          page_index: number
          session_id: string
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          page_index: number
          session_id: string
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          page_index?: number
          session_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_stars_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_stars_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      students: {
        Row: {
          contact_info: string | null
          extra_info: Json | null
          registration_time: string | null
          student_id: string
          student_name: string
          student_number: string
          study_coins: number | null
          wechat: string | null
        }
        Insert: {
          contact_info?: string | null
          extra_info?: Json | null
          registration_time?: string | null
          student_id?: string
          student_name: string
          student_number?: string
          study_coins?: number | null
          wechat?: string | null
        }
        Update: {
          contact_info?: string | null
          extra_info?: Json | null
          registration_time?: string | null
          student_id?: string
          student_name?: string
          student_number?: string
          study_coins?: number | null
          wechat?: string | null
        }
        Relationships: []
      }
      teachers: {
        Row: {
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          hire_date: string | null
          id: string
          is_active: boolean | null
          name: string
          phone_number: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone_number?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone_number?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  next_auth: {
    Tables: {
      "2fa_confirmation": {
        Row: {
          id: string
          userId: string
        }
        Insert: {
          id?: string
          userId: string
        }
        Update: {
          id?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "2fa_confirmation_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          oauth_token: string | null
          oauth_token_secret: string | null
          provider: string
          providerAccountId: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          userId: string | null
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          oauth_token?: string | null
          oauth_token_secret?: string | null
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          userId?: string | null
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          oauth_token?: string | null
          oauth_token_secret?: string | null
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      password_reset_token: {
        Row: {
          email: string
          expires: string
          id: string
          token: string
        }
        Insert: {
          email: string
          expires: string
          id?: string
          token: string
        }
        Update: {
          email?: string
          expires?: string
          id?: string
          token?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          expires: string
          id: string
          sessionToken: string
          userId: string | null
        }
        Insert: {
          expires: string
          id?: string
          sessionToken: string
          userId?: string | null
        }
        Update: {
          expires?: string
          id?: string
          sessionToken?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      two_factor_token: {
        Row: {
          email: string
          expires: string
          id: string
          token: string
        }
        Insert: {
          email: string
          expires: string
          id?: string
          token: string
        }
        Update: {
          email?: string
          expires?: string
          id?: string
          token?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          email: string | null
          emailVerified: string | null
          id: string
          image: string | null
          is2FAEnabled: boolean
          name: string | null
          password: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          email?: string | null
          emailVerified?: string | null
          id?: string
          image?: string | null
          is2FAEnabled?: boolean
          name?: string | null
          password?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          email?: string | null
          emailVerified?: string | null
          id?: string
          image?: string | null
          is2FAEnabled?: boolean
          name?: string | null
          password?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      verification_tokens: {
        Row: {
          email: string | null
          expires: string
          id: string
          identifier: string | null
          token: string | null
          userId: string | null
        }
        Insert: {
          email?: string | null
          expires: string
          id?: string
          identifier?: string | null
          token?: string | null
          userId?: string | null
        }
        Update: {
          email?: string | null
          expires?: string
          id?: string
          identifier?: string | null
          token?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_tokens_userId_fkey"
            columns: ["userId"]
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
      uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  pgbouncer: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth: {
        Args: { p_usename: string }
        Returns: {
          username: string
          password: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      game_nonogram_q: {
        Row: {
          created_at: string | null
          draw_area: Json
          id: number
          left_prompt: Json
          top_prompt: Json
          type: string | null
          usage_scenarios: string[] | null
        }
        Insert: {
          created_at?: string | null
          draw_area: Json
          id?: number
          left_prompt: Json
          top_prompt: Json
          type?: string | null
          usage_scenarios?: string[] | null
        }
        Update: {
          created_at?: string | null
          draw_area?: Json
          id?: number
          left_prompt?: Json
          top_prompt?: Json
          type?: string | null
          usage_scenarios?: string[] | null
        }
        Relationships: []
      }
      note: {
        Row: {
          content: string | null
          cover_image: string | null
          created_at: string | null
          icon: string | null
          id: string
          is_archived: boolean
          is_published: boolean
          parent_note_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_archived?: boolean
          is_published?: boolean
          parent_note_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_archived?: boolean
          is_published?: boolean
          parent_note_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_parent_note_id_fkey"
            columns: ["parent_note_id"]
            referencedRelation: "note"
            referencedColumns: ["id"]
          },
        ]
      }
      note_content_query: {
        Row: {
          last_updated: string | null
          note_id: string
        }
        Insert: {
          last_updated?: string | null
          note_id: string
        }
        Update: {
          last_updated?: string | null
          note_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_content_query_note_id_fkey"
            columns: ["note_id"]
            referencedRelation: "note"
            referencedColumns: ["id"]
          },
        ]
      }
      note_diffs: {
        Row: {
          diff: Json | null
          id: number
          inserted_at: string | null
          note_id: string | null
          updated_at: string | null
        }
        Insert: {
          diff?: Json | null
          id?: number
          inserted_at?: string | null
          note_id?: string | null
          updated_at?: string | null
        }
        Update: {
          diff?: Json | null
          id?: number
          inserted_at?: string | null
          note_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "note_diffs_note_id_fkey"
            columns: ["note_id"]
            referencedRelation: "note"
            referencedColumns: ["id"]
          },
        ]
      }
      note_query: {
        Row: {
          last_updated: string
          note_id: string
          parent_note_id: string | null
          user_id: string | null
        }
        Insert: {
          last_updated: string
          note_id: string
          parent_note_id?: string | null
          user_id?: string | null
        }
        Update: {
          last_updated?: string
          note_id?: string
          parent_note_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "note_query_note_id_fkey"
            columns: ["note_id"]
            referencedRelation: "note"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "note_query_parent_note_id_fkey"
            columns: ["parent_note_id"]
            referencedRelation: "note"
            referencedColumns: ["id"]
          },
        ]
      }
      学情统计: {
        Row: {
          created_at: string
          id: number
          学情记录: string | null
          学生id: string
          当堂课总星数: number | null
          星: number | null
          讲次: number | null
          课程id: string | null
          课程环节: string | null
          雷: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          学情记录?: string | null
          学生id: string
          当堂课总星数?: number | null
          星?: number | null
          讲次?: number | null
          课程id?: string | null
          课程环节?: string | null
          雷?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          学情记录?: string | null
          学生id?: string
          当堂课总星数?: number | null
          星?: number | null
          讲次?: number | null
          课程id?: string | null
          课程环节?: string | null
          雷?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      note_aggregated_diffs: {
        Row: {
          diffs: Json | null
          note_id: string | null
          num_diffs: number | null
        }
        Relationships: [
          {
            foreignKeyName: "note_diffs_note_id_fkey"
            columns: ["note_id"]
            referencedRelation: "note"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      asset_movement_type_enum:
        | "stock_in"
        | "borrowed"
        | "returned"
        | "consumed"
        | "maintenance"
        | "retired"
      asset_status_enum: "available" | "in_use" | "maintenance" | "retired"
      asset_type_enum:
        | "office_supply"
        | "learning_tool"
        | "furniture"
        | "electronic_equipment"
      student_status_enum:
        | "潜在用户"
        | "初步了解"
        | "尝试中"
        | "已报课"
        | "停课中"
        | "已结课"
        | "已退课"
        | "长期流失"
        | "复课"
      user_role: "ADMIN" | "USER" | "TEACHER" | "STUDENT"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          format: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          format?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          format?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      iceberg_namespaces: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_namespaces_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      iceberg_tables: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          location: string
          name: string
          namespace_id: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id?: string
          location: string
          name: string
          namespace_id: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          location?: string
          name?: string
          namespace_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_tables_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iceberg_tables_namespace_id_fkey"
            columns: ["namespace_id"]
            referencedRelation: "iceberg_namespaces"
            referencedColumns: ["id"]
          },
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          level: number | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      prefixes: {
        Row: {
          bucket_id: string
          created_at: string | null
          level: number
          name: string
          updated_at: string | null
        }
        Insert: {
          bucket_id: string
          created_at?: string | null
          level?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string
          created_at?: string | null
          level?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prefixes_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_prefixes: {
        Args: { _bucket_id: string; _name: string }
        Returns: undefined
      }
      can_insert_object: {
        Args: { bucketid: string; name: string; owner: string; metadata: Json }
        Returns: undefined
      }
      delete_prefix: {
        Args: { _bucket_id: string; _name: string }
        Returns: boolean
      }
      extension: {
        Args: { name: string }
        Returns: string
      }
      filename: {
        Args: { name: string }
        Returns: string
      }
      foldername: {
        Args: { name: string }
        Returns: string[]
      }
      get_level: {
        Args: { name: string }
        Returns: number
      }
      get_prefix: {
        Args: { name: string }
        Returns: string
      }
      get_prefixes: {
        Args: { name: string }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
      search_legacy_v1: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
      search_v1_optimised: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
      search_v2: {
        Args: {
          prefix: string
          bucket_name: string
          limits?: number
          levels?: number
          start_after?: string
        }
        Returns: {
          key: string
          name: string
          id: string
          updated_at: string
          created_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS"
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
  edu_core: {
    Enums: {},
  },
  graphql_public: {
    Enums: {},
  },
  next_auth: {
    Enums: {},
  },
  pgbouncer: {
    Enums: {},
  },
  public: {
    Enums: {
      asset_movement_type_enum: [
        "stock_in",
        "borrowed",
        "returned",
        "consumed",
        "maintenance",
        "retired",
      ],
      asset_status_enum: ["available", "in_use", "maintenance", "retired"],
      asset_type_enum: [
        "office_supply",
        "learning_tool",
        "furniture",
        "electronic_equipment",
      ],
      student_status_enum: [
        "潜在用户",
        "初步了解",
        "尝试中",
        "已报课",
        "停课中",
        "已结课",
        "已退课",
        "长期流失",
        "复课",
      ],
      user_role: ["ADMIN", "USER", "TEACHER", "STUDENT"],
    },
  },
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS"],
    },
  },
} as const
