import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from "@react-email/components"

interface SubmissionConfirmationEmailProps {
    firstName: string
    applicationUrl: string
}

export function SubmissionConfirmationEmail({
    firstName,
    applicationUrl,
}: SubmissionConfirmationEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Your GPA-MN adoption application has been received</Preview>
            <Body style={body}>
                <Container style={container}>
                    <Text style={heading}>Application Received</Text>
                    <Text style={text}>Hi {firstName},</Text>
                    <Text style={text}>
                        Thank you for submitting your adoption application to GPA-MN! We have
                        received your application and it is now under review.
                    </Text>
                    <Text style={text}>Here's what to expect next:</Text>
                    <Text style={text}>
                        • An adoption coordinator will review your application
                        <br />
                        • You may be contacted for a phone interview
                        <br />
                        • A home visit may be scheduled
                        <br />• We will notify you of any status updates by email
                    </Text>
                    <Section style={buttonContainer}>
                        <Button style={button} href={applicationUrl}>
                            View Your Application
                        </Button>
                    </Section>
                    <Hr style={hr} />
                    <Text style={footer}>
                        If you have questions, please contact us at adopt@gpa-mn.org.
                    </Text>
                </Container>
            </Body>
        </Html>
    )
}

const body = {
    backgroundColor: "#f6f9fc",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "40px 20px",
    maxWidth: "480px",
    borderRadius: "8px",
}

const heading = {
    fontSize: "24px",
    fontWeight: "bold" as const,
    color: "#18181b",
    marginBottom: "16px",
}

const text = {
    fontSize: "16px",
    lineHeight: "26px",
    color: "#3f3f46",
}

const buttonContainer = {
    textAlign: "center" as const,
    margin: "24px 0",
}

const button = {
    backgroundColor: "#18181b",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "16px",
    textDecoration: "none",
    textAlign: "center" as const,
    padding: "12px 24px",
    display: "inline-block",
}

const hr = {
    borderColor: "#e4e4e7",
    margin: "24px 0",
}

const footer = {
    fontSize: "14px",
    color: "#71717a",
}
