import { FAQService } from '../../services/faq';
import { rerankKnowledgeBaseResults } from '../../services/agent/retrieval';

describe('FAQ retrieval formatting', () => {
    it('reranks knowledge base rows by query relevance', () => {
        const ranked = rerankKnowledgeBaseResults('GPA 怎么算', [
            {
                content: 'Library opening hours vary by semester.',
                metadata: { h2: 'Library' },
            },
            {
                content: 'Semester GPA is calculated by total grade points divided by total credits attempted.',
                metadata: { h2: '评分制度与GPA', h3: 'GPA计算方法' },
            },
        ]);

        expect(ranked[0].content).toContain('Semester GPA');
        expect(ranked[0].score).toBeGreaterThan(0);
    });

    it('builds standardized campus FAQ answers', () => {
        const answer = FAQService.buildCampusFaqAnswer(
            'GPA 怎么算？',
            [{
                id: 'faq-1',
                question: 'How is GPA calculated?',
                question_zh: 'GPA 怎么算？',
                answer: 'Use total grade points divided by total credits.',
                answer_zh: 'GPA 按总绩点除以总学分计算。',
                keywords: ['gpa'],
                related_links: ['https://example.com/gpa'],
            }],
            [{
                content: 'Semester GPA is calculated by total grade points divided by total credits attempted.',
                metadata: { h2: '评分制度与GPA' },
                score: 18,
            }]
        );

        expect(answer).toContain('命中主题：');
        expect(answer).toContain('结论：GPA 按总绩点除以总学分计算。');
        expect(answer).toContain('证据片段：');
        expect(answer).toContain('建议来源：');
    });

    it('prefers stronger knowledge base evidence over weak local FAQ matches', () => {
        const answer = FAQService.buildCampusFaqAnswer(
            'GPA 怎么算？',
            [{
                id: 'faq-weak',
                question: 'What is the library?',
                question_zh: '图书馆是什么？',
                answer: 'Library information.',
                answer_zh: '这是图书馆介绍。',
                keywords: ['library'],
            }],
            [{
                content: 'Semester GPA is calculated by total grade points divided by total credits attempted.',
                metadata: { h2: '评分制度与GPA' },
                score: 18,
            }]
        );

        expect(answer).toContain('结论：Semester GPA is calculated');
        expect(answer).not.toContain('结论：这是图书馆介绍。');
    });
});
