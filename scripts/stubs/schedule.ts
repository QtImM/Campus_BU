export type UserScheduleEntry = {
    title: string;
    courseCode?: string;
    startTime?: string;
    endTime?: string;
    weekText?: string;
    room?: string;
    dayOfWeek: number;
    startPeriod?: number;
};

export const getUserScheduleEntries = async (_userId: string): Promise<UserScheduleEntry[]> => [];

