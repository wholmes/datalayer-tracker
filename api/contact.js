import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const ALLOWED_ORIGIN = 'https://datalayer-tracker.com';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).set(CORS_HEADERS).end();
  }

  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message, honeypot } = req.body || {};

  // Honeypot spam check — bots fill hidden fields
  if (honeypot) {
    return res.status(200).json({ ok: true });
  }

  // Validation
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (message.trim().length < 10) {
    return res.status(400).json({ error: 'Message must be at least 10 characters.' });
  }

  const subjectLine = subject?.trim()
    ? `[Contact] ${subject.trim()}`
    : '[Contact] New message from datalayer-tracker.com';

  try {
    await resend.emails.send({
      from: 'DataLayer Tracker <contact@datalayer-tracker.com>',
      to: ['support@datalayer-tracker.com'],
      replyTo: email.trim(),
      subject: subjectLine,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#fff;border:1px solid #e4e7ed;border-radius:10px">
          <div style="margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid #e4e7ed">
            <img src="https://datalayer-tracker.com/assets/og-image.png" alt="DataLayer Tracker" style="height:36px;width:auto" />
          </div>
          <h2 style="font-size:18px;font-weight:600;color:#0f172a;margin:0 0 20px">New contact form submission</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <tr>
              <td style="padding:10px 12px;background:#f8f9fb;border:1px solid #e4e7ed;border-radius:4px 4px 0 0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;width:100px">Name</td>
              <td style="padding:10px 12px;background:#f8f9fb;border:1px solid #e4e7ed;border-top:none;font-size:14px;color:#0f172a">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;background:#fff;border:1px solid #e4e7ed;border-top:none;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8">Email</td>
              <td style="padding:10px 12px;background:#fff;border:1px solid #e4e7ed;border-top:none;font-size:14px;color:#1b4fd8"><a href="mailto:${escapeHtml(email)}" style="color:#1b4fd8">${escapeHtml(email)}</a></td>
            </tr>
            ${subject ? `
            <tr>
              <td style="padding:10px 12px;background:#f8f9fb;border:1px solid #e4e7ed;border-top:none;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8">Subject</td>
              <td style="padding:10px 12px;background:#f8f9fb;border:1px solid #e4e7ed;border-top:none;font-size:14px;color:#0f172a">${escapeHtml(subject)}</td>
            </tr>` : ''}
            <tr>
              <td style="padding:10px 12px;background:#fff;border:1px solid #e4e7ed;border-top:none;border-radius:0 0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;vertical-align:top">Message</td>
              <td style="padding:10px 12px;background:#fff;border:1px solid #e4e7ed;border-top:none;border-radius:0 0 4px 0;font-size:14px;color:#0f172a;line-height:1.6;white-space:pre-wrap">${escapeHtml(message)}</td>
            </tr>
          </table>
          <p style="font-size:12px;color:#94a3b8;margin:0">Sent from datalayer-tracker.com · Reply directly to this email to respond to ${escapeHtml(name)}.</p>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
