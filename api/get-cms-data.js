const CMS_BIN_ID = 'ff808181a067127101a09034df4975ce';
const CMS_CLOUD_URL = `https://api.restful-api.dev/objects/${CMS_BIN_ID}`;

let memoryCmsData = global.__serverCmsData || {};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const cloudRes = await fetch(CMS_CLOUD_URL);
      if (cloudRes.ok) {
        const cloudObj = await cloudRes.json();
        if (cloudObj && cloudObj.data) {
          memoryCmsData = cloudObj.data;
          global.__serverCmsData = cloudObj.data;
        }
      }
    } catch (e) {
      console.error('get-cms-data Cloud Bin error:', e);
    }
    return res.status(200).json({ success: true, data: memoryCmsData });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
