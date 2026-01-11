import { createClient } from '@/lib/supabase';

/**
 * Define the structure for search results
 */
export interface SearchResult {
    id: string | number;
    type: 'lead' | 'contact' | 'account' | 'opportunity' | 'task' | 'case';
    title: string;
    subtitle?: string;
    href: string;
}

/**
 * SearchEngine handles cross-entity fuzzy searching in Supabase.
 */
export class SearchEngine {
    private static supabase = createClient();

    /**
     * Performs a global search across all major CRM entities.
     */
    static async globalSearch(query: string): Promise<SearchResult[]> {
        if (!query || query.trim().length < 2) return [];

        const searchQuery = `%${query.trim()}%`;

        // Perform sub-searches in parallel for performance
        try {
            const results = await Promise.all([
                this.searchLeads(searchQuery),
                this.searchContacts(searchQuery),
                this.searchAccounts(searchQuery),
                this.searchOpportunities(searchQuery),
                this.searchTasks(searchQuery),
                this.searchCases(searchQuery),
            ]);

            return results.flat().slice(0, 15); // Return top 15 results total
        } catch (error) {
            console.error('[Search Error]:', error);
            return [];
        }
    }

    private static async searchLeads(q: string): Promise<SearchResult[]> {
        const { data } = await this.supabase
            .from('leads')
            .select('id, first_name, last_name, company_name')
            .or(`first_name.ilike.${q},last_name.ilike.${q},company_name.ilike.${q}`)
            .limit(3);

        return (data || []).map(item => ({
            id: item.id,
            type: 'lead',
            title: `${item.first_name} ${item.last_name}`,
            subtitle: item.company_name || 'Lead',
            href: `/leads/${item.id}`,
        }));
    }

    private static async searchContacts(q: string): Promise<SearchResult[]> {
        const { data } = await this.supabase
            .from('contacts')
            .select('id, first_name, last_name, email')
            .or(`first_name.ilike.${q},last_name.ilike.${q},email.ilike.${q}`)
            .limit(3);

        return (data || []).map(item => ({
            id: item.id,
            type: 'contact',
            title: `${item.first_name} ${item.last_name}`,
            subtitle: item.email || 'Contact',
            href: `/contacts/${item.id}`,
        }));
    }

    private static async searchAccounts(q: string): Promise<SearchResult[]> {
        const { data } = await this.supabase
            .from('accounts')
            .select('id, name, industry')
            .or(`name.ilike.${q},industry.ilike.${q}`)
            .limit(3);

        return (data || []).map(item => ({
            id: item.id,
            type: 'account',
            title: item.name,
            subtitle: item.industry || 'Account',
            href: `/accounts/${item.id}`,
        }));
    }

    private static async searchOpportunities(q: string): Promise<SearchResult[]> {
        const { data } = await this.supabase
            .from('opportunities')
            .select('id, name')
            .ilike('name', q)
            .limit(3);

        return (data || []).map(item => ({
            id: item.id,
            type: 'opportunity',
            title: item.name || 'Untitled Opportunity',
            subtitle: 'Opportunity',
            href: `/opportunities/${item.id}`,
        }));
    }

    private static async searchTasks(q: string): Promise<SearchResult[]> {
        const { data } = await this.supabase
            .from('tasks')
            .select('id, subject')
            .ilike('subject', q)
            .limit(3);

        return (data || []).map(item => ({
            id: item.id,
            type: 'task',
            title: item.subject,
            subtitle: 'Task',
            href: `/tasks/${item.id}`,
        }));
    }

    private static async searchCases(q: string): Promise<SearchResult[]> {
        const { data } = await this.supabase
            .from('cases')
            .select('id, subject, case_number')
            .or(`subject.ilike.${q},case_number.ilike.${q}`)
            .limit(3);

        return (data || []).map(item => ({
            id: item.id,
            type: 'case',
            title: `[${item.case_number}] ${item.subject}`,
            subtitle: 'Case',
            href: `/cases/${item.id}`,
        }));
    }
}

export const searchEngine = SearchEngine;
