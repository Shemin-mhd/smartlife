const CLOUD_BIN_ID = 'ff808181a067127101a09034df4975cd';
const CLOUD_URL = `https://api.restful-api.dev/objects/${CLOUD_BIN_ID}`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const cloudRes = await fetch(CLOUD_URL);
    if (cloudRes.ok) {
      const data = await cloudRes.json();
      const inquiries = data?.data?.inquiries || global.__serverInquiries || [];
      return res.status(200).json({ success: true, inquiries });
    }
  } catch {}

  const inquiries = global.__serverInquiries || [];
  return res.status(200).json({ success: true, inquiries });
}
