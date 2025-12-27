import { Layout } from "@/components/layout/Layout";
import { QrCodeGeneratorTool } from "@/components/tools/QrCodeGeneratorTool";
import { Code2, QrCode, Home } from "lucide-react";
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

export default function QrCodeGenerator() {
  return (
    <Layout>
      <SEO
        title="QR Code Generator"
        description="Generate QR codes for WiFi, email, SMS, phone, contacts, events, files, and more. Customizable size, downloadable PNG format. Free online QR code generator."
      />
      <div className="container mx-auto px-4 py-12">
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
              <BreadcrumbPage>QR Code Generator</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-mono mb-4">
            <Code2 className="h-4 w-4" />
            Online Tools
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            QR Code Generator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate QR codes for WiFi, email, SMS, phone, contacts, events, files, and more. Customize the size and download as PNG.
          </p>
        </div>

        <div className="terminal-bg p-6 lg:p-8">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-border">
            <div className="w-3 h-3 rounded-full bg-destructive/80" />
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--syntax-yellow))]/80" />
            <div className="w-3 h-3 rounded-full bg-primary/80" />
            <span className="ml-2 text-sm text-muted-foreground font-mono flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              qrcode.ts
            </span>
          </div>
          <QrCodeGeneratorTool />
        </div>
      </div>
    </Layout>
  );
}

