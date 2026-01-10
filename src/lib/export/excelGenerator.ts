import * as XLSX from 'xlsx';

/**
 * Utility to generate Excel files from JSON data
 */
export class ExcelGenerator {
    /**
     * Generates and triggers download of an Excel file
     */
    static generate<T>(data: T[], filename: string, sheetName: string = 'Data') {
        if (data.length === 0) return;

        // Create worksheet from JSON
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        // Generate buffer and trigger download
        XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
    }

    /**
     * Formats complex objects for Excel export (flat structure)
     */
    static flattenData(data: any[]): any[] {
        return data.map(item => {
            const flattened: any = {};

            const flatten = (obj: any, prefix = '') => {
                Object.keys(obj).forEach(key => {
                    const value = obj[key];
                    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
                        flatten(value, `${prefix}${key}_`);
                    } else {
                        flattened[`${prefix}${key}`] = value;
                    }
                });
            };

            flatten(item);
            return flattened;
        });
    }
}
