import Link from "next/link";
import MobileMenu from "../../components/MobileMenu";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
      {/* Premium Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            LUXE<span className="text-zinc-500">RIDE</span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-zinc-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/fleet" className="hover:text-white transition-colors">Our Fleet</Link>
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link 
              href="/book" 
              className="bg-white text-black px-4 md:px-6 py-2.5 text-sm font-semibold rounded-full hover:bg-zinc-200 transition-colors"
            >
              Book Now
            </Link>
            <MobileMenu />
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black py-12 text-center text-zinc-500 text-sm">
        <p>© {new Date().getFullYear()} LuxeRide Transport. All rights reserved.</p>
      </footer>
    </div>
  );
}