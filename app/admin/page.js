'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, LogIn, Plus, LogOut, Download, Trash2, ExternalLink, ShieldCheck, Package } from 'lucide-react';

export default function AdminPage() {
  const [token, setToken] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: '' });
  const [loggingIn, setLoggingIn] = useState(false);

  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(false);

  const [form, setForm] = useState({
    productName: '',
    manufacturingDate: '',
    expiryDate: '',
    manufacturingLocation: 'Manasa Dairy Plant, Andhra Pradesh',
    quantity: '',
    notes: ''
  });
  const [creating, setCreating] = useState(false);
  const [lastCreated, setLastCreated] = useState(null);

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('md_admin_token') : null;
    if (t) setToken(t);
  }, []);

  useEffect(() => { if (token) loadBatches(); }, [token]);

  const login = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const j = await res.json();
      if (j.success) {
        localStorage.setItem('md_admin_token', j.token);
        setToken(j.token);
        toast.success('Welcome, Admin');
      } else {
        toast.error(j.error || 'Login failed');
      }
    } catch { toast.error('Network error'); }
    finally { setLoggingIn(false); }
  };

  const logout = () => {
    localStorage.removeItem('md_admin_token');
    setToken(null);
    setBatches([]);
  };

  const loadBatches = async () => {
    setLoadingBatches(true);
    try {
      const res = await fetch('/api/batches', { headers: { Authorization: `Bearer ${token}` } });
      const j = await res.json();
      if (j.batches) setBatches(j.batches);
      else if (res.status === 401) logout();
    } catch { toast.error('Failed to load'); }
    finally { setLoadingBatches(false); }
  };

  const createBatch = async (e) => {
    e.preventDefault();
    if (!form.productName || !form.manufacturingDate || !form.expiryDate || !form.manufacturingLocation) {
      return toast.error('Fill all required fields');
    }
    setCreating(true);
    try {
      const res = await fetch('/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const j = await res.json();
      if (j.success) {
        toast.success('Batch created!');
        setLastCreated(j.batch);
        setForm({ ...form, productName: '', quantity: '', notes: '' });
        loadBatches();
      } else toast.error(j.error || 'Failed');
    } catch { toast.error('Network error'); }
    finally { setCreating(false); }
  };

  const deleteBatch = async (id) => {
    if (!confirm('Delete this batch?')) return;
    try {
      await fetch(`/api/batches/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      loadBatches();
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  const download = (dataUrl, filename) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  if (!token) {
    return (
      <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
        <Card className="w-full max-w-md border-blue-100">
          <CardContent className="p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-900 text-white">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="mt-4 text-center text-2xl font-bold text-blue-950">Admin Login</h1>
            <p className="mt-1 text-center text-sm text-slate-500">Manasa Dairy Batch Management</p>
            <form onSubmit={login} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="u">Username</Label>
                <Input id="u" value={loginForm.username} onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="p">Password</Label>
                <Input id="p" type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
              </div>
              <Button type="submit" disabled={loggingIn} className="w-full bg-blue-900 hover:bg-blue-800">
                {loggingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                Sign In
              </Button>
            </form>
            <p className="mt-4 text-center text-xs text-slate-400">Default: admin / manasa2025</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">Admin Dashboard</h1>
          <p className="text-sm text-slate-600">Create and manage manufacturing batches.</p>
        </div>
        <Button onClick={logout} variant="outline" className="border-blue-200 text-blue-800 hover:bg-blue-50">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-blue-100 lg:col-span-1">
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-950">
              <Plus className="h-5 w-5" /> New Batch
            </h2>
            <form onSubmit={createBatch} className="mt-4 space-y-3">
              <div>
                <Label>Product Name*</Label>
                <Input value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} placeholder="e.g. Toned Milk 1L" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Manufacturing Date*</Label>
                  <Input type="date" value={form.manufacturingDate} onChange={(e) => setForm({ ...form, manufacturingDate: e.target.value })} />
                </div>
                <div>
                  <Label>Expiry Date*</Label>
                  <Input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Manufacturing Location*</Label>
                <Input value={form.manufacturingLocation} onChange={(e) => setForm({ ...form, manufacturingLocation: e.target.value })} />
              </div>
              <div>
                <Label>Quantity</Label>
                <Input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 500 units" />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional batch notes" />
              </div>
              <Button type="submit" disabled={creating} className="w-full bg-blue-900 hover:bg-blue-800">
                {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} Create Batch & QR
              </Button>
            </form>

            {lastCreated && (
              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="text-xs font-semibold uppercase text-emerald-700">Batch created</div>
                <div className="mt-1 text-sm font-bold text-emerald-900">{lastCreated.batchNumber}</div>
                <img src={lastCreated.qrDataUrl} alt="QR" className="mx-auto mt-3 h-40 w-40 rounded-lg border bg-white" />
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={() => download(lastCreated.qrDataUrl, `${lastCreated.batchNumber}.png`)} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    <Download className="mr-2 h-4 w-4" /> QR
                  </Button>
                  <a href={lastCreated.verifyUrl} target="_blank" rel="noreferrer" className="flex-1">
                    <Button size="sm" variant="outline" className="w-full border-emerald-300 text-emerald-700">
                      <ExternalLink className="mr-2 h-4 w-4" /> Open
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-100 lg:col-span-2">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-950">
                <Package className="h-5 w-5" /> All Batches
              </h2>
              <Badge variant="outline" className="border-blue-200 text-blue-800">{batches.length}</Badge>
            </div>

            {loadingBatches ? (
              <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-blue-800" /></div>
            ) : batches.length === 0 ? (
              <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50/50 p-10 text-center text-sm text-slate-500">No batches yet. Create your first batch on the left.</div>
            ) : (
              <div className="space-y-3">
                {batches.map((b) => (
                  <div key={b.id} className="flex flex-col gap-4 rounded-xl border border-blue-100 p-4 sm:flex-row sm:items-center">
                    <img src={b.qrDataUrl} alt="QR" className="h-24 w-24 rounded-lg border bg-white" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-blue-950">{b.productName}</span>
                        <Badge className="bg-blue-900 hover:bg-blue-800">{b.batchNumber}</Badge>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        Mfg: {b.manufacturingDate} • Exp: {b.expiryDate}
                      </div>
                      <div className="mt-1 text-xs text-slate-500 truncate">📍 {b.manufacturingLocation}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => download(b.qrDataUrl, `${b.batchNumber}.png`)} className="border-blue-200 text-blue-800">
                        <Download className="h-4 w-4" />
                      </Button>
                      <a href={b.verifyUrl} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-800"><ExternalLink className="h-4 w-4" /></Button>
                      </a>
                      <Button size="sm" variant="outline" onClick={() => deleteBatch(b.id)} className="border-red-200 text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
