let extractorPromise: Promise<any> | null = null;

const getExtractor = async () => {
    if (!extractorPromise) {
        extractorPromise = import('@xenova/transformers')
            .then(({ pipeline }) => pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2'));
    }

    return extractorPromise;
};

export const embedText = async (text: string): Promise<number[]> => {
    const normalized = text.trim();
    if (!normalized) return [];

    const extractor = await getExtractor();
    const output = await extractor(normalized, { pooling: 'mean', normalize: true });
    return Array.from(output.data as ArrayLike<number>);
};
