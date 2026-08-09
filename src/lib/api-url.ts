const DEFAULT_CLIENT_API_URL = '/backend-api';

function removeTrailingSlashes(url: string): string {
  return url.replace(/\/+$/, '');
}

export function getServerApiUrl(): string {
  // This helper can end up in a shared client bundle. Never expose or require
  // the private server URL when it is evaluated in the browser.
  if (typeof window !== 'undefined') {
    return getClientApiUrl();
  }

  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    throw new Error('API_URL is required for server-side API requests');
  }

  return removeTrailingSlashes(apiUrl);
}

export function getClientApiUrl(): string {
  return removeTrailingSlashes(
    process.env.NEXT_PUBLIC_API_URL || DEFAULT_CLIENT_API_URL
  );
}

export function getApiBaseUrl(): string {
  return typeof window === 'undefined' ? getServerApiUrl() : getClientApiUrl();
}
