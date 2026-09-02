import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import type { ApiResponse, Service } from "@/lib/types";

async function getService(slug: string) {
  try {
    const res = await api.get<ApiResponse<Service>>(`/services/${slug}`, { cache: "no-store" });
    return res.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await getService(params.slug);
  if (!service) return { title: "Service" };
  return { title: service.title, description: service.description };
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await getService(params.slug);
  if (!service) notFound();

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "91XXXXXXXXXX";
  const waMessage = encodeURIComponent(`Hi, I'd like a quote for: ${service.title}`);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
      <Link href="/services" className="text-sm text-brass-600 hover:underline">
        &larr; All Services
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-walnut-50">
          {service.coverImage ? (
            <Image src={service.coverImage} alt={service.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-walnut-300 text-sm">Image coming soon</div>
          )}
        </div>

        <div>
          <h1 className="font-display text-3xl font-semibold text-walnut-900">{service.title}</h1>
          <p className="mt-4 text-walnut-700 leading-relaxed">{service.description}</p>

          <dl className="mt-6 space-y-3 text-sm">
            {service.materials && (
              <div>
                <dt className="font-medium text-walnut-900">Materials</dt>
                <dd className="text-walnut-700">{service.materials}</dd>
              </div>
            )}
            {service.finish && (
              <div>
                <dt className="font-medium text-walnut-900">Finish Options</dt>
                <dd className="text-walnut-700">{service.finish}</dd>
              </div>
            )}
          </dl>

          {service.features?.length > 0 && (
            <ul className="mt-6 grid grid-cols-2 gap-2 text-sm text-walnut-700">
              {service.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brass-500" />
                  {f}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-sm bg-walnut-900 px-6 py-3 font-medium text-linen hover:bg-brass-600 transition-colors focus-ring"
            >
              Get a Quote
            </Link>
            <a
              href={`https://wa.me/${whatsapp}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm border border-walnut-200 px-6 py-3 font-medium text-walnut-800 hover:bg-walnut-50 transition-colors focus-ring"
            >
              WhatsApp Us
            </a>
            <a
              href={`tel:${process.env.NEXT_PUBLIC_PHONE || ""}`}
              className="rounded-sm border border-walnut-200 px-6 py-3 font-medium text-walnut-800 hover:bg-walnut-50 transition-colors focus-ring"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>

      {service.images?.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-xl font-semibold text-walnut-900">Gallery</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-sm overflow-hidden bg-walnut-50">
                <Image src={img} alt={`${service.title} ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
