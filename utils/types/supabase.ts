export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
        Args: {
          p_usename: string
        }
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
          {
            foreignKeyName: "note_user_id_fkey1"
            columns: ["user_id"]
            referencedRelation: "users"
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
      出勤: {
        Row: {
          出勤id: string
          出勤状态: string | null
          成绩: number | null
          报名id: string | null
          课上学习情况: string | null
          课后作业完成情况: string | null
          课次编号: string | null
          进门考成绩: number | null
        }
        Insert: {
          出勤id?: string
          出勤状态?: string | null
          成绩?: number | null
          报名id?: string | null
          课上学习情况?: string | null
          课后作业完成情况?: string | null
          课次编号?: string | null
          进门考成绩?: number | null
        }
        Update: {
          出勤id?: string
          出勤状态?: string | null
          成绩?: number | null
          报名id?: string | null
          课上学习情况?: string | null
          课后作业完成情况?: string | null
          课次编号?: string | null
          进门考成绩?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "出勤_报名id_fkey"
            columns: ["报名id"]
            referencedRelation: "报名"
            referencedColumns: ["报名id"]
          },
        ]
      }
      学生档案: {
        Row: {
          其他信息: Json | null
          学生id: string
          学生姓名: string
          学生状态: string | null
          微信: string | null
          注册时间: string | null
          联系方式: string | null
        }
        Insert: {
          其他信息?: Json | null
          学生id?: string
          学生姓名: string
          学生状态?: string | null
          微信?: string | null
          注册时间?: string | null
          联系方式?: string | null
        }
        Update: {
          其他信息?: Json | null
          学生id?: string
          学生姓名?: string
          学生状态?: string | null
          微信?: string | null
          注册时间?: string | null
          联系方式?: string | null
        }
        Relationships: []
      }
      家长沟通: {
        Row: {
          家长反馈: string | null
          报名id: string | null
          沟通id: string
          沟通内容: string | null
          沟通方式: string | null
          沟通时间: string | null
        }
        Insert: {
          家长反馈?: string | null
          报名id?: string | null
          沟通id?: string
          沟通内容?: string | null
          沟通方式?: string | null
          沟通时间?: string | null
        }
        Update: {
          家长反馈?: string | null
          报名id?: string | null
          沟通id?: string
          沟通内容?: string | null
          沟通方式?: string | null
          沟通时间?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "家长沟通_报名id_fkey"
            columns: ["报名id"]
            referencedRelation: "报名"
            referencedColumns: ["报名id"]
          },
        ]
      }
      报名: {
        Row: {
          报名id: string
          报名时间: string | null
          是否支付: boolean | null
          用户id: string | null
          课程id: string | null
          退课状态: string | null
        }
        Insert: {
          报名id?: string
          报名时间?: string | null
          是否支付?: boolean | null
          用户id?: string | null
          课程id?: string | null
          退课状态?: string | null
        }
        Update: {
          报名id?: string
          报名时间?: string | null
          是否支付?: boolean | null
          用户id?: string | null
          课程id?: string | null
          退课状态?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "报名_用户id_fkey"
            columns: ["用户id"]
            referencedRelation: "学生档案"
            referencedColumns: ["学生id"]
          },
          {
            foreignKeyName: "报名_课程id_fkey"
            columns: ["课程id"]
            referencedRelation: "课程"
            referencedColumns: ["课程id"]
          },
        ]
      }
      直播课程: {
        Row: {
          参与人数: number | null
          新增关注: number | null
          直播id: string
          直播主题: string | null
          直播内容: string | null
          直播时间: string | null
        }
        Insert: {
          参与人数?: number | null
          新增关注?: number | null
          直播id?: string
          直播主题?: string | null
          直播内容?: string | null
          直播时间?: string | null
        }
        Update: {
          参与人数?: number | null
          新增关注?: number | null
          直播id?: string
          直播主题?: string | null
          直播内容?: string | null
          直播时间?: string | null
        }
        Relationships: []
      }
      练习打卡: {
        Row: {
          完成状态: string | null
          打卡id: string
          打卡日期: string | null
          报名id: string | null
          练习内容: string | null
        }
        Insert: {
          完成状态?: string | null
          打卡id?: string
          打卡日期?: string | null
          报名id?: string | null
          练习内容?: string | null
        }
        Update: {
          完成状态?: string | null
          打卡id?: string
          打卡日期?: string | null
          报名id?: string | null
          练习内容?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "练习打卡_报名id_fkey"
            columns: ["报名id"]
            referencedRelation: "报名"
            referencedColumns: ["报名id"]
          },
        ]
      }
      老师备课: {
        Row: {
          备课id: string
          备课内容: string | null
          备课日期: string | null
          老师名称: string | null
        }
        Insert: {
          备课id?: string
          备课内容?: string | null
          备课日期?: string | null
          老师名称?: string | null
        }
        Update: {
          备课id?: string
          备课内容?: string | null
          备课日期?: string | null
          老师名称?: string | null
        }
        Relationships: []
      }
      考试成绩: {
        Row: {
          成绩: number | null
          报名id: string | null
          考试id: string
          考试时间: string | null
          考试类型: string | null
        }
        Insert: {
          成绩?: number | null
          报名id?: string | null
          考试id?: string
          考试时间?: string | null
          考试类型?: string | null
        }
        Update: {
          成绩?: number | null
          报名id?: string | null
          考试id?: string
          考试时间?: string | null
          考试类型?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "考试成绩_报名id_fkey"
            columns: ["报名id"]
            referencedRelation: "报名"
            referencedColumns: ["报名id"]
          },
        ]
      }
      获客信息: {
        Row: {
          沟通时间: string | null
          沟通结果: string | null
          用户id: string | null
          获客id: string
          获客渠道: string | null
        }
        Insert: {
          沟通时间?: string | null
          沟通结果?: string | null
          用户id?: string | null
          获客id?: string
          获客渠道?: string | null
        }
        Update: {
          沟通时间?: string | null
          沟通结果?: string | null
          用户id?: string | null
          获客id?: string
          获客渠道?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "获客信息_用户id_fkey"
            columns: ["用户id"]
            referencedRelation: "学生档案"
            referencedColumns: ["学生id"]
          },
        ]
      }
      课程: {
        Row: {
          开始时间: string | null
          授课老师: string | null
          结束时间: string | null
          课程id: string
          课程内容: string | null
          课程名称: string
          课程类型: string | null
        }
        Insert: {
          开始时间?: string | null
          授课老师?: string | null
          结束时间?: string | null
          课程id?: string
          课程内容?: string | null
          课程名称: string
          课程类型?: string | null
        }
        Update: {
          开始时间?: string | null
          授课老师?: string | null
          结束时间?: string | null
          课程id?: string
          课程内容?: string | null
          课程名称?: string
          课程类型?: string | null
        }
        Relationships: []
      }
      选拔活动参与: {
        Row: {
          参与id: string
          参与时间: string | null
          家长反馈: string | null
          活动名称: string | null
          活动成绩: number | null
          用户id: string | null
        }
        Insert: {
          参与id?: string
          参与时间?: string | null
          家长反馈?: string | null
          活动名称?: string | null
          活动成绩?: number | null
          用户id?: string | null
        }
        Update: {
          参与id?: string
          参与时间?: string | null
          家长反馈?: string | null
          活动名称?: string | null
          活动成绩?: number | null
          用户id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "选拔活动参与_用户id_fkey"
            columns: ["用户id"]
            referencedRelation: "学生档案"
            referencedColumns: ["学生id"]
          },
        ]
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
          updated_at?: string | null
        }
        Relationships: []
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
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
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
