import LoginScreen from '../../app/(auth)/login';
import RegisterScreen from '../../app/(auth)/register';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Keyboard } from 'react-native';

jest.mock('../../services/auth', () => ({
    signIn: jest.fn(),
    sendOTP: jest.fn(),
    verifyOTP: jest.fn(),
    updatePassword: jest.fn(),
}));

jest.mock('../../app/i18n/i18n', () => ({
    changeLanguage: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, fallback?: string) => fallback || key,
        i18n: { language: 'en' },
    }),
}));

describe('auth agreement link row', () => {
    it('renders the login agreement links with slash separators', () => {
        const { getAllByText } = render(<LoginScreen />);
        expect(getAllByText(' / ').length).toBeGreaterThan(0);
    });

    it('renders the register agreement links with slash separators', () => {
        const { getAllByText } = render(<RegisterScreen />);
        expect(getAllByText(' / ').length).toBeGreaterThan(0);
    });
});

describe('auth screen touch targets', () => {
    beforeEach(() => {
        jest.spyOn(Keyboard, 'dismiss').mockImplementation(jest.fn());
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('expands the login agreement checkbox touch target', () => {
        const { getByTestId } = render(<LoginScreen />);
        expect(getByTestId('auth-agreement-checkbox-login').props.hitSlop).toEqual({ top: 12, bottom: 12, left: 12, right: 12 });
    });

    it('dismisses the keyboard when tapping blank space on login', () => {
        const dismissSpy = jest.spyOn(Keyboard, 'dismiss');
        const { getByTestId } = render(<LoginScreen />);
        fireEvent.press(getByTestId('auth-background-login'));
        expect(dismissSpy).toHaveBeenCalled();
    });

    it('expands the register agreement checkbox touch target', () => {
        const { getByTestId } = render(<RegisterScreen />);
        expect(getByTestId('auth-agreement-checkbox-register').props.hitSlop).toEqual({ top: 12, bottom: 12, left: 12, right: 12 });
    });

    it('dismisses the keyboard when tapping blank space on register', () => {
        const dismissSpy = jest.spyOn(Keyboard, 'dismiss');
        const { getByTestId } = render(<RegisterScreen />);
        fireEvent.press(getByTestId('auth-background-register'));
        expect(dismissSpy).toHaveBeenCalled();
    });
});
