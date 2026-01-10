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

interface LeadAssignedEmailProps {
    userName: string;
    leadName: string;
    company?: string;
}

export const LeadAssignedEmail = ({
    userName,
    leadName,
    company,
}: LeadAssignedEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>New Lead Assigned: {leadName}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>New Lead Assigned</Heading>
                    <Text style={text}>
                        Hello {userName},
                    </Text>
                    <Text style={text}>
                        A new lead has been assigned to you. Here are the details:
                    </Text>
                    <Section style={detailsContainer}>
                        <Text style={detailText}><strong>Name:</strong> {leadName}</Text>
                        {company && <Text style={detailText}><strong>Company:</strong> {company}</Text>}
                    </Section>
                    <Section style={buttonContainer}>
                        <Button style={button} href="https://technosarancrm.vercel.app/leads">
                            View Lead Details
                        </Button>
                    </Section>
                    <Hr style={hr} />
                    <Text style={footer}>
                        Zenith CRM Notification Service
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
    color: '#1a1a1a',
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
    background: '#f9fafb',
    padding: '20px',
    borderRadius: '4px',
    margin: '20px 0',
};

const detailText = {
    margin: '0',
    color: '#555',
    fontSize: '15px',
};

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '30px 0',
};

const button = {
    backgroundColor: '#4F46E5',
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

export default LeadAssignedEmail;
