# iOS Production Release 2026-05-20

## Uploaded Version

- App version: `1.2.4`
- iOS build number: `2`
- Android version code: `7`
- EAS profile: `production`

## Release Notes

- `production` profile uploads should include the schedule widget because `eas.json` sets `EXPO_ENABLE_SCHEDULE_WIDGET=1`.
- `newArchEnabled` is temporarily set to `false` to reduce iOS native build risk while `react-native-shared-group-preferences` remains part of the widget data bridge.
- `packageManager` stays pinned to `npm@10.9.2` so the committed lockfile matches the npm version used by EAS.

## Maintenance Reminder

- If the next iOS production build is submitted to App Store Connect, increment both the app version and iOS build number before uploading.
- Re-check whether the widget bridge can safely run with the new architecture before turning `newArchEnabled` back on.
