import Link from "next/link"
import Image from "next/image"
import { Phone, Mail } from "lucide-react"
import { footerNav } from "@/app/_data/navigation"
import { NewsletterForm } from "./newsletter-form"

export function SiteFooter() {
    return (
        <footer className="relative overflow-hidden bg-[#111111] pt-0 text-white">
            {/* Gradient top border */}
            <div className="from-primary to-secondary h-1 bg-linear-to-r via-[#ff8f89]" />

            <div className="mx-auto max-w-300 px-5 pt-16 pb-8 md:px-8 lg:px-10">
                <div className="mb-10 grid gap-10 md:grid-cols-3 lg:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <Image
                            src="/images/gpa-logo-footer.png"
                            alt="GPA‑MN"
                            width={160}
                            height={64}
                            className="mb-3 h-12 w-auto"
                        />
                        <p className="max-w-75 text-sm leading-relaxed text-white/60">
                            Greyhound Pets of America — Minnesota. Finding loving homes for retired
                            racing greyhounds since 1989.
                        </p>
                        <div className="mt-4 flex gap-2.5">
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
                                    invert: true,
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
                                    className="hover:bg-primary flex h-10 w-10 items-center justify-center rounded-xl border border-white/6 bg-white/8 transition-all hover:-translate-y-0.5"
                                    aria-label={social.label}
                                >
                                    <Image
                                        src={social.icon}
                                        alt={social.label}
                                        width={20}
                                        height={20}
                                        className={social.invert ? "invert" : ""}
                                    />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-heading mb-4 text-xl tracking-wider">Quick Links</h4>
                        <ul className="flex flex-col gap-2.5">
                            {footerNav.quickLinks.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="hover:text-secondary text-sm text-white/60 transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-heading mb-4 text-xl tracking-wider">Resources</h4>
                        <ul className="flex flex-col gap-2.5">
                            {footerNav.resources.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="hover:text-secondary text-sm text-white/60 transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-heading mb-4 text-xl tracking-wider">Contact Us</h4>
                        <div className="flex flex-col gap-2.5">
                            <a
                                href="tel:763-785-4000"
                                className="hover:text-secondary flex items-center gap-2.5 text-sm text-white/60 transition-colors"
                            >
                                <Phone className="size-4" />
                                763-785-4000
                            </a>
                            <a
                                href="mailto:info@gpa-mn.org"
                                className="hover:text-secondary flex items-center gap-2.5 text-sm text-white/60 transition-colors"
                            >
                                <Mail className="size-4" />
                                info@gpa‑mn.org
                            </a>
                        </div>
                        <div className="my-4 h-px bg-white/8" />
                        <h5 className="mb-2 text-sm font-semibold text-white/80">
                            Subscribe to our Newsletter
                        </h5>
                        <NewsletterForm variant="footer" />
                    </div>
                </div>

                {/* Bottom */}
                <div className="flex flex-col items-center gap-3 border-t border-white/8 pt-6 text-center md:flex-row md:justify-between">
                    <p className="text-xs text-white/40">
                        &copy; {new Date().getFullYear()} Greyhound Pets of America — Minnesota.
                    </p>
                    <p className="text-xs text-white/40">
                        A 501(c)(3) nonprofit organization. All-volunteer.
                    </p>
                    <p className="text-xs text-white/40">Crafted with care by zoomdoggy.com</p>
                </div>
            </div>
        </footer>
    )
}
