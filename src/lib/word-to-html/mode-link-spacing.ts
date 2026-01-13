/**
 * Mode Utility: Link Spacing
 * Ensures proper spacing before links, especially in list items
 * 
 * Idempotent: safe to run multiple times without adding extra spaces
 */

// Regex pattern for checking if text ends with whitespace (space, newline, or non-breaking space)
const WHITESPACE_END_RE = /[\s\u00A0]$/;

export function addLinkSpacing(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Helper function to check if text ends with whitespace
    const endsWithWhitespace = (text: string): boolean => {
      return WHITESPACE_END_RE.test(text);
    };
    
    // Helper function to get the last text node from an element
    const getLastTextNodeFromElement = (element: Element): Text | null => {
      const walker = doc.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT
      );
      let lastTextNode: Text | null = null;
      let node;
      while ((node = walker.nextNode())) {
        lastTextNode = node as Text;
      }
      return lastTextNode;
    };
    
    // Helper function to find the previous meaningful sibling (skips empty text nodes)
    const findPreviousMeaningfulSibling = (node: Node | null): Node | null => {
      let current = node;
      while (
        current &&
        current.nodeType === Node.TEXT_NODE &&
        !(current as Text).textContent?.trim()
      ) {
        current = current.previousSibling;
      }
      return current;
    };
    
    const allAnchors = doc.querySelectorAll('a');
    
    allAnchors.forEach(anchor => {
      // Guard against missing parentNode (defensive safety check)
      if (!anchor.parentNode) {
        return;
      }
      
      const prevSibling = anchor.previousSibling;
      
      // Find the last meaningful text node before the anchor
      let textNodeToModify: Text | null = null;
      let textContent = '';
      
      if (!prevSibling) {
        // No previous sibling - insert space node
        const spaceNode = doc.createTextNode(' ');
        anchor.parentNode.insertBefore(spaceNode, anchor);
        return;
      }
      
      if (prevSibling.nodeType === Node.TEXT_NODE) {
        const text = (prevSibling as Text).textContent || '';
        if (text.trim()) {
          // Found a text node with content
          textNodeToModify = prevSibling as Text;
          textContent = text;
        } else {
          // Empty text node - look for previous element's last text
          const prevElement = findPreviousMeaningfulSibling(prevSibling.previousSibling);
          if (prevElement && prevElement.nodeType === Node.ELEMENT_NODE) {
            const lastText = getLastTextNodeFromElement(prevElement as Element);
            if (lastText) {
              textNodeToModify = lastText;
              textContent = lastText.textContent || '';
            }
          }
        }
      } else if (prevSibling.nodeType === Node.ELEMENT_NODE) {
        // Previous sibling is an element - get its last text node
        const lastText = getLastTextNodeFromElement(prevSibling as Element);
        if (lastText) {
          textNodeToModify = lastText;
          textContent = lastText.textContent || '';
        }
      }
      
      // Add space if needed
      if (textNodeToModify && textContent.trim() && !endsWithWhitespace(textContent)) {
        // Text node exists, has content, and doesn't end with whitespace - add space
        textNodeToModify.textContent = textContent + ' ';
      } else if (!textNodeToModify) {
        // No text node found - insert a space node before the anchor
        const spaceNode = doc.createTextNode(' ');
        anchor.parentNode.insertBefore(spaceNode, anchor);
      }
      // If text ends with whitespace, we don't need to do anything
    });
    
    return doc.body.innerHTML;
  } catch (e) {
    console.warn('Link spacing addition failed:', e);
    return html;
  }
}

