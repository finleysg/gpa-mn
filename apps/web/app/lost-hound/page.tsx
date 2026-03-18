import { Phone, AlertTriangle } from 'lucide-react';
import { PageHero } from '@/app/_components/page-hero';
import { SectionHeader } from '@/app/_components/section-header';
import { FadeIn } from '@/app/_components/fade-in';
import { BlobDecoration } from '@/app/_components/blob-decoration';

const immediateSteps = [
  'Stay calm. Greyhounds can sense panic and may run further.',
  'Search the immediate area — check behind bushes, under decks, and in neighboring yards.',
  'Leave your front door open with food and a familiar blanket outside.',
  'Ask neighbors to check their yards, garages, and sheds.',
  'Post to social media immediately — the MN Greyhound community is incredibly responsive.',
  'Contact GPA-MN at 763-785-4000 to activate our lost hound network.',
  'File a lost pet report with local animal control and nearby shelters.',
  'Put up flyers with a clear photo in the surrounding neighborhood.',
];

const preventionTips = [
  { icon: '🏷️', title: 'ID Tags', desc: 'Always keep current ID tags on your greyhound\'s collar with your phone number. Consider a GPS tracking collar.' },
  { icon: '🔗', title: 'Martingale Collar', desc: 'Use a properly fitted martingale collar — greyhounds can slip out of regular collars due to their narrow heads.' },
  { icon: '🚪', title: 'Door Safety', desc: 'Be vigilant about doors and gates. Greyhounds are fast and can bolt before you realize it. Consider baby gates as backup.' },
  { icon: '🏡', title: 'Secure Fencing', desc: 'Check your yard fencing regularly for gaps. Greyhounds can squeeze through surprisingly small spaces and can jump fences under 5 feet.' },
  { icon: '📱', title: 'Microchip', desc: 'Ensure your greyhound\'s microchip registration is up to date with your current contact information.' },
  { icon: '⚡', title: 'Leash Always', desc: 'Never let your greyhound off-leash in an unfenced area. Their prey drive can override all training in an instant.' },
];

export default function LostHoundPage() {
  return (
    <>
      <PageHero
        variant="urgent"
        badge="Emergency"
        title="Lost Hound!"
        highlight="Lost Hound!"
        description="If your greyhound has gotten loose, time is critical. Follow these steps immediately."
      />

      {/* Emergency banner */}
      <section className="bg-primary text-white py-6 px-5">
        <div className="max-w-300 mx-auto flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
          <AlertTriangle className="size-8 shrink-0" />
          <div>
            <p className="font-heading text-2xl tracking-wider uppercase">Call us immediately</p>
            <p className="text-white/80 text-sm">Our volunteer network can help spread the word fast</p>
          </div>
          <a
            href="tel:763-785-4000"
            className="inline-flex items-center gap-2 rounded-full bg-white text-primary px-8 py-3 font-bold hover:bg-white/90 transition-colors shrink-0"
          >
            <Phone className="size-4" />
            763-785-4000
          </a>
        </div>
      </section>

      {/* Immediate steps */}
      <section className="py-20 px-5 md:py-24 bg-card relative overflow-hidden">
        <BlobDecoration color="primary" size={300} className="-top-16 -right-16 opacity-10 dark:opacity-5" />
        <div className="relative z-10 max-w-200 mx-auto">
          <FadeIn>
            <SectionHeader
              label="Act Now"
              title="What to Do Immediately"
            />
            <ol className="mt-8 space-y-4">
              {immediateSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-8 h-8 min-w-8 rounded-full bg-primary text-white flex items-center justify-center font-heading text-lg">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground leading-relaxed pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </FadeIn>
        </div>
      </section>

      {/* Prevention */}
      <section className="py-20 px-5 md:py-24 bg-[#FAF5F0] dark:bg-[#1a1715]">
        <div className="max-w-300 mx-auto">
          <SectionHeader
            label="Prevention"
            title="Keep Your Hound Safe"
            description="The best way to handle a lost greyhound is to prevent it from happening. These tips will help keep your hound safe."
            align="center"
            className="mb-12"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {preventionTips.map((tip, i) => (
              <FadeIn key={tip.title} delay={i * 60}>
                <div className="bg-card rounded-3xl p-6 border border-border shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.1)] h-full">
                  <div className="text-2xl mb-3">{tip.icon}</div>
                  <h3 className="font-heading text-xl tracking-wider uppercase mb-2">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tip.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
