describe('app config release safety', () => {
    const originalEnv = process.env;

    afterEach(() => {
        process.env = originalEnv;
        jest.resetModules();
    });

    it('uses the release version and keeps the new architecture enabled for iOS builds', () => {
        process.env = {
            ...originalEnv,
            EAS_BUILD_PROFILE: 'production',
        };

        const createConfig = require('../app.config').default as () => {
            version?: string;
            newArchEnabled?: boolean;
            ios?: {
                buildNumber?: string;
            };
        };
        const config = createConfig();

        expect(config.version).toBe('1.2.14');
        expect(config.ios?.buildNumber).toBe('2');
        expect(config.newArchEnabled).toBe(true);
    });

    it('disables the widget plugin in production to avoid signing issues', () => {
        process.env = {
            ...originalEnv,
            EAS_BUILD_PROFILE: 'production',
        };

        const createConfig = require('../app.config').default as () => {
            plugins?: unknown[];
        };
        const config = createConfig();
        const pluginEntries = config.plugins ?? [];
        const hasWidgetPlugin = pluginEntries.some((entry) =>
            Array.isArray(entry) ? entry[0] === './plugins/withScheduleWidget' : entry === './plugins/withScheduleWidget'
        );

        expect(hasWidgetPlugin).toBe(false);
    });

    it('enables the widget plugin when EXPO_ENABLE_SCHEDULE_WIDGET is set', () => {
        process.env = {
            ...originalEnv,
            EAS_BUILD_PROFILE: 'production',
            EXPO_ENABLE_SCHEDULE_WIDGET: '1',
        };

        const createConfig = require('../app.config').default as () => {
            plugins?: unknown[];
        };
        const config = createConfig();
        const pluginEntries = config.plugins ?? [];
        const hasWidgetPlugin = pluginEntries.some((entry) =>
            Array.isArray(entry) ? entry[0] === './plugins/withScheduleWidget' : entry === './plugins/withScheduleWidget'
        );

        expect(hasWidgetPlugin).toBe(true);
    });

    it('restores expo-updates runtime config from the known-good 1.2.2 release shape', () => {
        process.env = {
            ...originalEnv,
            EAS_BUILD_PROFILE: 'production',
        };

        const createConfig = require('../app.config').default as () => {
            runtimeVersion?: unknown;
            updates?: unknown;
        };
        const config = createConfig();

        expect(config.runtimeVersion).toEqual({ policy: 'appVersion' });
        expect(config.updates).toEqual({
            url: 'https://u.expo.dev/44c59701-d20a-45ae-bf97-d3f3d8cae72d',
        });
    });

    it('uses the HKCampus brand asset for the home screen icons', () => {
        process.env = {
            ...originalEnv,
        };

        const createConfig = require('../app.config').default as () => {
            icon?: string;
            android?: {
                adaptiveIcon?: {
                    foregroundImage?: string;
                };
            };
        };
        const config = createConfig();

        expect(config.icon).toBe('./assets/images/HKCampusicon.png');
        expect(config.android?.adaptiveIcon?.foregroundImage).toBe('./assets/images/HKCampusicon.png');
    });
});
