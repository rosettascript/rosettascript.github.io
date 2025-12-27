import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Terminal, 
  Code2, 
  Download, 
  BookOpen, 
  GraduationCap, 
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Newspaper,
  Calendar
} from "lucide-react";
import { getLatestNews, formatNewsDate } from "@/data/news";

const features = [
  {
    icon: Code2,
    title: "Online Tools",
    description: "Access 20+ powerful developer tools completely free. Format JSON, convert Word to HTML, encode/decode Base64, generate UUIDs and hashes, test regex patterns, scrape websites, and much more. All tools run directly in your browser with no sign-up required.",
    link: "/tools",
    color: "text-primary",
  },
  {
    icon: Download,
    title: "Downloads",
    description: "Download ready-to-use scripts and utilities for your development workflow. Get Windows automation scripts, PERN stack setup templates, PostgreSQL database managers, and other time-saving tools. Everything is free and open source.",
    link: "/downloads",
    color: "text-secondary",
  },
  {
    icon: BookOpen,
    title: "Blog",
    description: "Learn from comprehensive tutorials, tips, and developer guides. Discover how to build modern applications, implement encryption, scrape websites effectively, and optimize your development process. New articles published regularly.",
    link: "/blogs",
    color: "text-accent",
  },
  {
    icon: GraduationCap,
    title: "School Projects",
    description: "Find ready-to-use project templates perfect for students and educators. Get started quickly with pre-configured project structures, documentation, and examples. Perfect for assignments, capstone projects, and learning new technologies.",
    link: "/school-projects",
    color: "text-[hsl(var(--syntax-orange))]",
  },
];

const highlights = [
  {
    icon: Zap,
    title: "Fast & Efficient",
    description: "Optimized tools that save you hours of work",
  },
  {
    icon: Shield,
    title: "No Account Needed",
    description: "Use all tools instantly without signing up",
  },
  {
    icon: Sparkles,
    title: "Developer Focused",
    description: "Built by developers, for developers",
  },
];

const codeSnippet = `// Welcome to RosettaScript
const tools = {
  formatters: ["JSON", "Code", "Text"],
  converters: ["Word → HTML", "Base64", "URL", "Color"],
  generators: ["UUID", "Hash", "QR Code", "Timestamp"],
  utilities: ["Regex Tester", "Image Tool", "Web Scraper"],
  downloads: ["Windows Scripts", "PERN Setup", "PSQL Manager"]
};

export default tools;`;

export default function Index() {
  return (
    <Layout>
      <SEO
        title="Home"
        description="RosettaScript provides powerful developer tools to convert, automate, and build. From Word to HTML converters to database visualization—we've got you covered."
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
        <div className="container mx-auto px-4 py-12 lg:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-mono">
                <Terminal className="h-4 w-4" />
                Developer Tools Made Simple
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Code Smarter,{" "}
                <span className="text-gradient">Build Faster</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg w-full">
                RosettaScript provides a comprehensive suite of developer tools. 
                From code formatters and converters to hash generators, image tools, and downloadable utilities—everything you need to boost your productivity.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                <Button asChild size="lg" className="glow-primary w-full sm:w-auto">
                  <Link to="/tools">
                    Try Online Tools
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link to="/downloads">
                    <Download className="mr-2 h-4 w-4" />
                    Download Tools
                  </Link>
                </Button>
              </div>
            </div>

            {/* Code Preview */}
            <div className="terminal-bg p-1 w-full max-w-full overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-destructive/80" />
                <div className="w-3 h-3 rounded-full bg-[hsl(var(--syntax-yellow))]/80" />
                <div className="w-3 h-3 rounded-full bg-primary/80" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">tools.ts</span>
              </div>
              <pre className="p-4 overflow-auto max-w-full">
                <code className="text-sm font-mono block min-w-0">
                  {codeSnippet.split("\n").map((line, i) => (
                    <div key={i} className="flex min-w-0">
                      <span className="w-8 flex-shrink-0 text-muted-foreground select-none">{i + 1}</span>
                      <span className={`flex-1 min-w-0 break-words ${
                        line.startsWith("//") ? "text-muted-foreground" :
                        line.includes("const") ? "text-secondary" :
                        line.includes(":") ? "text-[hsl(var(--syntax-orange))]" :
                        line.includes("export") ? "text-accent" :
                        "text-foreground"
                      }`}>
                        {line}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-card/30 w-full">
        <div className="container mx-auto px-4 w-full">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-4">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3">Everything You Need</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Explore our collection of online tools, downloadable utilities, educational resources, and developer guides
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <Link key={feature.title} to={feature.link}>
                    <Card className="h-full bg-card/50 border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 group flex flex-col min-h-[280px]">
                      <CardHeader className="pb-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                          <feature.icon className={`h-6 w-6 ${feature.color} group-hover:scale-110 transition-transform`} />
                        </div>
                        <CardTitle className="text-xl font-bold mb-2 leading-tight">{feature.title}</CardTitle>
                        <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 mt-auto">
                        <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                          <span>Explore</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* News Sidebar */}
            {getLatestNews(2).length > 0 && (
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono mb-2">
                      <Newspaper className="h-3 w-3" />
                      Latest News
                    </div>
                    <h2 className="text-xl font-bold mb-2">Stay Updated</h2>
                    <p className="text-xs text-muted-foreground mb-4">
                      Latest updates and announcements
                    </p>
                  </div>

                  <div className="space-y-3">
                    {getLatestNews(2).map((article, index) => (
                      <Link key={article.id} to={`/news/${article.slug}`} className="block">
                        <Card 
                          className="bg-card/50 border-border hover:border-primary/30 transition-all group overflow-hidden"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                          <CardHeader className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {article.category}
                              </Badge>
                            </div>
                            <CardTitle className="text-sm line-clamp-2 group-hover:text-primary transition-colors">
                              {article.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 text-xs">
                              {article.excerpt}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span className="text-[10px]">{formatNewsDate(article.date)}</span>
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Button asChild variant="outline" size="sm" className="w-full text-xs">
                      <Link to="/news">
                        View All News
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((highlight) => (
              <Card 
                key={highlight.title} 
                className="text-center p-5 bg-card/50 border-border hover:border-primary/30 transition-all group"
              >
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <highlight.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mt-3">{highlight.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{highlight.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Explore our 20+ online tools, download utilities, read our blog, or check out school project templates.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/tools">
                Browse All Tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link to="/blogs">
                Read Blog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
