import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-32 text-center">
      <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-400">
        <span className="text-4xl" aria-hidden="true">!</span>
      </div>
      <h1 className="mb-4 text-4xl font-bold tracking-tight">Payment Unsuccessful</h1>
      <p className="mb-10 text-lg text-zinc-400">
        We could not complete the payment. Please try again or contact our concierge team for help with your reservation.
      </p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/book" className="rounded-full bg-white px-8 py-3 font-semibold text-black transition-colors hover:bg-zinc-200">
          Try Again
        </Link>
        <Link href="/" className="rounded-full border border-zinc-700 px-8 py-3 font-semibold text-white transition-colors hover:border-zinc-500">
          Return Home
        </Link>
      </div>
    </section>
  );
}
