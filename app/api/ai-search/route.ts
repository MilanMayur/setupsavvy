import { NextRequest, NextResponse } from "next/server";
import runSearch from "@/lib/search";

// Simple in-memory rate limiting (for production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 100; // requests per window
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

function getRateLimitKey(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip');
  return ip || 'anonymous';
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(key);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(req);
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." }, 
        { status: 429 }
      );
    }

    // Input validation
    const body = await req.json();
    const query = body?.query;
    
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query required" }, { status: 400 });
    }
    
    if (query.length > 200) {
      return NextResponse.json({ error: "Query too long" }, { status: 400 });
    }
    
    if (query.trim().length < 2) {
      return NextResponse.json({ error: "Query too short" }, { status: 400 });
    }

    // Execute search with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Search timeout')), 10000); // 10 second timeout
    });
    
    const searchPromise = runSearch(query, { debug: Boolean(body?.debug) });
    const result = await Promise.race([searchPromise, timeoutPromise]) as Record<string, unknown>;
    
    const processingTime = Date.now() - startTime;
    
    // Add performance metadata
    const response = {
      ...(result as object),
      metadata: {
        processingTime,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    };
    
    // Log successful searches for analytics
    console.log(`Search: \"${query}\" - ${(result as { results?: unknown[] })?.results?.length || 0} results - ${processingTime}ms`);
    
    return NextResponse.json(response);
    
  } catch (err: unknown) {
    const processingTime = Date.now() - startTime;
    const errorMessage = err instanceof Error ? err.message : String(err);
    
    // Log errors for monitoring
    console.error(`Search API Error: ${errorMessage} - ${processingTime}ms`);
    
    // Don't expose internal errors in production
    const isProduction = process.env.NODE_ENV === 'production';
    const publicError = isProduction ? 'Internal server error' : errorMessage;
    
    return NextResponse.json(
      { 
        error: publicError,
        metadata: {
          processingTime,
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }
      }, 
      { status: 500 }
    );
  }
}
