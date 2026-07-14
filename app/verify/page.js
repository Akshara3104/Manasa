'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, Search, ShieldCheck } from 'lucide-react';

export default function VerifyIndex() {
  const router = useRouter();
  const [code, setCode] = useState('');

  const go = (e) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    // Support both raw batch ID and full URL
    let id = trimmed;
    if (trimmed.includes('/verify/')) {
      id = trimmed.split('/verify/')[1].split(/[?#]/)[0];
    }
    router.push(`/verify/${id}`);
  };

  return (
    <div>
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-900 text-white shadow-lg">
            <QrCode className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-4xl font-bold text-blue-950 md:text-5xl">Verify Your Product</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">Scan the QR on your pack or paste the batch ID below to instantly verify authenticity.</p>
        </div>
      </section>

      <section className="container mx-auto max-w-2xl px-4 py-12">
        <Card className="border-blue-100">
          <CardContent className="p-6">
            <form onSubmit={go} className="flex flex-col gap-3 sm:flex-row">
              <Input
                placeholder="Paste batch ID or verification URL"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="bg-blue-900 hover:bg-blue-800">
                <Search className="mr-2 h-4 w-4" /> Verify
              </Button>
            </form>
            <p className="mt-3 text-xs text-slate-500">Tip: scanning the QR on your product automatically opens the verification page.</p>
          </CardContent>
        </Card>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { t: 'Scan', d: 'Use any QR scanner app.' },
            { t: 'Verify', d: 'View batch details instantly.' },
            { t: 'Trust', d: 'Buy with total confidence.' }
          ].map((s, i) => (
            <Card key={s.t} className="border-blue-100">
              <CardContent className="p-4 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-bold">{i + 1}</div>
                <div className="mt-2 font-semibold text-blue-950">{s.t}</div>
                <div className="text-xs text-slate-600">{s.d}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
