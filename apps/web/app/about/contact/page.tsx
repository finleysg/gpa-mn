import { Phone, Mail, MapPin } from 'lucide-react';
import { PageHero } from '@/app/_components/page-hero';
import { SectionHeader } from '@/app/_components/section-header';
import { FadeIn } from '@/app/_components/fade-in';

export default function ContactPage() {
  return (
    <>
      <PageHero
        badge="Get In Touch"
        title="Contact Us"
        highlight="Contact"
        description="Have questions about adoption, volunteering, or our organization? We'd love to hear from you."
      />

      <section className="py-20 px-5 md:py-24 bg-card">
        <div className="max-w-[1200px] mx-auto md:grid md:grid-cols-2 md:gap-12">
          {/* Contact form */}
          <FadeIn>
            <div className="bg-[#FAF5F0] dark:bg-[#1a1715] rounded-[32px] p-8 md:p-10 border border-border shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
              <SectionHeader label="Send a Message" title="Drop Us a Line" />
              <form className="mt-6 space-y-5" action="#">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-semibold mb-1.5">
                    Category
                  </label>
                  <select
                    id="category"
                    defaultValue=""
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                  <label htmlFor="subject" className="block text-sm font-semibold mb-1.5">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="What's this about?"
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us more..."
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-primary text-white py-3.5 font-semibold hover:bg-primary/90 transition-colors shadow-[0_4px_16px_rgba(156,47,48,0.25)]"
                >
                  Send Message
                </button>
              </form>
            </div>
          </FadeIn>

          {/* Contact info */}
          <FadeIn delay={100}>
            <div className="mt-8 md:mt-0 space-y-8">
              <div>
                <SectionHeader label="Contact Info" title="Other Ways to Reach Us" />
              </div>

              <div className="space-y-5">
                <a
                  href="tel:763-785-4000"
                  className="flex items-center gap-4 bg-[#FAF5F0] dark:bg-[#1a1715] rounded-2xl p-5 border border-border hover:-translate-y-0.5 hover:shadow-sm transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Phone className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Phone</p>
                    <p className="text-muted-foreground">763-785-4000</p>
                  </div>
                </a>

                <a
                  href="mailto:info@gpa-mn.org"
                  className="flex items-center gap-4 bg-[#FAF5F0] dark:bg-[#1a1715] rounded-2xl p-5 border border-border hover:-translate-y-0.5 hover:shadow-sm transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">General Inquiries</p>
                    <p className="text-muted-foreground">info@gpa-mn.org</p>
                  </div>
                </a>

                <a
                  href="mailto:fostering@gpa-mn.org"
                  className="flex items-center gap-4 bg-[#FAF5F0] dark:bg-[#1a1715] rounded-2xl p-5 border border-border hover:-translate-y-0.5 hover:shadow-sm transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Fostering</p>
                    <p className="text-muted-foreground">fostering@gpa-mn.org</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 bg-[#FAF5F0] dark:bg-[#1a1715] rounded-2xl p-5 border border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Service Area</p>
                    <p className="text-muted-foreground">Twin Cities Metro, Minnesota</p>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div>
                <p className="text-sm font-semibold mb-3">Follow Us</p>
                <div className="flex gap-2.5">
                  {[
                    { label: 'IG', handle: '@gpaminnesota' },
                    { label: 'FB', handle: 'GPA-MN' },
                    { label: 'X', handle: '@gpamn' },
                    { label: 'TT', handle: 'GPA-MN' },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href="#"
                      className="w-10 h-10 rounded-xl bg-[#FAF5F0] dark:bg-[#1a1715] border border-border flex items-center justify-center text-xs font-bold text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all"
                      aria-label={s.label}
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
