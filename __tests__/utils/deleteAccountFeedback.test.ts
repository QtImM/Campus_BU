import {
    getDeleteAccountErrorAlertCopy,
    getDeleteAccountSuccessAlertCopy,
} from '../../utils/deleteAccountFeedback';

describe('delete account feedback copy', () => {
    it('returns explicit success messaging for account deletion', () => {
        const t = jest.fn((key: string, fallback?: string) => {
            const translations: Record<string, string> = {
                'common.success': 'Success',
                'profile.delete_account_success': 'Your account has been deleted.',
            };

            return translations[key] ?? fallback ?? key;
        });

        expect(getDeleteAccountSuccessAlertCopy(t)).toEqual({
            title: 'Success',
            message: 'Your account has been deleted.',
        });
    });

    it('returns explicit failure messaging that keeps the user signed in', () => {
        const t = jest.fn((key: string, fallback?: string) => {
            const translations: Record<string, string> = {
                'common.error': 'Error',
                'profile.delete_account_failed_logged_in': 'Account deletion failed. You are still signed in. Please try again.',
            };

            return translations[key] ?? fallback ?? key;
        });

        expect(getDeleteAccountErrorAlertCopy(t)).toEqual({
            title: 'Error',
            message: 'Account deletion failed. You are still signed in. Please try again.',
        });
    });
});
