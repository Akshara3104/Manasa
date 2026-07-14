import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';

export const metadata = {
  title: 'Manasa Dairy — Pure. Fresh. Trusted.',
  description: 'Manasa Dairy delivers farm-fresh, quality-tested dairy products. Verify authenticity with our QR code system.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <SiteNav />
        <main className="min-h-[70vh]">{children}</main>
        <SiteFooter />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
