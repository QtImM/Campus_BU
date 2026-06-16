# iOS Local Build → TestFlight Guide

Complete workflow for building and submitting HKCampus to Apple TestFlight from a local Mac.

## Prerequisites

- macOS with Xcode installed (Command Line Tools pointing to `Xcode.app`)
- Node.js dependencies installed (`npm install`)
- `.env` file configured with production values (see `.env.example`)
- EAS CLI >= 18.0.6 (`npx eas --version` to check)
- Apple ID with App Store Connect access (timchindev EAS owner)

## Version Management

Versions are managed **locally** (`appVersionSource: "local"` in `eas.json`):

| Field | Source | Current |
|-------|--------|---------|
| App version (`CFBundleShortVersionString`) | `package.json` → `version` | 1.2.17 |
| iOS build number (`CFBundleVersion`) | `app.config.ts` → `buildNumber` | 3 |
| Android versionCode | `app.config.ts` → `versionCode` | 8 |

**Before each release**, bump the relevant numbers:

1. Update `version` in `package.json` (e.g. `1.2.17` → `1.2.18`)
2. Update `buildNumber` in `app.config.ts` (must be unique per App Store Connect)
3. For Android: update `versionCode` in `app.config.ts` (must be higher than previous)

> Apple requires every build number to be unique — you cannot re-upload the same `CFBundleVersion` even if the app version changes.

## Build Profiles

Defined in [`eas.json`](../../eas.json):

| Profile | Widget | Use case |
|---------|--------|----------|
| `production` | OFF | App Store / TestFlight without widget |
| `production-widget` | ON | App Store / TestFlight with ScheduleWidget |
| `development` | OFF | Device install with dev menu |

> The `EXPO_ENABLE_SCHEDULE_WIDGET` env var in the command **overrides** the profile default.

## Step-by-Step: Production Build → TestFlight

### 1. Bump versions

```bash
# Edit package.json "version" and app.config.ts "buildNumber"
# Example: 1.2.17 / build 3 → 1.2.18 / build 4
```

### 2. Build the production .ipa

```bash
# With ScheduleWidget enabled:
EXPO_ENABLE_SCHEDULE_WIDGET=1 npx eas build --platform ios --profile production --local
```

This command **automatically**:
- Generates the `ios/` folder (expo prebuild)
- Runs `pod install`
- Invokes `xcodebuild` archive + export
- Outputs a `.ipa` file to the project root

**No manual `expo prebuild` or `ios/` folder management is needed.**

### 3. Locate the build artifact

The `.ipa` is saved in the project root with a timestamp name:

```
/Users/leo/Desktop/ITM/Campus_BU/build-XXXXXXXXXXXXXX.ipa
```

### 4. Submit to App Store Connect

```bash
npx eas submit --platform ios --path ./build-XXXXXXXXXXXXXX.ipa
```

Replace `XXXXXXXXXXXXXX` with the actual timestamp from step 3.

### 5. Wait for Apple processing

- Apple processes the upload (~5–10 minutes)
- You'll receive an email when processing completes
- Check status: [App Store Connect → TestFlight](https://appstoreconnect.apple.com/apps/6759825791/testflight/ios)