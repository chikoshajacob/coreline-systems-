const express = require('express');

const router = express.Router();

// Very small email format check — good enough to catch typos, not meant to be exhaustive
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', async (req, res) => {
  try {
    const { name, email, message, projectType } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }
    if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'That email address doesn\'t look right.' });
    }
    if (String(message).length > 5000) {
      return res.status(400).json({ error: 'Message is too long.' });
    }

    const {
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      EMAILJS_PUBLIC_KEY,
      EMAILJS_PRIVATE_KEY,
    } = process.env;
    if (
      !EMAILJS_SERVICE_ID ||
      !EMAILJS_TEMPLATE_ID ||
      !EMAILJS_PUBLIC_KEY ||
      !EMAILJS_PRIVATE_KEY
    ) {
      console.error('EmailJS env vars are not configured. See .env.example.');
      return res.status(500).json({ error: 'Contact form is not configured yet. Please try again later.' });
    }

    const safeName = String(name).slice(0, 200);
    const safeProjectType = String(projectType || 'Not specified').slice(0, 100);
    const safeMessage = String(message).slice(0, 5000);

    const emailJsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY,
        template_params: {
          name: safeName,
          email,
          time: new Date().toISOString(),
          title: `Project enquiry — ${safeProjectType}`,
          message: `Project type: ${safeProjectType}\nReply email: ${email}\n\n${safeMessage}`
        }
      })
    });
    if (!emailJsResponse.ok) {
      const details = await emailJsResponse.text();
      throw new Error(`EmailJS request failed (${emailJsResponse.status}): ${details}`);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('EmailJS contact error:', err);
    return res.status(500).json({ error: 'Something went wrong sending that. Please try again later.' });
  }
});

module.exports = router;
