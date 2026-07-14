import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Sprout, Users, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-blue-950 md:text-5xl">About Manasa Dairy</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Rooted in tradition, powered by technology — bringing you dairy you can trust.
          </p>
        </div>
      </section>

      <section className="container mx-auto grid gap-10 px-4 py-16 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
          <Image src="https://images.unsplash.com/photo-1523473827533-2a64d0d36748?auto=format&fit=crop&w=1200&q=80" alt="Farm" fill className="object-cover" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-blue-950">Our Story</h2>
          <p className="mt-4 text-slate-600">
            Founded with a simple promise — deliver dairy the way nature intended. Manasa Dairy began as a
            small family cooperative and has grown into a trusted name for thousands of households. We work
            directly with local farmers to ensure ethical sourcing, cow welfare and fair pay.
          </p>
          <p className="mt-4 text-slate-600">
            Our modern processing units combine traditional care with advanced hygiene, and every batch we
            produce is traceable via a unique QR code — because your family deserves total transparency.
          </p>
        </div>
      </section>

      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-blue-950">Our Values</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              { icon: Heart, t: 'Care', d: 'For our cows, farmers and customers.' },
              { icon: Sprout, t: 'Purity', d: 'No adulteration, no shortcuts.' },
              { icon: Users, t: 'Community', d: 'Empowering rural livelihoods.' },
              { icon: Award, t: 'Quality', d: 'Every batch, every day.' }
            ].map((v) => (
              <Card key={v.t} className="border-blue-100">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                    <v.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 font-semibold text-blue-950">{v.t}</h3>
                  <p className="mt-1 text-sm text-slate-600">{v.d}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-8 px-4 py-16 md:grid-cols-2">
        <Card className="border-blue-100 bg-gradient-to-br from-blue-900 to-sky-600 text-white">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold">Our Mission</h3>
            <p className="mt-3 text-blue-50">To make pure, safe, and honest dairy accessible to every family — with complete transparency at every step.</p>
          </CardContent>
        </Card>
        <Card className="border-blue-100">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-blue-950">Our Vision</h3>
            <p className="mt-3 text-slate-600">To be India's most trusted dairy brand — powered by farmer partnerships, quality science, and traceability tech.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
