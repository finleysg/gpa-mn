import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail } from 'lucide-react';
import { footerNav } from '@/app/_data/navigation';

export function SiteFooter() {
  return (
    <footer className="bg-[#111111] text-white pt-0 relative overflow-hidden">
      {/* Gradient top border */}
      <div className="h-1 bg-linear-to-r from-primary via-[#ff8f89] to-secondary" />

      <div className="max-w-300 mx-auto px-5 pt-16 pb-8 md:px-8 lg:px-10">
        <div className="grid gap-10 mb-10 md:grid-cols-3 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Image
              src="/images/gpa-logo-footer.png"
              alt="GPA-MN"
              width={160}
              height={64}
              className="h-12 w-auto mb-3"
            />
            <p className="text-sm text-white/60 leading-relaxed max-w-75">
              Greyhound Pets of America — Minnesota. Finding loving homes for retired racing
              greyhounds since 1989.
            </p>
            <div className="flex gap-2.5 mt-4">
              {[
                { label: 'Facebook', icon: '/images/social/Facebook_Logo_Primary.png' },
                { label: 'Instagram', icon: '/images/social/Instagram_Glyph_Gradient.png' },
                { label: 'TikTok', icon: '/images/social/TikTok_Icon_Black_Circle.png', invert: true },
                { label: 'Bluesky', icon: '/images/social/bluesky-icon.webp' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/8 border border-white/6 flex items-center justify-center hover:bg-primary transition-all hover:-translate-y-0.5"
                  aria-label={social.label}
                >
                  <Image
                    src={social.icon}
                    alt={social.label}
                    width={20}
                    height={20}
                    className={social.invert ? 'invert' : ''}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xl tracking-wider mb-4">Quick Links</h4>
            <ul className="flex flex-col gap-2.5">
              {footerNav.quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 hover:text-secondary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading text-xl tracking-wider mb-4">Resources</h4>
            <ul className="flex flex-col gap-2.5">
              {footerNav.resources.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 hover:text-secondary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-xl tracking-wider mb-4">Contact Us</h4>
            <div className="flex flex-col gap-2.5">
              <a
                href="tel:763-785-4000"
                className="flex items-center gap-2.5 text-sm text-white/60 hover:text-secondary transition-colors"
              >
                <Phone className="size-4" />
                763-785-4000
              </a>
              <a
                href="mailto:info@gpa-mn.org"
                className="flex items-center gap-2.5 text-sm text-white/60 hover:text-secondary transition-colors"
              >
                <Mail className="size-4" />
                info@gpa-mn.org
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/8 pt-6 flex flex-col gap-3 items-center text-center md:flex-row md:justify-between">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Greyhound Pets of America — Minnesota.
          </p>
          <p className="text-xs text-white/40">
            A 501(c)(3) nonprofit organization. All-volunteer.
          </p>
          <p className="text-xs text-white/40">
            Crafted with care by zoomdoggy.com
          </p>
        </div>
      </div>
    </footer>
  );
}
