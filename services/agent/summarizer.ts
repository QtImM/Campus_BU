import { AgentHistoryItem } from './types';

const clip = (value: string, max = 100): string => value.length > max ? `${value.slice(0, max)}...` : value;

export const summarizeHistory = (
    history: AgentHistoryItem[],
    options?: { keepRecent?: number }
): { summary: string; recentHistory: AgentHistoryItem[] } => {
    const keepRecent = options?.keepRecent ?? 6;
    if (history.length <= keepRecent) {
        return {
            summary: '',
            recentHistory: history,
        };
    }

    const older = history.slice(0, -keepRecent);
    const recentHistory = history.slice(-keepRecent);

    const summaryLines = older.map((item, index) => `${index + 1}. ${item.role}: ${clip(item.content)}`);

    return {
        summary: `Earlier conversation summary:\n${summaryLines.join('\n')}`,
        recentHistory,
    };
};

