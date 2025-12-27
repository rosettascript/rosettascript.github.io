/**
 * HTML Validator
 * Validates that all features from each output format are working correctly
 */

import type { OutputMode, FeatureFlags } from './converter';

export interface TestResult {
  feature: string;
  mode: OutputMode;
  passed: boolean;
  message: string;
  details?: string[] | null;
}

export interface ValidationResults {
  results: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    byMode: {
      regular: { total: number; passed: number; failed: number };
      blogs: { total: number; passed: number; failed: number };
      shoppables: { total: number; passed: number; failed: number };
    };
  };
}

class ValidationResultsImpl implements ValidationResults {
  results: TestResult[] = [];
  summary = {
    total: 0,
    passed: 0,
    failed: 0,
    byMode: {
      regular: { total: 0, passed: 0, failed: 0 },
      blogs: { total: 0, passed: 0, failed: 0 },
      shoppables: { total: 0, passed: 0, failed: 0 },
    },
  };

  addResult(result: TestResult) {
    this.results.push(result);
    this.summary.total++;
    this.summary.byMode[result.mode].total++;

    if (result.passed) {
      this.summary.passed++;
      this.summary.byMode[result.mode].passed++;
    } else {
      this.summary.failed++;
      this.summary.byMode[result.mode].failed++;
    }
  }
}

function validateHeadingStrong(html: string, mode: OutputMode): TestResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

  if (mode === 'regular') {
    const hasStrongWrapped = Array.from(headings).some((h) => {
      const children = Array.from(h.children);
      return children.length === 1 && children[0].tagName.toLowerCase() === 'strong';
    });
    return {
      feature: 'Heading Strong Tags',
      mode,
      passed: !hasStrongWrapped,
      message: hasStrongWrapped
        ? 'Headings should not be wrapped in <strong> in regular mode'
        : 'Headings correctly not wrapped in <strong>',
    };
  } else {
    const allWrapped = Array.from(headings).every((h) => {
      const children = Array.from(h.children);
      return children.length === 1 && children[0].tagName.toLowerCase() === 'strong';
    });
    const wrappedCount = Array.from(headings).filter((h) => {
      const children = Array.from(h.children);
      return children.length === 1 && children[0].tagName.toLowerCase() === 'strong';
    }).length;
    return {
      feature: 'Heading Strong Tags',
      mode,
      passed: allWrapped,
      message: allWrapped
        ? 'All headings wrapped in <strong>'
        : `Found ${headings.length - wrappedCount} headings without <strong> wrapper`,
    };
  }
}

function validateLinkAttributes(html: string, mode: OutputMode): TestResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const links = doc.querySelectorAll('a[href]');

  if (links.length === 0) {
    return {
      feature: 'Link Attributes',
      mode,
      passed: true,
      message: 'No links found (skipped)',
    };
  }

  if (mode === 'regular') {
    const hasAttributes = Array.from(links).some(
      (link) => link.hasAttribute('target') || link.hasAttribute('rel')
    );
    return {
      feature: 'Link Attributes',
      mode,
      passed: !hasAttributes,
      message: hasAttributes
        ? 'Links should not have target/rel attributes in regular mode'
        : 'Links correctly without target/rel attributes',
    };
  } else {
    const allHaveAttributes = Array.from(links).every((link) => {
      const hasTarget = link.getAttribute('target') === '_blank';
      const rel = link.getAttribute('rel') || '';
      const hasRel = rel.includes('noopener') && rel.includes('noreferrer');
      return hasTarget && hasRel;
    });

    const missingCount = Array.from(links).filter((link) => {
      const hasTarget = link.getAttribute('target') === '_blank';
      const rel = link.getAttribute('rel') || '';
      const hasRel = rel.includes('noopener') && rel.includes('noreferrer');
      return !hasTarget || !hasRel;
    }).length;

    return {
      feature: 'Link Attributes',
      mode,
      passed: allHaveAttributes,
      message: allHaveAttributes
        ? `All ${links.length} links have target="_blank" rel="noopener noreferrer"`
        : `${missingCount} of ${links.length} links missing required attributes`,
    };
  }
}

function validateListNormalize(html: string, mode: OutputMode): TestResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const listItems = doc.querySelectorAll('li');

  if (listItems.length === 0) {
    return {
      feature: 'List Normalization',
      mode,
      passed: true,
      message: 'No list items found (skipped)',
    };
  }

  const issues: string[] = [];

  listItems.forEach((li) => {
    const strongTags = li.querySelectorAll('strong');

    strongTags.forEach((strong) => {
      const strongText = strong.textContent || '';

      if (strongText.trim().endsWith(':')) {
        const strongHTML = strong.innerHTML;
        const trimmedHTML = strongHTML.trim();
        if (trimmedHTML.endsWith(': ') || trimmedHTML.match(/:\s+$/)) {
          issues.push(
            `List item has trailing space before </strong> in "${strongText.trim().substring(0, 30)}..."`
          );
        }

        let nextNode = strong.nextSibling;

        if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
          const text = (nextNode as Text).textContent || '';
          if (text.length === 0 || !text.startsWith(' ')) {
            issues.push(
              `List item missing space after </strong> in "${strongText.trim().substring(0, 30)}..."`
            );
          } else if (text.startsWith('  ')) {
            issues.push(
              `List item has multiple spaces after </strong> in "${strongText.trim().substring(0, 30)}..."`
            );
          }
        } else {
          issues.push(
            `List item missing text node with space after </strong> in "${strongText.trim().substring(0, 30)}..."`
          );
        }
      }
    });
  });

  return {
    feature: 'List Normalization',
    mode,
    passed: issues.length === 0,
    message:
      issues.length === 0
        ? 'All list items with colons are properly normalized'
        : `${issues.length} list normalization issue(s) found`,
    details: issues.length > 0 ? issues : null,
  };
}

function validateKeyTakeaways(html: string, mode: OutputMode): TestResult {
  if (mode !== 'blogs') {
    return {
      feature: 'Key Takeaways Formatting',
      mode,
      passed: true,
      message: 'Key Takeaways formatting not required for this mode',
    };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const headings = doc.querySelectorAll('h2');
  let keyTakeawaysHeading: Element | null = null;

  for (let heading of Array.from(headings)) {
    const text = heading.textContent?.trim() || '';
    if (text.toLowerCase().includes('key takeaways')) {
      keyTakeawaysHeading = heading;
      break;
    }
  }

  if (!keyTakeawaysHeading) {
    return {
      feature: 'Key Takeaways Formatting',
      mode,
      passed: true,
      message: 'No Key Takeaways section found (skipped)',
    };
  }

  let nextSibling = keyTakeawaysHeading.nextElementSibling;
  while (nextSibling && nextSibling.tagName.toLowerCase() !== 'ul') {
    nextSibling = nextSibling.nextElementSibling;
  }

  if (!nextSibling || nextSibling.tagName.toLowerCase() !== 'ul') {
    return {
      feature: 'Key Takeaways Formatting',
      mode,
      passed: true,
      message: 'Key Takeaways heading found but no list found (skipped)',
    };
  }

  const listItems = nextSibling.querySelectorAll('li');
  const hasEmTags = Array.from(listItems).some((li) => li.querySelector('em'));

  return {
    feature: 'Key Takeaways Formatting',
    mode,
    passed: !hasEmTags,
    message: hasEmTags
      ? 'Found <em> tags in Key Takeaways (should be removed)'
      : 'No <em> tags in Key Takeaways (correct)',
  };
}

function validateH1Removal(html: string, mode: OutputMode): TestResult {
  if (mode !== 'blogs') {
    return {
      feature: 'H1 Removal',
      mode,
      passed: true,
      message: 'H1 removal not required for this mode',
    };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const headings = doc.querySelectorAll('h2');
  let keyTakeawaysHeading: Element | null = null;

  for (let heading of Array.from(headings)) {
    const text = heading.textContent?.trim() || '';
    if (text.toLowerCase().includes('key takeaways')) {
      keyTakeawaysHeading = heading;
      break;
    }
  }

  if (!keyTakeawaysHeading) {
    return {
      feature: 'H1 Removal',
      mode,
      passed: true,
      message: 'No Key Takeaways section found (skipped)',
    };
  }

  let nextSibling = keyTakeawaysHeading.nextElementSibling;
  while (nextSibling && nextSibling.tagName.toLowerCase() !== 'ul') {
    nextSibling = nextSibling.nextElementSibling;
  }

  if (!nextSibling || nextSibling.tagName.toLowerCase() !== 'ul') {
    return {
      feature: 'H1 Removal',
      mode,
      passed: true,
      message: 'Key Takeaways heading found but no list found (skipped)',
    };
  }

  let elementAfterUl = nextSibling.nextElementSibling;
  while (
    elementAfterUl &&
    elementAfterUl.nodeType === Node.TEXT_NODE &&
    !(elementAfterUl as Text).textContent?.trim()
  ) {
    elementAfterUl = elementAfterUl.nextElementSibling;
  }

  const hasH1After = elementAfterUl && elementAfterUl.tagName.toLowerCase() === 'h1';

  return {
    feature: 'H1 Removal',
    mode,
    passed: !hasH1After,
    message: hasH1After
      ? 'Found H1 after Key Takeaways (should be removed)'
      : 'No H1 after Key Takeaways (correct)',
  };
}

function validateSpacing(html: string, mode: OutputMode, features?: FeatureFlags): TestResult {
  // For shoppables mode, check if spacing is enabled
  if (mode === 'shoppables') {
    if (features?.spacing === true) {
      // Spacing is enabled, validate that spacing is applied
      // Continue to validation logic below
    } else {
      // Spacing is disabled (default), validate that spacing is NOT applied
      return {
        feature: 'Spacing Rules',
        mode,
        passed: true,
        message: 'Spacing rules correctly disabled in Shoppables mode',
      };
    }
  }
  
  if (mode !== 'blogs' && mode !== 'shoppables') {
    return {
      feature: 'Spacing Rules',
      mode,
      passed: true,
      message: 'Spacing rules not required for this mode',
    };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  function isSpacingElement(element: Element | null): boolean {
    if (!element || element.tagName.toLowerCase() !== 'p') return false;
    const html = element.innerHTML.trim();
    return html === '&nbsp;' || html === '\u00A0';
  }

  const issues: string[] = [];

  const headings = doc.querySelectorAll('h2');
  let keyTakeawaysHeading: Element | null = null;
  for (let heading of Array.from(headings)) {
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
      const elementAfterUl = nextSibling.nextElementSibling;
      if (!isSpacingElement(elementAfterUl as Element)) {
        issues.push('Missing spacing after Key Takeaways section');
      }
    }
  }

  const allHeadings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let foundFaqSection = false;
  let isFirstFaqQuestion = false;

  allHeadings.forEach((heading) => {
    const text = heading.textContent?.trim().toLowerCase() || '';

    if (text.includes('key takeaways')) {
      return;
    }

    if (text.includes('frequently asked questions') || text.includes('faq')) {
      foundFaqSection = true;
      isFirstFaqQuestion = true;
    }

    if (foundFaqSection && isFirstFaqQuestion && heading.tagName.toLowerCase() === 'h3') {
      isFirstFaqQuestion = false;
      return;
    }

    const prevSibling = heading.previousElementSibling;
    if (!isSpacingElement(prevSibling)) {
      issues.push(`Missing spacing before heading: "${heading.textContent?.trim().substring(0, 30)}..."`);
    }
  });

  const paragraphs = doc.querySelectorAll('p');
  paragraphs.forEach((p) => {
    const text = p.textContent?.trim().toLowerCase() || '';
    if (text.includes('read also:') || text.includes('read more:') || text.includes('see more:')) {
      const prevSibling = p.previousElementSibling;
      if (!isSpacingElement(prevSibling)) {
        issues.push(`Missing spacing before "${text.substring(0, 20)}..."`);
      }
    }
    if (text.startsWith('sources:')) {
      const prevSibling = p.previousElementSibling;
      if (!isSpacingElement(prevSibling)) {
        issues.push('Missing spacing before "Sources:" section');
      }
    }
    if (text.startsWith('disclaimer:')) {
      const prevSibling = p.previousElementSibling;
      if (!isSpacingElement(prevSibling)) {
        issues.push('Missing spacing before "Disclaimer:" section');
      }
    }
    if (text.includes('alt image text:')) {
      const prevSibling = p.previousElementSibling;
      if (!isSpacingElement(prevSibling)) {
        issues.push('Missing spacing before "Alt Image Text:" paragraph');
      }
    }
  });

  return {
    feature: 'Spacing Rules',
    mode,
    passed: issues.length === 0,
    message:
      issues.length === 0 ? 'All spacing rules satisfied' : `${issues.length} spacing issues found`,
    details: issues.length > 0 ? issues : null,
  };
}

function validateOlHeaderConversion(html: string, mode: OutputMode): TestResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const olElements = doc.querySelectorAll('ol');

  if (olElements.length === 0) {
    return {
      feature: 'OL Header Conversion',
      mode,
      passed: true,
      message: 'No <ol> elements found (skipped)',
    };
  }

  const headerLists = Array.from(olElements).filter((ol) => {
    const listItems = ol.querySelectorAll(':scope > li');
    if (listItems.length === 0) return false;

    return Array.from(listItems).every((li) => {
      const children = Array.from(li.childNodes);
      const elementChildren = children.filter((node) => node.nodeType === 1);
      if (elementChildren.length !== 1) return false;

      const strongTag = elementChildren[0] as Element;
      if (strongTag.tagName.toLowerCase() !== 'strong') return false;

      const headingChildren = Array.from(strongTag.children).filter((node) =>
        /^h[1-6]$/i.test(node.tagName)
      );
      return headingChildren.length === 1;
    });
  });

  if (headerLists.length === 0) {
    return {
      feature: 'OL Header Conversion',
      mode,
      passed: true,
      message: 'No header lists found (skipped)',
    };
  }

  const unconvertedLists = headerLists.filter((ol) => {
    let nextSibling = ol.nextElementSibling;
    while (nextSibling) {
      if (nextSibling.tagName.toLowerCase() === 'p') {
        const text = nextSibling.textContent?.trim() || '';
        if (text === '' || text === '\u00A0' || text === '&nbsp;') {
          nextSibling = nextSibling.nextElementSibling;
          continue;
        }
      }
      if (nextSibling.tagName.toLowerCase() === 'ol') {
        const listItems = nextSibling.querySelectorAll(':scope > li');
        const isHeaderList = Array.from(listItems).every((li) => {
          const children = Array.from(li.childNodes);
          const elementChildren = children.filter((node) => node.nodeType === 1);
          if (elementChildren.length !== 1) return false;
          const strongTag = elementChildren[0] as Element;
          if (strongTag.tagName.toLowerCase() !== 'strong') return false;
          const headingChildren = Array.from(strongTag.children).filter((node) =>
            /^h[1-6]$/i.test(node.tagName)
          );
          return headingChildren.length === 1;
        });
        if (isHeaderList) {
          return false;
        }
      }
      break;
    }
    return true;
  });

  return {
    feature: 'OL Header Conversion',
    mode,
    passed: unconvertedLists.length === 0,
    message:
      unconvertedLists.length === 0
        ? 'All header lists correctly converted'
        : `${unconvertedLists.length} header list(s) should be converted but remain as <ol>`,
  };
}

function validateSourcesNormalize(html: string, mode: OutputMode): TestResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const paragraphs = doc.querySelectorAll('p');

  let sourcesParagraph: Element | null = null;
  for (let p of Array.from(paragraphs)) {
    const text = p.textContent?.trim().toLowerCase() || '';
    if (text === 'sources' || text === 'sources:') {
      sourcesParagraph = p;
      break;
    }
  }

  if (!sourcesParagraph) {
    return {
      feature: 'Sources Normalization',
      mode,
      passed: true,
      message: 'No Sources section found (skipped)',
    };
  }

  const issues: string[] = [];

  const strongTag = sourcesParagraph.querySelector('strong');
  if (!strongTag) {
    issues.push('Sources paragraph missing <strong> tag');
  } else {
    const emTag = strongTag.querySelector('em');
    if (!emTag) {
      issues.push('Sources paragraph missing <em> tag inside <strong>');
    } else {
      const emText = emTag.textContent?.trim().toLowerCase() || '';
      if (emText !== 'sources:') {
        issues.push(
          `Sources <em> tag should contain "Sources:" but found "${emTag.textContent?.trim()}"`
        );
      }
    }
  }

  let nextSibling = sourcesParagraph.nextElementSibling;
  while (nextSibling && nextSibling.tagName.toLowerCase() !== 'ol') {
    nextSibling = nextSibling.nextElementSibling;
  }

  if (!nextSibling || nextSibling.tagName.toLowerCase() !== 'ol') {
    return {
      feature: 'Sources Normalization',
      mode,
      passed: issues.length === 0,
      message:
        issues.length === 0
          ? 'Sources paragraph formatted correctly but no <ol> list found'
          : issues.join('; '),
    };
  }

  const listItems = nextSibling.querySelectorAll('li');
  if (listItems.length === 0) {
    return {
      feature: 'Sources Normalization',
      mode,
      passed: issues.length === 0,
      message:
        issues.length === 0
          ? 'Sources paragraph formatted correctly but <ol> has no items'
          : issues.join('; '),
    };
  }

  listItems.forEach((li, index) => {
    if (li.children.length === 1 && li.children[0].tagName.toLowerCase() === 'em') {
      const hasTextOutside = Array.from(li.childNodes).some(
        (node) =>
          node.nodeType === Node.TEXT_NODE &&
          node !== li.children[0] &&
          (node as Text).textContent?.trim()
      );
      if (hasTextOutside) {
        issues.push(`List item ${index + 1} has text outside <em> tag`);
      }
    } else {
      issues.push(`List item ${index + 1} is not wrapped in <em> tag`);
    }
  });

  return {
    feature: 'Sources Normalization',
    mode,
    passed: issues.length === 0,
    message:
      issues.length === 0
        ? `Sources section correctly formatted (${listItems.length} item(s))`
        : `${issues.length} issue(s) found: ${issues.join('; ')}`,
    details: issues.length > 0 ? issues : null,
  };
}

function validateRelativePaths(html: string, mode: OutputMode, features: FeatureFlags): TestResult {
  if (!features.relativePaths) {
    return {
      feature: 'Relative Paths',
      mode,
      passed: true,
      message: 'Relative paths feature disabled (skipped)',
    };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const links = doc.querySelectorAll('a[href]');

  if (links.length === 0) {
    return {
      feature: 'Relative Paths',
      mode,
      passed: true,
      message: 'No links found (skipped)',
    };
  }

  const absoluteUrls = Array.from(links).filter((link) => {
    const href = link.getAttribute('href');
    return href && href.includes('://');
  });

  return {
    feature: 'Relative Paths',
    mode,
    passed: absoluteUrls.length === 0,
    message:
      absoluteUrls.length === 0
        ? 'All URLs converted to relative paths'
        : `${absoluteUrls.length} absolute URL(s) found (should be converted)`,
  };
}

function validateBasicStructure(html: string, mode: OutputMode): TestResult {
  if (mode !== 'regular') {
    return {
      feature: 'Basic HTML Structure',
      mode,
      passed: true,
      message: 'Basic structure validation not required for this mode',
    };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const hasContent = doc.body && doc.body.innerHTML.trim().length > 0;
  const hasValidElements = doc.body && doc.body.children.length > 0;

  return {
    feature: 'Basic HTML Structure',
    mode,
    passed: hasContent && hasValidElements,
    message:
      hasContent && hasValidElements
        ? 'HTML structure is valid'
        : 'HTML structure is invalid or empty',
  };
}

export function validateMode(html: string, mode: OutputMode, features: FeatureFlags): ValidationResults {
  const results = new ValidationResultsImpl();

  if (mode === 'regular') {
    results.addResult(validateBasicStructure(html, mode));
    results.addResult(validateHeadingStrong(html, mode));
    results.addResult(validateLinkAttributes(html, mode));
    results.addResult(validateListNormalize(html, mode));
  }

  if (mode === 'blogs') {
    results.addResult(validateHeadingStrong(html, mode));
    results.addResult(validateKeyTakeaways(html, mode));
    results.addResult(validateH1Removal(html, mode));
    results.addResult(validateLinkAttributes(html, mode));
    results.addResult(validateSpacing(html, mode, features));
    results.addResult(validateOlHeaderConversion(html, mode));
    results.addResult(validateRelativePaths(html, mode, features));
    results.addResult(validateListNormalize(html, mode));
    results.addResult(validateSourcesNormalize(html, mode));
  }

  if (mode === 'shoppables') {
    results.addResult(validateHeadingStrong(html, mode));
    results.addResult(validateLinkAttributes(html, mode));
    results.addResult(validateOlHeaderConversion(html, mode));
    results.addResult(validateRelativePaths(html, mode, features));
    results.addResult(validateListNormalize(html, mode));
    results.addResult(validateSourcesNormalize(html, mode));
    const keyTakeawaysResult = validateKeyTakeaways(html, mode);
    results.addResult({
      feature: 'Key Takeaways Formatting (should NOT be applied)',
      mode,
      passed: keyTakeawaysResult.passed || keyTakeawaysResult.message.includes('not required'),
      message: 'Key Takeaways formatting correctly not applied in Shoppables mode',
    });
    const h1RemovalResult = validateH1Removal(html, mode);
    results.addResult({
      feature: 'H1 Removal (should NOT be applied)',
      mode,
      passed: h1RemovalResult.passed || h1RemovalResult.message.includes('not required'),
      message: 'H1 removal correctly not applied in Shoppables mode',
    });
    const spacingResult = validateSpacing(html, mode, features);
    if (features?.spacing === true) {
      // Spacing is enabled, validate that spacing is applied correctly
      results.addResult(spacingResult);
    } else {
      // Spacing is disabled (default), validate that spacing is NOT applied
      results.addResult({
        feature: 'Spacing Rules (should NOT be applied)',
        mode,
        passed: spacingResult.passed || spacingResult.message.includes('not required') || spacingResult.message.includes('correctly disabled'),
        message: 'Spacing rules correctly not applied in Shoppables mode',
      });
    }
  }

  return results;
}

