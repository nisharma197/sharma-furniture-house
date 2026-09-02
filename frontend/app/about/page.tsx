import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet Mr. Dhananjay Sharma, owner of Sharma Furniture House, with 30+ years of carpentry and custom furniture manufacturing experience in Indore.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <SectionHeading eyebrow="About Us" title="Three decades of building things that last." />

      <div className="mt-10 grid gap-12 lg:grid-cols-12 items-start">
        <div className="lg:col-span-7 space-y-6 text-walnut-700 leading-relaxed text-base">
          <p>
            Sharma Furniture House was built on a simple principle: furniture should fit the people and the space it&apos;s
            made for — not the other way around. We are <strong className="text-walnut-900">NOT a showroom</strong> and we don&apos;t sell ready-made pieces off a
            shelf. Every single order starts with a conversation about your measurements, space requirements, and design preferences.
          </p>
          <p>
            The business is personally led by <strong className="text-walnut-900">Mr. Dhananjay Sharma</strong>, who has spent
            more than 30 years working as a hands-on master carpenter and furniture manufacturer in Indore, Madhya Pradesh. Over three decades, he has
            designed and crafted everything from individual handcrafted wardrobes for homes to full turnkey interior woodwork for hotels,
            hospitals, schools, colleges, hostels, and corporate offices.
          </p>

          <div className="relative aspect-video rounded-sm overflow-hidden border border-walnut-100 shadow-md my-6">
            <Image
              src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80"
              alt="Mr. Dhananjay Sharma workshop craftsmanship"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-walnut-900/80 via-transparent to-transparent" />
            <p className="absolute bottom-4 left-4 text-sm font-medium text-linen">
              Craftsman Workshop &middot; Solid Sheesham & Teak Joinery
            </p>
          </div>

          <p>
            His approach has stayed constant throughout: understand the client&apos;s requirement thoroughly, choose genuine high-grade materials (Teak, Sheesham, BWP Marine Ply),
            and construct with precision mortise-and-tenon joinery and finishes that withstand daily use for decades.
          </p>
          <p>
            Today, Sharma Furniture House handles both residential and commercial projects across Indore
            and Madhya Pradesh — modular wardrobes, hydraulic storage beds, sofa sets, modular kitchens, office workstations, wooden partitions,
            and complete custom carpentry based on your drawings or reference photos.
          </p>

          <div className="pt-4">
            <Link
              href="/contact"
              className="inline-block rounded-sm bg-walnut-900 px-7 py-3.5 text-sm font-medium text-linen hover:bg-brass-600 transition-colors focus-ring"
            >
              Consult With Mr. Dhananjay Sharma &rarr;
            </Link>
          </div>
        </div>

        <aside className="lg:col-span-5 space-y-6">
          <div className="relative aspect-[4/5] rounded-sm overflow-hidden border-2 border-brass-500/40 shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1000&q=80"
              alt="Custom woodwork details"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-walnut-900/85 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-linen">
              <span className="inline-block rounded-full bg-brass-500 px-3 py-1 text-xs font-semibold text-walnut-900">
                Craftsman Guarantee
              </span>
              <p className="mt-2 text-sm font-medium text-linen">
                Direct client interaction with Mr. Dhananjay Sharma &mdash; No middlemen, no catalog markups.
              </p>
            </div>
          </div>

          <div className="rounded-sm border border-walnut-100 bg-walnut-50 p-6">
            <p className="font-display text-lg font-semibold text-walnut-900 border-b border-walnut-200 pb-3">At a Glance</p>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-walnut-500 text-xs uppercase tracking-wider">Owner & Master Carpenter</dt>
                <dd className="font-semibold text-walnut-900 text-base">Mr. Dhananjay Sharma</dd>
              </div>
              <div>
                <dt className="text-walnut-500 text-xs uppercase tracking-wider">Experience</dt>
                <dd className="font-semibold text-brass-600 text-base">30+ Years Active Experience</dd>
              </div>
              <div>
                <dt className="text-walnut-500 text-xs uppercase tracking-wider">Business Location</dt>
                <dd className="font-medium text-walnut-900">203 Nandbag Colony, Near Marimata, Indore, M.P.</dd>
              </div>
              <div>
                <dt className="text-walnut-500 text-xs uppercase tracking-wider">Specialization</dt>
                <dd className="font-medium text-walnut-900">Custom residential & commercial carpentry</dd>
              </div>
              <div>
                <dt className="text-walnut-500 text-xs uppercase tracking-wider">Showroom Policy</dt>
                <dd className="font-medium text-red-700">No ready-made furniture selling; 100% custom orders</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      <div className="joinery-divider my-16" />

      <div className="bg-walnut-900 text-linen p-8 lg:p-12 rounded-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <SectionHeading eyebrow="Our Core Philosophy" title="Honest materials, precise joinery, zero compromises." />
          <p className="mt-4 text-walnut-100/85 leading-relaxed text-base">
            We believe in complete transparency with our clients regarding wood grade, hardware brands, and timelines. When we quote for BWP Marine Ply or Solid Teak, that is exactly what gets delivered to your site.
          </p>
        </div>
      </div>
    </div>
  );
}
