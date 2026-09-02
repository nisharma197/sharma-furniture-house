import Link from "next/link";

export default function Footer() {
  const phone = process.env.NEXT_PUBLIC_PHONE || "+91-XXXXXXXXXX";
  const email = process.env.NEXT_PUBLIC_EMAIL || "info@sharmafurniturehouse.com";
  const address =
    process.env.NEXT_PUBLIC_ADDRESS || "203 Nandbag Colony, Near Marimata, Indore, Madhya Pradesh, India";

  return (
    <footer className="bg-walnut-900 text-linen">
      <div className="joinery-divider" />
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 grid gap-10 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold">Sharma Furniture House</p>
          <p className="mt-3 text-sm text-walnut-100/80 leading-relaxed">
            30+ years of custom carpentry and furniture manufacturing, built to order for homes and businesses across
            Indore.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brass-400">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-walnut-100/80">
            <li><Link href="/services" className="hover:text-brass-400 focus-ring">Services</Link></li>
            <li><Link href="/projects" className="hover:text-brass-400 focus-ring">Projects</Link></li>
            <li><Link href="/gallery" className="hover:text-brass-400 focus-ring">Gallery</Link></li>
            <li><Link href="/testimonials" className="hover:text-brass-400 focus-ring">Testimonials</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brass-400">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-walnut-100/80">
            <li><Link href="/about" className="hover:text-brass-400 focus-ring">About Us</Link></li>
            <li><Link href="/faqs" className="hover:text-brass-400 focus-ring">FAQs</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-brass-400 focus-ring">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-brass-400 focus-ring">Terms &amp; Conditions</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brass-400">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-walnut-100/80">
            <li>{address}</li>
            <li><a href={`tel:${phone}`} className="hover:text-brass-400 focus-ring">{phone}</a></li>
            <li><a href={`mailto:${email}`} className="hover:text-brass-400 focus-ring">{email}</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-walnut-700 py-5 text-center text-xs text-walnut-100/60">
        &copy; {new Date().getFullYear()} Sharma Furniture House. All rights reserved. &middot; Owner: Mr. Dhananjay
        Sharma
      </div>
    </footer>
  );
}
