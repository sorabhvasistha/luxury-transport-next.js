// app/(public)/checkout/[id]/page.tsx
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import CheckoutClient from './CheckoutClient';

const prisma = new PrismaClient();

export default async function CheckoutPage({ 
  params 
}: { 
  // Next.js 15 requires params to be awaited as a Promise
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  
  // Verify the inquiry exists
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: resolvedParams.id }
  });

  // Block access if the invoice doesn't exist, isn't priced, or is already paid
  if (!inquiry || !inquiry.price) {
    return notFound();
  }

  if (inquiry.paymentStatus === 'PAID') {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Invoice Already Paid</h2>
        <p className="text-zinc-400">This reservation has already been successfully processed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 mb-8">
        <h1 className="text-xl font-bold border-b border-zinc-800 pb-4 mb-4">
          Invoice Summary
        </h1>
        <div className="flex justify-between items-center mb-2">
          <span className="text-zinc-400">Reservation Name</span>
          <span className="font-medium text-white">{inquiry.clientName}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-zinc-400">Vehicle</span>
          <span className="font-medium text-white">{inquiry.vehicleChoice}</span>
        </div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-zinc-400">Total Amount Due</span>
          <span className="text-2xl font-bold text-white">₹{inquiry.price}</span>
        </div>
      </div>

      {/* Mounts the auto-submitting client form */}
      <CheckoutClient inquiryId={inquiry.id} />
    </div>
  );
}