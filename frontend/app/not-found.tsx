import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-32 text-center lg:px-8">
      <p className="font-display text-6xl font-semibold text-brass-500">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-walnut-900">Page not found</h1>
      <p className="mt-3 text-walnut-700">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-sm bg-walnut-900 px-6 py-3 font-medium text-linen hover:bg-brass-600 transition-colors focus-ring"
      >
        Back to Home
      </Link>
    </div>
  );
}
