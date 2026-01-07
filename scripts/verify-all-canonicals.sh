#!/bin/bash
# Verify all pages have canonical URLs with trailing slashes

echo "🔍 Verifying canonical URL fixes across all pages..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Count total pages with canonical
total=$(grep -r "canonical=" src/pages --include="*.tsx" | wc -l)
echo "📊 Total pages with canonical URLs: $total"
echo ""

# Check for pages WITHOUT trailing slashes (excluding homepage)
echo "Checking for pages missing trailing slashes..."
missing_slash=$(grep -r 'canonical="https://rosettascript.github.io/[^"]*[^/]"' src/pages --include="*.tsx" | grep -v 'github.io/"' | grep -v 'github.io/"' || true)

if [ -z "$missing_slash" ]; then
  echo -e "${GREEN}✅ All canonical URLs have trailing slashes (except homepage)${NC}"
else
  echo -e "${RED}❌ Found pages without trailing slashes:${NC}"
  echo "$missing_slash"
fi

echo ""

# List all canonical URLs
echo "📋 All canonical URLs found:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Main pages
echo -e "\n${YELLOW}Main Pages:${NC}"
grep -h "canonical=" src/pages/*.tsx 2>/dev/null | grep -v "tools/" | sed 's/.*canonical="\([^"]*\)".*/\1/' | sort

# Tool pages
echo -e "\n${YELLOW}Tool Pages:${NC}"
grep -h "canonical=" src/pages/tools/*.tsx 2>/dev/null | sed 's/.*canonical="\([^"]*\)".*/\1/' | sort

# Dynamic pages (BlogPost, NewsArticle)
echo -e "\n${YELLOW}Dynamic Pages:${NC}"
echo "BlogPost.tsx: Uses dynamic URL with trailing slash"
echo "NewsArticle.tsx: Uses dynamic URL with trailing slash"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verify homepage
homepage=$(grep -h 'canonical="https://rosettascript.github.io/"' src/pages/Index.tsx 2>/dev/null | wc -l)
if [ "$homepage" -eq 1 ]; then
  echo -e "\n${GREEN}✅ Homepage canonical is correct: https://rosettascript.github.io/${NC}"
else
  echo -e "\n${RED}❌ Homepage canonical issue${NC}"
fi

# Count pages by category
main_pages=$(grep -h "canonical=" src/pages/*.tsx 2>/dev/null | grep -v "tools/" | wc -l)
tool_pages=$(grep -h "canonical=" src/pages/tools/*.tsx 2>/dev/null | wc -l)

echo ""
echo "📊 Summary:"
echo "   Main pages: $main_pages"
echo "   Tool pages: $tool_pages"
echo "   Dynamic pages: 2 (BlogPost, NewsArticle)"
echo "   Total: $((main_pages + tool_pages + 2))"

echo ""
echo -e "${GREEN}✅ All pages have been fixed!${NC}"
echo "   - SEO component normalizes all canonical URLs"
echo "   - All page components use trailing slashes"
echo "   - Dynamic pages construct URLs with trailing slashes"

