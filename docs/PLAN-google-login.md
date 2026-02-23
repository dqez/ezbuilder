# Google Login Integration Plan

## Overview

This document outlines the plan for integrating Google Login (OAuth 2.0) into the EZBuilder platform. The backend (NestJS) will handle the OAuth flow and return a JWT token. If a Google account's email matches an existing email, the system will automatically link the accounts. Upon successful login, the user will be redirected to the dashboard.

## Project Type

**WEB** (Next.js Frontend + NestJS Backend)

## Success Criteria

- [ ] Users can click "Log in with Google" on the login/register pages.
- [ ] Users are redirected to Google for consent.
- [ ] Backend receives the Google profile, links to existing account via email, or creates a new one.
- [ ] User is redirected to `/dashboard` on the frontend with a valid JWT token.
- [ ] No regression on standard email/password login.

## Tech Stack

- **Backend:** `@nestjs/passport`, `passport-google-oauth20`, `passport`
- **Frontend:** Next.js (React), standard HTTP links for OAuth initiation.
- **Database:** Prisma (PostgreSQL)

## File Structure Changes

```text
api/
  ├── prisma/schema.prisma                 (Update User model)
  ├── src/modules/auth/
  │   ├── auth.controller.ts               (Add Google auth endpoints)
  │   ├── auth.service.ts                  (Add Google validation logic)
  │   ├── strategies/google.strategy.ts    [NEW] (Google OAuth strategy)
web/
  ├── components/auth/
  │   ├── GoogleLoginButton.tsx            [NEW] (UI Button)
  │   ├── LoginForm.tsx                    (Include Google button)
  │   ├── RegisterForm.tsx                 (Include Google button)
  ├── app/(auth)/google-callback/page.tsx  [NEW] (Handle token and redirect)
```

## Task Breakdown

### Task 1: Database Schema Update

- **Name:** Make Password Optional
- **Agent:** `database-architect`
- **Skills:** `database-design`
- **Priority:** P0
- **Dependencies:** None
- **INPUT→OUTPUT→VERIFY:**
  - _Input:_ Current `schema.prisma`.
  - _Output:_ `password String?` (optional password). Migration generated.
  - _Verify:_ Prisma client generates successfully and `npx prisma migrate dev` applies without errors.

### Task 2: Backend - Google Strategy Setup

- **Name:** Implement Google Passport Strategy
- **Agent:** `backend-specialist`
- **Skills:** `api-patterns`
- **Priority:** P1
- **Dependencies:** Task 1
- **INPUT→OUTPUT→VERIFY:**
  - _Input:_ Client ID & Secret in `.env`.
  - _Output:_ `google.strategy.ts` configured with Google OAuth credentials and callback URL (`/api/auth/google/callback`).
  - _Verify:_ NestJS app starts without dependency injection errors.

### Task 3: Backend - Auth Service & Controller

- **Name:** Handle Google Auth Flow & Account Linking
- **Agent:** `backend-specialist`
- **Skills:** `api-patterns`
- **Priority:** P1
- **Dependencies:** Task 2
- **INPUT→OUTPUT→VERIFY:**
  - _Input:_ Profile from Google Strategy.
  - _Output:_ `AuthService.validateGoogleUser` logic (links existing email or creates new user). `AuthController` endpoints `/google` and `/google/callback` that trigger redirect to frontend with JWT (e.g. `http://localhost:3000/google-callback?token=...`).
  - _Verify:_ Navigating to `/api/auth/google` redirects to Google consent screen.

### Task 4: Frontend - UI Implementation

- **Name:** Add Google Login Button
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P2
- **Dependencies:** None
- **INPUT→OUTPUT→VERIFY:**
  - _Input:_ Login and Register forms.
  - _Output:_ A visually appealing "Log in with Google" button component bridging to backend endpoint.
  - _Verify:_ Clicking the button redirects the window to backend's `/api/auth/google`.

### Task 5: Frontend - Auth Callback Handling

- **Name:** Handle Token Redirect
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P2
- **Dependencies:** Task 3, 4
- **INPUT→OUTPUT→VERIFY:**
  - _Input:_ Successful redirect from backend with JWT token.
  - _Output:_ `/google-callback` route that reads token from URL, saves to auth store, and redirects to `/dashboard`.
  - _Verify:_ User is authenticated in the app and sees the dashboard.

## ✅ PHASE X COMPLETE

- Lint: [x] Pass
- Security: [x] No critical issues
- Build: [x] Success
- Date: 2026-02-23
