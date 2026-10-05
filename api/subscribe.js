const nodemailer = require('nodemailer');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';

    // Validate email format
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'Enter a valid email address.' });
    }

    // Check for required environment variables
    const recipient = process.env.SUPPORT_EMAIL || process.env.EMAIL_TO;
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !recipient) {
      console.error('Email env vars are not configured.');
      return res.status(500).json({ error: 'Subscriptions are temporarily unavailable. Please try again later.' });
    }

    // Send subscription email
    await buildTransporter().sendMail({
      from: `"Coreline Systems Website" <${process.env.EMAIL_USER}>`,
      to: recipient,
      replyTo: email,
      subject: 'New Coreline Systems subscriber',
      text: `A visitor subscribed with this email address: ${email}`,
      html: `<p>A visitor subscribed with this email address:</p><p><strong>${escapeHtml(email)}</strong></p>`,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ error: 'Something went wrong processing your subscription. Please try again later.' });
  }
}
