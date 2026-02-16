export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            projects: {
                Row: {
                    id: string
                    created_at: string
                    title: string
                    description: string | null
                    slug: string
                    image_url: string | null
                    tags: string[] | null
                    github_url: string | null
                    live_url: string | null
                    is_featured: boolean
                }
                Insert: {
                    id?: string
                    created_at?: string
                    title: string
                    description?: string | null
                    slug: string
                    image_url?: string | null
                    tags?: string[] | null
                    github_url?: string | null
                    live_url?: string | null
                    is_featured?: boolean
                }
                Update: {
                    id?: string
                    created_at?: string
                    title: string
                    description?: string | null
                    slug: string
                    image_url?: string | null
                    tags?: string[] | null
                    github_url?: string | null
                    live_url?: string | null
                    is_featured?: boolean
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
