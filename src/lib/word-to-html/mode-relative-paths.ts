/**
 * Mode Utility: Relative Paths
 * Converts absolute URLs to relative paths by removing domain
 */

export function convertToRelativePaths(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const links = doc.querySelectorAll('a[href]');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      
      if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../') || !href.includes('://')) {
        return;
      }
      
      try {
        const url = new URL(href);
        const relativePath = url.pathname + url.search + url.hash;
        link.setAttribute('href', relativePath);
      } catch (e) {
        // Leave as is if URL parsing fails
      }
    });
    
    return doc.body.innerHTML;
  } catch (e) {
    console.warn('Relative path conversion failed:', e);
    return html;
  }
}

