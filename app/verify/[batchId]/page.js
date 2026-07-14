'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, Milk, MapPin, Hash, AlertTriangle, ShieldCheck, Package } from 'lucide-react';

export default function VerifyBatchPage() {
  const { batchId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/verify/${batchId}`);
        const j = await res.json();
        setData(j);
      } catch {
        setData({ found: false, authentic: false, error: 'Network error' });
      } finally {
        setLoading(false);
      }
    })();
  }, [batchId]);

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-800" />
      </div>
    );
  }

  const authentic = data?.authentic;
  const found = data?.found;
  const b = data?.batch;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <div className={`overflow-hidden rounded-3xl border shadow-xl ${authentic ? 'border-emerald-200' : 'border-red-200'}`}>
        <div className={`p-8 text-white ${authentic ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>
          <div className="flex items-center gap-4">
            {authentic ? <CheckCircle2 className="h-14 w-14" /> : <XCircle className="h-14 w-14" />}
            <div>
              <h1 className="text-3xl font-bold">{authentic ? 'Authentic Product' : 'Product Not Found'}</h1>
              <p className="mt-1 text-white/90">{authentic ? 'This product is verified by Manasa Dairy.' : 'This QR code does not match any Manasa Dairy batch.'}</p>
            </div>
          </div>
        </div>

        {found && b ? (
          <Card className="rounded-none border-0">
            <CardContent className="p-8">
              <div className="flex items-center gap-2">
                <Milk className="h-5 w-5 text-blue-800" />
                <span className="text-xs uppercase tracking-widest text-blue-800">Manasa Dairy</span>
              </div>
              <h2 className="mt-2 text-2xl font-bold text-blue-950">{b.productName}</h2>
              <div className="mt-1 flex flex-wrap gap-2">
                <Badge className="bg-blue-900 hover:bg-blue-800">{b.batchNumber}</Badge>
                <Badge className="bg-emerald-600 hover:bg-emerald-700">Verified</Badge>
              </div>

              <div className="mt-8 rounded-2xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-900 text-white shadow-lg">
                    <MapPin className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest text-blue-800">Manufactured At</div>
                    <div className="mt-1 text-xl font-bold text-blue-950">{b.manufacturingLocation}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Row icon={Package} label="Product" value={b.productName} />
                <Row icon={Hash} label="Batch Number" value={b.batchNumber} />
              </div>

              <div className="mt-6 flex items-center gap-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                <ShieldCheck className="h-5 w-5 text-blue-800" />
                Verified against Manasa Dairy's secure batch registry.
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white p-8">
            <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-800">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <div>
                <div className="font-semibold">Warning: This product may not be genuine.</div>
                <div className="mt-1">If you purchased this claiming to be Manasa Dairy, please contact us immediately at hello@manasadairy.com.</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/verify"><Button variant="outline" className="border-blue-200 text-blue-800 hover:bg-blue-50">Verify another</Button></Link>
        <Link href="/contact"><Button variant="outline" className="border-blue-200 text-blue-800 hover:bg-blue-50">Report an issue</Button></Link>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value, className = '' }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border border-blue-100 bg-white p-4 ${className}`}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
        <div className="mt-0.5 truncate font-medium text-blue-950">{value}</div>
      </div>
    </div>
  );
}
