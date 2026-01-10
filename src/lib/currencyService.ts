/**
 * Enterprise Currency Service for Zenith CRM
 */
export class CurrencyService {
    // Static exchange rates (Mock - can be fetched from API in production)
    private static rates: Record<string, number> = {
        USD: 1.0,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 151.42,
        INR: 83.31,
        AUD: 1.52,
        CAD: 1.35,
    };

    /**
     * Convert an amount from one currency to another
     */
    static convert(amount: number, from: string, to: string): number {
        if (from === to) return amount;

        const baseAmount = amount / (this.rates[from] || 1);
        return baseAmount * (this.rates[to] || 1);
    }

    /**
     * Get formatting options for a specific currency
     */
    static getFormatOptions(currency: string): Intl.NumberFormatOptions {
        return {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        };
    }

    /**
     * Format an amount according to local and currency settings
     */
    static format(amount: number, currency: string, locale: string = 'en-US'): string {
        return new Intl.NumberFormat(locale, this.getFormatOptions(currency)).format(amount);
    }
}

export const fx = CurrencyService;
