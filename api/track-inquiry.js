let globalInquiries = global.__serverInquiries || [
  {
    id: 'inq-101',
    clientName: 'Rashid Al-Nuaimi',
    phone: '+971 50 123 4567',
    email: 'rashid.n@example.ae',
    serviceCategory: 'Visas & Immigration',
    serviceTitle: 'Sharjah Family Visa Renewal',
    message: 'Need urgent assistance renewing my wife and 2 children residency visas in Sharjah. EJARI is ready.',
    source: 'contact_form',
    status: 'new',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    assignedBranch: 'Abu Shagara Main Branch'
  },
  {
    id: 'inq-102',
    clientName: 'Sanjay Varma',
    phone: '+971 55 987 6543',
    email: 'sanjay.varma@example.com',
    serviceCategory: 'BLS Indian Consulate',
    serviceTitle: 'Indian Passport Renewal',
    message: 'Passport expiring in 2 months. Need Tatkaal appointment guidance and document pre-verification.',
    source: 'visa_helper',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    notes: 'Called client on WhatsApp. Requested copy of current Emirates ID.',
    assignedBranch: 'Abu Shagara Main Branch'
  }
];
global.__serverInquiries = globalInquiries;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const inqData = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      if (inqData.id) {
        const idx = globalInquiries.findIndex(i => i.id === inqData.id);
        if (idx >= 0) globalInquiries[idx] = inqData;
        else globalInquiries.unshift(inqData);
        global.__serverInquiries = globalInquiries;
      }
      return res.status(200).json({ success: true, count: globalInquiries.length });
    } catch (err) {
      return res.status(500).json({ success: false });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
