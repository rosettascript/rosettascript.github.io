import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  article?: {
    publishedTime?: string;
    author?: string;
    tags?: string[];
  };
}

export function SEO({
  title,
  description,
  canonical,
  ogImage = "/og-image.png",
  ogType = "website",
  article,
}: SEOProps) {
  const siteName = "RosettaScript";
  const fullTitle = title === "Home" ? siteName : `${title} | ${siteName}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper to update or create meta tag
    const setMetaTag = (
      attribute: "name" | "property",
      key: string,
      content: string
    ) => {
      let element = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Basic meta tags
    setMetaTag("name", "description", description);
    setMetaTag("name", "robots", "index, follow");

    // Open Graph tags
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:site_name", siteName);
    if (ogImage) setMetaTag("property", "og:image", ogImage);
    if (canonical) setMetaTag("property", "og:url", canonical);

    // Twitter Card tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("name", "twitter:description", description);
    if (ogImage) setMetaTag("name", "twitter:image", ogImage);

    // Article-specific meta tags
    if (ogType === "article" && article) {
      if (article.publishedTime) {
        setMetaTag("property", "article:published_time", article.publishedTime);
      }
      if (article.author) {
        setMetaTag("property", "article:author", article.author);
      }
    }

    // Canonical link
    let canonicalLink = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement;
    if (canonical) {
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.rel = "canonical";
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = canonical;
    }

    // Cleanup function
    return () => {
      document.title = siteName;
    };
  }, [fullTitle, description, canonical, ogImage, ogType, article]);

  return null;
}
