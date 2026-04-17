export type AuthAgreementAction = 'login' | 'send_otp' | 'register';

const MESSAGE_KEY_BY_ACTION: Record<AuthAgreementAction, string> = {
    login: 'auth.must_accept_terms_before_login',
    send_otp: 'auth.must_accept_terms_before_send_code',
    register: 'auth.must_accept_terms_before_register',
};

export const getAgreementGuardResult = (
    accepted: boolean,
    action: AuthAgreementAction,
): { ok: true } | { ok: false; messageKey: string } => {
    if (accepted) {
        return { ok: true };
    }

    return {
        ok: false,
        messageKey: MESSAGE_KEY_BY_ACTION[action],
    };
};
