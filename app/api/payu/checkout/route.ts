// app/api/payu/checkout/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const inquiryId = typeof body?.inquiryId === 'string' ? body.inquiryId : '';

    if (!inquiryId) {
      return NextResponse.json({ error: "Inquiry ID is required" }, { status: 400 });
    }

    const inquiry = await prisma.inquiry.findUnique({ where: { id: inquiryId } });
    if (!inquiry || inquiry.price === null || inquiry.price <= 0) {
      return NextResponse.json({ error: "Invalid inquiry or price not set" }, { status: 400 });
    }

    if (inquiry.paymentStatus === 'PAID') {
      return NextResponse.json({ error: "This inquiry has already been paid" }, { status: 409 });
    }

    const key = process.env.PAYU_MERCHANT_KEY;
    const salt = process.env.PAYU_MERCHANT_SALT;
    const payuUrl = process.env.PAYU_URL;
    const appUrl = process.env.NEXTAUTH_URL;

    if (!key || !salt || !payuUrl || !appUrl) {
      console.error("PayU checkout is not configured");
      return NextResponse.json({ error: "Payment gateway is not configured" }, { status: 503 });
    }

    const txnid = `TXN_${inquiry.id}_${Date.now()}`; // Unique transaction ID
    const amount = inquiry.price.toString();
    const productinfo = "Luxury Transport Reservation";
    const firstname = inquiry.clientName;
    const email = inquiry.email;
    
    // PayU Hash Formula: sha512(key|txnid|amount|productinfo|firstname|email|||||||||||salt)
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    return NextResponse.json({
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone: inquiry.phone,
      hash,
      surl: `${appUrl}/api/payu/success`, // Success callback
      furl: `${appUrl}/api/payu/failure`, // Failure callback
      url: payuUrl,
    });

  } catch (error) {
    console.error("PayU Checkout Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}