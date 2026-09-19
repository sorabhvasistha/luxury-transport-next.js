// app/(admin)/admin/leads/page.tsx
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export default async function AdminLeadsPage() {
  // Fetch all inquiries, newest first
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Server Action: Update Inquiry Status
  async function updateStatus(formData: FormData) {
    "use server";
    const id = formData.get('id') as string;
    const status = formData.get('status') as string;
    
    await prisma.inquiry.update({
      where: { id },
      data: { status }
    });
    
    revalidatePath('/admin/leads');
    revalidatePath('/admin/dashboard');
  }

  // Server Action: Delete Inquiry
  async function deleteInquiry(formData: FormData) {
    "use server";
    const id = formData.get('id') as string;
    
    await prisma.inquiry.delete({ where: { id } });
    
    revalidatePath('/admin/leads');
    revalidatePath('/admin/dashboard');
  }

  // Helper to format dates cleanly
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Booking Leads</h1>
        <p className="text-zinc-400 text-sm">Review, confirm, or reject incoming reservation requests.</p>
      </header>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400">
              <tr>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Client Info</th>
                <th className="px-6 py-4 font-medium">Trip Details</th>
                <th className="px-6 py-4 font-medium">Vehicle / Pax</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No booking inquiries found.
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-zinc-900/50 transition-colors">
                    
                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        inquiry.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        inquiry.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                      }`}>
                        {inquiry.status}
                      </span>
                      <div className="mt-2 text-xs text-zinc-500">
                        Received: {formatDate(inquiry.createdAt)}
                      </div>
                    </td>

                    {/* Client Info */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{inquiry.clientName}</div>
                      <div className="text-zinc-400 mt-0.5">{inquiry.email}</div>
                      <div className="text-zinc-400">{inquiry.phone}</div>
                    </td>

                    {/* Trip Details */}
                    <td className="px-6 py-4">
                      <div className="text-white mb-1">
                        <span className="text-zinc-500 text-xs uppercase tracking-wider block mb-0.5">Pickup Date</span>
                        {formatDate(inquiry.pickupDate)}
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400">
                        <span className="truncate max-w-[120px]" title={inquiry.pickupLocation}>{inquiry.pickupLocation}</span>
                        <span>→</span>
                        <span className="truncate max-w-[120px]" title={inquiry.dropoffLocation}>{inquiry.dropoffLocation}</span>
                      </div>
                    </td>

                    {/* Vehicle Choice */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{inquiry.vehicleChoice || 'No Preference'}</div>
                      <div className="text-zinc-400 mt-0.5">{inquiry.passengers} Passenger(s)</div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Status Update Form */}
                        <form action={updateStatus} className="flex gap-2">
                          <input type="hidden" name="id" value={inquiry.id} />
                          {inquiry.status !== 'CONFIRMED' && (
                            <button 
                              type="submit" 
                              name="status" 
                              value="CONFIRMED"
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-green-500/20 hover:text-green-500 text-zinc-300 text-xs font-medium rounded transition-colors"
                            >
                              Confirm
                            </button>
                          )}
                          {inquiry.status !== 'REJECTED' && (
                            <button 
                              type="submit" 
                              name="status" 
                              value="REJECTED"
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-red-500/20 hover:text-red-500 text-zinc-300 text-xs font-medium rounded transition-colors"
                            >
                              Reject
                            </button>
                          )}
                        </form>

                        <div className="w-px h-4 bg-zinc-700 mx-1"></div>

                        {/* Delete Form */}
                        <form action={deleteInquiry}>
                          <input type="hidden" name="id" value={inquiry.id} />
                          <button 
                            type="submit" 
                            className="px-3 py-1.5 text-zinc-500 hover:text-red-500 text-xs font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}