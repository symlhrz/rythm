"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/log", label: "Log Entry" },
  { href: "/history", label: "History" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-white">
      <nav className="max-w-3xl mx-auto px-4 flex items-center gap-1 overflow-x-auto">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                active
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
