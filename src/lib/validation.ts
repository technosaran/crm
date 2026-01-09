// Input validation and sanitization utilities

// Email validation
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation (flexible format)
export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// URL validation
export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Sanitize HTML to prevent XSS
export function sanitizeHtml(input: string): string {
    if (!input) return '';
    
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

// Sanitize string input (remove control characters)
export function sanitizeString(input: string): string {
    if (!input) return '';
    
    return input
        .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
        .trim();
}

// Validate and sanitize name fields
export function validateName(name: string): { valid: boolean; error?: string; sanitized?: string } {
    if (!name || name.trim().length === 0) {
        return { valid: false, error: 'Name is required' };
    }
    
    const sanitized = sanitizeString(name);
    
    if (sanitized.length < 2) {
        return { valid: false, error: 'Name must be at least 2 characters' };
    }
    
    if (sanitized.length > 100) {
        return { valid: false, error: 'Name must be less than 100 characters' };
    }
    
    return { valid: true, sanitized };
}

// Validate and sanitize email
export function validateEmail(email: string): { valid: boolean; error?: string; sanitized?: string } {
    if (!email || email.trim().length === 0) {
        return { valid: false, error: 'Email is required' };
    }
    
    const sanitized = sanitizeString(email.toLowerCase());
    
    if (!isValidEmail(sanitized)) {
        return { valid: false, error: 'Invalid email format' };
    }
    
    return { valid: true, sanitized };
}

// Validate and sanitize phone
export function validatePhone(phone: string): { valid: boolean; error?: string; sanitized?: string } {
    if (!phone || phone.trim().length === 0) {
        return { valid: true, sanitized: '' }; // Phone is optional
    }
    
    const sanitized = sanitizeString(phone);
    
    if (!isValidPhone(sanitized)) {
        return { valid: false, error: 'Invalid phone format' };
    }
    
    return { valid: true, sanitized };
}

// Validate URL
export function validateUrl(url: string): { valid: boolean; error?: string; sanitized?: string } {
    if (!url || url.trim().length === 0) {
        return { valid: true, sanitized: '' }; // URL is optional
    }
    
    const sanitized = sanitizeString(url);
    
    if (!isValidUrl(sanitized)) {
        return { valid: false, error: 'Invalid URL format' };
    }
    
    return { valid: true, sanitized };
}

// Validate amount/currency
export function validateAmount(amount: any): { valid: boolean; error?: string; value?: number } {
    if (amount === null || amount === undefined || amount === '') {
        return { valid: false, error: 'Amount is required' };
    }
    
    const numValue = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numValue)) {
        return { valid: false, error: 'Amount must be a number' };
    }
    
    if (numValue < 0) {
        return { valid: false, error: 'Amount cannot be negative' };
    }
    
    if (numValue > 999999999) {
        return { valid: false, error: 'Amount is too large' };
    }
    
    return { valid: true, value: numValue };
}

// Validate date
export function validateDate(date: any): { valid: boolean; error?: string; value?: Date } {
    if (!date) {
        return { valid: false, error: 'Date is required' };
    }
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
        return { valid: false, error: 'Invalid date format' };
    }
    
    return { valid: true, value: dateObj };
}

// SQL injection prevention - validate identifiers
export function validateIdentifier(identifier: string): boolean {
    // Only allow alphanumeric, underscore, and hyphen
    const regex = /^[a-zA-Z0-9_-]+$/;
    return regex.test(identifier);
}

// Prevent path traversal
export function sanitizePath(path: string): string {
    return path.replace(/\.\./g, '').replace(/[\/\\]/g, '');
}

// Password strength validation
export function validatePassword(password: string): { valid: boolean; error?: string; strength?: 'weak' | 'medium' | 'strong' } {
    if (!password || password.length < 8) {
        return { valid: false, error: 'Password must be at least 8 characters' };
    }
    
    if (password.length > 128) {
        return { valid: false, error: 'Password is too long' };
    }
    
    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    let score = 0;
    
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    if (password.length >= 12) score++;
    
    if (score >= 4) strength = 'strong';
    else if (score >= 3) strength = 'medium';
    
    return { valid: true, strength };
}

// Rate limiting check (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
    identifier: string,
    maxRequests: number = 10,
    windowMs: number = 60000
): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const record = rateLimitMap.get(identifier);
    
    if (!record || now > record.resetTime) {
        rateLimitMap.set(identifier, {
            count: 1,
            resetTime: now + windowMs,
        });
        return { allowed: true };
    }
    
    if (record.count >= maxRequests) {
        return {
            allowed: false,
            retryAfter: Math.ceil((record.resetTime - now) / 1000),
        };
    }
    
    record.count++;
    return { allowed: true };
}

// Clean up old rate limit entries periodically
if (typeof window === 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, value] of rateLimitMap.entries()) {
            if (now > value.resetTime) {
                rateLimitMap.delete(key);
            }
        }
    }, 60000); // Clean up every minute
}
