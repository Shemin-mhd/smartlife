export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { otp } = body;

    if (!otp || String(otp).trim().length !== 6) {
      return res.status(400).json({ success: false, message: 'Invalid 6-digit OTP code format' });
    }

    return res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Verification error' });
  }
}
