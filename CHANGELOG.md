## Changelog

### 4-16-2025

- **FEAT**: Integrated Auth0 for user authentication, replacing mock implementation and requiring `.env` configuration.
- **FEAT**: Implemented automatic logout after 10 minutes of inactivity.
- **FIX**: Corrected various UI issues including email truncation in user menu and horizontal scrollbar on Search page.
- **FIX**: Addressed multiple ESLint warnings (unused vars, router flags, cSpell words).
- **CHORE**: Removed numerous debugging `console.log` statements and all references to the previous Fetch Rewards API URL.
- **DOCS**: Added live deployment URL to README.
- **FIX**: Refined `dogService.getDogsByIds` to explicitly preserve sort order from `searchDogs` results, ensuring consistent display after client-side sorting.
- **CHORE**: Removed residual commented-out code related to the previous API/caching implementation in `dogService.js` and `dogs/slice.js`.
- **FIX**: Corrected redirect logic to return users to their intended page after login, resolving issue where users were always sent to `/search` after navigating from a protected route to login.
- **FIX**: Standardized status handling in `dogs` Redux slice using status strings (`idle`, `loading`, `succeeded`, `failed`) and removed potential inconsistencies.
- **FIX**: Removed unused `CacheManager` component and its usage in `Footer` to resolve build error after `cacheService` deletion.
- **FIX**: Prevent potential `401 Unauthorized` errors in `FavoritesPage` and `DogDetailsPage` by ensuring data fetching only occurs after successful authentication (`isAuthenticated` is true). Modified relevant `useEffect` hooks. 
- **FIX**: Resolved `401 Unauthorized` errors on API calls by ensuring data fetching in `SearchPage` only occurs after successful authentication (`isAuthenticated` is true). Modified `useEffect` hook in `src/pages/SearchPage.jsx` to depend on and check `isAuthenticated` state. 
- **REFACTOR**: Removed unnecessary `cacheService` and associated fallback logic from `dogs` slice thunks, simplifying data fetching now that static JSON is used.
- **REFACTOR**: Extracted filter state logic from `SearchPage` into `useDogFilters` custom hook.
- **REFACTOR**: Extracted grid calculation and skeleton rendering logic from `SearchPage` into `src/utils/gridUtils.js`.
- **REFACTOR**: Replaced mock data generation with static JSON files (`public/mock-data/dogs.json`, `public/mock-data/breeds.json`). Data originally sourced from Dog CEO API via a one-time script (`scripts/generate-dog-data.js`). App now fetches local static JSON for core data. Removed `@faker-js/faker` dependency.
- **CHORE**: Added `console.error` logging for failed login/logout attempts in `src/features/auth/slice.js`.
- **CHORE**: Removed empty `src/api` directory.
- **CHORE**: Removed `CHANGELOG.md` from `.gitignore` to allow tracking.
- **CHORE**: Disabled `no-restricted-globals` ESLint rule in `public/service-worker.js`.
- **DOCS**: Created initial `CHANGELOG.md`.

### 04-17-2025

- Renamed application title to "Find-a-Friend Dog Finder" in user-facing components (`LoginPage`, `LoadingScreen`).
- Updated corresponding test (`LoginForm.test.js`) to reflect the name change.
- Verified login page centering mechanism using Material UI Grid and Box components. 