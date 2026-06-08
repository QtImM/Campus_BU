import { supabase } from './supabase';

export interface WeeklyPrompt {
    id: number;
    emoji: string;
    content: string;     // original single-language field (kept for compat)
    content_zh: string;  // Chinese (primary)
    content_en: string;  // English (secondary)
    active_from: string;
    active_until: string;
}

export async function getPromptById(id: number): Promise<WeeklyPrompt | null> {
    const { data, error } = await supabase
        .from('weekly_prompts')
        .select('id, emoji, content, content_zh, content_en, active_from, active_until')
        .eq('id', id)
        .maybeSingle();

    if (error) {
        console.error('[weeklyPrompts] getPromptById failed:', error);
        return null;
    }
    return (data as WeeklyPrompt | null) ?? null;
}

export async function getCurrentPrompt(): Promise<WeeklyPrompt | null> {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
        .from('weekly_prompts')
        .select('id, emoji, content, content_zh, content_en, active_from, active_until')
        .lte('active_from', today)
        .gte('active_until', today)
        .order('active_from', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error('[weeklyPrompts] getCurrentPrompt failed:', error);
        return null;
    }
    return (data as WeeklyPrompt | null) ?? null;
}
