'use server';

import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

export type Project = Database['public']['Tables']['projects']['Row'];

export async function fetchProjects() {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching projects:', error);
        throw new Error('Failed to fetch projects');
    }

    return data;
}
