const CLOUD_BIN_ID = 'ff808181a067127101a0903442cc75cc';
const CLOUD_URL = `https://api.restful-api.dev/objects/${CLOUD_BIN_ID}`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    global.__serverWaClicks = [];
    try {
      await fetch(CLOUD_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'smartlife_live_clicks', data: { clicks: [] } })
      });
    } catch {}
    return res.status(200).json({ success: true });
  }
  return res.status(405).json({ success: false });
}
