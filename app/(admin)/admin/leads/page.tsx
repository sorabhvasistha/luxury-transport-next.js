// app/(admin)/admin/leads/page.tsx
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export default async function AdminLeadsPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Server Action: Update Inquiry Status
  async function updateStatus(formData: FormData) {
    "use server";
    const id = formData.get('id') as string;
    const status = formData.get('status') as string;
    
    await prisma.inquiry.update({ where: { id }, data: { status } });
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

  // Server Action: Set Price
  async function setPrice(formData: FormData) {
    "use server";
    const id = formData.get('id') as string;
    const price = Number(formData.get('price'));
    
    await prisma.inquiry.update({
      where: { id },
      data: { price }
    });
    revalidatePath('/admin/leads');
  }

  // Server Action: Send Payment Email
  async function sendPaymentLink(formData: FormData) {
    "use server";
    const id = formData.get('id') as string;
    const email = formData.get('email') as string;
    const clientName = formData.get('clientName') as string;
    
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const checkoutUrl = `${process.env.NEXTAUTH_URL}/checkout/${id}`;

      await transporter.sendMail({
        from: `"LuxeRide Billing" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Invoice Ready: Pay for your LuxeRide Reservation`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #111827;">Payment Requested</h2>
            <p>Hello ${clientName},</p>
            <p>Your reservation request has been reviewed and approved. Please click the secure link below to complete your payment via PayU and finalize your booking.</p>
            <div style="margin-top: 30px; margin-bottom: 30px; text-align: center;">
              <a href="${checkoutUrl}" style="background-color: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Proceed to Payment</a>
            </div>
            <p style="color: #6b7280; font-size: 12px;">If the button does not work, copy and paste this link into your browser: <br/>${checkoutUrl}</p>
          </div>
        `,
      });
      
      // Auto-confirm the booking once the payment link is dispatched
      await prisma.inquiry.update({
         where: { id },
         data: { status: 'CONFIRMED' }
      });
      
      revalidatePath('/admin/leads');
    } catch (error) {
      console.error("Failed to send payment email:", error);
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Booking Leads</h1>
        <p className="text-zinc-400 text-sm">Review requests, set pricing, and send secure checkout links.</p>
      </header>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400">
              <tr>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Client Info</th>
                <th className="px-6 py-4 font-medium">Trip & Vehicle</th>
                <th className="px-6 py-4 font-medium">Payment</th>
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
                    <td className="px-6 py-4 align-top">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        inquiry.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        inquiry.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                      }`}>
                        {inquiry.status}
                      </span>
                      <div className="mt-2 text-xs text-zinc-500">
                        Received:<br/>{formatDate(inquiry.createdAt)}
                      </div>
                    </td>

                    {/* Client Info */}
                    <td className="px-6 py-4 align-top">
                      <div className="font-medium text-white">{inquiry.clientName}</div>
                      <div className="text-zinc-400 mt-0.5">{inquiry.email}</div>
                      <div className="text-zinc-400">{inquiry.phone}</div>
                    </td>

                    {/* Trip Details & Vehicle (Merged to save space) */}
                    <td className="px-6 py-4 align-top">
                      <div className="text-white mb-1">
                        <span className="text-zinc-500 text-xs uppercase tracking-wider block mb-0.5">Pickup Date</span>
                        {formatDate(inquiry.pickupDate)}
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400 mb-2">
                        <span className="truncate max-w-[120px]" title={inquiry.pickupLocation}>{inquiry.pickupLocation}</span>
                        <span>→</span>
                        <span className="truncate max-w-[120px]" title={inquiry.dropoffLocation}>{inquiry.dropoffLocation}</span>
                      </div>
                      <div className="text-xs text-zinc-400">
                        <span className="text-white font-medium">{inquiry.vehicleChoice || 'No Preference'}</span> • {inquiry.passengers} Pax
                      </div>
                    </td>

                    {/* Pricing & Checkout Link */}
                    <td className="px-6 py-4 align-top">
                      {!inquiry.price ? (
                        <form action={setPrice} className="flex flex-col gap-2">
                          <input type="hidden" name="id" value={inquiry.id} />
                          <input type="number" name="price" required placeholder="₹ 0" className="w-24 bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-white transition-colors" />
                          <button type="submit" className="w-24 bg-white text-black text-xs font-bold px-3 py-1.5 rounded hover:bg-zinc-200 transition-colors">
                            Set Price
                          </button>
                        </form>
                      ) : (
                        <div>
                          <div className="font-bold text-lg text-white mb-1">₹{inquiry.price}</div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            inquiry.paymentStatus === 'PAID' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            inquiry.paymentStatus === 'FAILED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                          }`}>
                            {inquiry.paymentStatus}
                          </span>
                          
                          {/* Only show email button if they haven't paid yet */}
                          {inquiry.paymentStatus !== 'PAID' && (
                            <form action={sendPaymentLink} className="mt-3">
                              <input type="hidden" name="id" value={inquiry.id} />
                              <input type="hidden" name="email" value={inquiry.email} />
                              <input type="hidden" name="clientName" value={inquiry.clientName} />
                              <button type="submit" className="text-xs flex items-center justify-center w-24 bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 px-2 py-1.5 rounded transition-colors">
                                Send Link ✉️
                              </button>
                            </form>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right align-top">
                      <div className="flex flex-col items-end gap-3">
                        <form action={updateStatus} className="flex gap-2">
                          <input type="hidden" name="id" value={inquiry.id} />
                          {inquiry.status !== 'CONFIRMED' && (
                            <button type="submit" name="status" value="CONFIRMED" className="px-3 py-1.5 bg-zinc-800 hover:bg-green-500/20 hover:text-green-500 text-zinc-300 text-xs font-medium rounded transition-colors">
                              Confirm
                            </button>
                          )}
                          {inquiry.status !== 'REJECTED' && (
                            <button type="submit" name="status" value="REJECTED" className="px-3 py-1.5 bg-zinc-800 hover:bg-red-500/20 hover:text-red-500 text-zinc-300 text-xs font-medium rounded transition-colors">
                              Reject
                            </button>
                          )}
                        </form>

                        <form action={deleteInquiry}>
                          <input type="hidden" name="id" value={inquiry.id} />
                          <button type="submit" className="px-3 py-1.5 text-zinc-500 hover:text-red-500 text-xs font-medium transition-colors">
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