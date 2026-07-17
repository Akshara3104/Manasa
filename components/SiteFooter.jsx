import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-blue-100 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <BrandLogo className="h-14 w-auto" color="#1E3A8A" />
          <p className="mt-4 text-sm text-slate-600">Farm-fresh dairy delivered with integrity. Every batch is quality-tested and QR-verified for authenticity.</p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-blue-900">Company</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/about" className="hover:text-blue-900">About Us</Link></li>
            <li><Link href="/quality" className="hover:text-blue-900">Quality Assurance</Link></li>
            <li><Link href="/gallery" className="hover:text-blue-900">Gallery</Link></li>
            <li><Link href="/contact" className="hover:text-blue-900">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-blue-900">Products</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>Fresh Milk</li>
            <li>Curd & Yogurt</li>
            <li>Butter & Ghee</li>
            <li>Paneer & Cheese</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-blue-900">Contact</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-blue-800" />PLOT NO:76, SY NO:1109/E, UPPARIGUDA (V), IBRAHIMPATNAM (M), R.R DIST</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-blue-800" />+91 7032996099</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-800" />info@manasadairy.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-blue-100 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Manasa Dairy. Pure. Fresh. Trusted.
      </div>
    </footer>
  );
}
