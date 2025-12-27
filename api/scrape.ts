/**
 * Serverless function for web scraping
 * 
 * This function can be deployed to:
 * - Vercel: Place in /api folder (auto-detected)
 * - Netlify: Place in /netlify/functions folder
 * - AWS Lambda: Package and deploy separately
 * 
 * Usage:
 * POST /api/scrape
 * Body: { url: string, selector: string }
 */

// Types for Vercel (install with: npm install --save-dev @vercel/node)
// For other platforms, adjust the handler signature accordingly
interface VercelRequest {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
}

interface ScrapeRequest {
  url: string;
  selector: string;
}

interface ScrapeResult {
  text: string;
  html: string;
  attributes: Record<string, string>;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, selector }: ScrapeRequest = req.body;

  if (!url || !selector) {
    return res.status(400).json({ 
      error: 'Missing required fields: url and selector' 
    });
  }

  // Validate URL
  let validUrl = url.trim();
  if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
    validUrl = 'https://' + validUrl;
  }

  try {
    new URL(validUrl);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  try {
    // Fetch the website
    const response = await fetch(validUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Failed to fetch website: ${response.statusText}` 
      });
    }

    const html = await response.text();

    // Parse HTML using a simple DOM parser
    // Note: For production, consider using cheerio or jsdom
    const results = parseHTML(html, selector);

    if (results.length === 0) {
      return res.status(200).json({ 
        results: [],
        message: `No elements found matching selector: "${selector}"` 
      });
    }

    return res.status(200).json({ results });
  } catch (error) {
    console.error('Scraping error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to scrape website' 
    });
  }
}

/**
 * Simple HTML parser using DOMParser-like functionality
 * For production, use cheerio or jsdom for better compatibility
 */
function parseHTML(html: string, selector: string): ScrapeResult[] {
  // This is a simplified parser - in production, use cheerio or jsdom
  // For now, we'll use regex-based extraction for basic selectors
  
  const results: ScrapeResult[] = [];
  
  // Basic tag selector (e.g., "h1", "p", "div")
  if (/^[a-zA-Z][a-zA-Z0-9]*$/.test(selector)) {
    const regex = new RegExp(`<${selector}[^>]*>(.*?)</${selector}>`, 'gis');
    let match;
    while ((match = regex.exec(html)) !== null) {
      const fullMatch = match[0];
      const content = match[1];
      
      // Extract attributes
      const attrRegex = /(\w+)="([^"]*)"/g;
      const attributes: Record<string, string> = {};
      let attrMatch;
      while ((attrMatch = attrRegex.exec(fullMatch)) !== null) {
        attributes[attrMatch[1]] = attrMatch[2];
      }
      
      results.push({
        text: stripHTML(content),
        html: content,
        attributes,
      });
    }
  }
  
  // Class selector (e.g., ".title")
  if (selector.startsWith('.')) {
    const className = selector.slice(1);
    const regex = new RegExp(`<[^>]*class="[^"]*${className}[^"]*"[^>]*>(.*?)</[^>]+>`, 'gis');
    let match;
    while ((match = regex.exec(html)) !== null) {
      const fullMatch = match[0];
      const content = match[1];
      
      const attrRegex = /(\w+)="([^"]*)"/g;
      const attributes: Record<string, string> = {};
      let attrMatch;
      while ((attrMatch = attrRegex.exec(fullMatch)) !== null) {
        attributes[attrMatch[1]] = attrMatch[2];
      }
      
      results.push({
        text: stripHTML(content),
        html: content,
        attributes,
      });
    }
  }
  
  // ID selector (e.g., "#content")
  if (selector.startsWith('#')) {
    const id = selector.slice(1);
    const regex = new RegExp(`<[^>]*id="${id}"[^>]*>(.*?)</[^>]+>`, 'gis');
    let match;
    while ((match = regex.exec(html)) !== null) {
      const fullMatch = match[0];
      const content = match[1];
      
      const attrRegex = /(\w+)="([^"]*)"/g;
      const attributes: Record<string, string> = {};
      let attrMatch;
      while ((attrMatch = attrRegex.exec(fullMatch)) !== null) {
        attributes[attrMatch[1]] = attrMatch[2];
      }
      
      results.push({
        text: stripHTML(content),
        html: content,
        attributes,
      });
    }
  }
  
  return results;
}

function stripHTML(html: string): string {
  return html
    .replace(/<script[^>]*>.*?<\/script>/gis, '')
    .replace(/<style[^>]*>.*?<\/style>/gis, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

