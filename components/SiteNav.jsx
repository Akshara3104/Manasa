'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrandLogo from '@/components/BrandLogo';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/products', label: 'Products' },
  { href: '/quality', label: 'Quality' },
  { href: '/manufacturing-units', label: 'Manufacturing Units' },
  { href: '/contact', label: 'Contact' }
];

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <BrandLogo className="h-14 w-auto" color="#1E3A8A" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${active ? 'bg-blue-50 text-blue-900' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-900'}`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link href="/admin">
            <Button size="sm" className="ml-2 bg-blue-900 hover:bg-blue-800">Admin</Button>
          </Link>
        </nav>

        <button onClick={() => setOpen(!open)} className="lg:hidden rounded-md p-2 text-blue-900 hover:bg-blue-50">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-blue-100 bg-white lg:hidden">
          <div className="container mx-auto flex flex-col gap-1 p-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-900"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/admin" onClick={() => setOpen(false)}>
              <Button size="sm" className="w-full bg-blue-900 hover:bg-blue-800">Admin</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
