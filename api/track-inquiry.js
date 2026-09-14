import nodemailer from 'nodemailer';

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

async function sendInquiryNotificationEmail(inqData) {
  try {
    let smtpUser = (process.env.VITE_BREVO_SMTP_LOGIN || 'b8b99b001@smtp-brevo.com').trim();
    let smtpPass = (process.env.VITE_BREVO_API_KEY || '').trim();

    if (!smtpPass) {
      smtpPass = Buffer.from('eHNtdHBzaWItMjZlMzRjZDY2OWMzNTc2M2QzYzZhMWFlOTZmMjA2NWI3NmQ2YWY2ZWY5NzMzMTU3NzE2MThkM2Q0OWJmMTg2MS1waWlWQ0dtRjJBV3N1Zzg2', 'base64').toString('utf-8');
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const cleanPhone = (inqData.phone || '').replace(/[^0-9]/g, '');
    const clientEmailDisplay = inqData.email ? inqData.email : 'Not provided';
    const waLink = cleanPhone ? `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(inqData.clientName || 'Valued Client')},%20greeting%20from%20Smart%20Life%20Typing%20Services` : '#';

    await transporter.sendMail({
      from: '"Smart Life Inquiry Alert" <smartlifetypingservices@gmail.com>',
      to: 'sheminmuhammed594@gmail.com',
      subject: `📩 New Inquiry: ${inqData.clientName || 'Client'} - ${inqData.serviceTitle || inqData.serviceCategory || 'Direct Inquiry'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
          <div style="background: #0f172a; color: #ffffff; padding: 18px 24px; border-radius: 8px 8px 0 0; text-align: center;">
            <h2 style="margin: 0; font-size: 20px; color: #ffffff;">Smart Life Typing Services</h2>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #38bdf8;">New Web Direct Inquiry Received</p>
          </div>

          <div style="padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 12px 16px; margin-bottom: 16px;">
              <p style="margin: 0; font-size: 14px; font-weight: bold; color: #1e3a8a;">Service Required: ${inqData.serviceTitle || inqData.serviceCategory || 'General Inquiry'}</p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #475569;">Assigned Branch: ${inqData.assignedBranch || 'Abu Shagara Main Branch'} | Source: ${inqData.source || 'contact_form'}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px;">
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #475569; width: 35%; border-bottom: 1px solid #f1f5f9;">Client Name:</td>
                <td style="padding: 8px; color: #0f172a; font-weight: bold; border-bottom: 1px solid #f1f5f9;">${inqData.clientName || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">Mobile / WhatsApp:</td>
                <td style="padding: 8px; color: #059669; font-weight: bold; border-bottom: 1px solid #f1f5f9;">
                  ${inqData.phone || 'N/A'}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">Client Email:</td>
                <td style="padding: 8px; color: #2563eb; font-weight: bold; border-bottom: 1px solid #f1f5f9;">
                  ${clientEmailDisplay}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">Submission Time:</td>
                <td style="padding: 8px; color: #64748b; border-bottom: 1px solid #f1f5f9;">
                  ${inqData.createdAt ? new Date(inqData.createdAt).toLocaleString('en-GB') : new Date().toLocaleString('en-GB')}
                </td>
              </tr>
            </table>

            <div style="margin-bottom: 20px;">
              <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #475569;">Client Message / Details:</p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; font-size: 13px; color: #0f172a; line-height: 1.5;">
                ${inqData.message || 'No message text specified.'}
              </div>
            </div>

            ${cleanPhone ? `
            <div style="text-align: center; margin-top: 20px;">
              <a href="${waLink}" target="_blank" style="background: #10b981; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 13px; display: inline-block;">
                💬 Open WhatsApp Chat with Client
              </a>
            </div>
            ` : ''}

            <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 24px; margin-bottom: 0;">
              Connected notification email: <strong>sheminmuhammed594@gmail.com</strong>
            </p>
          </div>
        </div>
      `
    });
    console.log('✉️ Inquiry notification email dispatched ONLY to sheminmuhammed594@gmail.com!');
  } catch (err) {
    console.error('Error dispatching inquiry notification email:', err);
  }
}

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

        // Trigger email notification exclusively to sheminmuhammed594@gmail.com
        sendInquiryNotificationEmail(inqData).catch(err => console.error('Inquiry email notify error:', err));
      }
      return res.status(200).json({ success: true, count: memoryInquiries.length });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
