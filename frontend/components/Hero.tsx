import Link from "next/link";
import Image from "next/image";

interface HeroProps {
  heroImage?: string;
}

export default function Hero({ heroImage }: HeroProps) {
  const imageUrl =
    heroImage ||
    "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1200&q=80";

  return (
    <section className="relative overflow-hidden bg-walnut-900 text-linen">
      <div className="absolute inset-0 bg-wood-grain" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28 grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brass-400">
            30+ Years of Craftsmanship &middot; Indore, MP
          </p>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.08]">
            Furniture built around <span className="text-brass-400">your</span> measurements, not a catalogue.
          </h1>
          <p className="mt-6 max-w-xl text-walnut-100/85 text-lg leading-relaxed">
            Sharma Furniture House designs and hand-builds custom wooden furniture and complete carpentry solutions
            for homes, hotels, offices, and institutions — led by Mr. Dhananjay Sharma, a master craftsman with three
            decades of practical experience.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-sm bg-brass-500 px-7 py-3.5 font-medium text-walnut-900 hover:bg-brass-400 transition-colors focus-ring shadow-lg"
            >
              Request a Free Consultation
            </Link>
            <Link
              href="/projects"
              className="rounded-sm border border-walnut-100/30 px-7 py-3.5 font-medium text-linen hover:bg-walnut-700 transition-colors focus-ring"
            >
              View Our Work
            </Link>
          </div>

          <dl className="mt-14 grid grid-cols-3 gap-6 max-w-md border-t border-walnut-100/15 pt-8">
            <div>
              <dt className="sr-only">Years of experience</dt>
              <dd className="font-display text-3xl font-semibold text-brass-400">30+</dd>
              <p className="text-xs text-walnut-100/70 mt-1">Years Experience</p>
            </div>
            <div>
              <dt className="sr-only">Custom projects</dt>
              <dd className="font-display text-3xl font-semibold text-brass-400">100%</dd>
              <p className="text-xs text-walnut-100/70 mt-1">Made to Order</p>
            </div>
            <div>
              <dt className="sr-only">Project types</dt>
              <dd className="font-display text-3xl font-semibold text-brass-400">18+</dd>
              <p className="text-xs text-walnut-100/70 mt-1">Project Types Served</p>
            </div>
          </dl>
        </div>

        <div className="relative hidden lg:block">
          <div className="relative aspect-[4/5] rounded-sm overflow-hidden border-2 border-brass-500/30 shadow-2xl group">
            <Image
              src={imageUrl}
              alt="Master craftsman working on solid wood furniture at Sharma Furniture House"
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-walnut-900/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-block rounded-full bg-brass-500/90 px-3 py-1 text-xs font-semibold text-walnut-900 backdrop-blur">
                Handcrafted Precision
              </span>
              <p className="mt-2 text-sm text-linen font-medium">
                Custom Sheesham & Teak Woodwork by Mr. Dhananjay Sharma
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="joinery-divider" />
    </section>
  );
}
