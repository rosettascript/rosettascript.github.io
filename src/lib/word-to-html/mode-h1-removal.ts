/**
 * Mode Utility: H1 Removal
 * Removes H1 tags that appear immediately after Key Takeaways section
 */

export function removeH1AfterKeyTakeaways(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const headings = doc.querySelectorAll('h2');
    let keyTakeawaysHeading: Element | null = null;
    
    for (let heading of headings) {
      const text = heading.textContent?.trim() || '';
      if (text.toLowerCase().includes('key takeaways')) {
        keyTakeawaysHeading = heading;
        break;
      }
    }
    
    if (keyTakeawaysHeading) {
      let nextSibling = keyTakeawaysHeading.nextElementSibling;
      while (nextSibling && nextSibling.tagName.toLowerCase() !== 'ul') {
        nextSibling = nextSibling.nextElementSibling;
      }
      
      if (nextSibling && nextSibling.tagName.toLowerCase() === 'ul') {
        let elementAfterUl = nextSibling.nextElementSibling;
        
        while (elementAfterUl && 
               elementAfterUl.nodeType === Node.TEXT_NODE && 
               !(elementAfterUl as Text).textContent?.trim()) {
          elementAfterUl = elementAfterUl.nextSibling;
        }
        
        if (elementAfterUl && elementAfterUl.nodeType === Node.ELEMENT_NODE &&
            (elementAfterUl as Element).tagName.toLowerCase() === 'h1') {
          elementAfterUl.remove();
        }
      }
    }
    
    return doc.body.innerHTML;
  } catch (e) {
    console.warn('H1 removal failed:', e);
    return html;
  }
}

