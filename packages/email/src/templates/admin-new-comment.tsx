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

interface AdminNewCommentEmailProps {
    recipientName: string
    commenterName: string
    applicationId: number
    adminUrl: string
}

export function AdminNewCommentEmail({
    recipientName,
    commenterName,
    applicationId,
    adminUrl,
}: AdminNewCommentEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>{`New comment on adoption application #${applicationId}`}</Preview>
            <Body style={body}>
                <Container style={container}>
                    <Text style={heading}>New Comment</Text>
                    <Text style={text}>Hi {recipientName},</Text>
                    <Text style={text}>
                        {commenterName} added a comment on adoption application #{applicationId}.
                    </Text>
                    <Section style={buttonContainer}>
                        <Button style={button} href={adminUrl}>
                            View Application
                        </Button>
                    </Section>
                    <Hr style={hr} />
                    <Text style={footer}>
                        You received this email because you are assigned to this application.
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
