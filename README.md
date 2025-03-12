# Fetch Dog Finder

A web application that helps users search through a database of shelter dogs to find potential adoptions. Users can browse available dogs, filter by different criteria, select favorites, and generate a match for adoption.

## Features

- User authentication with name and email
- Dog search with multiple filters (breed, age, location)
- Paginated and sortable results
- Favorites selection
- Match generation for adoption

## Technology Stack

- **Frontend**: React.js, Material-UI, Redux Toolkit, React Router, Axios, Formik & Yup
- **Testing**: Jest, Cypress, React Testing Library
- **Development & Deployment**: GitHub, Vercel, ESLint/Prettier

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/thetubbydoughnut/FetchRewardsDogFinder.git
   cd FetchRewardsDogFinder
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

The project follows a feature-based organization pattern:

```
src/
├── components/           # Shared components
│   ├── ui/               # Pure UI components (buttons, inputs, etc.)
│   └── layout/           # Layout components (Header, Footer, etc.)
├── features/             # Feature modules
│   ├── auth/             # Authentication feature
│   │   ├── components/   # Auth-specific components (LoginForm, ProtectedRoute)
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
│   └── dogService.js     # Dog-related API calls
├── store/                # Redux store setup
│   ├── index.js          # Store configuration
│   └── hooks.js          # Redux hooks
├── utils/                # Utility functions
├── pages/                # Page components
│   ├── LoginPage.jsx     # Login page
│   ├── SearchPage.jsx    # Dog search page
│   └── FavoritesPage.jsx # Favorites page
├── App.tsx               # Main app component with routing
├── index.tsx             # Entry point
└── theme.js              # Material-UI theme configuration
```

## Development Guide

### API Integration

The application interacts with the Fetch API for dog data. Key endpoints include:
- `/auth/login` - Authenticate users
- `/dogs/search` - Search for dogs with filters
- `/dogs/breeds` - Get all available breeds
- `/dogs/match` - Generate a match based on favorite dogs

### State Management

Redux Toolkit is used for state management with the following slices:
- **Auth** - User authentication state
  - Manages login, logout, and user information
  - Persists user state in localStorage
- **Dogs** - Dog search state
  - Handles search parameters, filtering, and results
  - Manages pagination and sorting
- **Favorites** - User's favorite dogs state
  - Tracks favorite dog IDs
  - Handles match generation
  - Persists favorites in localStorage

### Routing

React Router handles application routing with these main routes:
- `/` - Login page
- `/search` - Dog search page
- `/favorites` - User's favorite dogs
- `/match` - Match result page

## License

This project is licensed under the MIT License - see the LICENSE file for details. 