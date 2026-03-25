type KnowledgeBaseRow = {
    content: string;
    metadata?: Record<string, any>;
    similarity?: number;
};

export type RankedKnowledgeBaseRow = KnowledgeBaseRow & {
    score: number;
};

const normalize = (value: string): string => value
    .toLowerCase()
    .replace(/[？?！!，,。.:：;；"'`()\[\]{}<>/\-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const expandRetrievalTerms = (query: string): string[] => {
    const normalized = normalize(query);
    const terms = new Set(normalized.split(' ').filter(Boolean));

    const synonymGroups: Array<{ patterns: RegExp[]; terms: string[] }> = [
        { patterns: [/gpa|绩点|績點|平均分/], terms: ['gpa', '绩点', '平均分'] },
        { patterns: [/library|图书馆|圖書館|main lib/], terms: ['library', '图书馆'] },
        { patterns: [/calendar|校历|校曆|academic calendar/], terms: ['calendar', '校历', 'academic calendar'] },
        { patterns: [/hall|宿舍|住宿|residence/], terms: ['hall', '宿舍', '住宿'] },
        { patterns: [/wifi|eduroam|internet|网络|網絡/], terms: ['wifi', 'eduroam', 'internet', '网络'] },
        { patterns: [/it service|it support|ito|技术支持|技術支援/], terms: ['it support', 'it service', 'ito'] },
        { patterns: [/tuition|fee|学费|學費|费用|費用/], terms: ['tuition', 'fee', '学费', '费用'] },
        { patterns: [/visa|签证|簽證|iang/], terms: ['visa', '签证', 'iang'] },
        { patterns: [/transcript|成绩单|成績單/], terms: ['transcript', '成绩单'] },
    ];

    synonymGroups.forEach(group => {
        if (group.patterns.some(pattern => pattern.test(normalized))) {
            group.terms.forEach(term => terms.add(term));
        }
    });

    return Array.from(terms);
};

const scoreRow = (query: string, row: KnowledgeBaseRow): number => {
    const normalizedQuery = normalize(query);
    const queryTerms = expandRetrievalTerms(query);
    const content = normalize(row.content || '');
    const metadataText = normalize(Object.values(row.metadata || {}).join(' '));

    let score = typeof row.similarity === 'number' ? row.similarity * 10 : 0;

    if (content.includes(normalizedQuery)) score += 10;
    if (metadataText && metadataText.includes(normalizedQuery)) score += 6;

    queryTerms.forEach(term => {
        if (content.includes(term)) score += 3;
        if (metadataText.includes(term)) score += 2;
    });

    return score;
};

export const rerankKnowledgeBaseResults = (
    query: string,
    rows: KnowledgeBaseRow[]
): RankedKnowledgeBaseRow[] => {
    return rows
        .map(row => ({
            ...row,
            score: scoreRow(query, row),
        }))
        .filter(row => row.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);
};

export const inferRetrievalTopic = (
    query: string,
    faqQuestion?: string,
    kbMetadata?: Record<string, any>
): string => {
    const fallback = faqQuestion || query;
    const header = [kbMetadata?.h2, kbMetadata?.h3].filter(Boolean).join(' / ');
    return header || fallback;
};

export const buildEvidenceSnippet = (content: string, max = 140): string => {
    const flattened = String(content || '').replace(/\s+/g, ' ').trim();
    return flattened.length > max ? `${flattened.slice(0, max)}...` : flattened;
};

