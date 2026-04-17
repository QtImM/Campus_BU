const zhHans = require('../../app/i18n/locales/zh-Hans.json');
const zhHant = require('../../app/i18n/locales/zh-Hant.json');

const authKeys = [
    'login_title',
    'password_label',
    'login_btn',
    'email_placeholder',
    'verify_btn',
    'email_suffix_other',
    'send_success',
    'resend_success',
    'verification_code',
    'age_gate_notice',
    'agreement_checkbox_prefix',
    'must_accept_terms_before_login',
    'must_accept_terms_before_send_code',
    'must_accept_terms_before_register',
];

const commonKeys = ['cancel', 'tip', 'error', 'success', 'ok'];

const assertReadable = (text: string) => {
    expect(text).toBeTruthy();
    expect(text).not.toContain('??');
    expect(text).not.toContain('???');
    expect(text).not.toBe('?');
};

describe('auth locale copy', () => {
    it('keeps zh-Hans auth and common copy readable', () => {
        commonKeys.forEach((key) => assertReadable(zhHans.common[key]));
        authKeys.forEach((key) => assertReadable(zhHans.auth[key]));
    });

    it('keeps zh-Hant auth and common copy readable', () => {
        commonKeys.forEach((key) => assertReadable(zhHant.common[key]));
        authKeys.forEach((key) => assertReadable(zhHant.auth[key]));
    });
});
