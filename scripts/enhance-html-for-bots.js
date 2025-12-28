#!/usr/bin/env node
/**
 * Enhanced HTML generation with meta tags, structured data, and pre-rendered content
 * for better AI bot and training crawler accessibility
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogPostsFile = path.join(__dirname, '..', 'src', 'data', 'blogPosts.ts');
const newsFile = path.join(__dirname, '..', 'src', 'data', 'news.ts');
const toolsFile = path.join(__dirname, '..', 'src', 'pages', 'Tools.tsx');
const baseUrl = 'https://rosettascript.github.io';

/**
 * Extract blog post data from blogPosts.ts
 */
function getBlogPosts() {
  try {
    const content = fs.readFileSync(blogPostsFile, 'utf-8');
    const posts = [];
    
    // Find all id patterns and extract nearby fields
    const idPattern = /id:\s*"([^"]+)"/g;
    let idMatch;
    
    while ((idMatch = idPattern.exec(content)) !== null) {
      const postId = idMatch[1];
      const searchStart = Math.max(0, idMatch.index - 500);
      const searchEnd = Math.min(content.length, idMatch.index + 5000);
      const block = content.substring(searchStart, searchEnd);
      
      const titleMatch = block.match(/title:\s*"([^"]+)"/);
      const excerptMatch = block.match(/excerpt:\s*"([^"]+)"/);
      const dateMatch = block.match(/date:\s*"([^"]+)"/);
      const authorMatch = block.match(/author:\s*"([^"]+)"/);
      const tagsMatch = block.match(/tags:\s*\[([^\]]*)\]/);
      
      if (titleMatch && excerptMatch && dateMatch) {
        const tags = tagsMatch 
          ? tagsMatch[1]
              .split(',')
              .map(tag => tag.trim().replace(/"/g, ''))
              .filter(tag => tag)
          : [];
        
        posts.push({
          id: postId,
          title: titleMatch[1],
          excerpt: excerptMatch[1],
          date: dateMatch[1],
          author: authorMatch ? authorMatch[1] : 'RosettaScript Team',
          tags: tags
        });
      }
    }
    
    return posts;
  } catch (error) {
    console.warn('Warning: Could not read blogPosts.ts:', error.message);
    return [];
  }
}

/**
 * Extract news article data from news.ts
 */
function getNewsArticles() {
  try {
    const content = fs.readFileSync(newsFile, 'utf-8');
    const articles = [];
    
    // Find all slug patterns and extract nearby fields
    const slugPattern = /slug:\s*"([^"]+)"/g;
    let slugMatch;
    
    while ((slugMatch = slugPattern.exec(content)) !== null) {
      const articleSlug = slugMatch[1];
      const searchStart = Math.max(0, slugMatch.index - 500);
      const searchEnd = Math.min(content.length, slugMatch.index + 5000);
      const block = content.substring(searchStart, searchEnd);
      
      const idMatch = block.match(/id:\s*"([^"]+)"/);
      const titleMatch = block.match(/title:\s*"([^"]+)"/);
      const excerptMatch = block.match(/excerpt:\s*"([^"]+)"/);
      const dateMatch = block.match(/date:\s*"([^"]+)"/);
      const categoryMatch = block.match(/category:\s*"([^"]+)"/);
      const authorMatch = block.match(/author:\s*"([^"]+)"/);
      const tagsMatch = block.match(/tags:\s*\[([^\]]*)\]/);
      
      if (titleMatch && excerptMatch && dateMatch) {
        const tags = tagsMatch 
          ? tagsMatch[1]
              .split(',')
              .map(tag => tag.trim().replace(/"/g, ''))
              .filter(tag => tag)
          : [];
        
        articles.push({
          id: idMatch ? idMatch[1] : articleSlug,
          slug: articleSlug,
          title: titleMatch[1],
          excerpt: excerptMatch[1],
          date: dateMatch[1],
          category: categoryMatch ? categoryMatch[1] : 'Updates',
          author: authorMatch ? authorMatch[1] : 'RosettaScript Team',
          tags: tags
        });
      }
    }
    
    return articles;
  } catch (error) {
    console.warn('Warning: Could not read news.ts:', error.message);
    return [];
  }
}

/**
 * Extract tool metadata from Tools.tsx
 */
function getToolsMetadata() {
  try {
    const content = fs.readFileSync(toolsFile, 'utf-8');
    const tools = [];
    
    // Find the tools array
    const toolsArrayMatch = content.match(/const tools\s*=\s*\[([\s\S]*?)\];/);
    if (!toolsArrayMatch) return [];
    
    const toolsArrayContent = toolsArrayMatch[1];
    
    // Find each tool object by locating id patterns and extracting the complete object
    const idPattern = /id:\s*"([^"]+)"/g;
    let idMatch;
    
    while ((idMatch = idPattern.exec(toolsArrayContent)) !== null) {
      const toolId = idMatch[1];
      const idIndex = idMatch.index;
      
      // Find the start of this object (look backwards for opening brace)
      let objectStart = idIndex;
      while (objectStart > 0 && toolsArrayContent[objectStart] !== '{') {
        objectStart--;
      }
      
      // Find the end of this object (look forwards for closing brace, handling nested braces)
      let objectEnd = idIndex;
      let braceCount = 0;
      let foundOpening = false;
      
      while (objectEnd < toolsArrayContent.length) {
        const char = toolsArrayContent[objectEnd];
        if (char === '{') {
          braceCount++;
          foundOpening = true;
        } else if (char === '}') {
          braceCount--;
          if (foundOpening && braceCount === 0) {
            break;
          }
        }
        objectEnd++;
      }
      
      // Extract the tool object block
      const toolBlock = toolsArrayContent.substring(objectStart, objectEnd + 1);
      
      // Extract properties from this specific tool object
      const titleMatch = toolBlock.match(/title:\s*"([^"]+)"/);
      const descriptionMatch = toolBlock.match(/description:\s*"([^"]+)"/);
      const pathMatch = toolBlock.match(/path:\s*"([^"]+)"/);
      
      if (titleMatch && descriptionMatch && pathMatch) {
        tools.push({
          id: toolId,
          title: titleMatch[1],
          description: descriptionMatch[1],
          path: pathMatch[1]
        });
      }
    }
    
    return tools;
  } catch (error) {
    console.warn('Warning: Could not read Tools.tsx:', error.message);
    return [];
  }
}

/**
 * Generate JSON-LD structured data for a blog post
 */
function generateBlogPostStructuredData(post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "RosettaScript",
      "url": baseUrl
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/blogs/${post.id}`
    },
    "keywords": post.tags.join(", ")
  };
}

/**
 * Generate JSON-LD structured data for a news article
 */
function generateNewsArticleStructuredData(article) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.excerpt,
    "datePublished": article.date,
    "articleSection": article.category,
    "author": {
      "@type": "Organization",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "RosettaScript",
      "url": baseUrl
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/news/${article.slug}`
    },
    "keywords": article.tags.join(", ")
  };
}

/**
 * Generate JSON-LD structured data for a tool page
 */
function generateToolStructuredData(tool) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.title,
    "description": tool.description,
    "url": `${baseUrl}${tool.path}`,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "provider": {
      "@type": "Organization",
      "name": "RosettaScript",
      "url": baseUrl
    }
  };
}

/**
 * Generate JSON-LD structured data for main pages
 */
function generatePageStructuredData(route, metadata) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": metadata.title,
    "description": metadata.description,
    "url": `${baseUrl}${route}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "RosettaScript",
      "url": baseUrl
    }
  };
}

/**
 * Inject meta tags and structured data into HTML
 */
function injectMetaTags(html, metadata, route, structuredData = null) {
  const siteName = "RosettaScript";
  const fullTitle = metadata.title === "Home" || route === "/"
    ? `${metadata.title} | ${siteName}`
    : `${metadata.title} | ${siteName}`;
  
  // Escape HTML in metadata
  const escapeHtml = (str) => str.replace(/"/g, '&quot;').replace(/&/g, '&amp;');
  
  // Create canonical URL - add trailing slash for all directory routes (all routes except root)
  // All routes create directories with index.html, so they should all have trailing slashes
  let canonicalUrl = `${baseUrl}${route}`;
  if (route !== '/') {
    canonicalUrl = `${baseUrl}${route}/`;
  }
  
  // Remove any existing meta tags and canonical link to avoid duplicates
  html = html.replace(/<link[^>]*rel=["']canonical["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+property=["']og:url["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+name=["']twitter:title["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+name=["']twitter:description["'][^>]*>/gi, '');
  
  // Create meta tags HTML
  const metaTags = `
    <meta name="description" content="${escapeHtml(metadata.description)}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(fullTitle)}" />
    <meta property="og:description" content="${escapeHtml(metadata.description)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta name="twitter:title" content="${escapeHtml(fullTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(metadata.description)}" />
  `;
  
  // Update or add meta tags after the viewport tag
  html = html.replace(
    /(<meta name="viewport"[^>]*>)/,
    `$1${metaTags}`
  );
  
  // Update title tag
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(fullTitle)}</title>`
  );
  
  // Add JSON-LD structured data before closing head tag
  if (structuredData) {
    const jsonLd = `
    <script type="application/ld+json">
${JSON.stringify(structuredData, null, 2)}
    </script>
    `;
    html = html.replace('</head>', `${jsonLd}</head>`);
  }
  
  return html;
}

/**
 * Pre-render blog post content for bots
 */
function preRenderBlogPostContent(post) {
  return `
    <noscript>
      <article style="padding: 2rem; max-width: 900px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif; line-height: 1.8;">
        <header style="margin-bottom: 2rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 1rem;">
          <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: #111827;">${post.title.replace(/"/g, '&quot;')}</h1>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; color: #6b7280; font-size: 0.9rem;">
            <span>Author: ${post.author}</span>
            <span>Published: ${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            ${post.tags.length > 0 ? `<span>Tags: ${post.tags.join(', ')}</span>` : ''}
          </div>
        </header>
        <div style="font-size: 1.125rem; color: #374151; margin-bottom: 2rem;">
          <p style="font-weight: 500; margin-bottom: 1rem;">${post.excerpt.replace(/"/g, '&quot;')}</p>
          <p style="color: #6b7280;">This article contains detailed information about ${post.title.toLowerCase().replace(/"/g, '&quot;')}. Please enable JavaScript to view the full article content.</p>
        </div>
        <nav style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
          <a href="/blogs" style="color: #22c55e; text-decoration: none;">← Back to Blog</a> | 
          <a href="/" style="color: #22c55e; text-decoration: none;">Home</a>
        </nav>
      </article>
    </noscript>
  `;
}

/**
 * Pre-render tool content for bots
 */
function preRenderToolContent(tool) {
  const escapeHtml = (str) => str.replace(/"/g, '&quot;');
  return `
    <noscript>
      <main style="padding: 2rem; max-width: 900px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif; line-height: 1.8;">
        <header style="margin-bottom: 2rem;">
          <h1 style="font-size: 2rem; margin-bottom: 1rem; color: #111827;">${escapeHtml(tool.title)}</h1>
          <p style="font-size: 1.125rem; color: #374151; margin-bottom: 1rem;">${escapeHtml(tool.description)}</p>
        </header>
        <div style="background: #f3f4f6; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
          <p style="color: #6b7280; margin: 0;">This is an interactive tool. Please enable JavaScript to use ${escapeHtml(tool.title.toLowerCase())}.</p>
        </div>
        <nav style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
          <a href="/tools" style="color: #22c55e; text-decoration: none;">← Back to Tools</a> | 
          <a href="/" style="color: #22c55e; text-decoration: none;">Home</a>
        </nav>
      </main>
    </noscript>
  `;
}

/**
 * Pre-render news article content for bots
 */
function preRenderNewsArticleContent(article) {
  const escapeHtml = (str) => str.replace(/"/g, '&quot;');
  return `
    <noscript>
      <article style="padding: 2rem; max-width: 900px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif; line-height: 1.8;">
        <header style="margin-bottom: 2rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 1rem;">
          <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: #111827;">${escapeHtml(article.title)}</h1>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; color: #6b7280; font-size: 0.9rem;">
            <span>Category: ${escapeHtml(article.category)}</span>
            <span>Published: ${new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            ${article.tags.length > 0 ? `<span>Tags: ${article.tags.join(', ')}</span>` : ''}
          </div>
        </header>
        <div style="font-size: 1.125rem; color: #374151; margin-bottom: 2rem;">
          <p style="font-weight: 500; margin-bottom: 1rem;">${escapeHtml(article.excerpt)}</p>
          <p style="color: #6b7280;">This news article contains detailed information about ${escapeHtml(article.title.toLowerCase())}. Please enable JavaScript to view the full article content.</p>
        </div>
        <nav style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
          <a href="/news" style="color: #22c55e; text-decoration: none;">← Back to News</a> | 
          <a href="/" style="color: #22c55e; text-decoration: none;">Home</a>
        </nav>
      </article>
    </noscript>
  `;
}

export { 
  getBlogPosts,
  getNewsArticles,
  getToolsMetadata, 
  generateBlogPostStructuredData,
  generateNewsArticleStructuredData,
  generateToolStructuredData,
  generatePageStructuredData,
  injectMetaTags,
  preRenderBlogPostContent,
  preRenderNewsArticleContent,
  preRenderToolContent,
  baseUrl
};
