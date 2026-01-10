import { createClient } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Service to handle bulk operations across various entities.
 */
export class BulkOperations {
    private static supabase = createClient();

    /**
     * Bulk delete items from a table
     */
    static async bulkDelete(table: string, ids: (string | number)[]) {
        try {
            const { error } = await this.supabase
                .from(table)
                .delete()
                .in('id', ids);

            if (error) throw error;

            toast.success(`Successfully deleted ${ids.length} items`);
            return true;
        } catch (error: any) {
            toast.error(`Delete failed: ${error.message}`);
            return false;
        }
    }

    /**
     * Bulk update status for items
     */
    static async bulkUpdateStatus(table: string, ids: (string | number)[], status: string) {
        try {
            const { error } = await this.supabase
                .from(table)
                .update({ status })
                .in('id', ids);

            if (error) throw error;

            toast.success(`Updated status for ${ids.length} items to "${status}"`);
            return true;
        } catch (error: any) {
            toast.error(`Update failed: ${error.message}`);
            return false;
        }
    }

    /**
     * Bulk assign items to a new owner/user
     */
    static async bulkAssign(table: string, ids: (string | number)[], userId: string) {
        try {
            const column = table === 'tasks' ? 'assigned_to_id' : 'owner_id';

            const { error } = await this.supabase
                .from(table)
                .update({ [column]: userId })
                .in('id', ids);

            if (error) throw error;

            toast.success(`Assigned ${ids.length} items to the selected user`);
            return true;
        } catch (error: any) {
            toast.error(`Assignment failed: ${error.message}`);
            return false;
        }
    }

    /**
     * Export items to CSV
     */
    static exportToCSV(data: any[], filename: string) {
        if (data.length === 0) return;

        const headers = Object.keys(data[0]).join(',');
        const rows = data.map((item) => {
            return Object.values(item).map((val) => {
                if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`;
                return val;
            }).join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Export completed');
    }
}

export const bulkOps = BulkOperations;
