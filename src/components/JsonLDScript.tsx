import { Organization, FAQ, Website, BreadcrumbList } from "lucide-react";

const faqData = [
  {
    question: "Are these developer tools free?",
    answer: "Yes, all developer tools on RosettaScript are completely free to use. No signup required, no hidden fees."
  },
  {
    question: "Is my data secure when using these tools?",
    answer: "Absolutely. All processing happens locally in your browser. Your data never leaves your device and is not stored on any server."
  },
  {
    question: "What tools are available?",
    answer: "We offer 20+ developer tools including JSON formatter, Word to HTML converter, Base64 encoder/decoder, URL encoder, hash generator, regex tester, UUID generator, QR code generator, and many more."
  },
  {
    question: "Do I need to install anything?",
    answer: "No installation required. All tools run directly in your web browser. Just visit the website and start using them instantly."
  },
  {
    question: "Can I use these tools for commercial projects?",
    answer: "Yes! RosettaScript tools are free to use for both personal and commercial projects. They're also open source."
  }
];

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "RosettaScript",
  "url": "https://rosettascript.github.io",
  "logo": "https://rosettascript.github.io/icon-512.png",
  "description": "Free online developer tools for text, code, and document conversion. No signup required.",
  "sameAs": [
    "https://github.com/rosettascript/rosettascript.github.io"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "rosettascript@gmail.com",
    "contactType": "technical support"
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "RosettaScript Developer Tools",
  "url": "https://rosettascript.github.io",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://rosettascript.github.io/tools?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqData.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://rosettascript.github.io/"
    }
  ]
};

export function JsonLDScript() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
