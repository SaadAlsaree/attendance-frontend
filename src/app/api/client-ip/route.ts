import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Try different headers that might contain the client IP
        const forwardedFor = request.headers.get('x-forwarded-for');
        const realIP = request.headers.get('x-real-ip');
        const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
        
        let clientIP: string | null = null;
        
        if (forwardedFor) {
            // x-forwarded-for can contain multiple IPs, take the first one
            clientIP = forwardedFor.split(',')[0].trim();
        } else if (realIP) {
            clientIP = realIP;
        } else if (cfConnectingIP) {
            clientIP = cfConnectingIP;
        } else {
            // Fallback to other headers
            const vercelForwardedFor = request.headers.get('x-vercel-forwarded-for');
            clientIP = vercelForwardedFor || 'unknown';
        }

        return NextResponse.json({ ip: clientIP }, { status: 200 });
    } catch (error) {
        console.error('Error getting client IP:', error);
        return NextResponse.json(
            { ip: null, error: 'Failed to get client IP' },
            { status: 500 }
        );
    }
}

