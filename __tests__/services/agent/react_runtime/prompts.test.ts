const { buildReactSystemPrompt } = require('../../../../services/agent/react_runtime/prompts') as {
    buildReactSystemPrompt: (context: any) => string;
};

describe('buildReactSystemPrompt', () => {
    it('includes session context and device location when available', () => {
        const prompt = buildReactSystemPrompt({
            userId: 'user-1',
            deviceLocation: { latitude: 22.3375, longitude: 114.1833 },
            sessionState: {
                facts: { nickname: '小明' },
                recentDecisions: [],
                openLoops: [],
                summary: '用户刚问过 GPA',
                referencedCourse: 'COMP4015',
                referencedBuilding: 'Library',
            },
        });

        expect(prompt).toContain('Current user location: 22.3375, 114.1833');
        expect(prompt).toContain('Conversation summary:\n用户刚问过 GPA');
        expect(prompt).toContain('Referenced course: COMP4015');
        expect(prompt).toContain('Referenced building: Library');
        expect(prompt).toContain('- nickname: 小明');
    });
});
