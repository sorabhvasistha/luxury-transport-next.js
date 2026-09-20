// app/api/payu/failure/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const formData = await req.formData();
  
  // PayU sends the transaction ID back even on failure
  const txnid = formData.get('txnid') as string;

  if (txnid) {
    // Extract our database ID from the TXN_id_timestamp format
    const inquiryId = txnid.split('_')[1];

    if (inquiryId) {
      // Mark the invoice as failed in the database
      await prisma.inquiry.update({
        where: { id: inquiryId },
        data: { paymentStatus: 'FAILED' }
      });
    }
  }

  // Redirect the user to a public failure page so they can try again
  return NextResponse.redirect(new URL('/payment-failed', req.url), 303);
}