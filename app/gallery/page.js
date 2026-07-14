import Image from 'next/image';

const images = [
  { src: 'https://images.unsplash.com/photo-1597616456860-df68738ec8e4?auto=format&fit=crop&w=1200&q=80', alt: 'Cow on green pasture' },
  { src: 'https://images.unsplash.com/photo-1570460988350-23e05c32c45c?auto=format&fit=crop&w=1200&q=80', alt: 'Cattle on farm' },
  { src: 'https://images.unsplash.com/photo-1618932346918-003de628dd37?auto=format&fit=crop&w=1200&q=80', alt: 'Cow on field' },
  { src: 'https://images.unsplash.com/photo-1592241140495-4f376ad04977?auto=format&fit=crop&w=1200&q=80', alt: 'Grazing cow' },
  { src: 'https://images.unsplash.com/photo-1567011345445-fd175f248019?auto=format&fit=crop&w=1200&q=80', alt: 'Fresh milk' },
  { src: 'https://images.unsplash.com/photo-1609983507346-8d282af67df7?auto=format&fit=crop&w=1200&q=80', alt: 'Milk glass' },
  { src: 'https://images.unsplash.com/photo-1570723989345-3a537f60a9c5?auto=format&fit=crop&w=1200&q=80', alt: 'Lab testing' },
  { src: 'https://images.unsplash.com/photo-1554475900-0a0350e3fc7b?auto=format&fit=crop&w=1200&q=80', alt: 'Lab flasks' }
];

export default function GalleryPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-blue-950 md:text-5xl">Gallery</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">A glimpse into our farms, facilities, and products.</p>
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
