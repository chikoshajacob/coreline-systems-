require('dotenv').config();
const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const contactRouter = require('./routes/contact');
const subscribeRouter = require('./routes/subscribe');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve the site
app.use(express.static(path.join(__dirname, 'public')));

// Keep contact and subscription traffic from consuming each other's limits.
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages sent. Please wait 15 minutes or reach out by email.' }
});
const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many subscription attempts. Please try again in 15 minutes.' }
});

app.use('/api/contact', contactLimiter, contactRouter);
app.use('/api/subscribe', subscribeLimiter, subscribeRouter);

// Fallback to index.html for any other route (single-page site)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Coreline Systems running at http://localhost:${PORT}`);
});
