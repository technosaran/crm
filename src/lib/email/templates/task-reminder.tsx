import * as React from 'react';
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';

interface TaskReminderEmailProps {
    userName: string;
    taskTitle: string;
    dueDate: string;
}

export const TaskReminderEmail = ({
    userName,
    taskTitle,
    dueDate,
}: TaskReminderEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Task Reminder: {taskTitle}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Task Reminder</Heading>
                    <Text style={text}>
                        Hi {userName},
                    </Text>
                    <Text style={text}>
                        This is a reminder that you have a task due soon:
                    </Text>
                    <Section style={detailsContainer}>
                        <Text style={detailText}><strong>Task:</strong> {taskTitle}</Text>
                        <Text style={detailText}><strong>Due Date:</strong> {dueDate}</Text>
                    </Section>
                    <Section style={buttonContainer}>
                        <Button style={button} href="https://technosarancrm.vercel.app/tasks">
                            Manage Tasks
                        </Button>
                    </Section>
                    <Hr style={hr} />
                    <Text style={footer}>
                        Zenith CRM Reminder Service
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '40px 20px',
    borderRadius: '8px',
};

const h1 = {
    color: '#D97706',
    fontSize: '24px',
    fontWeight: '600',
    textAlign: 'center' as const,
    margin: '30px 0',
};

const text = {
    color: '#444',
    fontSize: '16px',
    lineHeight: '24px',
};

const detailsContainer = {
    background: '#FFFBEB',
    padding: '20px',
    borderRadius: '4px',
    margin: '20px 0',
    border: '1px solid #FEF3C7',
};

const detailText = {
    margin: '5px 0',
    color: '#92400E',
    fontSize: '15px',
};

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '30px 0',
};

const button = {
    backgroundColor: '#F59E0B',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
};

const hr = {
    borderColor: '#e5e7eb',
    margin: '30px 0',
};

const footer = {
    color: '#9ca3af',
    fontSize: '12px',
    textAlign: 'center' as const,
};

export default TaskReminderEmail;
