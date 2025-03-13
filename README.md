# Fetch Rewards Dog Finder 🐕

A web application that helps users search through a database of shelter dogs to find their perfect match for adoption. Users can browse available dogs, filter by various criteria, select favorites, and generate a match for adoption.

## Features

- 🔐 User authentication with name and email
- 🔍 Advanced dog search with multiple filters (breed, age, location)
- 📄 Paginated and sortable results
- ❤️ Favorites selection and management
- 🤝 Match generation for adoption
- 📱 Progressive Web App (PWA) support for offline capabilities
- 🛡️ Error boundaries for graceful error handling
- 💾 Advanced caching system for API responses
- 🚀 Code splitting and lazy loading for improved performance
- 📊 TypeScript for core application files with enhanced type safety

## Tech Stack

### Frontend
- **React.js** - Core UI library
- **TypeScript** - For type safety in core application files
- **Material-UI** - Component library for consistent and professional UI
- **Redux Toolkit** - State management with simplified Redux setup
- **React Router** - For application routing
- **Axios** - For API communication
- **Formik & Yup** - Form handling and validation

### Performance Optimizations
- **Custom Cache System** - Dual-layer caching (memory + localStorage) for API responses
- **React.lazy & Suspense** - Code splitting for better load times
- **Service Worker** - Offline capabilities and caching
- **Virtualized Lists** - Efficient rendering of large lists
- **useTransition** - Improved UI responsiveness during state updates
- **Memoization** - Optimized component rendering

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/thetubbydoughnut/FetchRewardsDogFinder
cd FetchRewardsDogFinder
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/           # Shared components
│   ├── ui/               # Pure UI components (buttons, inputs, etc.)
│   │   └── CacheManager.jsx # Cache management UI component
│   ├── layout/           # Layout components (Header, Footer, etc.)
│   └── ErrorBoundary.tsx # Error handling component (TypeScript)
├── features/             # Feature modules
│   ├── auth/             # Authentication feature
│   │   ├── components/   # Auth-specific components
│   │   └── slice.js      # Auth redux slice
│   ├── dogs/             # Dog search feature
│   │   ├── components/   # Dog-specific components (DogCard, DogFilter)
│   │   └── slice.js      # Dogs redux slice
│   └── favorites/        # Favorites feature
│       ├── components/   # Favorites-specific components
│       └── slice.js      # Favorites redux slice
├── services/             # API services
│   ├── api.js            # Base API configuration
│   ├── authService.js    # Authentication-related API calls
│   ├── dogService.js     # Dog-related API calls with caching
│   └── cacheService.js   # Custom caching service
├── store/                # Redux store setup
│   ├── index.js          # Store configuration
│   └── hooks.js          # Redux hooks
├── utils/                # Utility functions
├── pages/                # Page components
│   ├── LoginPage.jsx     # Login page
│   ├── SearchPage.jsx    # Dog search page
│   └── FavoritesPage.jsx # Favorites page
├── App.tsx               # Main app component with routing (TypeScript)
├── index.tsx             # Entry point (TypeScript)
├── serviceWorkerRegistration.ts # Service worker registration (TypeScript)
└── theme.js              # Material-UI theme configuration
```

## Key Functionality

### Authentication

Users must log in with their name and email to access the application. This creates a session with the API service.

### Dog Search

- Filter dogs by breed, age range, and ZIP code
- Sort results by breed, name, or age in ascending or descending order
- Paginate through results
- View all details for each dog

### Favorites

- Add/remove dogs to/from favorites
- View all favorited dogs in one place
- Generate a match from your favorite dogs

### Advanced Caching System

The application features a robust caching solution that:

- Stores API responses in localStorage for persistence between sessions
- Implements in-memory caching for faster access during the current session
- Automatically falls back to cached data when the API is unavailable
- Provides a cache management UI for monitoring and clearing cache
- Shows notifications when cached data is being used
- Configurable cache expiration times for different data types
- Cache size management to prevent exceeding storage limits

This caching system significantly improves the application's resilience to network issues and enhances performance by reducing unnecessary API calls.

### Progressive Web App Features

- Offline capabilities with service worker caching
- Installable on mobile devices
- Fast loading with optimized assets

## Deployment

The application is configured for seamless deployment to Vercel. The deployment configuration includes:

- **vercel.json** - Contains routing configuration for React Router and build settings
- **Error Boundary** - Runtime error handling for production environment
- **Environment Variables** - Environment-specific settings in `.env` files
- **Service Worker** - Offline capabilities and improved performance

### Deploying to Vercel

For detailed deployment instructions, refer to the [deployment-guide.md](./deployment-guide.md) file.

Quick steps:
1. Push your code to a Git repository
2. Import the repository to Vercel
3. Configure the project settings (framework preset: Create React App)
4. Deploy!

### Production Build

To create a production build locally:

```bash
npm run build
# or
yarn build
```

The build artifacts will be in the `build` directory.

## API Integration

The application integrates with the Fetch API service at `https://frontend-take-home-service.fetch.com`, which provides:

- Authentication endpoints
- Dog search and filtering
- Dog details retrieval
- Match generation

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Fetch Rewards for the project requirements and API
- All the shelter dogs looking for forever homes! 