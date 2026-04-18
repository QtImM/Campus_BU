# iOS Schedule Widget Disabled Notes

## Status

The Expo config plugin for the iOS schedule widget is temporarily disabled on April 18, 2026.

This keeps `npx expo prebuild --no-install --platform ios` from failing while preserving the existing widget source files for later recovery work.

## What Was Disabled

The following plugin entry was removed from [app.json](C:/Users/Tim/Documents/GitHub/CampusCopy/app.json):

```json
"./plugins/withScheduleWidget.js"
```

This means Expo prebuild will no longer try to:

- Copy widget files from `targets/ScheduleWidget/` into `ios/ScheduleWidget/`
- Create the `ScheduleWidget` iOS extension target
- Add widget entitlements and build settings to the generated Xcode project

## Root Cause

The current failure comes from [withScheduleWidget.js](C:/Users/Tim/Documents/GitHub/CampusCopy/plugins/withScheduleWidget.js).

Observed build error:

```text
TypeError: [ios.xcodeproj]: withIosXcodeprojBaseMod: Cannot read properties of undefined (reading 'ScheduleWidget')
```

The likely root cause is in these lines:

- [withScheduleWidget.js](C:/Users/Tim/Documents/GitHub/CampusCopy/plugins/withScheduleWidget.js):108
- [withScheduleWidget.js](C:/Users/Tim/Documents/GitHub/CampusCopy/plugins/withScheduleWidget.js):109

The plugin calls:

```js
project.addFile(`${WIDGET_NAME}/Info.plist`, WIDGET_NAME, { target: targetUuid });
project.addFile(`${WIDGET_NAME}/ScheduleWidget.entitlements`, WIDGET_NAME, { target: targetUuid });
```

In the `xcode` library, the second argument is expected to be a PBXGroup key, not the display name string `ScheduleWidget`. That mismatch causes group lookup to fail during prebuild.

## Files Preserved For Later

These files were intentionally left in place:

- [withScheduleWidget.js](C:/Users/Tim/Documents/GitHub/CampusCopy/plugins/withScheduleWidget.js)
- [Info.plist](C:/Users/Tim/Documents/GitHub/CampusCopy/targets/ScheduleWidget/Info.plist)
- [ScheduleWidget.entitlements](C:/Users/Tim/Documents/GitHub/CampusCopy/targets/ScheduleWidget/ScheduleWidget.entitlements)
- [ScheduleWidget.swift](C:/Users/Tim/Documents/GitHub/CampusCopy/targets/ScheduleWidget/ScheduleWidget.swift)
- [ScheduleWidgetProvider.swift](C:/Users/Tim/Documents/GitHub/CampusCopy/targets/ScheduleWidget/ScheduleWidgetProvider.swift)
- [ScheduleWidgetViews.swift](C:/Users/Tim/Documents/GitHub/CampusCopy/targets/ScheduleWidget/ScheduleWidgetViews.swift)
- [ios-widget-plan.md](C:/Users/Tim/Documents/GitHub/CampusCopy/docs/ios-widget-plan.md)

## Recommended Recovery Steps

When widget work resumes:

1. Fix [withScheduleWidget.js](C:/Users/Tim/Documents/GitHub/CampusCopy/plugins/withScheduleWidget.js) so plist and entitlements are added using the real PBXGroup key returned from `IOSConfig.XcodeUtils.ensureGroupRecursively(...)`, not the group name string.
2. Add duplicate guards before adding `Info.plist` and `ScheduleWidget.entitlements`.
3. Re-enable the plugin entry in [app.json](C:/Users/Tim/Documents/GitHub/CampusCopy/app.json).
4. Run `npx expo prebuild --no-install --platform ios`.
5. Confirm the generated iOS project contains a `ScheduleWidget` extension target.

## Why This Approach

Disabling only the plugin is the lowest-risk option:

- It restores iOS prebuild behavior immediately.
- It does not delete any widget implementation work.
- It keeps the later recovery path short and well documented.
