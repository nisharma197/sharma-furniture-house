import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 prose-walnut">
      <h1 className="font-display text-3xl font-semibold text-walnut-900">Privacy Policy</h1>
      <p className="mt-4 text-sm text-walnut-500">Last updated: {new Date().getFullYear()}</p>

      <div className="mt-8 space-y-6 text-walnut-700 leading-relaxed">
        <p>
          Sharma Furniture House (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy. This page explains what information we
          collect through this website and how it is used.
        </p>

        <h2 className="font-display text-xl font-semibold text-walnut-900">Information We Collect</h2>
        <p>
          When you submit an inquiry through our contact form, we collect the information you provide — such as
          your name, phone number, email address, city, and details about your project or furniture requirement.
        </p>

        <h2 className="font-display text-xl font-semibold text-walnut-900">How We Use Your Information</h2>
        <p>
          We use the information you provide solely to respond to your inquiry, discuss your requirements, and
          provide quotations or updates related to your project. We do not sell or rent your personal information
          to third parties.
        </p>

        <h2 className="font-display text-xl font-semibold text-walnut-900">Data Storage</h2>
        <p>
          Inquiry details are stored securely in our database and are accessible only to authorized administrators
          of Sharma Furniture House.
        </p>

        <h2 className="font-display text-xl font-semibold text-walnut-900">Contact Us</h2>
        <p>
          If you have questions about this policy or wish to have your information removed from our records, please
          contact us using the details on our Contact page.
        </p>
      </div>
    </div>
  );
}
