import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ImageTool } from "@/components/tools/ImageTool";
import { UpdateNotification } from "@/components/UpdateNotification";
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
        title="Image Tool - Compress, Convert, Resize"
        description="Free online image tool. Compress images, convert formats (PNG, JPEG, WebP), resize images, and generate favicons instantly. All processing happens in your browser - complete privacy."
        canonical="https://rosettascript.github.io/tools/image-tool/"
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
          <p className="text-muted-foreground max-w-[1920px] mx-auto mb-4">
            Compress, convert, resize images, and generate favicons instantly with this free online image tool. All processing happens entirely in your browser—your images never leave your device, ensuring complete privacy and security.
          </p>
          <p className="text-muted-foreground max-w-[1920px] mx-auto">
            Perfect for web developers optimizing images for faster load times, designers converting between formats, and anyone working with image files. Compress images to reduce file size, convert between PNG, JPEG, and WebP formats, resize images to specific dimensions, and generate favicons for websites. All without uploading to any server.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <ImageTool />
        </div>
      </div>
    </Layout>
  );
}

