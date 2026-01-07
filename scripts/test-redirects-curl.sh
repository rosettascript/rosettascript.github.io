#!/bin/bash
# Quick test script using curl to verify redirect behavior
# Usage: ./scripts/test-redirects-curl.sh

echo "🔍 Testing URLs for redirect issues..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test URLs (without trailing slashes)
test_urls=(
  "https://rosettascript.github.io/blogs/how-to-convert-word-html-clean-seo-friendly"
  "https://rosettascript.github.io/tools/word-to-html"
  "https://rosettascript.github.io/tools/web-scraper"
  "https://rosettascript.github.io/tools/qr-code-generator"
  "https://rosettascript.github.io/school-projects"
  "https://rosettascript.github.io/news"
  "https://rosettascript.github.io/about"
  "https://rosettascript.github.io/blogs"
  "https://rosettascript.github.io/blogs/random-universe-cipher-ruc-post-quantum-security"
)

passed=0
failed=0

for url in "${test_urls[@]}"; do
  echo "Testing: $url"
  
  # Get HTTP status and location header
  response=$(curl -sI "$url" 2>&1)
  status=$(echo "$response" | grep -i "^HTTP" | awk '{print $2}')
  location=$(echo "$response" | grep -i "^location:" | sed 's/^[Ll]ocation: //' | tr -d '\r')
  
  # Expected location (URL with trailing slash)
  expected_location="${url}/"
  
  if [ "$status" = "301" ] || [ "$status" = "302" ]; then
    if [ "$location" = "$expected_location" ]; then
      echo -e "  ${GREEN}✅ Redirects correctly to: $location${NC}"
      ((passed++))
    else
      echo -e "  ${RED}❌ Redirects to wrong URL: $location${NC}"
      echo -e "  ${RED}   Expected: $expected_location${NC}"
      ((failed++))
    fi
  elif [ "$status" = "200" ]; then
    echo -e "  ${YELLOW}⚠️  No redirect (returns 200 directly)${NC}"
    ((passed++))
  else
    echo -e "  ${RED}❌ Unexpected status: $status${NC}"
    ((failed++))
  fi
  
  # Test URL with trailing slash
  url_with_slash="${url}/"
  response_slash=$(curl -sI "$url_with_slash" 2>&1)
  status_slash=$(echo "$response_slash" | grep -i "^HTTP" | awk '{print $2}')
  
  if [ "$status_slash" = "200" ]; then
    echo -e "  ${GREEN}✅ URL with trailing slash works (200)${NC}"
  else
    echo -e "  ${RED}❌ URL with trailing slash returns: $status_slash${NC}"
    ((failed++))
  fi
  
  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary:"
echo "   Passed: $passed"
echo "   Failed: $failed"
echo ""

if [ $failed -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed!${NC}"
  echo ""
  echo "Note: 301 redirects are expected and correct."
  echo "GitHub Pages redirects URLs without trailing slashes"
  echo "to URLs with trailing slashes. As long as your sitemap"
  echo "uses trailing slashes, Google Search Console should"
  echo "not report redirect errors."
else
  echo -e "${RED}❌ Some tests failed. Please review the output above.${NC}"
fi

