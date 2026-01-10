import Papa from 'papaparse';

export interface ParseResult<T> {
    data: T[];
    errors: Papa.ParseError[];
    meta: Papa.ParseMeta;
}

/**
 * Utility to parse CSV files with validation
 */
export class CsvParser {
    /**
     * Parse a CSV file or string into a JSON array
     */
    static async parse<T>(fileOrString: File | string): Promise<ParseResult<T>> {
        return new Promise((resolve, reject) => {
            Papa.parse(fileOrString as any, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    resolve({
                        data: results.data as T[],
                        errors: results.errors,
                        meta: results.meta,
                    });
                },
                error: (error) => {
                    reject(error);
                },
            });
        });
    }

    /**
     * Validates row data against required fields
     */
    static validate<T>(data: T[], requiredFields: (keyof T)[]): { valid: T[], invalid: { row: T, missing: string[] }[] } {
        const valid: T[] = [];
        const invalid: { row: T, missing: string[] }[] = [];

        data.forEach(row => {
            const missing = requiredFields.filter(field => !row[field]);
            if (missing.length === 0) {
                valid.push(row);
            } else {
                invalid.push({ row, missing: missing.map(String) });
            }
        });

        return { valid, invalid };
    }
}
