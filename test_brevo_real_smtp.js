import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.VITE_BREVO_SMTP_LOGIN || 'b8b99b001@smtp-brevo.com',
    pass: process.env.VITE_BREVO_API_KEY || ''
  }
});

async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: '"Smart Life Typing Center" <smartlifetypingservices@gmail.com>',
      to: 'rishadsmartlife@gmail.com, nafalkt7@gmail.com',
      subject: '🔑 Smart Life Admin Verification OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0f172a; text-align: center;">Smart Life Typing Services</h2>
          <p style="color: #64748b; text-align: center;">Admin Security Verification Code</p>
          <div style="background: #ecfdf5; padding: 24px; text-align: center; border-radius: 8px; margin: 20px 0; border: 1px solid #a7f3d0;">
            <p style="color: #047857; font-size: 14px; margin-bottom: 8px;">Your 6-Digit Admin Verification OTP Code is:</p>
            <div style="font-size: 36px; font-weight: bold; color: #059669; letter-spacing: 8px;">739104</div>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 12px;">Valid for 5 minutes.</p>
          </div>
          <p style="color: #94a3b8; font-size: 11px; text-align: center;">Dispatched to rishadsmartlife@gmail.com & nafalkt7@gmail.com</p>
        </div>
      `
    });

    console.log('✅ SUCCESS! Brevo SMTP delivered email! MessageID:', info.messageId);
  } catch (err) {
    console.error('❌ Brevo SMTP Error:', err);
  }
}

sendTestEmail();
