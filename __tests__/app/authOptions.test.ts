import { AUTH_DOMAIN_OPTIONS, AUTH_LANGUAGE_OPTIONS } from '../../constants/authOptions';

const noQuestionMarks = (value: string) => {
    expect(value).not.toContain('??');
    expect(value).not.toContain('???');
};

describe('auth option labels', () => {
    it('exposes readable language labels', () => {
        expect(AUTH_LANGUAGE_OPTIONS).toEqual([
            { label: '\u7b80\u4f53\u4e2d\u6587', value: 'zh-Hans' },
            { label: '\u7e41\u9ad4\u4e2d\u6587', value: 'zh-Hant' },
            { label: 'English', value: 'en' },
        ]);
    });

    it('exposes a readable fallback domain label', () => {
        expect(AUTH_DOMAIN_OPTIONS[4]).toEqual({
            label: 'Other / \u5176\u4ed6',
            value: 'other',
        });
    });

    it('keeps auth-facing labels free from question-mark placeholders', () => {
        AUTH_LANGUAGE_OPTIONS.forEach(({ label }) => noQuestionMarks(label));
        AUTH_DOMAIN_OPTIONS.forEach(({ label }) => noQuestionMarks(label));
    });
});
