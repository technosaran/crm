# Database Setup Guide

This directory contains the database schema and setup scripts for the Zenith CRM application.

## Prerequisites

- A Supabase project (sign up at https://supabase.com)
- Access to the Supabase SQL Editor

## Setup Instructions

### 1. Create Supabase Project

1. Go to https://supabase.com and create a new project
2. Wait for the project to be provisioned (this may take a few minutes)

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env.local` in the project root
2. Update the following variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your project URL from Supabase dashboard
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anon/public key from Supabase dashboard

### 3. Run Database Schema

1. Open the Supabase SQL Editor (in your project dashboard)
2. Copy the contents of `schema.sql`
3. Paste and execute the SQL

This will create:
- All necessary tables (user_profiles, leads, accounts, contacts, opportunities, cases, tasks, audit_logs)
- Row Level Security (RLS) policies for data protection
- Indexes for performance optimization
- Triggers for automatic timestamp updates
- Functions for auto-generating case numbers

### 4. Create Initial Admin User

After setting up authentication, you can manually update a user's role in the SQL editor:

```sql
-- First, sign up a user through your app
-- Then, run this to make them an admin:

UPDATE public.user_profiles
SET role = 'SUPER_ADMIN'
WHERE email = 'your-email@example.com';
```

## Security Features

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- **User Profiles**: Users can view/update their own profile, admins can view all
- **Leads**: Users see their own leads, managers/admins see all
- **Opportunities**: Users see their own opportunities, managers/admins see all
- **Accounts/Contacts**: All authenticated users can view, specific roles can modify
- **Cases**: Users see assigned cases, managers/admins see all
- **Tasks**: Users see their assigned tasks
- **Audit Logs**: Only admins can view

### Data Protection

- All user data is protected by RLS policies
- Foreign key constraints ensure referential integrity
- Check constraints validate data at the database level
- Timestamps are automatically managed

## Schema Overview

### Core Tables

- `user_profiles`: Extended user information and roles
- `leads`: Potential customers
- `accounts`: Companies/organizations
- `contacts`: Individuals within accounts
- `opportunities`: Sales opportunities
- `cases`: Support cases
- `tasks`: User tasks and to-dos
- `audit_logs`: System audit trail

### Key Features

- **Automatic Timestamps**: All tables have `created_at` and `updated_at` fields
- **Soft Relationships**: Flexible entity relationships via `entity_id` and `entity_type`
- **Cascading Deletes**: Related records are properly handled
- **Performance Indexes**: Optimized for common queries

## Backup and Restore

Supabase provides automatic backups. To manually backup:

```bash
# From Supabase dashboard
# Settings > Database > Database backups
```

## Migrations

For future schema changes, create migration files in this directory:

```
database/
  schema.sql          # Initial schema
  migrations/
    001_add_feature.sql
    002_update_table.sql
```

## Troubleshooting

### RLS Policies Not Working

- Ensure you're authenticated when making queries
- Check that the user has a profile in `user_profiles` table
- Verify the user's role is set correctly

### Foreign Key Errors

- Ensure referenced records exist before creating relationships
- Check that user_profiles are created for all auth.users

### Performance Issues

- Ensure indexes are created (run the index creation part of schema.sql)
- Consider adding additional indexes for frequently queried columns
- Use `EXPLAIN ANALYZE` to debug slow queries

## Support

For issues related to:
- Supabase: https://supabase.com/docs
- CRM Application: Open an issue in the repository
