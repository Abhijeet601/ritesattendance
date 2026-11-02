const configuredBackendUrl = import.meta.env.VITE_BACKEND_URL?.trim();
const developmentBackendUrl = 'http://localhost:8001';

// The deployed backend address must come from Vite's build-time environment.
// Falling back to localhost is useful only while running the Vite development
// server; it must never make a production Netlify site call itself.
export const backendBaseUrl = (
  configuredBackendUrl || (import.meta.env.DEV ? developmentBackendUrl : '')
).replace(/\/+$/, '');

export const backendConfigurationError = backendBaseUrl
  ? null
  : 'The backend URL is not configured. Set VITE_BACKEND_URL and redeploy.';
