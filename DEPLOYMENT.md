# GremlinTeX Deployment

## Live URLs

**Production:** https://gremlintex.vercel.app

**GitHub Repository:** https://github.com/Vishal2602/gremlintex

## Deployment Details

- **Platform:** Vercel
- **Framework:** Vite + React
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

## Environment Variables

The app uses client-side OpenRouter API integration. Users provide their own API key via the Settings modal (stored in localStorage, never sent to any server except OpenRouter).

No server-side environment variables required.

## Continuous Deployment

The GitHub repository is connected to Vercel. Any push to the `master` branch will trigger an automatic deployment.

## Local Development

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
npm run preview
```
