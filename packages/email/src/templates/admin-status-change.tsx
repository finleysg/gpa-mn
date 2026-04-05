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

interface AdminStatusChangeEmailProps {
    firstName: string
    newStatus: string
    applicationUrl: string
}

const STATUS_DESCRIPTIONS: Record<string, string> = {
    in_review: "Your application is now being reviewed by our adoption team.",
    approved:
        "Congratulations! Your application has been approved. We will be in touch about next steps.",
    adopted: "Congratulations on your new greyhound! Welcome to the GPA-MN family.",
    denied: "After careful review, we are unable to approve your application at this time. Please contact us if you have questions.",
    on_hold: "Your application has been placed on hold. We will contact you with more information.",
}

export function AdminStatusChangeEmail({
    firstName,
    newStatus,
    applicationUrl,
}: AdminStatusChangeEmailProps) {
    const description =
        STATUS_DESCRIPTIONS[newStatus] ??
        `Your application status has been updated to: ${newStatus}.`

    return (
        <Html>
            <Head />
            <Preview>Your GPA-MN adoption application status has been updated</Preview>
            <Body style={body}>
                <Container style={container}>
                    <Text style={heading}>Application Status Update</Text>
                    <Text style={text}>Hi {firstName},</Text>
                    <Text style={text}>{description}</Text>
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
