// app/(admin)/layout.tsx
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Fetch the count of pending leads for the notification badge
  const pendingCount = await prisma.inquiry.count({
    where: { status: 'PENDING' }
  });

  return (
    <div className="min-h-screen flex bg-zinc-900 text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold tracking-tighter">
            LUXE<span className="text-zinc-500">ADMIN</span>
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
            Overview
          </Link>
          
          {/* Booking Leads Link with Notification Badge */}
          <Link href="/admin/leads" className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
            <span>Booking Leads</span>
            {pendingCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                {pendingCount}
              </span>
            )}
          </Link>
          
          <Link href="/admin/fleet" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
            Manage Fleet
          </Link>
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}