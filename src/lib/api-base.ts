/**
 * Resolves the base URL of the backend API for the current runtime.
 *
 * Browser: a same-origin path (`/backend-api`) that nginx proxies to the API.
 * The page is served over HTTPS, so an absolute `http://…:7000` URL is blocked
 * by the browser as mixed content (and would also need a CORS preflight for
 * POST/PUT/PATCH/DELETE). A same-origin path avoids both.
 *
 * Server (the Next.js node process): the API host directly over HTTP. These
 * requests never pass through nginx, so the URL must stay absolute.
 */
export function getApiBaseUrl(): string {
  const raw =
    typeof window === 'undefined'
      ? process.env.INTERNAL_API_URL ||
        process.env.API_URL ||
        'http://fp28-back.inss.local:7000'
      : process.env.NEXT_PUBLIC_API_URL || '/backend-api';

  return raw.replace(/\/+$/, '');
}
