import { ToolDefinition } from './types';

export const TOOLS: ToolDefinition[] = [
    {
        name: 'read_user_schedule',
        description: 'Read the current user schedule for queries like today classes, next class, or classes on a specific weekday.',
        parameters: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'The user request about their personal schedule, in Chinese or English.' }
            },
            required: ['query']
        }
    },
    {
        name: 'read_course_community',
        description: 'Read a course community snapshot including reviews, chatroom activity, and teaming posts for a specific course.',
        parameters: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'The user request about a course review, chatroom, or teaming status.' }
            },
            required: ['query']
        }
    },
    {
        name: 'read_campus_building',
        description: 'Read HKBU building information such as location, description, and nearby facilities for a named building or building code.',
        parameters: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'The user request about a building, such as AAB, WLB, library building, or where a building is.' }
            },
            required: ['query']
        }
    },
    {
        name: 'find_nearby_place',
        description: 'Use the current device location to find the nearest HKBU building or food outlet.',
        parameters: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'The user request about nearby buildings, restaurants, canteens, or current location.' }
            },
            required: ['query']
        }
    },
    {
        name: 'search_canteen_menu',
        description: 'Search for canteen menus and recommendations based on location.',
        parameters: {
            type: 'object',
            properties: {
                location: { type: 'string', description: 'User location or specific canteen name' },
                preference: { type: 'string', description: 'Food preference (e.g., spicy, vegetarian)' }
            },
            required: ['location']
        }
    },
    {
        name: 'check_library_availability',
        description: 'Query availability. If libraryName is provided but roomType is not, it returns available Room Types. If both are provided, it returns available Time Slots.',
        parameters: {
            type: 'object',
            properties: {
                libraryName: {
                    type: 'string',
                    description: 'Name of the library (Main Library, Shek Mun Campus Library, AAB Learning Commons)'
                },
                roomType: {
                    type: 'string',
                    description: 'Type of room (Group Study Rooms, Individual Study Rooms, Multipurpose Rooms)'
                }
            },
            required: ['libraryName']
        }
    },
    {
        name: 'book_library_seat',
        description: 'Book a seat in the library. Requires user confirmation step.',
        parameters: {
            type: 'object',
            properties: {
                seatId: { type: 'string', description: 'ID of the seat to book' },
                time: { type: 'string', description: 'Booking time (e.g., 14:00)' }
            },
            required: ['seatId', 'time']
        }
    },
    {
        name: 'get_user_profile',
        description: 'Get user preferences like major, residence hall, and favorite food. Used for semantic memory.',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'save_user_preference',
        description: 'Store a user preference or fact to persistent memory.',
        parameters: {
            type: 'object',
            properties: {
                key: { type: 'string', description: 'The key for the fact (e.g., hall, major, food)' },
                value: { type: 'string', description: 'The value to store' }
            },
            required: ['key', 'value']
        }
    },
    {
        name: 'search_campus_faq',
        description: 'Search the official HKBU knowledge base for questions about admissions, library policies, IT services, housing, and financial aid.',
        parameters: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'The user search query in English or Chinese' }
            },
            required: ['query']
        }
    }
];
