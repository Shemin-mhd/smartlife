export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const { id } = body;
      if (id && global.__serverWaClicks) {
        global.__serverWaClicks = global.__serverWaClicks.filter(c => c.id !== id);
      }
      return res.status(200).json({ success: true });
    } catch {
      return res.status(500).json({ success: false });
    }
  }
  return res.status(405).json({ success: false });
}
