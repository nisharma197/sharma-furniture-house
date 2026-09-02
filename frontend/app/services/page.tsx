import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import { api } from "@/lib/api";
import type { Paginated, Service } from "@/lib/types";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Custom carpentry and furniture manufacturing services — sofa sets, wardrobes, modular kitchens, office furniture, wooden partitions, and more.",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const res = await api
    .get<Paginated<Service>>("/services?limit=100", { cache: "no-store" })
    .catch(() => null);
  const services = res?.data || [];

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <SectionHeading
        eyebrow="What We Build"
        title="Our Services"
        description="From individual furniture pieces to complete interior woodwork — every project is custom-built to your requirement. Prices are provided on request after understanding your project."
      />

      {services.length === 0 ? (
        <p className="mt-10 text-walnut-500 text-sm">
          Services will appear here once added from the admin dashboard.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      )}
    </div>
  );
}
