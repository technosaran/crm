import { Resend } from 'resend';
import { render } from '@react-email/render';
import { WelcomeEmail } from './templates/welcome';
import { LeadAssignedEmail } from './templates/lead-assigned';
import { TaskReminderEmail } from './templates/task-reminder';
import { CaseUpdateEmail } from './templates/case-update';
import { OpportunityUpdateEmail } from './templates/opportunity-update';
import React from 'react';

/**
 * Service to handle all email communications in Zenith CRM
 */
export class EmailService {
    private static _resend: Resend | null = null;
    private static fromEmail = 'Zenith CRM <notifications@technosaran.com>';

    private static get resend() {
        if (!this._resend) {
            this._resend = new Resend(process.env.RESEND_API_KEY || 'no-key-during-build');
        }
        return this._resend;
    }

    /**
     * Send a welcome email to a new user
     */
    static async sendWelcomeEmail(to: string, userName: string) {
        return this.sendEmail({
            to,
            subject: 'Welcome to Zenith CRM!',
            template: React.createElement(WelcomeEmail, { userName }),
        });
    }

    /**
     * Notify a user about a new lead assignment
     */
    static async sendLeadAssignedEmail(to: string, userName: string, leadName: string, company?: string) {
        return this.sendEmail({
            to,
            subject: `New Lead Assigned: ${leadName}`,
            template: React.createElement(LeadAssignedEmail, { userName, leadName, company }),
        });
    }

    /**
     * Send a task reminder
     */
    static async sendTaskReminderEmail(to: string, userName: string, taskTitle: string, dueDate: string) {
        return this.sendEmail({
            to,
            subject: `Reminder: Task "${taskTitle}" is due soon`,
            template: React.createElement(TaskReminderEmail, { userName, taskTitle, dueDate }),
        });
    }

    /**
     * Notify about case status update
     */
    static async sendCaseUpdateEmail(to: string, userName: string, caseNumber: string, previousStatus: string, newStatus: string) {
        return this.sendEmail({
            to,
            subject: `Case #${caseNumber} Status Updated`,
            template: React.createElement(CaseUpdateEmail, { userName, caseNumber, previousStatus, newStatus }),
        });
    }

    /**
     * Notify about opportunity stage change
     */
    static async sendOpportunityUpdateEmail(to: string, userName: string, opportunityName: string, previousStage: string, newStage: string, amount?: string) {
        return this.sendEmail({
            to,
            subject: `Opportunity Update: ${opportunityName}`,
            template: React.createElement(OpportunityUpdateEmail, { userName, opportunityName, previousStage, newStage, amount }),
        });
    }

    /**
     * Generic internal method to send email via Resend
     */
    private static async sendEmail({ to, subject, template }: { to: string | string[], subject: string, template: React.ReactElement }) {
        try {
            if (!process.env.RESEND_API_KEY) {
                console.warn('RESEND_API_KEY is not set. Skipping email send.');
                return { success: false, error: 'API key missing' };
            }

            // Convert React component to HTML string using the new @react-email/render API
            const html = await render(template);

            const { data, error } = await this.resend.emails.send({
                from: this.fromEmail,
                to: Array.isArray(to) ? to : [to],
                subject,
                html,
            });

            if (error) {
                console.error('Failed to send email:', error);
                return { success: false, error };
            }

            return { success: true, data };
        } catch (error) {
            console.error('Exception while sending email:', error);
            return { success: false, error };
        }
    }
}

export const emailService = EmailService;
