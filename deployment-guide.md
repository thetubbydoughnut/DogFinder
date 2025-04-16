# Deployment Guide for Dog Finder

This guide outlines the steps to deploy your Dog Finder application to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account (you can sign up for free using GitHub, GitLab, or BitBucket)
2. Git repository with your code (GitHub, GitLab, or BitBucket)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended for beginners)

1. Push your code to a Git repository if you haven't already:
   ```
   git add .
   git commit -m "Prepare for deployment"
   git push
   ```

2. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)

3. Click on "New Project"

4. Import your Git repository

5. Configure your project:
   - Framework Preset: Create React App
   - Build and Output Settings: (Leave as default, they are configured in vercel.json)
   - Environment Variables: Add any necessary environment variables (if needed)

6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Log in to Vercel from the CLI:
   ```
   vercel login
   ```

3. Navigate to your project directory and deploy:
   ```
   cd /path/to/your/project
   vercel
   ```

4. Follow the CLI prompts to complete the deployment

## Post-Deployment

- Your app will be assigned a `.vercel.app` domain automatically
- You can configure custom domains in the Vercel dashboard if needed
- Each push to your repository will trigger a new deployment

## Configuration

The deployment utilizes Vercel's automatic configuration for Create React App projects. Key configurations include:

- **Build Command:** `npm run build` or `yarn build`
- **Output Directory:** `build`
- **Install Command:** `npm install` or `yarn install`
- **Environment Variables:** Auth0 credentials (`REACT_APP_AUTH0_DOMAIN`, `REACT_APP_AUTH0_CLIENT_ID`) should be configured in Vercel project settings for production builds.

## Routing

The `vercel.json` file ensures that all routes are correctly handled by the React Router setup:

## Important Notes

- The error boundary component will catch runtime errors in production and provide a friendly UI
- All routes will be redirected to the main application due to the configuration in `vercel.json`

## Helpful Resources

- [Vercel Documentation for React Apps](https://vercel.com/docs/frameworks/create-react-app)
- [Custom Domain Setup](https://vercel.com/docs/concepts/projects/domains/add-a-domain)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables) 