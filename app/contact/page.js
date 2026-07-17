'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message) return toast.error('Please fill name and message');
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Message sent! We will get back to you soon.');
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        toast.error(data.error || 'Failed to send');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-blue-950 md:text-5xl">Contact Us</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">We'd love to hear from you — questions, feedback or partnership enquiries.</p>
        </div>
      </section>

      <section className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-2">
        <Card className="border-blue-100">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-blue-950">Send us a message</h2>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="name">Name*</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message*</Label>
                <Textarea id="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <Button type="submit" disabled={loading} className="bg-blue-900 hover:bg-blue-800">
                <Send className="mr-2 h-4 w-4" /> {loading ? 'Sending…' : 'Send Message'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {[
            { icon: MapPin, t: 'Address', d: 'PLOT NO:76, SY NO:1109/E, UPPARIGUDA (V), IBRAHIMPATNAM (M), R.R DIST' },
            { icon: Phone, t: 'Phone', d: '+91 7032996099' },
            { icon: Mail, t: 'Email', d: 'info@manasadairy.com' }
          ].map((c) => (
            <Card key={c.t} className="border-blue-100">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
                  <c.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-blue-950">{c.t}</div>
                  <div className="text-sm text-slate-600">{c.d}</div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="border-blue-100 bg-blue-50">
            <CardContent className="p-6">
              <div className="text-sm font-semibold text-blue-950">Business Hours</div>
              <div className="mt-2 text-sm text-slate-600">Mon – Sat: 8:00 AM – 8:00 PM</div>
              <div className="text-sm text-slate-600">Sun: 8:00 AM – 2:00 PM</div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
