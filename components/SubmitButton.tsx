// components/SubmitButton.tsx
'use client';

import { useFormStatus } from 'react-dom';

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`w-full font-bold text-lg rounded-xl px-4 py-4 transition-colors mt-8 ${
        pending 
          ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' 
          : 'bg-white text-black hover:bg-zinc-200'
      }`}
    >
      {pending ? 'Processing Request...' : 'Submit Reservation Request'}
    </button>
  );
}