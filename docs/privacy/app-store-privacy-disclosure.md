# HKCampus App Store Privacy Disclosure Checklist

Last reviewed: 2026-04-01

Use this as the working draft for App Store Connect "App Privacy".

## Tracking

- Tracking: No

Reason:

- No advertising ID usage was identified.
- No cross-app or third-party advertising tracking flow was identified.

## Data Categories To Disclose

### Contact Info

- Email Address

Use:

- Account management
- User authentication
- Community and support contact

### User Content

- Profile nickname
- Avatar
- Posts
- Comments
- Uploaded images
- Direct messages
- Course exchange / teaming contact content

Use:

- App functionality
- User-to-user communication
- Moderation and safety

### Identifiers

- User ID
- Push notification token

Use:

- Account functionality
- Notifications

### Location

- Precise location, only when the user actively requests location-based features

Use:

- Map centering
- Nearby campus features
- User-selected location attached to posts

### Usage / App Activity

- Likes
- Follows
- Favorites
- Notification read state

Use:

- App functionality
- Personalization

## Review Build Notes

- Location permission is user-initiated.
- Push notification permission is user-initiated.
- Review build should not expose "demo", "beta", "mock", "prototype", or similar wording in user-facing UI.

## Public URLs

- Privacy Policy: https://public-site-ten-pearl.vercel.app/privacy
- Support: https://public-site-ten-pearl.vercel.app/support

## Before Submission

- Use the public privacy policy URL above in App Store Connect.
- Use the public support URL above in App Store Connect.
- Verify the final build still matches the declared data collection above.
