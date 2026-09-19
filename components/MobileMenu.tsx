'use client';

import Link from "next/link";
import { useState } from "react";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/fleet", label: "Our Fleet" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        title={isOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-700 text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white"
      >
        <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
        <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
          <span className="h-0.5 w-full bg-current" />
          <span className="h-0.5 w-full bg-current" />
          <span className="h-0.5 w-full bg-current" />
        </span>
      </button>

      {isOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="absolute inset-x-0 top-full border-b border-zinc-800 bg-zinc-950 px-6 py-4 shadow-2xl"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
