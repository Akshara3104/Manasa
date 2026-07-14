import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME && process.env.DB_NAME !== 'your_database_name' ? process.env.DB_NAME : 'manasa_dairy';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'manasa2025';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_TOKEN = 'manasa_admin_secret_token_2025';

let cachedClient = null;
async function getDb() {
  if (!cachedClient) {
    cachedClient = new MongoClient(MONGO_URL);
    await cachedClient.connect();
  }
  return cachedClient.db(DB_NAME);
}

function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

function checkAuth(request) {
  const auth = request.headers.get('authorization') || '';
  const token = auth.replace('Bearer ', '').trim();
  return token === ADMIN_TOKEN;
}

async function readBody(request) {
  try { return await request.json(); } catch { return {}; }
}

async function handle(request, { params }) {
  const resolved = await params;
  const pathArr = resolved?.path || [];
  const route = '/' + pathArr.join('/');
  const method = request.method;

  try {
    const db = await getDb();

    // Health
    if (route === '/' || route === '/health') {
      return json({ ok: true, service: 'Manasa Dairy API' });
    }

    // ADMIN LOGIN
    if (route === '/admin/login' && method === 'POST') {
      const { username, password } = await readBody(request);
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        return json({ success: true, token: ADMIN_TOKEN });
      }
      return json({ success: false, error: 'Invalid credentials' }, 401);
    }

    // CREATE BATCH (admin)
    if (route === '/batches' && method === 'POST') {
      if (!checkAuth(request)) return json({ error: 'Unauthorized' }, 401);
      const body = await readBody(request);
      const { productName, manufacturingDate, manufacturingLocation, expiryDate, quantity, notes } = body;
      if (!productName || !manufacturingDate || !manufacturingLocation || !expiryDate) {
        return json({ error: 'Missing required fields' }, 400);
      }
      const id = uuidv4();
      // Human-friendly batch number: MD-YYYYMMDD-XXXX
      const dateStr = manufacturingDate.replaceAll('-', '');
      const short = id.split('-')[0].toUpperCase();
      const batchNumber = `MD-${dateStr}-${short}`;
      const verifyUrl = `${BASE_URL}/verify/${id}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 400, margin: 2, color: { dark: '#1E3A8A', light: '#ffffff' } });
      const batch = {
        id,
        batchNumber,
        productName,
        manufacturingDate,
        manufacturingLocation,
        expiryDate,
        quantity: quantity || '',
        notes: notes || '',
        verifyUrl,
        qrDataUrl,
        authentic: true,
        createdAt: new Date().toISOString()
      };
      await db.collection('batches').insertOne(batch);
      return json({ success: true, batch });
    }

    // LIST BATCHES (admin)
    if (route === '/batches' && method === 'GET') {
      if (!checkAuth(request)) return json({ error: 'Unauthorized' }, 401);
      const list = await db.collection('batches').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
      return json({ batches: list });
    }

    // DELETE BATCH (admin)
    if (route.startsWith('/batches/') && method === 'DELETE') {
      if (!checkAuth(request)) return json({ error: 'Unauthorized' }, 401);
      const id = pathArr[1];
      await db.collection('batches').deleteOne({ id });
      return json({ success: true });
    }

    // PUBLIC VERIFY
    if (route.startsWith('/verify/') && method === 'GET') {
      const id = pathArr[1];
      const b = await db.collection('batches').findOne({ id }, { projection: { _id: 0 } });
      if (!b) {
        return json({ found: false, authentic: false, error: 'Batch not found. This product may not be genuine.' }, 404);
      }
      const expired = new Date(b.expiryDate) < new Date();
      return json({ found: true, authentic: !expired, expired, batch: b });
    }

    // CONTACT SUBMISSIONS
    if (route === '/contact' && method === 'POST') {
      const body = await readBody(request);
      const { name, email, phone, message } = body;
      if (!name || !message) return json({ error: 'Name and message required' }, 400);
      const doc = {
        id: uuidv4(),
        name, email: email || '', phone: phone || '', message,
        createdAt: new Date().toISOString()
      };
      await db.collection('contacts').insertOne(doc);
      return json({ success: true });
    }

    return json({ error: 'Not found', route, method }, 404);
  } catch (e) {
    console.error('API error', e);
    return json({ error: 'Server error', detail: e.message }, 500);
  }
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
export const PATCH = handle;
export const dynamic = 'force-dynamic';
