# Apple Submission Checklist

Applies to: `HKCampus`

Last updated: `2026-04-01`

Status legend:

- `Done`: already confirmed by you or clearly verifiable from the current repository
- `Pending`: likely still needs materials, validation, or manual completion in App Store Connect
- `High risk`: likely to delay review or cause rejection if left incomplete

---

## Done

### Apple account and build basics

- [x] Enrolled in the Apple Developer Program
- [x] App created in App Store Connect
- [x] TestFlight build already published
- [x] iOS `bundleIdentifier` configured as `com.budev.HKCampus`
- [x] iOS `buildNumber` configured
- [x] `appleTeamId` configured
- [x] EAS iOS production build configuration is present

### Core app configuration

- [x] App name configured as `HKCampus`
- [x] iOS permission copy configured
- [x] `ITSAppUsesNonExemptEncryption: false` declared
- [x] App icon and splash assets configured

### Review-relevant capabilities already in code

- [x] Account deletion flow exists: [services/auth.ts](/c:/Users/Tim/Documents/GitHub/CampusCopy/services/auth.ts#L116)
- [x] Reporting flow exists: [services/moderation.ts](/c:/Users/Tim/Documents/GitHub/CampusCopy/services/moderation.ts)
- [x] Blocking flow exists: [services/moderation.ts](/c:/Users/Tim/Documents/GitHub/CampusCopy/services/moderation.ts)
- [x] Privacy policy document exists: [docs/privacy/privacy-policy.html](/c:/Users/Tim/Documents/GitHub/CampusCopy/docs/privacy/privacy-policy.html)
- [x] Push notification capability is integrated: [services/push_notifications.ts](/c:/Users/Tim/Documents/GitHub/CampusCopy/services/push_notifications.ts)

### Security checks already confirmed

- [x] No plaintext `SUPABASE_SERVICE_ROLE_KEY` found in the repository
- [x] Edge Functions read `SUPABASE_SERVICE_ROLE_KEY` from environment variables
- [x] The frontend uses the Supabase `anon/publishable key`, not the service role key

---

## High Risk

### 1. Account deletion must satisfy review expectations

- [x] The deletion flow only signs the user out after the `delete_user` RPC succeeds: [services/auth.ts](/c:/Users/Tim/Documents/GitHub/CampusCopy/services/auth.ts#L116)
- [x] Failed deletion keeps the user signed in and shows explicit feedback: [app/(tabs)/profile.tsx](/c:/Users/Tim/Documents/GitHub/CampusCopy/app/(tabs)/profile.tsx)
- [x] Successful deletion shows a clear confirmation message for the reviewer: [app/(tabs)/profile.tsx](/c:/Users/Tim/Documents/GitHub/CampusCopy/app/(tabs)/profile.tsx)
- [x] Real-device validation already confirmed that a deleted account cannot sign in again
- [x] The `delete_user` RPC exists in production Supabase and matches the current deletion flow
- [x] Production cleanup behavior for `auth.users`, profile data, and related content has been checked against expectations

Recommended confirmations:

- [x] Complete one end-to-end device test for `Delete Account -> cannot sign in again`
- [x] Confirm in Supabase that `delete_user` still exists and is callable in production
- [x] Confirm whether `auth.users`, `users`, posts, and related data are deleted, retained, or sanitized as designed

### 2. Reviewers must be able to sign in smoothly

- [x] A dedicated review account is ready and can sign in directly
- [x] `Review Notes` now include the test account, login method, and delete-account path

Recommended preparation:

- [x] One dedicated review account
- [x] Clear login steps
- [x] If OTP is normally required, explain in `Review Notes` that the current review account can sign in with password only

### 3. Privacy Policy and App Store Connect privacy metadata

- [x] Public privacy policy page deployed to HTTPS
- [ ] High risk: manually paste the privacy policy URL into App Store Connect if you have not done it yet
- [ ] High risk: make sure the App Privacy questionnaire matches the app's actual data collection and use

Recommended confirmations:

- [x] Public privacy policy page: `https://public-site-ten-pearl.vercel.app/privacy`
- [ ] App Store Connect `Privacy Policy URL` updated manually
- [ ] App Privacy questionnaire covers email, profile data, images, location, messages, notifications, and related actual usage

### 4. UGC moderation and support readiness

- [ ] High risk: even if report and block logic exists, review can still fail if the reviewer cannot easily find or understand the moderation entry points
- [ ] High risk: community apps are easier to defend during review when a public support page or support email is clearly available

Recommended confirmations:

- [ ] Report entry points are visible and operable in the real UI
- [ ] Block entry points are visible and operable in the real UI
- [ ] There is an actual manual or backend process for handling reports
- [x] Public support page deployed: `https://public-site-ten-pearl.vercel.app/support`
- [ ] App Store Connect `Support URL` updated manually

---

## Pending

### App Store Connect metadata

- [ ] Finalize subtitle
- [ ] Finalize keywords
- [ ] Finalize description
- [ ] Finalize promotional text
- [ ] Fill in `Support URL`
- [ ] If applicable, fill in `Marketing URL`
- [ ] Finalize copyright information
- [ ] Complete age rating and content declarations

### Screenshots and assets

- [ ] Prepare iPhone screenshots
- [ ] If you support iPad listing, prepare iPad screenshots
- [ ] If needed, prepare an App Preview video

Recommended screenshot coverage:

- [ ] Home / campus feed
- [ ] Courses or map
- [ ] Community / forum
- [ ] Messages or notifications
- [ ] Profile / settings

### Permissions and device validation

- [ ] Validate photo-library permission timing and behavior
- [ ] Validate camera permission timing and behavior
- [ ] Validate location permission timing and behavior
- [ ] Validate Face ID related flows
- [ ] Validate that the app degrades safely when permissions are denied

### Push and device capabilities

- [ ] Validate push notifications on a real TestFlight device
- [ ] Validate degraded behavior after notifications are disabled
- [ ] Validate image upload on a real device
- [ ] Validate map and location flows in both allowed and denied states

### Stability and submission quality

- [ ] Validate the core flows end to end on a real device: sign in, post, comment, message, upload, notifications, map, courses
- [ ] Check weak-network behavior for white screens or dead ends
- [ ] Check logged-out / logged-in switching behavior
- [ ] Check layout across different iPhone sizes
- [ ] If iPad is supported, check iPad layout
- [ ] Remove any debug text, placeholder pages, or test-only entry points
- [ ] Run one last pre-submission smoke test

### Supabase and data security

- [ ] Re-check RLS on key production tables
- [ ] Re-check access policies for messages, profiles, posts, notifications, and uploads
- [ ] Confirm the exposed `anon key` does not allow unauthorized reads or writes
- [ ] Confirm production and local environment variables are separated correctly

### Review materials

- [x] `Review Notes` draft exists: [docs/app-store-review-notes.md](/c:/Users/Tim/Documents/GitHub/CampusCopy/docs/app-store-review-notes.md)
- [x] Review account is documented
- [x] Review steps are documented
- [x] Delete-account entry point is documented as `Profile -> Delete Account`
- [x] Login method and deletion verification result are documented
- [x] Reviewer support path is documented
- [x] Public support contact path is documented

---

## Recommended Next 7 Things

1. Double-check the final state of `auth.users`, `users`, posts, and related data after account deletion.
2. Keep one stable review account that App Review can use directly.
3. Manually paste the deployed privacy policy URL into App Store Connect.
4. Fill in the deployed support URL, metadata, keywords, and screenshots.
5. Re-run TestFlight checks for push, uploads, location, and messaging.
6. Do one more real-device smoke test on the core flows.
7. Paste the final `Review Notes` so the reviewer can get through the app on the first try.

---

## Suggested Review Notes Template

```md
Thank you for reviewing HKCampus.

Test account:
- Email: [your review account]
- Password / OTP instructions: [fill in]

Notes:
- This app is designed for campus users.
- If a school email or special access is required, please use the test account above.
- Account deletion is available in: Profile -> Delete Account
- After successful deletion, the app shows a clear account deleted confirmation and returns to the login screen.
- Privacy Policy: [your public URL]
- Support: [your support URL or email]
```

---

## Current Assessment

At this point, the main remaining submission risks are not the Apple account setup or the build pipeline. The bigger review risks are:

- whether account deletion is clearly reviewable
- whether the reviewer can sign in smoothly
- whether Privacy Policy and App Privacy metadata are complete and accurate
- whether moderation and support paths are clear enough for a community app

The account-deletion area is already in much better shape now because:

- successful deletion shows a clear confirmation state
- failed deletion does not pretend to succeed and keeps the user signed in

The next most valuable work is final production-data verification and manual completion of the remaining App Store Connect fields.
