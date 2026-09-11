const CLOUD_BIN_ID = 'ff808181a067127101a0903442cc75cc';
const CLOUD_URL = `https://api.restful-api.dev/objects/${CLOUD_BIN_ID}`;

// In-memory memory fallback
let memoryClicks = global.__serverWaClicks || [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const clickData = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      if (clickData.id) {
        // Fetch current cloud list
        let currentClicks = [];
        try {
          const cloudRes = await fetch(CLOUD_URL);
          if (cloudRes.ok) {
            const data = await cloudRes.json();
            currentClicks = data?.data?.clicks || [];
          }
        } catch {
          currentClicks = memoryClicks;
        }

        const exists = currentClicks.some(c => c.id === clickData.id);
        if (!exists) {
          currentClicks.unshift(clickData);
          memoryClicks = currentClicks;
          global.__serverWaClicks = currentClicks;

          // Update Cloud Storage Object
          try {
            await fetch(CLOUD_URL, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: 'smartlife_live_clicks', data: { clicks: currentClicks } })
            });
          } catch (e) {
            console.error('Cloud storage PUT error:', e);
          }
        }
      }
      return res.status(200).json({ success: true, count: memoryClicks.length });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
