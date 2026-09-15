import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Sharma Furniture House for a free consultation on your custom furniture or carpentry project in Indore.",
};

async function getContactSettings() {
  try {
    const res = await api.get<{ success: boolean; data: Record<string, string> }>("/settings", { cache: "no-store" });
    return res?.data || {};
  } catch {
    return {};
  }
}

export default async function ContactPage() {
  const settings = await getContactSettings();

  const phone = settings.phone || process.env.NEXT_PUBLIC_PHONE || "+91-9876543210";
  const email = settings.email || process.env.NEXT_PUBLIC_EMAIL || "info@sharmafurniturehouse.com";
  const address = settings.address || process.env.NEXT_PUBLIC_ADDRESS || "203 Nandbag Colony, Near Marimata, Indore, Madhya Pradesh, India";
  const ownerName = settings.ownerName || "Mr. Dhananjay Sharma";
  const experience = settings.experience || "30+ Years";
  const businessHours = settings.businessHours || "Monday – Saturday, 10:00 AM – 7:00 PM";
  const whatsapp = settings.whatsapp || "919876543210";

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <SectionHeading
        eyebrow="Get In Touch"
        title="Let's talk about your project"
        description="Share your requirement, measurements, or an idea and we'll get back to you with next steps."
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-sm border border-walnut-100 bg-white/50 p-6 sm:p-8">
          <ContactForm />
        </div>

        <div className="lg:col-span-2 space-y-6 rounded-sm border border-walnut-100 bg-walnut-50/60 p-6 sm:p-8 h-fit">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brass-600">Address</p>
            <p className="mt-2 text-walnut-900 font-medium leading-relaxed">{address}</p>
          </div>
          <div className="border-t border-walnut-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-brass-600">Owner &amp; Craftsman</p>
            <p className="mt-1 text-walnut-900 font-medium">{ownerName} ({experience} Experience)</p>
          </div>
          <div className="border-t border-walnut-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-brass-600">Phone</p>
            <a href={`tel:${phone}`} className="mt-1 block text-walnut-900 font-medium hover:text-brass-600 focus-ring">{phone}</a>
          </div>
          <div className="border-t border-walnut-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-brass-600">Email</p>
            <a href={`mailto:${email}`} className="mt-1 block text-walnut-900 font-medium hover:text-brass-600 focus-ring">{email}</a>
          </div>
          <div className="border-t border-walnut-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-brass-600">WhatsApp</p>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-walnut-900 font-medium hover:text-brass-600 focus-ring"
            >
              Chat on WhatsApp
            </a>
          </div>
          <div className="border-t border-walnut-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-brass-600">Business Hours</p>
            <p className="mt-1 text-walnut-900 font-medium">{businessHours}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
