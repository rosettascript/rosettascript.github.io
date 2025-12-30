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
    id: "issues-page-launch",
    slug: "issues-page-launch",
    title: "New Issues Page: Submit Feedback & Bugs",
    excerpt: "I've launched a new Issues page to make it easier for users to report bugs, request features, and share feedback. Direct links to GitHub Issues included.",
    date: "2025-12-28",
    category: "Features",
    image: "/blog-images/issues.png",
    author: "RosettaScript",
    tags: ["Features", "Community", "Feedback"],
    content: `## New Issues Page: Submit Feedback & Report Bugs

I'm excited to announce the launch of my new **Issues** page! This dedicated page makes it easier than ever for users to report bugs, request features, and share feedback.

### What's New

The Issues page provides a streamlined way to interact with my GitHub Issues system. Whether you've found a bug, have a feature idea, or want to share general feedback, the new page guides you through the process.

### Key Features

#### Easy Navigation

- **Quick Access**: The Issues page is now accessible from both the main navigation menu and the footer
- **Direct Links**: One-click access to view all issues or create a new issue on GitHub
- **Clear Categories**: Organized sections for bug reports, feature requests, and general issues

#### Helpful Guidelines

Before submitting an issue, the page provides helpful guidelines to ensure your feedback is as useful as possible:

- **Search existing issues** to avoid duplicates
- **Provide clear details** about the issue, including steps to reproduce
- **Include relevant information** such as browser version, OS, and error messages
- **Be respectful** and constructive in your feedback

### How to Access

You can access the Issues page in several ways:

1. **Navigation Menu**: Click "Issues" in the main navigation bar
2. **Footer**: Find it under "Resources" in the footer
3. **Direct URL**: Visit \`/issues\` on the RosettaScript website

### Why This Matters

Your feedback is invaluable in helping me improve RosettaScript. By making it easier to submit issues and feedback, I hope to:

- **Respond faster** to bug reports and feature requests
- **Build better tools** based on your needs
- **Foster community** engagement and collaboration

### Get Started

Ready to share your feedback? Visit the [Issues page](/issues) and let me know what you think!

---

*Released: December 28, 2025*`
  },
  {
    id: "patch-1-0-2",
    slug: "patch-1-0-2",
    title: "Patch 1.0.2: Enhanced Shoppables & Cleanup",
    excerpt: "I've released Patch 1.0.2 with major improvements to the Word to HTML converter, including new spacing options for Shoppables mode and cleanup enhancements.",
    date: "2025-12-28",
    category: "Updates",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
    author: "RosettaScript",
    tags: ["Updates", "Word to HTML", "Shoppables"],
    content: `## Patch 1.0.2 - Enhanced Shoppables Mode & HTML Cleanup

I'm excited to announce Patch 1.0.2, which brings significant improvements to the Word to HTML converter, particularly for Shoppables mode users.

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

I'd love to hear your feedback on these improvements! If you encounter any issues or have suggestions, please let me know.

---

*Released: December 28, 2025*`
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
 * Format date to "December 28, 2025" format
 */
export function formatNewsDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

