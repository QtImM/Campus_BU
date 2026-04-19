const mockSelect = jest.fn();
const mockInsert = jest.fn();
const mockUpdate = jest.fn();
const mockEq = jest.fn();
const mockGte = jest.fn();
const mockLte = jest.fn();
const mockOrder = jest.fn();
const mockLimit = jest.fn();
const mockIn = jest.fn();
const mockMaybeSingle = jest.fn();
const mockSingle = jest.fn();

const resetQueryChain = () => {
    mockSelect.mockReset();
    mockInsert.mockReset();
    mockUpdate.mockReset();
    mockEq.mockReset();
    mockGte.mockReset();
    mockLte.mockReset();
    mockOrder.mockReset();
    mockLimit.mockReset();
    mockIn.mockReset();
    mockMaybeSingle.mockReset();
    mockSingle.mockReset();

    const query: any = {
        select: mockSelect,
        insert: mockInsert,
        update: mockUpdate,
        eq: mockEq,
        gte: mockGte,
        lte: mockLte,
        order: mockOrder,
        limit: mockLimit,
        in: mockIn,
        maybeSingle: mockMaybeSingle,
        single: mockSingle,
    };

    mockSelect.mockReturnValue(query);
    mockInsert.mockReturnValue(query);
    mockUpdate.mockReturnValue(query);
    mockEq.mockReturnValue(query);
    mockGte.mockReturnValue(query);
    mockLte.mockReturnValue(query);
    mockOrder.mockReturnValue(query);
    mockLimit.mockReturnValue(query);
    mockIn.mockReturnValue(query);

    return query;
};

const mockFrom = jest.fn();

jest.mock('../../services/supabase', () => ({
    supabase: {
        from: (...args: any[]) => mockFrom(...args),
    },
}));

describe('Calendar Service', () => {
    beforeEach(() => {
        jest.resetModules();
        const query = resetQueryChain();
        mockFrom.mockReset();
        mockFrom.mockReturnValue(query);
        mockMaybeSingle.mockResolvedValue({ data: null, error: null });
        mockSingle.mockResolvedValue({ data: null, error: null });
        mockLimit.mockResolvedValue({ data: [], error: null });
        mockOrder.mockReturnValue(query);
    });

    it('exports the expected public functions', () => {
        const calendar = require('../../services/calendar');

        expect(typeof calendar.createUserCalendarEvent).toBe('function');
        expect(typeof calendar.getUpcomingUserCalendarEvents).toBe('function');
        expect(typeof calendar.getUserCalendarEventsInRange).toBe('function');
        expect(typeof calendar.updateUserCalendarEvent).toBe('function');
        expect(typeof calendar.deleteUserCalendarEvent).toBe('function');
        expect(typeof calendar.getUserCalendarEventById).toBe('function');
    });

    it('returns validation error when title is missing', async () => {
        const { createUserCalendarEvent } = require('../../services/calendar');

        const result = await createUserCalendarEvent({
            userId: 'user-1',
            title: '',
            eventType: 'exam',
            eventDate: '2026-05-15',
        });

        expect(result).toEqual({ data: null, error: 'Title is required' });
        expect(mockFrom).not.toHaveBeenCalled();
    });

    it('returns validation error when date format is invalid', async () => {
        const { createUserCalendarEvent } = require('../../services/calendar');

        const result = await createUserCalendarEvent({
            userId: 'user-1',
            title: 'COMP3015 Final Exam',
            eventType: 'exam',
            eventDate: '05-15-2026',
        });

        expect(result).toEqual({ data: null, error: 'Event date must be in YYYY-MM-DD format' });
        expect(mockFrom).not.toHaveBeenCalled();
    });

    it('returns validation error when time format is invalid', async () => {
        const { createUserCalendarEvent } = require('../../services/calendar');

        const result = await createUserCalendarEvent({
            userId: 'user-1',
            title: 'COMP3015 Final Exam',
            eventType: 'exam',
            eventDate: '2026-05-15',
            startTime: '9:00',
        });

        expect(result).toEqual({ data: null, error: 'Start time must be in HH:MM format' });
        expect(mockFrom).not.toHaveBeenCalled();
    });

    it('creates a calendar event after duplicate check passes', async () => {
        const { createUserCalendarEvent } = require('../../services/calendar');
        mockSingle.mockResolvedValueOnce({
            data: {
                id: 'event-1',
                user_id: 'user-1',
                title: 'COMP3015 Final Exam',
                event_type: 'exam',
                course_code: 'COMP3015',
                matched_course_id: null,
                event_date: '2026-05-15',
                start_time: '14:00',
                end_time: '16:00',
                location: 'HSH201',
                note: null,
                is_active: true,
                created_at: '2026-04-19T00:00:00.000Z',
                updated_at: '2026-04-19T00:00:00.000Z',
            },
            error: null,
        });

        const result = await createUserCalendarEvent({
            userId: 'user-1',
            title: 'COMP3015 Final Exam',
            eventType: 'exam',
            courseCode: 'COMP3015',
            eventDate: '2026-05-15',
            startTime: '14:00',
            endTime: '16:00',
            location: 'HSH201',
        });

        expect(mockFrom).toHaveBeenCalledWith('user_calendar_events');
        expect(result.error).toBeNull();
        expect(result.data).toEqual(expect.objectContaining({
            id: 'event-1',
            title: 'COMP3015 Final Exam',
            eventType: 'exam',
            eventDate: '2026-05-15',
            startTime: '14:00',
            endTime: '16:00',
            location: 'HSH201',
        }));
    });

    it('returns empty array when upcoming-event query errors', async () => {
        const { getUpcomingUserCalendarEvents } = require('../../services/calendar');
        mockLimit.mockResolvedValueOnce({ data: null, error: { message: 'db down' } });

        const result = await getUpcomingUserCalendarEvents('user-1');

        expect(result).toEqual([]);
    });

    it('maps upcoming events correctly', async () => {
        const { getUpcomingUserCalendarEvents } = require('../../services/calendar');
        mockLimit.mockResolvedValueOnce({
            data: [{
                id: 'event-2',
                user_id: 'user-1',
                title: 'COMP3026 Quiz',
                event_type: 'quiz',
                course_code: 'COMP3026',
                matched_course_id: null,
                event_date: '2026-06-01',
                start_time: '09:00',
                end_time: '10:00',
                location: 'OEE803',
                note: 'bring calculator',
                is_active: true,
                created_at: '2026-04-19T00:00:00.000Z',
                updated_at: '2026-04-19T00:00:00.000Z',
            }],
            error: null,
        });

        const result = await getUpcomingUserCalendarEvents('user-1', { days: 30, limit: 10 });

        expect(result).toEqual([expect.objectContaining({
            id: 'event-2',
            title: 'COMP3026 Quiz',
            eventType: 'quiz',
            eventDate: '2026-06-01',
            location: 'OEE803',
            note: 'bring calculator',
        })]);
    });

    it('returns empty array when range query errors', async () => {
        const { getUserCalendarEventsInRange } = require('../../services/calendar');
        mockOrder
            .mockImplementationOnce(() => mockFrom.mock.results[0].value)
            .mockResolvedValueOnce({ data: null, error: { message: 'db down' } });

        const result = await getUserCalendarEventsInRange('user-1', '2026-05-01', '2026-05-31');

        expect(result).toEqual([]);
    });
});
