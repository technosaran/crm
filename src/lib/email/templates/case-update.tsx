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

interface CaseUpdateEmailProps {
    userName: string;
    caseNumber: string;
    previousStatus: string;
    newStatus: string;
}

export const CaseUpdateEmail = ({
    userName,
    caseNumber,
    previousStatus,
    newStatus,
}: CaseUpdateEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Update on your case: {caseNumber}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Case Status Updated</Heading>
                    <Text style={text}>
                        Hello {userName},
                    </Text>
                    <Text style={text}>
                        The status of your case <strong>#{caseNumber}</strong> has been updated.
                    </Text>
                    <Section style={detailsContainer}>
                        <Text style={detailText}><strong>Previous Status:</strong> {previousStatus}</Text>
                        <Text style={detailText}><strong>New Status:</strong> {newStatus}</Text>
                    </Section>
                    <Section style={buttonContainer}>
                        <Button style={button} href={`https://technosarancrm.vercel.app/cases`}>
                            View Case History
                        </Button>
                    </Section>
                    <Hr style={hr} />
                    <Text style={footer}>
                        Zenith CRM Support Team
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
    color: '#2563EB',
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
    background: '#EFF6FF',
    padding: '20px',
    borderRadius: '4px',
    margin: '20px 0',
    border: '1px solid #DBEAFE',
};

const detailText = {
    margin: '5px 0',
    color: '#1E40AF',
    fontSize: '15px',
};

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '30px 0',
};

const button = {
    backgroundColor: '#3B82F6',
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

export default CaseUpdateEmail;
