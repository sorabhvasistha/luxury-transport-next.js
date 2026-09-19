// app/(admin)/admin/dashboard/page.tsx
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function DashboardPage() {
  // Fetch high-level statistics from the database
  const totalVehicles = await prisma.vehicle.count();
  const pendingInquiries = await prisma.inquiry.count({
    where: { status: 'PENDING' }
  });

  return (
    <div className="max-w-5xl">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-zinc-400 text-sm">Welcome back. Here is what&apos;s happening with your fleet today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl flex flex-col justify-between">
          <h3 className="text-zinc-400 font-medium text-sm mb-4">Pending Bookings</h3>
          <div className="flex items-end justify-between">
            <span className="text-5xl font-bold text-white">{pendingInquiries}</span>
            <Link href="/admin/leads" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              View Leads →
            </Link>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl flex flex-col justify-between">
          <h3 className="text-zinc-400 font-medium text-sm mb-4">Active Fleet Vehicles</h3>
          <div className="flex items-end justify-between">
            <span className="text-5xl font-bold text-white">{totalVehicles}</span>
            <Link href="/admin/fleet" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Manage Fleet →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}