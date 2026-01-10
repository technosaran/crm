import { z } from 'zod';

export const LeadSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    company_name: z.string().min(1, 'Company name is required'),
    phone: z.string().optional().nullable(),
    status: z.enum(['New', 'Working', 'Nurturing', 'Qualified', 'Unqualified']).default('New'),
    source: z.string().optional().default('Web'),
    tags: z.array(z.string()).optional().nullable(),
});

export const OpportunitySchema = z.object({
    title: z.string().min(1, 'Title is required'),
    amount: z.number().nonnegative('Amount must be positive'),
    stage: z.enum(['NEW', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST']),
    account_id: z.string().uuid().optional().nullable(),
    expected_close_date: z.string().optional(),
});

export const TaskSchema = z.object({
    subject: z.string().min(1, 'Subject is required'),
    status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'WAITING', 'DEFERRED']),
    priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'CRITICAL']),
    due_date: z.string().optional().nullable(),
    assigned_to_id: z.string().uuid().optional().nullable(),
});
