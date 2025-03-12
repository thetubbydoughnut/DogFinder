# Deployment Guide for Fetch Rewards Dog Finder

This guide outlines the steps to deploy your Fetch Rewards Dog Finder application to Vercel.

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

## Important Notes

- The application is configured to use the Fetch API base URL of `https://frontend-take-home-service.fetch.com`
- The error boundary component will catch runtime errors in production and provide a friendly UI
- All routes will be redirected to the main application due to the configuration in `vercel.json`

## Helpful Resources

- [Vercel Documentation for React Apps](https://vercel.com/docs/frameworks/create-react-app)
- [Custom Domain Setup](https://vercel.com/docs/concepts/projects/domains/add-a-domain)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables) 