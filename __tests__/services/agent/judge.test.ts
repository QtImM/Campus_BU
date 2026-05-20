/**
 * LLM-as-a-Judge 真实 API 评测
 *
 * 运行: npx jest __tests__/services/agent/judge.test.ts --no-coverage --testTimeout=30000
 *
 * 调用真实 DeepSeek API 验证 faithfulness 和 relevance 评分。
 * 不 mock callDeepSeek，每条用例消耗 1 次 API 调用。
 */

// 先加载 .env，再 require judge 模块（config.ts 在模块初始化时读取 env）
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const { judgeFaithfulness, judgeRelevance } = require('../../../scripts/judge');

// 不 mock callDeepSeek — 使用真实 API

describe('LLM-as-a-Judge (real API)', () => {
    describe('judgeFaithfulness', () => {
        it('给忠实回答打高分', async () => {
            const evidence = [
                { topic: 'GPA计算', contentSnippet: 'GPA按学分加权平均计算，A=4.0, B=3.0, C=2.0' },
            ];
            const response = 'GPA是按学分加权平均来算的，A对应4.0，B对应3.0。';

            const result = await judgeFaithfulness(evidence, response);
            console.log(`  忠实回答: score=${result.score}, reason=${result.reasoning}`);

            expect(result.score).toBeGreaterThanOrEqual(0.7);
            expect(result.reasoning).toBeTruthy();
        });

        it('给含幻觉的回答打低分', async () => {
            const evidence = [
                { topic: 'GPA计算', contentSnippet: 'GPA按学分加权平均计算' },
            ];
            const response = 'GPA是按学分加权平均算的，满分是5.0，低于2.0会被退学。';

            const result = await judgeFaithfulness(evidence, response);
            console.log(`  幻觉回答: score=${result.score}, reason=${result.reasoning}`);

            expect(result.score).toBeLessThan(0.7);
        });

        it('无证据时返回 0', async () => {
            const result = await judgeFaithfulness([], 'some response');
            expect(result.score).toBe(0);
        });
    });

    describe('judgeRelevance', () => {
        it('给切题回答打高分', async () => {
            const result = await judgeRelevance('GPA怎么算？', 'GPA按学分加权平均计算。');
            console.log(`  切题回答: score=${result.score}, reason=${result.reasoning}`);

            expect(result.score).toBeGreaterThanOrEqual(0.7);
        });

        it('给跑题回答打低分', async () => {
            const result = await judgeRelevance('GPA怎么算？', '图书馆周一到周五开放，早上8点到晚上10点。');
            console.log(`  跑题回答: score=${result.score}, reason=${result.reasoning}`);

            expect(result.score).toBeLessThan(0.5);
        });

        it('空回答返回 0', async () => {
            const result = await judgeRelevance('GPA怎么算？', '');
            expect(result.score).toBe(0);
        });
    });
});
