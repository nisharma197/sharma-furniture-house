"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/gallery", label: "Gallery" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-linen/95 backdrop-blur border-b border-walnut-100">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-walnut-900 focus-ring">
          Sharma <span className="text-brass-500">Furniture</span> House
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-walnut-700 hover:text-brass-600 transition-colors focus-ring"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/contact"
          className="hidden rounded-sm bg-walnut-900 px-5 py-2.5 text-sm font-medium text-linen hover:bg-brass-600 transition-colors lg:inline-block focus-ring"
        >
          Get a Quote
        </Link>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="lg:hidden text-walnut-900 focus-ring p-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <ul className="lg:hidden border-t border-walnut-100 px-5 py-4 space-y-3 bg-linen">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block text-sm font-medium text-walnut-700 py-1 focus-ring"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-block rounded-sm bg-walnut-900 px-5 py-2.5 text-sm font-medium text-linen focus-ring"
            >
              Get a Quote
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
