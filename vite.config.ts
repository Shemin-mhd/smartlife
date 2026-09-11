import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv, Plugin } from 'vite';
import nodemailer from 'nodemailer';

// In-memory OTP store for dev server
const otpStore = new Map<string, { otp: string; expiresAt: number }>();
// In-memory stores for dev server cross-port sync
const serverWaClicks: any[] = [];
const serverInquiries: any[] = [];
// Active SSE client connections
const sseClients = new Set<any>();

function broadcastSseEvent(eventType: string, payload?: any) {
  const data = JSON.stringify({ type: eventType, payload, timestamp: new Date().toISOString() });
  sseClients.forEach(res => {
    try {
      res.write(`data: ${data}\n\n`);
    } catch {
      sseClients.delete(res);
    }
  });
}

// Vite plugin to provide zero-backend OTP email & instant real-time SSE event bridge
function brevoOtpPlugin(): Plugin {
  return {
    name: 'vite-plugin-brevo-otp',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // SSE Real-Time Event Stream Endpoint
        if (req.url === '/api/live-events' && req.method === 'GET') {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
          });
          res.write(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: new Date().toISOString() })}\n\n`);
          sseClients.add(res);

          req.on('close', () => {
            sseClients.delete(res);
          });
          return;
        }

        if (req.url === '/api/send-otp' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const env = loadEnv(server.config.mode || 'development', process.cwd(), '');
              let smtpUser = (env.VITE_BREVO_SMTP_LOGIN || process.env.VITE_BREVO_SMTP_LOGIN || 'b8b99b001@smtp-brevo.com').replace(/^["']|["']$/g, '').trim();
              let smtpPass = (env.VITE_BREVO_API_KEY || process.env.VITE_BREVO_API_KEY || '').replace(/^["']|["']$/g, '').trim();

              // Fail-safe direct disk reader & encoded fallback for .env file
              if (!smtpPass || smtpPass.length === 0) {
                try {
                  const envPath = path.resolve(process.cwd(), '.env');
                  if (fs.existsSync(envPath)) {
                    const envContent = fs.readFileSync(envPath, 'utf-8');
                    const matchKey = envContent.match(/VITE_BREVO_API_KEY\s*=\s*["']?([^"'\r\n]+)["']?/);
                    if (matchKey && matchKey[1]) {
                      smtpPass = matchKey[1].trim();
                    }
                    const matchUser = envContent.match(/VITE_BREVO_SMTP_LOGIN\s*=\s*["']?([^"'\r\n]+)["']?/);
                    if (matchUser && matchUser[1]) {
                      smtpUser = matchUser[1].trim();
                    }
                  }
                } catch (e) {
                  console.error('Direct .env read error:', e);
                }
              }

              // Ultimate guarantee fallback
              if (!smtpPass || smtpPass.length === 0) {
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
              const { email } = JSON.parse(body || '{}');
              const targetEmail = (email || 'smartlifetypingservices@gmail.com').trim().toLowerCase();

              // Generate 6-digit OTP
              const otp = Math.floor(100000 + Math.random() * 900000).toString();
              const expiresAt = Date.now() + 5 * 60 * 1000;

              otpStore.set(targetEmail, { otp, expiresAt });

              // Send email to rishadsmartlife@gmail.com, nafalkt7@gmail.com & sheminmuhammed594@gmail.com via Brevo SMTP
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

        if (req.url === '/api/track-wa-click' && (req.method === 'POST' || req.method === 'OPTIONS')) {
          if (req.method === 'OPTIONS') {
            res.writeHead(204, {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type'
            });
            return res.end();
          }
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const clickData = JSON.parse(body || '{}');
              if (clickData.id) {
                const exists = serverWaClicks.some(c => c.id === clickData.id);
                if (!exists) {
                  serverWaClicks.unshift(clickData);
                  broadcastSseEvent('WA_CLICK', clickData);
                }
              }
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify({ success: true, count: serverWaClicks.length }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify({ success: false }));
            }
          });
          return;
        }

        if (req.url === '/api/get-wa-clicks' && req.method === 'GET') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, clicks: serverWaClicks }));
          return;
        }

        if (req.url === '/api/delete-wa-click' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { id } = JSON.parse(body || '{}');
              if (id) {
                const idx = serverWaClicks.findIndex(c => c.id === id);
                if (idx >= 0) serverWaClicks.splice(idx, 1);
                broadcastSseEvent('WA_DELETE', { id });
              }
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false }));
            }
          });
          return;
        }

        if (req.url === '/api/clear-wa-clicks' && req.method === 'POST') {
          serverWaClicks.length = 0;
          broadcastSseEvent('WA_CLEAR');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true }));
          return;
        }

        // Customer Inquiries API Endpoints
        if (req.url === '/api/track-inquiry' && (req.method === 'POST' || req.method === 'OPTIONS')) {
          if (req.method === 'OPTIONS') {
            res.writeHead(204, {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type'
            });
            return res.end();
          }
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const inqData = JSON.parse(body || '{}');
              if (inqData.id) {
                const idx = serverInquiries.findIndex(i => i.id === inqData.id);
                if (idx >= 0) serverInquiries[idx] = inqData;
                else serverInquiries.unshift(inqData);
                broadcastSseEvent('INQUIRY_ADDED', inqData);
              }
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify({ success: true, count: serverInquiries.length }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify({ success: false }));
            }
          });
          return;
        }

        if (req.url === '/api/get-inquiries' && req.method === 'GET') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, inquiries: serverInquiries }));
          return;
        }

        if (req.url === '/api/delete-inquiry' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { id } = JSON.parse(body || '{}');
              if (id) {
                const idx = serverInquiries.findIndex(i => i.id === id);
                if (idx >= 0) serverInquiries.splice(idx, 1);
                broadcastSseEvent('INQUIRY_DELETED', { id });
              }
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false }));
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
