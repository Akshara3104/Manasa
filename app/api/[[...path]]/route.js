import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'manasa_dairy';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

// Sanitize Mongo URI: strip angle-bracket placeholder wrap and URL-encode password
// (handles passwords that contain '@', '<', '>' which break naive URI parsing)
function sanitizeMongoUrl(url) {
  if (!url) return url;
  const protoMatch = url.match(/^(mongodb(?:\+srv)?:\/\/)/);
  if (!protoMatch) return url;
  const proto = protoMatch[0];
  const rest = url.slice(proto.length);
  const slashIdx = rest.indexOf('/');
  const searchEnd = slashIdx === -1 ? rest.length : slashIdx;
  const atIdx = rest.lastIndexOf('@', searchEnd - 1);
  if (atIdx === -1) return url;
  const credentials = rest.slice(0, atIdx);
  const hostAndRest = rest.slice(atIdx);
  const colonIdx = credentials.indexOf(':');
  if (colonIdx === -1) return url;
  const user = credentials.slice(0, colonIdx);
  let pass = credentials.slice(colonIdx + 1);
  if (pass.startsWith('<') && pass.endsWith('>')) pass = pass.slice(1, -1);
  // Only encode if not already encoded (no % sequences that decode cleanly)
  try {
    if (decodeURIComponent(pass) === pass) pass = encodeURIComponent(pass);
  } catch { pass = encodeURIComponent(pass); }
  return proto + user + ':' + pass + hostAndRest;
}

const EFFECTIVE_MONGO_URI = sanitizeMongoUrl(MONGODB_URI);

const DEFAULT_UNIT = {
  id: 'seed-unit-001',
  srNo: 1,
  batchCode: 'NA',
  productCategory: 'All products',
  companyName: 'NITHYA AGENCIES',
  address: 'PLOT NO:76, SY NO:1109/E, UPPARIGUDA (V), IBRAHIMPATNAM (M), R.R DIST',
  email: 'nithyaagencieshyd@gmail.com',
  createdAt: new Date('2025-06-01').toISOString()
};

let cachedClient = null;
async function getDb() {
  if (!cachedClient) {
    cachedClient = new MongoClient(EFFECTIVE_MONGO_URI);
    await cachedClient.connect();
  }
  return cachedClient.db(DB_NAME);
}

//async function ensureSeed(db) {
  //const count = await db.collection('units').countDocuments();
  //if (count === 0) {
    //await db.collection('units').insertOne({ ...DEFAULT_UNIT });
  //}
//}

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

    // LIST MANUFACTURING UNITS (public)
    if (route === '/units' && method === 'GET') {
      const list = await db.collection('units').find({}, { projection: { _id: 0 } }).sort({ srNo: 1, createdAt: 1 }).toArray();
      return json({ units: list });
    }

    // CREATE UNIT (admin)
    if (route === '/units' && method === 'POST') {
      if (!checkAuth(request)) return json({ error: 'Unauthorized' }, 401);
      const body = await readBody(request);
      const { srNo, batchCode, productCategory, companyName, address, email } = body;
      if (!batchCode || !address) {
        return json({ error: 'Batch code and address are required' }, 400);
      }
      // Auto-compute next srNo if not provided
      let finalSrNo = Number(srNo);
      if (!finalSrNo || Number.isNaN(finalSrNo)) {
        const last = await db.collection('units').find({}).sort({ srNo: -1 }).limit(1).toArray();
        finalSrNo = last.length ? (Number(last[0].srNo) || 0) + 1 : 1;
      }
      const unit = {
        id: uuidv4(),
        srNo: finalSrNo,
        batchCode: String(batchCode).toUpperCase(),
        productCategory: productCategory || 'All products',
        companyName: companyName || '',
        address,
        email: email || '',
        createdAt: new Date().toISOString()
      };
      await db.collection('units').insertOne(unit);
      return json({ success: true, unit });
    }

    // UPDATE UNIT (admin)
    if (route.startsWith('/units/') && method === 'PUT') {
      if (!checkAuth(request)) return json({ error: 'Unauthorized' }, 401);
      const id = pathArr[1];
      const body = await readBody(request);
      const update = {};
      ['srNo', 'batchCode', 'productCategory', 'companyName', 'address', 'email'].forEach((k) => {
        if (body[k] !== undefined) update[k] = k === 'srNo' ? Number(body[k]) : (k === 'batchCode' ? String(body[k]).toUpperCase() : body[k]);
      });
      await db.collection('units').updateOne({ id }, { $set: update });
      const updated = await db.collection('units').findOne({ id }, { projection: { _id: 0 } });
      return json({ success: true, unit: updated });
    }

    // DELETE UNIT (admin)
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

    if (data.success) {
      toast.success("Deleted");
      loadUnits();
    } else {
      toast.error(data.error || "Delete failed");
    }
  } catch (err) {
    console.error(err);
    toast.error("Network error");
  }
};

    // CONTACT
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
