'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, LogIn, Plus, LogOut, Trash2, ShieldCheck, MapPin, Pencil, X, Save } from 'lucide-react';

const emptyForm = {
  srNo: '',
  batchCode: '',
  productCategory: 'All products',
  companyName: '',
  address: '',
  email: ''
};

export default function AdminPage() {
  const [token, setToken] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: '' });
  const [loggingIn, setLoggingIn] = useState(false);

  const [units, setUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('md_admin_token') : null;
    if (t) setToken(t);
  }, []);

  useEffect(() => { if (token) loadUnits(); }, [token]);

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
    setUnits([]);
  };

  const loadUnits = async () => {
    setLoadingUnits(true);
    try {
      const res = await fetch('/api/units');
      const j = await res.json();
      if (j.units) setUnits(j.units);
    } catch { toast.error('Failed to load'); }
    finally { setLoadingUnits(false); }
  };

  const startEdit = (u) => {
    setEditingId(u.id);
    setForm({
      srNo: u.srNo ?? '',
      batchCode: u.batchCode || '',
      productCategory: u.productCategory || 'All products',
      companyName: u.companyName || '',
      address: u.address || '',
      email: u.email || ''
    });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.batchCode || !form.address) {
      return toast.error('Batch code and address are required');
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/units/${editingId}` : '/api/units';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const j = await res.json();
      console.log("Response status:", res.status);
console.log("Response body:", j);
      if (j.success) {
        toast.success(editingId ? 'Unit updated' : 'Unit added');
        setForm(emptyForm);
        setEditingId(null);
        loadUnits();
      } else toast.error(j.error || 'Failed');
    } catch { toast.error('Network error'); }
    finally { setSaving(false); }
  };

  const deleteUnit = async (id) => {
  if (!confirm('Delete this manufacturing unit?')) return;

  try {
    const res = await fetch(`/api/units/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    console.log(data);

    if (res.ok && data.success) {
      toast.success('Deleted');
      loadUnits();
    } else {
      toast.error(data.error || 'Delete failed');
    }
  } catch (err) {
    console.error(err);
    toast.error('Network error');
  }
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
            <p className="mt-1 text-center text-sm text-slate-500">Manufacturing Unit Management</p>
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
          <p className="text-sm text-slate-600">Manage manufacturing unit addresses shown on the public page.</p>
        </div>
        <Button onClick={logout} variant="outline" className="border-blue-200 text-blue-800 hover:bg-blue-50">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-blue-100 lg:col-span-1">
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-950">
              {editingId ? <><Pencil className="h-5 w-5" /> Edit Unit</> : <><Plus className="h-5 w-5" /> Add Unit</>}
            </h2>
            <form onSubmit={submit} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Sr. No.</Label>
                  <Input type="number" min="1" value={form.srNo} onChange={(e) => setForm({ ...form, srNo: e.target.value })} placeholder="auto" />
                </div>
                <div>
                  <Label>Batch Code*</Label>
                  <Input value={form.batchCode} onChange={(e) => setForm({ ...form, batchCode: e.target.value.toUpperCase() })} placeholder="e.g. NA" maxLength={4} />
                </div>
              </div>
              <div>
                <Label>Product Category</Label>
                <Input value={form.productCategory} onChange={(e) => setForm({ ...form, productCategory: e.target.value })} placeholder="All products" />
              </div>
              <div>
                <Label>Company Name</Label>
                <Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} placeholder="e.g. NITHYA AGENCIES" />
              </div>
              <div>
                <Label>Address*</Label>
                <Textarea rows={4} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Full address" />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="contact@example.com" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving} className="flex-1 bg-blue-900 hover:bg-blue-800">
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingId ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />)}
                  {editingId ? 'Save changes' : 'Add unit'}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={cancelEdit} className="border-blue-200 text-blue-800">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-blue-100 lg:col-span-2">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-950">
                <MapPin className="h-5 w-5" /> Manufacturing Units
              </h2>
              <Badge variant="outline" className="border-blue-200 text-blue-800">{units.length}</Badge>
            </div>

            {loadingUnits ? (
              <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-blue-800" /></div>
            ) : units.length === 0 ? (
              <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50/50 p-10 text-center text-sm text-slate-500">No units yet. Add your first unit on the left.</div>
            ) : (
              <div className="space-y-3">
                {units.map((u) => (
                  <div key={u.id} className="flex flex-col gap-3 rounded-xl border border-blue-100 p-4 sm:flex-row">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
                      <span className="font-bold">{u.srNo}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-blue-900 hover:bg-blue-800">{u.batchCode}</Badge>
                        <span className="font-semibold text-blue-950">{u.productCategory}</span>
                      </div>
                      {u.companyName && <div className="mt-1 text-sm font-semibold text-slate-800">{u.companyName}</div>}
                      <div className="mt-1 whitespace-pre-line text-xs text-slate-600">{u.address}</div>
                      {u.email && <div className="mt-1 text-xs text-slate-600">✉ {u.email}</div>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(u)} className="border-blue-200 text-blue-800">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteUnit(u.id)} className="border-red-200 text-red-600 hover:bg-red-50">
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
