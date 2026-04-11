import type { Metadata } from "next"
import { Bebas_Neue, Lora, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { ConditionalHeader } from "./_components/conditional-header"
import { ConditionalFooter } from "./_components/conditional-footer"
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

export const metadata: Metadata = {
    title: "GPA‑MN | Greyhound Pets of America - Minnesota",
    description:
        "Greyhound Pets of America - Minnesota Chapter. Adopting retired racing greyhounds to loving homes since 1989.",
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
            </body>
        </html>
    )
}
