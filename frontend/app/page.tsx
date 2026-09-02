import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import ProjectCard from "@/components/ProjectCard";
import TestimonialCard from "@/components/TestimonialCard";
import GalleryGrid from "@/components/GalleryGrid";
import { api } from "@/lib/api";
import type { Paginated, Service, Project, Testimonial, FaqItem, GalleryImage } from "@/lib/types";

async function getHomeData() {
  const [services, projects, gallery, testimonials, faqs] = await Promise.all([
    api.get<Paginated<Service>>("/services?limit=6", { cache: "no-store" }).catch(() => null),
    api.get<Paginated<Project>>("/projects?featured=true&limit=6", { cache: "no-store" }).catch(() => null),
    api.get<Paginated<GalleryImage>>("/gallery?featured=true&limit=6", { cache: "no-store" }).catch(() => null),
    api.get<Paginated<Testimonial>>("/testimonials?limit=6", { cache: "no-store" }).catch(() => null),
    api.get<{ success: boolean; data: FaqItem[] }>("/faqs", { cache: "no-store" }).catch(() => null),
  ]);

  // Fallback: if no featured gallery images yet, get latest gallery images
  let galleryImages = gallery?.data || [];
  if (galleryImages.length === 0) {
    const fallbackGallery = await api
      .get<Paginated<GalleryImage>>("/gallery?limit=6", { cache: "no-store" })
      .catch(() => null);
    galleryImages = fallbackGallery?.data || [];
  }

  return {
    services: services?.data || [],
    projects: projects?.data || [],
    galleryImages,
    testimonials: testimonials?.data || [],
    faqs: (faqs?.data || []).slice(0, 5),
  };
}

const industries = [
  { title: "Homes & Villas", desc: "Custom wardrobes, beds, sofas, and interior woodwork", icon: "🏡" },
  { title: "Apartments & Flats", desc: "Space-saving modular furniture and storage units", icon: "🏢" },
  { title: "Hotels & Restaurants", desc: "Dining sets, receptions, partitions & commercial carpentry", icon: "🏨" },
  { title: "Schools & Colleges", desc: "Classroom desks, podiums, lab benches & library furniture", icon: "🏫" },
  { title: "Hospitals & Clinics", desc: "Reception counters, storage cabinets & custom partitions", icon: "🏥" },
  { title: "Offices & Corporates", desc: "Executive desks, conference tables, and workstation partitions", icon: "💼" },
  { title: "Shops & Showrooms", desc: "Display racks, counters, wall paneling & glass wooden frames", icon: "🏬" },
  { title: "Hostels & PG Projects", desc: "Bulk bed frames, study tables, and wardrobe lockers", icon: "🛏️" },
];

export default async function HomePage() {
  const { services, projects, galleryImages, testimonials, faqs } = await getHomeData();

  return (
    <>
      <Hero />

      {/* About company */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="About Sharma Furniture House"
              title="A craftsman's workshop, not a showroom."
              description="We don't sell off-the-shelf furniture. Every piece we build starts with a conversation about your space, your measurements, and how you actually live or work — then it's designed and hand-built to match."
            />
            <p className="mt-4 text-walnut-700 leading-relaxed max-w-xl">
              Led by Mr. Dhananjay Sharma, who brings more than 30 years of hands-on carpentry and furniture
              manufacturing experience, our team handles everything from a single custom wardrobe to complete
              interior woodwork for residential, commercial, and institutional clients in Indore and beyond.
            </p>
            <div className="mt-6 flex items-center gap-6">
              <Link
                href="/about"
                className="rounded-sm bg-walnut-900 px-6 py-3 text-sm font-medium text-linen hover:bg-brass-600 transition-colors focus-ring"
              >
                Read Our Story &rarr;
              </Link>
              <div className="border-l border-walnut-200 pl-4 text-xs text-walnut-600">
                <span className="font-semibold text-walnut-900 block">30+ Years Experience</span>
                Client-Based Custom Projects Only
              </div>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-sm overflow-hidden border-2 border-walnut-100 shadow-xl group">
            <Image
              src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1000&q=80"
              alt="Sharma Furniture House carpentry workshop and handcrafted woodwork"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-walnut-900/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-linen">
              <p className="font-display text-sm font-semibold">Mr. Dhananjay Sharma</p>
              <p className="text-xs text-walnut-100/80">Master Craftsman & Founder &middot; 203 Nandbag Colony, Indore</p>
            </div>
          </div>
        </div>
      </section>

      <div className="joinery-divider" />

      {/* Industries we serve */}
      <section className="bg-walnut-50/60 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="Who We Build For"
            title="Industries & Projects We Serve"
            description="From single custom residential pieces to large-scale commercial woodwork."
            align="center"
          />
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((ind) => (
              <div
                key={ind.title}
                className="group rounded-sm border border-walnut-100 bg-white/70 p-6 transition-all duration-300 hover:border-brass-400 hover:shadow-md"
              >
                <div className="text-3xl mb-3">{ind.icon}</div>
                <h3 className="font-display text-base font-semibold text-walnut-900 group-hover:text-brass-600 transition-colors">
                  {ind.title}
                </h3>
                <p className="mt-1.5 text-xs text-walnut-600 leading-relaxed">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      {services.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="What We Build" title="Our Custom Services" />
            <Link href="/services" className="font-medium text-brass-600 hover:underline">
              View all services &rarr;
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </section>
      )}

      {/* Featured projects */}
      {projects.length > 0 && (
        <section className="bg-walnut-50/60 py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="Recent Work" title="Featured Projects" />
              <Link href="/projects" className="font-medium text-brass-600 hover:underline">
                View all projects &rarr;
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Preview */}
      {galleryImages.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <SectionHeading
              eyebrow="Our Workmanship"
              title="Gallery Showcase"
              description="A glimpse of completed furniture and custom carpentry projects."
            />
            <Link
              href="/gallery"
              className="rounded-sm border border-walnut-200 bg-white px-5 py-2.5 text-sm font-medium text-walnut-900 hover:border-brass-500 hover:text-brass-600 transition-colors focus-ring"
            >
              View Full Gallery &rarr;
            </Link>
          </div>
          <GalleryGrid images={galleryImages} />
        </section>
      )}

      {/* How we work */}
      <section className="bg-walnut-900 text-linen py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="Our Process" title="How We Work With Clients" align="center" />
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "01", title: "Share Requirements", desc: "Call or send your room measurements, sketches, or reference photos to Dhananjay Sharma." },
              { step: "02", title: "Site Visit & Quote", desc: "We visit your site in Indore to take exact measurements, select wood/laminates, and provide a clear quote." },
              { step: "03", title: "Precision Workshop Build", desc: "Your custom furniture is precision built in our workshop using 30+ years of carpentry expertise." },
              { step: "04", title: "Delivery & Installation", desc: "We deliver and install everything cleanly at your site, built to last for generations." },
            ].map((s) => (
              <div key={s.step} className="rounded-sm border border-walnut-700/50 bg-walnut-800/50 p-6">
                <span className="font-display text-3xl font-bold text-brass-400">{s.step}</span>
                <h3 className="mt-3 font-display text-lg font-semibold text-linen">{s.title}</h3>
                <p className="mt-2 text-xs text-walnut-100/75 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-walnut-50/60 py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <SectionHeading eyebrow="Client Feedback" title="What Our Customers Say" align="center" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs preview */}
      {faqs.length > 0 && (
        <section className="mx-auto max-w-4xl px-5 py-20 lg:px-8">
          <SectionHeading eyebrow="Common Questions" title="Frequently Asked Questions" align="center" />
          <div className="mt-10 space-y-4">
            {faqs.map((f) => (
              <details key={f.id} className="group rounded-sm border border-walnut-100 bg-white/70 p-5">
                <summary className="cursor-pointer list-none font-medium text-walnut-900 focus-ring flex justify-between items-center">
                  <span>{f.question}</span>
                  <span className="text-brass-500 font-bold group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-3 text-sm text-walnut-700 leading-relaxed border-t border-walnut-100/60 pt-3">{f.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/faqs" className="font-medium text-brass-600 hover:underline">
              View all FAQs &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* CTA Section (No Map) */}
      <section className="bg-walnut-50/60 py-20 border-t border-walnut-100">
        <div className="mx-auto max-w-5xl px-5 lg:px-8 text-center">
          <SectionHeading
            eyebrow="Visit or Call Us"
            title="Ready to build something custom?"
            description="Get in touch with your requirements — sketches, photos, or just an idea — and Mr. Dhananjay Sharma will personally advise you."
            align="center"
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 text-left bg-white/80 border border-walnut-100 p-6 rounded-sm max-w-2xl mx-auto shadow-sm">
            <div className="space-y-1 text-sm text-walnut-800">
              <p className="font-semibold text-walnut-900">📍 Business Location:</p>
              <p>203 Nandbag Colony, Near Marimata, Indore, Madhya Pradesh, India</p>
            </div>
            <div className="space-y-1 text-sm text-walnut-800">
              <p className="font-semibold text-walnut-900">👤 Owner & Master Carpenter:</p>
              <p>Mr. Dhananjay Sharma (30+ Years Experience)</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-sm bg-walnut-900 px-8 py-3.5 font-medium text-linen hover:bg-brass-600 transition-colors focus-ring shadow-md"
            >
              Request a Free Consultation
            </Link>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm border border-walnut-300 bg-white px-8 py-3.5 font-medium text-walnut-900 hover:border-brass-500 hover:text-brass-600 transition-colors focus-ring shadow-sm"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
