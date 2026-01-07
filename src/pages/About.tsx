import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Terminal, Target, Heart, Zap, Mail, Github } from "lucide-react";
import { XIcon } from "@/components/icons/XIcon";
import { toast } from "@/hooks/use-toast";

const values = [
  {
    icon: Zap,
    title: "Simplicity",
    description: "I believe developer tools should be simple and intuitive. No steep learning curves, just solutions that work.",
    color: "text-primary",
  },
  {
    icon: Target,
    title: "Efficiency",
    description: "Every tool I build is designed to save you time. Focus on building, not configuring.",
    color: "text-secondary",
  },
  {
    icon: Heart,
    title: "Community",
    description: "I'm a developer helping developers. All my tools are free to use and many are open source.",
    color: "text-accent",
  },
];

const stats = [
  { value: "10K+", label: "Downloads" },
  { value: "19+", label: "Tools & Scripts" },
  { value: "5K+", label: "Happy Developers" },
  { value: "100%", label: "Free to Use" },
];

export default function About() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out. I'll get back to you soon.",
    });
  };

  return (
    <Layout>
      <SEO
        title="About RosettaScript"
        description="Learn more about RosettaScript and my mission. Developer tools made simple, built by a developer for developers. Free, open-source, and community-driven."
        canonical="https://rosettascript.github.io/about/"
        structuredData={{
          type: "WebPage",
        }}
      />
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-mono mb-4">
            <Terminal className="h-4 w-4" />
            About RosettaScript
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Developer Tools Made Simple
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            RosettaScript was born from a simple idea: developers shouldn't waste time on repetitive 
            tasks. I build tools that let you focus on what matters—creating amazing software.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-6 bg-card/50 rounded-lg border border-border">
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="terminal-bg p-8 mb-16">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-border">
            <div className="w-3 h-3 rounded-full bg-destructive/80" />
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--syntax-yellow))]/80" />
            <div className="w-3 h-3 rounded-full bg-primary/80" />
            <span className="ml-2 text-sm text-muted-foreground font-mono">mission.md</span>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">My Mission</h2>
            <p className="text-muted-foreground">
              I'm on a mission to democratize developer tools. Whether you're a student working on 
              your first project or a seasoned developer automating workflows, RosettaScript provides 
              the tools you need—completely free.
            </p>
            <p className="text-muted-foreground">
              My tools range from simple converters and formatters to advanced encryption and data processing 
              utilities, all designed with the same philosophy: powerful functionality with a clean, intuitive interface.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">What I Stand For</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="bg-card/50 border-border">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center mb-4 ${value.color}`}>
                    <value.icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                  <CardDescription>{value.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              Have questions, suggestions, or just want to say hi? I'd love to hear from you.
            </p>
            <div className="space-y-4">
              <a href="mailto:rosettascript@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
                rosettascript@gmail.com
              </a>
              <a href="https://github.com/rosettascript" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                github.com/rosettascript
              </a>
              <a href="https://x.com/rosettascript" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <XIcon size={20} className="h-5 w-5" />
                @rosettascript
              </a>
            </div>
          </div>

          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle>Send me a Message</CardTitle>
              <CardDescription>Fill out the form and I'll get back to you</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Your name" className="bg-background" />
                  <Input type="email" placeholder="Your email" className="bg-background" />
                </div>
                <Input placeholder="Subject" className="bg-background" />
                <Textarea placeholder="Your message..." className="bg-background min-h-[120px]" />
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
