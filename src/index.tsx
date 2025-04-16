import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Environment variables for Auth0
const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const redirectUri = window.location.origin; // Use current origin for redirect

// Add error handling for script loading issues
const handleErrorEvent = (event: Event | ErrorEvent) => {
  const errorEvent = event as ErrorEvent;
  if (
    errorEvent.message &&
    (errorEvent.message.includes('Unexpected token') || 
     errorEvent.message.includes('Failed to load'))
  ) {
    console.warn('Detected script loading error, attempting to recover...');
    // Force a hard reload to clear cache
    window.location.href = '/';
    return true;
  }
  return false;
};

window.addEventListener('error', handleErrorEvent);

const root = ReactDOM.createRoot(document.getElementById('root')!);

// Basic check if domain and clientId are set
if (!domain || !clientId) {
  console.error(
    'Auth0 domain or clientId is missing. Please set REACT_APP_AUTH0_DOMAIN and REACT_APP_AUTH0_CLIENT_ID in your .env file.'
  );
  root.render(
    <React.StrictMode>
      <div>Auth0 configuration is missing. Check console.</div>
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: redirectUri,
        }}
      >
        <Provider store={store}>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <App />
          </BrowserRouter>
        </Provider>
      </Auth0Provider>
    </React.StrictMode>
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals(); 