# Coreline Systems

A modern business website and digital brand presence for Coreline Systems, built with Express and a static marketing front end.

## Overview

This project includes:
- a premium one-page marketing site in `public/index.html`
- SEO improvements and social metadata
- landing pages for the main service offerings
- contact and subscription form endpoints backed by Nodemailer
- a lightweight Express server for local development and deployment

## Tech stack

- Node.js
- Express
- Nodemailer
- HTML, CSS, and JavaScript

## Project structure

```text
coreline-systems-main/
├── public/
│   ├── index.html
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── cookie-policy.html
│   ├── privacy-policy.html
│   ├── media/
│   └── services/
├── routes/
│   ├── contact.js
│   └── subscribe.js
├── .env.example
├── .gitignore
├── package.json
├── server.js
├── README.md
└── test-server.js
```

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create your local environment file:
   ```bash
   cp .env.example .env
   ```

3. Fill in `.env`:
   - For the contact form, set `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`,
     `EMAILJS_PUBLIC_KEY`, `EMAILJS_PRIVATE_KEY`, and `EMAILJS_TO_EMAIL`.
   - For subscription notifications, set `EMAIL_USER`, `EMAIL_PASS`, and `EMAIL_TO`.

4. Start the app:
   ```bash
   npm start
   ```

5. Open the app in the browser:
   ```text
   http://localhost:3000
   ```

For automatic restarts while developing:
```bash
npm run dev
```

## Contact form behavior

- `POST /api/contact` validates and rate-limits submissions, then sends them using EmailJS.
- The current EmailJS template uses `{{title}}`, `{{name}}`, `{{time}}`,
  `{{message}}`, and `{{email}}`; the form fills these values for each enquiry.
  The template's recipient is `matemarumbidzai2@gmail.com`.
- `POST /api/subscribe` handles subscription requests using the same backend pattern.
- Contact messages and subscriptions each have a separate limit of five requests
  per IP address every 15 minutes. When the contact limit is reached, the form
  offers a prefilled direct-email link.
- If EmailJS is not configured or a send fails, the form offers a prefilled direct-email link.

## Deployment

This app is designed to run on a Node hosting platform such as Render, Railway, or a similar service.

Recommended production setup:
- Build command: `npm install`
- Start command: `npm start`
- Add the same environment variables in your hosting provider settings

> Do not commit `.env` to GitHub.

## GitHub Pages note

The front-end marketing pages in `public/` can be deployed to GitHub Pages for static presentation, but the Node API endpoints for contact and subscription forms will not work on GitHub Pages alone. For the full website experience, deploy the app on a Node host instead.

## License

This project is for business use and internal project hosting. Update or add a license file if you plan to distribute the code publicly.
