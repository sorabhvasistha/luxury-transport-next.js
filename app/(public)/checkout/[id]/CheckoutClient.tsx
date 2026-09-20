// app/(public)/checkout/[id]/CheckoutClient.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

type PayUCheckoutData = {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  hash: string;
  url: string;
};

export default function CheckoutClient({ inquiryId }: { inquiryId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [payuData, setPayuData] = useState<PayUCheckoutData | null>(null);
  const [error, setError] = useState('');

  // 1. Fetch the hash and transaction data from our API
  useEffect(() => {
    async function fetchPaymentData() {
      try {
        const res = await fetch('/api/payu/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inquiryId })
        });
        const data = await res.json();

        if (res.ok) {
          setPayuData(data);
        } else {
          setError(data.error || 'Failed to initialize payment gateway.');
        }
      } catch {
        setError('A network error occurred while connecting to the payment gateway.');
      }
    }
    
    fetchPaymentData();
  }, [inquiryId]);

  // 2. Auto-submit the hidden form once PayU data is loaded
  useEffect(() => {
    if (payuData && formRef.current) {
      formRef.current.submit();
    }
  }, [payuData]);

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-6 rounded-xl max-w-md">
          <h2 className="text-xl font-bold mb-2">Payment Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="w-16 h-16 border-4 border-zinc-800 border-t-white rounded-full animate-spin mb-8"></div>
      <h2 className="text-2xl font-bold tracking-tight mb-3">Redirecting to Secure Payment...</h2>
      <p className="text-zinc-400 max-w-md">
        Please do not close or refresh this window. You are being securely transferred to PayU.
      </p>

      {/* Hidden form required by PayU */}
      {payuData && (
        <form ref={formRef} action={payuData.url} method="POST" className="hidden">
          <input type="hidden" name="key" value={payuData.key} />
          <input type="hidden" name="txnid" value={payuData.txnid} />
          <input type="hidden" name="amount" value={payuData.amount} />
          <input type="hidden" name="productinfo" value={payuData.productinfo} />
          <input type="hidden" name="firstname" value={payuData.firstname} />
          <input type="hidden" name="email" value={payuData.email} />
          <input type="hidden" name="phone" value={payuData.phone} />
          <input type="hidden" name="surl" value={payuData.surl} />
          <input type="hidden" name="furl" value={payuData.furl} />
          <input type="hidden" name="hash" value={payuData.hash} />
        </form>
      )}
    </div>
  );
}