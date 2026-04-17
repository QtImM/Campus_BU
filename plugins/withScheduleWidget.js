const fs = require('fs');
const path = require('path');
const {
    IOSConfig,
    WarningAggregator,
    withDangerousMod,
    withEntitlementsPlist,
    withXcodeProject,
} = require('expo/config-plugins');

const APP_GROUP = 'group.com.budev.HKCampus';
const WIDGET_NAME = 'ScheduleWidget';
const WIDGET_BUNDLE_SUFFIX = 'ScheduleWidget';
const WIDGET_FILES = [
    'ScheduleWidgetProvider.swift',
    'ScheduleWidgetViews.swift',
    'ScheduleWidget.swift',
    'Info.plist',
    'ScheduleWidget.entitlements',
];

const ensureStringArray = (value) => {
    if (!Array.isArray(value)) return [];
    return value.filter((item) => typeof item === 'string');
};

const ensureAppGroupInEntitlements = (config) =>
    withEntitlementsPlist(config, (nextConfig) => {
        const groups = new Set(
            ensureStringArray(nextConfig.modResults['com.apple.security.application-groups'])
        );
        groups.add(APP_GROUP);
        nextConfig.modResults['com.apple.security.application-groups'] = Array.from(groups);
        return nextConfig;
    });

const copyWidgetTemplateFiles = (config) =>
    withDangerousMod(config, [
        'ios',
        async (nextConfig) => {
            const projectRoot = nextConfig.modRequest.projectRoot;
            const sourceDir = path.join(projectRoot, 'targets', WIDGET_NAME);
            const outputDir = path.join(projectRoot, 'ios', WIDGET_NAME);

            if (!fs.existsSync(sourceDir)) {
                WarningAggregator.addWarningIOS(
                    'withScheduleWidget',
                    `Missing ${sourceDir}. Widget files were not copied.`
                );
                return nextConfig;
            }

            fs.mkdirSync(outputDir, { recursive: true });
            for (const fileName of WIDGET_FILES) {
                const from = path.join(sourceDir, fileName);
                const to = path.join(outputDir, fileName);
                if (!fs.existsSync(from)) {
                    WarningAggregator.addWarningIOS(
                        'withScheduleWidget',
                        `Missing template file ${from}.`
                    );
                    continue;
                }
                fs.copyFileSync(from, to);
            }

            return nextConfig;
        },
    ]);

const addWidgetTargetToXcodeProject = (config) =>
    withXcodeProject(config, (nextConfig) => {
        const project = nextConfig.modResults;
        const appBundleId = nextConfig.ios?.bundleIdentifier ?? 'com.budev.HKCampus';
        const widgetBundleId = `${appBundleId}.${WIDGET_BUNDLE_SUFFIX}`;
        const existing = project.pbxTargetByName(WIDGET_NAME);
        const target = existing ?? project.addTarget(WIDGET_NAME, 'app_extension', WIDGET_NAME, widgetBundleId);
        const targetUuid = target?.uuid;

        if (!targetUuid) {
            WarningAggregator.addWarningIOS(
                'withScheduleWidget',
                `Could not create or resolve "${WIDGET_NAME}" target.`
            );
            return nextConfig;
        }

        IOSConfig.XcodeUtils.ensureGroupRecursively(project, WIDGET_NAME);

        IOSConfig.XcodeUtils.addBuildSourceFileToGroup({
            filepath: `${WIDGET_NAME}/ScheduleWidgetProvider.swift`,
            groupName: WIDGET_NAME,
            project,
            targetUuid,
        });
        IOSConfig.XcodeUtils.addBuildSourceFileToGroup({
            filepath: `${WIDGET_NAME}/ScheduleWidgetViews.swift`,
            groupName: WIDGET_NAME,
            project,
            targetUuid,
        });
        IOSConfig.XcodeUtils.addBuildSourceFileToGroup({
            filepath: `${WIDGET_NAME}/ScheduleWidget.swift`,
            groupName: WIDGET_NAME,
            project,
            targetUuid,
        });
        project.addFile(`${WIDGET_NAME}/Info.plist`, WIDGET_NAME, { target: targetUuid });
        project.addFile(`${WIDGET_NAME}/ScheduleWidget.entitlements`, WIDGET_NAME, { target: targetUuid });

        const targetName = WIDGET_NAME;
        project.updateBuildProperty('PRODUCT_BUNDLE_IDENTIFIER', `"${widgetBundleId}"`, undefined, targetName);
        project.updateBuildProperty('INFOPLIST_FILE', `"${WIDGET_NAME}/Info.plist"`, undefined, targetName);
        project.updateBuildProperty(
            'CODE_SIGN_ENTITLEMENTS',
            `"${WIDGET_NAME}/ScheduleWidget.entitlements"`,
            undefined,
            targetName
        );
        project.updateBuildProperty('SWIFT_VERSION', '5.0', undefined, targetName);
        project.updateBuildProperty('IPHONEOS_DEPLOYMENT_TARGET', '16.0', undefined, targetName);
        project.updateBuildProperty('APPLICATION_EXTENSION_API_ONLY', 'YES', undefined, targetName);
        project.updateBuildProperty('TARGETED_DEVICE_FAMILY', '"1,2"', undefined, targetName);

        if (nextConfig.ios?.appleTeamId) {
            project.updateBuildProperty(
                'DEVELOPMENT_TEAM',
                nextConfig.ios.appleTeamId,
                undefined,
                targetName
            );
        }

        return nextConfig;
    });

const withScheduleWidget = (config) => {
    config = ensureAppGroupInEntitlements(config);
    config = copyWidgetTemplateFiles(config);
    config = addWidgetTargetToXcodeProject(config);
    return config;
};

module.exports = withScheduleWidget;
