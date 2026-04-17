import { LEGAL_CONTENT, TAB_LABELS } from '../../constants/legalContent';

describe('legal content localization', () => {
    it('uses readable Simplified Chinese copy', () => {
        expect(LEGAL_CONTENT['zh-Hans'].privacy.title).toBe('隐私政策');
        expect(LEGAL_CONTENT['zh-Hans'].terms.title).toBe('使用条款与社区安全');
        expect(LEGAL_CONTENT['zh-Hans'].terms.sections[0].heading).toBe('零容忍政策');
        expect(LEGAL_CONTENT['zh-Hans'].terms.sections[2].body).toContain('24 小时内');
        expect(TAB_LABELS['zh-Hans']).toEqual({
            privacy: '隐私',
            terms: '使用条款',
        });
    });

    it('uses readable Traditional Chinese copy', () => {
        expect(LEGAL_CONTENT['zh-Hant'].privacy.title).toBe('隱私政策');
        expect(LEGAL_CONTENT['zh-Hant'].terms.title).toBe('使用條款與社群安全');
        expect(LEGAL_CONTENT['zh-Hant'].terms.sections[0].heading).toBe('零容忍政策');
        expect(LEGAL_CONTENT['zh-Hant'].terms.sections[2].body).toContain('24 小時內');
        expect(TAB_LABELS['zh-Hant']).toEqual({
            privacy: '隱私',
            terms: '使用條款',
        });
    });
});
