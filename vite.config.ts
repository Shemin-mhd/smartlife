import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv, Plugin } from 'vite';
import nodemailer from 'nodemailer';

// In-memory OTP store for dev server
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

// Vite plugin to provide zero-backend OTP email API
function brevoOtpPlugin(): Plugin {
  return {
    name: 'vite-plugin-brevo-otp',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '');
      const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
          user: env.VITE_BREVO_SMTP_LOGIN || 'b8b99b001@smtp-brevo.com',
          pass: env.VITE_BREVO_API_KEY || ''
        }
      });
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/send-otp' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { email } = JSON.parse(body || '{}');
              const targetEmail = (email || 'smartlifetypingservices@gmail.com').trim().toLowerCase();

              // Generate 6-digit OTP
              const otp = Math.floor(100000 + Math.random() * 900000).toString();
              const expiresAt = Date.now() + 5 * 60 * 1000;

              otpStore.set(targetEmail, { otp, expiresAt });

              // Send email to rishadsmartlife@gmail.com & nafalkt7@gmail.com via Brevo SMTP
              const info = await transporter.sendMail({
                from: '"Smart Life Typing Center" <smartlifetypingservices@gmail.com>',
                to: 'rishadsmartlife@gmail.com, nafalkt7@gmail.com',
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
                      This verification code was sent to rishadsmartlife@gmail.com & nafalkt7@gmail.com for admin sign-in request.
                    </p>
                  </div>
                `
              });

              console.log(`✉️ Brevo OTP Email Dispatched! MessageId: ${info.messageId}`);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, otpCode: otp, messageId: info.messageId }));
            } catch (err: any) {
              console.error('Error sending Brevo OTP via Vite plugin:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, message: err.message }));
            }
          });
          return;
        }

        if (req.url === '/api/verify-otp' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { email, otp } = JSON.parse(body || '{}');
              const targetEmail = (email || 'smartlifetypingservices@gmail.com').trim().toLowerCase();
              const stored = otpStore.get(targetEmail);

              if (!stored) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: false, message: 'No OTP requested for this account' }));
              }

              if (Date.now() > stored.expiresAt) {
                otpStore.delete(targetEmail);
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: false, message: 'OTP expired. Please request a new code.' }));
              }

              if (stored.otp !== otp.trim()) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: false, message: 'Invalid OTP code. Please check your email.' }));
              }

              otpStore.delete(targetEmail);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'OTP verified successfully' }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, message: 'Verification error' }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), brevoOtpPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
