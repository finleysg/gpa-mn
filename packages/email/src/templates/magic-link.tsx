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

interface MagicLinkEmailProps {
    firstName: string
    url: string
}

export function MagicLinkEmail({ firstName, url }: MagicLinkEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Your GPA-MN adoption application link</Preview>
            <Body style={body}>
                <Container style={container}>
                    <Text style={heading}>Your Adoption Application</Text>
                    <Text style={text}>Hi {firstName},</Text>
                    <Text style={text}>
                        Use the button below to access your GPA-MN greyhound adoption application.
                        You can save your progress and return at any time using this link.
                    </Text>
                    <Section style={buttonContainer}>
                        <Button style={button} href={url}>
                            Open Application
                        </Button>
                    </Section>
                    <Hr style={hr} />
                    <Text style={footer}>
                        This link is unique to your application. Please do not share it with others.
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
