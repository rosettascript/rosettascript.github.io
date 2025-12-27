import { Layout } from "@/components/layout/Layout";
import { HashDecoderTool } from "@/components/tools/HashDecoderTool";
import { SEO } from "@/components/SEO";
import { Code2, Hash, Home, Search } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function HashDecoder() {
  return (
    <Layout>
      <SEO
        title="Hash Decoder/Verifier - Verify SHA Hash Values Online"
        description="Verify if text matches a hash value. Check SHA-1, SHA-256, SHA-384, and SHA-512 hashes. Free online hash verification tool."
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
              <BreadcrumbPage>Hash Decoder</BreadcrumbPage>
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
            Hash Decoder/Verifier
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Verify if your text produces the given hash value. Supports SHA-1, SHA-256, SHA-384, and SHA-512 algorithms.
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
              hash.verify
            </span>
          </div>
          <HashDecoderTool />
        </div>
      </div>
    </Layout>
  );
}

