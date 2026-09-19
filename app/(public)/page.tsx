// app/(public)/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-zinc-950 z-10" />
      
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Arrive in <span className="text-zinc-400">Absolute</span> Luxury.
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
          Experience premium private transportation with our fleet of high-end sedans and executive SUVs. Professional chauffeurs, impeccable service.
        </p>
        <Link 
          href="/fleet" 
          className="bg-white text-black px-8 py-4 text-lg font-semibold rounded-full hover:bg-zinc-200 transition-all inline-block"
        >
          Explore the Fleet
        </Link>
      </div>
    </section>
  );
}