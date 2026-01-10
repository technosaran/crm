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

interface OpportunityUpdateEmailProps {
    userName: string;
    opportunityName: string;
    previousStage: string;
    newStage: string;
    amount?: string;
}

export const OpportunityUpdateEmail = ({
    userName,
    opportunityName,
    previousStage,
    newStage,
    amount,
}: OpportunityUpdateEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Opportunity Stage Change: {opportunityName}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Opportunity Stage Updated</Heading>
                    <Text style={text}>
                        Hello {userName},
                    </Text>
                    <Text style={text}>
                        The stage for opportunity <strong>{opportunityName}</strong> has been updated.
                    </Text>
                    <Section style={detailsContainer}>
                        <Text style={detailText}><strong>Previous Stage:</strong> {previousStage}</Text>
                        <Text style={detailText}><strong>New Stage:</strong> {newStage}</Text>
                        {amount && <Text style={detailText}><strong>Amount:</strong> {amount}</Text>}
                    </Section>
                    <Section style={buttonContainer}>
                        <Button style={button} href={`https://technosarancrm.vercel.app/opportunities`}>
                            View Pipeline
                        </Button>
                    </Section>
                    <Hr style={hr} />
                    <Text style={footer}>
                        Zenith CRM Sales Intelligence
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
    color: '#059669',
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
    background: '#ECFDF5',
    padding: '20px',
    borderRadius: '4px',
    margin: '20px 0',
    border: '1px solid #D1FAE5',
};

const detailText = {
    margin: '5px 0',
    color: '#065F46',
    fontSize: '15px',
};

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '30px 0',
};

const button = {
    backgroundColor: '#10B981',
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

export default OpportunityUpdateEmail;
