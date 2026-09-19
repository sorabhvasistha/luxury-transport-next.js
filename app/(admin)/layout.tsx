// app/(admin)/layout.tsx
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
          <Link 
            href="/admin/dashboard" 
            className="block px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            Overview
          </Link>
          <Link 
            href="/admin/leads" 
            className="block px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            Booking Leads
          </Link>
          <Link 
            href="/admin/fleet" 
            className="block px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            Manage Fleet
          </Link>
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <button className="w-full text-left px-4 py-2 text-sm text-zinc-500 hover:text-white transition-colors">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}