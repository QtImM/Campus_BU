const mockGetLocalCourses = jest.fn();
const mockFrom = jest.fn();

jest.mock('../../services/courses', () => ({
    getLocalCourses: (...args: any[]) => mockGetLocalCourses(...args),
}));

jest.mock('../../services/supabase', () => ({
    supabase: {
        from: (...args: any[]) => mockFrom(...args),
    },
}));

describe('favorite course detail loading', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetLocalCourses.mockResolvedValue([]);
    });

    it('loads favorite courses even when they are not in the current paginated course list', async () => {
        const favoritesService = require('../../services/favorites');
        const loadFavoriteCoursesDetails = favoritesService.loadFavoriteCoursesDetails;

        expect(loadFavoriteCoursesDetails).toBeDefined();

        if (!loadFavoriteCoursesDetails) {
            return;
        }

        const remoteRows = [
            {
                id: 'db-2',
                code: 'COMP2002',
                name: 'Algorithms',
                instructor: 'Dr. Chan',
                department: 'Computer Science',
                credits: 3,
                rating: 4.2,
                review_count: 18,
            },
        ];

        const inMock = jest.fn().mockResolvedValue({ data: remoteRows, error: null });
        const selectMock = jest.fn(() => ({ in: inMock }));
        mockFrom.mockReturnValue({ select: selectMock });

        const currentPageCourses = [
            {
                id: 'db-1',
                code: 'COMP1001',
                name: 'Intro to CS',
                instructor: 'Dr. Lee',
                department: 'Computer Science',
                credits: 3,
                rating: 4.5,
                reviewCount: 10,
            },
        ];

        await expect(
            loadFavoriteCoursesDetails(['db-2'], currentPageCourses)
        ).resolves.toEqual([
            {
                id: 'db-2',
                code: 'COMP2002',
                name: 'Algorithms',
                instructor: 'Dr. Chan',
                department: 'Computer Science',
                credits: 3,
                rating: 4.2,
                reviewCount: 18,
            },
        ]);
    });
});
