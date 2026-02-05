import { CourseExchange, ExchangeComment } from '../types';

/**
 * Fetch all active course exchange requests.
 * MOCK: Returns dummy data for frontend-only development.
 */
export const fetchExchanges = async (): Promise<CourseExchange[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return getMockExchanges();
};

/**
 * Post a new course exchange request.
 * MOCK: Simulates success.
 */
export const postExchange = async (exchange: Omit<CourseExchange, 'id' | 'createdAt' | 'status' | 'commentCount' | 'likes'>) => {
    console.log('Mock postExchange:', exchange);
    return { id: Math.random().toString(), ...exchange, createdAt: new Date(), status: 'open', commentCount: 0, likes: 0 };
};

/**
 * Fetch comments for a specific exchange request.
 * MOCK: Returns dummy data.
 */
export const fetchExchangeComments = async (exchangeId: string): Promise<ExchangeComment[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getMockComments(exchangeId);
};

/**
 * Post a comment to an exchange request.
 * MOCK: Simulates success.
 */
export const postExchangeComment = async (exchangeId: string, author: { id: string, name: string, avatar: string }, content: string) => {
    console.log('Mock postComment:', { exchangeId, author, content });
    return {
        id: Math.random().toString(),
        exchangeId,
        authorId: author.id,
        authorName: author.name,
        authorAvatar: author.avatar,
        content,
        createdAt: new Date(),
    };
};

/**
 * Toggle like for an exchange request.
 * MOCK: Simulates success.
 */
export const toggleExchangeLike = async (exchangeId: string, userId: string) => {
    console.log('Mock toggleExchangeLike:', { exchangeId, userId });
    return { success: true };
};

/**
 * Mock data for development.
 */
const getMockExchanges = (): CourseExchange[] => [
    {
        id: 'mock1',
        userId: 'u1',
        userName: 'Zhang Wei',
        userAvatar: '👤',
        userMajor: 'Computer Science',
        haveCourse: 'COMP3015',
        haveSection: 'Sec1',
        haveInstructor: 'Dr. Smith',
        haveTime: 'Mon 2:30 PM',
        wantCourses: [
            { code: 'COMP3011', section: 'Sec2', instructor: 'Prof. Wong', time: 'Wed 10:30 AM' },
            { code: 'COMP3016', section: 'Sec1' }
        ],
        reason: 'Time conflict with my other core course.',
        contacts: [
            { platform: 'WeChat', value: 'zw12345' },
            { platform: 'Email', value: 'wei.zhang@example.com' }
        ],
        createdAt: new Date(),
        status: 'open',
        commentCount: 2,
        likes: 5,
        isLiked: false,
    },
    {
        id: 'mock2',
        userId: 'u2',
        userName: 'Sarah Lee',
        userAvatar: '👩‍🎓',
        userMajor: 'Marketing',
        haveCourse: 'MKTG2005',
        haveSection: 'Sec3',
        haveInstructor: 'Dr. Johnson',
        haveTime: 'Tue 1:00 PM',
        wantCourses: [
            { code: 'MKTG3010', section: 'Sec1' },
            { code: 'MKTG3020' }
        ],
        contacts: [
            { platform: 'WhatsApp', value: '98765432' }
        ],
        createdAt: new Date(Date.now() - 86400000),
        status: 'open',
        commentCount: 0,
        likes: 2,
        isLiked: true,
    }
];

const getMockComments = (exchangeId: string): ExchangeComment[] => [
    {
        id: 'c1',
        exchangeId,
        authorId: 'u3',
        authorName: 'David Wong',
        authorAvatar: '👨‍🎓',
        content: 'Is this COMP3015 section 1 or 2?',
        createdAt: new Date(Date.now() - 3600000),
    },
    {
        id: 'c2',
        exchangeId,
        authorId: 'u1',
        authorName: 'Zhang Wei',
        authorAvatar: '👤',
        content: 'It is section 1.',
        createdAt: new Date(Date.now() - 1800000),
    }
];
