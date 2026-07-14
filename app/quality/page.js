import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { FlaskConical, ShieldCheck, ThermometerSnowflake, Microscope, ClipboardCheck, Droplets } from 'lucide-react';

export default function QualityPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-blue-950 md:text-5xl">Quality Assurance</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">Purity you can taste — verified by science, honored by tradition.</p>
        </div>
      </section>

      <section className="container mx-auto grid gap-10 px-4 py-16 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
          <Image src="https://images.unsplash.com/photo-1570723989345-3a537f60a9c5?auto=format&fit=crop&w=1200&q=80" alt="Lab testing" fill className="object-cover" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-blue-950">20+ Quality Checks. Every Batch.</h2>
          <p className="mt-4 text-slate-600">
            From on-farm milk collection to final packaging, our dairy passes through a rigorous multi-stage
            quality process — including fat & SNF analysis, adulteration tests, microbial screening and
            cold-chain verification. Only when every parameter is met do we assign a batch its unique QR code.
          </p>
        </div>
      </section>

      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-blue-950">Our Quality Process</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: Droplets, t: 'Milk Collection', d: 'Chilled at source within 4 hours of milking.' },
              { icon: FlaskConical, t: 'Lab Analysis', d: 'Fat, SNF, adulterants, antibiotic residues.' },
              { icon: Microscope, t: 'Microbial Testing', d: 'Coliform & pathogen screening every batch.' },
              { icon: ThermometerSnowflake, t: 'Cold-Chain', d: 'Continuous 4°C monitoring end-to-end.' },
              { icon: ClipboardCheck, t: 'Batch Approval', d: 'QA sign-off before packaging & dispatch.' },
              { icon: ShieldCheck, t: 'QR Tagging', d: 'Unique traceability code on every pack.' }
            ].map((s) => (
              <Card key={s.t} className="border-blue-100">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-semibold text-blue-950">{s.t}</h3>
                  <p className="mt-1 text-sm text-slate-600">{s.d}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {['FSSAI Certified', 'ISO 22000', 'HACCP Compliant'].map((c) => (
            <div key={c} className="rounded-2xl border border-blue-100 bg-white p-8 text-center shadow-sm">
              <ShieldCheck className="mx-auto h-10 w-10 text-blue-800" />
              <div className="mt-3 font-semibold text-blue-950">{c}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
