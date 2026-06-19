import axios from 'axios';
import { getServerSession } from 'next-auth';
import authOption from '@/lib/auth-option';

// Helper function to get client IP from headers (server-side only, when available)
async function getClientIPFromHeaders(): Promise<string | null> {
    try {
        if (typeof window === 'undefined') {
            // Try to use headers() from next/headers - but this only works in Server Components
            // We'll catch the error if it doesn't work
            try {
                const { headers } = await import('next/headers');
                const headersList = await headers();
                
                // First, try to get IP from middleware (x-client-ip)
                const clientIP = headersList.get('x-client-ip');
                if (clientIP) {
                    return clientIP;
                }
                
                // Fallback to other headers
                const forwardedFor = headersList.get('x-forwarded-for');
                const realIP = headersList.get('x-real-ip');
                const cfConnectingIP = headersList.get('cf-connecting-ip');
                
                if (forwardedFor) {
                    return forwardedFor.split(',')[0].trim();
                }
                if (realIP) {
                    return realIP;
                }
                if (cfConnectingIP) {
                    return cfConnectingIP;
                }
            } catch (error) {
                // headers() is not available in this context, fall through to API route
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}

// Helper function to get client IP from API route (works for both server and client)
async function getClientIPFromAPI(forwardHeaders?: Record<string, string>): Promise<string | null> {
    try {
        // For client-side, check localStorage first to avoid unnecessary API calls
        if (typeof window !== 'undefined') {
            const cachedIP = localStorage.getItem('client-ip');
            if (cachedIP) {
                return cachedIP;
            }
        }

        // Fetch IP from API route (works in both server and client contexts)
        const baseUrl = typeof window !== 'undefined' 
            ? window.location.origin 
            : process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL 
                ? `https://${process.env.VERCEL_URL}` 
                : 'http://localhost:3000');
        
        const fetchOptions: RequestInit = {
            credentials: 'include',
        };

        // For server-side, forward the original headers to get the real client IP
        if (typeof window === 'undefined' && forwardHeaders) {
            fetchOptions.headers = forwardHeaders;
        }
        
        const response = await fetch(`${baseUrl}/api/client-ip`, fetchOptions);
        
        // Check if response is OK and is JSON
        if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                if (data.ip && data.ip !== 'unknown' && data.ip !== '::1') {
                    // Cache the IP in localStorage for client-side
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('client-ip', data.ip);
                    }
                    return data.ip;
                }
            }
        }
        return null;
    } catch (error) {
        // Silently fail - IP is not critical for request to succeed
        return null;
    }
}

// Create a base axios instance without auth headers
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Add a request interceptor to dynamically attach the token and client IP
axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            // Get the session on each request to ensure fresh token
            const session = await getServerSession(authOption);
            const token = session?.accessToken;

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            // Try to get IP from headers first (server-side only, when available)
            let clientIP = await getClientIPFromHeaders();
            
            // If not available from headers, try API route
            if (!clientIP) {
                // Try to forward headers if available in config
                const forwardHeaders: Record<string, string> = {};
                if (config.headers) {
                    // Forward relevant IP headers if they exist
                    const forwardedFor = config.headers['x-forwarded-for'] as string;
                    const realIP = config.headers['x-real-ip'] as string;
                    const cfConnectingIP = config.headers['cf-connecting-ip'] as string;
                    
                    if (forwardedFor) forwardHeaders['x-forwarded-for'] = forwardedFor;
                    if (realIP) forwardHeaders['x-real-ip'] = realIP;
                    if (cfConnectingIP) forwardHeaders['cf-connecting-ip'] = cfConnectingIP;
                }
                
                clientIP = await getClientIPFromAPI(Object.keys(forwardHeaders).length > 0 ? forwardHeaders : undefined);
            }

            if (clientIP && clientIP !== 'unknown' && clientIP !== '::1') {
                config.headers['X-Client-IP'] = clientIP;
            }

            return config;
        } catch (error) {
            console.error('Error fetching session:', error);
            return config;
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => {
        // Return successful responses as-is
        return response;
    },
    (error) => {
        // Log error details for debugging
        console.warn('API Request failed:', {
            message: error?.message || 'Unknown error',
            status: error?.response?.status || 'No status',
            url: error?.config?.url || 'Unknown URL',
            method: error?.config?.method?.toUpperCase() || 'Unknown method'
        });

        // For server-side requests, return safe fallback responses instead of throwing
        if (typeof window === 'undefined') {
            // Determine if this looks like a list endpoint or single item endpoint
            const url = error?.config?.url || '';
            const isListEndpoint = url.includes('List') || url.includes('GetAll') || error?.config?.method?.toLowerCase() === 'get';

            if (isListEndpoint && !url.includes('ById/')) {
                // Return empty list response for list endpoints
                return Promise.resolve({
                    data: [],
                    status: 200,
                    statusText: 'OK (Fallback)',
                    headers: {},
                    config: error.config
                });
            } else {
                // Return empty single response for single item endpoints
                return Promise.resolve({
                    data: null,
                    status: 200,
                    statusText: 'OK (Fallback)',
                    headers: {},
                    config: error.config
                });
            }
        }

        // For client-side requests, still throw the error so components can handle it
        return Promise.reject(error);
    }
);

// create axios instance for client side
const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Function to set auth token - to be called from components
export const setAuthToken = (token: string | null) => {
    if (token) {
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosClient.defaults.headers.common['Authorization'];
    }
};

// Error handling interceptor for client
axiosClient.interceptors.request.use(
    async (config) => {
        // Ensure client-side requests carry the auth token. This mirrors the
        // server interceptor (getServerSession) by pulling the NextAuth session
        // token per-request, so calls no longer depend on a component having
        // called setAuthToken() first — that manual approach is racy because
        // concurrent requests share axiosClient.defaults and clear each other's
        // header in their `finally`, which is why the filter dropdowns 401'd.
        try {
            if (typeof window !== 'undefined' && !config.headers.Authorization) {
                const { getSession } = await import('next-auth/react');
                const session = (await getSession()) as { accessToken?: string } | null;
                if (session?.accessToken) {
                    config.headers.Authorization = `Bearer ${session.accessToken}`;
                }
            }
        } catch {
            // If the session can't be read, continue unauthenticated (server returns 401).
        }

        // Add client IP header for client-side requests
        try {
            const clientIP = await getClientIPFromAPI();
            if (clientIP && clientIP !== 'unknown' && clientIP !== '::1') {
                config.headers['X-Client-IP'] = clientIP;
            }
        } catch (error) {
            // If getting IP fails, continue without it
            console.warn('Failed to get client IP:', error);
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for client-side error handling
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Log error details for debugging
        console.warn('Client API Request failed:', {
            message: error?.message || 'Unknown error',
            status: error?.response?.status || 'No status',
            url: error?.config?.url || 'Unknown URL',
            method: error?.config?.method?.toUpperCase() || 'Unknown method'
        });

        // For client-side, we usually want to let components handle errors
        // But we can add specific handling for certain error types
        if (error?.response?.status === 401) {
            console.warn('Authentication required - redirecting to login may be needed');
        } else if (error?.response?.status >= 500) {
            console.warn('Server error detected - service may be unavailable');
        }

        return Promise.reject(error);
    }
);

export { axiosInstance, axiosClient };
