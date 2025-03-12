# Fetch Rewards Dog Finder 🐕

A web application that helps users search through a database of shelter dogs to find their perfect match for adoption. Users can browse available dogs, filter by various criteria, select favorites, and generate a match for adoption.

## Features

- 🔐 User authentication with name and email
- 🔍 Advanced dog search with multiple filters (breed, age, location)
- 📄 Paginated and sortable results
- ❤️ Favorites selection and management
- 🤝 Match generation for adoption

## Tech Stack

### Frontend
- **React.js** - Core UI library
- **Material-UI** - Component library for consistent and professional UI
- **Redux Toolkit** - State management with simplified Redux setup
- **React Router** - For application routing
- **Axios** - For API communication
- **Formik & Yup** - Form handling and validation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/thetubbydoughnut/FetchRewardsDogFinder
cd fetch-rewards-dog-finder
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
│   └── layout/           # Layout components (Header, Footer, etc.)
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