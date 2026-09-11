const CLOUD_BIN_ID = 'ff808181a067127101a09034df4975cd';
const CLOUD_URL = `https://api.restful-api.dev/objects/${CLOUD_BIN_ID}`;

function parseRequestBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  if (Buffer.isBuffer(req.body)) {
    try { return JSON.parse(req.body.toString('utf-8')); } catch { return {}; }
  }
  return {};
}

let memoryInquiries = global.__serverInquiries || [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const inqData = parseRequestBody(req);
      if (inqData && inqData.id) {
        let currentInquiries = [];
        try {
          const cloudRes = await fetch(CLOUD_URL);
          if (cloudRes.ok) {
            const data = await cloudRes.json();
            currentInquiries = data?.data?.inquiries || [];
          }
        } catch {
          currentInquiries = memoryInquiries;
        }

        const idx = currentInquiries.findIndex(i => i.id === inqData.id);
        if (idx >= 0) currentInquiries[idx] = inqData;
        else currentInquiries.unshift(inqData);

        memoryInquiries = currentInquiries;
        global.__serverInquiries = currentInquiries;

        try {
          await fetch(CLOUD_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'smartlife_live_inquiries', data: { inquiries: currentInquiries } })
          });
        } catch (e) {
          console.error('Cloud storage PUT error:', e);
        }
      }
      return res.status(200).json({ success: true, count: memoryInquiries.length });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
