import { Layout } from "@/components/layout/Layout";
import { JsonExtractorTool } from "@/components/tools/JsonExtractorTool";
import { Code2, Search, Home } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SEO } from "@/components/SEO";
import { UpdateNotification } from "@/components/UpdateNotification";

export default function JsonExtractor() {
  return (
    <Layout>
      <SEO
        title="JSON Data Extractor - Extract from JSON"
        description="Extract specific data from JSON structures instantly. Get field values, use path syntax, or extract array values. Free online JSON data extractor. Perfect for parsing API responses."
        canonical="https://rosettascript.github.io/tools/json-extractor/"
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
              <BreadcrumbPage>JSON Data Extractor</BreadcrumbPage>
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
            JSON Data Extractor
          </h1>
          <p className="text-muted-foreground max-w-[1920px] mx-auto mb-4">
            Extract specific data from JSON structures instantly with this free online JSON data extractor. Get field values, use path syntax, or extract all values from arrays. Perfect for parsing API responses, processing nested JSON data, and data analysis.
          </p>
          <p className="text-muted-foreground max-w-[1920px] mx-auto">
            Essential for developers working with APIs, data analysts extracting specific fields from large JSON datasets, and anyone processing structured data. Use simple field names or advanced path syntax to extract exactly what you need from complex JSON structures—all processing happens instantly in your browser.
          </p>
        </div>

        {/* Tool */}
        <div className="terminal-bg p-6 lg:p-8">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-border">
            <div className="w-3 h-3 rounded-full bg-destructive/80" />
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--syntax-yellow))]/80" />
            <div className="w-3 h-3 rounded-full bg-primary/80" />
            <span className="ml-2 text-sm text-muted-foreground font-mono flex items-center gap-2">
              <Search className="h-4 w-4" />
              extractor.ts
            </span>
          </div>
          <JsonExtractorTool />
        </div>
      </div>
    </Layout>
  );
}

