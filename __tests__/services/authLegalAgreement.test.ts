import { getAgreementGuardResult } from '../../services/authLegalAgreement';

describe('auth legal agreement guard', () => {
    it('allows protected auth actions after consent', () => {
        expect(getAgreementGuardResult(true, 'login')).toEqual({ ok: true });
        expect(getAgreementGuardResult(true, 'send_otp')).toEqual({ ok: true });
        expect(getAgreementGuardResult(true, 'register')).toEqual({ ok: true });
    });

    it('blocks login when consent is missing', () => {
        expect(getAgreementGuardResult(false, 'login')).toEqual({
            ok: false,
            messageKey: 'auth.must_accept_terms_before_login',
        });
    });

    it('blocks sending OTP when consent is missing', () => {
        expect(getAgreementGuardResult(false, 'send_otp')).toEqual({
            ok: false,
            messageKey: 'auth.must_accept_terms_before_send_code',
        });
    });

    it('blocks registration completion when consent is missing', () => {
        expect(getAgreementGuardResult(false, 'register')).toEqual({
            ok: false,
            messageKey: 'auth.must_accept_terms_before_register',
        });
    });
});
