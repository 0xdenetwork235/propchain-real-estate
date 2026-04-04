<instructions>
## 🚨 MANDATORY: CHANGELOG TRACKING 🚨

You MUST maintain this file to track your work across messages. This is NON-NEGOTIABLE.

---

## INSTRUCTIONS

- **MAX 5 lines** per entry - be concise but informative
- **Include file paths** of key files modified or discovered
- **Note patterns/conventions** found in the codebase
- **Sort entries by date** in DESCENDING order (most recent first)
- If this file gets corrupted, messy, or unsorted -> re-create it. 
- CRITICAL: Updating this file at the END of EVERY response is MANDATORY.
- CRITICAL: Keep this file under 300 lines. You are allowed to summarize, change the format, delete entries, etc., in order to keep it under the limit.

</instructions>

<changelog>

## 2026-04-03 — Remove SDK auth, replace with custom context auth
- `AppContext`: added `AuthUser`, `loginWithCode(email, code)`, `logoutUser()`, `isAnonymous` — all persisted to localStorage
- Demo code is always `123456`; `loginWithCode` validates it and stores user as JSON in `localStorage`
- `AuthPage`: removed `useAuth` from SDK; wired verify step to `loginWithCode`; added "Dev shortcut" code box showing `123456` with copy button
- `TopNav`, `Landing`, `Portfolio`, `Transactions`, `PropertyDetail`: all `useAuth` imports replaced with `useApp` destructuring
- `AnimaProvider` kept in `index.tsx` only for SDK data hooks (`useQuery`/`useMutation`)

## 2026-04-03 — Custom Auth Page with 6-digit code
- Created `src/views/AuthPage.tsx`: 3-step flow (email → verify → done) with animated 6-digit code input
- `DevGuide` component shows terminal commands for retrieving the code above the code boxes
- `CodeInput` supports paste, arrow-key navigation, and per-cell focus/error states
- Registered `/auth` route in `App.tsx`; all "Sign In" buttons across `TopNav`, `Landing`, `Portfolio`, `Transactions` now navigate to `/auth` instead of calling `login()` directly
- After successful verify step, `login()` from SDK is called then user lands on `/marketplace`


## 2026-04-03 — SDK + Auth Migration
- Added `@animaapp/playground-react-sdk` 0.10.0; wrapped app in `AnimaProvider` in `src/index.tsx`
- `AppContext`: stripped portfolio/transactions (now from SDK); kept wallet+UI state only
- `TopNav`: added `useAuth` Sign In/Sign Up button; profile dropdown shows email + logout; hooks-order fix preserved
- `BottomTabBar`: hooks-order fix (return null after all hooks)
- `Portfolio` + `Transactions`: gated behind `useAuth` — show sign-in prompt for anonymous users; data from `useQuery('PortfolioItem')` / `useQuery('Transaction')`
- `PropertyDetail`: invest button requires auth (login()) then wallet; transaction written via `useMutation('Transaction')`
- `Marketplace`: properties from `useQuery('Property')` with mockData fallback
- `Landing`: Sign In / Sign Up CTA for anonymous users via `useAuth`
- `mockData.ts`: removed `mockPortfolio` / `mockTransactions` exports (data now in SDK)


## 2026-04-03
- Fixed "Rendered fewer hooks than expected" crash in `TopNav` and `BottomTabBar`
- Root cause: early `return null` after `useMatch` but before `useState`/`useApp` hooks
- Fix: moved `if (isLanding) return null` to after all hook declarations in both files
- Files: `src/components/layout/TopNav.tsx`, `src/components/layout/BottomTabBar.tsx`

</changelog>
