export type StableTaskDecision =
    | {
        type: 'memory_write';
        key: string;
        value: string;
        reason: string;
        matchedText?: string;
    }
    | {
        type: 'memory_read';
        key: string;
        reason: string;
        matchedText?: string;
    }
    | {
        type: 'none';
        reason: string;
    };

const normalize = (value: string): string => value.trim();

const inferMemoryKeyFromRead = (prompt: string): string | null => {
    if (/专业|major/i.test(prompt)) return 'major';
    if (/宿舍|hall|住宿|residence/i.test(prompt)) return 'hall';
    if (/喜欢吃|鍾意食|爱吃|愛吃|食物|food/i.test(prompt)) return 'favorite_food';
    if (/怎么称呼|點稱呼|nickname|叫我/i.test(prompt)) return 'nickname';
    if (/语言|語言|language/i.test(prompt)) return 'language_preference';
    return null;
};

const extractMemoryWrite = (prompt: string): { key: string; value: string } | null => {
    const nickname = prompt.match(/(?:以后)?(?:你可以)?叫我\s*([A-Za-z0-9_\-\u4e00-\u9fff]+)/i);
    if (nickname?.[1]) return { key: 'nickname', value: normalize(nickname[1]) };

    const major = prompt.match(/(?:我是|我读|我讀)\s*([A-Za-z&\s\u4e00-\u9fff]{2,40})\s*(?:专业|系|major)/i);
    if (major?.[1]) return { key: 'major', value: normalize(major[1]) };

    const hall = prompt.match(/(?:我住|我住在|我住係|记住我住|記住我住)\s*([A-Za-z0-9\-\s\u4e00-\u9fff]{2,40})/i);
    if (hall?.[1]) return { key: 'hall', value: normalize(hall[1]) };

    const favoriteFood = prompt.match(/(?:我喜欢吃|我喜歡食|我鍾意食|我爱吃|我愛吃)\s*([A-Za-z0-9\-\s\u4e00-\u9fff]{2,40})/i);
    if (favoriteFood?.[1]) return { key: 'favorite_food', value: normalize(favoriteFood[1]) };

    const language = prompt.match(/(?:我偏好|我習慣|我习惯|我喜欢用)\s*(中文|英文|english|chinese)/i);
    if (language?.[1]) return { key: 'language_preference', value: normalize(language[1]) };

    return null;
};

export const inferStableTask = (prompt: string): StableTaskDecision => {
    const normalized = prompt.trim();
    if (!normalized) return { type: 'none', reason: 'empty prompt' };

    if (/你记得|你記得|还记得|仲記得|記唔記得|记不记得|有没有记住|有冇記住/i.test(normalized)) {
        const key = inferMemoryKeyFromRead(normalized);
        if (key) {
            return {
                type: 'memory_read',
                key,
                reason: `memory read for ${key}`,
                matchedText: normalized,
            };
        }
    }

    if (/记住|記住|记一下|記一下|以后叫我|你可以叫我|帮我记住|幫我記住/i.test(normalized)) {
        const extracted = extractMemoryWrite(normalized);
        if (extracted) {
            return {
                type: 'memory_write',
                key: extracted.key,
                value: extracted.value,
                reason: `memory write for ${extracted.key}`,
                matchedText: normalized,
            };
        }
    }

    return { type: 'none', reason: 'no stable subtask matched' };
};
