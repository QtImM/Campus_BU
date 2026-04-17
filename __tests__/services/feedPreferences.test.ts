import storage from '../../lib/storage';
import {
    FEED_HIDDEN_POSTS_STORAGE_KEY,
    addHiddenPostId,
    filterHiddenPosts,
    getHiddenPostIds,
    removeHiddenPostId,
} from '../../services/feedPreferences';

jest.mock('../../lib/storage', () => ({
    __esModule: true,
    default: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
    },
}));

const mockedStorage = storage as jest.Mocked<typeof storage>;

describe('feedPreferences', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns an empty list when no hidden post ids are stored', async () => {
        mockedStorage.getItem.mockResolvedValueOnce(null);

        await expect(getHiddenPostIds()).resolves.toEqual([]);
        expect(mockedStorage.getItem).toHaveBeenCalledWith(FEED_HIDDEN_POSTS_STORAGE_KEY);
    });

    it('adds a hidden post id without duplicating existing ids', async () => {
        mockedStorage.getItem.mockResolvedValueOnce(JSON.stringify(['post-1']));

        await addHiddenPostId('post-2');
        await addHiddenPostId('post-1');

        expect(mockedStorage.setItem).toHaveBeenNthCalledWith(
            1,
            FEED_HIDDEN_POSTS_STORAGE_KEY,
            JSON.stringify(['post-1', 'post-2']),
        );
        expect(mockedStorage.setItem).toHaveBeenNthCalledWith(
            2,
            FEED_HIDDEN_POSTS_STORAGE_KEY,
            JSON.stringify(['post-1']),
        );
    });

    it('removes a hidden post id and clears storage when the list becomes empty', async () => {
        mockedStorage.getItem
            .mockResolvedValueOnce(JSON.stringify(['post-1', 'post-2']))
            .mockResolvedValueOnce(JSON.stringify(['post-1']));

        await removeHiddenPostId('post-1');
        await removeHiddenPostId('post-1');

        expect(mockedStorage.setItem).toHaveBeenCalledWith(
            FEED_HIDDEN_POSTS_STORAGE_KEY,
            JSON.stringify(['post-2']),
        );
        expect(mockedStorage.removeItem).toHaveBeenCalledWith(FEED_HIDDEN_POSTS_STORAGE_KEY);
    });

    it('filters out hidden posts from the visible feed immediately', () => {
        const visiblePosts = filterHiddenPosts(
            [
                { id: 'post-1', content: 'Visible' },
                { id: 'post-2', content: 'Hide me' },
                { id: 'post-3', content: 'Visible too' },
            ],
            ['post-2'],
        );

        expect(visiblePosts).toEqual([
            { id: 'post-1', content: 'Visible' },
            { id: 'post-3', content: 'Visible too' },
        ]);
    });
});
