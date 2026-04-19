import Image from "next/image"
import type { Metadata } from "next"
import { Phone, Mail, MapPin } from "lucide-react"
import { PageHero } from "@/app/_components/page-hero"
import { SectionHeader } from "@/app/_components/section-header"
import { FadeIn } from "@/app/_components/fade-in"
import { NewsletterForm } from "@/app/_components/newsletter-form"
import { ContactForm } from "./_components/contact-form"

export const metadata: Metadata = {
    title: "Contact",
    description:
        "Get in touch with GPA-MN about adoption, fostering, volunteering, or general questions.",
    alternates: { canonical: "/about/contact" },
}

export default function ContactPage() {
    return (
        <>
            <PageHero
                title="Contact Us"
                highlight="Contact"
                description="Have questions about adoption, volunteering, or our organization? We'd love to hear from you."
            />

            <section aria-label="Contact methods" className="bg-card px-5 py-20 md:py-24">
                <div className="mx-auto max-w-300 md:grid md:grid-cols-2 md:gap-12">
                    {/* Contact form */}
                    <FadeIn>
                        <div className="border-border rounded-4xl border bg-[#FAF5F0] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-10 dark:bg-[#1a1715] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                            <SectionHeader
                                title="Drop Us a Line"
                                headingId="contact-form-heading"
                            />
                            <ContactForm />
                        </div>
                    </FadeIn>

                    {/* Contact info */}
                    <FadeIn delay={100}>
                        <div className="mt-8 space-y-8 md:mt-0">
                            <div>
                                <SectionHeader
                                    title="Other Ways to Reach Us"
                                    headingId="contact-other-heading"
                                />
                            </div>

                            <div className="space-y-5">
                                <a
                                    href="tel:763-785-4000"
                                    className="border-border flex items-center gap-4 rounded-2xl border bg-[#FAF5F0] p-5 transition-all hover:-translate-y-0.5 hover:shadow-sm dark:bg-[#1a1715]"
                                >
                                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
                                        <Phone className="text-primary size-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Phone</p>
                                        <p className="text-muted-foreground">763-785-4000</p>
                                    </div>
                                </a>

                                <a
                                    href="mailto:info@gpa-mn.org"
                                    className="border-border flex items-center gap-4 rounded-2xl border bg-[#FAF5F0] p-5 transition-all hover:-translate-y-0.5 hover:shadow-sm dark:bg-[#1a1715]"
                                >
                                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
                                        <Mail className="text-primary size-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">General Inquiries</p>
                                        <p className="text-muted-foreground">info@gpa‑mn.org</p>
                                    </div>
                                </a>

                                <a
                                    href="mailto:fostering@gpa-mn.org"
                                    className="border-border flex items-center gap-4 rounded-2xl border bg-[#FAF5F0] p-5 transition-all hover:-translate-y-0.5 hover:shadow-sm dark:bg-[#1a1715]"
                                >
                                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
                                        <Mail className="text-primary size-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Fostering</p>
                                        <p className="text-muted-foreground">
                                            fostering@gpa‑mn.org
                                        </p>
                                    </div>
                                </a>

                                <div className="border-border flex items-center gap-4 rounded-2xl border bg-[#FAF5F0] p-5 dark:bg-[#1a1715]">
                                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
                                        <MapPin className="text-primary size-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Service Area</p>
                                        <p className="text-muted-foreground">
                                            Twin Cities Metro, Minnesota
                                        </p>
                                    </div>
                                </div>
                                <div className="border-border rounded-2xl border bg-[#FAF5F0] p-5 dark:bg-[#1a1715]">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
                                            <Mail className="text-primary size-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">Newsletter</p>
                                            <p className="text-muted-foreground">
                                                Get greyhound news &amp; events
                                            </p>
                                        </div>
                                    </div>
                                    <NewsletterForm variant="card" />
                                </div>
                            </div>

                            {/* Social */}
                            <div>
                                <p className="mb-3 text-sm font-semibold">Follow Us</p>
                                <div className="flex gap-2.5">
                                    {[
                                        {
                                            label: "Facebook",
                                            href: "https://www.facebook.com/gpamn/",
                                            icon: "/images/social/Facebook_Logo_Primary.png",
                                        },
                                        {
                                            label: "Instagram",
                                            href: "https://www.instagram.com/gpaminnesota/",
                                            icon: "/images/social/Instagram_Glyph_Gradient.png",
                                        },
                                        {
                                            label: "TikTok",
                                            href: "https://www.tiktok.com/@gpa.minnesota",
                                            icon: "/images/social/TikTok_Icon_Black_Circle.png",
                                        },
                                        {
                                            label: "Bluesky",
                                            href: "https://bsky.app/profile/greyhoundpetsmn.bsky.social",
                                            icon: "/images/social/bluesky-icon.webp",
                                        },
                                    ].map((social) => (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="border-border hover:bg-primary hover:border-primary flex h-10 w-10 items-center justify-center rounded-xl border bg-[#FAF5F0] transition-all hover:-translate-y-0.5 dark:bg-[#1a1715]"
                                            aria-label={social.label}
                                        >
                                            <Image
                                                src={social.icon}
                                                alt={social.label}
                                                width={20}
                                                height={20}
                                            />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>
        </>
    )
}
