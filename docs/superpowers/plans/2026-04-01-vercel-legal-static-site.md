# Vercel Legal Static Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a minimal static site directory in this repository that can be deployed on Vercel and exposes public HTTPS `/privacy` and `/support` pages for App Store Connect.

**Architecture:** Keep the Expo app untouched and add a separate `public-site/` folder containing standalone HTML files plus a small `vercel.json` rewrite map. Reuse the existing privacy-policy content and create a lightweight support page with project-derived contact details.

**Tech Stack:** Static HTML, inline CSS, Vercel rewrites

---

### Task 1: Create deployable static site files

**Files:**
- Create: `C:/Users/Tim/Documents/GitHub/CampusCopy/public-site/index.html`
- Create: `C:/Users/Tim/Documents/GitHub/CampusCopy/public-site/privacy-policy.html`
- Create: `C:/Users/Tim/Documents/GitHub/CampusCopy/public-site/support.html`
- Create: `C:/Users/Tim/Documents/GitHub/CampusCopy/public-site/vercel.json`
- Create: `C:/Users/Tim/Documents/GitHub/CampusCopy/public-site/README.md`

- [ ] **Step 1: Prepare the static folder structure**

Create `public-site/` and reserve it for Vercel-only static files so the mobile app build remains untouched.

- [ ] **Step 2: Add the privacy page**

Copy the policy text from `docs/privacy/privacy-policy.html`, preserve the existing content, and add simple cross-links to the support page and home page.

- [ ] **Step 3: Add the support page**

Create a minimal public support page for HKCampus with:
- App name
- Short product description
- Support email links
- Expected response guidance
- Link back to the privacy page

- [ ] **Step 4: Add a minimal landing page**

Create a root page with links to `/privacy` and `/support` so the deployment has a usable homepage.

- [ ] **Step 5: Add Vercel rewrites**

Map clean public URLs to the HTML files:
- `/privacy` -> `/privacy-policy.html`
- `/support` -> `/support.html`

- [ ] **Step 6: Add deployment notes**

Document that Vercel should use `public-site/` as the Root Directory and that the resulting production URLs can be used for App Store Connect.

### Task 2: Verify deployability locally

**Files:**
- Verify: `C:/Users/Tim/Documents/GitHub/CampusCopy/public-site/vercel.json`
- Verify: `C:/Users/Tim/Documents/GitHub/CampusCopy/public-site/privacy-policy.html`
- Verify: `C:/Users/Tim/Documents/GitHub/CampusCopy/public-site/support.html`

- [ ] **Step 1: Validate JSON syntax**

Run a local JSON parse against `public-site/vercel.json`.

- [ ] **Step 2: Check generated files exist**

List the `public-site/` directory and confirm the expected files are present.

- [ ] **Step 3: Spot-check key page content**

Confirm the privacy page contains the expected title and contact links, and the support page contains both support emails and the privacy-policy link.
