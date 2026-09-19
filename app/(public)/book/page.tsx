// app/(public)/book/page.tsx
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import SubmitButton from '@/components/SubmitButton';

const prisma = new PrismaClient();

export const metadata = {
  title: 'Request a Reservation | LuxeRide Transport',
  description: 'Book your premium private transportation and chauffeur service.',
};

export default async function BookPage({
  searchParams,
}: {
  // In Next.js 15, searchParams must be awaited as a Promise
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const isSuccess = params?.success === 'true';
  const errorMessage = params?.error as string;
  const preselectedVehicle = params?.vehicle as string || '';

  const vehicles = await prisma.vehicle.findMany({
    where: { isAvailable: true },
    orderBy: { hourlyRate: 'desc' },
  });

  // SERVER ACTION: Handle form submission with Error Handling
  async function submitInquiry(formData: FormData) {
    "use server";
    
    let hasError = false;
    
    try {
      const rawDate = formData.get('pickupDate') as string;
      const pickupDate = new Date(rawDate);

      await prisma.inquiry.create({
        data: {
          clientName: formData.get('clientName') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          pickupDate: pickupDate,
          pickupLocation: formData.get('pickupLocation') as string,
          dropoffLocation: formData.get('dropoffLocation') as string,
          passengers: Number(formData.get('passengers')),
          vehicleChoice: formData.get('vehicleChoice') as string,
        }
      });
      
      revalidatePath('/admin', 'layout'); 
    } catch (error) {
      console.error("Database Error:", error);
      hasError = true;
    }

    // Redirects must happen OUTSIDE the try/catch block in Next.js
    if (hasError) {
      redirect('/book?error=Failed to process request. Please try again.');
    } else {
      redirect('/book?success=true');
    }
  }

  // SUCCESS STATE UI
  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Request Received</h1>
        <p className="text-zinc-400 text-lg mb-10">
          Thank you for choosing LuxeRide. Our concierge team is reviewing your trip details and will contact you shortly to confirm your reservation.
        </p>
        <Link href="/" className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-zinc-200 transition-colors">
          Return to Homepage
        </Link>
      </div>
    );
  }

  // BOOKING FORM UI
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Book Your Journey</h1>
        <p className="text-zinc-400 text-lg">Provide your trip details below, and we will arrange the perfect vehicle for your needs.</p>
      </div>

      {errorMessage && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center">
          {errorMessage}
        </div>
      )}

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 md:p-10">
        <form action={submitInquiry} className="space-y-8">
          
          {/* Section 1: Contact Information */}
          <div>
            <h3 className="text-lg font-semibold border-b border-zinc-800 pb-2 mb-6">1. Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Full Name</label>
                <input name="clientName" required className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
                <input name="email" type="email" required className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Phone Number</label>
                <input name="phone" type="tel" required className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" />
              </div>
            </div>
          </div>

          {/* Section 2: Trip Details */}
          <div>
            <h3 className="text-lg font-semibold border-b border-zinc-800 pb-2 mb-6">2. Trip Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Pickup Date & Time</label>
                <input name="pickupDate" type="datetime-local" required className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors [color-scheme:dark]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Pickup Location</label>
                <input name="pickupLocation" required placeholder="Address or Airport Code" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Drop-off Location</label>
                <input name="dropoffLocation" required placeholder="Address or Airport Code" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" />
              </div>
            </div>
          </div>

          {/* Section 3: Vehicle Preferences */}
          <div>
            <h3 className="text-lg font-semibold border-b border-zinc-800 pb-2 mb-6">3. Vehicle Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Passenger Count</label>
                <input name="passengers" type="number" min="1" max="14" required defaultValue="1" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Preferred Vehicle</label>
                <select name="vehicleChoice" defaultValue={preselectedVehicle} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none">
                  <option value="No Preference">No Preference - Assign Best Fit</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.name}>{v.name} ({v.class})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}