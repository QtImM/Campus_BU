# iOS Production Release 2026-05-20

## Uploaded Version

- App version: `1.2.7`
- iOS build number: `5`
- Android version code: `7`
- EAS profile: `production`

## Release Notes

- `production` profile uploads now disable the schedule widget because `eas.json` sets `EXPO_ENABLE_SCHEDULE_WIDGET=0` for TestFlight/App Store troubleshooting.
- Use the `production-widget` profile when you explicitly need an iOS build with the schedule widget enabled.
- `newArchEnabled` must stay enabled because Expo SDK 54 bundles `react-native-reanimated` 4.x for this app, and that library requires the New Architecture on iOS.
- `packageManager` stays pinned to `npm@10.9.2` so the committed lockfile matches the npm version used by EAS.

## Maintenance Reminder

- If the next iOS production build is submitted to App Store Connect, increment both the app version and iOS build number before uploading.
- Re-check widget-related native modules under the New Architecture, because disabling it is not compatible with the current Reanimated dependency set.
