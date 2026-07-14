import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Milk } from 'lucide-react';

const products = [
  { name: 'Toned Milk', desc: 'Everyday nutrition with a light, creamy taste.', img: 'https://images.unsplash.com/photo-1567011345445-fd175f248019?auto=format&fit=crop&w=800&q=80', tag: 'Bestseller' },
  { name: 'Full Cream Milk', desc: 'Rich and creamy, perfect for tea and desserts.', img: 'https://images.unsplash.com/photo-1609983507346-8d282af67df7?auto=format&fit=crop&w=800&q=80' },
  { name: 'Fresh Curd', desc: 'Thick, tangy and probiotic-rich set curd.', img: 'https://images.unsplash.com/photo-1564759298141-cef86f51d4d4?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pure Ghee', desc: 'Traditional bilona-style ghee from A2 milk.', img: 'https://images.unsplash.com/photo-1646562292849-0cce895b8a62?auto=format&fit=crop&w=800&q=80', tag: 'Premium' },
  { name: 'Fresh Paneer', desc: 'Soft, spongy paneer made daily.', img: 'https://images.unsplash.com/photo-1706111584184-60ba02e8dc2e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Butter', desc: 'Slow-churned, unsalted farm butter.', img: 'https://images.unsplash.com/photo-1662748716829-33624b1d5dfe?auto=format&fit=crop&w=800&q=80' },
  { name: 'Buttermilk', desc: 'Refreshing spiced chaas — chilled and served.', img: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=800&q=80' },
  { name: 'Lassi', desc: 'Sweet, creamy Punjabi-style lassi.', img: 'https://images.unsplash.com/photo-1523473827533-2a64d0d36748?auto=format&fit=crop&w=800&q=80' }
];

export default function ProductsPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-blue-950 md:text-5xl">Our Products</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">Wholesome, quality-tested dairy for every meal.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <Card key={p.name} className="group overflow-hidden border-blue-100 transition-shadow hover:shadow-lg">
              <div className="relative aspect-square overflow-hidden">
                <Image src={p.img} alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                {p.tag && (
                  <Badge className="absolute left-3 top-3 bg-blue-900 hover:bg-blue-800">{p.tag}</Badge>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <Milk className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-wider">Manasa</span>
                </div>
                <h3 className="mt-1 font-semibold text-blue-950">{p.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{p.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
