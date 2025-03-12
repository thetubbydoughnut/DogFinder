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
   git clone https://github.com/yourusername/fetch-dog-finder.git
   cd fetch-dog-finder
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

```
fetch-dog-finder/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── dogs/
│   │   ├── layout/
│   │   └── ui/
│   ├── pages/
│   ├── services/
│   ├── store/
│   │   ├── slices/
│   ├── utils/
│   ├── App.tsx
│   ├── index.tsx
│   └── theme.js
├── tests/
└── ...
```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 