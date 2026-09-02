import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-walnut-900">Terms &amp; Conditions</h1>
      <p className="mt-4 text-sm text-walnut-500">Last updated: {new Date().getFullYear()}</p>

      <div className="mt-8 space-y-6 text-walnut-700 leading-relaxed">
        <h2 className="font-display text-xl font-semibold text-walnut-900">Nature of Our Business</h2>
        <p>
          Sharma Furniture House operates on a custom, client-order basis. We do not sell ready-made or catalogue
          furniture, and this website is not an online store. All furniture and woodwork is manufactured according
          to individual client requirements, measurements, and design discussions.
        </p>

        <h2 className="font-display text-xl font-semibold text-walnut-900">Quotations</h2>
        <p>
          Prices are not listed on this website. Quotations are provided after understanding the specific
          requirement, materials, and scope of a project, and may vary based on site conditions and design changes.
        </p>

        <h2 className="font-display text-xl font-semibold text-walnut-900">Inquiries</h2>
        <p>
          Submitting an inquiry through this website does not constitute a confirmed order. Orders are confirmed
          only after mutual agreement on design, materials, cost, and timeline.
        </p>

        <h2 className="font-display text-xl font-semibold text-walnut-900">Website Content</h2>
        <p>
          Project photos and descriptions on this website represent previous work completed by Sharma Furniture
          House and are shown for informational purposes.
        </p>

        <h2 className="font-display text-xl font-semibold text-walnut-900">Contact</h2>
        <p>For any questions regarding these terms, please reach out via our Contact page.</p>
      </div>
    </div>
  );
}
