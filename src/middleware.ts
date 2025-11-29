import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";


// Configuration for publicly accessible paths
const publicPaths = [
  "/",
  "/login",
  "/signout",
  "/auth/error",
  "/api/auth",
  "/api/client-ip",
];

// Helper function to extract client IP from request
function getClientIP(request: NextRequest): string | null {
  // Try different headers that might contain the client IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to other headers
  const vercelForwardedFor = request.headers.get('x-vercel-forwarded-for');
  if (vercelForwardedFor) {
    return vercelForwardedFor;
  }
  
  return null;
}

// Middleware function that runs on every request
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

 

 
  // Extract client IP and add it to request headers for use in server components
  const clientIP = getClientIP(request);
  const requestHeaders = new Headers(request.headers);
  if (clientIP) {
    requestHeaders.set('x-client-ip', clientIP);
  }

  // Handle authentication
  const authResponse = await handleAuthentication(request, pathname, requestHeaders);

  return authResponse;
}

// Helper function to handle authentication
async function handleAuthentication(
  request: NextRequest,
  pathname: string,
  requestHeaders: Headers
): Promise<NextResponse> {
  // Check if the path is a public path (no authentication required)
  const isPublicPath = publicPaths.some(
    (publicPath) =>
      pathname === publicPath ||
      pathname.startsWith(`${publicPath}/`) ||
      pathname.startsWith("/api/auth/")
  );

  if (isPublicPath) {
    // Add client IP to response headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    return response;
  }

  // For all other paths, check if the user is authenticated
  const token = await getToken({
    req: request,
    secret:
      process.env.NEXTAUTH_SECRET || "your-secret-here", // Should match the secret in route.ts
  });

  // If no token is found, redirect to signin page
  if (!token) {
    const signInUrl = new URL("/login", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Add client IP to response headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  return response;
}

// Configure which paths the middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};