import Image from "next/image"
import { Phone, Mail, MapPin } from "lucide-react"
import { PageHero } from "@/app/_components/page-hero"
import { SectionHeader } from "@/app/_components/section-header"
import { FadeIn } from "@/app/_components/fade-in"
import { NewsletterForm } from "@/app/_components/newsletter-form"

export default function ContactPage() {
    return (
        <>
            <PageHero
                title="Contact Us"
                highlight="Contact"
                description="Have questions about adoption, volunteering, or our organization? We'd love to hear from you."
            />

            <section className="bg-card px-5 py-20 md:py-24">
                <div className="mx-auto max-w-300 md:grid md:grid-cols-2 md:gap-12">
                    {/* Contact form */}
                    <FadeIn>
                        <div className="border-border rounded-4xl border bg-[#FAF5F0] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-10 dark:bg-[#1a1715] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                            <SectionHeader title="Drop Us a Line" />
                            <form className="mt-6 space-y-5" action="#">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-1.5 block text-sm font-semibold"
                                    >
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Your name"
                                        className="border-border bg-card focus:ring-primary/30 w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-1.5 block text-sm font-semibold"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        className="border-border bg-card focus:ring-primary/30 w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="category"
                                        className="mb-1.5 block text-sm font-semibold"
                                    >
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        defaultValue=""
                                        className="border-border bg-card focus:ring-primary/30 w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:outline-none"
                                    >
                                        <option value="" disabled>
                                            Select a category…
                                        </option>
                                        <option value="general">General Inquiry</option>
                                        <option value="fostering">Fostering</option>
                                        <option value="volunteer">Volunteer</option>
                                        <option value="vet-care">Vet Care</option>
                                        <option value="meet-and-greet">Meet &amp; Greet</option>
                                        <option value="lost-hounds">Lost Hounds</option>
                                        <option value="returns">Returns</option>
                                        <option value="whistle-blower">Whistle Blower</option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        htmlFor="subject"
                                        className="mb-1.5 block text-sm font-semibold"
                                    >
                                        Subject
                                    </label>
                                    <input
                                        id="subject"
                                        type="text"
                                        placeholder="What's this about?"
                                        className="border-border bg-card focus:ring-primary/30 w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="mb-1.5 block text-sm font-semibold"
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        placeholder="Tell us more..."
                                        className="border-border bg-card focus:ring-primary/30 w-full resize-none rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:outline-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-primary hover:bg-primary/90 w-full rounded-full py-3.5 font-semibold text-white shadow-[0_4px_16px_rgba(156,47,48,0.25)] transition-colors"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </FadeIn>

                    {/* Contact info */}
                    <FadeIn delay={100}>
                        <div className="mt-8 space-y-8 md:mt-0">
                            <div>
                                <SectionHeader title="Other Ways to Reach Us" />
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
                                            icon: "/images/social/Facebook_Logo_Primary.png",
                                        },
                                        {
                                            label: "Instagram",
                                            icon: "/images/social/Instagram_Glyph_Gradient.png",
                                        },
                                        {
                                            label: "TikTok",
                                            icon: "/images/social/TikTok_Icon_Black_Circle.png",
                                        },
                                        {
                                            label: "Bluesky",
                                            icon: "/images/social/bluesky-icon.webp",
                                        },
                                    ].map((social) => (
                                        <a
                                            key={social.label}
                                            href="#"
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
