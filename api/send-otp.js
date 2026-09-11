import nodemailer from 'nodemailer';

// In-memory OTP store for serverless instance (fallback to active generated OTP check in AdminLogin)
const otpStore = new Map();

export default async function handler(req, res) {
  // CORS
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

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const targetEmail = (body.email || 'smartlifetypingservices@gmail.com').trim().toLowerCase();

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore.set(targetEmail, { otp, expiresAt });

    const info = await transporter.sendMail({
      from: '"Smart Life Typing Center" <smartlifetypingservices@gmail.com>',
      to: 'rishadsmartlife@gmail.com, nafalkt7@gmail.com, sheminmuhammed594@gmail.com',
      subject: '🔑 Smart Life Admin Access Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #0f172a; margin: 0; font-size: 20px;">Smart Life Typing Services</h2>
            <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Admin Portal Access Security</p>
          </div>

          <div style="background: #ecfdf5; border-radius: 8px; padding: 24px; text-align: center; margin: 20px 0; border: 1px solid #a7f3d0;">
            <p style="color: #047857; font-size: 14px; margin-bottom: 12px; font-weight: 500;">Your 6-Digit Admin Verification OTP Code:</p>
            <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #059669; background: #ffffff; display: inline-block; padding: 12px 32px; border-radius: 8px; border: 1px solid #6ee7b7;">
              ${otp}
            </div>
            <p style="color: #64748b; font-size: 12px; margin-top: 14px;">Valid for 5 minutes.</p>
          </div>

          <p style="color: #94a3b8; font-size: 11px; text-align: center; line-height: 1.4;">
            This verification code was sent to rishadsmartlife@gmail.com, nafalkt7@gmail.com & sheminmuhammed594@gmail.com for admin sign-in request.
          </p>
        </div>
      `
    });

    return res.status(200).json({ success: true, otpCode: otp, messageId: info.messageId });
  } catch (err) {
    console.error('Error sending Brevo OTP:', err);
    return res.status(500).json({ success: false, message: err.message || 'SMTP Error' });
  }
}
