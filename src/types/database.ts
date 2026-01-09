export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      // ============================================
      // USER & TEAM MANAGEMENT
      // ============================================
      users: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          role: 'ADMIN' | 'MANAGER' | 'SALES' | 'SUPPORT'
          department: string | null
          avatar: string | null
          team_id: string | null
          manager_id: string | null
          is_active: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          role: 'ADMIN' | 'MANAGER' | 'SALES' | 'SUPPORT'
          department?: string | null
          avatar?: string | null
          team_id?: string | null
          manager_id?: string | null
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          email?: string
          phone?: string | null
          role?: 'ADMIN' | 'MANAGER' | 'SALES' | 'SUPPORT'
          department?: string | null
          avatar?: string | null
          team_id?: string | null
          manager_id?: string | null
          is_active?: boolean
          last_login?: string | null
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'users_team_id_fkey'; columns: ['team_id']; referencedRelation: 'teams'; referencedColumns: ['id'] },
          { foreignKeyName: 'users_manager_id_fkey'; columns: ['manager_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ]
      }
      teams: {
        Row: {
          id: string
          name: string
          description: string | null
          leader_id: string
          parent_team_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          leader_id: string
          parent_team_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          leader_id?: string
          parent_team_id?: string | null
          is_active?: boolean
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'teams_leader_id_fkey'; columns: ['leader_id']; referencedRelation: 'users'; referencedColumns: ['id'] },
          { foreignKeyName: 'teams_parent_team_id_fkey'; columns: ['parent_team_id']; referencedRelation: 'teams'; referencedColumns: ['id'] }
        ]
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: 'LEADER' | 'MEMBER'
          joined_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          role?: 'LEADER' | 'MEMBER'
          joined_at?: string
        }
        Update: {
          team_id?: string
          user_id?: string
          role?: 'LEADER' | 'MEMBER'
        }
        Relationships: [
          { foreignKeyName: 'team_members_team_id_fkey'; columns: ['team_id']; referencedRelation: 'teams'; referencedColumns: ['id'] },
          { foreignKeyName: 'team_members_user_id_fkey'; columns: ['user_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ]
      }
      // ============================================
      // LEADS
      // ============================================
      leads: {
        Row: {
          id: string
          first_name: string
          last_name: string
          company_id: string | null
          company_name: string
          email: string
          phone: string | null
          status: 'NEW' | 'CONTACTED' | 'WORKING' | 'NURTURING' | 'QUALIFIED' | 'UNQUALIFIED'
          rating: 'HOT' | 'WARM' | 'COLD' | null
          source: string
          campaign_id: string | null
          owner_id: string
          annual_revenue: number | null
          number_of_employees: number | null
          converted_at: string | null
          converted_to_contact_id: string | null
          converted_to_account_id: string | null
          converted_to_opportunity_id: string | null
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          company_id?: string | null
          company_name: string
          email: string
          phone?: string | null
          status?: 'NEW' | 'CONTACTED' | 'WORKING' | 'NURTURING' | 'QUALIFIED' | 'UNQUALIFIED'
          rating?: 'HOT' | 'WARM' | 'COLD' | null
          source: string
          campaign_id?: string | null
          owner_id: string
          annual_revenue?: number | null
          number_of_employees?: number | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          first_name?: string
          last_name?: string
          company_id?: string | null
          company_name?: string
          email?: string
          phone?: string | null
          status?: 'NEW' | 'CONTACTED' | 'WORKING' | 'NURTURING' | 'QUALIFIED' | 'UNQUALIFIED'
          rating?: 'HOT' | 'WARM' | 'COLD' | null
          source?: string
          campaign_id?: string | null
          owner_id?: string
          annual_revenue?: number | null
          number_of_employees?: number | null
          converted_at?: string | null
          converted_to_contact_id?: string | null
          converted_to_account_id?: string | null
          converted_to_opportunity_id?: string | null
          tags?: string[]
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'leads_owner_id_fkey'; columns: ['owner_id']; referencedRelation: 'users'; referencedColumns: ['id'] },
          { foreignKeyName: 'leads_campaign_id_fkey'; columns: ['campaign_id']; referencedRelation: 'campaigns'; referencedColumns: ['id'] }
        ]
      }
      // ============================================
      // ACCOUNTS & CONTACTS
      // ============================================
      accounts: {
        Row: {
          id: string
          name: string
          type: 'CUSTOMER' | 'PROSPECT' | 'PARTNER' | 'VENDOR' | 'COMPETITOR' | 'OTHER'
          industry: string
          website: string | null
          phone: string | null
          email: string | null
          owner_id: string
          parent_account_id: string | null
          billing_street: string | null
          billing_city: string | null
          billing_state: string | null
          billing_postal_code: string | null
          billing_country: string | null
          shipping_street: string | null
          shipping_city: string | null
          shipping_state: string | null
          shipping_postal_code: string | null
          shipping_country: string | null
          annual_revenue: number | null
          number_of_employees: number | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type?: 'CUSTOMER' | 'PROSPECT' | 'PARTNER' | 'VENDOR' | 'COMPETITOR' | 'OTHER'
          industry: string
          website?: string | null
          phone?: string | null
          email?: string | null
          owner_id: string
          parent_account_id?: string | null
          billing_street?: string | null
          billing_city?: string | null
          billing_state?: string | null
          billing_postal_code?: string | null
          billing_country?: string | null
          shipping_street?: string | null
          shipping_city?: string | null
          shipping_state?: string | null
          shipping_postal_code?: string | null
          shipping_country?: string | null
          annual_revenue?: number | null
          number_of_employees?: number | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          type?: 'CUSTOMER' | 'PROSPECT' | 'PARTNER' | 'VENDOR' | 'COMPETITOR' | 'OTHER'
          industry?: string
          website?: string | null
          phone?: string | null
          email?: string | null
          owner_id?: string
          parent_account_id?: string | null
          billing_street?: string | null
          billing_city?: string | null
          billing_state?: string | null
          billing_postal_code?: string | null
          billing_country?: string | null
          shipping_street?: string | null
          shipping_city?: string | null
          shipping_state?: string | null
          shipping_postal_code?: string | null
          shipping_country?: string | null
          annual_revenue?: number | null
          number_of_employees?: number | null
          description?: string | null
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'accounts_owner_id_fkey'; columns: ['owner_id']; referencedRelation: 'users'; referencedColumns: ['id'] },
          { foreignKeyName: 'accounts_parent_account_id_fkey'; columns: ['parent_account_id']; referencedRelation: 'accounts'; referencedColumns: ['id'] }
        ]
      }
      contacts: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          mobile: string | null
          title: string | null
          department: string | null
          account_id: string
          reports_to_id: string | null
          owner_id: string
          mailing_street: string | null
          mailing_city: string | null
          mailing_state: string | null
          mailing_postal_code: string | null
          mailing_country: string | null
          is_primary: boolean
          do_not_call: boolean
          do_not_email: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          mobile?: string | null
          title?: string | null
          department?: string | null
          account_id: string
          reports_to_id?: string | null
          owner_id: string
          mailing_street?: string | null
          mailing_city?: string | null
          mailing_state?: string | null
          mailing_postal_code?: string | null
          mailing_country?: string | null
          is_primary?: boolean
          do_not_call?: boolean
          do_not_email?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          mobile?: string | null
          title?: string | null
          department?: string | null
          account_id?: string
          reports_to_id?: string | null
          owner_id?: string
          mailing_street?: string | null
          mailing_city?: string | null
          mailing_state?: string | null
          mailing_postal_code?: string | null
          mailing_country?: string | null
          is_primary?: boolean
          do_not_call?: boolean
          do_not_email?: boolean
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'contacts_account_id_fkey'; columns: ['account_id']; referencedRelation: 'accounts'; referencedColumns: ['id'] },
          { foreignKeyName: 'contacts_reports_to_id_fkey'; columns: ['reports_to_id']; referencedRelation: 'contacts'; referencedColumns: ['id'] },
          { foreignKeyName: 'contacts_owner_id_fkey'; columns: ['owner_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ]
      }
      // ============================================
      // OPPORTUNITIES & PIPELINE
      // ============================================
      pipelines: {
        Row: {
          id: string
          name: string
          description: string | null
          is_default: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_default?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          is_default?: boolean
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      pipeline_stages: {
        Row: {
          id: string
          pipeline_id: string
          name: string
          probability: number
          order: number
          is_closed: boolean
          is_won: boolean
          created_at: string
        }
        Insert: {
          id?: string
          pipeline_id: string
          name: string
          probability: number
          order: number
          is_closed?: boolean
          is_won?: boolean
          created_at?: string
        }
        Update: {
          pipeline_id?: string
          name?: string
          probability?: number
          order?: number
          is_closed?: boolean
          is_won?: boolean
        }
        Relationships: [
          { foreignKeyName: 'pipeline_stages_pipeline_id_fkey'; columns: ['pipeline_id']; referencedRelation: 'pipelines'; referencedColumns: ['id'] }
        ]
      }
      opportunities: {
        Row: {
          id: string
          name: string
          description: string | null
          account_id: string
          contact_id: string | null
          pipeline_id: string | null
          amount: number
          stage: 'NEW' | 'QUALIFICATION' | 'NEEDS_ANALYSIS' | 'VALUE_PROPOSITION' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST'
          type: 'NEW_BUSINESS' | 'EXISTING_BUSINESS' | 'RENEWAL' | 'UPSELL' | null
          probability: number
          expected_close_date: string
          closed_at: string | null
          next_step: string | null
          lead_source: string | null
          campaign_id: string | null
          competitor_ids: string[] | null
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          account_id: string
          contact_id?: string | null
          pipeline_id?: string | null
          amount: number
          stage?: 'NEW' | 'QUALIFICATION' | 'NEEDS_ANALYSIS' | 'VALUE_PROPOSITION' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST'
          type?: 'NEW_BUSINESS' | 'EXISTING_BUSINESS' | 'RENEWAL' | 'UPSELL' | null
          probability: number
          expected_close_date: string
          next_step?: string | null
          lead_source?: string | null
          campaign_id?: string | null
          competitor_ids?: string[] | null
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          account_id?: string
          contact_id?: string | null
          pipeline_id?: string | null
          amount?: number
          stage?: 'NEW' | 'QUALIFICATION' | 'NEEDS_ANALYSIS' | 'VALUE_PROPOSITION' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST'
          type?: 'NEW_BUSINESS' | 'EXISTING_BUSINESS' | 'RENEWAL' | 'UPSELL' | null
          probability?: number
          expected_close_date?: string
          closed_at?: string | null
          next_step?: string | null
          lead_source?: string | null
          campaign_id?: string | null
          competitor_ids?: string[] | null
          owner_id?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'opportunities_account_id_fkey'; columns: ['account_id']; referencedRelation: 'accounts'; referencedColumns: ['id'] },
          { foreignKeyName: 'opportunities_contact_id_fkey'; columns: ['contact_id']; referencedRelation: 'contacts'; referencedColumns: ['id'] },
          { foreignKeyName: 'opportunities_pipeline_id_fkey'; columns: ['pipeline_id']; referencedRelation: 'pipelines'; referencedColumns: ['id'] },
          { foreignKeyName: 'opportunities_campaign_id_fkey'; columns: ['campaign_id']; referencedRelation: 'campaigns'; referencedColumns: ['id'] },
          { foreignKeyName: 'opportunities_owner_id_fkey'; columns: ['owner_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ]
      }
      // ============================================
      // PRODUCTS & PRICE BOOKS
      // ============================================
      products: {
        Row: {
          id: string
          name: string
          code: string
          description: string | null
          category: string | null
          unit_price: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          description?: string | null
          category?: string | null
          unit_price: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          code?: string
          description?: string | null
          category?: string | null
          unit_price?: number
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      price_books: {
        Row: {
          id: string
          name: string
          description: string | null
          is_standard: boolean
          is_active: boolean
          valid_from: string | null
          valid_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_standard?: boolean
          is_active?: boolean
          valid_from?: string | null
          valid_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          is_standard?: boolean
          is_active?: boolean
          valid_from?: string | null
          valid_to?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      price_book_entries: {
        Row: {
          id: string
          price_book_id: string
          product_id: string
          unit_price: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          price_book_id: string
          product_id: string
          unit_price: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          price_book_id?: string
          product_id?: string
          unit_price?: number
          is_active?: boolean
        }
        Relationships: [
          { foreignKeyName: 'price_book_entries_price_book_id_fkey'; columns: ['price_book_id']; referencedRelation: 'price_books'; referencedColumns: ['id'] },
          { foreignKeyName: 'price_book_entries_product_id_fkey'; columns: ['product_id']; referencedRelation: 'products'; referencedColumns: ['id'] }
        ]
      }
      opportunity_line_items: {
        Row: {
          id: string
          opportunity_id: string
          product_id: string
          price_book_entry_id: string | null
          quantity: number
          unit_price: number
          discount: number | null
          total_price: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          opportunity_id: string
          product_id: string
          price_book_entry_id?: string | null
          quantity: number
          unit_price: number
          discount?: number | null
          total_price: number
          description?: string | null
          created_at?: string
        }
        Update: {
          opportunity_id?: string
          product_id?: string
          price_book_entry_id?: string | null
          quantity?: number
          unit_price?: number
          discount?: number | null
          total_price?: number
          description?: string | null
        }
        Relationships: [
          { foreignKeyName: 'opportunity_line_items_opportunity_id_fkey'; columns: ['opportunity_id']; referencedRelation: 'opportunities'; referencedColumns: ['id'] },
          { foreignKeyName: 'opportunity_line_items_product_id_fkey'; columns: ['product_id']; referencedRelation: 'products'; referencedColumns: ['id'] },
          { foreignKeyName: 'opportunity_line_items_price_book_entry_id_fkey'; columns: ['price_book_entry_id']; referencedRelation: 'price_book_entries'; referencedColumns: ['id'] }
        ]
      }
      // ============================================
      // QUOTES & CONTRACTS
      // ============================================
      quotes: {
        Row: {
          id: string
          quote_number: string
          name: string
          opportunity_id: string
          account_id: string
          contact_id: string | null
          status: 'DRAFT' | 'NEEDS_REVIEW' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'PRESENTED' | 'ACCEPTED' | 'DENIED'
          expiration_date: string
          subtotal: number
          discount: number | null
          tax: number | null
          total: number
          terms: string | null
          description: string | null
          is_primary: boolean
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quote_number: string
          name: string
          opportunity_id: string
          account_id: string
          contact_id?: string | null
          status?: 'DRAFT' | 'NEEDS_REVIEW' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'PRESENTED' | 'ACCEPTED' | 'DENIED'
          expiration_date: string
          subtotal: number
          discount?: number | null
          tax?: number | null
          total: number
          terms?: string | null
          description?: string | null
          is_primary?: boolean
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          quote_number?: string
          name?: string
          opportunity_id?: string
          account_id?: string
          contact_id?: string | null
          status?: 'DRAFT' | 'NEEDS_REVIEW' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'PRESENTED' | 'ACCEPTED' | 'DENIED'
          expiration_date?: string
          subtotal?: number
          discount?: number | null
          tax?: number | null
          total?: number
          terms?: string | null
          description?: string | null
          is_primary?: boolean
          owner_id?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'quotes_opportunity_id_fkey'; columns: ['opportunity_id']; referencedRelation: 'opportunities'; referencedColumns: ['id'] },
          { foreignKeyName: 'quotes_account_id_fkey'; columns: ['account_id']; referencedRelation: 'accounts'; referencedColumns: ['id'] },
          { foreignKeyName: 'quotes_contact_id_fkey'; columns: ['contact_id']; referencedRelation: 'contacts'; referencedColumns: ['id'] },
          { foreignKeyName: 'quotes_owner_id_fkey'; columns: ['owner_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ]
      }
      quote_line_items: {
        Row: {
          id: string
          quote_id: string
          product_id: string
          quantity: number
          unit_price: number
          discount: number | null
          total_price: number
          description: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          quote_id: string
          product_id: string
          quantity: number
          unit_price: number
          discount?: number | null
          total_price: number
          description?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          quote_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          discount?: number | null
          total_price?: number
          description?: string | null
          sort_order?: number
        }
        Relationships: [
          { foreignKeyName: 'quote_line_items_quote_id_fkey'; columns: ['quote_id']; referencedRelation: 'quotes'; referencedColumns: ['id'] },
          { foreignKeyName: 'quote_line_items_product_id_fkey'; columns: ['product_id']; referencedRelation: 'products'; referencedColumns: ['id'] }
        ]
      }
      contracts: {
        Row: {
          id: string
          contract_number: string
          name: string
          account_id: string
          contact_id: string | null
          opportunity_id: string | null
          quote_id: string | null
          status: 'DRAFT' | 'IN_APPROVAL' | 'ACTIVATED' | 'TERMINATED' | 'EXPIRED'
          start_date: string
          end_date: string
          contract_value: number
          terms: string | null
          description: string | null
          renewal_date: string | null
          auto_renewal: boolean
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contract_number: string
          name: string
          account_id: string
          contact_id?: string | null
          opportunity_id?: string | null
          quote_id?: string | null
          status?: 'DRAFT' | 'IN_APPROVAL' | 'ACTIVATED' | 'TERMINATED' | 'EXPIRED'
          start_date: string
          end_date: string
          contract_value: number
          terms?: string | null
          description?: string | null
          renewal_date?: string | null
          auto_renewal?: boolean
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          contract_number?: string
          name?: string
          account_id?: string
          contact_id?: string | null
          opportunity_id?: string | null
          quote_id?: string | null
          status?: 'DRAFT' | 'IN_APPROVAL' | 'ACTIVATED' | 'TERMINATED' | 'EXPIRED'
          start_date?: string
          end_date?: string
          contract_value?: number
          terms?: string | null
          description?: string | null
          renewal_date?: string | null
          auto_renewal?: boolean
          owner_id?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'contracts_account_id_fkey'; columns: ['account_id']; referencedRelation: 'accounts'; referencedColumns: ['id'] },
          { foreignKeyName: 'contracts_contact_id_fkey'; columns: ['contact_id']; referencedRelation: 'contacts'; referencedColumns: ['id'] },
          { foreignKeyName: 'contracts_opportunity_id_fkey'; columns: ['opportunity_id']; referencedRelation: 'opportunities'; referencedColumns: ['id'] },
          { foreignKeyName: 'contracts_quote_id_fkey'; columns: ['quote_id']; referencedRelation: 'quotes'; referencedColumns: ['id'] },
          { foreignKeyName: 'contracts_owner_id_fkey'; columns: ['owner_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ]
      }
      // ============================================
      // CAMPAIGNS & MARKETING
      // ============================================
      campaigns: {
        Row: {
          id: string
          name: string
          type: 'EMAIL' | 'WEBINAR' | 'CONFERENCE' | 'ADVERTISEMENT' | 'SOCIAL_MEDIA' | 'REFERRAL' | 'OTHER'
          status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ABORTED'
          description: string | null
          start_date: string | null
          end_date: string | null
          budgeted_cost: number | null
          actual_cost: number | null
          expected_revenue: number | null
          expected_response: number | null
          parent_campaign_id: string | null
          owner_id: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'EMAIL' | 'WEBINAR' | 'CONFERENCE' | 'ADVERTISEMENT' | 'SOCIAL_MEDIA' | 'REFERRAL' | 'OTHER'
          status?: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ABORTED'
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          budgeted_cost?: number | null
          actual_cost?: number | null
          expected_revenue?: number | null
          expected_response?: number | null
          parent_campaign_id?: string | null
          owner_id: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          type?: 'EMAIL' | 'WEBINAR' | 'CONFERENCE' | 'ADVERTISEMENT' | 'SOCIAL_MEDIA' | 'REFERRAL' | 'OTHER'
          status?: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ABORTED'
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          budgeted_cost?: number | null
          actual_cost?: number | null
          expected_revenue?: number | null
          expected_response?: number | null
          parent_campaign_id?: string | null
          owner_id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'campaigns_parent_campaign_id_fkey'; columns: ['parent_campaign_id']; referencedRelation: 'campaigns'; referencedColumns: ['id'] },
          { foreignKeyName: 'campaigns_owner_id_fkey'; columns: ['owner_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ]
      }
      campaign_members: {
        Row: {
          id: string
          campaign_id: string
          lead_id: string | null
          contact_id: string | null
          status: 'SENT' | 'RESPONDED' | 'CONVERTED'
          responded_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          lead_id?: string | null
          contact_id?: string | null
          status?: 'SENT' | 'RESPONDED' | 'CONVERTED'
          responded_at?: string | null
          created_at?: string
        }
        Update: {
          campaign_id?: string
          lead_id?: string | null
          contact_id?: string | null
          status?: 'SENT' | 'RESPONDED' | 'CONVERTED'
          responded_at?: string | null
        }
        Relationships: [
          { foreignKeyName: 'campaign_members_campaign_id_fkey'; columns: ['campaign_id']; referencedRelation: 'campaigns'; referencedColumns: ['id'] },
          { foreignKeyName: 'campaign_members_lead_id_fkey'; columns: ['lead_id']; referencedRelation: 'leads'; referencedColumns: ['id'] },
          { foreignKeyName: 'campaign_members_contact_id_fkey'; columns: ['contact_id']; referencedRelation: 'contacts'; referencedColumns: ['id'] }
        ]
      }
      // ============================================
      // TASKS & CALENDAR
      // ============================================
      tasks: {
        Row: {
          id: string
          subject: string
          description: string | null
          status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'WAITING' | 'DEFERRED'
          priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
          due_date: string | null
          reminder_at: string | null
          completed_at: string | null
          entity_id: string | null
          entity_type: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT' | null
          assigned_to_id: string
          owner_id: string
          is_recurring: boolean
          recurrence_rule: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subject: string
          description?: string | null
          status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'WAITING' | 'DEFERRED'
          priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
          due_date?: string | null
          reminder_at?: string | null
          completed_at?: string | null
          entity_id?: string | null
          entity_type?: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT' | null
          assigned_to_id: string
          owner_id: string
          is_recurring?: boolean
          recurrence_rule?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          subject?: string
          description?: string | null
          status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'WAITING' | 'DEFERRED'
          priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
          due_date?: string | null
          reminder_at?: string | null
          completed_at?: string | null
          entity_id?: string | null
          entity_type?: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT' | null
          assigned_to_id?: string
          owner_id?: string
          is_recurring?: boolean
          recurrence_rule?: string | null
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'tasks_assigned_to_id_fkey'; columns: ['assigned_to_id']; referencedRelation: 'users'; referencedColumns: ['id'] },
          { foreignKeyName: 'tasks_owner_id_fkey'; columns: ['owner_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ]
      }
      calendar_events: {
        Row: {
          id: string
          subject: string
          description: string | null
          location: string | null
          start_time: string
          end_time: string
          is_all_day: boolean
          entity_id: string | null
          entity_type: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT' | null
          owner_id: string
          attendee_ids: string[]
          reminder_minutes: number | null
          is_recurring: boolean
          recurrence_rule: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subject: string
          description?: string | null
          location?: string | null
          start_time: string
          end_time: string
          is_all_day?: boolean
          entity_id?: string | null
          entity_type?: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT' | null
          owner_id: string
          attendee_ids?: string[]
          reminder_minutes?: number | null
          is_recurring?: boolean
          recurrence_rule?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          subject?: string
          description?: string | null
          location?: string | null
          start_time?: string
          end_time?: string
          is_all_day?: boolean
          entity_id?: string | null
          entity_type?: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT' | null
          owner_id?: string
          attendee_ids?: string[]
          reminder_minutes?: number | null
          is_recurring?: boolean
          recurrence_rule?: string | null
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'calendar_events_owner_id_fkey'; columns: ['owner_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ]
      }
      // ============================================
      // CASES / SUPPORT
      // ============================================
      cases: {
        Row: {
          id: string
          case_number: string
          subject: string
          description: string | null
          status: 'NEW' | 'OPEN' | 'IN_PROGRESS' | 'ESCALATED' | 'ON_HOLD' | 'CLOSED' | 'RESOLVED'
          priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
          type: 'QUESTION' | 'PROBLEM' | 'FEATURE_REQUEST' | 'BUG' | 'OTHER'
          origin: 'PHONE' | 'EMAIL' | 'WEB' | 'CHAT' | 'SOCIAL_MEDIA' | null
          account_id: string | null
          contact_id: string | null
          product_id: string | null
          owner_id: string
          escalated_at: string | null
          closed_at: string | null
          resolution: string | null
          first_response_at: string | null
          sla_deadline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          case_number: string
          subject: string
          description?: string | null
          status?: 'NEW' | 'OPEN' | 'IN_PROGRESS' | 'ESCALATED' | 'ON_HOLD' | 'CLOSED' | 'RESOLVED'
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
          type?: 'QUESTION' | 'PROBLEM' | 'FEATURE_REQUEST' | 'BUG' | 'OTHER'
          origin?: 'PHONE' | 'EMAIL' | 'WEB' | 'CHAT' | 'SOCIAL_MEDIA' | null
          account_id?: string | null
          contact_id?: string | null
          product_id?: string | null
          owner_id: string
          escalated_at?: string | null
          closed_at?: string | null
          resolution?: string | null
          first_response_at?: string | null
          sla_deadline?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          case_number?: string
          subject?: string
          description?: string | null
          status?: 'NEW' | 'OPEN' | 'IN_PROGRESS' | 'ESCALATED' | 'ON_HOLD' | 'CLOSED' | 'RESOLVED'
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
          type?: 'QUESTION' | 'PROBLEM' | 'FEATURE_REQUEST' | 'BUG' | 'OTHER'
          origin?: 'PHONE' | 'EMAIL' | 'WEB' | 'CHAT' | 'SOCIAL_MEDIA' | null
          account_id?: string | null
          contact_id?: string | null
          product_id?: string | null
          owner_id?: string
          escalated_at?: string | null
          closed_at?: string | null
          resolution?: string | null
          first_response_at?: string | null
          sla_deadline?: string | null
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'cases_account_id_fkey'; columns: ['account_id']; referencedRelation: 'accounts'; referencedColumns: ['id'] },
          { foreignKeyName: 'cases_contact_id_fkey'; columns: ['contact_id']; referencedRelation: 'contacts'; referencedColumns: ['id'] },
          { foreignKeyName: 'cases_product_id_fkey'; columns: ['product_id']; referencedRelation: 'products'; referencedColumns: ['id'] },
          { foreignKeyName: 'cases_owner_id_fkey'; columns: ['owner_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ]
      }
      case_comments: {
        Row: {
          id: string
          case_id: string
          body: string
          is_public: boolean
          author_id: string
          created_at: string
        }
        Insert: {
          id?: string
          case_id: string
          body: string
          is_public?: boolean
          author_id: string
          created_at?: string
        }
        Update: {
          case_id?: string
          body?: string
          is_public?: boolean
          author_id?: string
        }
        Relationships: [
          { foreignKeyName: 'case_comments_case_id_fkey'; columns: ['case_id']; referencedRelation: 'cases'; referencedColumns: ['id'] },
          { foreignKeyName: 'case_comments_author_id_fkey'; columns: ['author_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ]
      }
      // ============================================
      // EMAIL TEMPLATES & COMMUNICATION
      // ============================================
      email_templates: {
        Row: {
          id: string
          name: string
          subject: string
          body: string
          type: 'TEXT' | 'HTML' | 'CUSTOM'
          category: string | null
          folder_id: string | null
          is_active: boolean
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          subject: string
          body: string
          type?: 'TEXT' | 'HTML' | 'CUSTOM'
          category?: string | null
          folder_id?: string | null
          is_active?: boolean
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          subject?: string
          body?: string
          type?: 'TEXT' | 'HTML' | 'CUSTOM'
          category?: string | null
          folder_id?: string | null
          is_active?: boolean
          owner_id?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'email_templates_folder_id_fkey'; columns: ['folder_id']; referencedRelation: 'folders'; referencedColumns: ['id'] },
          { foreignKeyName: 'email_templates_owner_id_fkey'; columns: ['owner_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ]
      }
      email_messages: {
        Row: {
          id: string
          subject: string
          body: string
          from_address: string
          to_addresses: string[]
          cc_addresses: string[] | null
          bcc_addresses: string[] | null
          entity_id: string | null
          entity_type: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT' | null
          template_id: string | null
          status: 'DRAFT' | 'SENT' | 'FAILED' | 'BOUNCED'
          sent_at: string | null
          opened_at: string | null
          clicked_at: string | null
          owner_id: string
          created_at: string
        }
        Insert: {
          id?: string
          subject: string
          body: string
          from_address: string
          to_addresses: string[]
          cc_addresses?: string[] | null
          bcc_addresses?: string[] | null
          entity_id?: string | null
          entity_type?: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT' | null
          template_id?: string | null
          status?: 'DRAFT' | 'SENT' | 'FAILED' | 'BOUNCED'
          sent_at?: string | null
          opened_at?: string | null
          clicked_at?: string | null
          owner_id: string
          created_at?: string
        }
        Update: {
          subject?: string
          body?: string
          from_address?: string
          to_addresses?: string[]
          cc_addresses?: string[] | null
          bcc_addresses?: string[] | null
          entity_id?: string | null
          entity_type?: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT' | null
          template_id?: string | null
          status?: 'DRAFT' | 'SENT' | 'FAILED' | 'BOUNCED'
          sent_at?: string | null
          opened_at?: string | null
          clicked_at?: string | null
          owner_id?: string
        }
        Relationships: [
          { foreignKeyName: 'email_messages_template_id_fkey'; columns: ['template_id']; referencedRelation: 'email_templates'; referencedColumns: ['id'] },
          { foreignKeyName: 'email_messages_owner_id_fkey'; columns: ['owner_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ]
      }
      // ============================================
      // NOTES, FILES & FOLDERS
      // ============================================
      notes: {
        Row: {
          id: string
          title: string | null
          body: string
          entity_id: string
          entity_type: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT'
          is_private: boolean
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title?: string | null
          body: string
          entity_id: string
          entity_type: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT'
          is_private?: boolean
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string | null
          body?: string
          entity_id?: string
          entity_type?: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT'
          is_private?: boolean
          owner_id?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'notes_owner_id_fkey'; columns: ['owner_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ]
      }
      files: {
        Row: {
          id: string
          name: string
          description: string | null
          mime_type: string
          size: number
          url: string
          entity_id: string
          entity_type: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT'
          folder_id: string | null
          uploaded_by_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          mime_type: string
          size: number
          url: string
          entity_id: string
          entity_type: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT'
          folder_id?: string | null
          uploaded_by_id: string
          created_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          mime_type?: string
          size?: number
          url?: string
          entity_id?: string
          entity_type?: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT'
          folder_id?: string | null
          uploaded_by_id?: string
        }
        Relationships: [
          { foreignKeyName: 'files_folder_id_fkey'; columns: ['folder_id']; referencedRelation: 'folders'; referencedColumns: ['id'] },
          { foreignKeyName: 'files_uploaded_by_id_fkey'; columns: ['uploaded_by_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ]
      }
      folders: {
        Row: {
          id: string
          name: string
          parent_folder_id: string | null
          entity_id: string | null
          entity_type: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT' | null
          owner_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          parent_folder_id?: string | null
          entity_id?: string | null
          entity_type?: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT' | null
          owner_id: string
          created_at?: string
        }
        Update: {
          name?: string
          parent_folder_id?: string | null
          entity_id?: string | null
          entity_type?: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT' | null
          owner_id?: string
        }
        Relationships: [
          { foreignKeyName: 'folders_parent_folder_id_fkey'; columns: ['parent_folder_id']; referencedRelation: 'folders'; referencedColumns: ['id'] },
          { foreignKeyName: 'folders_owner_id_fkey'; columns: ['owner_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ]
      }
      // ============================================
      // ACTIVITIES & AUDIT
      // ============================================
      activities: {
        Row: {
          id: string
          type: 'CALL' | 'EMAIL' | 'MEETING' | 'TASK_COMPLETED'
          subject: string
          description: string | null
          entity_id: string
          entity_type: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT'
          call_duration: number | null
          call_result: 'REACHED' | 'LEFT_VOICEMAIL' | 'NO_ANSWER' | 'BUSY' | 'WRONG_NUMBER' | null
          performed_by_id: string
          occurred_at: string
        }
        Insert: {
          id?: string
          type: 'CALL' | 'EMAIL' | 'MEETING' | 'TASK_COMPLETED'
          subject: string
          description?: string | null
          entity_id: string
          entity_type: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT'
          call_duration?: number | null
          call_result?: 'REACHED' | 'LEFT_VOICEMAIL' | 'NO_ANSWER' | 'BUSY' | 'WRONG_NUMBER' | null
          performed_by_id: string
          occurred_at?: string
        }
        Update: {
          type?: 'CALL' | 'EMAIL' | 'MEETING' | 'TASK_COMPLETED'
          subject?: string
          description?: string | null
          entity_id?: string
          entity_type?: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT'
          call_duration?: number | null
          call_result?: 'REACHED' | 'LEFT_VOICEMAIL' | 'NO_ANSWER' | 'BUSY' | 'WRONG_NUMBER' | null
          performed_by_id?: string
          occurred_at?: string
        }
        Relationships: [
          { foreignKeyName: 'activities_performed_by_id_fkey'; columns: ['performed_by_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ]
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string
          action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'EXPORT' | 'LOGIN' | 'LOGOUT'
          entity_id: string
          entity_type: string
          old_values: Json | null
          new_values: Json | null
          details: string
          ip_address: string | null
          user_agent: string | null
          timestamp: string
        }
        Insert: {
          id?: string
          user_id: string
          action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'EXPORT' | 'LOGIN' | 'LOGOUT'
          entity_id: string
          entity_type: string
          old_values?: Json | null
          new_values?: Json | null
          details: string
          ip_address?: string | null
          user_agent?: string | null
          timestamp?: string
        }
        Update: {
          action?: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'EXPORT' | 'LOGIN' | 'LOGOUT'
          entity_id?: string
          entity_type?: string
          old_values?: Json | null
          new_values?: Json | null
          details?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: [
          { foreignKeyName: 'audit_logs_user_id_fkey'; columns: ['user_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ]
      }
      // ============================================
      // TAGS & CUSTOM FIELDS
      // ============================================
      tags: {
        Row: {
          id: string
          name: string
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color?: string | null
          created_at?: string
        }
        Update: {
          name?: string
          color?: string | null
        }
        Relationships: []
      }
      entity_tags: {
        Row: {
          id: string
          tag_id: string
          entity_id: string
          entity_type: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT'
          created_at: string
        }
        Insert: {
          id?: string
          tag_id: string
          entity_id: string
          entity_type: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT'
          created_at?: string
        }
        Update: {
          tag_id?: string
          entity_id?: string
          entity_type?: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT'
        }
        Relationships: [
          { foreignKeyName: 'entity_tags_tag_id_fkey'; columns: ['tag_id']; referencedRelation: 'tags'; referencedColumns: ['id'] }
        ]
      }
      custom_fields: {
        Row: {
          id: string
          name: string
          label: string
          type: 'TEXT' | 'NUMBER' | 'DATE' | 'DATETIME' | 'BOOLEAN' | 'PICKLIST' | 'MULTI_PICKLIST' | 'URL' | 'EMAIL' | 'PHONE' | 'CURRENCY' | 'PERCENT'
          entity_type: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT'
          is_required: boolean
          default_value: string | null
          picklist_values: string[] | null
          order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          label: string
          type: 'TEXT' | 'NUMBER' | 'DATE' | 'DATETIME' | 'BOOLEAN' | 'PICKLIST' | 'MULTI_PICKLIST' | 'URL' | 'EMAIL' | 'PHONE' | 'CURRENCY' | 'PERCENT'
          entity_type: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT'
          is_required?: boolean
          default_value?: string | null
          picklist_values?: string[] | null
          order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          label?: string
          type?: 'TEXT' | 'NUMBER' | 'DATE' | 'DATETIME' | 'BOOLEAN' | 'PICKLIST' | 'MULTI_PICKLIST' | 'URL' | 'EMAIL' | 'PHONE' | 'CURRENCY' | 'PERCENT'
          entity_type?: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT'
          is_required?: boolean
          default_value?: string | null
          picklist_values?: string[] | null
          order?: number
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      custom_field_values: {
        Row: {
          id: string
          custom_field_id: string
          entity_id: string
          value: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          custom_field_id: string
          entity_id: string
          value: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          custom_field_id?: string
          entity_id?: string
          value?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'custom_field_values_custom_field_id_fkey'; columns: ['custom_field_id']; referencedRelation: 'custom_fields'; referencedColumns: ['id'] }
        ]
      }
      // ============================================
      // CURRENCY SETTINGS
      // ============================================
      currency_settings: {
        Row: {
          id: string
          code: 'USD' | 'EUR' | 'GBP' | 'INR' | 'AUD' | 'CAD' | 'JPY' | 'CNY'
          name: string
          symbol: string
          exchange_rate: number
          is_default: boolean
          is_active: boolean
        }
        Insert: {
          id?: string
          code: 'USD' | 'EUR' | 'GBP' | 'INR' | 'AUD' | 'CAD' | 'JPY' | 'CNY'
          name: string
          symbol: string
          exchange_rate: number
          is_default?: boolean
          is_active?: boolean
        }
        Update: {
          code?: 'USD' | 'EUR' | 'GBP' | 'INR' | 'AUD' | 'CAD' | 'JPY' | 'CNY'
          name?: string
          symbol?: string
          exchange_rate?: number
          is_default?: boolean
          is_active?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'ADMIN' | 'MANAGER' | 'SALES' | 'SUPPORT'
      team_member_role: 'LEADER' | 'MEMBER'
      lead_status: 'NEW' | 'CONTACTED' | 'WORKING' | 'NURTURING' | 'QUALIFIED' | 'UNQUALIFIED'
      lead_rating: 'HOT' | 'WARM' | 'COLD'
      account_type: 'CUSTOMER' | 'PROSPECT' | 'PARTNER' | 'VENDOR' | 'COMPETITOR' | 'OTHER'
      opportunity_stage: 'NEW' | 'QUALIFICATION' | 'NEEDS_ANALYSIS' | 'VALUE_PROPOSITION' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST'
      opportunity_type: 'NEW_BUSINESS' | 'EXISTING_BUSINESS' | 'RENEWAL' | 'UPSELL'
      quote_status: 'DRAFT' | 'NEEDS_REVIEW' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'PRESENTED' | 'ACCEPTED' | 'DENIED'
      contract_status: 'DRAFT' | 'IN_APPROVAL' | 'ACTIVATED' | 'TERMINATED' | 'EXPIRED'
      campaign_status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ABORTED'
      campaign_type: 'EMAIL' | 'WEBINAR' | 'CONFERENCE' | 'ADVERTISEMENT' | 'SOCIAL_MEDIA' | 'REFERRAL' | 'OTHER'
      campaign_member_status: 'SENT' | 'RESPONDED' | 'CONVERTED'
      task_status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'WAITING' | 'DEFERRED'
      task_priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
      case_status: 'NEW' | 'OPEN' | 'IN_PROGRESS' | 'ESCALATED' | 'ON_HOLD' | 'CLOSED' | 'RESOLVED'
      case_priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      case_type: 'QUESTION' | 'PROBLEM' | 'FEATURE_REQUEST' | 'BUG' | 'OTHER'
      case_origin: 'PHONE' | 'EMAIL' | 'WEB' | 'CHAT' | 'SOCIAL_MEDIA'
      email_template_type: 'TEXT' | 'HTML' | 'CUSTOM'
      email_status: 'DRAFT' | 'SENT' | 'FAILED' | 'BOUNCED'
      activity_type: 'CALL' | 'EMAIL' | 'MEETING' | 'TASK_COMPLETED'
      call_result: 'REACHED' | 'LEFT_VOICEMAIL' | 'NO_ANSWER' | 'BUSY' | 'WRONG_NUMBER'
      audit_action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'EXPORT' | 'LOGIN' | 'LOGOUT'
      custom_field_type: 'TEXT' | 'NUMBER' | 'DATE' | 'DATETIME' | 'BOOLEAN' | 'PICKLIST' | 'MULTI_PICKLIST' | 'URL' | 'EMAIL' | 'PHONE' | 'CURRENCY' | 'PERCENT'
      entity_type: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT'
      currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'AUD' | 'CAD' | 'JPY' | 'CNY'
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
