// Global in-memory store across warm serverless lambdas
let globalWaClicks = global.__serverWaClicks || [
  {
    id: 'wa-clk-101',
    customerName: 'Mohammed Rashid',
    customerPhone: '+971 50 882 1199',
    buttonLocation: 'Header Instant WhatsApp',
    pagePath: '/',
    contextDetails: 'Service: Sharjah Family Visa Renewal Assistance',
    deviceType: 'Mobile',
    targetUrl: 'https://wa.me/971551585570?text=Hi%20Smart%20Life...',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: 'wa-clk-102',
    customerName: 'Sujith Kumar',
    customerPhone: '+971 55 441 3322',
    buttonLocation: 'Services Catalog Card',
    pagePath: '/#services',
    contextDetails: 'Service: Indian Passport Renewal Tatkaal',
    deviceType: 'Desktop',
    targetUrl: 'https://wa.me/971551585570?text=Hi...',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  }
];
global.__serverWaClicks = globalWaClicks;

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
        const exists = globalWaClicks.some(c => c.id === clickData.id);
        if (!exists) {
          globalWaClicks.unshift(clickData);
          global.__serverWaClicks = globalWaClicks;
        }
      }
      return res.status(200).json({ success: true, count: globalWaClicks.length });
    } catch (err) {
      return res.status(500).json({ success: false });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
