type TranslateFn = (key: string, defaultValue?: string) => string;

type AlertCopy = {
    title: string;
    message: string;
};

export const getDeleteAccountSuccessAlertCopy = (t: TranslateFn): AlertCopy => ({
    title: t('common.success', 'Success'),
    message: t('profile.delete_account_success', 'Your account has been deleted.'),
});

export const getDeleteAccountErrorAlertCopy = (t: TranslateFn): AlertCopy => ({
    title: t('common.error', 'Error'),
    message: t(
        'profile.delete_account_failed_logged_in',
        'Account deletion failed. You are still signed in. Please try again.'
    ),
});
