import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface ContactFormEmailProps {
    name: string;
    email: string;
    message: string;
}

export const ContactFormEmail = ({
    name,
    email,
    message,
}: ContactFormEmailProps) => (
    <Html>
        <Head />
        <Preview>New Lead from Kache Digital: {name}</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={header}>
                    <Heading style={h1}>Kache Digital</Heading>
                    <Text style={category}>High Signal Lead</Text>
                </Section>
                <Section style={section}>
                    <Text style={text}>
                        <strong>Name:</strong> {name}
                    </Text>
                    <Text style={text}>
                        <strong>Email:</strong> {email}
                    </Text>
                    <Hr style={hr} />
                    <Text style={label}>Inquiry Details:</Text>
                    <Text style={messageText}>{message}</Text>
                </Section>
                <Section style={footer}>
                    <Text style={footerText}>
                        © {new Date().getFullYear()} Kache Digital HQ. All rights reserved.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default ContactFormEmail;

const main = {
    backgroundColor: "#0a0a0a",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "40px 20px",
    width: "600px",
    backgroundColor: "#0a0a0a",
};

const header = {
    padding: "32px 0",
};

const h1 = {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "900",
    letterSpacing: "-0.05em",
    textTransform: "uppercase" as const,
    margin: "0",
    textAlign: "center" as const,
};

const category = {
    color: "#00FFC2",
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase" as const,
    letterSpacing: "0.2em",
    textAlign: "center" as const,
    margin: "8px 0 0 0",
};

const section = {
    padding: "32px",
    backgroundColor: "#121212",
    borderRadius: "12px",
    border: "1px solid #1e1e1e",
};

const text = {
    color: "#d4d4d4",
    fontSize: "14px",
    lineHeight: "24px",
    margin: "4px 0",
};

const label = {
    color: "#737373",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    margin: "24px 0 8px 0",
};

const messageText = {
    color: "#ffffff",
    fontSize: "16px",
    lineHeight: "28px",
    backgroundColor: "#1a1a1a",
    padding: "20px",
    borderRadius: "8px",
    margin: "0",
};

const hr = {
    borderColor: "#1e1e1e",
    margin: "32px 0",
};

const footer = {
    padding: "32px 0",
    textAlign: "center" as const,
};

const footerText = {
    color: "#737373",
    fontSize: "12px",
};
