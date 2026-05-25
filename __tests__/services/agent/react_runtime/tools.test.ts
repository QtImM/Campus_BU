jest.mock('../../../../services/agent/graph/tools/schedule_tools', () => ({
    readUserScheduleTool: jest.fn().mockResolvedValue({
        success: true,
        resultSummary: 'loaded 2 schedule entries',
        rawResult: [{ title: 'COMP4015' }],
    }),
}));

jest.mock('../../../../services/agent/graph/tools/faq_tools', () => ({
    searchCampusFaqTool: jest.fn().mockResolvedValue({
        success: true,
        resultSummary: 'faq=1, kb=2',
        rawResult: { local: [], kb: [] },
    }),
}));

jest.mock('../../../../services/agent/graph/tools/campus_lookup_tools', () => ({
    readCampusBuildingTool: jest.fn().mockResolvedValue({
        success: true,
        resultSummary: 'building info loaded',
        rawResult: { name: 'Library' },
    }),
    findNearbyPlaceTool: jest.fn().mockResolvedValue({
        success: true,
        resultSummary: 'nearby place lookup finished',
        rawResult: { places: [] },
    }),
}));

jest.mock('../../../../services/agent/graph/tools/memory_tools', () => ({
    readMemoryFactsTool: jest.fn().mockResolvedValue({
        nickname: '小明',
    }),
}));

const { REACT_TOOL_SCHEMAS, executeReactTool } = require('../../../../services/agent/react_runtime/tools') as {
    REACT_TOOL_SCHEMAS: Array<any>;
    executeReactTool: (name: string, args: Record<string, any>, context: any) => Promise<any>;
};

describe('react runtime tool schemas', () => {
    it('defines the five read tools expected by the migration doc', () => {
        expect(REACT_TOOL_SCHEMAS.map((schema) => schema.function.name)).toEqual([
            'read_user_schedule',
            'search_campus_faq',
            'read_campus_building',
            'find_nearby_place',
            'read_memory_facts',
        ]);
    });

    it('dispatches schedule queries through the schedule tool', async () => {
        const result = await executeReactTool('read_user_schedule', { query: '今天有什么课' }, {
            userId: 'user-1',
            deviceLocation: null,
            sessionState: { facts: {}, recentDecisions: [], openLoops: [] },
        });

        expect(result).toEqual(expect.objectContaining({
            success: true,
            summary: 'loaded 2 schedule entries',
        }));
    });

    it('returns a structured error for unknown tools', async () => {
        const result = await executeReactTool('unknown_tool', {}, {
            userId: 'user-1',
            deviceLocation: null,
            sessionState: { facts: {}, recentDecisions: [], openLoops: [] },
        });

        expect(result).toEqual({
            success: false,
            error: 'Unknown tool: unknown_tool',
            summary: 'Tool "unknown_tool" not found',
        });
    });
});
