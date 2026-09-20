import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-32 text-center">
      <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-500">
        <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="mb-4 text-4xl font-bold tracking-tight">Payment Successful</h1>
      <p className="mb-10 text-lg text-zinc-400">
        Your payment has been received. Our concierge team will follow up with your reservation details shortly.
      </p>
      <Link href="/" className="inline-block rounded-full bg-white px-8 py-3 font-semibold text-black transition-colors hover:bg-zinc-200">
        Return to Homepage
      </Link>
    </section>
  );
}
