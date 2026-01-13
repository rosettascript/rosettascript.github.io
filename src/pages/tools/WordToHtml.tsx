import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { WordToHtmlConverter } from "@/components/tools/WordToHtmlConverter";
import { UpdateNotification } from "@/components/UpdateNotification";
import { Code2, FileText, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function WordToHtml() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus the container on mount, which will help establish focus context
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);
  return (
    <Layout>
      <SEO
        title="Word to HTML Converter - Clean HTML Online"
        description="Convert Word documents to clean, semantic HTML code. Free online Word to HTML converter with blog and shoppable modes. No signup required."
        canonical="https://rosettascript.github.io/tools/word-to-html/"
        structuredData={{
          type: "SoftwareApplication",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web Browser",
          offers: {
            price: "0",
            priceCurrency: "USD",
          },
        }}
      />
      <div className="container mx-auto px-4 py-12">
        {/* Update Notification */}
        <UpdateNotification />
        
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/tools">Tools</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Word to HTML</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-mono mb-4">
            <Code2 className="h-4 w-4" />
            Online Tools
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Word to HTML Converter
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
            Convert Word documents to clean, semantic HTML code instantly. This free online Word to HTML converter transforms messy Word-generated markup into SEO-friendly, well-structured HTML that works perfectly for web content, blogs, and e-commerce sites.
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you're a content editor preparing articles for publication, an SEO specialist optimizing web content, or a web developer cleaning up client documents, this tool helps you convert Word content to professional HTML without the bloat. Simply paste from Microsoft Word and get properly formatted HTML with advanced features for regular content, blog posts, and shoppable product descriptions.
          </p>
        </div>
      </div>

      {/* Converter Tool - Full Width */}
      <div className="w-full mb-12 px-4 lg:px-8 xl:px-12 -mt-[30px]">
        <div 
          ref={containerRef}
          tabIndex={-1}
          className="terminal-bg p-4 md:p-6 lg:p-8 max-w-[1920px] w-full max-w-full mx-auto outline-none"
        >
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-border">
            <div className="w-3 h-3 rounded-full bg-destructive/80" />
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--syntax-yellow))]/80" />
            <div className="w-3 h-3 rounded-full bg-primary/80" />
            <span className="ml-2 text-sm text-muted-foreground font-mono flex items-center gap-2">
              <FileText className="h-4 w-4" />
              converter.html
            </span>
          </div>
          <WordToHtmlConverter />
        </div>
      </div>

      {/* Format Info */}
      <div className="container mx-auto px-4 mb-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-card/50 rounded-lg border border-border">
            <h3 className="font-semibold mb-2 text-primary">Regular Output</h3>
            <p className="text-sm text-muted-foreground">
              Clean, semantic HTML with proper heading hierarchy and paragraph tags. 
              Perfect for general web content.
            </p>
          </div>
          <div className="p-6 bg-card/50 rounded-lg border border-border">
            <h3 className="font-semibold mb-2 text-secondary">Blogs Output</h3>
            <p className="text-sm text-muted-foreground">
              Advanced blog formatting with heading strong tags, key takeaways processing, 
              link attributes, spacing rules, and more. Customize features to match your needs.
            </p>
          </div>
          <div className="p-6 bg-card/50 rounded-lg border border-border">
            <h3 className="font-semibold mb-2 text-accent">Shoppables Output</h3>
            <p className="text-sm text-muted-foreground">
              E-commerce optimized HTML with heading formatting, link attributes, 
              and source normalization. Perfect for product content conversion.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
