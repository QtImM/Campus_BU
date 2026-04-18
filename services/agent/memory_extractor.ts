import type {
    AcceptedMemoryWrite,
    DurableMemoryType,
    MemoryCandidate,
} from './types';

const MEMORY_CONFIDENCE_THRESHOLD = 0.75;
const MAX_MEMORY_VALUE_LENGTH = 160;

const GENERIC_KEYS = new Set(['data', 'info', 'memory', 'thing', 'user_data']);

const CANONICAL_KEY_MAP: Record<string, string> = {
    call_me_name: 'nickname',
    exchange_plan: 'future_plan.exchange',
    exchange_plan_next_term: 'future_plan.exchange',
    favorite_food: 'favorite_food',
    food_like: 'favorite_food',
    food_preference: 'favorite_food',
    preferred_name: 'nickname',
    nickname: 'nickname',
    study_abroad_plan: 'future_plan.exchange',
};

const ALLOWED_TYPES = new Set<DurableMemoryType>([
    'background_fact',
    'long_term_preference',
]);

const SENSITIVE_VALUE_PATTERN =
    /\b\d{15,19}\b|\b(?:password|bank|passport|ssn|social security|credit card|card number)\b/i;

const normalizeKeyShape = (rawKey: string): string => {
    return rawKey
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9._-]/g, '');
};

const isGenericKey = (normalizedKey: string): boolean => {
    return GENERIC_KEYS.has(normalizedKey);
};

const isSensitiveValue = (value: string): boolean => {
    return SENSITIVE_VALUE_PATTERN.test(value);
};

const isDurableMemoryType = (type: MemoryCandidate['memory_type']): type is DurableMemoryType => {
    return ALLOWED_TYPES.has(type as DurableMemoryType);
};

export const normalizeMemoryKey = (rawKey: string): string | null => {
    const normalizedKey = normalizeKeyShape(rawKey);

    if (!normalizedKey || normalizedKey.length < 2 || normalizedKey.length > 64) {
        return null;
    }

    if (isGenericKey(normalizedKey)) {
        return null;
    }

    return CANONICAL_KEY_MAP[normalizedKey] ?? normalizedKey;
};

export const filterMemoryCandidates = (
    candidates: MemoryCandidate[],
    existingFacts: Record<string, string>
): AcceptedMemoryWrite[] => {
    const accepted: AcceptedMemoryWrite[] = [];
    const acceptedPairs = new Set<string>();

    for (const candidate of candidates) {
        if (!candidate.should_store) {
            continue;
        }

        if (!isDurableMemoryType(candidate.memory_type)) {
            continue;
        }

        if (candidate.confidence < MEMORY_CONFIDENCE_THRESHOLD) {
            continue;
        }

        const normalizedKey = normalizeMemoryKey(candidate.key);
        const normalizedValue = candidate.value.trim();

        if (!normalizedKey || !normalizedValue) {
            continue;
        }

        if (normalizedValue.length > MAX_MEMORY_VALUE_LENGTH) {
            continue;
        }

        if (isSensitiveValue(normalizedValue)) {
            continue;
        }

        if (existingFacts[normalizedKey] === normalizedValue) {
            continue;
        }

        const acceptedPairKey = `${normalizedKey}::${normalizedValue}`;
        if (acceptedPairs.has(acceptedPairKey)) {
            continue;
        }

        acceptedPairs.add(acceptedPairKey);
        accepted.push({
            key: normalizedKey,
            value: normalizedValue,
            memoryType: candidate.memory_type,
            confidence: candidate.confidence,
            reason: candidate.reason,
        });

        if (accepted.length >= 3) {
            break;
        }
    }

    return accepted;
};
