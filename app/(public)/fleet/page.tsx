// app/(public)/fleet/page.tsx
import { PrismaClient } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

// Initialize Prisma
const prisma = new PrismaClient();

// SEO Metadata
export const metadata = {
  title: 'Our Premium Fleet | LuxeRide Transport',
  description: 'Explore our collection of luxury sedans and premium SUVs available for private chauffeur services.',
};

// Next.js Server Component
export default async function FleetPage() {
  // Fetch available vehicles directly from the database
  const vehicles = await prisma.vehicle.findMany({
    where: { isAvailable: true },
    orderBy: { hourlyRate: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Our Fleet</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Meticulously maintained and driven by highly trained professionals. Choose the perfect vehicle for your journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="relative h-64 w-full">
              <Image 
                src={vehicle.imageUrl} 
                alt={vehicle.name} 
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                priority={vehicle.hourlyRate === 200} // Load the most expensive/featured car first
              />
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-zinc-300 border border-zinc-700">
                {vehicle.class}
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-2xl font-bold mb-2">{vehicle.name}</h2>
              <p className="text-zinc-400 text-sm mb-6 flex-grow">{vehicle.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-zinc-300 mb-6 border-y border-zinc-800 py-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-500">👤</span> {vehicle.passengers} Max
                </div>
                <div className="w-px h-4 bg-zinc-800"></div>
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-500">💼</span> {vehicle.luggage} Bags
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div>
                  <span className="text-2xl font-bold">${vehicle.hourlyRate}</span>
                  <span className="text-zinc-500 text-sm"> / hour</span>
                </div>
                <Link 
                  href={`/book?vehicle=${vehicle.id}`}
                  className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors"
                >
                  Reserve
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}