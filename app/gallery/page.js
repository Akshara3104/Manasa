import Image from 'next/image';

const images = [
  { src: 'https://images.unsplash.com/photo-1662748716829-33624b1d5dfe?auto=format&fit=crop&w=1200&q=80', alt: 'Milk pouring' },
  { src: 'https://images.unsplash.com/photo-1523473827533-2a64d0d36748?auto=format&fit=crop&w=1200&q=80', alt: 'Dairy processing facility' },
  { src: 'https://images.unsplash.com/photo-1567011345445-fd175f248019?auto=format&fit=crop&w=1200&q=80', alt: 'Glass of milk' },
  { src: 'https://images.unsplash.com/photo-1609983507346-8d282af67df7?auto=format&fit=crop&w=1200&q=80', alt: 'Milk in glass bottle' },
  { src: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1200&q=80', alt: 'Milk bottle' },
  { src: 'https://images.unsplash.com/photo-1564759298141-cef86f51d4d4?auto=format&fit=crop&w=1200&q=80', alt: 'Fresh yogurt' },
  { src: 'https://images.unsplash.com/photo-1646562292849-0cce895b8a62?auto=format&fit=crop&w=1200&q=80', alt: 'Pure ghee' },
  { src: 'https://images.unsplash.com/photo-1706111584184-60ba02e8dc2e?auto=format&fit=crop&w=1200&q=80', alt: 'Ghee jar' },
  { src: 'https://images.unsplash.com/photo-1580982325236-11d214b9f279?auto=format&fit=crop&w=1200&q=80', alt: 'Laboratory testing' },
  { src: 'https://images.unsplash.com/photo-1595500381966-eee2034aae48?auto=format&fit=crop&w=1200&q=80', alt: 'Quality lab' },
  { src: 'https://images.unsplash.com/photo-1570723989345-3a537f60a9c5?auto=format&fit=crop&w=1200&q=80', alt: 'Lab testing' },
  { src: 'https://images.unsplash.com/photo-1554475900-0a0350e3fc7b?auto=format&fit=crop&w=1200&q=80', alt: 'Quality flasks' }
];

export default function GalleryPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-blue-950 md:text-5xl">Gallery</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">A glimpse into our products, facilities, and quality processes.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images.map((img, i) => (
            <div key={i} className={`relative overflow-hidden rounded-2xl shadow-md ${i % 5 === 0 ? 'aspect-[4/5]' : 'aspect-square'}`}>
              <Image src={img.src} alt={img.alt} fill className="object-cover transition-transform duration-500 hover:scale-105" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
