export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  author?: string;
  tags?: string[];
  content: string;
}

export const newsArticles: NewsArticle[] = [
  {
    id: "patch-1-0-2",
    slug: "patch-1-0-2",
    title: "Patch 1.0.2 Released: Enhanced Shoppables Mode & HTML Cleanup",
    excerpt: "We've released Patch 1.0.2 with major improvements to the Word to HTML converter, including new spacing options for Shoppables mode and comprehensive HTML cleanup enhancements.",
    date: "2024-01-15",
    category: "Updates",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
    author: "RosettaScript Team",
    tags: ["Updates", "Word to HTML", "Shoppables"],
    content: `## Patch 1.0.2 - Enhanced Shoppables Mode & HTML Cleanup

We're excited to announce Patch 1.0.2, which brings significant improvements to the Word to HTML converter, particularly for Shoppables mode users.

### Bug Fixes

- **Fixed spacing checkbox default state**: The spacing checkbox in Shoppables mode is now correctly unchecked by default, allowing users to enable spacing only when needed.
- **Comprehensive BR tag removal**: All \`<br>\` tags are now properly removed from block elements (headers, paragraphs, lists) for cleaner, more semantic HTML output.
- **List item cleanup**: Fixed an issue where \`<p>\` tags were remaining inside list items. All paragraph tags are now properly unwrapped from list items.

### New Features

#### Shoppables Mode Enhancements

- **Spacing Rules checkbox**: Added a new "Spacing Rules" checkbox to Shoppables mode (unchecked by default). This allows users to enable spacing rules when needed, giving more control over the output format.

- **Add BR Before Read More**: New checkbox option to add \`<p><br></p>\` before "Read More", "Read Also", or "See More" sections. This is particularly useful for client pages that don't handle automatic spacing correctly.

- **Add BR Before Sources**: New checkbox option to add \`<p><br></p>\` before "Sources:" sections. Works independently of spacing rules and can replace existing \`<p>&nbsp;</p>\` spacers when spacing rules are enabled.

### Improvements

- Enhanced HTML cleaning pipeline with better BR tag removal
- Improved list item normalization
- Better handling of spacing elements in different contexts

### How to Use

1. **Hard refresh your browser** (Ctrl+Shift+R or Cmd+Shift+R) to load the latest version
2. Navigate to the Word to HTML converter
3. Select "Shoppables" output format
4. Explore the new spacing options in the Shoppables Features section

### Feedback

We'd love to hear your feedback on these improvements! If you encounter any issues or have suggestions, please let us know.

---

*Released: January 15, 2024*`
  }
];

export const newsCategories = ["Updates", "Features", "Announcements"];

export function getNewsArticle(slug: string): NewsArticle | undefined {
  return newsArticles.find(article => article.slug === slug || article.id === slug);
}

export function getLatestNews(count: number = 3): NewsArticle[] {
  return [...newsArticles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

/**
 * Format date to "January 15, 2024" format
 */
export function formatNewsDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

