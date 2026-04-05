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

interface AdminNewSubmissionEmailProps {
    applicantName: string
    applicationId: number
    adminUrl: string
}

export function AdminNewSubmissionEmail({
    applicantName,
    applicationId,
    adminUrl,
}: AdminNewSubmissionEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>New adoption application from {applicantName}</Preview>
            <Body style={body}>
                <Container style={container}>
                    <Text style={heading}>New Adoption Application</Text>
                    <Text style={text}>
                        A new adoption application has been submitted and is ready for review.
                    </Text>
                    <Text style={text}>
                        <strong>Applicant:</strong> {applicantName}
                        <br />
                        <strong>Application ID:</strong> {applicationId}
                    </Text>
                    <Section style={buttonContainer}>
                        <Button style={button} href={adminUrl}>
                            Review Application
                        </Button>
                    </Section>
                    <Hr style={hr} />
                    <Text style={footer}>
                        You received this email because you are an adoption coordinator at GPA-MN.
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
