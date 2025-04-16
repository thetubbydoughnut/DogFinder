## Changelog

### 4-16-2025

- **FEAT**: Integrated Auth0 for user authentication, replacing the previous mock implementation. Requires `.env` file with Auth0 Domain and Client ID.
- **FIX**: Refined `dogService.getDogsByIds` to explicitly preserve sort order from `searchDogs` results, ensuring consistent display after client-side sorting.
- **CHORE**: Removed residual commented-out code related to the previous API/caching implementation in `dogService.js` and `dogs/slice.js`.
- **FEAT**: Implemented automatic logout after 10 minutes of user inactivity (`useInactivityLogout` hook).
- **FIX**: Corrected redirect logic to return users to their intended page after login, resolving issue where users were always sent to `/search` after navigating from a protected route to login.
- **FIX**: Standardized status handling in `dogs` Redux slice using status strings (`idle`, `loading`, `succeeded`, `failed`) and removed potential inconsistencies.
- **FIX**: Removed unused `CacheManager` component and its usage in `Footer` to resolve build error after `cacheService` deletion.
- **FIX**: Prevent potential `401 Unauthorized` errors in `FavoritesPage` and `DogDetailsPage` by ensuring data fetching only occurs after successful authentication (`isAuthenticated` is true). Modified relevant `useEffect` hooks. **(Relevant logic remains, but API call is now mocked)**
- **FIX**: Resolved `401 Unauthorized` errors on API calls by ensuring data fetching in `SearchPage` only occurs after successful authentication (`isAuthenticated` is true). Modified `useEffect` hook in `src/pages/SearchPage.jsx` to depend on and check `isAuthenticated` state. **(Relevant logic remains, but API call is now mocked)**
- **REFACTOR**: Removed unnecessary `cacheService` and associated fallback logic from `dogs` slice thunks, simplifying data fetching now that static JSON is used.
- **REFACTOR**: Extracted filter state logic from `SearchPage` into `useDogFilters` custom hook.
- **REFACTOR**: Extracted grid calculation and skeleton rendering logic from `SearchPage` into `src/utils/gridUtils.js`.
- **REFACTOR**: Replaced mock data generation with static JSON files (`public/mock-data/dogs.json`, `public/mock-data/breeds.json`). Data originally sourced from Dog CEO API via a one-time script (`scripts/generate-dog-data.js`). App now fetches local static JSON for core data. Removed `@faker-js/faker` dependency.
- **REFACTOR**: Replaced live API calls with mock data generation using `@faker-js/faker`. Removed API layer (`src/api`, `src/services/api.js`) and cache service usage. App now runs entirely on generated data. **(Superseded by static JSON refactor)**
- **CHORE**: Added console logging to `ProtectedRoute`, `LoginPage`, and `DogDetailsPage` to aid in debugging navigation/authentication flow.
- **CHORE**: Added `console.error` logging for failed login/logout attempts in `src/features/auth/slice.js`.
- **CHORE**: Removed empty `src/api` directory.
- **CHORE**: Removed `CHANGELOG.md` from `.gitignore` to allow tracking.
- **CHORE**: Disabled `no-restricted-globals` ESLint rule in `public/service-worker.js`.
- **DOCS**: Created initial `CHANGELOG.md`.
- **FIX**: Ensure long email addresses don't overflow in the header user menu by applying text truncation.
- **CHORE**: Removed remaining references to the old Fetch API URL/domain from `.env`, `public/index.html`, `public/service-worker.js`, `deployment-guide.md`, and footer link.
- **FIX**: Prevent horizontal scrollbar on Search page by applying overflow-x hidden.
- **DOCS**: Added live deployment URL to README. 