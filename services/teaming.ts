import { CourseTeaming, TeamingComment } from '../types';

/**
 * Fetch teaming requests for a specific course.
 * MOCK: Returns dummy data for development.
 */
export const fetchTeamingRequests = async (courseId: string): Promise<CourseTeaming[]> => {
    // In a real app, this would be a Supabase query
    return getMockTeaming(courseId);
};

/**
 * Post a new teaming request.
 * MOCK: Simulates success.
 */
export const postTeamingRequest = async (request: Partial<CourseTeaming>): Promise<{ success: boolean; data?: CourseTeaming }> => {
    console.log('Mock postTeamingRequest:', request);
    return {
        success: true,
        data: {
            ...request,
            id: `local_${Date.now()}`,
            createdAt: new Date(),
            status: 'open',
            likes: 0,
            commentCount: 0
        } as CourseTeaming
    };
};

/**
 * Toggle like for a teaming request.
 */
export const toggleTeamingLike = async (teamingId: string, userId: string): Promise<{ success: boolean }> => {
    console.log('Mock toggleTeamingLike:', { teamingId, userId });
    return { success: true };
};

/**
 * Fetch comments for a teaming request.
 */
export const fetchTeamingComments = async (teamingId: string): Promise<TeamingComment[]> => {
    return [
        {
            id: 'tc1',
            teamingId,
            authorId: 'u5',
            authorName: 'David Chen',
            authorAvatar: '👨‍🎓',
            content: 'I am interested! I am in Sec1 too.',
            createdAt: new Date(Date.now() - 3600000)
        }
    ];
};

/**
 * Post a comment to a teaming request.
 */
export const postTeamingComment = async (teamingId: string, author: any, content: string): Promise<{ success: boolean }> => {
    console.log('Mock postTeamingComment:', { teamingId, author, content });
    return { success: true };
};

/**
 * Mock data generator.
 */
const getMockTeaming = (courseId: string): CourseTeaming[] => [
    {
        id: 't1',
        courseId,
        userId: 'u1',
        userName: 'Zhang Wei',
        userAvatar: '👤',
        userMajor: 'Computer Science',
        section: 'Sec1',
        selfIntro: 'I am a Year 3 student proficient in Python and React.',
        targetTeammate: 'Looking for someone who is responsible and can contribute to the frontend.',
        contacts: [
            { platform: 'WeChat', value: 'zw12345' }
        ],
        createdAt: new Date(Date.now() - 86400000),
        status: 'open',
        likes: 3,
        commentCount: 1
    },
    {
        id: 't2',
        courseId,
        userId: 'u2',
        userName: 'Sarah Lee',
        userAvatar: '👩‍🎓',
        userMajor: 'Marketing',
        section: 'Sec2',
        selfIntro: 'Marketing student with experience in UI/UX research.',
        targetTeammate: 'Need a technical partner for the data analysis part.',
        contacts: [
            { platform: 'WhatsApp', value: '98765432' }
        ],
        createdAt: new Date(Date.now() - 172800000),
        status: 'open',
        likes: 1,
        commentCount: 0
    }
];
