# Dog Finder 🐕

A web application that helps users search through a database of shelter dogs to find their perfect match for adoption. Users can browse available dogs, filter by various criteria, select favorites, and generate a match for adoption.

**Note:** This version uses static mock data located in `public/mock-data/` derived from the Dog CEO API. Image URLs are dynamically generated placeholders using `placedog.net`. Authentication is handled via **Auth0**.

## Features

- 🔐 **Auth0** user authentication (replaces mock implementation)
- ✨ Automatic logout after 10 minutes of inactivity
- 🔍 Advanced dog search with multiple filters (breed, age, location) on mock data
- 📄 Paginated and sortable results
- ❤️ Favorites selection and management
- 🤝 Match generation for adoption
- 📱 Progressive Web App (PWA) support for offline capabilities
- 🛡️ Error boundaries for graceful error handling
- 🚀 Code splitting and lazy loading for improved performance
- 📊 TypeScript for core application files with enhanced type safety

## Tech Stack

### Frontend
- **React.js** - Core UI library
- **TypeScript** - For type safety in core application files
- **Material-UI** - Component library for consistent and professional UI
- **Redux Toolkit** - State management with simplified Redux setup
- **React Router** - For application routing
- **Formik & Yup** - Form handling and validation

### Performance Optimizations
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

2. Create a `.env` file in the project root and add your Auth0 credentials:
```dotenv
REACT_APP_AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN
REACT_APP_AUTH0_CLIENT_ID=YOUR_AUTH0_CLIENT_ID
```
*(Replace placeholders with your actual Auth0 Application Domain and Client ID)*

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

5. Open your browser and navigate to `http://localhost:3000`

## Testing

To run the available tests:

```bash
npm test
# or
yarn test
```

## Project Structure

```
src/
├── components/           # Shared components
│   ├── ui/               # Pure UI components (buttons, inputs, etc.)
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
│   └── dogService.js     # Dog-related mock data service
├── hooks/                # Custom React hooks
│   └── useInactivityLogout.js # Hook for auto-logout
├── store/                # Redux store setup
│   ├── index.js          # Store configuration
│   └── hooks.js          # Redux hooks
├── utils/                # Utility functions
├── pages/                # Page components
│   ├── LoginPage.jsx     # Login page
│   ├── SearchPage.jsx    # Dog search page
│   └── FavoritesPage.jsx # Favorites page
├── context/              # React Context providers
├── App.tsx               # Main app component with routing (TypeScript)
├── index.tsx             # Entry point (TypeScript)
├── serviceWorkerRegistration.ts # Service worker registration (TypeScript)
└── theme.js              # Material-UI theme configuration
```

## Key Functionality

### Authentication

Users must log in with their name and email to access the application. The application now automatically logs users out after 10 minutes of inactivity.

### Dog Search

- Filter dogs by breed, age range, and ZIP code
- Sort results by breed, name, or age in ascending or descending order
- Paginate through results
- View all details for each dog

### Favorites

- Add/remove dogs to/from favorites
- View all favorited dogs in one place
- Generate a match from your favorite dogs

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

**This application currently uses static JSON data (`dogs.json`, `breeds.json`) located in `public/mock-data/` for all dog and breed information.** This data was originally sourced from the Dog CEO API. The application fetches these static files using `src/services/dogService.js`.

**Authentication is now handled using the Auth0 React SDK (`@auth0/auth0-react`).** Ensure you have configured your Auth0 application settings (Callback URL: `http://localhost:3000`, Logout URL: `http://localhost:3000`, Allowed Web Origin: `http://localhost:3000` for local development) and provided the Domain and Client ID in the `.env` file.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- All the shelter dogs looking for forever homes! 