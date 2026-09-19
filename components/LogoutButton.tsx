// components/LogoutButton.tsx
'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="w-full text-left px-4 py-2 text-sm text-zinc-500 hover:text-white transition-colors"
    >
      Sign Out
    </button>
  );
}