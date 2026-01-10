import * as React from 'react';
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';

interface WelcomeEmailProps {
    userName: string;
}

export const WelcomeEmail = ({ userName }: WelcomeEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Welcome to Zenith CRM!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Welcome to Zenith CRM, {userName}!</Heading>
                    <Text style={text}>
                        We're thrilled to have you join our community. Zenith CRM is designed to help you manage your business relationships more effectively and grow your sales.
                    </Text>
                    <Section style={buttonContainer}>
                        <Button style={button} href="https://technosarancrm.vercel.app/dashboard">
                            Get Started
                        </Button>
                    </Section>
                    <Text style={text}>
                        If you have any questions, feel free to reply to this email or visit our help center.
                    </Text>
                    <Hr style={hr} />
                    <Text style={footer}>
                        Zenith CRM, 123 Tech Avenue, Silicon Valley, CA.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
};

const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    padding: '0 48px',
};

const text = {
    color: '#555',
    fontSize: '16px',
    lineHeight: '26px',
    padding: '0 48px',
};

const buttonContainer = {
    padding: '27px 48px',
};

const button = {
    backgroundColor: '#0070f3',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '100%',
    padding: '12px 0'
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px',
    padding: '0 48px',
};

export default WelcomeEmail;
