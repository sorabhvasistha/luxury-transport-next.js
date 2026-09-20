// app/api/payu/success/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const formData = await req.formData();
  
  const status = formData.get('status') as string;
  const txnid = formData.get('txnid') as string;
  const amount = formData.get('amount') as string;
  const productinfo = formData.get('productinfo') as string;
  const firstname = formData.get('firstname') as string;
  const email = formData.get('email') as string;
  const hash = formData.get('hash') as string;
  const key = formData.get('key') as string;

  const salt = process.env.PAYU_MERCHANT_SALT!;

  // Verify the reverse hash: sha512(salt|status|||||||||||email|firstname|productinfo|amount|txnid|key)
  const reverseHashString = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  const calculatedHash = crypto.createHash('sha512').update(reverseHashString).digest('hex');

  if (calculatedHash === hash && status === 'success') {
    // Extract the original Inquiry ID from our txnid format (TXN_inquiryId_timestamp)
    const inquiryId = txnid.split('_')[1];

    await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { paymentStatus: 'PAID', transactionId: txnid }
    });

    // Redirect the user to a public success page
    return NextResponse.redirect(new URL('/payment-success', req.url), 303);
  } else {
    return NextResponse.redirect(new URL('/payment-failed', req.url), 303);
  }
}