import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Enterprise Rate Limiting using Upstash Redis
 */
export const rateLimiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(50, "10 s"), // 50 requests per 10 seconds per unique identifier
    analytics: true,
    prefix: "zenith_crm_ratelimit",
});

/**
 * Middleware utility to apply rate limiting in API routes
 */
export async function applyRateLimit(identifier: string) {
    const { success, limit, reset, remaining } = await rateLimiter.limit(identifier);

    return {
        success,
        headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
        }
    };
}
