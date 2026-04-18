import type { Metadata } from "next"
import { Bebas_Neue, Lora, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { ConditionalHeader } from "./_components/conditional-header"
import { ConditionalFooter } from "./_components/conditional-footer"
import { JsonLd } from "./_components/json-ld"
import "./globals.css"

const bebasNeue = Bebas_Neue({
    variable: "--font-heading",
    weight: "400",
    subsets: ["latin"],
})

const lora = Lora({
    variable: "--font-body",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:6000"
const siteName = "GPA-MN"
const defaultTitle = "GPA-MN | Greyhound Pets of America - Minnesota"
const defaultDescription =
    "Greyhound Pets of America - Minnesota Chapter. Adopting retired racing greyhounds to loving homes since 1989."

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: defaultTitle,
        template: "%s | GPA-MN",
    },
    description: defaultDescription,
    applicationName: siteName,
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        siteName,
        title: defaultTitle,
        description: defaultDescription,
        url: siteUrl,
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: defaultTitle,
        description: defaultDescription,
    },
}

const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "Greyhound Pets of America - Minnesota",
    alternateName: "GPA-MN",
    url: siteUrl,
    logo: `${siteUrl}/images/CircularSticker.png`,
    image: `${siteUrl}/opengraph-image.png`,
    description: defaultDescription,
    foundingDate: "1989",
    areaServed: {
        "@type": "AdministrativeArea",
        name: "Minnesota",
    },
    contactPoint: [
        {
            "@type": "ContactPoint",
            telephone: "+1-763-785-4000",
            contactType: "customer service",
            email: "info@gpa-mn.org",
            areaServed: "US-MN",
            availableLanguage: "English",
        },
        {
            "@type": "ContactPoint",
            email: "fostering@gpa-mn.org",
            contactType: "fostering inquiries",
            areaServed: "US-MN",
            availableLanguage: "English",
        },
    ],
    sameAs: [
        "https://www.facebook.com/gpamn/",
        "https://www.instagram.com/gpaminnesota/",
        "https://www.tiktok.com/@gpa.minnesota",
        "https://bsky.app/profile/greyhoundpetsmn.bsky.social",
    ],
}

const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    inLanguage: "en-US",
    publisher: { "@id": `${siteUrl}/#organization` },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${bebasNeue.variable} ${lora.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <ConditionalHeader />
                    <main>{children}</main>
                    <ConditionalFooter />
                </ThemeProvider>
                <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
            </body>
        </html>
    )
}
