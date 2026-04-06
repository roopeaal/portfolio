import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-24">
      <div>
        <p className="route-label text-xs uppercase text-[var(--text-soft)]">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">This route does not exist.</h1>
        <p className="mt-4 max-w-xl text-[var(--text-secondary)]">
          The page could not be found. Return to the homepage topology to continue browsing.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-medium shadow-[var(--shadow-soft)] transition hover:border-[var(--accent-line)] hover:text-[var(--accent)]"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
