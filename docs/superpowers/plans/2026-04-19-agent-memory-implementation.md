# Agent Memory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a post-reply agent memory pass that lets the LLM propose non-predefined memory keys while programmatic filters decide what durable user facts may be persisted.

**Architecture:** Keep the current `agent_memory` persistence layer and explicit regex-based memory shortcuts, but add a new `memory_extractor` module that performs structured LLM extraction, filtering, key normalization, and capped write candidate generation. Integrate that module into `AgentExecutor` as a non-blocking post-response step so the main reply path stays intact even if memory extraction fails.

**Tech Stack:** TypeScript, Jest, existing DeepSeek LLM wrapper in `services/agent/llm.ts`, Supabase persistence in `services/agent/memory.ts`

---

## File Map

- Create: `services/agent/memory_extractor.ts`
  - Owns candidate schema validation, allow / reject filtering, key normalization, canonical key merging, capped result generation, and the LLM extraction wrapper.
- Modify: `services/agent/types.ts`
  - Adds explicit types for memory candidates and accepted memory writes so the extractor and executor share one contract.
- Modify: `services/agent/executor.ts`
  - Calls the new post-reply memory pass after normal responses and persists accepted memories without blocking user-visible replies.
- Create: `__tests__/services/agent/memory_extractor.test.ts`
  - Unit tests for normalization, filtering, duplicate handling, and extractor output validation.
- Modify: `__tests__/services/agent/executor.test.ts`
  - Integration coverage for the post-response memory pass and failure tolerance.

## Task 1: Define Shared Memory Candidate Types

**Files:**
- Modify: `services/agent/types.ts`
- Test: `__tests__/services/agent/memory_extractor.test.ts`

- [ ] **Step 1: Write the failing type-level usage test scaffold**

Add this new test file scaffold so the next tasks have concrete imports to satisfy:

```ts
import {
    normalizeMemoryKey,
    filterMemoryCandidates,
    type MemoryCandidate,
} from '../../../services/agent/memory_extractor';

describe('memory extractor contracts', () => {
    it('normalizes accepted keys', () => {
        const key = normalizeMemoryKey('Favorite Food');
        expect(key).toBe('favorite_food');
    });

    it('filters temporary emotional memories', () => {
        const candidates: MemoryCandidate[] = [
            {
                should_store: true,
                key: 'mood_today',
                value: 'feeling stressed today',
                memory_type: 'emotion',
                confidence: 0.92,
                reason: 'user said they feel stressed today',
            },
        ];

        expect(filterMemoryCandidates(candidates, {})).toEqual([]);
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand __tests__/services/agent/memory_extractor.test.ts`

Expected: FAIL with module import or export errors because `memory_extractor.ts` does not exist yet.

- [ ] **Step 3: Add shared type definitions**

Update `services/agent/types.ts` to add these exported types near the existing agent types:

```ts
export type MemoryCandidateType =
    | 'long_term_preference'
    | 'background_fact'
    | 'emotion'
    | 'temporary_context'
    | 'unknown';

export type MemoryCandidate = {
    should_store: boolean;
    key: string;
    value: string;
    memory_type: MemoryCandidateType;
    confidence: number;
    reason: string;
};

export type AcceptedMemoryWrite = {
    key: string;
    value: string;
    memoryType: Exclude<MemoryCandidateType, 'emotion' | 'temporary_context' | 'unknown'>;
    confidence: number;
    reason: string;
};
```

- [ ] **Step 4: Run tests to verify the type imports compile**

Run: `npm test -- --runInBand __tests__/services/agent/memory_extractor.test.ts`

Expected: still FAIL, but now due to missing `memory_extractor.ts` exports rather than missing types.

- [ ] **Step 5: Commit**

```bash
git add services/agent/types.ts __tests__/services/agent/memory_extractor.test.ts
git commit -m "refactor: add shared agent memory candidate types"
```

## Task 2: Build Deterministic Memory Normalization and Filtering

**Files:**
- Create: `services/agent/memory_extractor.ts`
- Test: `__tests__/services/agent/memory_extractor.test.ts`

- [ ] **Step 1: Expand the failing unit tests**

Replace the scaffold test body with this fuller unit coverage:

```ts
import {
    filterMemoryCandidates,
    normalizeMemoryKey,
} from '../../../services/agent/memory_extractor';
import type { MemoryCandidate } from '../../../services/agent/types';

describe('normalizeMemoryKey', () => {
    it('lowercases and replaces spaces', () => {
        expect(normalizeMemoryKey('Favorite Food')).toBe('favorite_food');
    });

    it('merges canonical variants', () => {
        expect(normalizeMemoryKey('food_preference')).toBe('favorite_food');
        expect(normalizeMemoryKey('study_abroad_plan')).toBe('future_plan.exchange');
    });

    it('rejects generic keys', () => {
        expect(normalizeMemoryKey('info')).toBeNull();
    });
});

describe('filterMemoryCandidates', () => {
    it('keeps durable preference memories', () => {
        const candidates: MemoryCandidate[] = [
            {
                should_store: true,
                key: 'food_preference',
                value: 'likes spicy food',
                memory_type: 'long_term_preference',
                confidence: 0.91,
                reason: 'stable food preference',
            },
        ];

        expect(filterMemoryCandidates(candidates, {})).toEqual([
            {
                key: 'favorite_food',
                value: 'likes spicy food',
                memoryType: 'long_term_preference',
                confidence: 0.91,
                reason: 'stable food preference',
            },
        ]);
    });

    it('rejects temporary context memories', () => {
        const candidates: MemoryCandidate[] = [
            {
                should_store: true,
                key: 'current_location',
                value: 'in the library right now',
                memory_type: 'temporary_context',
                confidence: 0.95,
                reason: 'current state only',
            },
        ];

        expect(filterMemoryCandidates(candidates, {})).toEqual([]);
    });

    it('skips duplicates when stored value matches', () => {
        const candidates: MemoryCandidate[] = [
            {
                should_store: true,
                key: 'nickname',
                value: 'Tim',
                memory_type: 'long_term_preference',
                confidence: 0.98,
                reason: 'preferred name',
            },
        ];

        expect(filterMemoryCandidates(candidates, { nickname: 'Tim' })).toEqual([]);
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand __tests__/services/agent/memory_extractor.test.ts`

Expected: FAIL because the helper functions do not exist yet.

- [ ] **Step 3: Implement deterministic helpers**

Create `services/agent/memory_extractor.ts` with this initial deterministic layer:

```ts
import type { AcceptedMemoryWrite, MemoryCandidate, MemoryCandidateType } from './types';

const MEMORY_CONFIDENCE_THRESHOLD = 0.75;
const MAX_MEMORY_VALUE_LENGTH = 160;
const GENERIC_KEYS = new Set(['info', 'thing', 'user_data', 'data', 'memory']);
const CANONICAL_KEY_MAP: Record<string, string> = {
    food_preference: 'favorite_food',
    favorite_food: 'favorite_food',
    food_like: 'favorite_food',
    study_abroad_plan: 'future_plan.exchange',
    exchange_plan: 'future_plan.exchange',
    exchange_plan_next_term: 'future_plan.exchange',
    call_me_name: 'nickname',
    preferred_name: 'nickname',
    nickname: 'nickname',
};

const ALLOWED_TYPES = new Set<MemoryCandidateType>([
    'long_term_preference',
    'background_fact',
]);

const looksSensitive = (value: string): boolean => {
    return /\b\d{15,19}\b/.test(value) || /password|bank|身份证|passport|银行卡/i.test(value);
};

export const normalizeMemoryKey = (rawKey: string): string | null => {
    const cleaned = rawKey
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9._-]/g, '');

    if (!cleaned || cleaned.length < 2 || cleaned.length > 64) return null;
    if (GENERIC_KEYS.has(cleaned)) return null;
    if (cleaned.split('_').length > 6) return null;

    return CANONICAL_KEY_MAP[cleaned] || cleaned;
};

export const filterMemoryCandidates = (
    candidates: MemoryCandidate[],
    existingFacts: Record<string, any>
): AcceptedMemoryWrite[] => {
    const accepted: AcceptedMemoryWrite[] = [];

    for (const candidate of candidates) {
        if (!candidate.should_store) continue;
        if (!ALLOWED_TYPES.has(candidate.memory_type)) continue;
        if (candidate.confidence < MEMORY_CONFIDENCE_THRESHOLD) continue;

        const normalizedKey = normalizeMemoryKey(candidate.key);
        const normalizedValue = candidate.value.trim();

        if (!normalizedKey) continue;
        if (!normalizedValue || normalizedValue.length > MAX_MEMORY_VALUE_LENGTH) continue;
        if (looksSensitive(normalizedValue)) continue;
        if (existingFacts[normalizedKey] === normalizedValue) continue;

        accepted.push({
            key: normalizedKey,
            value: normalizedValue,
            memoryType: candidate.memory_type,
            confidence: candidate.confidence,
            reason: candidate.reason,
        });
    }

    return accepted.slice(0, 3);
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --runInBand __tests__/services/agent/memory_extractor.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add services/agent/memory_extractor.ts __tests__/services/agent/memory_extractor.test.ts
git commit -m "feat: add deterministic agent memory filtering"
```

## Task 3: Add Structured LLM Memory Extraction

**Files:**
- Modify: `services/agent/memory_extractor.ts`
- Test: `__tests__/services/agent/memory_extractor.test.ts`

- [ ] **Step 1: Add a failing extractor parsing test**

Append this test block:

```ts
import * as llm from '../../../services/agent/llm';
import { extractMemoryCandidatesFromConversation } from '../../../services/agent/memory_extractor';

jest.mock('../../../services/agent/llm');

describe('extractMemoryCandidatesFromConversation', () => {
    it('parses structured candidate memories from the LLM response', async () => {
        (llm.callDeepSeek as jest.Mock).mockResolvedValue(
            JSON.stringify({
                candidates: [
                    {
                        should_store: true,
                        key: 'preferred_name',
                        value: 'Tim',
                        memory_type: 'long_term_preference',
                        confidence: 0.96,
                        reason: 'user explicitly said to call them Tim',
                    },
                ],
            })
        );

        const result = await extractMemoryCandidatesFromConversation({
            recentTurns: [
                { role: 'user', content: '以后叫我 Tim' },
                { role: 'assistant', content: '好的，我记住了。' },
            ],
        });

        expect(result).toEqual([
            {
                should_store: true,
                key: 'preferred_name',
                value: 'Tim',
                memory_type: 'long_term_preference',
                confidence: 0.96,
                reason: 'user explicitly said to call them Tim',
            },
        ]);
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand __tests__/services/agent/memory_extractor.test.ts`

Expected: FAIL because `extractMemoryCandidatesFromConversation` is missing.

- [ ] **Step 3: Implement extractor prompt and parser**

Add this code to `services/agent/memory_extractor.ts`:

```ts
import { callDeepSeek, resolveModelName } from './llm';
import type { AgentHistoryItem } from './types';

type ExtractionInput = {
    recentTurns: AgentHistoryItem[];
};

const buildExtractionPrompt = (input: ExtractionInput): { role: string; content: string }[] => {
    const transcript = input.recentTurns
        .map((turn) => `${turn.role.toUpperCase()}: ${turn.content}`)
        .join('\n');

    return [
        {
            role: 'system',
            content: [
                'You extract durable user memory candidates from conversation.',
                'Only return JSON with a top-level "candidates" array.',
                'Prefer long_term_preference or background_fact.',
                'Reject emotions, one-off requests, temporary state, and sensitive data.',
                'Each candidate must contain should_store, key, value, memory_type, confidence, reason.',
            ].join(' '),
        },
        {
            role: 'user',
            content: `Recent conversation:\n${transcript}`,
        },
    ];
};

export const extractMemoryCandidatesFromConversation = async (
    input: ExtractionInput
): Promise<MemoryCandidate[]> => {
    const raw = await callDeepSeek(buildExtractionPrompt(input), {
        model: resolveModelName('fast'),
    });

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.candidates)) return [];

    return parsed.candidates.filter((candidate: any) => (
        candidate &&
        typeof candidate.should_store === 'boolean' &&
        typeof candidate.key === 'string' &&
        typeof candidate.value === 'string' &&
        typeof candidate.memory_type === 'string' &&
        typeof candidate.confidence === 'number' &&
        typeof candidate.reason === 'string'
    ));
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --runInBand __tests__/services/agent/memory_extractor.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add services/agent/memory_extractor.ts __tests__/services/agent/memory_extractor.test.ts
git commit -m "feat: add llm-backed agent memory extraction"
```

## Task 4: Integrate Post-Reply Memory Pass into AgentExecutor

**Files:**
- Modify: `services/agent/executor.ts`
- Test: `__tests__/services/agent/executor.test.ts`

- [ ] **Step 1: Add a failing executor integration test**

Append this test case inside `__tests__/services/agent/executor.test.ts`:

```ts
jest.mock('../../../services/agent/memory_extractor', () => ({
    extractMemoryCandidatesFromConversation: jest.fn(),
    filterMemoryCandidates: jest.fn(),
}));

it('stores accepted memories after generating a normal reply', async () => {
    const extractor = require('../../../services/agent/memory_extractor');
    extractor.extractMemoryCandidatesFromConversation.mockResolvedValue([
        {
            should_store: true,
            key: 'preferred_name',
            value: 'Tim',
            memory_type: 'long_term_preference',
            confidence: 0.96,
            reason: 'durable naming preference',
        },
    ]);
    extractor.filterMemoryCandidates.mockReturnValue([
        {
            key: 'nickname',
            value: 'Tim',
            memoryType: 'long_term_preference',
            confidence: 0.96,
            reason: 'durable naming preference',
        },
    ]);

    const executor = new AgentExecutor('user-1');
    await executor.process('以后叫我 Tim');

    expect(saveMemoryFact).toHaveBeenCalledWith('user-1', 'nickname', 'Tim');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand __tests__/services/agent/executor.test.ts`

Expected: FAIL because `AgentExecutor` does not yet call the extractor after replying.

- [ ] **Step 3: Add the post-response memory pass**

Update `services/agent/executor.ts` with:

```ts
import {
    extractMemoryCandidatesFromConversation,
    filterMemoryCandidates,
} from './memory_extractor';
```

Add this helper method inside `AgentExecutor`:

```ts
private async runPostResponseMemoryPass(): Promise<void> {
    try {
        const recentTurns = this.context.history.slice(-3);
        const existingFacts = await getAllUserFacts(this.context.userId);
        const candidates = await extractMemoryCandidatesFromConversation({ recentTurns });
        const accepted = filterMemoryCandidates(candidates, existingFacts);

        for (const memory of accepted) {
            await saveMemoryFact(this.context.userId, memory.key, memory.value);
        }
    } catch (error) {
        console.warn('[Agent] post-response memory pass skipped:', error);
    }
}
```

Call it at the end of the normal `process(...)` path after the final answer has been prepared and history has been updated:

```ts
await this.runPostResponseMemoryPass();
```

Do not place this call inside explicit confirmation-only memory writes, and do not let any failure change the user-facing reply.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --runInBand __tests__/services/agent/executor.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add services/agent/executor.ts __tests__/services/agent/executor.test.ts
git commit -m "feat: run agent memory extraction after replies"
```

## Task 5: Add Failure-Tolerance Regression Coverage

**Files:**
- Modify: `__tests__/services/agent/executor.test.ts`

- [ ] **Step 1: Add failing safety tests**

Append these tests:

```ts
it('does not break the main reply when memory extraction fails', async () => {
    const extractor = require('../../../services/agent/memory_extractor');
    extractor.extractMemoryCandidatesFromConversation.mockRejectedValue(new Error('llm down'));
    extractor.filterMemoryCandidates.mockReturnValue([]);

    const executor = new AgentExecutor('user-1');
    const response = await executor.process('GPA 怎么算？');

    expect(response.finalAnswer || '').toContain('GPA');
});

it('caps accepted memories to three writes per pass', async () => {
    const extractor = require('../../../services/agent/memory_extractor');
    extractor.extractMemoryCandidatesFromConversation.mockResolvedValue([]);
    extractor.filterMemoryCandidates.mockReturnValue([
        { key: 'nickname', value: 'Tim', memoryType: 'long_term_preference', confidence: 0.9, reason: 'a' },
        { key: 'major', value: 'Computer Science', memoryType: 'background_fact', confidence: 0.9, reason: 'b' },
        { key: 'favorite_food', value: 'spicy', memoryType: 'long_term_preference', confidence: 0.9, reason: 'c' },
        { key: 'future_plan.exchange', value: 'next term', memoryType: 'background_fact', confidence: 0.9, reason: 'd' },
    ]);

    const executor = new AgentExecutor('user-1');
    await executor.process('以后叫我 Tim，我读 CS，喜欢吃辣，下学期想交换');

    expect(saveMemoryFact).toHaveBeenCalledTimes(3);
});
```

- [ ] **Step 2: Run tests to verify failures or missing guardrails**

Run: `npm test -- --runInBand __tests__/services/agent/executor.test.ts`

Expected: FAIL if the cap or graceful failure behavior is not implemented correctly.

- [ ] **Step 3: Apply the minimal robustness updates**

Make sure `services/agent/executor.ts` keeps the `try/catch` around the post-response pass and relies on `filterMemoryCandidates(...).slice(0, 3)` from the extractor layer. If the cap is currently enforced elsewhere, do not duplicate it in the executor.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- --runInBand __tests__/services/agent/executor.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add __tests__/services/agent/executor.test.ts services/agent/executor.ts services/agent/memory_extractor.ts
git commit -m "test: cover agent memory extraction safety"
```

## Task 6: Run Final Verification

**Files:**
- Test: `__tests__/services/agent/memory_extractor.test.ts`
- Test: `__tests__/services/agent/executor.test.ts`
- Test: `__tests__/services/agent/llm.test.ts`

- [ ] **Step 1: Run focused agent memory tests**

Run: `npm test -- --runInBand __tests__/services/agent/memory_extractor.test.ts __tests__/services/agent/executor.test.ts`

Expected: PASS

- [ ] **Step 2: Run adjacent agent regression tests**

Run: `npm test -- --runInBand __tests__/services/agent/llm.test.ts`

Expected: PASS

- [ ] **Step 3: Run full suite**

Run: `npm test -- --runInBand`

Expected: PASS

- [ ] **Step 4: Review working tree**

Run: `git status --short`

Expected: only intended implementation files are modified.

- [ ] **Step 5: Commit final verification touch-ups if needed**

```bash
git add services/agent/types.ts services/agent/memory_extractor.ts services/agent/executor.ts __tests__/services/agent/memory_extractor.test.ts __tests__/services/agent/executor.test.ts
git commit -m "chore: finalize agent memory implementation"
```

## Self-Review

### Spec coverage

- Non-predefined key support: covered in Task 2 normalization and Task 3 LLM extraction.
- Programmatic filtering: covered in Task 2.
- Post-reply memory pass: covered in Task 4.
- Reuse existing persistence layer: covered in Task 4.
- Preserve explicit memory commands: preserved by limiting integration to post-reply pass only.
- Failure tolerance: covered in Task 5.

### Placeholder scan

- No `TODO`, `TBD`, or “handle appropriately” placeholders remain.
- Every implementation task includes exact files, commands, and code snippets.

### Type consistency

- `MemoryCandidate` and `AcceptedMemoryWrite` are defined once in `services/agent/types.ts`.
- `memory_type` stays snake_case in model-facing data.
- `memoryType` stays camelCase in accepted internal write payloads.
