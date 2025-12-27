import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ImageTool } from "@/components/tools/ImageTool";
import { Code2, Image as ImageIcon, Home } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ImageToolPage() {
  return (
    <Layout>
      <SEO
        title="Image Tool - Compress, Convert, Resize & Generate Favicons"
        description="Free online image tool. Compress images, convert formats (PNG, JPEG, WebP), resize images, and generate favicons. All processing happens in your browser - no server uploads."
      />
      <div className="container mx-auto px-4 py-12">
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
              <BreadcrumbPage>Image Tool</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent-foreground text-sm font-mono mb-4">
            <Code2 className="h-4 w-4" />
            Online Tools
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Image Tool
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compress, convert, resize images and generate favicons. All processing happens in your browser - your images never leave your device.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <ImageTool />
        </div>
      </div>
    </Layout>
  );
}

