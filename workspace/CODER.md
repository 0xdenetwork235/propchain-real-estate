<instructions>
This file will be automatically added to your context. 
It serves multiple purposes:
  1. Storing frequently used tools so you can use them without searching each time
  2. Recording the user's code style preferences (naming conventions, preferred libraries, etc.)
  3. Maintaining useful information about the codebase structure and organization
  4. Remembering tricky quirks from this codebase

When you spend time searching for certain configuration files, tricky code coupled dependencies, or other codebase information, add that to this CODER.md file so you can remember it for next time.
Keep entries sorted in DESC order (newest first) so recent knowledge stays in prompt context if the file is truncated.
</instructions>

<coder>

## Auth Pattern (CUSTOM — no SDK auth)
- Auth lives entirely in `AppContext`: `authUser`, `isAnonymous`, `authLoading`, `loginWithCode(email, code)`, `logoutUser()`
- Persisted to `localStorage` key `propchain_auth_user`
- `loginWithCode` accepts code `123456` (demo); throws on mismatch with human-readable message
- `isAnonymous = !authUser` — use `const { isAnonymous, authUser, logoutUser } = useApp()`
- DO NOT import `useAuth` from SDK anywhere — use `useApp()` only
- `AnimaProvider` still wraps app in `index.tsx` BUT ONLY for SDK data hooks (`useQuery`, `useMutation`)
- Gated pages: Portfolio + Transactions + PropertyDetail invest → redirect to `/auth` if `isAnonymous`

## SDK Data Pattern
- Data: `useQuery('PortfolioItem')`, `useQuery('Transaction')`, `useQuery('Property')` — all from SDK
- Mutations: `useMutation('Transaction').create(draft)` used in PropertyDetail invest flow
- mockData.ts: only exports `mockProperties` and `learnArticles` (static fallback); no portfolio/tx exports

## Hooks Rule Gotcha
- React: never do early `return` before all hooks are called in a component
- `TopNav` and `BottomTabBar` hide on `/` route — use `useMatch("/")` + `if (isLanding) return null` AFTER all hooks

## Project Stack
- React + TypeScript + Vite + Tailwind CSS
- Routing: `react-router-dom` BrowserRouter
- Animations: `framer-motion`
- Icons: `@phosphor-icons/react`
- State: `AppContext` via `useApp()` hook
- Mock data: `src/data/mockData.ts`

## Key Layout Files
- `src/App.tsx` — AppShell with TopNav, BottomTabBar, Routes
- `src/components/layout/TopNav.tsx` — hides on `/`
- `src/components/layout/BottomTabBar.tsx` — hides on `/`, mobile only
- `src/views/Landing.tsx` — full-screen landing page

</coder>
