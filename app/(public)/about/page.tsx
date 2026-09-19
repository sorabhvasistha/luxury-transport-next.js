// app/(public)/about/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'About Us | LuxeRide Transport',
  description: 'Learn about our commitment to luxury, safety, and providing the ultimate private chauffeur experience.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <header className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Setting the Standard in Luxury</h1>
        <p className="text-zinc-400 text-lg">
          Founded on the principles of punctuality, privacy, and unparalleled comfort.
        </p>
      </header>

      <div className="space-y-12 text-zinc-300 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p>
            At LuxeRide Transport, we believe that the journey should be as remarkable as the destination. We bridge the gap between high-end logistics and personalized hospitality. Our mission is to provide seamless, secure, and stress-free transportation for discerning clients who value their time and comfort above all else.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-zinc-800">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">The Fleet</h3>
            <p className="text-sm text-zinc-400">
              We exclusively operate late-model luxury sedans and premium executive SUVs. Every vehicle in our fleet is meticulously inspected daily, rigorously detailed, and equipped with modern amenities to ensure your absolute comfort.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-3">The Chauffeurs</h3>
            <p className="text-sm text-zinc-400">
              Our drivers are more than just chauffeurs; they are trained security professionals and local logistics experts. Fully vetted, background-checked, and bound by strict confidentiality agreements, they provide discreet and intuitive service.
            </p>
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Why Choose Us?</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-white mr-3">✓</span>
              <span><strong>Guaranteed Punctuality:</strong> We arrive early so you never run late.</span>
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">✓</span>
              <span><strong>Absolute Discretion:</strong> Privacy is paramount. What happens in the car stays in the car.</span>
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">✓</span>
              <span><strong>Transparent Pricing:</strong> No hidden fees, surge pricing, or unexpected charges.</span>
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3">✓</span>
              <span><strong>24/7 Availability:</strong> Our dispatch team operates around the clock to support your schedule.</span>
            </li>
          </ul>
        </section>
      </div>

      <div className="mt-16 text-center">
        <Link href="/fleet" className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-zinc-200 transition-colors inline-block">
          View Our Fleet
        </Link>
      </div>
    </div>
  );
}