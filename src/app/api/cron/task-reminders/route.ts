import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { emailService } from '@/lib/email/emailService';

export const dynamic = 'force-dynamic';

/**
 * Cron job to send daily task reminders.
 * Should be triggered once a day.
 */
export async function GET(request: Request) {
    try {
        // Authenticate the cron request if CRON_SECRET is set
        const authHeader = request.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response('Unauthorized', { status: 401 });
        }

        const supabase = createClient();

        // Define the window for "tasks due tomorrow"
        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Fetch tasks that are not completed and are due within the next 24 hours
        const { data: tasks, error } = await supabase
            .from('tasks')
            .select(`
        id,
        subject,
        due_date,
        status,
        assigned_to:user_profiles!assigned_to_id (
          email,
          full_name
        )
      `)
            .neq('status', 'COMPLETED')
            .lte('due_date', tomorrow.toISOString())
            .gte('due_date', now.toISOString());

        if (error) {
            console.error('[Cron Error] Failed to fetch tasks:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!tasks || tasks.length === 0) {
            return NextResponse.json({ message: 'No tasks due soon. Skipping notifications.' });
        }

        // Send emails for each task
        const results = await Promise.allSettled(
            tasks.map(async (task: any) => {
                if (task.assigned_to?.email) {
                    return await emailService.sendTaskReminderEmail(
                        task.assigned_to.email,
                        task.assigned_to.full_name || 'Valued User',
                        task.subject,
                        new Date(task.due_date).toLocaleDateString()
                    );
                }
                return { success: false, error: 'No email found for assignee' };
            })
        );

        return NextResponse.json({
            status: 'success',
            tasks_processed: tasks.length,
            notifications_sent: results.filter(r => r.status === 'fulfilled').length,
            details: results
        });

    } catch (error: any) {
        console.error('[Cron Exception]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
