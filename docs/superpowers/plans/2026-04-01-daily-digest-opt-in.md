# Daily Digest Opt-In Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make AI Daily Digest a separately controlled opt-in feature that is off by default, so review builds do not send digest pushes unless a user explicitly enables them.

**Architecture:** Add a dedicated digest preference in storage, gate the digest job and push sender on that preference, and expose a separate toggle in the Profile settings UI. Keep the existing global push-notification toggle unchanged so comments, likes, and other notifications continue to work normally.

**Tech Stack:** TypeScript, Expo/React Native, Jest

---

### Task 1: Add digest preference storage and gating

**Files:**
- Modify: `C:/Users/Tim/Documents/GitHub/CampusCopy/services/agent/dailyDigest/repository.ts`
- Modify: `C:/Users/Tim/Documents/GitHub/CampusCopy/services/agent/dailyDigest/job.ts`
- Test: `C:/Users/Tim/Documents/GitHub/CampusCopy/__tests__/services/agent/dailyDigest.test.ts`

- [ ] Add digest preference read/write helpers with default `false`
- [ ] Write a failing test proving the job exits without fetch/push when digest is disabled
- [ ] Implement the minimal gating logic in the job
- [ ] Write a failing test proving enabled digest can send once per day
- [ ] Implement the minimal support code needed for that behavior

### Task 2: Expose a separate Profile toggle

**Files:**
- Modify: `C:/Users/Tim/Documents/GitHub/CampusCopy/app/(tabs)/profile.tsx`
- Modify: `C:/Users/Tim/Documents/GitHub/CampusCopy/app/i18n/locales/en.json`
- Modify: `C:/Users/Tim/Documents/GitHub/CampusCopy/app/i18n/locales/zh-Hans.json`
- Modify: `C:/Users/Tim/Documents/GitHub/CampusCopy/app/i18n/locales/zh-Hant.json`

- [ ] Load the digest preference alongside the existing push preference
- [ ] Add a dedicated toggle and hint copy for AI Daily Digest
- [ ] Keep the digest toggle disabled when push notifications are disabled
- [ ] Persist the digest preference without changing existing push-notification behavior

### Task 3: Verify behavior

**Files:**
- Verify: `C:/Users/Tim/Documents/GitHub/CampusCopy/__tests__/services/agent/dailyDigest.test.ts`

- [ ] Run the focused digest test file
- [ ] If the UI wiring changes service imports or TypeScript signatures, run a second focused test or type-oriented command as needed
