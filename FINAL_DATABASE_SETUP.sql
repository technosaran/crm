-- ========================================================
-- ZENITH CRM MASTER DATABASE SETUP (IDEMPOTENT)
-- ========================================================
-- This script sets up the entire Zenith CRM database schema.
-- It is designed to be safe to run multiple times.

-- 1. EXTENSIONS & CORE SETUP
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CORE TABLES
-- ============================================

-- USER PROFILES
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'SALES' CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SALES', 'SUPPORT', 'GUEST')),
    department TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ACCOUNTS
CREATE TABLE IF NOT EXISTS public.accounts (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'PROSPECT' CHECK (type IN ('CUSTOMER', 'PROSPECT', 'PARTNER', 'VENDOR', 'COMPETITOR', 'OTHER')),
    industry TEXT,
    website TEXT,
    phone TEXT,
    email TEXT,
    billing_street TEXT,
    billing_city TEXT,
    billing_state TEXT,
    billing_postal_code TEXT,
    billing_country TEXT,
    shipping_street TEXT,
    shipping_city TEXT,
    shipping_state TEXT,
    shipping_postal_code TEXT,
    shipping_country TEXT,
    annual_revenue NUMERIC(15, 2),
    number_of_employees INTEGER,
    description TEXT,
    owner_id UUID REFERENCES public.user_profiles(id),
    parent_account_id BIGINT REFERENCES public.accounts(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.user_profiles(id)
);

-- CONTACTS
CREATE TABLE IF NOT EXISTS public.contacts (
    id BIGSERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    mobile TEXT,
    title TEXT,
    department TEXT,
    account_id BIGINT REFERENCES public.accounts(id) ON DELETE CASCADE,
    reports_to_id BIGINT REFERENCES public.contacts(id),
    mailing_street TEXT,
    mailing_city TEXT,
    mailing_state TEXT,
    mailing_postal_code TEXT,
    mailing_country TEXT,
    is_primary BOOLEAN DEFAULT false,
    do_not_call BOOLEAN DEFAULT false,
    do_not_email BOOLEAN DEFAULT false,
    owner_id UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.user_profiles(id)
);

-- LEADS
CREATE TABLE IF NOT EXISTS public.leads (
    id BIGSERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Working', 'Nurturing', 'Qualified', 'Unqualified')),
    rating TEXT CHECK (rating IN ('Hot', 'Warm', 'Cold')),
    source TEXT DEFAULT 'Web',
    annual_revenue NUMERIC(15, 2),
    number_of_employees INTEGER,
    owner_id UUID REFERENCES public.user_profiles(id),
    converted_at TIMESTAMPTZ,
    converted_to_contact_id BIGINT,
    converted_to_account_id BIGINT,
    converted_to_opportunity_id BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.user_profiles(id)
);

-- OPPORTUNITIES
CREATE TABLE IF NOT EXISTS public.opportunities (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    account_id BIGINT REFERENCES public.accounts(id) ON DELETE CASCADE,
    contact_id BIGINT REFERENCES public.contacts(id),
    amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    stage TEXT DEFAULT 'NEW' CHECK (stage IN ('NEW', 'QUALIFICATION', 'NEEDS_ANALYSIS', 'VALUE_PROPOSITION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST')),
    probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
    expected_close_date DATE,
    closed_at TIMESTAMPTZ,
    next_step TEXT,
    lead_source TEXT,
    type TEXT CHECK (type IN ('NEW_BUSINESS', 'EXISTING_BUSINESS', 'RENEWAL', 'UPSELL')),
    owner_id UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.user_profiles(id)
);

-- CASES
CREATE TABLE IF NOT EXISTS public.cases (
    id BIGSERIAL PRIMARY KEY,
    case_number TEXT UNIQUE,
    subject TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'NEW' CHECK (status IN ('NEW', 'OPEN', 'IN_PROGRESS', 'ESCALATED', 'ON_HOLD', 'CLOSED', 'RESOLVED')),
    priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    type TEXT CHECK (type IN ('QUESTION', 'PROBLEM', 'FEATURE_REQUEST', 'BUG', 'OTHER')),
    origin TEXT CHECK (origin IN ('PHONE', 'EMAIL', 'WEB', 'CHAT', 'SOCIAL_MEDIA')),
    account_id BIGINT REFERENCES public.accounts(id),
    contact_id BIGINT REFERENCES public.contacts(id),
    owner_id UUID REFERENCES public.user_profiles(id),
    escalated_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    resolution TEXT,
    first_response_at TIMESTAMPTZ,
    sla_deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.user_profiles(id)
);

-- TASKS
CREATE TABLE IF NOT EXISTS public.tasks (
    id BIGSERIAL PRIMARY KEY,
    subject TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'WAITING', 'DEFERRED')),
    priority TEXT DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
    due_date TIMESTAMPTZ,
    reminder_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    entity_id BIGINT,
    entity_type TEXT,
    assigned_to_id UUID REFERENCES public.user_profiles(id),
    owner_id UUID REFERENCES public.user_profiles(id),
    is_recurring BOOLEAN DEFAULT false,
    recurrence_rule TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    old_values JSONB,
    new_values JSONB,
    details TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- COMMENTS (Collaboration)
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    mentions JSONB DEFAULT '[]',
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MENTIONS
CREATE TABLE IF NOT EXISTS public.mentions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CUSTOM FIELDS
CREATE TABLE IF NOT EXISTS public.custom_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    label VARCHAR(100) NOT NULL,
    field_type VARCHAR(20) NOT NULL,
    options JSONB,
    is_required BOOLEAN DEFAULT FALSE,
    default_value TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CUSTOM FIELD VALUES
CREATE TABLE IF NOT EXISTS public.custom_field_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID REFERENCES public.custom_fields(id) ON DELETE CASCADE,
    entity_id TEXT NOT NULL,
    value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(field_id, entity_id)
);

-- 3. ROW LEVEL SECURITY (RLS) & POLICIES
-- ============================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_field_values ENABLE ROW LEVEL SECURITY;

-- IDEMPOTENT POLICY HELPERS
DO $$
BEGIN
    -- PROFILES
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
    CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
    
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
    CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
    
    DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
    CREATE POLICY "Admins can view all profiles" ON public.user_profiles FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ADMIN')));

    -- ACCOUNTS
    DROP POLICY IF EXISTS "Users can view accounts" ON public.accounts;
    CREATE POLICY "Users can view accounts" ON public.accounts FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_active = true));
    
    DROP POLICY IF EXISTS "Users can create accounts" ON public.accounts;
    CREATE POLICY "Users can create accounts" ON public.accounts FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SALES')));
    
    DROP POLICY IF EXISTS "Users can update accounts" ON public.accounts;
    CREATE POLICY "Users can update accounts" ON public.accounts FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SALES')));

    -- CONTACTS
    DROP POLICY IF EXISTS "Users can view contacts" ON public.contacts;
    CREATE POLICY "Users can view contacts" ON public.contacts FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_active = true));
    
    DROP POLICY IF EXISTS "Users can create contacts" ON public.contacts;
    CREATE POLICY "Users can create contacts" ON public.contacts FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SALES')));

    -- LEADS
    DROP POLICY IF EXISTS "Users can view their own leads" ON public.leads;
    CREATE POLICY "Users can view their own leads" ON public.leads FOR SELECT USING (owner_id = auth.uid() OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER')));
    
    DROP POLICY IF EXISTS "Users can insert leads" ON public.leads;
    CREATE POLICY "Users can insert leads" ON public.leads FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SALES')));
    
    DROP POLICY IF EXISTS "Users can update their own leads or admins can update all" ON public.leads;
    CREATE POLICY "Users can update their own leads or admins can update all" ON public.leads FOR UPDATE USING (owner_id = auth.uid() OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER')));

    DROP POLICY IF EXISTS "Only admins can delete leads" ON public.leads;
    CREATE POLICY "Only admins can delete leads" ON public.leads FOR DELETE USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ADMIN')));

    -- OPPORTUNITIES
    DROP POLICY IF EXISTS "Users can view their own opportunities" ON public.opportunities;
    CREATE POLICY "Users can view their own opportunities" ON public.opportunities FOR SELECT USING (owner_id = auth.uid() OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER')));
    
    DROP POLICY IF EXISTS "Users can create opportunities" ON public.opportunities;
    CREATE POLICY "Users can create opportunities" ON public.opportunities FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SALES')));

    -- AUDIT LOGS
    DROP POLICY IF EXISTS "Only admins can view audit logs" ON public.audit_logs;
    CREATE POLICY "Only admins can view audit logs" ON public.audit_logs FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ADMIN')));

    -- COLLABORATION (Comments & Mentions)
    DROP POLICY IF EXISTS "Users can view comments" ON public.comments;
    CREATE POLICY "Users can view comments" ON public.comments FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Users can create comments" ON public.comments;
    CREATE POLICY "Users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    DROP POLICY IF EXISTS "Users can edit own comments" ON public.comments;
    CREATE POLICY "Users can edit own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can view own mentions" ON public.mentions;
    CREATE POLICY "Users can view own mentions" ON public.mentions FOR SELECT USING (auth.uid() = user_id);

    -- CUSTOM FIELDS
    DROP POLICY IF EXISTS "Public read for custom fields" ON public.custom_fields;
    CREATE POLICY "Public read for custom fields" ON public.custom_fields FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Admins can manage custom fields" ON public.custom_fields;
    CREATE POLICY "Admins can manage custom fields" ON public.custom_fields FOR ALL USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')));

    DROP POLICY IF EXISTS "Users can read field values" ON public.custom_field_values;
    CREATE POLICY "Users can read field values" ON public.custom_field_values FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Users can manage field values" ON public.custom_field_values;
    CREATE POLICY "Users can manage field values" ON public.custom_field_values FOR ALL USING (true);

END $$;

-- 4. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_leads_owner_id ON public.leads(owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_accounts_owner_id ON public.accounts(owner_id);
CREATE INDEX IF NOT EXISTS idx_contacts_account_id ON public.contacts(account_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_owner_id ON public.opportunities(owner_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON public.opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to_id ON public.tasks(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_leads_search ON public.leads USING gin (to_tsvector('english', first_name || ' ' || last_name || ' ' || company));

-- 5. FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Helper to apply updated_at trigger automatically to public tables
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trigger_update_%I_updated_at ON %I', t, t);
        EXECUTE format('CREATE TRIGGER trigger_update_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column()', t, t);
    END LOOP;
END $$;

-- Function for automatic Audit Logging
CREATE OR REPLACE FUNCTION audit_log_trigger_handler()
RETURNS TRIGGER AS $$
DECLARE
    old_val JSONB := NULL;
    new_val JSONB := NULL;
    entity_id TEXT;
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        old_val := to_jsonb(OLD);
        new_val := to_jsonb(NEW);
        entity_id := (OLD.id)::TEXT;
    ELSIF (TG_OP = 'INSERT') THEN
        new_val := to_jsonb(NEW);
        entity_id := (NEW.id)::TEXT;
    ELSIF (TG_OP = 'DELETE') THEN
        old_val := to_jsonb(OLD);
        entity_id := (OLD.id)::TEXT;
    END IF;

    INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, old_values, new_values)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, entity_id, old_val, new_val);

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Case Number Generator
CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.case_number IS NULL THEN
        NEW.case_number := 'CASE-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('public.cases_id_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_case_number ON public.cases;
CREATE TRIGGER set_case_number BEFORE INSERT ON public.cases
    FOR EACH ROW EXECUTE FUNCTION generate_case_number();
