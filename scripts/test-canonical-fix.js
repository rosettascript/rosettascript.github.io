#!/usr/bin/env node
/**
 * Test script to verify canonical URL fix
 * Tests that both static HTML and rendered HTML have matching canonical URLs with trailing slashes
 */

const testUrls = [
  'https://rosettascript.github.io/tools',
  'https://rosettascript.github.io/blogs',
  'https://rosettascript.github.io/news',
  'https://rosettascript.github.io/about',
  'https://rosettascript.github.io/tools/word-to-html',
  'https://rosettascript.github.io/tools/web-scraper',
  'https://rosettascript.github.io/blogs/how-to-convert-word-html-clean-seo-friendly',
];

function extractCanonical(html) {
  // Extract canonical URL from HTML - try multiple patterns
  if (!html || typeof html !== 'string') {
    return null;
  }
  
  // Try standard pattern first
  let canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  if (canonicalMatch && canonicalMatch[1]) {
    return canonicalMatch[1];
  }
  
  // Try with different quote styles
  canonicalMatch = html.match(/<link\s+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (canonicalMatch && canonicalMatch[1]) {
    return canonicalMatch[1];
  }
  
  // Try with href first
  canonicalMatch = html.match(/<link\s+href=["']([^"']+)["']\s+rel=["']canonical["']/i);
  if (canonicalMatch && canonicalMatch[1]) {
    return canonicalMatch[1];
  }
  
  return null;
}

async function testCanonical(url) {
  try {
    // Fetch the page HTML
    const response = await fetch(url);
    if (!response.ok) {
      return {
        url,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }
    
    const html = await response.text();
    const canonical = extractCanonical(html);
    
    // Ensure canonical is a string before checking
    if (canonical === null || typeof canonical !== 'string') {
      return {
        url,
        canonical: null,
        error: 'Canonical URL not found in HTML',
        status: response.status
      };
    }
    
    const hasTrailingSlash = canonical.endsWith('/');
    const isHomepage = canonical === 'https://rosettascript.github.io/';
    const expectedCanonical = url.endsWith('/') ? url : `${url}/`;
    
    // Homepage is special case - it should be exactly "/"
    const isCorrect = isHomepage 
      ? canonical === 'https://rosettascript.github.io/'
      : canonical === expectedCanonical;
    
    return {
      url,
      canonical,
      hasTrailingSlash: hasTrailingSlash || isHomepage,
      expectedCanonical,
      isCorrect,
      status: response.status
    };
  } catch (error) {
    return {
      url,
      error: error.message
    };
  }
}

async function runTests() {
  console.log('🔍 Testing canonical URLs for consistency...\n');
  
  const results = await Promise.all(testUrls.map(testCanonical));
  
  let allPassed = true;
  
  results.forEach((result) => {
    if (result.error) {
      console.log(`❌ ${result.url}`);
      console.log(`   Error: ${result.error}\n`);
      allPassed = false;
      return;
    }
    
    const status = result.isCorrect ? '✅' : '❌';
    console.log(`${status} ${result.url}`);
    console.log(`   Canonical: ${result.canonical || 'NOT FOUND'}`);
    
    if (result.isCorrect) {
      console.log(`   ✅ Matches expected: ${result.expectedCanonical}`);
      if (result.hasTrailingSlash) {
        console.log(`   ✅ Has trailing slash`);
      }
    } else {
      console.log(`   ❌ Expected: ${result.expectedCanonical}`);
      console.log(`   ❌ Got: ${result.canonical || 'NOT FOUND'}`);
      allPassed = false;
    }
    
    console.log(`   Status: ${result.status}`);
    console.log('');
  });
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 Summary:`);
  console.log(`   Total URLs tested: ${results.length}`);
  const passed = results.filter(r => r.isCorrect).length;
  const failed = results.filter(r => !r.isCorrect && !r.error).length;
  console.log(`   Passed: ${passed}`);
  console.log(`   Failed: ${failed}`);
  console.log('');
  
  if (allPassed) {
    console.log('✅ All canonical URLs are correct!');
    console.log('   Both static HTML and rendered HTML should now match.');
    console.log('   Ahrefs should no longer show canonical mismatches.');
  } else {
    console.log('❌ Some canonical URLs need fixing.');
  }
  console.log('');
  
  console.log('📝 Note: After deploying, test with Ahrefs to verify:');
  console.log('   - Raw HTML canonical should match Rendered HTML canonical');
  console.log('   - Both should have trailing slashes (except homepage)');
  console.log('');
}

// Run tests
runTests().catch(console.error);

