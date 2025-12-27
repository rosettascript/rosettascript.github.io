/**
 * Mode Utility: OL Header Conversion
 * Converts single <ol> elements containing headers into manually numbered headers
 */

function isHeaderList(olElement: Element): boolean {
  const listItems = olElement.querySelectorAll(':scope > li');
  
  if (listItems.length === 0) {
    return false;
  }

  for (const li of listItems) {
    const children = Array.from(li.childNodes);
    const elementChildren = children.filter(node => node.nodeType === 1);
    if (elementChildren.length !== 1) {
      return false;
    }

    const strongTag = elementChildren[0] as Element;
    if (strongTag.tagName.toLowerCase() !== 'strong') {
      return false;
    }

    const headingChildren = Array.from(strongTag.children).filter(
      node => /^h[1-6]$/i.test((node as Element).tagName)
    );
    
    if (headingChildren.length !== 1) {
      return false;
    }

    const textNodes = Array.from(strongTag.childNodes).filter(
      node => node.nodeType === 3 && (node as Text).textContent?.trim() !== ''
    );
    if (textNodes.length > 0) {
      return false;
    }
  }

  return true;
}

function isFollowedByHeaderList(element: Element): boolean {
  let nextSibling = element.nextElementSibling;
  
  while (nextSibling) {
    if (nextSibling.tagName.toLowerCase() === 'p') {
      const text = nextSibling.textContent?.trim() || '';
      if (text === '' || text === '\u00A0' || text === '&nbsp;') {
        nextSibling = nextSibling.nextElementSibling;
        continue;
      }
    }
    
    if (nextSibling.tagName.toLowerCase() === 'ol' && isHeaderList(nextSibling)) {
      return true;
    }
    
    break;
  }
  
  return false;
}

export function convertOlHeaders(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const olElements = doc.querySelectorAll('ol');
    const olsToProcess: Element[] = [];

    olElements.forEach(ol => {
      if (isHeaderList(ol) && !isFollowedByHeaderList(ol)) {
        olsToProcess.push(ol);
      }
    });

    const bodyChildren = Array.from(doc.body.children);
    const sectionCounters = new Map<Element | null, number>();
    
    olsToProcess.forEach(ol => {
      const olIndex = bodyChildren.indexOf(ol);
      
      let parentH2: Element | null = null;
      for (let i = olIndex - 1; i >= 0; i--) {
        const element = bodyChildren[i];
        if (!element) continue;
        
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'h2') {
          parentH2 = element;
          break;
        }
        if (tagName === 'h1') {
          break;
        }
      }
      
      const sectionKey = parentH2 || null;
      if (!sectionCounters.has(sectionKey)) {
        sectionCounters.set(sectionKey, 1);
      }
      
      const counter = sectionCounters.get(sectionKey)!;
      
      const listItems = ol.querySelectorAll(':scope > li');
      const newElements: Element[] = [];

      listItems.forEach((li) => {
        const strongTag = li.querySelector(':scope > strong');
        if (!strongTag) return;

        const heading = strongTag.querySelector('h1, h2, h3, h4, h5, h6');
        if (!heading) return;

        const newHeading = heading.cloneNode(true) as Element;
        
        const innerStrong = newHeading.querySelector(':scope > strong');
        
        if (innerStrong) {
          const originalText = innerStrong.textContent?.trim() || '';
          innerStrong.textContent = `${counter}. ${originalText}`;
        } else {
          const headingText = newHeading.textContent?.trim() || '';
          newHeading.textContent = `${counter}. ${headingText}`;
        }
        
        sectionCounters.set(sectionKey, counter + 1);
        
        newElements.push(newHeading);
      });

      if (newElements.length > 0) {
        newElements.forEach((heading, index) => {
          if (index === 0) {
            ol.parentNode!.insertBefore(heading, ol);
          } else {
            const previousHeading = newElements[index - 1];
            previousHeading.parentNode!.insertBefore(heading, previousHeading.nextSibling);
          }
        });
        
        ol.remove();
      }
    });

    return doc.body.innerHTML;
  } catch (e) {
    console.warn('OL header conversion failed:', e);
    return html;
  }
}

