import { Database } from "./supabase";

export type NoteRow = Database["public"]["Tables"]["note"]["Row"];

export type User_Role = Database["public"]["Enums"]["user_role"]

export type NoteQuery = Database["public"]["Tables"]["note_query"]["Row"];

export type UserRow = Database["public"]["Tables"]['auth_user']["Row"];

export type NonogramsQ = Database["public"]["Tables"]['game_nonogram_q']['Row'];