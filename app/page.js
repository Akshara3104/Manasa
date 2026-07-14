import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, QrCode, Leaf, Milk, Truck, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="absolute inset-0 -z-10 opacity-40">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-200 blur-3xl" />
          <div className="absolute top-40 -right-24 h-96 w-96 rounded-full bg-sky-200 blur-3xl" />
        </div>
        <div className="container mx-auto grid gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
              <ShieldCheck className="h-3.5 w-3.5" /> QR-Verified Authenticity
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-blue-950 md:text-6xl">
              Farm-fresh dairy, <span className="text-blue-800">trusted at every sip.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Manasa Dairy brings you pure, quality-tested milk and dairy products — every batch traceable
              with a unique QR code you can verify in seconds.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/verify">
                <Button size="lg" className="bg-blue-900 hover:bg-blue-800">
                  <QrCode className="mr-2 h-5 w-5" /> Verify a Product
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="border-blue-300 text-blue-800 hover:bg-blue-50">
                  Explore Products <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { k: '25+', v: 'Years of trust' },
                { k: '100%', v: 'Quality tested' },
                { k: '50K+', v: 'Happy families' }
              ].map((s) => (
                <div key={s.v} className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
                  <div className="text-2xl font-bold text-blue-800">{s.k}</div>
                  <div className="text-xs text-slate-500">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border-8 border-white shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1597616456860-df68738ec8e4?auto=format&fit=crop&w=1200&q=80"
                alt="Dairy cow on green pasture"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-blue-100 bg-white p-4 shadow-xl md:flex md:items-center md:gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm font-semibold text-blue-900">Every batch QR-verified</div>
                <div className="text-xs text-slate-500">Scan. Trust. Enjoy.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-blue-950 md:text-4xl">Why Manasa Dairy?</h2>
          <p className="mt-3 text-slate-600">Purity backed by process — from healthy cows to your kitchen.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            { icon: Leaf, title: 'Farm Fresh', desc: 'Sourced from ethically-raised, grass-fed cows.' },
            { icon: Award, title: 'Lab Tested', desc: 'Every batch passes 20+ quality parameters.' },
            { icon: QrCode, title: 'QR Verified', desc: 'Scan the code — trace the origin instantly.' },
            { icon: Truck, title: 'Cold-chain', desc: 'Delivered fresh with unbroken cold-chain.' }
          ].map((f) => (
            <Card key={f.title} className="border-blue-100">
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-blue-950">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* QR CTA */}
      <section className="bg-gradient-to-r from-blue-900 to-sky-600 py-16 text-white">
        <div className="container mx-auto grid gap-8 px-4 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">Scan. Verify. Trust.</h2>
            <p className="mt-3 text-blue-50">
              Every pack of Manasa Dairy comes with a unique QR code. Scan it to instantly view the batch,
              manufacturing date, location and authenticity status.
            </p>
            <ul className="mt-5 space-y-2 text-blue-50">
              <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0" /> Product name & batch number</li>
              <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0" /> Manufacturing date & location</li>
              <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0" /> Expiry date & authenticity status</li>
            </ul>
            <div className="mt-6">
              <Link href="/verify">
                <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50">
                  <QrCode className="mr-2 h-5 w-5" /> Go to Verification
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="rounded-3xl bg-white p-8 text-blue-950 shadow-2xl">
              <QrCode className="h-40 w-40" />
              <p className="mt-4 text-center text-sm font-medium">Look for this on every pack</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS PREVIEW */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-blue-950 md:text-4xl">Our Products</h2>
            <p className="mt-2 text-slate-600">Wholesome, everyday essentials from our farms.</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-blue-800 hover:underline">View all →</Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: 'Toned Milk', img: 'https://images.unsplash.com/photo-1567011345445-fd175f248019?auto=format&fit=crop&w=800&q=80' },
            { name: 'Fresh Curd', img: 'https://images.unsplash.com/photo-1609983507346-8d282af67df7?auto=format&fit=crop&w=800&q=80' },
            { name: 'Pure Ghee', img: 'https://images.unsplash.com/photo-1592241140495-4f376ad04977?auto=format&fit=crop&w=800&q=80' },
            { name: 'Paneer', img: 'https://images.unsplash.com/photo-1618932346918-003de628dd37?auto=format&fit=crop&w=800&q=80' }
          ].map((p) => (
            <Card key={p.name} className="group overflow-hidden border-blue-100">
              <div className="relative aspect-square overflow-hidden">
                <Image src={p.img} alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-blue-800"><Milk className="h-4 w-4" /><span className="text-xs uppercase tracking-wider">Manasa</span></div>
                <h3 className="mt-1 font-semibold text-blue-950">{p.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
