# Serverless Function for Web Scraper

This directory contains the serverless function for the web scraper tool.

## Current Implementation

The web scraper currently uses a CORS proxy service (`api.allorigins.win`) for development. For production, you should deploy your own serverless function.

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. The function in `/api/scrape.ts` will be automatically detected and deployed.

### Option 2: Netlify

1. Create `/netlify/functions/scrape.ts` (copy from `/api/scrape.ts`)

2. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

3. Deploy:
   ```bash
   netlify deploy --prod
   ```

### Option 3: Cloudflare Workers

1. Install Wrangler:
   ```bash
   npm i -g wrangler
   ```

2. Create `wrangler.toml`:
   ```toml
   name = "web-scraper"
   main = "api/scrape.ts"
   compatibility_date = "2024-01-01"
   ```

3. Deploy:
   ```bash
   wrangler deploy
   ```

## Updating the Frontend

Once you deploy your serverless function, update the `WebScraperTool.tsx` component to use your function URL instead of the CORS proxy:

```typescript
// Replace this line in WebScraperTool.tsx:
const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(validUrl)}`;

// With your serverless function:
const response = await fetch('/api/scrape', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: validUrl, selector }),
});
const data = await response.json();
const html = data.contents || data.html; // Adjust based on your function response
```

## Improving the Parser

For better CSS selector support, consider using `cheerio` or `jsdom`:

```bash
npm install cheerio
```

Then update the `parseHTML` function in `scrape.ts` to use cheerio:

```typescript
import * as cheerio from 'cheerio';

function parseHTML(html: string, selector: string): ScrapeResult[] {
  const $ = cheerio.load(html);
  const results: ScrapeResult[] = [];
  
  $(selector).each((_, element) => {
    const $el = $(element);
    const attributes: Record<string, string> = {};
    
    Object.keys(element.attribs || {}).forEach(key => {
      attributes[key] = element.attribs[key];
    });
    
    results.push({
      text: $el.text().trim(),
      html: $el.html() || '',
      attributes,
    });
  });
  
  return results;
}
```

## Environment Variables

If you need to add authentication or rate limiting, use environment variables:

- Vercel: Add in dashboard or `vercel.json`
- Netlify: Add in dashboard or `netlify.toml`
- Cloudflare: Add in `wrangler.toml` or dashboard

## Rate Limiting

Consider adding rate limiting to prevent abuse:

```typescript
// Example with a simple in-memory store (use Redis in production)
const requestCounts = new Map<string, number>();

function checkRateLimit(ip: string): boolean {
  const count = requestCounts.get(ip) || 0;
  if (count > 100) { // 100 requests per hour
    return false;
  }
  requestCounts.set(ip, count + 1);
  return true;
}
```

