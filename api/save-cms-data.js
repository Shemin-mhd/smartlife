const CMS_BIN_ID = 'ff808181a067127101a09034df4975ce';
const CMS_CLOUD_URL = `https://api.restful-api.dev/objects/${CMS_BIN_ID}`;

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

let memoryCmsData = global.__serverCmsData || {};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const payload = parseRequestBody(req);
      const { type, data } = payload || {};
      if (type && data) {
        memoryCmsData[type] = data;
        global.__serverCmsData = memoryCmsData;

        try {
          await fetch(CMS_CLOUD_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'smartlife_cms_live_store', data: memoryCmsData })
          });
        } catch (e) {
          console.error('Cloud storage PUT error in save-cms-data:', e);
        }
      }
      return res.status(200).json({ success: true, cmsData: memoryCmsData });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
