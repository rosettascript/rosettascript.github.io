import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import Index from "./pages/Index";
import Tools from "./pages/Tools";
import WordToHtml from "./pages/tools/WordToHtml";
import JsonFormatter from "./pages/tools/JsonFormatter";
import Base64 from "./pages/tools/Base64";
import UrlEncoder from "./pages/tools/UrlEncoder";
import ColorConverter from "./pages/tools/ColorConverter";
import UuidGenerator from "./pages/tools/UuidGenerator";
import RegexTester from "./pages/tools/RegexTester";
import HashGenerator from "./pages/tools/HashGenerator";
import HashDecoder from "./pages/tools/HashDecoder";
import JwtDecoder from "./pages/tools/JwtDecoder";
import JwtEncoder from "./pages/tools/JwtEncoder";
import TimestampConverter from "./pages/tools/TimestampConverter";
import WebScraper from "./pages/tools/WebScraper";
import JsonExtractor from "./pages/tools/JsonExtractor";
import QrCodeGenerator from "./pages/tools/QrCodeGenerator";
import TextDiff from "./pages/tools/TextDiff";
import CsvToJson from "./pages/tools/CsvToJson";
import ImageTool from "./pages/tools/ImageTool";
import RandomUniverseCipher from "./pages/tools/RandomUniverseCipher";
import Downloads from "./pages/Downloads";
import Blogs from "./pages/Blogs";
import BlogPost from "./pages/BlogPost";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import SchoolProjects from "./pages/SchoolProjects";
import About from "./pages/About";
import Issues from "./pages/Issues";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle GitHub Pages 404.html redirect pattern
const RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle GitHub Pages SPA redirect pattern from 404.html
    // The 404.html redirects to /?/path, we need to extract and navigate to /path
    if (location.search && location.search.startsWith('?/')) {
      // Extract the path from the query string (format: ?/path&other=params)
      const search = location.search.slice(2); // Remove the '?/'
      // Split by & to separate path from query params, then decode ~and~ back to &
      let path = search.split('&')[0].replace(/~and~/g, '&');
      
      // Ensure path starts with /
      if (path && !path.startsWith('/')) {
        path = '/' + path;
      }
      
      // Only redirect if we have a valid path
      if (path) {
        // Preserve hash if present
        const hash = location.hash || '';
        // Remove the query parameter and navigate to the actual path
        const newPath = path + hash;
        window.history.replaceState(null, '', newPath);
        navigate(path, { replace: true });
      }
    }
  }, [location, navigate]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <RedirectHandler />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/word-to-html" element={<WordToHtml />} />
            <Route path="/tools/json-formatter" element={<JsonFormatter />} />
            <Route path="/tools/base64" element={<Base64 />} />
            <Route path="/tools/url-encoder" element={<UrlEncoder />} />
            <Route path="/tools/color-converter" element={<ColorConverter />} />
            <Route path="/tools/uuid-generator" element={<UuidGenerator />} />
            <Route path="/tools/regex-tester" element={<RegexTester />} />
            <Route path="/tools/hash-generator" element={<HashGenerator />} />
            <Route path="/tools/hash-decoder" element={<HashDecoder />} />
            <Route path="/tools/jwt-decoder" element={<JwtDecoder />} />
            <Route path="/tools/jwt-encoder" element={<JwtEncoder />} />
            <Route path="/tools/timestamp-converter" element={<TimestampConverter />} />
            <Route path="/tools/web-scraper" element={<WebScraper />} />
            <Route path="/tools/json-extractor" element={<JsonExtractor />} />
            <Route path="/tools/qr-code-generator" element={<QrCodeGenerator />} />
            <Route path="/tools/text-diff" element={<TextDiff />} />
            <Route path="/tools/csv-to-json" element={<CsvToJson />} />
            <Route path="/tools/image-tool" element={<ImageTool />} />
            <Route path="/tools/random-universe-cipher" element={<RandomUniverseCipher />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogPost />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<NewsArticle />} />
            <Route path="/school-projects" element={<SchoolProjects />} />
            <Route path="/about" element={<About />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
